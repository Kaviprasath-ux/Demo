import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, analysisType } = body;

    if (!content || !analysisType) {
      return NextResponse.json(
        { error: "Content and analysisType are required" },
        { status: 400 }
      );
    }

    const response = await aiService.analyzeContent({
      content,
      analysisType,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Content analysis failed" },
      { status: 500 }
    );
  }
}
