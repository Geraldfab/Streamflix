import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") as "all" | "movie" | "tv") || "all";
    const window = (searchParams.get("window") as "day" | "week") || "week";

    const items = await tmdbService.getTrending(type, window);
    return NextResponse.json({ results: items });
  } catch (error) {
    console.error("Error in /api/media/trending:", error);
    return NextResponse.json({ error: "Failed to fetch trending media" }, { status: 500 });
  }
}
