import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would call an actual WHOIS lookup service
    // For demo purposes, we'll return mock data based on the requested domain
    
    // Sleep for 1 second to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock WHOIS data
    // In a real implementation, this would come from a real WHOIS query
    
    let mockResult;
    
    if (domain.includes('google')) {
      mockResult = {
        domainName: "google.com",
        registrar: "MarkMonitor Inc.",
        whoisServer: "whois.markmonitor.com",
        creationDate: "1997-09-15T04:00:00Z",
        updatedDate: "2019-09-09T15:39:04Z",
        expirationDate: "2028-09-14T04:00:00Z",
        status: [
          "clientDeleteProhibited",
          "clientTransferProhibited",
          "clientUpdateProhibited",
          "serverDeleteProhibited",
          "serverTransferProhibited",
          "serverUpdateProhibited"
        ],
        nameServers: [
          "ns1.google.com",
          "ns2.google.com",
          "ns3.google.com",
          "ns4.google.com"
        ],
        registrant: {
          organization: "Google LLC",
          state: "CA",
          country: "US"
        },
        rawText: `Domain Name: google.com
Registry Domain ID: 2138514_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.markmonitor.com
Registrar URL: http://www.markmonitor.com
Updated Date: 2019-09-09T15:39:04Z
Creation Date: 1997-09-15T04:00:00Z
Registry Expiry Date: 2028-09-14T04:00:00Z
Registrar: MarkMonitor Inc.
Registrar IANA ID: 292
Registrar Abuse Contact Email: abusecomplaints@markmonitor.com
Registrar Abuse Contact Phone: +1.2083895740
Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited
Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
Domain Status: serverDeleteProhibited https://icann.org/epp#serverDeleteProhibited
Domain Status: serverTransferProhibited https://icann.org/epp#serverTransferProhibited
Domain Status: serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited
Name Server: ns1.google.com
Name Server: ns2.google.com
Name Server: ns3.google.com
Name Server: ns4.google.com
DNSSEC: unsigned
URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
>>> Last update of whois database: 2023-06-10T06:23:15Z <<<`
      };
    } else if (domain.includes('facebook')) {
      mockResult = {
        domainName: "facebook.com",
        registrar: "RegistrarSafe, LLC",
        whoisServer: "whois.registrarsafe.com",
        creationDate: "1997-03-29T05:00:00Z",
        updatedDate: "2021-09-22T09:39:03Z",
        expirationDate: "2031-03-30T04:00:00Z",
        status: [
          "clientDeleteProhibited",
          "clientTransferProhibited",
          "clientUpdateProhibited",
          "serverDeleteProhibited",
          "serverTransferProhibited",
          "serverUpdateProhibited"
        ],
        nameServers: [
          "a.ns.facebook.com",
          "b.ns.facebook.com",
          "c.ns.facebook.com",
          "d.ns.facebook.com"
        ],
        registrant: {
          organization: "Meta Platforms, Inc.",
          state: "CA",
          country: "US"
        },
        rawText: `Domain Name: FACEBOOK.COM
Registry Domain ID: 2320948_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrarsafe.com
Registrar URL: https://www.registrarsafe.com
Updated Date: 2021-09-22T09:39:03Z
Creation Date: 1997-03-29T05:00:00Z
Registrar Registration Expiration Date: 2031-03-30T04:00:00Z
Registrar: RegistrarSafe, LLC
Registrar IANA ID: 3237
Registrar Abuse Contact Email: abusecomplaints@registrarsafe.com
Registrar Abuse Contact Phone: +1.6503087004
Domain Status: clientDeleteProhibited https://www.icann.org/epp#clientDeleteProhibited
Domain Status: clientTransferProhibited https://www.icann.org/epp#clientTransferProhibited
Domain Status: clientUpdateProhibited https://www.icann.org/epp#clientUpdateProhibited
Domain Status: serverDeleteProhibited https://www.icann.org/epp#serverDeleteProhibited
Domain Status: serverTransferProhibited https://www.icann.org/epp#serverTransferProhibited
Domain Status: serverUpdateProhibited https://www.icann.org/epp#serverUpdateProhibited
Registry Registrant ID: 
Registrant Name: Domain Administrator
Registrant Organization: Meta Platforms, Inc.
Registrant Street: 1601 Willow Rd 
Registrant City: Menlo Park
Registrant State/Province: CA
Registrant Postal Code: 94025
Registrant Country: US
Registrant Phone: +1.6505434800
Registrant Phone Ext:
Registrant Fax: +1.6505434800
Registrant Fax Ext:
Registrant Email: domain@fb.com
Name Server: A.NS.FACEBOOK.COM
Name Server: B.NS.FACEBOOK.COM
Name Server: C.NS.FACEBOOK.COM
Name Server: D.NS.FACEBOOK.COM
DNSSEC: unsigned
URL of the ICANN WHOIS Data Problem Reporting System: http://wdprs.internic.net/
>>> Last update of WHOIS database: 2023-06-09T08:51:18Z <<<`
      };
    } else {
      // Default for any other domain
      mockResult = {
        domainName: domain,
        registrar: "Example Registrar, LLC",
        whoisServer: "whois.example-registrar.com",
        creationDate: "2020-01-01T00:00:00Z",
        updatedDate: "2022-06-15T12:30:45Z",
        expirationDate: "2025-01-01T00:00:00Z",
        status: [
          "clientTransferProhibited",
          "clientUpdateProhibited"
        ],
        nameServers: [
          "ns1.example-host.com",
          "ns2.example-host.com"
        ],
        registrant: {
          organization: "Example Organization",
          name: "Domain Administrator",
          email: "admin@" + domain,
          phone: "+1.5555555555",
          street: "123 Example Street",
          city: "Example City",
          state: "CA",
          postalCode: "90210",
          country: "US"
        },
        rawText: `Domain Name: ${domain.toUpperCase()}
Registry Domain ID: D123456-EXAMPLE
Registrar WHOIS Server: whois.example-registrar.com
Registrar URL: http://www.example-registrar.com
Updated Date: 2022-06-15T12:30:45Z
Creation Date: 2020-01-01T00:00:00Z
Registrar Registration Expiration Date: 2025-01-01T00:00:00Z
Registrar: Example Registrar, LLC
Registrar IANA ID: 9999
Registrar Abuse Contact Email: abuse@example-registrar.com
Registrar Abuse Contact Phone: +1.5555555555
Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
Registry Registrant ID: 
Registrant Name: Domain Administrator
Registrant Organization: Example Organization
Registrant Street: 123 Example Street
Registrant City: Example City
Registrant State/Province: CA
Registrant Postal Code: 90210
Registrant Country: US
Registrant Phone: +1.5555555555
Registrant Email: admin@${domain}
Name Server: ns1.example-host.com
Name Server: ns2.example-host.com
DNSSEC: unsigned`
      };
    }
    
    return NextResponse.json({
      success: true,
      domain,
      results: mockResult
    });
  } catch (error) {
    console.error('WHOIS lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to process WHOIS lookup request' },
      { status: 500 }
    );
  }
} 