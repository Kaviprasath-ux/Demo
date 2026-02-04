// Aviation AI Mock Responses - For offline/demo use

import type {
  KnowledgeSearchResponse,
  QuestionGenerationResponse,
  JointFirePlan,
  AirSupportRequest,
  MissionDebrief,
  SafetyReview,
  ContentAnalysisResponse,
  AIHealthStatus,
  HelicopterType,
} from "./types";

// ============================================================================
// MOCK KNOWLEDGE SEARCH RESPONSES
// ============================================================================

export const mockKnowledgeResponses: Record<string, KnowledgeSearchResponse> = {
  default: {
    query: "General aviation query",
    answer: "Indian Army Aviation plays a crucial role in providing air support to ground forces. The primary helicopters include ALH Dhruv for utility operations, Rudra for armed reconnaissance and CAS, and LCH Prachand for dedicated attack missions.",
    results: [
      {
        id: "doc-1",
        title: "Army Aviation Corps Overview",
        content: "The Army Aviation Corps operates helicopters in direct support of ground forces...",
        source: "Army Aviation Doctrine Manual",
        citation: "AAC Doctrine Manual, Chapter 1, Para 1.2",
        relevanceScore: 0.95,
        metadata: {
          support_type: "CAS",
          platform_family: "rotary",
        },
      },
    ],
    citations: ["AAC Doctrine Manual, Chapter 1"],
    confidence: "high",
  },

  cas_procedures: {
    query: "CAS procedures",
    answer: "Close Air Support (CAS) procedures involve coordinated air attacks against hostile targets in close proximity to friendly forces. Key elements include positive identification of targets, clearance from ground commanders, and precise coordination with artillery fires to ensure airspace deconfliction.",
    results: [
      {
        id: "doc-2",
        title: "CAS Doctrine and Procedures",
        content: "CAS missions require detailed coordination between air and ground elements...",
        source: "Joint Fire Support Manual",
        citation: "JFSM Ch 4, Para 4.15-4.20",
        relevanceScore: 0.98,
        metadata: {
          support_type: "CAS",
          mission_type: "offensive_support",
        },
      },
      {
        id: "doc-3",
        title: "Type 1, 2, 3 Control Procedures",
        content: "Terminal attack control is categorized into three types based on risk...",
        source: "CAS Procedures Handbook",
        citation: "CAS Handbook, Section 3.2",
        relevanceScore: 0.92,
        metadata: {
          support_type: "CAS",
        },
      },
    ],
    citations: ["JFSM Ch 4", "CAS Procedures Handbook"],
    confidence: "high",
  },

  fire_adjustment: {
    query: "Fire adjustment from helicopter",
    answer: "Helicopter-based fire adjustment involves airborne observers providing real-time corrections to artillery fires. The observer identifies the target, relays initial fire request, observes fall of shot, and provides corrections using standard adjustment procedures (ADD/DROP, LEFT/RIGHT).",
    results: [
      {
        id: "doc-4",
        title: "Airborne Fire Adjustment Procedures",
        content: "When adjusting artillery fire from a helicopter, the observer must...",
        source: "Artillery-Aviation Coordination SOP",
        citation: "Arty-Avn SOP, Para 5.8",
        relevanceScore: 0.96,
        metadata: {
          support_type: "ISR",
          mission_type: "defensive_fire_adjustment",
        },
      },
    ],
    citations: ["Arty-Avn SOP, Para 5.8"],
    confidence: "high",
  },

  rudra_capabilities: {
    query: "Rudra helicopter capabilities",
    answer: "The HAL Rudra (ALH WSI - Weapon System Integrated) is the weaponized variant of the ALH Dhruv. It is equipped with a 20mm turret gun, 70mm rocket pods, air-to-air missiles (Mistral), and anti-tank guided missiles (Helina/SANT). The Rudra forms the core of Army Aviation's attack/escort capability.",
    results: [
      {
        id: "doc-5",
        title: "HAL Rudra Technical Manual",
        content: "The Rudra WSI is designed for armed reconnaissance and close air support...",
        source: "Rudra Technical Documentation",
        citation: "Rudra TM, Section 1.4",
        relevanceScore: 0.99,
        metadata: {
          helicopter_type: ["Rudra_WSI"],
          support_type: "CAS",
        },
      },
    ],
    citations: ["Rudra TM, Section 1.4"],
    confidence: "high",
  },

  airspace_coordination: {
    query: "Airspace coordination with artillery",
    answer: "Airspace coordination between artillery and aviation is critical for safe operations. Key measures include establishing Airspace Coordination Areas (ACAs), defining minimum safe altitudes, time-based separation, and using Fire Support Coordination Lines (FSCLs) to delineate areas of responsibility.",
    results: [
      {
        id: "doc-6",
        title: "Airspace Coordination Measures",
        content: "Effective joint fires require meticulous airspace coordination...",
        source: "Joint Fire Support Doctrine",
        citation: "JFSD Ch 6, Para 6.12-6.18",
        relevanceScore: 0.97,
        metadata: {
          mission_type: "offensive_support",
        },
      },
    ],
    citations: ["JFSD Ch 6"],
    confidence: "high",
  },
};

