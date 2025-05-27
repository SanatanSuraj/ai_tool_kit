import { NextResponse } from "next/server";
import dns from "dns/promises";
import { getWebsite } from "@/utils/getWebsite";
import { getHostingType } from "@/utils/getHostingType";
import { IP_API_URL } from "@/utils/constants/ipApiUrl";
import isFQDN from "validator/es/lib/isFQDN";

export async function POST(req: Request) {
  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json(
      { error: "Domain or URL is required" },
      { status: 400 }
    );
  }

  if (!isFQDN(domain)) {
    return NextResponse.json(
      { error: "Invalid domain name" }, 
      { status: 400 }
    );
  }

  try {
    // Resolve A and AAAA records
    const [aRecords, aaaaRecords, nsRecords] = await Promise.all([
      dns.resolve(domain, "A").catch(() => []),
      dns.resolve(domain, "AAAA").catch(() => []),
      dns.resolveNs(domain).catch(() => []),
    ]);

    const ip = aRecords[0] || aaaaRecords[0] || null;
    const ipv6 = aaaaRecords[0] || null;

    // Geo/IP Info
    const geoRes = await fetch(`${IP_API_URL}/${ip}`);
    const geo = await geoRes.json();

    if (geo.status !== "success") {
      return NextResponse.json(
        { error: "Failed to fetch IP info" },
        { status: 500 }
      );
    }

    const asn = geo.as || "";
    const isp = geo.isp || "";

    // Fetch headers from the site
    let serverHeader = "";
    let xPoweredBy = "";

    try {
      const response = await fetch(`https://${domain}`, { method: "HEAD" });
      serverHeader = response.headers.get("server") || "";
      xPoweredBy = response.headers.get("x-powered-by") || "";
    } catch (err) {
      console.error(err);
      // Ignore errors for HEAD request
    }

    const data = {
      domain,
      ip,
      ipv6,
      hosting: {
        company: geo.org || isp,
        website: getWebsite(asn),
        type: getHostingType(asn),
        country: geo.country,
        asn,
      },
      server: {
        software: serverHeader || "Unknown",
        technology: [xPoweredBy, ipv6 ? "IPv6" : null]
          .filter(Boolean)
          .join(", "),
      },
      additional: {
        googleCloud: /google/i.test(asn),
        aws: /amazon/i.test(asn),
        azure: /microsoft/i.test(asn),
        cloudflare: /cloudflare/i.test(asn),
        digitalOcean: /digitalocean/i.test(asn),
        waf: /cloudflare|amazon|azure|google/i.test(asn),
        cdn: /cloudflare/i.test(asn),
        nameservers: nsRecords,
      },
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
