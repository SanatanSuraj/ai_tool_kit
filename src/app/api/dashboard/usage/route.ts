import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import Usage from '@/models/Usage';
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from '@/config/subscription-limits';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Get user subscription tier
    const { default: Subscription } = await import('@/models/Subscription');
    const subscription = await Subscription.findOne({ userId: token.id });
    const tier = (subscription?.tier || 'free') as SubscriptionTier;
    const limits = SUBSCRIPTION_LIMITS[tier];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

    // Count usage for different periods
    const [monthlyUsage, dailyUsage, hourlyUsage] = await Promise.all([
      Usage.countDocuments({
        userId: token.id,
        timestamp: { $gte: startOfMonth },
      }),
      Usage.countDocuments({
        userId: token.id,
        timestamp: { $gte: startOfDay },
      }),
      Usage.countDocuments({
        userId: token.id,
        timestamp: { $gte: startOfHour },
      }),
    ]);

    return NextResponse.json({
      usage: {
        monthly: monthlyUsage,
        daily: dailyUsage,
        hourly: hourlyUsage,
      },
      limits: {
        monthly: limits.apiCallsPerMonth,
        daily: limits.apiCallsPerDay,
        hourly: limits.apiCallsPerHour,
      },
      remaining: {
        monthly: Math.max(0, limits.apiCallsPerMonth - monthlyUsage),
        daily: Math.max(0, limits.apiCallsPerDay - dailyUsage),
        hourly: Math.max(0, limits.apiCallsPerHour - hourlyUsage),
      },
      tier,
    });
  } catch (error: any) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';

