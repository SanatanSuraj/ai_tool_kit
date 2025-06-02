import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || "";

  if (!REMOVE_BG_API_KEY) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const formDataForApi = new FormData();
    formDataForApi.append('image_file', file);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: formDataForApi,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const processedImageBuffer = await response.arrayBuffer();

    const base64Image = Buffer.from(processedImageBuffer).toString('base64');
    
    return NextResponse.json({ 
      image: `data:image/png;base64,${base64Image}` 
    });
  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to remove background' },
      { status: 500 }
    );
  }
}