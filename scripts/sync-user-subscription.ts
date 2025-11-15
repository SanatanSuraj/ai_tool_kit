#!/usr/bin/env ts-node
/**
 * Script to manually sync a user's subscription from Stripe to database
 * Usage: npx ts-node scripts/sync-user-subscription.ts <email>
 */

import 'dotenv/config';
import connectDB from '../src/lib/mongodb';
import User from '../src/models/User';
import Subscription from '../src/models/Subscription';
import { stripe, getTierFromPriceId } from '../src/lib/stripe';
import Stripe from 'stripe';

async function syncUserSubscription(email: string) {
  try {
    console.log(`\n🔍 Syncing subscription for user: ${email}\n`);

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Found user:`, {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Get current subscription from database
    const dbSubscription = await Subscription.findOne({ userId: user._id });

    console.log(`\n📊 Current Database Subscription:`, dbSubscription ? {
      tier: dbSubscription.tier,
      status: dbSubscription.status,
      stripeCustomerId: dbSubscription.stripeCustomerId,
      stripeSubscriptionId: dbSubscription.stripeSubscriptionId,
      stripePriceId: dbSubscription.stripePriceId,
      currentPeriodStart: dbSubscription.currentPeriodStart,
      currentPeriodEnd: dbSubscription.currentPeriodEnd,
    } : 'None');

    // If user has Stripe customer ID, fetch from Stripe
    if (!dbSubscription?.stripeCustomerId) {
      console.log(`\n⚠️  No Stripe customer ID found in database. Searching Stripe by email...`);
      
      // Search for customer by email in Stripe
      const customers = await stripe.customers.list({
        email: email.toLowerCase().trim(),
        limit: 10,
      });

      if (customers.data.length === 0) {
        console.error(`❌ No Stripe customer found with email: ${email}`);
        process.exit(1);
      }

      console.log(`✅ Found ${customers.data.length} Stripe customer(s)`);
      
      // Use the first customer (or you could check which one has active subscriptions)
      const customer = customers.data[0];
      console.log(`Using customer: ${customer.id}`);

      // Get active subscriptions for this customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 10,
      });

      if (subscriptions.data.length === 0) {
        console.error(`❌ No subscriptions found for customer ${customer.id}`);
        process.exit(1);
      }

      const activeSubscription = subscriptions.data.find(
        (sub) => sub.status === 'active' || sub.status === 'trialing'
      ) || subscriptions.data[0];

      const priceId = activeSubscription.items.data[0]?.price.id;
      const tier = getTierFromPriceId(priceId || '');
      const periodStart = (activeSubscription as any).current_period_start;
      const periodEnd = (activeSubscription as any).current_period_end;

      console.log(`\n📊 Stripe Subscription:`, {
        subscriptionId: activeSubscription.id,
        status: activeSubscription.status,
        priceId,
        tier,
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      });

      // Create or update subscription
      const updatedSubscription = await Subscription.findOneAndUpdate(
        { userId: user._id },
        {
          tier,
          status: activeSubscription.status === 'active' ? 'active' : 'trialing',
          stripeCustomerId: customer.id,
          stripeSubscriptionId: activeSubscription.id,
          stripePriceId: priceId,
          currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
          trialEnd: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000) : undefined,
        },
        { upsert: true, new: true }
      );

      // Update user's subscription reference
      await User.findByIdAndUpdate(user._id, {
        subscriptionId: updatedSubscription._id,
      });

      console.log(`\n✅ Subscription synced successfully!`, {
        tier: updatedSubscription.tier,
        status: updatedSubscription.status,
      });

    } else {
      // User has Stripe customer ID, sync from Stripe
      const customerId = dbSubscription.stripeCustomerId;
      console.log(`\n🔍 Fetching Stripe data for customer: ${customerId}`);

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      
      if (customer.deleted) {
        console.error(`❌ Customer ${customerId} has been deleted in Stripe`);
        process.exit(1);
      }

      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 10,
      });

      console.log(`✅ Found ${subscriptions.data.length} subscription(s) in Stripe`);

      if (subscriptions.data.length === 0) {
        console.error(`❌ No subscriptions found for customer ${customerId}`);
        process.exit(1);
      }

      // Find the most recent active subscription
      const activeSubscription = subscriptions.data.find(
        (sub) => sub.status === 'active' || sub.status === 'trialing'
      ) || subscriptions.data[0];

      const priceId = activeSubscription.items.data[0]?.price.id;
      const tier = getTierFromPriceId(priceId || '');
      const periodStart = (activeSubscription as any).current_period_start;
      const periodEnd = (activeSubscription as any).current_period_end;

      console.log(`\n📊 Stripe Subscription:`, {
        subscriptionId: activeSubscription.id,
        status: activeSubscription.status,
        priceId,
        tier,
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      });

      // Check if sync is needed
      const needsSync = 
        dbSubscription.tier !== tier ||
        dbSubscription.status !== (activeSubscription.status === 'active' ? 'active' : 'trialing') ||
        dbSubscription.stripeSubscriptionId !== activeSubscription.id ||
        dbSubscription.stripePriceId !== priceId;

      if (needsSync) {
        console.log(`\n🔄 Syncing subscription...`);
        
        const updatedSubscription = await Subscription.findByIdAndUpdate(
          dbSubscription._id,
          {
            tier,
            status: activeSubscription.status === 'active' ? 'active' : 'trialing',
            stripeSubscriptionId: activeSubscription.id,
            stripePriceId: priceId,
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
            trialEnd: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000) : undefined,
          },
          { new: true }
        );

        if (!updatedSubscription) {
          console.error(`\n❌ Failed to update subscription`);
          process.exit(1);
        }

        // Update user's subscription reference
        await User.findByIdAndUpdate(user._id, {
          subscriptionId: updatedSubscription._id,
        });

        console.log(`\n✅ Subscription synced successfully!`, {
          oldTier: dbSubscription.tier,
          newTier: updatedSubscription.tier,
          oldStatus: dbSubscription.status,
          newStatus: updatedSubscription.status,
        });
      } else {
        console.log(`\n✅ Subscription is already in sync`);
      }
    }

    console.log(`\n✨ Done!\n`);
    process.exit(0);
  } catch (error: any) {
    console.error(`\n❌ Error:`, error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx ts-node scripts/sync-user-subscription.ts <email>');
  process.exit(1);
}

syncUserSubscription(email);

