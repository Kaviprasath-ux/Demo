import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const response = await aiService.chat(messages);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat request failed" },
      { status: 500 }
    );
  }
}
