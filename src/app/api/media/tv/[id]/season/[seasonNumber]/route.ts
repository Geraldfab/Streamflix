import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; seasonNumber: string } }
) {
  try {
    const tvId = params.id;
    const seasonNumber = parseInt(params.seasonNumber, 10) || 1;

    const episodes = await tmdbService.getSeason(tvId, seasonNumber);
    return NextResponse.json({ episodes });
  } catch (error) {
    console.error(`Error in /api/media/tv/${params.id}/season/${params.seasonNumber}:`, error);
    return NextResponse.json({ error: "Failed to fetch season episodes" }, { status: 500 });
  }
}
