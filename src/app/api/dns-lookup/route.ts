import { NextResponse } from "next/server";
import dns from "dns/promises";
import net from "node:net";

export async function POST(req: Request) {
  const { domain, type } = await req.json();

  if (!domain || !type) {
    return NextResponse.json(
      { error: "Missing domain or record type" },
      { status: 400 }
    );
  }

  try {
    let records;

    // Special handling for PTR (reverse lookup)
    if (type === "PTR") {
      const ipType = net.isIP(domain); // 0 = invalid, 4 = IPv4, 6 = IPv6
      if (!net.isIP(domain)) {
        return NextResponse.json(
          { error: "Invalid IP address for PTR record" },
          { status: 400 }
        );
      }
      records = await dns.reverse(domain);
    } else {
      records = await dns.resolve(domain, type as string);
    }
    return NextResponse.json({ records });
  } catch (error: any) {
    if (error.code === "ENODATA" || error.code === "ENOTFOUND") {
      return NextResponse.json({ records: [] }); // No records found, but not an error
    }

    console.error(`DNS resolve error (${type}) for ${domain}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
