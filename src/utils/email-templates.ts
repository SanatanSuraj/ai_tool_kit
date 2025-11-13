/**
 * Email template utilities
 * Common email templates for use throughout the application
 */

import { sendHtmlEmail } from '@/lib/email';

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Welcome to AI Tool Kit!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for signing up! We're excited to have you on board.</p>
        <p>Get started by exploring our wide range of tools and utilities.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </p>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          If you didn't create this account, please ignore this email.
        </p>
      </body>
    </html>
  `;

  const text = `
    Welcome to AI Tool Kit!
    
    Hi ${userName},
    
    Thank you for signing up! We're excited to have you on board.
    Get started by exploring our wide range of tools and utilities.
    
    Visit your dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
    
    If you didn't create this account, please ignore this email.
  `;

  return sendHtmlEmail(userEmail, 'Welcome to AI Tool Kit!', html, text);
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(userEmail: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Password Reset Request</h1>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <p style="margin-top: 30px;">
          <a href="${resetUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </body>
    </html>
  `;

  const text = `
    Password Reset Request
    
    You requested to reset your password.
    Click the link below to reset your password:
    
    ${resetUrl}
    
    This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
  `;

  return sendHtmlEmail(userEmail, 'Reset Your Password', html, text);
}

/**
 * Send a subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userEmail: string,
  userName: string,
  tier: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Subscription Confirmed!</h1>
        <p>Hi ${userName},</p>
        <p>Your subscription to the <strong>${tier}</strong> plan has been confirmed.</p>
        <p>You now have access to all premium features.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Dashboard
          </a>
        </p>
      </body>
    </html>
  `;

  const text = `
    Subscription Confirmed!
    
    Hi ${userName},
    
    Your subscription to the ${tier} plan has been confirmed.
    You now have access to all premium features.
    
    View your dashboard: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
  `;

  return sendHtmlEmail(userEmail, `Subscription Confirmed - ${tier} Plan`, html, text);
}

