import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operationType, terrain, weather, artilleryUnits, aviationAssets, objectives } = body;

    if (!operationType || !terrain || !objectives) {
      return NextResponse.json(
        { error: "operationType, terrain, and objectives are required" },
        { status: 400 }
      );
    }

    const plan = await aiService.generateJointFirePlan({
      operationType,
      terrain,
      weather: weather || "clear",
      artilleryUnits: artilleryUnits || [],
      aviationAssets: aviationAssets || [],
      objectives,
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Plan generation error:", error);
    const message = error instanceof Error ? error.message : "Plan generation failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
