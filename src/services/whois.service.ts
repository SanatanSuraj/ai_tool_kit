import { WhoisLookupRequest, WhoisLookupResponse } from "@/types";

export class WhoisService {
  private static readonly API_ENDPOINT = '/api/whois-lookup';

  static async lookup(request: WhoisLookupRequest): Promise<WhoisLookupResponse> {
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
        const { error } = data;
        throw new Error(error || 'Unknown error');
      }

      if (data?.whoisError) {
        throw new Error(data.whoisError || 'Not found error');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to perform WHOIS lookup');
    }
  }
} 