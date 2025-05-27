import { IP_API_URL } from '@/utils/constants/ipApiUrl';
import { NextResponse } from 'next/server';
import net from "node:net";

export async function POST(req: Request) {
  const { ip } = await req.json();

  if (!ip) {
    return NextResponse.json({ error: 'IP address required' }, { status: 400 });
  }

  if (!net.isIP(ip)) {
    return NextResponse.json(
      { error: "Invalid IPv4 or IPv6 address" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${IP_API_URL}/${ip}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch IP info' }, { status: 500 });
  }
}
