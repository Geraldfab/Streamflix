import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results = await tmdbService.search(query, page);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in /api/media/search:", error);
    return NextResponse.json({ error: "Failed to search media" }, { status: 500 });
  }
}
