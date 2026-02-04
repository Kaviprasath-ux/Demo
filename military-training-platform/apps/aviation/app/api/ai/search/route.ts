import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, helicopterType, missionType, maxResults } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const response = await aiService.searchKnowledge({
      query,
      category,
      helicopterType,
      missionType,
      maxResults: maxResults || 10,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search request failed" },
      { status: 500 }
    );
  }
}
