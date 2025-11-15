#!/usr/bin/env node
/**
 * Script to manually sync a user's subscription from Stripe to database
 * Usage: node scripts/sync-user-subscription.js <email>
 * 
 * Or use the API endpoint: POST /api/admin/sync-subscription with { email: "user@example.com" }
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, will use environment variables from system
}

async function syncUserSubscription(email) {
  try {
    console.log(`\n🔍 Syncing subscription for user: ${email}\n`);

    // Use the API endpoint if server is running
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    try {
      const response = await fetch(`${apiUrl}/api/admin/sync-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`❌ Error:`, result.error);
        process.exit(1);
      }

      console.log(`✅ User:`, result.user);
      console.log(`\n📊 Database Subscription:`, result.databaseSubscription || 'None');
      console.log(`\n📊 Stripe Data:`, JSON.stringify(result.stripeData, null, 2));
      console.log(`\n🔄 Sync Result:`, result.syncResult);

      if (result.syncResult?.success) {
        console.log(`\n✨ Subscription synced successfully!\n`);
      } else {
        console.log(`\n⚠️  ${result.syncResult?.message}\n`);
      }

      process.exit(0);
    } catch (fetchError) {
      console.log(`⚠️  Could not connect to API endpoint. Make sure the server is running.`);
      console.log(`   Start the server with: npm run dev`);
      console.log(`   Then use: curl -X POST ${apiUrl}/api/admin/sync-subscription -H "Content-Type: application/json" -d '{"email":"${email}"}'`);
      console.log(`\n   Or run the TypeScript script directly if you have tsx installed:`);
      console.log(`   npx tsx scripts/sync-user-subscription.ts ${email}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error:`, error.message);
    console.error(error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/sync-user-subscription.js <email>');
  console.error('   Or: curl -X POST http://localhost:3000/api/admin/sync-subscription -H "Content-Type: application/json" -d \'{"email":"user@example.com"}\'');
  process.exit(1);
}

syncUserSubscription(email);

