import { DNSLookupRequest, DNSLookupResponse } from "@/types";

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
      
      const records = Array.isArray(data.records) 
        ? data.records.map((record: any) => {
            if (typeof record === 'string') {
              return { type: request.type, value: record };
            }
            return { type: request.type, ...record };
          })
        : [{ type: request.type, ...data.records }];

      return { records };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to perform DNS lookup');
    }
  }
}
