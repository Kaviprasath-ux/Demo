// Aviation AI Types - SOW 6.3, 6.4, 6.6

// ============================================================================
// CORE LLM TYPES
// ============================================================================

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

export interface LLMResponse {
  content: string;
  model: string;
  totalTokens?: number;
  finishReason?: "stop" | "length" | "error";
}

// ============================================================================
// AVIATION-SPECIFIC METADATA (SOW 6.6 Dataset Factory)
// ============================================================================

export type SupportType = "ISR" | "CAS" | "CASEVAC" | "transport" | "escort" | "reconnaissance";

export type PlatformFamily = "rotary" | "fixed-wing" | "UAV";

export type HelicopterType =
  | "ALH_Dhruv"
  | "Rudra_WSI"
  | "LCH_Prachand"
  | "Apache_AH64E"
  | "Chetak"
  | "Cheetah";

export type MissionType =
  | "offensive_support"
  | "defensive_fire_adjustment"
  | "HADR"
  | "high_altitude_support"
  | "anti_armour"
  | "armed_reconnaissance"
  | "troop_insertion"
  | "logistics";

export type TerrainType = "plains" | "mountains" | "urban" | "desert" | "jungle" | "maritime" | "high_altitude";

export type WeatherCondition = "VMC" | "IMC" | "clear" | "rain" | "fog" | "snow" | "dust";

export type DayNight = "day" | "night" | "dusk_dawn" | "NVG";

export type Classification = "unclassified" | "restricted" | "confidential" | "secret";

export interface AviationDocumentMetadata {
  support_type: SupportType;
  platform_family: PlatformFamily;
  helicopter_type: HelicopterType[];
  mission_type: MissionType;
  terrain: TerrainType;
  weather: WeatherCondition;
  day_night: DayNight;
  classification: Classification;
}

// ============================================================================
// AI GUARDRAILS (SOW 6.3.2)
// ============================================================================

export type AIGuardrail = "Safety" | "ROE" | "Role" | "Evidence";

export interface GuardrailCheck {
  guardrail: AIGuardrail;
  passed: boolean;
  reason?: string;
  citation?: string;
}

export interface GuardrailResult {
  allPassed: boolean;
  checks: GuardrailCheck[];
  blockedReason?: string;
}

// ============================================================================
// AGENT WORKFLOW TYPES (SOW 6.4)
// ============================================================================

export type AgentType =
  | "AirGroundPlanAgent"
  | "AirRequestAgent"
  | "AirGroundDebriefAgent"
  | "SafetyReviewAgent"
  | "ExplainerAgent";

export interface AgentWorkflow {
  id: string;
  name: string;
  agent: AgentType;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed" | "blocked";
  guardrailsApplied: AIGuardrail[];
  guardrailResult?: GuardrailResult;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// ============================================================================
// JOINT FIRE PLAN (AirGroundPlanAgent Output)
// ============================================================================

export interface JointFirePlan {
  id: string;
  missionName: string;
  operationType: "offensive" | "defensive" | "support";
  terrain: TerrainType;
  weather: WeatherCondition;
  dayNight: DayNight;

  // Artillery component
  artilleryUnits: {
    unit: string;
    weaponSystem: string;
    position: { lat: number; lng: number };
    firingArcs: { min: number; max: number };
  }[];

  // Aviation component
  aviationAssets: {
    callsign: string;
    helicopterType: HelicopterType;
    role: SupportType;
    ingress: { lat: number; lng: number }[];
    egress: { lat: number; lng: number }[];
    holdingArea?: { lat: number; lng: number };
  }[];

  // Coordination
  timings: {
    hHour: string;
    artilleryStart: string;
    artilleryEnd: string;
    aviationOnStation: string;
    aviationOffStation: string;
  };

  airspaceCoordinationMeasures: {
    type: "ROZ" | "HIDACZ" | "ACA" | "SAAFR" | "LLTR";
    name: string;
    coordinates: { lat: number; lng: number }[];
    altitudeMin: number;
    altitudeMax: number;
    timeFrom: string;
    timeTo: string;
  }[];

  noFireZones: {
    name: string;
    coordinates: { lat: number; lng: number }[];
    reason: string;
  }[];

  fireSupportCoordinationLine?: {
    name: string;
    coordinates: { lat: number; lng: number }[];
  };

  communications: {
    primaryFreq: string;
    alternateFreq: string;
    emergencyFreq: string;
    callsigns: Record<string, string>;
  };

  safetyNotes: string[];
  citations: string[];
  generatedAt: string;
}

// ============================================================================
// AIR SUPPORT REQUEST (AirRequestAgent Output)
// ============================================================================

export interface AirSupportRequest {
  id: string;
  requestType: "immediate" | "preplanned";
  priority: "urgent" | "priority" | "routine";

  // Target info
  target: {
    description: string;
    gridReference: string;
    coordinates: { lat: number; lng: number };
    elevation: number;
    targetType: "personnel" | "vehicle" | "structure" | "area";
    remarks?: string;
  };

