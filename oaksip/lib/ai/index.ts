// AI Module - Main Entry Point
// SOW Section 8.1: AI-Driven Question-Answer Engine

export * from "./types";
export * from "./config";
export { OllamaClient, getOllamaClient } from "./ollama-client";
export * from "./mock-responses";
export * from "./document-processor";
export { loadSampleDocuments, ensureSampleDocumentsLoaded } from "./sample-documents";
export { useAI } from "./use-ai";

import {
  LLMMessage,
  LLMResponse,
  LLMHealthStatus,
  QuestionGenerationRequest,
  GeneratedQuestion,
  KnowledgeSearchRequest,
  KnowledgeSearchResult,
  ContentAnalysisRequest,
  ContentAnalysisResult,
} from "./types";
import { getActiveConfig, systemPrompts, artilleryContext } from "./config";
import { getOllamaClient } from "./ollama-client";
import {
  generateMockQuestions,
  searchMockKnowledge,
  analyzeMockContent,
} from "./mock-responses";

// AI Service - unified interface for all AI operations
export class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Check LLM availability
  async checkHealth(): Promise<LLMHealthStatus> {
    const config = getActiveConfig();

    if (config.provider === "mock") {
      return {
        available: true,
        provider: "mock",
        model: "mock-llm",
        latencyMs: 0,
      };
    }

    const client = getOllamaClient();
    return client.checkHealth();
  }

  // Generate questions from content
  async generateQuestions(request: QuestionGenerationRequest): Promise<GeneratedQuestion[]> {
    const config = getActiveConfig();

    if (config.provider === "mock") {
      // Simulate processing delay
      await this.delay(500);
      return generateMockQuestions(request);
    }

    // Use Ollama for real generation
    try {
      const client = getOllamaClient();

      const prompt = this.buildQuestionGenerationPrompt(request);

      const response = await client.chat({
        messages: [
          { role: "system", content: systemPrompts.questionGeneration },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        maxTokens: 4096,
      });

      // Parse response into questions
      return this.parseQuestionsFromResponse(response.content, request);
    } catch (error) {
      console.error("LLM question generation failed, using mock:", error);
      return generateMockQuestions(request);
    }
  }

  // Search knowledge base
  async searchKnowledge(request: KnowledgeSearchRequest): Promise<KnowledgeSearchResult> {
    const config = getActiveConfig();

    if (config.provider === "mock") {
      await this.delay(300);
      return searchMockKnowledge(request);
    }

    try {
      const client = getOllamaClient();

      const contextInfo = request.weaponSystem
        ? `Focus on ${request.weaponSystem} if relevant.`
        : "Consider all Indian Army artillery systems.";

      const response = await client.chat({
        messages: [
          { role: "system", content: systemPrompts.knowledgeSearch },
          {
            role: "user",
            content: `${request.query}\n\n${contextInfo}\n\nProvide a clear, accurate answer with confidence level and sources if known.`,
          },
        ],
        temperature: 0.3, // Lower temperature for factual responses
        maxTokens: 1024,
      });

      return this.parseKnowledgeResponse(response.content);
    } catch (error) {
      console.error("LLM knowledge search failed, using mock:", error);
      return searchMockKnowledge(request);
    }
  }

  // Analyze content
  async analyzeContent(request: ContentAnalysisRequest): Promise<ContentAnalysisResult> {
    const config = getActiveConfig();

    if (config.provider === "mock") {
      await this.delay(400);
      return analyzeMockContent(request);
    }

    try {
      const client = getOllamaClient();

      const taskPrompt = this.buildAnalysisPrompt(request);

      const response = await client.chat({
        messages: [
          { role: "system", content: systemPrompts.contentAnalysis },
          { role: "user", content: taskPrompt },
        ],
        temperature: 0.5,
        maxTokens: 2048,
      });

      return this.parseAnalysisResponse(response.content, request);
    } catch (error) {
      console.error("LLM content analysis failed, using mock:", error);
      return analyzeMockContent(request);
    }
  }

  // Raw chat completion (for custom use)
  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const config = getActiveConfig();

    if (config.provider === "mock") {
      await this.delay(200);
      return {
        content: "This is a mock response. Connect Ollama for real AI capabilities.",
        model: "mock-llm",
        finishReason: "stop",
      };
    }

    const client = getOllamaClient();
    return client.chat({ messages });
  }

  // Build prompt for question generation
  private buildQuestionGenerationPrompt(request: QuestionGenerationRequest): string {
    const { content, category, difficulty, questionTypes, count, weaponSystem, courseType } = request;

    return `Generate ${count} assessment questions based on the following content.

CONTENT:
${content}

REQUIREMENTS:
- Category: ${category}
- Difficulty: ${difficulty}
- Question types to include: ${questionTypes.join(", ")}
${weaponSystem ? `- Weapon system focus: ${weaponSystem}` : ""}
${courseType ? `- Course level: ${courseType}` : ""}

AVAILABLE WEAPON SYSTEMS: ${artilleryContext.weaponSystems.join(", ")}

FORMAT each question as JSON with these fields:
{
  "type": "mcq|true-false|fill-blank|short-answer|essay",
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"] (for MCQ only),
  "correctAnswer": "The correct answer",
  "explanation": "Why this is correct",
  "difficulty": "${difficulty}",
  "topic": "Topic name"
}

Return a JSON array of questions.`;
  }

  // Build prompt for content analysis
  private buildAnalysisPrompt(request: ContentAnalysisRequest): string {
    const { content, analysisType } = request;

    const taskInstructions: Record<string, string> = {
      "extract-topics": `Extract the main topics and subtopics from this content.
Return as JSON: { "topics": ["Topic 1", "Topic 2", ...] }`,

      "generate-summary": `Generate a concise summary of this content suitable for training documentation.
Return as JSON: { "summary": "Your summary here..." }`,

      "identify-concepts": `Identify key concepts and learning objectives from this content.
Return as JSON: { "concepts": ["Concept 1", "Concept 2", ...] }`,

      "tag-content": `Tag this content with appropriate categories.
Use these category types: weapon-system, operation-type, topic, course
Return as JSON: { "tags": [{ "name": "Tag name", "category": "category-type", "confidence": 0.0-1.0 }] }`,
    };

    return `CONTENT:
${content}

TASK:
${taskInstructions[analysisType] || taskInstructions["extract-topics"]}

CONTEXT:
- Available weapon systems: ${artilleryContext.weaponSystems.join(", ")}
- Course types: ${artilleryContext.courseTypes.join(", ")}
- Topic categories: ${artilleryContext.topicCategories.join(", ")}`;
  }

  // Parse questions from LLM response
  private parseQuestionsFromResponse(
    response: string,
    request: QuestionGenerationRequest
  ): GeneratedQuestion[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.map((q) => ({
            ...q,
            difficulty: q.difficulty || request.difficulty,
            topic: q.topic || request.category,
          }));
        }
      }
    } catch (e) {
      console.error("Failed to parse questions from LLM response:", e);
    }

    // Fallback to mock
    return generateMockQuestions(request);
  }

  // Parse knowledge search response
  private parseKnowledgeResponse(response: string): KnowledgeSearchResult {
    // For now, wrap the raw response
    return {
      answer: response,
      confidence: 0.85,
      sources: [{ title: "AI Knowledge Base", relevance: 0.9 }],
      relatedTopics: [],
    };
  }

  // Parse content analysis response
  private parseAnalysisResponse(
    response: string,
    request: ContentAnalysisRequest
  ): ContentAnalysisResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse analysis from LLM response:", e);
    }

    return analyzeMockContent(request);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton getter
export function getAIService(): AIService {
  return AIService.getInstance();
}
