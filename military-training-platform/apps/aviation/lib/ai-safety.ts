// AI Safety & Refusal Logic for Aviation
// Trust-building examples showing AI knows its limits in aviation context

export interface SafetyRule {
  id: string;
  category: "airspace" | "flight_safety" | "classified" | "unauthorized" | "roe";
  trigger: string[];
  response: string;
  severity: "block" | "warn" | "flag";
  escalateTo?: string;
}

export interface RefusalExample {
  id: string;
  category: string;
  userQuery: string;
  aiResponse: string;
  reason: string;
  action: string;
}

export interface ConflictExample {
  id: string;
  topic: string;
  source1: { document: string; version: string; content: string };
  source2: { document: string; version: string; content: string };
  aiResponse: string;
  resolution: string;
}

export interface SafetyOverrideExample {
  id: string;
  scenario: string;
  violation: string;
  aiAction: string;
  consequence: string;
}

// Safety Rules - What AI will refuse (Aviation-specific)
export const safetyRules: SafetyRule[] = [
  {
    id: "SR-AV-001",
    category: "airspace",
    trigger: ["fly through nfz", "enter no-fly zone", "ignore restricted airspace", "bypass airspace"],
    response: "I cannot provide guidance on entering No-Fly Zones or restricted airspace. NFZ restrictions exist to prevent mid-air collisions and protect sensitive areas. Please consult your flight commander for any airspace-related concerns.",
    severity: "block",
    escalateTo: "flight_commander",
  },
  {
    id: "SR-AV-002",
    category: "flight_safety",
    trigger: ["skip pre-flight", "bypass checklist", "ignore weather minimum", "fly without clearance"],
    response: "I cannot assist with bypassing pre-flight checks or weather minimums. These procedures exist to prevent accidents and loss of life. All flights must follow proper authorization protocols.",
    severity: "block",
    escalateTo: "safety_officer",
  },
  {
    id: "SR-AV-003",
    category: "roe",
    trigger: ["fire without authorization", "engage without clearance", "attack civilian", "ignore roe"],
    response: "I cannot provide guidance on weapons engagement without proper authorization. All weapons release must follow Rules of Engagement (ROE) and require proper command authorization. This query has been logged.",
    severity: "block",
    escalateTo: "legal_officer",
  },
  {
    id: "SR-AV-004",
    category: "classified",
    trigger: ["classified mission", "secret coordinates", "actual target location", "operational deployment"],
    response: "I cannot provide classified operational information. This platform operates with training data only. For operational information, please use authorized classified systems with proper clearance.",
    severity: "block",
    escalateTo: "security_officer",
  },
  {
    id: "SR-AV-005",
    category: "unauthorized",
    trigger: ["hack", "exploit", "vulnerability", "break into", "unauthorized access"],
    response: "I cannot assist with unauthorized system access or security exploitation. If you've found a security concern, please report it through proper channels to the system administrator.",
    severity: "block",
    escalateTo: "admin",
  },
  {
    id: "SR-AV-006",
    category: "flight_safety",
    trigger: ["exceed flight envelope", "over-torque", "exceed vne", "ignore caution light"],
    response: "I cannot provide guidance on exceeding aircraft flight limitations. Operating outside the flight envelope risks aircraft structural failure and loss of crew. All limitations in the flight manual must be observed.",
    severity: "block",
    escalateTo: "instructor",
  },
  {
    id: "SR-AV-007",
    category: "flight_safety",
    trigger: ["fly single pilot night", "skip crew rest", "exceed duty time", "fly fatigued"],
    response: "I cannot assist with crew duty time violations. Fatigue is a leading cause of aviation accidents. All crew rest requirements per regulations must be observed.",
    severity: "warn",
    escalateTo: "flight_commander",
  },
];

