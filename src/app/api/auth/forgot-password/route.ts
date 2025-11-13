import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/utils/email-templates';

/**
 * POST /api/auth/forgot-password
 * Request a password reset email
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Invalidate any existing unused tokens for this user
      await PasswordResetToken.updateMany(
        { userId: user._id, used: false },
        { used: true }
      );

      // Generate new reset token
      const token = PasswordResetToken.generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

      // Save token to database
      await PasswordResetToken.create({
        userId: user._id,
        token,
        expiresAt,
        used: false,
      });

      // Send password reset email
      try {
        await sendPasswordResetEmail(user.email, token);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        // Don't fail the request if email fails, but log it
      }
    }

    // Always return success message (security best practice)
    return NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json(
      {
        error: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

