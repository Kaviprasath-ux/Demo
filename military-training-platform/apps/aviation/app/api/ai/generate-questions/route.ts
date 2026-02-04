import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, category, difficulty, questionTypes, count, helicopterType, courseType } = body;

    if (!content || !category) {
      return NextResponse.json(
        { error: "Content and category are required" },
        { status: 400 }
      );
    }

    const response = await aiService.generateQuestions({
      content,
      category,
      difficulty: difficulty || "basic",
      questionTypes: questionTypes || ["mcq"],
      count: count || 5,
      helicopterType,
      courseType,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Question generation failed" },
      { status: 500 }
    );
  }
}
