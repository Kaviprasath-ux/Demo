// Knowledge Search API - SOW Section 8.1: AI-Driven Question-Answer Engine
import { NextRequest, NextResponse } from "next/server";
import { getAIService, KnowledgeSearchRequest } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      query,
      category,
      weaponSystem,
      maxResults = 5,
    } = body as Partial<KnowledgeSearchRequest>;

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: "Query is required (minimum 3 characters)" },
        { status: 400 }
      );
    }

    const aiService = getAIService();

    const result = await aiService.searchKnowledge({
      query,
      category,
      weaponSystem,
      maxResults,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Knowledge search failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Knowledge search failed",
      },
      { status: 500 }
    );
  }
}
