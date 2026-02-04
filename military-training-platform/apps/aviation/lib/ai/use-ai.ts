"use client";

// Aviation AI React Hook - Client-side AI integration

import { useState, useCallback } from "react";
import type {
  AIHealthStatus,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  QuestionGenerationRequest,
  QuestionGenerationResponse,
  ContentAnalysisRequest,
  ContentAnalysisResponse,
  JointFirePlan,
  AirSupportRequest,
  MissionDebrief,
  SafetyReview,
  LLMMessage,
} from "./types";

interface UseAIOptions {
  onError?: (error: Error) => void;
}

interface UseAIReturn {
  // State
  isLoading: boolean;
  error: Error | null;
  healthStatus: AIHealthStatus | null;

  // Core operations
  checkHealth: () => Promise<AIHealthStatus>;
  chat: (messages: LLMMessage[]) => Promise<string>;

  // Knowledge & Content
  searchKnowledge: (request: KnowledgeSearchRequest) => Promise<KnowledgeSearchResponse>;
  generateQuestions: (request: QuestionGenerationRequest) => Promise<QuestionGenerationResponse>;
  analyzeContent: (request: ContentAnalysisRequest) => Promise<ContentAnalysisResponse>;

  // Agent Workflows
  generateJointFirePlan: (input: {
    operationType: string;
    terrain: string;
    weather: string;
    artilleryUnits: string[];
    aviationAssets: string[];
    objectives: string;
  }) => Promise<JointFirePlan>;

  generateAirSupportRequest: (input: {
    targetDescription: string;
    targetLocation: { lat: number; lng: number };
    friendlyLocation: { lat: number; lng: number };
    supportType: string;
    priority: string;
  }) => Promise<AirSupportRequest>;

  generateMissionDebrief: (input: {
    missionId: string;
    missionName: string;
    participants: string[];
    objectives: string;
    timeline: { time: string; event: string }[];
  }) => Promise<MissionDebrief>;

  reviewPlanSafety: (plan: JointFirePlan) => Promise<SafetyReview>;

  explainConcept: (topic: string, level: "basic" | "intermediate" | "advanced") => Promise<string>;
}

export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const { onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [healthStatus, setHealthStatus] = useState<AIHealthStatus | null>(null);

  const handleError = useCallback(
    (err: Error) => {
      setError(err);
      onError?.(err);
    },
    [onError]
  );

  // ==========================================================================
  // HEALTH CHECK
  // ==========================================================================

  const checkHealth = useCallback(async (): Promise<AIHealthStatus> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/health");
      const data = await response.json();
      setHealthStatus(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Health check failed");
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ==========================================================================
  // CHAT
  // ==========================================================================

  const chat = useCallback(
    async (messages: LLMMessage[]): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          throw new Error(`Chat failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.content;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Chat failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // ==========================================================================
  // KNOWLEDGE SEARCH
  // ==========================================================================

  const searchKnowledge = useCallback(
    async (request: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Search failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // ==========================================================================
  // QUESTION GENERATION
  // ==========================================================================

  const generateQuestions = useCallback(
    async (request: QuestionGenerationRequest): Promise<QuestionGenerationResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Question generation failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Question generation failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // ==========================================================================
  // CONTENT ANALYSIS
  // ==========================================================================

  const analyzeContent = useCallback(
    async (request: ContentAnalysisRequest): Promise<ContentAnalysisResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Analysis failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // ==========================================================================
  // AGENT WORKFLOWS
  // ==========================================================================

  const generateJointFirePlan = useCallback(
    async (input: {
      operationType: string;
      terrain: string;
      weather: string;
      artilleryUnits: string[];
      aviationAssets: string[];
      objectives: string;
    }): Promise<JointFirePlan> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/agents/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw new Error(`Plan generation failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Plan generation failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const generateAirSupportRequest = useCallback(
    async (input: {
      targetDescription: string;
      targetLocation: { lat: number; lng: number };
      friendlyLocation: { lat: number; lng: number };
      supportType: string;
      priority: string;
    }): Promise<AirSupportRequest> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/agents/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw new Error(`Request generation failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Request generation failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const generateMissionDebrief = useCallback(
    async (input: {
      missionId: string;
      missionName: string;
      participants: string[];
      objectives: string;
      timeline: { time: string; event: string }[];
    }): Promise<MissionDebrief> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/agents/debrief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw new Error(`Debrief generation failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Debrief generation failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const reviewPlanSafety = useCallback(
    async (plan: JointFirePlan): Promise<SafetyReview> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/agents/safety", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });

        if (!response.ok) {
          throw new Error(`Safety review failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Safety review failed");
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const explainConcept = useCallback(
    async (topic: string, level: "basic" | "intermediate" | "advanced"): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/agents/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, level }),
        });

        if (!response.ok) {
          throw new Error(`Explanation failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.explanation;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Explanation failed");
        handleError(error);
        throw error;
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
    chat,
    searchKnowledge,
    generateQuestions,
    analyzeContent,
    generateJointFirePlan,
    generateAirSupportRequest,
    generateMissionDebrief,
    reviewPlanSafety,
    explainConcept,
  };
}
