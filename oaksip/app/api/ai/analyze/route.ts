// Content Analysis API - SOW Section 8.1 & 8.5: Content Tagging
import { NextRequest, NextResponse } from "next/server";
import { getAIService, ContentAnalysisRequest } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      content,
      analysisType = "extract-topics",
    } = body as Partial<ContentAnalysisRequest>;

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Content is required (minimum 10 characters)" },
        { status: 400 }
      );
    }

    const validTypes = ["extract-topics", "generate-summary", "identify-concepts", "tag-content"];
    if (!validTypes.includes(analysisType)) {
      return NextResponse.json(
        { error: `Invalid analysis type. Use one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const aiService = getAIService();

    const result = await aiService.analyzeContent({
      content,
      analysisType,
    });

    return NextResponse.json({
      success: true,
      analysisType,
      ...result,
    });
  } catch (error) {
    console.error("Content analysis failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Content analysis failed",
      },
      { status: 500 }
    );
  }
}
