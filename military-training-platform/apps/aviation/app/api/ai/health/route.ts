import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function GET() {
  try {
    const health = await aiService.checkHealth();
    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { status: "offline", error: "Health check failed" },
      { status: 500 }
    );
  }
}
