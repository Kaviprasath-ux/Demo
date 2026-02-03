// AI Configuration - SOW Section 8.1: Embedded Offline LLM

import { LLMConfig } from "./types";

// Default configuration for Ollama (offline LLM)
export const defaultOllamaConfig: LLMConfig = {
  provider: "ollama",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3.2",
  timeout: 60000, // 60 seconds for complex queries
  maxRetries: 2,
};

// Mock configuration (fallback when Ollama unavailable)
export const mockConfig: LLMConfig = {
  provider: "mock",
  baseUrl: "",
  model: "mock-llm",
  timeout: 1000,
  maxRetries: 0,
};

// Get active configuration
export function getActiveConfig(): LLMConfig {
  // In browser, always use mock (API calls go through routes)
  if (typeof window !== "undefined") {
    return mockConfig;
  }

  // On server, check environment
  const useMock = process.env.USE_MOCK_LLM === "true";
  return useMock ? mockConfig : defaultOllamaConfig;
}

// System prompts for different use cases
export const systemPrompts = {
  questionGeneration: `You are an expert military instructor at the School of Artillery, Deolali, Indian Army.
Your task is to generate assessment questions from doctrinal content.
You specialize in artillery systems including Dhanush, Bofors, K9 Vajra, ATAGS, and Pinaka.
Generate questions that test understanding of gunnery principles, safety procedures, and tactical employment.
Always ensure questions are factually accurate and appropriate for military training.`,

  knowledgeSearch: `You are a knowledgeable assistant for artillery doctrine and gunnery procedures.
Answer questions accurately based on Indian Army artillery doctrine, firing tables, and SOPs.
If you are uncertain about specific details, acknowledge the limitation.
Provide clear, concise answers suitable for military training contexts.`,

  contentAnalysis: `You are a content analysis specialist for military educational materials.
Extract key topics, concepts, and learning objectives from doctrinal content.
Identify relevant weapon systems, operation types, and training categories.
Tag content appropriately for course mapping (YO, LGSC, STA, JCO courses).`,

  rubricGeneration: `You are an assessment design expert for military education.
Create detailed rubrics for evaluating subjective answers in artillery training.
Consider factors like doctrinal accuracy, tactical soundness, safety awareness, and clarity of expression.
Rubrics should have clear criteria and scoring levels.`,
};

// Artillery-specific context for better responses
export const artilleryContext = {
  weaponSystems: [
    "105mm Indian Field Gun",
    "105mm Light Field Gun",
    "130mm M-46 Gun",
    "155mm Bofors FH-77B",
    "155mm Dhanush",
    "155mm K9 Vajra",
    "155mm ATAGS",
    "Pinaka MBRL",
  ],

  courseTypes: [
    "Young Officers (YO)",
    "Long Gunnery Staff Course (LGSC)",
    "STA Course",
    "JCO Technical Course",
    "OR Upgrading Cadre",
  ],

  topicCategories: [
    "Gunnery Theory",
    "Fire Control",
    "Gun Drill",
    "Safety Procedures",
    "Tactical Employment",
    "Survey & Positioning",
    "Ammunition",
    "Equipment Maintenance",
  ],

  operationTypes: [
    "Direct Fire",
    "Indirect Fire",
    "Defensive Fire",
    "Offensive Fire",
    "Counter-Battery",
    "Illumination",
    "Smoke Screen",
  ],
};
