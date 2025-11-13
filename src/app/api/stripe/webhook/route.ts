// Force Node.js runtime for Stripe webhooks
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { getTierFromPriceId } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret) as Stripe.Event;
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) {
          console.error('Missing userId or subscriptionId in checkout session', {
            userId,
            subscriptionId,
            metadata: session.metadata,
          });
          break;
        }

        // Retrieve the subscription from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
        const priceId = stripeSubscription.items.data[0]?.price.id;
        const tier = getTierFromPriceId(priceId || '');

        console.log('Processing checkout.session.completed:', {
          userId,
          subscriptionId,
          priceId,
          tier,
          status: stripeSubscription.status,
          customerId: typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer.id,
        });

        // Import User model to ensure userId is correct format
        const User = (await import('@/models/User')).default;
        const userDoc = await User.findById(userId);
        if (!userDoc) {
          console.error(`User not found for userId: ${userId}`);
          break;
        }
        console.log('Found user:', { userId: userDoc._id.toString(), email: userDoc.email });

        // Update or create subscription in database
        // Use userDoc._id to ensure correct ObjectId format
        // Safely convert Unix timestamps to Date objects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodStart = (stripeSubscription as any).current_period_start;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodEnd = (stripeSubscription as any).current_period_end;
        const currentPeriodStart = periodStart 
          ? new Date(periodStart * 1000)
          : new Date();
        const currentPeriodEnd = periodEnd
          ? new Date(periodEnd * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now
        const trialEnd = stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : undefined;

        console.log('Date conversions:', {
          currentPeriodStart: currentPeriodStart.toISOString(),
          currentPeriodEnd: currentPeriodEnd.toISOString(),
          trialEnd: trialEnd?.toISOString(),
        });

        const updatedSubscription = await Subscription.findOneAndUpdate(
          { userId: userDoc._id },
          {
            tier,
            status: stripeSubscription.status === 'active' ? 'active' : 'trialing',
            stripeCustomerId: typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer.id,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            trialEnd,
          },
          { upsert: true, new: true }
        );

        // Update user's subscription reference
        if (updatedSubscription) {
          await User.findByIdAndUpdate(userDoc._id, {
            subscriptionId: updatedSubscription._id,
          });
          console.log(`✅ Subscription created/updated for user ${userId}`, {
            subscriptionId: updatedSubscription._id,
            tier: updatedSubscription.tier,
            status: updatedSubscription.status,
            userId: userDoc._id.toString(),
          });
        } else {
          console.error(`❌ Failed to create/update subscription for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const customerId = typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer.id;

        // Find subscription by Stripe customer ID
        const subscriptionDoc = await Subscription.findOne({
          stripeCustomerId: customerId,
        });

        if (!subscriptionDoc) {
          console.error(`Subscription not found for customer ${customerId}`);
          break;
        }

        const priceId = stripeSubscription.items.data[0]?.price.id;
        const tier = getTierFromPriceId(priceId || '');

        // Safely convert Unix timestamps to Date objects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodStart = (stripeSubscription as any).current_period_start;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodEnd = (stripeSubscription as any).current_period_end;
        const currentPeriodStart = periodStart 
          ? new Date(periodStart * 1000)
          : new Date();
        const currentPeriodEnd = periodEnd
          ? new Date(periodEnd * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const trialEnd = stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : undefined;

        // Update subscription
        await Subscription.findByIdAndUpdate(subscriptionDoc._id, {
          tier,
          status:
            stripeSubscription.status === 'active'
              ? 'active'
              : stripeSubscription.status === 'trialing'
              ? 'trialing'
              : stripeSubscription.status === 'past_due'
              ? 'past_due'
              : 'canceled',
          stripePriceId: priceId,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          trialEnd,
        });

        console.log(`Subscription updated for customer ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;

        // Find and update subscription
        const subscriptionDoc = await Subscription.findOne({
          stripeCustomerId: customerId,
        });

        if (subscriptionDoc) {
          await Subscription.findByIdAndUpdate(subscriptionDoc._id, {
            status: 'canceled',
            cancelAtPeriodEnd: false,
          });
          console.log(`Subscription canceled for customer ${customerId}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.customer) {
          console.error('Invoice has no customer');
          break;
        }
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscriptionId = (invoice as any).subscription ? (typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : (invoice as any).subscription.id) : null;

        // Update subscription period if needed
        const subscriptionDoc = await Subscription.findOne({
          stripeCustomerId: customerId,
        });

        if (subscriptionDoc && subscriptionId) {
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

          // Safely convert Unix timestamps to Date objects
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const periodStart = (stripeSubscription as any).current_period_start;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const periodEnd = (stripeSubscription as any).current_period_end;
          const currentPeriodStart = periodStart 
            ? new Date(periodStart * 1000)
            : new Date();
          const currentPeriodEnd = periodEnd
            ? new Date(periodEnd * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await Subscription.findByIdAndUpdate(subscriptionDoc._id, {
            status: 'active',
            currentPeriodStart,
            currentPeriodEnd,
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.customer) {
          console.error('Invoice has no customer');
          break;
        }
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id;

        const subscriptionDoc = await Subscription.findOne({
          stripeCustomerId: customerId,
        });

        if (subscriptionDoc) {
          await Subscription.findByIdAndUpdate(subscriptionDoc._id, {
            status: 'past_due',
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

