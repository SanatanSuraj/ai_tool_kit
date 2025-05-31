import { ImageBackgroundRemovalResponse } from "@/types";


export class ImageService {
  private static readonly BACKGROUND_REMOVAL_ENDPOINT = '/api/remove-background';

  static async removeBackground(imageBlob: Blob): Promise<ImageBackgroundRemovalResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob);

      const response = await fetch(this.BACKGROUND_REMOVAL_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove background');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to remove background');
    }
  }
} 