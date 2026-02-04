// Aviation AI Configuration - SOW 6.3

import type { LLMConfig } from "./types";

// ============================================================================
// LLM CONFIGURATION
// ============================================================================

export const defaultConfig: LLMConfig = {
  provider: "mock", // Using mock data as per requirement
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3.2",
  timeout: 60000,
  maxRetries: 2,
};

// ============================================================================
// AVIATION CONTEXT (SOW Annexure G)
// ============================================================================

export const aviationContext = {
  // Indian Army Helicopter Types
  helicopterTypes: [
    {
      id: "ALH_Dhruv",
      name: "HAL ALH Dhruv",
      role: "Utility / multi-role",
      description: "Troop transport, logistics, CASEVAC, SAR, surveillance. Backbone of Army Aviation for high-altitude support.",
    },
    {
      id: "Rudra_WSI",
      name: "HAL Rudra (ALH WSI)",
      role: "Weaponised ALH / Attack",
      description: "Armed reconnaissance, CAS, limited anti-armour. Carries 20mm gun, 70mm rockets, AAMs and ATGMs (Helina).",
    },
    {
      id: "LCH_Prachand",
      name: "HAL LCH Prachand",
      role: "Light Combat Helicopter",
      description: "Dedicated attack platform for high-altitude combat. Anti-armour missiles, rockets, gun and advanced sensors.",
    },
    {
      id: "Apache_AH64E",
      name: "Apache AH-64E",
      role: "Heavy Attack Helicopter",
      description: "Heavily armed with Hellfire missiles, 30mm chain gun. High-end CAS and anti-armour capability.",
    },
    {
      id: "Chetak",
      name: "Chetak",
      role: "Light Utility / Reconnaissance",
      description: "Legacy helicopter for observation and light transport, particularly in high-altitude and remote areas.",
    },
    {
      id: "Cheetah",
      name: "Cheetah",
      role: "Light Utility / Liaison",
      description: "Light helicopter for observation, liaison, and limited transport. Artillery OP roles support.",
    },
  ],

  // Mission Types
  missionTypes: [
    "Close Air Support (CAS)",
    "Reconnaissance & Surveillance",
    "Target Acquisition & Fire Adjustment",
    "Troop Transport & Insertion",
    "CASEVAC / MEDEVAC",
    "Logistics Support",
    "Armed Escort",
    "Search and Rescue (SAR)",
    "Nap-of-Earth (NOE) Operations",
    "Night / NVG Operations",
    "High-Altitude Operations",
    "Anti-Armour Operations",
  ],

  // Support Types for Artillery Integration
  supportTypes: [
    "ISR - Intelligence, Surveillance, Reconnaissance",
    "CAS - Close Air Support",
    "CASEVAC - Casualty Evacuation",
    "Transport - Troop/Equipment Movement",
    "Escort - Armed Escort for Convoys",
    "Fire Adjustment - Artillery Spotting & Correction",
  ],

  // Course Types
  courseTypes: [
    "Basic Flight Training",
    "Advanced Flight Training",
    "CAS Training",
    "Joint Operations Training",
    "Night/NVG Qualification",
    "High-Altitude Training",
    "Weapons Employment Course",
    "Instructor Qualification",
    "FOO/JTAC Coordination Course",
  ],

  // Topic Categories
  topicCategories: [
    "Flight Procedures",
    "Navigation & Terrain Following",
    "Weapons Systems",
    "Emergency Procedures",
    "CAS Doctrine & TTPs",
    "Air-Ground Coordination",
    "Artillery Fire Adjustment",
    "Airspace Management",
    "Night/NVG Operations",
    "High-Altitude Operations",
    "Weather Minimums",
    "ROE & Safety",
    "Communications Procedures",
  ],

  // Terrain Types
  terrainTypes: [
    { id: "plains", name: "Plains", description: "Flat terrain with good visibility" },
    { id: "mountains", name: "Mountains", description: "High-altitude mountainous terrain" },
    { id: "urban", name: "Urban", description: "Built-up areas with structures" },
    { id: "desert", name: "Desert", description: "Arid terrain with sand/dust" },
    { id: "jungle", name: "Jungle", description: "Dense vegetation and forest" },
    { id: "maritime", name: "Maritime", description: "Coastal and naval operations" },
    { id: "high_altitude", name: "High-Altitude", description: "Above 10,000ft operations" },
  ],

  // Weather Conditions
  weatherConditions: [
    { id: "VMC", name: "VMC", description: "Visual Meteorological Conditions" },
    { id: "IMC", name: "IMC", description: "Instrument Meteorological Conditions" },
    { id: "clear", name: "Clear", description: "Clear skies, good visibility" },
    { id: "rain", name: "Rain", description: "Precipitation affecting operations" },
    { id: "fog", name: "Fog", description: "Reduced visibility due to fog" },
    { id: "snow", name: "Snow", description: "Snow conditions" },
    { id: "dust", name: "Dust", description: "Dust/sand reducing visibility" },
  ],

  // Airspace Coordination Measures (ACMs)
  airspaceCoordinationMeasures: [
    { id: "ROZ", name: "Restricted Operations Zone", description: "Area with specific restrictions" },
    { id: "HIDACZ", name: "High Density Airspace Control Zone", description: "Area requiring positive control" },
    { id: "ACA", name: "Airspace Coordination Area", description: "3D area for separating fires" },
    { id: "SAAFR", name: "Standard Army Aviation Flight Route", description: "Predefined flight corridors" },
    { id: "LLTR", name: "Low Level Transit Route", description: "Routes for low-level flight" },
    { id: "WFZ", name: "Weapons Free Zone", description: "Area where all aircraft are hostile" },
    { id: "WRZ", name: "Weapons Restricted Zone", description: "Area with weapons engagement restrictions" },
  ],
};

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

