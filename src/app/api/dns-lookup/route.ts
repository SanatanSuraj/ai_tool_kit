import { NextResponse } from "next/server";
import dns from "dns/promises";
import net from "node:net";
import { getErrorMessage } from "@/utils/getErrorMessage";

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
      if (!ipType) {
        return NextResponse.json(
          { error: "Invalid IP address for PTR record" },
          { status: 400 }
        );
      }
      records = await dns.reverse(domain);
    } else if (type === "CNAME") {
      // Use resolveCname for CNAME records (this is the correct method for CNAME)
      records = await dns.resolveCname(domain);
      console.log(`CNAME records for ${domain}:`, records);
    } else if (type === "MX") {
      records = await dns.resolveMx(domain);
    } else if (type === "TXT") {
      // resolveTxt returns array of arrays, flatten each TXT record
      const txtRecords = await dns.resolveTxt(domain);
      records = txtRecords.map((txtArray) => txtArray.join(""));
    } else if (type === "NS") {
      records = await dns.resolveNs(domain);
    } else if (type === "SOA") {
      // resolveSoa returns a single object, wrap it in an array
      const soaRecord = await dns.resolveSoa(domain);
      records = [soaRecord];
    } else if (type === "SRV") {
      records = await dns.resolveSrv(domain);
      console.log(`SRV records for ${domain}:`, records);
    } else if (type === "CAA") {
      // resolveCaa might not be available in all Node.js versions
      try {
        records = await dns.resolveCaa(domain);
      } catch (caaError: any) {
        // If resolveCaa doesn't exist, fall back to resolve
        if (caaError?.code === "ENOSYS" || caaError?.message?.includes("resolveCaa")) {
          records = await dns.resolve(domain, "CAA");
        } else {
          throw caaError;
        }
      }
    } else {
      // For A, AAAA, and other types, use resolve
      records = await dns.resolve(domain, type as string);
    }
    
    // Ensure records is always an array
    if (!Array.isArray(records)) {
      records = records ? [records] : [];
    }
    
    console.log(`Returning ${records.length} ${type} record(s) for ${domain}`);
    if (records.length > 0) {
      console.log(`Sample record structure:`, JSON.stringify(records[0], null, 2));
    }
    
    return NextResponse.json({ records });
  } catch (error: any) {
    // Handle DNS errors that indicate no records found (not actual errors)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error
    ) {
      const errorCode = (error as { code: string }).code;
      
      // These codes mean no records found, which is valid
      if (
        errorCode === 'ENODATA' ||
        errorCode === 'ENOTFOUND' ||
        errorCode === 'NXDOMAIN'
      ) {
        return NextResponse.json({ records: [] }); // No records found, but not an error
      }
    }

    console.error(`DNS resolve error (${type}) for ${domain}:`, error);
    console.error('Error details:', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      syscall: (error as any)?.syscall,
      hostname: (error as any)?.hostname,
    });
    
    return NextResponse.json({ 
      error: getErrorMessage(error) || 'Failed to perform DNS lookup'
    }, { status: 500 });
  }
}
