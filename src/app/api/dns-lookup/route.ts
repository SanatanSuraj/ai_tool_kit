import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { host } = await request.json();
    
    if (!host) {
      return NextResponse.json(
        { error: 'Host parameter is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would call an actual DNS lookup service
    // For demo purposes, we'll return mock data based on the requested host
    
    // Sleep for 1 second to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock DNS records
    return NextResponse.json({
      success: true,
      host,
      records: {
        a: ["93.184.216.34"],
        aaaa: ["2606:2800:220:1:248:1893:25c8:1946"],
        cname: [],
        mx: [
          { priority: 0, exchange: "mail.example.com" },
          { priority: 10, exchange: "mailsec.example.com" }
        ],
        ns: ["ns1.example.com", "ns2.example.com"],
        txt: ["v=spf1 include:_spf.example.com ~all"],
        soa: {
          mname: "ns1.example.com",
          rname: "hostmaster.example.com",
          serial: 2023010101,
          refresh: 7200,
          retry: 3600,
          expire: 1209600,
          minimum: 3600
        }
      }
    });
  } catch (error) {
    console.error('DNS lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to process DNS lookup request' },
      { status: 500 }
    );
  }
} 