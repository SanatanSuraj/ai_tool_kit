import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import mongoose from 'mongoose';

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
    
    // Convert userId string to ObjectId for proper querying
    let userId: mongoose.Types.ObjectId | string = session.user.id;
    try {
      // Try to convert to ObjectId if it's a valid ObjectId string
      if (mongoose.Types.ObjectId.isValid(session.user.id)) {
        userId = new mongoose.Types.ObjectId(session.user.id);
      }
    } catch (error) {
      // If conversion fails, use string as-is
      console.warn('Could not convert userId to ObjectId, using string:', error);
    }
    
    // Try to find subscription by userId (as string or ObjectId)
    const subscription = await Subscription.findOne({
      userId: userId,
    });

    console.log('Fetching subscription for user:', {
      userId: session.user.id,
      userIdType: typeof userId,
      subscriptionFound: !!subscription,
      tier: subscription?.tier,
      status: subscription?.status,
      subscriptionUserId: subscription?.userId?.toString(),
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

