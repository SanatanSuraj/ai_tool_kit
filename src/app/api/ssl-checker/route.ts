import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextResponse } from "next/server";
import tls from "node:tls";
import isFQDN from "validator/es/lib/isFQDN";

async function fetchHTTPHeaders(domain: string): Promise<Headers | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://${domain}`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.headers;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  if (!isFQDN(domain)) {
    return NextResponse.json(
      { error: "Invalid domain name" }, 
      { status: 400 }
    );
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const socket = tls.connect(
        443,
        domain,
        { servername: domain },
        async () => {
          const cert = socket.getPeerCertificate();
          const protocol = socket.getProtocol();
          const cipher = socket.getCipher();
          socket.end();

          if (!cert || !Object.keys(cert).length) {
            return reject(new Error("No certificate found"));
          }

          const validToDate = new Date(cert.valid_to);
          const daysRemaining = Math.ceil(
            (validToDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          const headers = await fetchHTTPHeaders(domain);

          const hasStrictTransportSecurity =
            headers?.has("strict-transport-security") ?? false;
          const hasPublicKeyPinning =
            (headers?.has("public-key-pins") ||
              headers?.has("public-key-pins-report-only")) ??
            false;

          const hasCertificateTransparency =
            !!cert.infoAccess?.["1.3.6.1.5.5.7.1.1"];

          resolve({
            valid: validToDate > new Date(),
            domain,
            issuer: cert.issuer?.O || "Unknown",
            validFrom: new Date(cert.valid_from).toISOString(),
            validTo: validToDate.toISOString(),
            daysRemaining,
            protocol: protocol || "Unknown",
            cipher: cipher?.name || "Unknown",
            hasCertificateTransparency,
            hasStrictTransportSecurity,
            hasPublicKeyPinning,
          });
        }
      );

      socket.on("error", reject);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
