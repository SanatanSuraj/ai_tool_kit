import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json();
    
    if (!ip) {
      return NextResponse.json(
        { error: 'IP parameter is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would call a geolocation API service
    // For demo purposes, we'll return mock data based on the IP
    
    // Sleep for 1 second to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine if the IP is IPv4 or IPv6
    const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    const isIPv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{0,4}:){1,7}:|^:(:[0-9a-fA-F]{1,4}){1,7}$|^[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$/.test(ip);
    
    if (!isIPv4 && !isIPv6) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }
    
    // Generate different data based on IP starting characters
    let mockResult;
    
    if (ip.startsWith('192.168')) {
      // Private IPv4 address
      mockResult = {
        ip: ip,
        ipType: 'IPv4 (Private)',
        city: 'Private Network',
        region: 'Local Area Network',
        country: 'Local Network',
        countryCode: 'LO',
        latitude: 0,
        longitude: 0,
        timezone: 'UTC',
        isp: 'Private Network',
        org: 'Private Network',
        connection: {
          asn: 'N/A',
          domain: 'local.lan',
          type: 'Local Area Network'
        },
        security: {
          proxy: false,
          vpn: false,
          tor: false
        }
      };
    } else if (ip.startsWith('2001:') || ip.startsWith('2401:')) {
      // IPv6 address examples
      mockResult = {
        ip: ip,
        ipType: 'IPv6',
        city: 'Bangalore',
        region: 'Karnataka',
        country: 'India',
        countryCode: 'IN',
        latitude: 12.9716,
        longitude: 77.5946,
        timezone: 'Asia/Kolkata',
        isp: 'Jio Platforms Limited',
        org: 'Reliance Jio Infocomm Limited',
        connection: {
          asn: 'AS55836',
          domain: 'jio.com',
          type: 'ISP/Residential'
        },
        security: {
          proxy: false,
          vpn: false,
          tor: false
        }
      };
    } else if (ip.startsWith('8.8.') || ip.includes('google')) {
      // Google DNS
      mockResult = {
        ip: ip,
        ipType: 'IPv4',
        city: 'Mountain View',
        region: 'California',
        country: 'United States',
        countryCode: 'US',
        latitude: 37.3861,
        longitude: -122.0839,
        timezone: 'America/Los_Angeles',
        isp: 'Google LLC',
        org: 'Google LLC',
        connection: {
          asn: 'AS15169',
          domain: 'google.com',
          type: 'Business'
        },
        security: {
          proxy: false,
          vpn: false,
          tor: false
        }
      };
    } else if (ip.includes('vpn') || ip.includes('nord')) {
      // Simulated VPN IP
      mockResult = {
        ip: ip,
        ipType: isIPv4 ? 'IPv4' : 'IPv6',
        city: 'Ashburn',
        region: 'Virginia',
        country: 'United States',
        countryCode: 'US',
        latitude: 39.0481,
        longitude: -77.4728,
        timezone: 'America/New_York',
        isp: 'NordVPN',
        org: 'TEFINCOM S.A.',
        connection: {
          asn: 'AS9009',
          domain: 'nordvpn.com',
          type: 'VPN'
        },
        security: {
          proxy: true,
          vpn: true,
          tor: false
        }
      };
    } else {
      // Default response
      const countries = [
        { city: 'London', region: 'England', country: 'United Kingdom', code: 'GB', tz: 'Europe/London', lat: 51.5074, lng: -0.1278 },
        { city: 'New York', region: 'New York', country: 'United States', code: 'US', tz: 'America/New_York', lat: 40.7128, lng: -74.0060 },
        { city: 'Tokyo', region: 'Tokyo', country: 'Japan', code: 'JP', tz: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
        { city: 'Sydney', region: 'New South Wales', country: 'Australia', code: 'AU', tz: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
        { city: 'Berlin', region: 'Berlin', country: 'Germany', code: 'DE', tz: 'Europe/Berlin', lat: 52.5200, lng: 13.4050 }
      ];
      
      const isps = [
        { name: 'Comcast', org: 'Comcast Cable Communications', asn: 'AS7922', domain: 'comcast.net' },
        { name: 'Verizon', org: 'Verizon Business', asn: 'AS701', domain: 'verizon.com' },
        { name: 'AT&T', org: 'AT&T Services, Inc.', asn: 'AS7018', domain: 'att.com' },
        { name: 'Deutsche Telekom', org: 'Deutsche Telekom AG', asn: 'AS3320', domain: 'telekom.de' },
        { name: 'British Telecom', org: 'BT Americas Inc.', asn: 'AS2856', domain: 'bt.com' }
      ];
      
      // Select random location and ISP
      const randomLocation = countries[Math.floor(Math.random() * countries.length)];
      const randomISP = isps[Math.floor(Math.random() * isps.length)];
      
      mockResult = {
        ip: ip,
        ipType: isIPv4 ? 'IPv4' : 'IPv6',
        city: randomLocation.city,
        region: randomLocation.region,
        country: randomLocation.country,
        countryCode: randomLocation.code,
        latitude: randomLocation.lat,
        longitude: randomLocation.lng,
        timezone: randomLocation.tz,
        isp: randomISP.name,
        org: randomISP.org,
        connection: {
          asn: randomISP.asn,
          domain: randomISP.domain,
          type: 'Residential'
        },
        security: {
          proxy: false,
          vpn: false,
          tor: false
        }
      };
    }
    
    return NextResponse.json({
      success: true,
      results: mockResult
    });
  } catch (error) {
    console.error('IP lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to process IP lookup request' },
      { status: 500 }
    );
  }
} 