import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Try to find subscription by userId (as string or ObjectId)
    const subscription = await Subscription.findOne({
      userId: session.user.id,
    });

    console.log('Fetching subscription for user:', {
      userId: session.user.id,
      subscriptionFound: !!subscription,
      tier: subscription?.tier,
      status: subscription?.status,
    });

    if (!subscription) {
      return NextResponse.json({
        tier: 'free',
        status: 'active',
        cancelAtPeriodEnd: false,
      });
    }

    return NextResponse.json({
      tier: subscription.tier,
      status: subscription.status,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      trialEnd: subscription.trialEnd,
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

