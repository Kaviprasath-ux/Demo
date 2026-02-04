import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, level } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "topic is required" },
        { status: 400 }
      );
    }

    const explanation = await aiService.explainConcept(
      topic,
      level || "basic"
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Explanation error:", error);
    const message = error instanceof Error ? error.message : "Explanation failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
