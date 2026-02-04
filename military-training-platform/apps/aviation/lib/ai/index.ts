// Aviation AI Service - SOW 6.3, 6.4

import { defaultConfig, systemPrompts, guardrailConfig } from "./config";
import {
  getMockKnowledgeResponse,
  getMockQuestionResponse,
  getMockJointFirePlan,
  getMockAirSupportRequest,
  getMockMissionDebrief,
  getMockSafetyReview,
  mockHealthStatus,
  mockContentAnalysis,
} from "./mock-responses";
import type {
  LLMConfig,
  LLMMessage,
  LLMResponse,
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
  GuardrailResult,
  AIGuardrail,
} from "./types";

// ============================================================================
// AI SERVICE CLASS (Singleton)
// ============================================================================

class AIService {
  private static instance: AIService;
  private config: LLMConfig;

  private constructor() {
    this.config = defaultConfig;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // ==========================================================================
  // HEALTH CHECK
  // ==========================================================================

  async checkHealth(): Promise<AIHealthStatus> {
    // Always return mock health for demo
    return {
      ...mockHealthStatus,
      lastCheck: new Date().toISOString(),
    };
  }

  // ==========================================================================
  // GUARDRAIL CHECKS
  // ==========================================================================

  private checkGuardrails(
    content: string,
    guardrails: AIGuardrail[] = ["Safety", "ROE", "Role", "Evidence"]
  ): GuardrailResult {
    const checks: Array<{ guardrail: AIGuardrail; passed: boolean; reason?: string }> = guardrails.map((guardrail) => {
      switch (guardrail) {
        case "Safety":
          return this.checkSafetyGuardrail(content);
        case "ROE":
          return this.checkROEGuardrail(content);
        case "Role":
          return this.checkRoleGuardrail(content);
        case "Evidence":
          return this.checkEvidenceGuardrail(content);
        default:
          return { guardrail, passed: true };
      }
    });

    const failedCheck = checks.find((c) => !c.passed);
    return {
      allPassed: checks.every((c) => c.passed),
      checks,
      blockedReason: failedCheck?.reason,
    };
  }

  private checkSafetyGuardrail(content: string) {
    const blockedTerms = guardrailConfig.safety.blockedTopics;
    const lowerContent = content.toLowerCase();

    for (const term of blockedTerms) {
      if (lowerContent.includes(term.toLowerCase())) {
        return {
          guardrail: "Safety" as AIGuardrail,
          passed: false,
          reason: `Content contains blocked safety topic: ${term}`,
        };
      }
    }

    return {
      guardrail: "Safety" as AIGuardrail,
      passed: true,
    };
  }

  private checkROEGuardrail(content: string) {
    // Check for ROE violations (simplified)
    const roeViolations = [
      "ignore roe",
      "bypass rules of engagement",
      "fire without clearance",
      "engage civilians",
    ];

    const lowerContent = content.toLowerCase();
    for (const violation of roeViolations) {
      if (lowerContent.includes(violation)) {
        return {
          guardrail: "ROE" as AIGuardrail,
          passed: false,
          reason: `Potential ROE violation detected: ${violation}`,
        };
      }
    }

    return {
      guardrail: "ROE" as AIGuardrail,
      passed: true,
    };
  }

  private checkRoleGuardrail(content: string) {
    // Role-based restrictions (would check user role in real implementation)
    return {
      guardrail: "Role" as AIGuardrail,
      passed: true,
    };
  }

  private checkEvidenceGuardrail(content: string) {
    // Check for citation requirements (simplified)
    return {
      guardrail: "Evidence" as AIGuardrail,
      passed: true,
    };
  }

  // ==========================================================================
  // CORE CHAT
  // ==========================================================================

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    // For mock mode, return a generic response
    const lastMessage = messages[messages.length - 1];

    // Check guardrails
    const guardrailResult = this.checkGuardrails(lastMessage.content);
    if (!guardrailResult.allPassed) {
      return {
        content: `I cannot process this request. ${guardrailResult.blockedReason}`,
        model: "mock",
        finishReason: "stop",
      };
    }

    // Get relevant mock response based on content
    const searchResult = getMockKnowledgeResponse(lastMessage.content);

    return {
      content: searchResult.answer,
      model: "mock-aviation-llm",
      totalTokens: 100,
      finishReason: "stop",
    };
  }

  // ==========================================================================
  // KNOWLEDGE SEARCH (SOW 6.1)
  // ==========================================================================