// Proper Refusal Examples - Shows AI knows aviation limits
export const refusalExamples: RefusalExample[] = [
  {
    id: "REF-AV-001",
    category: "Airspace Violation",
    userQuery: "How do I plan a route through the restricted airspace near the border to save fuel?",
    aiResponse: "I cannot provide guidance on routing through restricted airspace. Restricted areas (R-areas) exist for national security and flight safety reasons. Fuel savings never justify airspace violations. Please plan your route around restricted areas using published airways, or request special authorization through your flight operations cell if mission-critical.",
    reason: "Restricted airspace violations are illegal and dangerous",
    action: "Query logged and flagged for instructor review",
  },
  {
    id: "REF-AV-002",
    category: "Safety Bypass",
    userQuery: "Can I skip the hover check if I'm running late for the mission?",
    aiResponse: "No, the hover check must NEVER be skipped. This is a mandatory safety procedure that verifies aircraft controllability before transitioning to forward flight. Skipping it has contributed to multiple accidents. Time pressure is never a valid reason to bypass safety checks. Delay the mission if necessary.",
    reason: "Hover check is critical safety procedure",
    action: "Strong refusal with safety explanation",
  },
  {
    id: "REF-AV-003",
    category: "Out of Scope",
    userQuery: "Can you help me calculate fire mission data for the 155mm howitzer?",
    aiResponse: "I am trained specifically on aviation systems (ALH Dhruv, Rudra, LCH Prachand, Apache, etc.) and air-ground coordination. Artillery calculations are outside my knowledge domain. For artillery fire missions, please use the Artillery Training System (GATS) or consult your FOO/JFO.",
    reason: "Query outside trained domain",
    action: "Suggested appropriate resource",
  },
  {
    id: "REF-AV-004",
    category: "ROE Violation",
    userQuery: "The target looks like enemy but I don't have PID. Can I engage anyway?",
    aiResponse: "I cannot provide guidance on engagement without Positive Identification (PID). ROE requires PID before weapons release to prevent fratricide and civilian casualties. If you cannot achieve PID, you must NOT engage. Request additional ISR assets or abort the engagement. This is a non-negotiable ROE requirement.",
    reason: "PID is mandatory ROE requirement",
    action: "Query logged, ROE reminder provided",
  },
  {
    id: "REF-AV-005",
    category: "Weather Minimum",
    userQuery: "Weather is below minimums but the mission is urgent. How do I file for special VFR?",
    aiResponse: "I cannot assist with flying below weather minimums regardless of mission urgency. Weather minimums exist because controlled flight into terrain (CFIT) is a leading cause of helicopter accidents. If weather is below minimums: delay, divert, or cancel. No mission is worth the crew and aircraft. Contact your operations cell for mission re-planning.",
    reason: "Weather minimums are non-negotiable",
    action: "Refusal with alternate options",
  },
];

// Doctrine Conflict Examples - Shows AI handles ambiguity
export const conflictExamples: ConflictExample[] = [
  {
    id: "CON-AV-001",
    topic: "CAS Minimum Altitude",
    source1: {
      document: "Joint Fire Support SOP (2020)",
      version: "1.0",
      content: "Minimum CAS run-in altitude: 500 feet AGL",
    },
    source2: {
      document: "Army Aviation Tactics (2023)",
      version: "2.0",
      content: "Minimum attack altitude varies by threat: Low threat 300ft, Medium 500ft, High 1000ft",
    },
    aiResponse: "I found different minimum altitude requirements in two sources:\n\n• Joint Fire Support SOP (2020): Fixed 500 feet AGL minimum\n• Army Aviation Tactics (2023): Threat-dependent (300-1000 ft)\n\nThe newer doctrine (2023) provides threat-based guidance which supersedes the fixed altitude in the older SOP. However, 500 ft remains the default for unknown threat environments. Please confirm the threat level with your S2/Intel before planning attack profiles.",
    resolution: "Newer doctrine takes precedence, but instructor verification recommended",
  },
  {
    id: "CON-AV-002",
    topic: "Helicopter Gun Run Pattern",
    source1: {
      document: "Rudra Weapons Employment Manual",
      version: "1.2",
      content: "Standard gun run: Diving attack, 10-15 degree dive angle",
    },
    source2: {
      document: "Apache Tactics Handbook",
      version: "3.0",
      content: "Preferred gun engagement: Level flight or slight climb for better target tracking",
    },
    aiResponse: "I found different gun run recommendations:\n\n• Rudra Manual: Diving attack (10-15°)\n• Apache Handbook: Level or climbing attack\n\nThis difference is platform-specific, not a conflict. Rudra's chin-mounted gun is optimized for diving attacks, while Apache's TADS/PNVS allows effective level engagement. Use the technique appropriate for your aircraft type.",
    resolution: "Platform-specific guidance - both are correct for their respective aircraft",
  },
];

