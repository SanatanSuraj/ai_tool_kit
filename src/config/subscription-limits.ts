export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionLimits {
  apiCallsPerMonth: number;
  apiCallsPerDay: number;
  apiCallsPerHour: number;
  maxFileSize: number; // in bytes
  features: string[];
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    apiCallsPerMonth: 100,
    apiCallsPerDay: 10,
    apiCallsPerHour: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    features: ['basic_tools'],
  },
  pro: {
    apiCallsPerMonth: 10000,
    apiCallsPerDay: 500,
    apiCallsPerHour: 50,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    features: ['basic_tools', 'advanced_tools', 'priority_support', 'api_access'],
  },
  enterprise: {
    apiCallsPerMonth: 100000,
    apiCallsPerDay: 10000,
    apiCallsPerHour: 1000,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    features: ['basic_tools', 'advanced_tools', 'priority_support', 'api_access', 'custom_integrations', 'dedicated_support'],
  },
};

export const SUBSCRIPTION_PRICING: Record<SubscriptionTier, { monthly: number; yearly: number }> = {
  free: {
    monthly: 0,
    yearly: 0,
  },
  pro: {
    monthly: 29,
    yearly: 290, // ~17% discount
  },
  enterprise: {
    monthly: 99,
    yearly: 990, // ~17% discount
  },
};

