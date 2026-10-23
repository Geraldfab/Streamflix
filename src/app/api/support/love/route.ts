import { NextResponse } from "next/server";
import { feedbackDb } from "@/lib/feedback-db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const newLoveCount = feedbackDb.incrementLove(1);
    return NextResponse.json({
      success: true,
      loveCount: newLoveCount,
    });
  } catch (error) {
    console.error("Error incrementing love count:", error);
    return NextResponse.json(
      { error: "Failed to increment love count" },
      { status: 500 }
    );
  }
}