// Safety Override Examples - Shows AI acts in emergencies
export const safetyOverrideExamples: SafetyOverrideExample[] = [
  {
    id: "SO-AV-001",
    scenario: "3D Flight Simulation - Pre-flight",
    violation: "Cadet attempts to start engines before completing walk-around inspection",
    aiAction: "SIMULATION PAUSED. Safety violation detected. Walk-around inspection must be completed before engine start. External checks verify no damage, leaks, or foreign objects that could cause in-flight emergency. Resuming from walk-around step.",
    consequence: "Simulation paused, violation logged, cadet must complete proper sequence",
  },
  {
    id: "SO-AV-002",
    scenario: "CAS Mission Planning - NFZ Check",
    violation: "Planned route passes through active No-Fly Zone",
    aiAction: "ROUTE REJECTED. Your planned route intersects NFZ-127 (active 0600-1800L). This NFZ contains civilian air traffic corridor. Re-plan route to avoid, or request NFZ deactivation through Air Defense Coordination Cell if mission-critical.",
    consequence: "Route planning blocked until NFZ conflict resolved",
  },
  {
    id: "SO-AV-003",
    scenario: "Weapons Release Training",
    violation: "Simulated weapons release attempted without proper target identification call",
    aiAction: "WEAPONS SAFE. Target identification call not received. Proper sequence: 'Tally target' → 'Target identified as [description]' → 'Cleared hot' → Weapons release. Repeat engagement sequence from target acquisition.",
    consequence: "Simulated weapons blocked, proper procedure enforced",
  },
  {
    id: "SO-AV-004",
    scenario: "Formation Flying Exercise",
    violation: "Maintaining unsafe separation distance from lead aircraft",
    aiAction: "WARNING: SEPARATION UNSAFE. Current separation 50m is below minimum 100m for training formation. Increase separation immediately. Collision risk is highest cause of formation accidents.",
    consequence: "Warning issued, separation must increase to continue",
  },
];

// Check if a query should be refused
export function checkSafetyRules(query: string): SafetyRule | null {
  const lowerQuery = query.toLowerCase();

  for (const rule of safetyRules) {
    for (const trigger of rule.trigger) {
      if (lowerQuery.includes(trigger.toLowerCase())) {
        return rule;
      }
    }
  }

  return null;
}

// Get appropriate response for safety violation
export function getSafetyResponse(rule: SafetyRule): {
  blocked: boolean;
  response: string;
  escalation?: string;
} {
  return {
    blocked: rule.severity === "block",
    response: rule.response,
    escalation: rule.escalateTo,
  };
}

// Log safety event (mock implementation)
export function logSafetyEvent(
  userId: string,
  query: string,
  rule: SafetyRule,
  timestamp: Date = new Date()
): void {
  console.log(`[AVIATION SAFETY LOG] ${timestamp.toISOString()}`);
  console.log(`  User: ${userId}`);
  console.log(`  Query: ${query}`);
  console.log(`  Rule: ${rule.id} (${rule.category})`);
  console.log(`  Severity: ${rule.severity}`);
  if (rule.escalateTo) {
    console.log(`  Escalated to: ${rule.escalateTo}`);
  }
}

// Aviation-specific safety checks
export function checkAirspaceViolation(
  routeCoordinates: [number, number][],
  nfzList: { id: string; coordinates: [number, number][]; active: boolean }[]
): { violated: boolean; nfzId?: string } {
  // Mock implementation - in production would use geospatial intersection
  for (const nfz of nfzList) {
    if (nfz.active) {
      // Simplified check - real implementation would use proper polygon intersection
      return { violated: false };
    }
  }
  return { violated: false };
}

export function checkWeatherMinimums(
  currentWeather: { ceiling: number; visibility: number },
  requiredMinimums: { ceiling: number; visibility: number }
): { safe: boolean; reason?: string } {
  if (currentWeather.ceiling < requiredMinimums.ceiling) {
    return {
      safe: false,
      reason: `Ceiling ${currentWeather.ceiling}ft below minimum ${requiredMinimums.ceiling}ft`,
    };
  }
  if (currentWeather.visibility < requiredMinimums.visibility) {
    return {
      safe: false,
      reason: `Visibility ${currentWeather.visibility}km below minimum ${requiredMinimums.visibility}km`,
    };
  }
  return { safe: true };
}
