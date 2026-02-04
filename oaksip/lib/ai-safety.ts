// AI Safety & Refusal Logic
// Trust-building examples showing AI knows its limits

export interface SafetyRule {
  id: string;
  category: "safety" | "doctrine" | "classified" | "unauthorized";
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

// Safety Rules - What AI will refuse
export const safetyRules: SafetyRule[] = [
  {
    id: "SR-001",
    category: "safety",
    trigger: ["bypass safety", "disable interlock", "skip safety check", "override safety"],
    response: "I cannot provide guidance on bypassing or disabling safety systems. Safety interlocks exist to prevent accidents and loss of life. Please consult your instructor for any safety-related concerns.",
    severity: "block",
    escalateTo: "instructor",
  },
  {
    id: "SR-002",
    category: "safety",
    trigger: ["fire without clearance", "shoot without", "unauthorized firing"],
    response: "I cannot assist with unauthorized firing procedures. All firing must follow proper authorization protocols with command clearance. This query has been logged.",
    severity: "block",
    escalateTo: "safety_officer",
  },
  {
    id: "SR-003",
    category: "classified",
    trigger: ["classified range", "secret", "top secret", "restricted data", "actual coordinates"],
    response: "I cannot provide classified information. This platform operates with training data only. For operational information, please use authorized classified systems with proper clearance.",
    severity: "block",
    escalateTo: "security_officer",
  },
  {
    id: "SR-004",
    category: "unauthorized",
    trigger: ["hack", "exploit", "vulnerability", "break into", "unauthorized access"],
    response: "I cannot assist with unauthorized system access or security exploitation. If you've found a security concern, please report it through proper channels to the system administrator.",
    severity: "block",
    escalateTo: "admin",
  },
  {
    id: "SR-005",
    category: "doctrine",
    trigger: ["modify doctrine", "change procedure", "update SOP without"],
    response: "I cannot modify doctrine or SOPs. All doctrinal changes must go through the proper authority (School of Artillery/DGMI). I can only provide information from approved doctrine versions.",
    severity: "warn",
    escalateTo: "instructor",
  },
];

// Proper Refusal Examples - Shows AI knows limits
export const refusalExamples: RefusalExample[] = [
  {
    id: "REF-001",
    category: "Safety Bypass",
    userQuery: "How do I bypass the breech safety interlock to fire faster?",
    aiResponse: "I cannot provide guidance on bypassing safety interlocks. The breech safety interlock prevents firing when the breech is not fully closed, which could cause a catastrophic failure. All safety systems must remain operational during training and operations. If you're experiencing issues with firing speed, please consult your instructor about proper rapid-fire drill techniques that maintain safety.",
    reason: "Safety interlock bypass could cause injury or death",
    action: "Query logged and flagged for instructor review",
  },
  {
    id: "REF-002",
    category: "Unauthorized Information",
    userQuery: "What are the actual coordinates for the Pokhran firing range?",
    aiResponse: "I cannot provide actual geographic coordinates for military ranges. This training platform uses simulated coordinates for instructional purposes only. For operational coordinates, please use authorized systems with appropriate clearance level.",
    reason: "Actual military coordinates are classified",
    action: "Query logged",
  },
  {
    id: "REF-003",
    category: "Out of Scope",
    userQuery: "Can you help me calculate ballistics for the T-90 tank gun?",
    aiResponse: "I am trained specifically on artillery systems (Dhanush, K9 Vajra, Pinaka, etc.). Tank gunnery is outside my knowledge domain. For T-90 related training, please consult the Armoured Corps training systems or your unit's gunnery instructor.",
    reason: "Query outside trained domain",
    action: "Suggested appropriate resource",
  },
  {
    id: "REF-004",
    category: "Doctrine Modification",
    userQuery: "The firing procedure in FM 6-40 seems outdated. Can you update it?",
    aiResponse: "I cannot modify official doctrine or field manuals. My role is to provide information from approved doctrine only. If you believe a procedure needs updating, please submit a feedback form through the School of Artillery channels. The current approved version is FM 6-40 Rev 3.2 (Jan 2024).",
    reason: "AI cannot modify official doctrine",
    action: "Directed to proper authority for doctrine changes",
  },
  {
    id: "REF-005",
    category: "Unsafe Procedure",
    userQuery: "Can I skip the bore clear check if I'm in a hurry?",
    aiResponse: "No, the bore clear check must NEVER be skipped. This is a mandatory safety procedure that prevents firing with an obstruction in the barrel, which could cause barrel burst. There are no circumstances under which this check can be omitted. Drill time requirements already account for all safety checks.",
    reason: "Skipping bore check is life-threatening",
    action: "Strong refusal with safety explanation",
  },
];

// Doctrine Conflict Examples - Shows AI handles ambiguity
export const conflictExamples: ConflictExample[] = [
  {
    id: "CON-001",
    topic: "Minimum Crew Size",
    source1: {
      document: "FM 6-50 (2018)",
      version: "2.1",
      content: "Minimum crew for Dhanush operation: 6 personnel",
    },
    source2: {
      document: "School of Artillery SOP (2023)",
      version: "3.0",
      content: "Minimum crew for Dhanush emergency operation: 4 personnel with cross-training",
    },
    aiResponse: "I found different minimum crew requirements in two sources:\n\n• FM 6-50 (2018): 6 personnel minimum\n• School of Artillery SOP (2023): 4 personnel for emergency operation\n\nThe difference is context-dependent. FM 6-50 specifies standard operations, while the newer SOP allows reduced crew only for emergency scenarios with cross-trained personnel. For your training scenario, please clarify with your instructor which context applies.",
    resolution: "Both sources are valid for different contexts - flagged for instructor clarification",
  },
  {
    id: "CON-002",
    topic: "Elevation Limits",
    source1: {
      document: "Dhanush Technical Manual",
      version: "1.0",
      content: "Maximum elevation: 72 degrees",
    },
    source2: {
      document: "Firing Tables (Updated)",
      version: "2.3",
      content: "Recommended maximum elevation: 70 degrees for sustained fire",
    },
    aiResponse: "I found a discrepancy in elevation limits:\n\n• Technical Manual: Maximum 72°\n• Firing Tables: Recommended max 70° for sustained fire\n\nThe technical manual states the mechanical limit (72°), while firing tables recommend 70° for sustained fire to prevent excessive wear. Both are correct - 72° is possible but 70° is recommended for normal operations. This has been flagged for instructor verification.",
    resolution: "Different contexts - mechanical vs operational limits",
  },
];

// Safety Override Examples - Shows AI acts in emergencies
export const safetyOverrideExamples: SafetyOverrideExample[] = [
  {
    id: "SO-001",
    scenario: "3D Training Simulation - Firing Sequence",
    violation: "Cadet attempts to execute 'FIRE' before 'BREECH CLOSED' verification",
    aiAction: "DRILL PAUSED. Safety violation detected. Step 4 (Verify Breech Closed) must complete before Step 6 (Fire Command). Resuming from Step 4. This violation has been logged.",
    consequence: "Drill paused, violation logged, cadet must repeat from safety check",
  },
  {
    id: "SO-002",
    scenario: "Quiz Assessment - Safety Question",
    violation: "Cadet selects 'Skip safety check in combat' as acceptable procedure",
    aiAction: "INCORRECT - CRITICAL SAFETY CONCEPT. Safety checks are NEVER optional, including in combat. Skipping safety checks has caused more casualties than enemy action. This question requires remediation before continuing.",
    consequence: "Assessment paused, mandatory remediation module assigned",
  },
  {
    id: "SO-003",
    scenario: "Knowledge Search - Dangerous Query Pattern",
    violation: "Multiple queries about disabling safety systems detected from same user",
    aiAction: "Your recent queries suggest interest in bypassing safety systems. This pattern has been flagged for review. Please speak with your instructor if you have legitimate safety-related training needs.",
    consequence: "Pattern flagged, instructor notified, user warned",
  },
  {
    id: "SO-004",
    scenario: "FDC Calculation - Out of Range",
    violation: "Calculated trajectory would land in friendly zone",
    aiAction: "WARNING: Calculated impact point is within 500m of friendly positions marked on current scenario. Verify coordinates and request confirmation before proceeding. This is a training scenario - in actual operations, this would require immediate halt.",
    consequence: "Calculation blocked pending verification",
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
  console.log(`[SAFETY LOG] ${timestamp.toISOString()}`);
  console.log(`  User: ${userId}`);
  console.log(`  Query: ${query}`);
  console.log(`  Rule: ${rule.id} (${rule.category})`);
  console.log(`  Severity: ${rule.severity}`);
  if (rule.escalateTo) {
    console.log(`  Escalated to: ${rule.escalateTo}`);
  }
}
