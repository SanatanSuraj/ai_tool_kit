import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { stripe, getTierFromPriceId } from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * Admin endpoint to diagnose and sync user subscriptions
 * Usage: POST /api/admin/sync-subscription
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return NextResponse.json(
        { error: `User not found with email: ${email}` },
        { status: 404 }
      );
    }

    // Get current subscription from database
    const dbSubscription = await Subscription.findOne({ userId: user._id });

    const result: any = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      databaseSubscription: dbSubscription ? {
        tier: dbSubscription.tier,
        status: dbSubscription.status,
        stripeCustomerId: dbSubscription.stripeCustomerId,
        stripeSubscriptionId: dbSubscription.stripeSubscriptionId,
        stripePriceId: dbSubscription.stripePriceId,
        currentPeriodStart: dbSubscription.currentPeriodStart,
        currentPeriodEnd: dbSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd,
      } : null,
      stripeData: null,
      syncResult: null,
    };

    // If user has Stripe customer ID, fetch from Stripe
    if (dbSubscription?.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(dbSubscription.stripeCustomerId) as Stripe.Customer;
        
        if (customer.deleted) {
          result.stripeData = { error: 'Customer deleted in Stripe' };
        } else {
          // Get active subscriptions
          const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 10,
          });

          result.stripeData = {
            customerId: customer.id,
            email: customer.email,
            subscriptions: subscriptions.data.map((sub) => ({
              id: sub.id,
              status: sub.status,
              priceId: sub.items.data[0]?.price.id,
              tier: getTierFromPriceId(sub.items.data[0]?.price.id || ''),
              currentPeriodStart: new Date((sub as any).current_period_start * 1000),
              currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            })),
          };

          // Find the most recent active subscription
          const activeSubscription = subscriptions.data.find(
            (sub) => sub.status === 'active' || sub.status === 'trialing'
          ) || subscriptions.data[0];

          if (activeSubscription) {
            const priceId = activeSubscription.items.data[0]?.price.id;
            const tier = getTierFromPriceId(priceId || '');
            const periodStart = (activeSubscription as any).current_period_start;
            const periodEnd = (activeSubscription as any).current_period_end;

            // Check if sync is needed
            const needsSync = 
              !dbSubscription ||
              dbSubscription.tier !== tier ||
              dbSubscription.status !== (activeSubscription.status === 'active' ? 'active' : 'trialing') ||
              dbSubscription.stripeSubscriptionId !== activeSubscription.id ||
              dbSubscription.stripePriceId !== priceId;

            if (needsSync) {
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

              result.syncResult = {
                success: true,
                message: 'Subscription synced successfully',
                updatedTier: tier,
                updatedStatus: activeSubscription.status === 'active' ? 'active' : 'trialing',
              };
            } else {
              result.syncResult = {
                success: true,
                message: 'Subscription is already in sync',
              };
            }
          } else {
            result.syncResult = {
              success: false,
              message: 'No active subscription found in Stripe',
            };
          }
        }
      } catch (error: any) {
        result.stripeData = {
          error: error.message || 'Failed to fetch Stripe data',
        };
      }
    } else {
      result.syncResult = {
        success: false,
        message: 'No Stripe customer ID found in database',
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync subscription' },
      { status: 500 }
    );
  }
}

