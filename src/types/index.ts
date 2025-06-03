export interface SoaRecord {
  nsname: string;
  hostmaster: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minttl: number;
}

export interface SrvRecord {
  priority: number;
  weight: number;
  port: number;
  name: string;
}

export interface MxRecord {
  priority: number;
  exchange: string;
}

export interface CaaRecord {
  critical: number;
  issue?: string | undefined;
  issuewild?: string | undefined;
  iodef?: string | undefined;
  contactemail?: string | undefined;
  contactphone?: string | undefined;
}

export type ContentType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "contact";

  export type DNSRecord = {
    type: string;
    value: string;
    name?: string;
    ttl?: number;
  } & (
    | { type: 'MX' } & MxRecord
    | { type: 'SOA' } & SoaRecord
    | { type: 'SRV' } & SrvRecord
    | { type: 'CAA' } & CaaRecord
    | { type: string } 
  );
  
  export interface DNSLookupRequest {
    domain: string;
    type: string;
  }
  
  export interface DNSLookupResponse {
    records: DNSRecord[];
  }

  export interface HostingCheckerRequest {
    domain: string;
  }
  
  export interface HostingProvider {
    name: string;
    confidence: number;
    categories: string[];
  }
  
  export interface HostingCheckerResponse {
    domain: string;
    providers: HostingProvider[];
    ipAddress?: string;
    nameservers?: string[];
    whoisError?: string;
  }

  export interface HTMLMinifierRequest {
    html: string;
  }
  
  export interface HTMLMinifierResponse {
    minified: string;
    originalSize: number;
    minifiedSize: number;
    compressionRatio: number;
  }
  
  export interface HTTPStatusCheckerRequest {
    url: string;
  }
  
  export interface HTTPStatusCheckerResponse {
    statusCode: number;
    statusText: string;
    url: string;
    ip: string;
    responseTime: number;
    headers: {
      [key: string]: string;
    };
  }

  export interface ImageBackgroundRemovalResponse {
    image: string;
    error?: string;
  }

  export interface IPLookupRequest {
    ip: string;
  }
  
  export interface IPLookupResponse {
    ip: string;
    hostname?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    postal?: string;
    timezone?: string;
  }

  export interface SSLCheckerRequest {
    domain: string;
  }
  
  export interface SSLCertificate {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    serialNumber: string;
    fingerprint: string;
    subjectAltNames: string[];
    version: number;
    isValid: boolean;
    daysRemaining: number;
  }
  
  export interface SSLCheckerResponse {
    certificate: SSLCertificate;
    protocol: string;
    cipher: string;
    keyExchange: string;
    keyStrength: number;
  }

  export interface WhoisLookupRequest {
    domain: string;
  }
  
  export interface WhoisLookupResponse {
    domainName: string;
    registrar?: string;
    registrarWhoisServer?: string;
    registrarUrl?: string;
    updatedDate?: string;
    creationDate?: string;
    expiryDate?: string;
    registrantName?: string;
    registrantOrganization?: string;
    registrantEmail?: string;
    nameServers?: string[];
    status?: string[];
    dnssec?: string;
    whoisError?: string;
  }

  export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    url: string;
    popular: boolean;
  }
