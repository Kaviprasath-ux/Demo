// AI Health Check API - SOW Section 8.1
import { NextResponse } from "next/server";
import { getOllamaClient } from "@/lib/ai/ollama-client";
import { getActiveConfig } from "@/lib/ai/config";

export async function GET() {
  try {
    const config = getActiveConfig();

    if (config.provider === "mock") {
      return NextResponse.json({
        available: true,
        provider: "mock",
        model: "mock-llm",
        message: "Running in mock mode. Set USE_MOCK_LLM=false and start Ollama for real AI.",
      });
    }

    const client = getOllamaClient();
    const health = await client.checkHealth();

    return NextResponse.json(health);
  } catch (error) {
    console.error("AI health check failed:", error);
    return NextResponse.json(
      {
        available: false,
        provider: "ollama",
        model: "unknown",
        error: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 503 }
    );
  }
}
