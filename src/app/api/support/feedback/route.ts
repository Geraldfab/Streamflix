import { NextRequest, NextResponse } from "next/server";
import { feedbackDb } from "@/lib/feedback-db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author, message, avatarEmoji } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (message.trim().length > 300) {
      return NextResponse.json(
        { error: "Message is too long (maximum 300 characters)." },
        { status: 400 }
      );
    }

    const cleanAuthor = typeof author === "string" && author.trim().length > 0
      ? author.trim().slice(0, 40)
      : "Anonymous Viewer";

    const feedback = feedbackDb.addFeedback(cleanAuthor, message.trim(), avatarEmoji);
    const data = feedbackDb.getSupportData();

    return NextResponse.json({
      success: true,
      feedback,
      feedbacks: data.feedbacks,
      loveCount: data.loveCount,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