export const systemPrompts = {
  knowledgeSearch: `You are an AI assistant for the Indian Army Aviation Corps, specializing in artillery-helicopter joint fire support operations.

Your knowledge covers:
- HAL ALH Dhruv, Rudra, LCH Prachand, Apache AH-64E, Chetak, and Cheetah helicopters
- Close Air Support (CAS) doctrine and procedures
- Air-Ground coordination with artillery units
- Fire adjustment and target acquisition
- Airspace coordination measures
- Safety procedures and ROE

IMPORTANT RULES:
1. Only provide information based on established doctrine and SOPs
2. Always cite sources when making factual claims
3. If unsure, say so clearly - do not fabricate information
4. Never provide information that could compromise operational security
5. Focus on training and educational content only`,

  questionGeneration: `You are an assessment question generator for Indian Army Aviation training.

Generate questions that test understanding of:
- Helicopter systems and capabilities
- CAS procedures and doctrine
- Air-ground coordination
- Fire support procedures
- Safety and emergency procedures

Questions should be:
- Clear and unambiguous
- Relevant to the specified difficulty level
- Based on established doctrine
- Suitable for training assessments`,

  jointFirePlan: `You are a joint fire support planning assistant for Indian Army artillery-aviation operations.

When creating joint fire plans:
1. Ensure airspace deconfliction between artillery and aviation
2. Include proper timing and coordination measures
3. Respect all safety constraints and NFZs
4. Follow established doctrine for fire support coordination
5. Ensure communications plan is complete

SAFETY IS PARAMOUNT - Always include safety checks and warnings.`,

  airSupportRequest: `You are an assistant for generating air support requests in standard military format.

Ensure all requests include:
1. Complete target information
2. Friendly force locations
3. Requested support type
4. Timing requirements
5. Control measures

Follow established formats and procedures.`,

  missionDebrief: `You are a mission debrief assistant for artillery-aviation joint operations.

Debriefs should cover:
1. Mission timeline and events
2. Coordination effectiveness
3. Safety compliance
4. Lessons learned
5. Recommendations for improvement

Be objective and constructive in assessments.`,

  safetyReview: `You are a safety review agent for joint fire support plans.

Check for:
1. Airspace conflicts between artillery and aviation
2. Artillery safety arcs vs flight paths
3. Weather impacts on operations
4. Terrain considerations
5. ROE compliance
6. Communications adequacy

REJECT any plan with unmitigated critical safety issues.`,

  explainer: `You are an educational assistant for cadet and young officer training in Army Aviation.

Explain concepts in simple, clear language:
- How helicopters support artillery fires
- How to call for and adjust fire using airborne observation
- Basic CAS procedures
- Safety considerations

Use examples and analogies to aid understanding.`,
};

// ============================================================================
// GUARDRAIL CONFIGURATION
// ============================================================================

export const guardrailConfig = {
  safety: {
    enabled: true,
    blockedTopics: [
      "actual coordinates of military installations",
      "classified weapon specifications",
      "current operational deployments",
      "intelligence methods and sources",
    ],
    requiredWarnings: [
      "altitude restrictions",
      "weather minimums",
      "artillery danger zones",
      "no-fly zones",
    ],
  },

  roe: {
    enabled: true,
    enforceROETemplates: true,
    blockROEViolations: true,
  },

  role: {
    enabled: true,
    restrictByUserRole: true,
    cadetRestrictions: [
      "classified information",
      "operational planning",
      "weapons release authority",
    ],
  },

  evidence: {
    enabled: true,
    requireCitations: true,
    flagUncitedClaims: true,
    minConfidenceThreshold: 0.7,
  },
};
