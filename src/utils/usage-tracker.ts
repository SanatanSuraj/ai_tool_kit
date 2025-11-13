import connectDB from '@/lib/mongodb';
import Usage from '@/models/Usage';
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from '@/config/subscription-limits';

export type { SubscriptionTier };

export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  remainingCalls?: {
    month: number;
    day: number;
    hour: number;
  };
}

export async function trackUsage(
  userId: string,
  toolName: string,
  endpoint: string,
  metadata?: Record<string, any>
): Promise<void> {
  await connectDB();
  await Usage.create({
    userId,
    toolName,
    endpoint,
    metadata,
  });
}

export async function checkUsageLimits(
  userId: string,
  subscriptionTier: SubscriptionTier
): Promise<UsageCheckResult> {
  await connectDB();
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

  // Count usage for different periods
  const [monthlyUsage, dailyUsage, hourlyUsage] = await Promise.all([
    Usage.countDocuments({
      userId,
      timestamp: { $gte: startOfMonth },
    }),
    Usage.countDocuments({
      userId,
      timestamp: { $gte: startOfDay },
    }),
    Usage.countDocuments({
      userId,
      timestamp: { $gte: startOfHour },
    }),
  ]);

  // Check limits
  if (monthlyUsage >= limits.apiCallsPerMonth) {
    return {
      allowed: false,
      reason: `Monthly limit of ${limits.apiCallsPerMonth} API calls reached`,
      remainingCalls: {
        month: Math.max(0, limits.apiCallsPerMonth - monthlyUsage),
        day: Math.max(0, limits.apiCallsPerDay - dailyUsage),
        hour: Math.max(0, limits.apiCallsPerHour - hourlyUsage),
      },
    };
  }

  if (dailyUsage >= limits.apiCallsPerDay) {
    return {
      allowed: false,
      reason: `Daily limit of ${limits.apiCallsPerDay} API calls reached`,
      remainingCalls: {
        month: Math.max(0, limits.apiCallsPerMonth - monthlyUsage),
        day: Math.max(0, limits.apiCallsPerDay - dailyUsage),
        hour: Math.max(0, limits.apiCallsPerHour - hourlyUsage),
      },
    };
  }

  if (hourlyUsage >= limits.apiCallsPerHour) {
    return {
      allowed: false,
      reason: `Hourly limit of ${limits.apiCallsPerHour} API calls reached`,
      remainingCalls: {
        month: Math.max(0, limits.apiCallsPerMonth - monthlyUsage),
        day: Math.max(0, limits.apiCallsPerDay - dailyUsage),
        hour: Math.max(0, limits.apiCallsPerHour - hourlyUsage),
      },
    };
  }

  return {
    allowed: true,
    remainingCalls: {
      month: limits.apiCallsPerMonth - monthlyUsage,
      day: limits.apiCallsPerDay - dailyUsage,
      hour: limits.apiCallsPerHour - hourlyUsage,
    },
  };
}

