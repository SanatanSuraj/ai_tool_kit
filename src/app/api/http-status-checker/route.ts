import { NextResponse } from 'next/server';
import dns from 'node:dns/promises';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const hostname = parsedUrl.hostname;

    // DNS Resolution (to check for internal IPs)
    let resolvedIP: string | null = null;
    try {
      const aRecords = await dns.resolve(hostname, 'A');
      resolvedIP = aRecords[0];
    } catch {
      try {
        const aaaaRecords = await dns.resolve(hostname, 'AAAA');
        resolvedIP = aaaaRecords[0];
      } catch {
        resolvedIP = null;
      }
    }

    const start = Date.now();

    let currentUrl = url;
    let redirectCount = 0;
    let response: Response | null = null;
    const visited = new Set();

    while (redirectCount < 5) {
      if (visited.has(currentUrl)) {
        break;
      }
      visited.add(currentUrl);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

      try {
        response = await fetch(currentUrl, {
          redirect: 'manual',
          signal: controller.signal,
        });
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
        }
        throw err;
      } finally {
        clearTimeout(timeout);
      }

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
        redirectCount++;
      } else {
        break;
      }
    }

    const end = Date.now();
    const responseTime = end - start;

    const finalUrl = new URL(currentUrl);
    const headers = response ? Object.fromEntries(response.headers.entries()) : {};
    const ssl = finalUrl.protocol === 'https:';

    return NextResponse.json({
      statusCode: response?.status || 0,
      statusText: response?.statusText || 'Unknown',
      headers,
      responseTime,
      redirectCount,
      ip: resolvedIP || 'Unavailable',
      ssl,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