// ============================================================================
// MOCK QUESTION GENERATION
// ============================================================================

export const mockQuestionResponses: Record<string, QuestionGenerationResponse> = {
  cas_basic: {
    questions: [
      {
        id: "q1",
        type: "mcq",
        difficulty: "basic",
        question: "What is the primary purpose of Close Air Support (CAS)?",
        options: [
          "Strategic bombing of enemy infrastructure",
          "Air attacks against hostile targets in close proximity to friendly forces",
          "Air superiority missions",
          "Transport of troops behind enemy lines",
        ],
        correctAnswer: "Air attacks against hostile targets in close proximity to friendly forces",
        explanation: "CAS is defined as air action against hostile targets in close proximity to friendly forces, requiring detailed integration with ground forces' fire and movement.",
        topic: "CAS Doctrine",
        citation: "JFSM Ch 4, Para 4.1",
      },
      {
        id: "q2",
        type: "mcq",
        difficulty: "basic",
        question: "Which type of terminal attack control requires the pilot to visually acquire the target AND the friendly position?",
        options: ["Type 1", "Type 2", "Type 3", "Type 4"],
        correctAnswer: "Type 1",
        explanation: "Type 1 control is the most restrictive, requiring visual acquisition of both target and friendlies.",
        topic: "CAS Control Types",
        citation: "CAS Handbook, Section 3.2",
      },
      {
        id: "q3",
        type: "true_false",
        difficulty: "basic",
        question: "In joint fire support operations, artillery fires must always stop when helicopters enter the airspace.",
        correctAnswer: "False",
        explanation: "Proper airspace coordination allows simultaneous artillery and aviation operations through measures like time separation, altitude separation, or lateral separation.",
        topic: "Fire-Air Coordination",
        citation: "JFSD Ch 6, Para 6.15",
      },
    ],
    topic: "CAS Operations",
    difficulty: "basic",
  },

  helicopter_systems: {
    questions: [
      {
        id: "q4",
        type: "mcq",
        difficulty: "intermediate",
        question: "Which helicopter in Indian Army Aviation is specifically designed for high-altitude combat operations?",
        options: ["ALH Dhruv", "HAL Rudra", "HAL LCH Prachand", "Chetak"],
        correctAnswer: "HAL LCH Prachand",
        explanation: "The LCH Prachand is specifically designed for high-altitude combat, with enhanced performance at altitudes above 15,000 feet.",
        topic: "Helicopter Systems",
        citation: "AAC Equipment Manual, Ch 4",
      },
      {
        id: "q5",
        type: "mcq",
        difficulty: "intermediate",
        question: "What is the primary anti-tank missile integrated on the HAL Rudra?",
        options: ["Hellfire", "Helina/SANT", "TOW", "Spike"],
        correctAnswer: "Helina/SANT",
        explanation: "The Helina (Helicopter-launched NAG) and SANT are indigenous ATGMs integrated on the Rudra.",
        topic: "Weapons Systems",
        citation: "Rudra TM, Section 2.3",
      },
    ],
    topic: "Helicopter Systems",
    difficulty: "intermediate",
  },
};

// ============================================================================
// MOCK JOINT FIRE PLAN
// ============================================================================

