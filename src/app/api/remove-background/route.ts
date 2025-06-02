import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const REMOVE_BG_URL = process.env.REMOVE_BG_URL || '';

    const response = await fetch(REMOVE_BG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: base64Image,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();

    return NextResponse.json({
      image: `data:image/png;base64,${data.output_base64}`,
    });
  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to remove background' },
      { status: 500 }
    );
  }
}