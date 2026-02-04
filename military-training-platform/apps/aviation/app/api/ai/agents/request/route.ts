import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetDescription, targetLocation, friendlyLocation, supportType, priority } = body;

    if (!targetDescription || !targetLocation || !friendlyLocation) {
      return NextResponse.json(
        { error: "targetDescription, targetLocation, and friendlyLocation are required" },
        { status: 400 }
      );
    }

    const airRequest = await aiService.generateAirSupportRequest({
      targetDescription,
      targetLocation,
      friendlyLocation,
      supportType: supportType || "CAS",
      priority: priority || "priority",
    });

    return NextResponse.json(airRequest);
  } catch (error) {
    console.error("Request generation error:", error);
    const message = error instanceof Error ? error.message : "Request generation failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
