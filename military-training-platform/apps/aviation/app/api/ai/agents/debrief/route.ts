import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { missionId, missionName, participants, objectives, timeline } = body;

    if (!missionId || !missionName) {
      return NextResponse.json(
        { error: "missionId and missionName are required" },
        { status: 400 }
      );
    }

    const debrief = await aiService.generateMissionDebrief({
      missionId,
      missionName,
      participants: participants || [],
      objectives: objectives || "",
      timeline: timeline || [],
    });

    return NextResponse.json(debrief);
  } catch (error) {
    console.error("Debrief generation error:", error);
    const message = error instanceof Error ? error.message : "Debrief generation failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
