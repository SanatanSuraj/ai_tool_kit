# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for your application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - Use **Test mode** keys for development
   - Use **Live mode** keys for production

## Step 2: Create Products and Prices in Stripe

1. In your Stripe Dashboard, go to **Products**
2. Create a new product for each subscription plan:
   - **GOLDEN Plan** (or your plan name)
     - Price: $4.99/month (or your desired price)
     - Billing period: Monthly
     - Copy the **Price ID** (starts with `price_...`)

3. For yearly plans (optional):
   - Create another price for the same product
   - Set billing period to **Yearly**
   - Copy the **Price ID**

## Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (replace with your actual Price IDs from Stripe Dashboard)
STRIPE_PRICE_ID_GOLDEN_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_GOLDEN_YEARLY=price_xxxxxxxxxxxxx
```

**Important:** 
- Replace `sk_test_...` with your actual Stripe secret key
- Replace `pk_test_...` with your actual Stripe publishable key
- The webhook secret will be generated in Step 4

## Step 4: Set Up Stripe Webhooks

Webhooks allow Stripe to notify your application about subscription events (payments, cancellations, etc.).

### For Local Development:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_...`) and add it to your `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### For Production:

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add it to your production environment variables

## Step 5: Update Price IDs in Code

Update the price IDs in `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRICE_IDS = {
  golden: {
    monthly: process.env.STRIPE_PRICE_ID_GOLDEN_MONTHLY || 'price_golden_monthly',
    yearly: process.env.STRIPE_PRICE_ID_GOLDEN_YEARLY || 'price_golden_yearly',
  },
} as const;
```

Replace the placeholder values with your actual Price IDs from Stripe.

## Step 6: Map Plans to Subscription Tiers

Update the `getTierFromPriceId` function in `src/lib/stripe.ts` to match your Stripe Price IDs:

```typescript
export function getTierFromPriceId(priceId: string): 'free' | 'pro' | 'enterprise' {
  if (priceId.includes('golden') || priceId === process.env.STRIPE_PRICE_ID_GOLDEN_MONTHLY) {
    return 'pro'; // Map GOLDEN plan to pro tier
  }
  // Add more mappings as needed
  return 'free';
}
```

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding (in a separate terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Test the checkout flow:
   - Go to `/pricing`
   - Click "Choose plan" on a paid plan
   - Use Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date and any CVC
   - Complete the checkout

4. Verify in Stripe Dashboard:
   - Check **Payments** → should see a test payment
   - Check **Customers** → should see a new customer
   - Check **Subscriptions** → should see an active subscription

5. Check your database:
   - Verify a subscription record was created
   - Verify the user's subscription tier was updated

## Step 8: Enable Stripe Billing Portal (Optional)

The Stripe Billing Portal allows customers to manage their subscriptions, update payment methods, and view invoices.

1. In Stripe Dashboard, go to **Settings** → **Billing** → **Customer portal**
2. Configure the portal settings:
   - Enable subscription cancellation
   - Enable payment method updates
   - Set cancellation behavior
3. The portal is automatically available via the "Manage Billing" button in the dashboard

## Troubleshooting

### Webhook Not Receiving Events

1. Verify webhook endpoint URL is correct
2. Check webhook secret matches your environment variable
3. Check Stripe Dashboard → **Developers** → **Webhooks** → **Logs** for errors
4. Ensure your server is accessible (for production)

### Subscription Not Updating

1. Check webhook logs in Stripe Dashboard
2. Verify database connection
3. Check server logs for errors
4. Ensure webhook secret is correct

### Checkout Not Working

1. Verify Stripe API keys are correct
2. Check browser console for errors
3. Verify Price IDs match Stripe Dashboard
4. Ensure user is authenticated before checkout

## Security Best Practices

1. **Never commit** `.env.local` or `.env` files to version control
2. Use **test mode** keys for development
3. Use **live mode** keys only in production
4. Keep your **secret key** secure and never expose it to the client
5. Always verify webhook signatures using the webhook secret
6. Use HTTPS in production

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Billing Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

