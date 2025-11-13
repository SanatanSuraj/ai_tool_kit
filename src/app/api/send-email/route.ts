import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, verifySMTPConnection } from '@/lib/email';

/**
 * POST /api/send-email
 * Send an email using the configured SMTP server
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, text, html, cc, bcc } = body;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and either text or html' },
        { status: 400 }
      );
    }

    // Send email
    const info = await sendEmail({
      to,
      subject,
      text,
      html,
      cc,
      bcc,
    });

    return NextResponse.json(
      {
        success: true,
        messageId: info.messageId,
        message: 'Email sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send email',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/send-email
 * Verify SMTP connection
 */
export async function GET() {
  try {
    const isValid = await verifySMTPConnection();
    
    if (isValid) {
      return NextResponse.json(
        { success: true, message: 'SMTP connection verified successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'SMTP connection verification failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying SMTP:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify SMTP connection',
      },
      { status: 500 }
    );
  }
}

