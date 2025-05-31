import { HTMLMinifierRequest, HTMLMinifierResponse } from "@/types";

export class HTMLMinifierService {
  private static readonly API_ENDPOINT = '/api/html-minifier';

  static async minify(request: HTMLMinifierRequest): Promise<HTMLMinifierResponse> {
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
        throw new Error(error || 'Failed to minify HTML');
      }

      return await response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to minify HTML');
    }
  }
} 