  async searchKnowledge(request: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse> {
    // Check guardrails
    const guardrailResult = this.checkGuardrails(request.query);
    if (!guardrailResult.allPassed) {
      return {
        query: request.query,
        answer: `I cannot search for this topic. ${guardrailResult.blockedReason}`,
        results: [],
        citations: [],
        confidence: "low",
      };
    }

    return getMockKnowledgeResponse(request.query);
  }

  // ==========================================================================
  // QUESTION GENERATION
  // ==========================================================================

  async generateQuestions(request: QuestionGenerationRequest): Promise<QuestionGenerationResponse> {
    // Check guardrails
    const guardrailResult = this.checkGuardrails(request.content);
    if (!guardrailResult.allPassed) {
      return {
        questions: [],
        topic: request.category,
        difficulty: request.difficulty,
      };
    }

    return getMockQuestionResponse(request.category, request.difficulty);
  }

  // ==========================================================================
  // CONTENT ANALYSIS
  // ==========================================================================

  async analyzeContent(request: ContentAnalysisRequest): Promise<ContentAnalysisResponse> {
    // Check guardrails
    const guardrailResult = this.checkGuardrails(request.content);
    if (!guardrailResult.allPassed) {
      return {
        analysisType: request.analysisType,
        result: {},
      };
    }

    return {
      ...mockContentAnalysis,
      analysisType: request.analysisType,
    };
  }

  // ==========================================================================
  // AGENT WORKFLOWS (SOW 6.4)
  // ==========================================================================

  // AirGroundPlanAgent
  async generateJointFirePlan(input: {
    operationType: string;
    terrain: string;
    weather: string;
    artilleryUnits: string[];
    aviationAssets: string[];
    objectives: string;
  }): Promise<JointFirePlan> {
    // Check guardrails
    const guardrailResult = this.checkGuardrails(
      JSON.stringify(input),
      ["Safety", "ROE"]
    );

    if (!guardrailResult.allPassed) {
      throw new Error(`Plan generation blocked: ${guardrailResult.blockedReason}`);
    }

    const plan = getMockJointFirePlan();

    // Customize based on input
    plan.operationType = input.operationType as "offensive" | "defensive" | "support";
    plan.terrain = input.terrain as any;
    plan.weather = input.weather as any;

    return plan;
  }

  // AirRequestAgent
  async generateAirSupportRequest(input: {
    targetDescription: string;
    targetLocation: { lat: number; lng: number };
    friendlyLocation: { lat: number; lng: number };
    supportType: string;
    priority: string;
  }): Promise<AirSupportRequest> {
    // Check guardrails
    const guardrailResult = this.checkGuardrails(
      input.targetDescription,
      ["Safety", "ROE"]
    );

    if (!guardrailResult.allPassed) {
      throw new Error(`Request generation blocked: ${guardrailResult.blockedReason}`);
    }

    const request = getMockAirSupportRequest();

    // Customize based on input
    request.target.description = input.targetDescription;
    request.target.coordinates = input.targetLocation;
    request.friendlyLocation.coordinates = input.friendlyLocation;
    request.supportRequested = input.supportType as any;
    request.priority = input.priority as any;

    return request;
  }

  // AirGroundDebriefAgent
  async generateMissionDebrief(input: {
    missionId: string;
    missionName: string;
    participants: string[];
    objectives: string;
    timeline: { time: string; event: string }[];
  }): Promise<MissionDebrief> {
    const debrief = getMockMissionDebrief();

    // Customize based on input
    debrief.missionId = input.missionId;
    debrief.missionName = input.missionName;
    debrief.summary.objective = input.objectives;

    if (input.timeline.length > 0) {
      debrief.timeline = input.timeline;
    }

    return debrief;
  }

  // SafetyReviewAgent
  async reviewPlanSafety(plan: JointFirePlan): Promise<SafetyReview> {
    const review = getMockSafetyReview();

    // Customize based on plan
    review.planId = plan.id;

    // Add specific checks based on plan content
    if (plan.weather === "fog" || plan.weather === "IMC") {
      review.checks.push({
        category: "weather",
        item: "IMC conditions detected",
        status: "warning",
        details: "Operations in IMC require special procedures",
        mitigation: "Ensure all pilots are IMC qualified",
      });
      review.riskLevel = "high";
    }

    if (plan.terrain === "mountains" || plan.terrain === "high_altitude") {
      review.checks.push({
        category: "terrain",
        item: "High altitude operations",
        status: "warning",
        details: "Reduced aircraft performance at altitude",
        mitigation: "Use altitude-optimized helicopters (LCH Prachand)",
      });
    }

    return review;
  }

  // ExplainerAgent
  async explainConcept(topic: string, level: "basic" | "intermediate" | "advanced"): Promise<string> {
    const explanations: Record<string, Record<string, string>> = {
      "cas_basics": {
        basic: "Close Air Support (CAS) is when helicopters help soldiers on the ground by attacking enemy targets that are close to friendly forces. Think of it like having a powerful friend in the sky who can see and shoot at the enemy from above.",
        intermediate: "Close Air Support (CAS) involves coordinated air attacks against hostile targets in close proximity to friendly forces. It requires detailed integration of each air mission with fire and movement of those forces. Key elements include terminal control (Type 1, 2, or 3), positive identification of targets, and clearance from ground commanders.",
        advanced: "CAS execution requires mastery of terminal attack control procedures, understanding of fire support coordination measures (ACAs, ROZs, FSCLs), and seamless integration with artillery fires. Controllers must manage the 3D battlespace to ensure deconfliction while maximizing effects on target.",
      },
      "fire_adjustment": {
        basic: "Fire adjustment is when a helicopter helps aim artillery guns. The helicopter can see where the shells land and tell the guns how to aim better - like having a spotter helping a basketball player improve their shots.",
        intermediate: "Airborne fire adjustment involves helicopter observers providing real-time corrections to artillery fires. The observer uses standard correction procedures (ADD/DROP, LEFT/RIGHT) based on observed fall of shot relative to the target.",
        advanced: "Effective airborne fire adjustment requires understanding of ballistics, meteorological effects, and observation techniques. Corrections should account for observer-target angle, terrain masking, and target movement. Helicopter positioning must balance observation requirements with threat avoidance.",
      },
    };

    const topicKey = topic.toLowerCase().includes("cas") ? "cas_basics" :
                     topic.toLowerCase().includes("fire") || topic.toLowerCase().includes("adjustment") ? "fire_adjustment" :
                     "cas_basics";

    return explanations[topicKey]?.[level] || explanations.cas_basics.basic;
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Export class for type checking
export { AIService };
