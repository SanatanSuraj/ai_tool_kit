import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { trackUsage } from './usage-tracker';

export async function getAuthenticatedUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });
  return token;
}

export async function trackApiUsage(
  request: NextRequest,
  toolName: string,
  endpoint: string,
  metadata?: Record<string, any>
) {
  const token = await getAuthenticatedUser(request);
  if (token?.id) {
    await trackUsage(token.id as string, toolName, endpoint, metadata);
  }
}

