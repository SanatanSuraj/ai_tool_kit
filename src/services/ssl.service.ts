import { SSLCheckerRequest, SSLCheckerResponse } from "@/types";


export class SSLService {
  private static readonly API_ENDPOINT = '/api/ssl-checker';

  static async check(request: SSLCheckerRequest): Promise<SSLCheckerResponse> {
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

      return await response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to check SSL certificate');
    }
  }
} 