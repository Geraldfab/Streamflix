import { NextResponse } from "next/server";
import { feedbackDb } from "@/lib/feedback-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = feedbackDb.getSupportData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching support data:", error);
    return NextResponse.json(
      { error: "Failed to fetch support data" },
      { status: 500 }
    );
  }
}
