import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";
import { MediaType } from "@/types/media";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaType = (searchParams.get("type") as MediaType) || "movie";
    const genreId = searchParams.get("genreId") ? Number(searchParams.get("genreId")) : null;
    const year = searchParams.get("year") ? Number(searchParams.get("year")) : null;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
    const sortBy = searchParams.get("sortBy") || "popularity.desc";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const response = await tmdbService.discover({
      mediaType,
      genreId,
      year,
      minRating,
      sortBy,
      page,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in /api/media/discover:", error);
    return NextResponse.json({ error: "Failed to discover media" }, { status: 500 });
  }
}
