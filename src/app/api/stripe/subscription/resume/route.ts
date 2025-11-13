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
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Resume the subscription
    const resumedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    ) as Stripe.Subscription;

    // Update database
    await Subscription.findByIdAndUpdate(subscription._id, {
      cancelAtPeriodEnd: false,
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription resumed successfully',
      cancelAtPeriodEnd: resumedSubscription.cancel_at_period_end,
    });
  } catch (error: any) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resume subscription' },
      { status: 500 }
    );
  }
}

