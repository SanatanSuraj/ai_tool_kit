import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { keyword, country = "us" } = await request.json();

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RAPIDAPI_KEY || "";

    const url = `https://seo-keyword-research.p.rapidapi.com/global.php?keyword=${encodeURIComponent(keyword)}&country=${country}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'seo-keyword-research.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from API");
    }

    // Transform the data to match our frontend structure
    const transformedData = {
      keyword,
      results: data.map((item) => ({
        keyword: item.text || "",
        searchVolume: item.vol || item.v || 0,
        cpc: parseFloat(item.cpc) || 0,
        competition: item.competition || "low",
      })),
      totalResults: data.length,
      language: "en",
      location: country
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Keyword Research API Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 