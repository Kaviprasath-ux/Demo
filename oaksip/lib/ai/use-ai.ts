"use client";

// React Hook for AI Service - Client-side interface
import { useState, useCallback } from "react";
import {
  LLMHealthStatus,
  QuestionGenerationRequest,
  GeneratedQuestion,
  KnowledgeSearchRequest,
  KnowledgeSearchResult,
  ContentAnalysisRequest,
  ContentAnalysisResult,
} from "./types";

interface UseAIOptions {
  onError?: (error: string) => void;
}

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<LLMHealthStatus | null>(null);

  const handleError = useCallback(
    (err: string) => {
      setError(err);
      options.onError?.(err);
    },
    [options]
  );

  // Check AI health
  const checkHealth = useCallback(async (): Promise<LLMHealthStatus | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/health");
      const data = await response.json();

      setHealthStatus(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Health check failed";
      handleError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Generate questions
  const generateQuestions = useCallback(
    async (request: QuestionGenerationRequest): Promise<GeneratedQuestion[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Question generation failed");
        }

        return data.questions || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : "Question generation failed";
        handleError(message);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // Search knowledge
  const searchKnowledge = useCallback(
    async (request: KnowledgeSearchRequest): Promise<KnowledgeSearchResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Knowledge search failed");
        }

        return {
          answer: data.answer,
          confidence: data.confidence,
          sources: data.sources || [],
          relatedTopics: data.relatedTopics || [],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Knowledge search failed";
        handleError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // Analyze content
  const analyzeContent = useCallback(
    async (request: ContentAnalysisRequest): Promise<ContentAnalysisResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Content analysis failed");
        }

        return {
          topics: data.topics,
          summary: data.summary,
          concepts: data.concepts,
          tags: data.tags,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Content analysis failed";
        handleError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // Chat completion
  const chat = useCallback(
    async (
      messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Chat failed");
        }

        return data.content;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Chat failed";
        handleError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  return {
    isLoading,
    error,
    healthStatus,
    checkHealth,
    generateQuestions,
    searchKnowledge,
    analyzeContent,
    chat,
  };
}