  // Friendly info
  friendlyLocation: {
    gridReference: string;
    coordinates: { lat: number; lng: number };
    marking?: string;
  };

  // Requested support
  supportRequested: SupportType;
  preferredHelicopter?: HelicopterType;
  weaponsRequested?: string[];

  // Timing
  timeOnTarget?: string;
  timeWindow?: { from: string; to: string };

  // Control
  terminalControl: "Type1" | "Type2" | "Type3";
  controllerCallsign: string;

  // Additional
  threats?: string[];
  remarks?: string;

  citations: string[];
  generatedAt: string;
}

// ============================================================================
// MISSION DEBRIEF (AirGroundDebriefAgent Output)
// ============================================================================

export interface MissionDebrief {
  id: string;
  missionId: string;
  missionName: string;
  date: string;

  // Participants
  participants: {
    role: string;
    callsign: string;
    personnel: string[];
  }[];

  // Mission summary
  summary: {
    objective: string;
    objectiveAchieved: "yes" | "partial" | "no";
    duration: number; // minutes
    sortiesFlown: number;
    roundsExpended?: number;
  };

  // Timeline
  timeline: {
    time: string;
    event: string;
    remarks?: string;
  }[];

  // Assessment
  assessment: {
    airGroundCoordination: 1 | 2 | 3 | 4 | 5;
    communicationEffectiveness: 1 | 2 | 3 | 4 | 5;
    targetEngagement: 1 | 2 | 3 | 4 | 5;
    safetyCompliance: 1 | 2 | 3 | 4 | 5;
    overallRating: 1 | 2 | 3 | 4 | 5;
  };

  // Lessons learned
  lessonsLearned: {
    category: "sustain" | "improve" | "fix";
    description: string;
    recommendation?: string;
  }[];

  // Safety
  safetyIncidents: {
    type: string;
    description: string;
    severity: "minor" | "moderate" | "serious";
    actionTaken: string;
  }[];

  citations: string[];
  generatedAt: string;
}

// ============================================================================
// SAFETY REVIEW (SafetyReviewAgent Output)
// ============================================================================

export interface SafetyReview {
  id: string;
  planId: string;

  overallSafe: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";

  checks: {
    category: "airspace" | "artillery" | "weather" | "terrain" | "roe" | "communications";
    item: string;
    status: "pass" | "warning" | "fail";
    details: string;
    mitigation?: string;
  }[];

  airspaceConflicts: {
    description: string;
    severity: "minor" | "major" | "critical";
    recommendation: string;
  }[];

  artillerySafetyArcs: {
    unit: string;
    conflictWithFlightPath: boolean;
    details?: string;
  }[];

  weatherConcerns: {
    condition: string;
    impact: string;
    recommendation: string;
  }[];

  roeCompliance: {
    rule: string;
    compliant: boolean;
    details?: string;
  }[];

  overallRecommendation: "approve" | "approve_with_changes" | "reject";
  requiredChanges?: string[];

  citations: string[];
  generatedAt: string;
}

// ============================================================================
// KNOWLEDGE SEARCH TYPES (SOW 6.1)
// ============================================================================

export interface KnowledgeSearchRequest {
  query: string;
  category?: string;
  helicopterType?: HelicopterType;
  missionType?: MissionType;
  maxResults?: number;
}

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  citation: string;
  relevanceScore: number;
  metadata: Partial<AviationDocumentMetadata>;
}

export interface KnowledgeSearchResponse {
  query: string;
  answer: string;
  results: KnowledgeSearchResult[];
  citations: string[];
  confidence: "high" | "medium" | "low";
}

// ============================================================================
// QUESTION GENERATION TYPES
// ============================================================================

export type QuestionType = "mcq" | "true_false" | "short_answer" | "essay" | "practical";

export type DifficultyLevel = "basic" | "intermediate" | "advanced" | "expert";

export interface QuestionGenerationRequest {
  content: string;
  category: string;
  difficulty: DifficultyLevel;
  questionTypes: QuestionType[];
  count: number;
  helicopterType?: HelicopterType;
  courseType?: string;
}

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  citation?: string;
}

export interface QuestionGenerationResponse {
  questions: GeneratedQuestion[];
  topic: string;
  difficulty: DifficultyLevel;
}

// ============================================================================
// CONTENT ANALYSIS TYPES
// ============================================================================

export type AnalysisType = "extract-topics" | "generate-summary" | "identify-concepts" | "tag-content";

export interface ContentAnalysisRequest {
  content: string;
  analysisType: AnalysisType;
}

export interface ContentAnalysisResponse {
  analysisType: AnalysisType;
  result: {
    topics?: string[];
    summary?: string;
    concepts?: { name: string; description: string }[];
    tags?: { tag: string; confidence: number }[];
  };
}

// ============================================================================
// AI SERVICE HEALTH
// ============================================================================

export interface AIHealthStatus {
  status: "healthy" | "degraded" | "offline";
  provider: "ollama" | "mock";
  model?: string;
  latency?: number;
  lastCheck: string;
}
