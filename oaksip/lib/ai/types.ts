// AI/LLM Types - SOW Section 8.1: AI-Driven Question-Answer Engine

export interface LLMConfig {
  provider: "ollama" | "mock";
  baseUrl: string;
  model: string;
  timeout: number;
  maxRetries: number;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  model: string;
  totalTokens?: number;
  finishReason?: "stop" | "length" | "error";
}

export interface LLMError {
  code: "CONNECTION_ERROR" | "TIMEOUT" | "MODEL_NOT_FOUND" | "INVALID_REQUEST" | "UNKNOWN";
  message: string;
  details?: string;
}

// Question generation types
export interface QuestionGenerationRequest {
  content: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  questionTypes: QuestionType[];
  count: number;
  weaponSystem?: string;
  courseType?: string;
}

export type QuestionType =
  | "mcq"
  | "true-false"
  | "fill-blank"
  | "matching"
  | "numerical"
  | "short-answer"
  | "essay"
  | "tactical-appreciation";

export interface GeneratedQuestion {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: "basic" | "intermediate" | "advanced";
  topic: string;
  weaponSystem?: string;
  rubric?: QuestionRubric;
}

export interface QuestionRubric {
  criteria: RubricCriterion[];
  maxScore: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  description: string;
}

// Knowledge search types
export interface KnowledgeSearchRequest {
  query: string;
  category?: string;
  weaponSystem?: string;
  maxResults?: number;
}

export interface KnowledgeSearchResult {
  answer: string;
  confidence: number;
  sources: KnowledgeSource[];
  relatedTopics: string[];
}

export interface KnowledgeSource {
  title: string;
  section?: string;
  relevance: number;
}

// Content analysis types
export interface ContentAnalysisRequest {
  content: string;
  analysisType: "extract-topics" | "generate-summary" | "identify-concepts" | "tag-content";
}

export interface ContentAnalysisResult {
  topics?: string[];
  summary?: string;
  concepts?: string[];
  tags?: ContentTag[];
}

export interface ContentTag {
  name: string;
  category: "weapon-system" | "operation-type" | "topic" | "course";
  confidence: number;
}

// Health check
export interface LLMHealthStatus {
  available: boolean;
  provider: string;
  model: string;
  latencyMs?: number;
  error?: string;
}
