// Force Node.js runtime (not Edge)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { minify } from "html-minifier-terser";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const reader = req.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "No request body found" }, { status: 400 });
    }

    let chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalSize += value.length;
        if (totalSize > MAX_SIZE_BYTES) {
          return NextResponse.json(
            { error: "HTML too large (max 5MB)" },
            { status: 413 }
          );
        }
        chunks.push(value);
      }
    }

    const rawBody = Buffer.concat(chunks).toString("utf-8");

    let parsed: { html?: string };
    try {
      parsed = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { html } = parsed;

    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "No HTML provided" }, { status: 400 });
    }

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
    console.error("Minification error:", err);
    return NextResponse.json(
      { error: `Minification failed ${(err as Error).message || ""}` },
      { status: 500 }
    );
  }
}