export const mockJointFirePlan: JointFirePlan = {
  id: "jfp-001",
  missionName: "Operation Steel Thunder",
  operationType: "offensive",
  terrain: "mountains",
  weather: "clear",
  dayNight: "day",

  artilleryUnits: [
    {
      unit: "Alpha Battery, 155 Medium Regiment",
      weaponSystem: "Bofors FH-77B",
      position: { lat: 34.0522, lng: 74.7889 },
      firingArcs: { min: 45, max: 135 },
    },
    {
      unit: "Bravo Battery, 155 Medium Regiment",
      weaponSystem: "K9 Vajra",
      position: { lat: 34.0612, lng: 74.7956 },
      firingArcs: { min: 30, max: 120 },
    },
  ],

  aviationAssets: [
    {
      callsign: "Viper 1",
      helicopterType: "Rudra_WSI",
      role: "CAS",
      ingress: [
        { lat: 34.0322, lng: 74.7589 },
        { lat: 34.0422, lng: 74.7689 },
      ],
      egress: [
        { lat: 34.0622, lng: 74.8089 },
        { lat: 34.0722, lng: 74.8189 },
      ],
      holdingArea: { lat: 34.0222, lng: 74.7489 },
    },
    {
      callsign: "Eagle 2",
      helicopterType: "LCH_Prachand",
      role: "CAS",
      ingress: [
        { lat: 34.0352, lng: 74.7619 },
        { lat: 34.0452, lng: 74.7719 },
      ],
      egress: [
        { lat: 34.0652, lng: 74.8119 },
        { lat: 34.0752, lng: 74.8219 },
      ],
    },
  ],

  timings: {
    hHour: "0600Z",
    artilleryStart: "0545Z",
    artilleryEnd: "0615Z",
    aviationOnStation: "0600Z",
    aviationOffStation: "0645Z",
  },

  airspaceCoordinationMeasures: [
    {
      type: "ACA",
      name: "ACA Alpha",
      coordinates: [
        { lat: 34.0400, lng: 74.7700 },
        { lat: 34.0500, lng: 74.7800 },
        { lat: 34.0500, lng: 74.8000 },
        { lat: 34.0400, lng: 74.7900 },
      ],
      altitudeMin: 0,
      altitudeMax: 3000,
      timeFrom: "0545Z",
      timeTo: "0615Z",
    },
  ],

  noFireZones: [
    {
      name: "NFZ-Village",
      coordinates: [
        { lat: 34.0550, lng: 74.7850 },
        { lat: 34.0560, lng: 74.7860 },
        { lat: 34.0560, lng: 74.7870 },
        { lat: 34.0550, lng: 74.7860 },
      ],
      reason: "Civilian population center",
    },
  ],

  fireSupportCoordinationLine: {
    name: "FSCL Bravo",
    coordinates: [
      { lat: 34.0700, lng: 74.7600 },
      { lat: 34.0700, lng: 74.8200 },
    ],
  },

  communications: {
    primaryFreq: "243.0 MHz",
    alternateFreq: "121.5 MHz",
    emergencyFreq: "243.0 MHz",
    callsigns: {
      artilleryCommand: "Thunder 6",
      aviationLead: "Viper 1",
      fac: "Spotlight 1",
      toc: "Granite Base",
    },
  },

  safetyNotes: [
    "Maintain 1000ft AGL minimum altitude during artillery fires",
    "Aviation to hold at designated holding area during artillery prep",
    "Immediate abort if weather deteriorates below VMC",
    "All aircraft to squawk assigned IFF codes",
  ],

  citations: [
    "JFSM Ch 4, Para 4.15-4.20",
    "Arty-Avn SOP, Section 5",
    "AAC Standing Orders, Ch 8",
  ],

  generatedAt: new Date().toISOString(),
};

// ============================================================================
// MOCK AIR SUPPORT REQUEST
// ============================================================================

