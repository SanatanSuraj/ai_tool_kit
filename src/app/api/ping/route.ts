import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import net from 'net';

const dnsLookup = promisify(dns.lookup);

async function pingHTTP(url: string) {
  const startTime = Date.now();
  
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'WebBuddy-Ping-Tool/1.0',
      },
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Get IP address
    const { hostname } = new URL(url);
    const { address: ipAddress } = await dnsLookup(hostname);

    return {
      isUp: response.ok,
      statusCode: response.status,
      statusMessage: response.statusText,
      responseTime,
      ipAddress,
      headers: Object.fromEntries(response.headers),
    };
  } catch (error) {
    return {
      isUp: false,
      statusCode: 0,
      statusMessage: error instanceof Error ? error.message : 'Unknown error occurred',
      responseTime: Date.now() - startTime,
      ipAddress: null,
      headers: {},
    };
  }
}

async function pingTCP(host: string) {
  const startTime = Date.now();
  const port = 80; // Default HTTP port
  
  try {
    const { address: ipAddress } = await dnsLookup(host);
    
    return new Promise((resolve) => {
      const socket = new net.Socket();
      
      socket.connect(port, host, () => {
        const responseTime = Date.now() - startTime;
        socket.destroy();
        resolve({
          isUp: true,
          statusCode: 200,
          statusMessage: 'TCP Connection Successful',
          responseTime,
          ipAddress,
          headers: {},
        });
      });
      
      socket.on('error', (error) => {
        socket.destroy();
        resolve({
          isUp: false,
          statusCode: 0,
          statusMessage: error.message,
          responseTime: Date.now() - startTime,
          ipAddress,
          headers: {},
        });
      });
      
      // Set timeout to 5 seconds
      socket.setTimeout(5000, () => {
        socket.destroy();
        resolve({
          isUp: false,
          statusCode: 0,
          statusMessage: 'Connection Timeout',
          responseTime: 5000,
          ipAddress,
          headers: {},
        });
      });
    });
  } catch (error) {
    return {
      isUp: false,
      statusCode: 0,
      statusMessage: error instanceof Error ? error.message : 'Unknown error occurred',
      responseTime: Date.now() - startTime,
      ipAddress: null,
      headers: {},
    };
  }
}

export async function POST(request: Request) {
  try {
    const { url, protocol } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Remove http:// or https:// from URL for TCP and ICMP
    const host = url.replace(/^https?:\/\//, '');

    let results;
    switch (protocol) {
      case 'HTTP(s)':
        results = await pingHTTP(url);
        break;
      case 'TCP':
        results = await pingTCP(host);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid protocol specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json(
      { error: 'Failed to process ping request' },
      { status: 500 }
    );
  }
} 