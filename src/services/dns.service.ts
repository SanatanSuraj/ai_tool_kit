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

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Unknown error';
        console.error('DNS API error:', errorMessage, data);
        throw new Error(errorMessage);
      }

      console.log('DNS API response:', { 
        type: request.type, 
        domain: request.domain, 
        recordsCount: data.records?.length || 0,
        recordsType: Array.isArray(data.records) ? 'array' : typeof data.records,
        sampleRecord: data.records?.[0]
      });
      
      // Normalize records based on their structure
      let records: DNSRecord[] = [];
      
      if (Array.isArray(data.records)) {
        records = data.records.map((record: any) => {
          // Handle SRV records first (objects with name, port, priority, weight)
          if (request.type === 'SRV') {
            if (record && typeof record === 'object' && (record.name || record.port !== undefined)) {
              return { 
                type: request.type, 
                name: record.name || '',
                port: record.port ?? 0,
                priority: record.priority ?? 0,
                weight: record.weight ?? 0,
                value: `${record.name || 'N/A'}:${record.port ?? 'N/A'} (Priority: ${record.priority ?? 'N/A'}, Weight: ${record.weight ?? 'N/A'})`,
                ...record 
              };
            }
            // Fallback for SRV if structure is unexpected
            return { 
              type: request.type, 
              value: JSON.stringify(record),
              ...record 
            };
          }
          
          // Handle CNAME records (strings)
          if (request.type === 'CNAME') {
            if (typeof record === 'string') {
              return { type: request.type, value: record };
            }
            // If CNAME comes as object with value property
            if (record && typeof record === 'object' && record.value) {
              return { type: request.type, value: record.value, ...record };
            }
            // Fallback
            return { 
              type: request.type, 
              value: typeof record === 'string' ? record : JSON.stringify(record),
              ...record 
            };
          }
          
          // Handle string records (A, AAAA, NS, PTR)
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
          if (record && typeof record === 'object' && record.value) {
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
