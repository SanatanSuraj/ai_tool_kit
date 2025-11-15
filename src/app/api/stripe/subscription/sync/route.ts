import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { stripe, getTierFromPriceId } from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * User-facing endpoint to sync subscription from Stripe
 * This endpoint allows the current user to manually sync their subscription
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get current subscription from database
    const dbSubscription = await Subscription.findOne({ userId: user._id });

    // If user has Stripe customer ID, fetch from Stripe
    if (dbSubscription?.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(dbSubscription.stripeCustomerId) as Stripe.Customer;
        
        if (customer.deleted) {
          return NextResponse.json(
            { error: 'Customer deleted in Stripe' },
            { status: 400 }
          );
        }

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'all',
          limit: 10,
        });

        // Find the most recent active subscription
        const activeSubscription = subscriptions.data.find(
          (sub) => sub.status === 'active' || sub.status === 'trialing'
        ) || subscriptions.data[0];

        if (activeSubscription) {
          const priceId = activeSubscription.items.data[0]?.price.id;
          const tier = getTierFromPriceId(priceId || '');
          const periodStart = (activeSubscription as any).current_period_start;
          const periodEnd = (activeSubscription as any).current_period_end;

          // Sync subscription
          const updatedSubscription = await Subscription.findOneAndUpdate(
            { userId: user._id },
            {
              tier,
              status: activeSubscription.status === 'active' ? 'active' : 'trialing',
              stripeCustomerId: customer.id,
              stripeSubscriptionId: activeSubscription.id,
              stripePriceId: priceId,
              currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
              trialEnd: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000) : undefined,
            },
            { upsert: true, new: true }
          );

          // Update user's subscription reference
          await User.findByIdAndUpdate(user._id, {
            subscriptionId: updatedSubscription._id,
          });

          return NextResponse.json({
            success: true,
            message: 'Subscription synced successfully',
            subscription: {
              tier: updatedSubscription.tier,
              status: updatedSubscription.status,
              stripeSubscriptionId: updatedSubscription.stripeSubscriptionId,
            },
          });
        } else {
          return NextResponse.json({
            success: false,
            message: 'No active subscription found in Stripe',
            subscription: dbSubscription ? {
              tier: dbSubscription.tier,
              status: dbSubscription.status,
            } : null,
          });
        }
      } catch (error: any) {
        console.error('Error syncing subscription:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to sync subscription from Stripe' },
          { status: 500 }
        );
      }
    } else {
      // No Stripe customer ID - check if subscription exists in DB
      return NextResponse.json({
        success: true,
        message: 'No Stripe customer ID found',
        subscription: dbSubscription ? {
          tier: dbSubscription.tier,
          status: dbSubscription.status,
        } : null,
      });
    }
  } catch (error: any) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync subscription' },
      { status: 500 }
    );
  }
}

