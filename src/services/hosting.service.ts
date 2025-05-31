import { HostingCheckerRequest, HostingCheckerResponse } from "@/types";

export class HostingService {
  private static readonly API_ENDPOINT = '/api/hosting-checker';

  static async check(request: HostingCheckerRequest): Promise<HostingCheckerResponse> {
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
      throw error instanceof Error ? error : new Error('Failed to check hosting information');
    }
  }
} 