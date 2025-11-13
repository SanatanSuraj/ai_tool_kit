import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { checkUsageLimits } from '@/utils/usage-tracker';
import type { SubscriptionTier } from '@/utils/usage-tracker';

/**
 * Middleware helper for API routes to check subscription limits
 * This should be called from API routes (not Edge middleware)
 */
export async function checkSubscriptionLimits(
  request: NextRequest
): Promise<{ allowed: boolean; response?: NextResponse; tier?: SubscriptionTier }> {
  try {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      // Not authenticated - allow through (IP rate limiting handled by middleware)
      return { allowed: true };
    }

    // User is authenticated - check subscription-based limits
    await connectDB();
    const subscription = await Subscription.findOne({ userId: token.id });
    const tier = (subscription?.tier || 'free') as SubscriptionTier;

    const usageCheck = await checkUsageLimits(token.id as string, tier);

    if (!usageCheck.allowed) {
      return {
        allowed: false,
        tier,
        response: NextResponse.json(
          {
            error: usageCheck.reason,
            remainingCalls: usageCheck.remainingCalls,
            upgradeRequired: tier === 'free',
          },
          { status: 429 }
        ),
      };
    }

    return { allowed: true, tier };
  } catch (error: any) {
    console.error('Subscription limit check error:', error);
    // On error, allow the request to proceed
    return { allowed: true };
  }
}

