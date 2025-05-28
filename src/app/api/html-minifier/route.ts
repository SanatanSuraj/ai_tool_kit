// Force Node.js runtime (not Edge)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { minify } from "html-minifier-terser";

export async function POST(req: NextRequest) {
  const { html } = await req.json();

  if (!html) {
    return NextResponse.json(
        { error: "No HTML provided" }, 
        { status: 400 }
    );
  }

  const sizeInBytes = new Blob([html]).size;

  if (sizeInBytes > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "HTML too large (max 5MB)" },
      { status: 413 }
    );
  }

  try {
    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    });

    return NextResponse.json({ minified });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Minification failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}
