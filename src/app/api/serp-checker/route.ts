import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { keyword, domain, location } = await request.json();

    if (!keyword || !domain) {
      return NextResponse.json(
        { error: "Keyword and domain are required" },
        { status: 400 }
      );
    }

    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");

    const apiKey =
      process.env.GOOGLE_API_KEY || "";
    const searchEngineId =
      process.env.GOOGLE_SEARCH_ENGINE_ID || "";

    if (!apiKey || !searchEngineId) {
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 }
      );
    }

    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.append("key", apiKey);
    searchUrl.searchParams.append("cx", searchEngineId);
    searchUrl.searchParams.append("q", `${keyword} site:${cleanDomain}`);
    searchUrl.searchParams.append("num", "10");
    searchUrl.searchParams.append("gl", location || "us");
    searchUrl.searchParams.append("safe", "active");

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data?.error) {
      const errorMessage =
        data.error.message ||
        data.error.errors?.[0]?.message ||
        "Failed to fetch search results";
      throw new Error(errorMessage);
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        items: [],
        totalResults: "0",
        searchTime: 0,
        keyword,
        domain: cleanDomain,
        location: location || "us",
      });
    }

    const results = data?.items?.map((item: any, index: number) => ({
      position: index + 1,
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));

    return NextResponse.json({
      items: results,
      totalResults: data.searchInformation?.totalResults,
      searchTime: data.searchInformation?.searchTime,
      keyword,
      domain: cleanDomain,
      location: location || "us",
    });
  } catch (error) {
    console.error("SERP API Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
