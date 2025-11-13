# MongoDB Setup Guide for SaaS Product

This guide will help you set up MongoDB for your SaaS AI Toolkit application.

## Prerequisites

- Node.js and npm installed
- MongoDB instance (local or MongoDB Atlas)

## Setup Steps

### 1. Install MongoDB

#### Option A: Local MongoDB Installation

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-toolkit
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Stripe (for subscription payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Rate Limiting (for non-authenticated users)
RATE_LIMIT_POINTS=10
RATE_LIMIT_DURATION=60
RATE_LIMIT_BLOCK_DURATION=120
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 4. Database Models

The application uses the following MongoDB collections:

- **users**: User accounts with authentication
- **subscriptions**: User subscription tiers and billing information
- **usages**: API usage tracking for rate limiting

### 5. Subscription Tiers

The application supports three subscription tiers:

- **Free**: 100 API calls/month, 10/day, 5/hour
- **Pro**: 10,000 API calls/month, 500/day, 50/hour
- **Enterprise**: 100,000 API calls/month, 10,000/day, 1,000/hour

### 6. Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will automatically create the necessary database collections on first run.

## Database Schema

### User Model
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `name`: User's full name
- `image`: Profile image URL
- `emailVerified`: Email verification date
- `subscriptionId`: Reference to subscription

### Subscription Model
- `userId`: Reference to user
- `tier`: Subscription tier (free, pro, enterprise)
- `status`: Subscription status (active, canceled, past_due, trialing)
- `stripeCustomerId`: Stripe customer ID
- `stripeSubscriptionId`: Stripe subscription ID
- `currentPeriodStart`: Current billing period start
- `currentPeriodEnd`: Current billing period end

### Usage Model
- `userId`: Reference to user
- `toolName`: Name of the tool used
- `endpoint`: API endpoint called
- `timestamp`: When the API was called
- `metadata`: Additional metadata (optional)

## Features

### Authentication
- Email/password authentication
- OAuth (Google, GitHub)
- Session management with NextAuth

### Rate Limiting
- IP-based rate limiting for anonymous users
- Subscription-based rate limiting for authenticated users
- Usage tracking per user

### Usage Tracking
- Automatic usage tracking for all API calls
- Monthly, daily, and hourly limits based on subscription tier
- Usage records expire after 90 days

## Troubleshooting

### Connection Issues

If you're having trouble connecting to MongoDB:

1. Check if MongoDB is running:
   ```bash
   # macOS/Linux
   brew services list
   # or
   sudo systemctl status mongodb
   ```

2. Verify your connection string in `.env.local`

3. Check MongoDB logs for errors

### Authentication Issues

1. Ensure `NEXTAUTH_SECRET` is set and is a secure random string
2. Verify `NEXTAUTH_URL` matches your application URL
3. Check OAuth provider credentials if using OAuth

## Next Steps

1. Set up Stripe for subscription payments
2. Configure OAuth providers (Google, GitHub)
3. Set up production MongoDB instance
4. Configure production environment variables

