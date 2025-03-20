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
    
    // In a real implementation, you would call an actual hosting lookup service
    // For demo purposes, we'll return mock data based on the requested host
    
    // Sleep for 1 second to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock results
    // In a real implementation, this would come from real data
    // You could use WHOIS data, IP lookups, and other services
    
    let mockResult;
    
    if (host.includes('amazon') || host.includes('aws')) {
      mockResult = {
        provider: 'Amazon Web Services (AWS)',
        reliability: '99.99% uptime',
        ipAddress: '54.239.28.85',
        location: 'Virginia, United States',
        hostingType: 'Cloud Hosting',
        os: 'Linux',
        providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png'
      };
    } else if (host.includes('google') || host.includes('gcp')) {
      mockResult = {
        provider: 'Google Cloud Platform',
        reliability: '99.95% uptime',
        ipAddress: '142.250.186.78',
        location: 'Mountain View, United States',
        hostingType: 'Cloud Hosting',
        os: 'Linux',
        providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/512px-Google_Cloud_logo.svg.png'
      };
    } else if (host.includes('microsoft') || host.includes('azure')) {
      mockResult = {
        provider: 'Microsoft Azure',
        reliability: '99.95% uptime',
        ipAddress: '20.70.246.20',
        location: 'Washington, United States',
        hostingType: 'Cloud Hosting',
        os: 'Windows Server',
        providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/512px-Microsoft_Azure.svg.png'
      };
    } else if (host.includes('wordpress')) {
      mockResult = {
        provider: 'WordPress.com',
        reliability: '99.90% uptime',
        ipAddress: '192.0.78.13',
        location: 'San Francisco, United States',
        hostingType: 'Managed WordPress Hosting',
        os: 'Linux',
        providerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/512px-WordPress_blue_logo.svg.png'
      };
    } else {
      // Default for any other domain
      mockResult = {
        provider: 'Generic Hosting Provider',
        reliability: '99.5% uptime',
        ipAddress: '93.184.216.34',
        location: 'Amsterdam, Netherlands',
        hostingType: 'Shared Hosting',
        os: 'Linux',
        providerLogo: null
      };
    }
    
    return NextResponse.json({
      success: true,
      host,
      results: mockResult
    });
  } catch (error) {
    console.error('Hosting checker error:', error);
    return NextResponse.json(
      { error: 'Failed to process hosting lookup request' },
      { status: 500 }
    );
  }
} 