import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextResponse } from "next/server";
import whois from "whois-json";

export async function POST(req: Request) {
  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  try {
    const data = await whois(domain);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
