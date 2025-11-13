import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const thumbnailUrl = searchParams.get("url");

    if (!thumbnailUrl) {
      return NextResponse.json(
        { error: "Thumbnail URL is required" },
        { status: 400 }
      );
    }

    // Validate that it's a YouTube thumbnail URL
    if (!thumbnailUrl.includes("img.youtube.com")) {
      return NextResponse.json(
        { error: "Invalid thumbnail URL" },
        { status: 400 }
      );
    }

    // Fetch the thumbnail from YouTube
    const response = await fetch(thumbnailUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch thumbnail" },
        { status: response.status }
      );
    }

    // Get the image as a blob
    const blob = await response.blob();

    // Return the image with appropriate headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="youtube-thumbnail.jpg"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching thumbnail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

