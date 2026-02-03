// Question Generation API - SOW Section 8.1: AI-Driven Question Generation
import { NextRequest, NextResponse } from "next/server";
import { getAIService, QuestionGenerationRequest } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const {
      content,
      category = "gunnery-theory",
      difficulty = "intermediate",
      questionTypes = ["mcq"],
      count = 5,
      weaponSystem,
      courseType,
    } = body as Partial<QuestionGenerationRequest>;

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Content is required (minimum 10 characters)" },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: "Count must be between 1 and 20" },
        { status: 400 }
      );
    }

    const aiService = getAIService();

    const questions = await aiService.generateQuestions({
      content,
      category,
      difficulty,
      questionTypes,
      count,
      weaponSystem,
      courseType,
    });

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
      metadata: {
        category,
        difficulty,
        weaponSystem,
        courseType,
      },
    });
  } catch (error) {
    console.error("Question generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Question generation failed",
      },
      { status: 500 }
    );
  }
}