export const mockAirSupportRequest: AirSupportRequest = {
  id: "asr-001",
  requestType: "immediate",
  priority: "priority",

  target: {
    description: "Enemy armoured vehicles in assembly area",
    gridReference: "NH 4523 7891",
    coordinates: { lat: 34.0580, lng: 74.7920 },
    elevation: 2450,
    targetType: "vehicle",
    remarks: "Estimated 4-6 vehicles, stationary",
  },

  friendlyLocation: {
    gridReference: "NH 4518 7885",
    coordinates: { lat: 34.0560, lng: 74.7880 },
    marking: "VS-17 panel",
  },

  supportRequested: "CAS",
  preferredHelicopter: "Rudra_WSI",
  weaponsRequested: ["ATGMs", "Rockets"],

  timeOnTarget: "As soon as possible",

  terminalControl: "Type2",
  controllerCallsign: "Spotlight 1",

  threats: ["Possible MANPADS", "Small arms"],
  remarks: "Targets in defilade, attack from east recommended",

  citations: ["CAS Request Format, Annex A"],
  generatedAt: new Date().toISOString(),
};

// ============================================================================
// MOCK MISSION DEBRIEF
// ============================================================================

export const mockMissionDebrief: MissionDebrief = {
  id: "deb-001",
  missionId: "jfp-001",
  missionName: "Operation Steel Thunder",
  date: new Date().toISOString().split("T")[0],

  participants: [
    {
      role: "Aviation Lead",
      callsign: "Viper 1",
      personnel: ["Capt. Singh", "Lt. Kumar"],
    },
    {
      role: "FAC/JTAC",
      callsign: "Spotlight 1",
      personnel: ["Maj. Sharma"],
    },
    {
      role: "Artillery Commander",
      callsign: "Thunder 6",
      personnel: ["Lt. Col. Patel"],
    },
  ],

  summary: {
    objective: "Neutralize enemy armoured concentration in Grid NH 4523",
    objectiveAchieved: "yes",
    duration: 45,
    sortiesFlown: 2,
    roundsExpended: 156,
  },

  timeline: [
    { time: "0545Z", event: "Artillery prep commenced" },
    { time: "0600Z", event: "Aviation flight arrived on station" },
    { time: "0610Z", event: "First target engagement by Viper 1" },
    { time: "0615Z", event: "Artillery shifted to alternate targets" },
    { time: "0625Z", event: "BDA confirmed 4 vehicles destroyed" },
    { time: "0640Z", event: "Aviation RTB" },
  ],

  assessment: {
    airGroundCoordination: 4,
    communicationEffectiveness: 5,
    targetEngagement: 4,
    safetyCompliance: 5,
    overallRating: 4,
  },

  lessonsLearned: [
    {
      category: "sustain",
      description: "Excellent pre-mission coordination between artillery and aviation",
      recommendation: "Continue detailed joint planning process",
    },
    {
      category: "improve",
      description: "Initial target handoff took longer than expected",
      recommendation: "Practice talk-on procedures in simulator",
    },
    {
      category: "fix",
      description: "Backup radio frequency was not tested pre-mission",
      recommendation: "Add comm check to pre-mission checklist",
    },
  ],

  safetyIncidents: [],

  citations: ["Debrief Format, Annex B"],
  generatedAt: new Date().toISOString(),
};

// ============================================================================
// MOCK SAFETY REVIEW
// ============================================================================

export const mockSafetyReview: SafetyReview = {
  id: "sr-001",
  planId: "jfp-001",

  overallSafe: true,
  riskLevel: "medium",

  checks: [
    {
      category: "airspace",
      item: "Altitude separation during artillery fires",
      status: "pass",
      details: "1000ft AGL minimum maintained, artillery max ord 2500ft",
    },
    {
      category: "airspace",
      item: "Ingress/Egress routes clear of artillery gun-target line",
      status: "pass",
      details: "Routes offset 2km from GTL",
    },
    {
      category: "artillery",
      item: "Artillery safety arcs",
      status: "pass",
      details: "All firing arcs clear of aviation routes",
    },
    {
      category: "weather",
      item: "Weather minimums",
      status: "warning",
      details: "Forecast shows possible reduction in visibility after 0700Z",
      mitigation: "Complete operations by 0645Z, have alternate recovery site",
    },
    {
      category: "terrain",
      item: "Obstacle clearance",
      status: "pass",
      details: "All routes clear of terrain obstacles with 500ft margin",
    },
    {
      category: "roe",
      item: "NFZ compliance",
      status: "pass",
      details: "All engagement areas outside designated NFZs",
    },
    {
      category: "communications",
      item: "Communication redundancy",
      status: "warning",
      details: "Only two frequencies assigned",
      mitigation: "Add HF backup frequency",
    },
  ],

  airspaceConflicts: [],

  artillerySafetyArcs: [
    {
      unit: "Alpha Battery",
      conflictWithFlightPath: false,
    },
    {
      unit: "Bravo Battery",
      conflictWithFlightPath: false,
    },
  ],

  weatherConcerns: [
    {
      condition: "Possible visibility reduction",
      impact: "May require early termination",
      recommendation: "Monitor weather closely, have abort criteria defined",
    },
  ],

  roeCompliance: [
    {
      rule: "PID requirement",
      compliant: true,
      details: "Type 2 control ensures PID before weapons release",
    },
    {
      rule: "Civilian protection",
      compliant: true,
      details: "NFZ around village established",
    },
  ],

  overallRecommendation: "approve_with_changes",
  requiredChanges: [
    "Add HF backup frequency to communications plan",
    "Define specific weather abort criteria",
  ],

  citations: ["Safety Review Checklist, Annex C"],
  generatedAt: new Date().toISOString(),
};

