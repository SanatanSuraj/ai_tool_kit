import nodemailer from 'nodemailer';

// Email configuration interface
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

// Create reusable transporter instance
const createTransporter = () => {
  // Check if all required environment variables are set
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error(
      'SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables.'
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // smtp.gmail.com for Google
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD, // App Password for Gmail
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
    },
  });
};

// Singleton transporter instance
let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Send an email using the configured SMTP server
 * @param options Email options (to, subject, text/html, etc.)
 * @returns Promise with message info
 */
export async function sendEmail(options: EmailOptions): Promise<nodemailer.SentMessageInfo> {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error instanceof Error ? error : new Error('Failed to send email');
  }
}

/**
 * Verify SMTP connection configuration
 * @returns Promise<boolean> - true if connection is successful
 */
export async function verifySMTPConnection(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return false;
  }
}

/**
 * Send a simple text email
 */
export async function sendTextEmail(
  to: string | string[],
  subject: string,
  text: string
): Promise<nodemailer.SentMessageInfo> {
  return sendEmail({ to, subject, text });
}

/**
 * Send an HTML email
 */
export async function sendHtmlEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string
): Promise<nodemailer.SentMessageInfo> {
  return sendEmail({ to, subject, html, text });
}

