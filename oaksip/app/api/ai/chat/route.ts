// Chat Completion API - General purpose LLM chat
import { NextRequest, NextResponse } from "next/server";
import { getAIService, LLMMessage } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { messages } = body as { messages?: LLMMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: "Each message must have role and content" },
          { status: 400 }
        );
      }
      if (!["system", "user", "assistant"].includes(msg.role)) {
        return NextResponse.json(
          { error: "Message role must be system, user, or assistant" },
          { status: 400 }
        );
      }
    }

    const aiService = getAIService();

    const response = await aiService.chat(messages);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Chat completion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Chat completion failed",
      },
      { status: 500 }
    );
  }
}
