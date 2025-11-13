import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const subscription = await Subscription.findOne({
      userId: session.user.id,
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel the subscription at period end
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    ) as Stripe.Subscription;

    // Update database
    await Subscription.findByIdAndUpdate(subscription._id, {
      cancelAtPeriodEnd: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentPeriodEnd: new Date((canceledSubscription as any).current_period_end * 1000),
    });
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

