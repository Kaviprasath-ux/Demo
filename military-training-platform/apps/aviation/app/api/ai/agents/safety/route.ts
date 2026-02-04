import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan } = body;

    if (!plan) {
      return NextResponse.json(
        { error: "plan is required" },
        { status: 400 }
      );
    }

    const review = await aiService.reviewPlanSafety(plan);

    return NextResponse.json(review);
  } catch (error) {
    console.error("Safety review error:", error);
    const message = error instanceof Error ? error.message : "Safety review failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
