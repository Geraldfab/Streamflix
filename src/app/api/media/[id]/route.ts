import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";
import { MediaType } from "@/types/media";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaType = (searchParams.get("type") as MediaType) || "movie";
    const item = await tmdbService.getDetails(params.id, mediaType);

    if (!item) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error in /api/media/${params.id}:`, error);
    return NextResponse.json({ error: "Failed to fetch title details" }, { status: 500 });
  }
}
