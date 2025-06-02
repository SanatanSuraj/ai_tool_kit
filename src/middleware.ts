import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiterMiddleware } from "./utils/rate-limiter";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    try {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

      await rateLimiterMiddleware(ip);

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
