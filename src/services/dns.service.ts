import { DNSLookupRequest, DNSLookupResponse, DNSRecord } from "@/types";

export class DNSService {
  private static readonly API_ENDPOINT = '/api/dns-lookup';

  static async lookup(request: DNSLookupRequest): Promise<DNSLookupResponse> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Unknown error');
      }

      const data = await response.json();
      
      // Normalize records based on their structure
      let records: DNSRecord[] = [];
      
      if (Array.isArray(data.records)) {
        records = data.records.map((record: any) => {
          // Handle string records (A, AAAA, CNAME, NS, PTR)
          if (typeof record === 'string') {
            return { type: request.type, value: record };
          }
          
          // Handle TXT records (arrays of strings)
          if (Array.isArray(record)) {
            return { type: request.type, value: record.join(' ') };
          }
          
          // Handle MX records (objects with priority and exchange)
          if (request.type === 'MX' && record.priority !== undefined && record.exchange) {
            return { 
              type: request.type, 
              value: `${record.exchange} (Priority: ${record.priority})`,
              ...record 
            };
          }
          
          // Handle SRV records
          if (request.type === 'SRV' && record.name && record.port !== undefined) {
            return { 
              type: request.type, 
              value: `${record.name}:${record.port} (Priority: ${record.priority ?? 'N/A'}, Weight: ${record.weight ?? 'N/A'})`,
              ...record 
            };
          }
          
          // Handle CAA records
          if (request.type === 'CAA') {
            const details: string[] = [];
            if (record.issue) details.push(`issue: ${record.issue}`);
            if (record.issuewild) details.push(`issuewild: ${record.issuewild}`);
            if (record.iodef) details.push(`iodef: ${record.iodef}`);
            if (record.contactemail) details.push(`email: ${record.contactemail}`);
            if (record.contactphone) details.push(`phone: ${record.contactphone}`);
            return { 
              type: request.type, 
              value: `Critical: ${record.critical ?? 'N/A'}${details.length ? `, ${details.join(', ')}` : ''}`,
              ...record 
            };
          }
          
          // Default: try to extract value or stringify
          if (record.value) {
            return { ...record, type: request.type };
          }
          
          // Fallback: create a value from the record
          return { 
            type: request.type, 
            value: JSON.stringify(record),
            ...record 
          };
        });
      } else if (data.records && typeof data.records === 'object') {
        // Handle SOA records (single object, not array)
        records = [{ type: request.type, ...data.records }];
      }

      return { records };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to perform DNS lookup');
    }
  }
}
