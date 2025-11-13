# Environment Variables Setup

Create a `.env.local` file in the root directory with the following content:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-toolkit

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ntD3gQmECQVxw2T0ol+04cPfqnol8stkU3bv5cV7OiU=

# OAuth Providers (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_ID=
GITHUB_SECRET=

# Stripe (for subscription payments - Optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Rate Limiting (for non-authenticated users)
RATE_LIMIT_POINTS=10
RATE_LIMIT_DURATION=60
RATE_LIMIT_BLOCK_DURATION=120
```

## Quick Setup

1. **Create the file:**
   ```bash
   touch .env.local
   ```

2. **Add the content above** to `.env.local`

3. **Verify MongoDB is running:**
   ```bash
   # Check if MongoDB is running
   brew services list | grep mongodb
   
   # If not running, start it:
   brew services start mongodb-community
   ```

4. **Test the connection:**
   ```bash
   mongosh mongodb://localhost:27017/ai-toolkit
   ```

## Notes

- The database name is `ai-toolkit` - MongoDB will create it automatically on first connection
- The `NEXTAUTH_SECRET` has been generated for you - keep it secure!
- OAuth and Stripe variables are optional - you can add them later if needed