// ============================================================================
// MOCK CONTENT ANALYSIS
// ============================================================================

export const mockContentAnalysis: ContentAnalysisResponse = {
  analysisType: "extract-topics",
  result: {
    topics: [
      "Close Air Support procedures",
      "Artillery-Aviation coordination",
      "Airspace management",
      "Target acquisition",
      "Fire adjustment",
    ],
    concepts: [
      { name: "CAS", description: "Close Air Support - air attacks near friendly forces" },
      { name: "FSCL", description: "Fire Support Coordination Line" },
      { name: "ACA", description: "Airspace Coordination Area" },
    ],
    tags: [
      { tag: "CAS", confidence: 0.95 },
      { tag: "Joint Operations", confidence: 0.90 },
      { tag: "Fire Support", confidence: 0.88 },
    ],
  },
};

// ============================================================================
// MOCK HEALTH STATUS
// ============================================================================

export const mockHealthStatus: AIHealthStatus = {
  status: "healthy",
  provider: "mock",
  model: "mock-aviation-llm",
  latency: 50,
  lastCheck: new Date().toISOString(),
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMockKnowledgeResponse(query: string): KnowledgeSearchResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("cas") || lowerQuery.includes("close air support")) {
    return mockKnowledgeResponses.cas_procedures;
  }
  if (lowerQuery.includes("fire adjustment") || lowerQuery.includes("artillery")) {
    return mockKnowledgeResponses.fire_adjustment;
  }
  if (lowerQuery.includes("rudra")) {
    return mockKnowledgeResponses.rudra_capabilities;
  }
  if (lowerQuery.includes("airspace") || lowerQuery.includes("coordination")) {
    return mockKnowledgeResponses.airspace_coordination;
  }

  return {
    ...mockKnowledgeResponses.default,
    query,
    answer: `Based on available doctrine and SOPs regarding "${query}": ${mockKnowledgeResponses.default.answer}`,
  };
}

export function getMockQuestionResponse(
  category: string,
  difficulty: string
): QuestionGenerationResponse {
  if (category.toLowerCase().includes("helicopter") || category.toLowerCase().includes("system")) {
    return mockQuestionResponses.helicopter_systems;
  }
  return mockQuestionResponses.cas_basic;
}

export function getMockJointFirePlan(): JointFirePlan {
  return {
    ...mockJointFirePlan,
    id: `jfp-${Date.now()}`,
    generatedAt: new Date().toISOString(),
  };
}

export function getMockAirSupportRequest(): AirSupportRequest {
  return {
    ...mockAirSupportRequest,
    id: `asr-${Date.now()}`,
    generatedAt: new Date().toISOString(),
  };
}

export function getMockMissionDebrief(): MissionDebrief {
  return {
    ...mockMissionDebrief,
    id: `deb-${Date.now()}`,
    generatedAt: new Date().toISOString(),
  };
}

export function getMockSafetyReview(): SafetyReview {
  return {
    ...mockSafetyReview,
    id: `sr-${Date.now()}`,
    generatedAt: new Date().toISOString(),
  };
}
