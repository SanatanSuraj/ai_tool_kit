import Stripe from 'stripe';

// Validate Stripe secret key format
function validateStripeKey(key: string | undefined): string {
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables. Please add it to your .env.local file.');
  }
  
  // Check if it's a placeholder or invalid format
  if (key.includes('your_secret_key') || key.includes('your-stripe-secret-key') || key.includes('****************')) {
    throw new Error('STRIPE_SECRET_KEY appears to be a placeholder. Please replace it with your actual Stripe secret key from https://dashboard.stripe.com/apikeys');
  }
  
  // Basic format validation
  if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
    throw new Error('STRIPE_SECRET_KEY format is invalid. It should start with "sk_test_" (test mode) or "sk_live_" (live mode)');
  }
  
  return key;
}

const stripeSecretKey = validateStripeKey(process.env.STRIPE_SECRET_KEY);

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Stripe Price IDs - These should be created in your Stripe Dashboard
// For now, we'll use placeholder values that you'll need to replace
export const STRIPE_PRICE_IDS = {
  golden: {
    monthly: process.env.STRIPE_PRICE_ID_GOLDEN_MONTHLY || 'price_golden_monthly',
    yearly: process.env.STRIPE_PRICE_ID_GOLDEN_YEARLY || 'price_golden_yearly',
  },
  // Add more tiers as needed
} as const;

// Helper function to get Stripe customer ID for a user
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const { default: connectDB } = await import('./mongodb');
  const { default: Subscription } = await import('@/models/Subscription');
  
  await connectDB();
  
  // Check if user already has a Stripe customer ID
  const subscription = await Subscription.findOne({ userId });
  
  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }
  
  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
  
  // Update subscription with customer ID
  await Subscription.findOneAndUpdate(
    { userId },
    { stripeCustomerId: customer.id },
    { upsert: true, new: true }
  );
  
  return customer.id;
}

// Helper function to get subscription tier from Stripe price ID
export function getTierFromPriceId(priceId: string): 'free' | 'pro' | 'enterprise' {
  if (!priceId) return 'free';
  
  // Check against actual price IDs from environment variables
  const goldenMonthly = process.env.STRIPE_PRICE_ID_GOLDEN_MONTHLY;
  const goldenYearly = process.env.STRIPE_PRICE_ID_GOLDEN_YEARLY;
  
  // Match exact price IDs or check if it contains 'golden' (for fallback)
  if (priceId === goldenMonthly || priceId === goldenYearly || priceId.includes('golden')) {
    return 'pro'; // Map GOLDEN plan to pro tier
  }
  
  // Add more mappings as needed
  // For example, if you have enterprise prices:
  // const enterpriseMonthly = process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY;
  // if (priceId === enterpriseMonthly) {
  //   return 'enterprise';
  // }
  
  return 'free';
}

