import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';

/**
 * POST /api/auth/reset-password
 * Reset password using a valid reset token
 */
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the reset token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
    }).populate('userId');

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      // Mark token as used
      resetToken.used = true;
      await resetToken.save();

      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user password
    user.password = password;
    await user.save();

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully. You can now sign in with your new password.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset-password:', error);
    return NextResponse.json(
      {
        error: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

