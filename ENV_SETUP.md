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

# Email Configuration (Google SMTP - Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_REJECT_UNAUTHORIZED=true
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

## Email Setup (Google SMTP)

To use Google SMTP for sending emails:

1. **Enable 2-Step Verification** on your Google account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password (this is your `SMTP_PASSWORD`)

3. **Configure environment variables**:
   - `SMTP_HOST`: `smtp.gmail.com` (for Gmail)
   - `SMTP_PORT`: `587` (for TLS) or `465` (for SSL)
   - `SMTP_SECURE`: `false` for port 587, `true` for port 465
   - `SMTP_USER`: Your Gmail address
   - `SMTP_PASSWORD`: The App Password generated above
   - `SMTP_FROM`: Your Gmail address (or a custom "From" name like `"Your Name <your-email@gmail.com>"`)

## Notes

- The database name is `ai-toolkit` - MongoDB will create it automatically on first connection
- The `NEXTAUTH_SECRET` has been generated for you - keep it secure!
- OAuth and Stripe variables are optional - you can add them later if needed
- Email configuration is optional - only required if you need to send emails from your application

