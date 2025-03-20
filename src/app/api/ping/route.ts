import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, protocol } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would actually ping the requested URL
    // For demo purposes, we'll simulate ping results
    
    // Sleep for 1-2 seconds to simulate network delay
    const pingTime = Math.floor(Math.random() * 1000) + 500;
    await new Promise(resolve => setTimeout(resolve, pingTime));
    
    // Generate random response time between 20ms and 500ms
    const responseTime = Math.floor(Math.random() * 480) + 20;
    
    // Simulate different responses based on the URL
    let mockResult;
    
    // Check if the URL is potentially invalid
    if (!url.match(/^https?:\/\//) && !url.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return NextResponse.json({
        success: false,
        results: {
          isUp: false,
          statusMessage: 'Invalid URL format',
          statusCode: null,
          responseTime: null,
          ipAddress: null,
          headers: null
        }
      });
    }
    
    // Simulate a down website for certain strings
    if (url.includes('down') || url.includes('error') || url.includes('fail')) {
      mockResult = {
        isUp: false,
        statusMessage: 'Connection refused',
        statusCode: null,
        responseTime: null,
        ipAddress: null,
        headers: null
      };
    } else if (url.includes('slow')) {
      // Simulate slow response
      mockResult = {
        isUp: true,
        statusMessage: 'Slow response',
        statusCode: 200,
        responseTime: 2500 + Math.floor(Math.random() * 1500),
        ipAddress: '93.184.216.' + Math.floor(Math.random() * 255),
        headers: {
          'server': 'nginx',
          'content-type': 'text/html; charset=UTF-8',
          'cache-control': 'max-age=600',
          'x-powered-by': 'PHP/7.4.3',
          'date': new Date().toUTCString()
        }
      };
    } else {
      // Default good response
      const statusCodes = [200, 200, 200, 200, 201, 204, 301, 302, 307, 308];
      const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      
      const servers = ['Apache', 'nginx', 'cloudflare', 'Microsoft-IIS/10.0', 'LiteSpeed'];
      const server = servers[Math.floor(Math.random() * servers.length)];
      
      mockResult = {
        isUp: true,
        statusMessage: 'OK',
        statusCode: statusCode,
        responseTime: responseTime,
        ipAddress: '93.184.216.' + Math.floor(Math.random() * 255),
        headers: {
          'server': server,
          'content-type': 'text/html; charset=UTF-8',
          'cache-control': 'max-age=600',
          'strict-transport-security': 'max-age=31536000',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'SAMEORIGIN',
          'x-xss-protection': '1; mode=block',
          'date': new Date().toUTCString()
        }
      };
      
      // Add protocol-specific data
      if (protocol === 'TCP') {
        mockResult.tcpDetails = {
          port: 80,
          open: true,
          latency: responseTime - 10
        };
      } else if (protocol === 'ICMP') {
        mockResult.icmpDetails = {
          ttl: 64,
          packets: {
            sent: 4,
            received: 4,
            lost: 0
          },
          statistics: {
            min: responseTime - 15,
            avg: responseTime,
            max: responseTime + 20
          }
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      results: mockResult
    });
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json(
      { error: 'Failed to process ping request' },
      { status: 500 }
    );
  }
} 