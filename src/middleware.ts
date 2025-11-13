import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiterMiddleware } from "./utils/rate-limiter";

export async function middleware(request: NextRequest) {
  // Apply rate limiting for API routes (IP-based for anonymous users)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Skip auth endpoints
    if (request.nextUrl.pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    // Skip Stripe webhook endpoint (Stripe handles rate limiting)
    if (request.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
      return NextResponse.next();
    }

    try {
      // IP-based rate limiting for anonymous users
      // Subscription-based limits are checked in individual API routes
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
      await rateLimiterMiddleware(ip);

      return NextResponse.next();
    } catch (error: any) {
      if (error.message?.includes('Too many requests')) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
      }
      
      // For other errors, allow the request but log it
      console.error('Middleware error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
