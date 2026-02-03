"use client";

import { AIQuestionGenerator } from "@/components/instructor/ai-question-generator";

export default function AIGeneratorPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Question Generator
        </h1>
        <p className="text-muted-foreground">
          Generate assessment questions from doctrinal content using AI.
          Per SOW Section 8.1 - AI-Driven Question Generation.
        </p>
      </div>

      {/* Generator Component */}
      <AIQuestionGenerator />
    </div>
  );
}
