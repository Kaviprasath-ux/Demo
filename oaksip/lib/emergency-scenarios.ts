// Emergency & Fault Training Scenarios - SOW Section 8.4
// Implements misfire drills, system faults, and emergency procedures

export type EmergencyType =
  | "misfire"
  | "hangfire"
  | "premature"
  | "breech_failure"
  | "recoil_failure"
  | "hydraulic_leak"
  | "electrical_fault"
  | "ammunition_defect"
  | "barrel_obstruction"
  | "fire_hazard";

export type SeverityLevel = "critical" | "high" | "medium" | "low";

export interface EmergencyProcedureStep {
  id: string;
  order: number;
  action: string;
  description: string;
  timeLimit?: number; // seconds
  isCritical: boolean;
  verificationRequired: boolean;
  safetyNote?: string;
}

export interface EmergencyScenario {
  id: string;
  name: string;
  type: EmergencyType;
  severity: SeverityLevel;
  description: string;
  symptoms: string[];
  causes: string[];
  immediateActions: EmergencyProcedureStep[];
  followUpActions: EmergencyProcedureStep[];
  safetyWarnings: string[];
  equipment: string[];
  estimatedTime: number; // minutes
  passingCriteria: {
    maxTimeSeconds: number;
    requiredStepsCompleted: number;
    maxErrors: number;
  };
}

export interface EmergencyDrillSession {
  id: string;
  scenarioId: string;
  startTime: number;
  endTime?: number;
  stepsCompleted: string[];
  errors: Array<{
    stepId: string;
    errorType: "wrong_order" | "skipped" | "timeout" | "safety_violation";
    description: string;
    timestamp: number;
  }>;
  score: number;
  passed: boolean;
  feedback: string[];
}

// =============================================================================
// MISFIRE SCENARIOS
// =============================================================================

export const misfireScenario: EmergencyScenario = {
  id: "emg-misfire-01",
  name: "Standard Misfire Drill",
  type: "misfire",
  severity: "critical",
  description:
    "Gun fails to fire after the firing mechanism is activated. The round may be a dud or have delayed ignition (hangfire).",
  symptoms: [
    "No report after pulling lanyard",
    "No recoil movement",
    "Breech remains closed",
    "No smoke from muzzle",
  ],
  causes: [
    "Defective primer",
    "Defective propellant",
    "Firing mechanism malfunction",
    "Worn firing pin",
    "Moisture in charge",
  ],
  immediateActions: [
    {
      id: "msf-1",
      order: 1,
      action: "ANNOUNCE MISFIRE",
      description: "Gun commander loudly announces 'MISFIRE' to alert all crew members.",
      isCritical: true,
      verificationRequired: false,
      safetyNote: "Do not approach the gun immediately",
    },
    {
      id: "msf-2",
      order: 2,
      action: "START TIMING",
      description: "Begin 30-second waiting period. DO NOT OPEN BREECH.",
      timeLimit: 30,
      isCritical: true,
      verificationRequired: true,
      safetyNote: "Hangfire may detonate during this period",
    },
    {
      id: "msf-3",
      order: 3,
      action: "CLEAR AREA",
      description: "Ensure all personnel are clear of muzzle and breech areas.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "msf-4",
      order: 4,
      action: "ATTEMPT RE-FIRE",
      description: "After 30 seconds, attempt to re-fire using fresh lanyard pull.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "msf-5",
      order: 5,
      action: "SECOND MISFIRE CHECK",
      description: "If second misfire occurs, wait additional 30 seconds.",
      timeLimit: 30,
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "msf-6",
      order: 6,
      action: "THIRD ATTEMPT",
      description: "Make third and final attempt to fire.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  followUpActions: [
    {
      id: "msf-f1",
      order: 1,
      action: "EXTENDED WAIT",
      description: "After three failed attempts, wait minimum 5 minutes before opening breech.",
      timeLimit: 300,
      isCritical: true,
      verificationRequired: true,
      safetyNote: "Extended wait for possible hangfire",
    },
    {
      id: "msf-f2",
      order: 2,
      action: "OPEN BREECH CAREFULLY",
      description: "Gun commander opens breech while standing to the side.",
      isCritical: true,
      verificationRequired: true,
      safetyNote: "Stand clear of breech opening direction",
    },
    {
      id: "msf-f3",
      order: 3,
      action: "EXTRACT ROUND",
      description: "Carefully extract the misfired round using proper tools.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "msf-f4",
      order: 4,
      action: "INSPECT ROUND",
      description: "Examine round for damage, deformation, or primer strike.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "msf-f5",
      order: 5,
      action: "DISPOSE SAFELY",
      description: "Place misfired round in designated safe area, mark for EOD disposal.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "msf-f6",
      order: 6,
      action: "REPORT INCIDENT",
      description: "Log misfire in gun record and report to Battery Commander.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  safetyWarnings: [
    "NEVER look into the muzzle of a loaded gun",
    "NEVER open the breech before the prescribed waiting time",
    "Keep all personnel clear during misfire procedures",
    "Treat every misfired round as potentially dangerous",
    "Only qualified personnel should handle misfired ammunition",
  ],
  equipment: ["Safety gloves", "Round extraction tool", "Safe storage container", "Log book"],
  estimatedTime: 15,
  passingCriteria: {
    maxTimeSeconds: 900,
    requiredStepsCompleted: 10,
    maxErrors: 1,
  },
};

// =============================================================================
// RECOIL SYSTEM FAILURE
// =============================================================================

export const recoilFailureScenario: EmergencyScenario = {
  id: "emg-recoil-01",
  name: "Recoil System Failure",
  type: "recoil_failure",
  severity: "high",
  description:
    "Gun barrel fails to return to battery position after firing, indicating recuperator or recoil cylinder malfunction.",
  symptoms: [
    "Barrel does not return to forward position",
    "Barrel stops short of battery",
    "Visible fluid leakage",
    "Abnormal recoil length",
    "Grinding or scraping sounds",
  ],
  causes: [
    "Low recuperator pressure",
    "Hydraulic fluid leak",
    "Damaged recoil cylinder seals",
    "Piston rod damage",
    "Foreign material in system",
  ],
  immediateActions: [
    {
      id: "rcl-1",
      order: 1,
      action: "CEASE FIRE",
      description: "Immediately stop firing operations and announce 'CEASE FIRE - RECOIL FAILURE'.",
      isCritical: true,
      verificationRequired: false,
    },
    {
      id: "rcl-2",
      order: 2,
      action: "SAFE THE GUN",
      description: "Ensure breech is closed and no round is loaded. Apply safety mechanisms.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "rcl-3",
      order: 3,
      action: "CLEAR PERSONNEL",
      description: "Move all personnel away from the immediate gun area.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "rcl-4",
      order: 4,
      action: "ASSESS DAMAGE",
      description: "Visually inspect recoil system for obvious damage or leaks.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  followUpActions: [
    {
      id: "rcl-f1",
      order: 1,
      action: "CHECK RECUPERATOR PRESSURE",
      description: "Using gauge, check nitrogen pressure in recuperator against specifications.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "rcl-f2",
      order: 2,
      action: "INSPECT FLUID LEVELS",
      description: "Check hydraulic fluid level in recoil cylinder sight glass.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "rcl-f3",
      order: 3,
      action: "REPORT TO MAINTENANCE",
      description: "Contact EME/maintenance section for technical assessment.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "rcl-f4",
      order: 4,
      action: "DOCUMENT INCIDENT",
      description: "Record all observations, barrel position, and any visible damage.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  safetyWarnings: [
    "Do NOT attempt to manually push barrel into battery",
    "Recoil system operates under high pressure - risk of injury",
    "Fluid leaks may be under pressure - avoid contact",
    "Gun may fire unexpectedly if barrel moves to battery",
  ],
  equipment: ["Pressure gauge", "Inspection mirror", "Safety barriers", "Maintenance log"],
  estimatedTime: 10,
  passingCriteria: {
    maxTimeSeconds: 600,
    requiredStepsCompleted: 6,
    maxErrors: 1,
  },
};

// =============================================================================
// BREECH FAILURE
// =============================================================================

export const breechFailureScenario: EmergencyScenario = {
  id: "emg-breech-01",
  name: "Breech Mechanism Failure",
  type: "breech_failure",
  severity: "critical",
  description:
    "Breech block fails to close properly or opens unexpectedly, creating extreme danger of propellant gas escape.",
  symptoms: [
    "Breech block does not close fully",
    "Breech opens during firing",
    "Visible gap between breech and chamber",
    "Abnormal resistance when operating breech",
    "Gas escape from breech area",
  ],
  causes: [
    "Worn locking surfaces",
    "Damaged breech block",
    "Foreign material in mechanism",
    "Cam mechanism failure",
    "Operating lever damage",
  ],
  immediateActions: [
    {
      id: "brc-1",
      order: 1,
      action: "IMMEDIATE CEASE FIRE",
      description: "Stop all operations immediately. Announce 'EMERGENCY - BREECH FAILURE'.",
      isCritical: true,
      verificationRequired: false,
      safetyNote: "This is a CRITICAL safety emergency",
    },
    {
      id: "brc-2",
      order: 2,
      action: "EVACUATE GUN AREA",
      description: "All personnel move minimum 25 meters from the gun.",
      isCritical: true,
      verificationRequired: true,
      safetyNote: "Gas escape can cause severe burns",
    },
    {
      id: "brc-3",
      order: 3,
      action: "CHECK FOR LOADED ROUND",
      description: "From safe distance, determine if gun is loaded.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "brc-4",
      order: 4,
      action: "CONTACT BATTERY COMMANDER",
      description: "Report emergency to BC and request EOD/maintenance support.",
      isCritical: true,
      verificationRequired: true,
    },
  ],
  followUpActions: [
    {
      id: "brc-f1",
      order: 1,
      action: "ESTABLISH SAFETY CORDON",
      description: "Set up 50-meter exclusion zone around the gun.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "brc-f2",
      order: 2,
      action: "AWAIT SPECIALIST",
      description: "Do not attempt repair. Wait for EME/maintenance specialist.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "brc-f3",
      order: 3,
      action: "DOCUMENT POSITION",
      description: "Photograph and document exact position of all components.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  safetyWarnings: [
    "EXTREME DANGER - Propellant gas escape can be fatal",
    "Do NOT attempt to close or operate the breech",
    "Do NOT approach if gun is loaded",
    "Only specialist personnel may handle this emergency",
    "This is a reportable safety incident",
  ],
  equipment: ["Safety barriers", "Warning signs", "Communication equipment", "Camera"],
  estimatedTime: 5,
  passingCriteria: {
    maxTimeSeconds: 300,
    requiredStepsCompleted: 7,
    maxErrors: 0,
  },
};

// =============================================================================
// HYDRAULIC LEAK
// =============================================================================

export const hydraulicLeakScenario: EmergencyScenario = {
  id: "emg-hydraulic-01",
  name: "Hydraulic System Leak",
  type: "hydraulic_leak",
  severity: "medium",
  description:
    "Hydraulic fluid leak detected in elevation, traverse, or recoil systems affecting gun operation.",
  symptoms: [
    "Visible fluid on gun or ground",
    "Sluggish elevation/traverse movement",
    "Unusual sounds from hydraulic pumps",
    "Reduced system pressure",
    "Fluid level dropping in reservoir",
  ],
  causes: [
    "Worn seals or gaskets",
    "Damaged hydraulic lines",
    "Loose fittings",
    "Corrosion damage",
    "Impact damage to components",
  ],
  immediateActions: [
    {
      id: "hyd-1",
      order: 1,
      action: "IDENTIFY LEAK SOURCE",
      description: "Locate the source of the hydraulic fluid leak.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "hyd-2",
      order: 2,
      action: "ASSESS SEVERITY",
      description: "Determine leak rate - minor seepage vs active flow.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "hyd-3",
      order: 3,
      action: "DECIDE OPERATION STATUS",
      description: "Determine if gun can continue limited operations or must cease fire.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "hyd-4",
      order: 4,
      action: "CONTAIN SPILL",
      description: "Use absorbent material to contain spilled fluid.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  followUpActions: [
    {
      id: "hyd-f1",
      order: 1,
      action: "CHECK FLUID LEVEL",
      description: "Monitor hydraulic fluid reservoir level.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "hyd-f2",
      order: 2,
      action: "TOP UP IF NEEDED",
      description: "Add approved hydraulic fluid to maintain minimum operating level.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "hyd-f3",
      order: 3,
      action: "SCHEDULE REPAIR",
      description: "Coordinate with maintenance for permanent repair.",
      isCritical: false,
      verificationRequired: true,
    },
    {
      id: "hyd-f4",
      order: 4,
      action: "LOG INCIDENT",
      description: "Record leak details in maintenance log.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  safetyWarnings: [
    "Hydraulic fluid is flammable - keep away from heat sources",
    "Fluid under pressure can penetrate skin - use caution",
    "Use proper PPE when handling hydraulic fluid",
    "Dispose of contaminated absorbent properly",
  ],
  equipment: ["Absorbent pads", "Hydraulic fluid", "Funnel", "PPE gloves", "Drip pan"],
  estimatedTime: 20,
  passingCriteria: {
    maxTimeSeconds: 1200,
    requiredStepsCompleted: 6,
    maxErrors: 2,
  },
};

// =============================================================================
// FIRE HAZARD
// =============================================================================

export const fireHazardScenario: EmergencyScenario = {
  id: "emg-fire-01",
  name: "Fire in Gun Position",
  type: "fire_hazard",
  severity: "critical",
  description:
    "Fire detected in or near the gun position, creating immediate danger to personnel and ammunition.",
  symptoms: [
    "Visible flames or smoke",
    "Burning smell",
    "Heat radiating from components",
    "Sparks or electrical arcing",
    "Propellant or fluid ignition",
  ],
  causes: [
    "Electrical short circuit",
    "Hydraulic fluid ignition",
    "Propellant fire",
    "External fire spreading",
    "Hot barrel contact with vegetation",
  ],
  immediateActions: [
    {
      id: "fir-1",
      order: 1,
      action: "ALERT - FIRE",
      description: "Announce 'FIRE - FIRE - FIRE' loudly to alert all personnel.",
      isCritical: true,
      verificationRequired: false,
      safetyNote: "Immediate life-safety alert",
    },
    {
      id: "fir-2",
      order: 2,
      action: "EVACUATE AMMUNITION",
      description: "If safe to do so, remove ammunition from immediate fire area.",
      isCritical: true,
      verificationRequired: true,
      safetyNote: "DO NOT approach if ammunition is already heating",
    },
    {
      id: "fir-3",
      order: 3,
      action: "EVACUATE PERSONNEL",
      description: "All personnel move to designated assembly point minimum 100m away.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "fir-4",
      order: 4,
      action: "FIGHT FIRE IF SAFE",
      description: "Use fire extinguishers only if fire is small and controllable.",
      isCritical: false,
      verificationRequired: true,
      safetyNote: "Personal safety takes priority over equipment",
    },
    {
      id: "fir-5",
      order: 5,
      action: "CALL FOR SUPPORT",
      description: "Request fire fighting support from higher headquarters.",
      isCritical: true,
      verificationRequired: true,
    },
  ],
  followUpActions: [
    {
      id: "fir-f1",
      order: 1,
      action: "ACCOUNT FOR PERSONNEL",
      description: "Conduct head count at assembly point.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "fir-f2",
      order: 2,
      action: "ESTABLISH CORDON",
      description: "Prevent unauthorized approach to fire area.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "fir-f3",
      order: 3,
      action: "AWAIT ALL CLEAR",
      description: "Do not return until fire is confirmed extinguished and area is safe.",
      isCritical: true,
      verificationRequired: true,
    },
    {
      id: "fir-f4",
      order: 4,
      action: "ASSESS DAMAGE",
      description: "After all clear, assess damage to equipment and ammunition.",
      isCritical: false,
      verificationRequired: true,
    },
  ],
  safetyWarnings: [
    "Ammunition can cook off in fire - maintain safe distance",
    "Propellant fires burn extremely hot - do not approach",
    "Smoke from burning materials may be toxic",
    "Heated ammunition may detonate without warning",
    "Personnel safety ALWAYS takes priority over equipment",
  ],
  equipment: ["Fire extinguishers", "First aid kit", "Communication equipment", "Assembly point marker"],
  estimatedTime: 10,
  passingCriteria: {
    maxTimeSeconds: 300,
    requiredStepsCompleted: 7,
    maxErrors: 0,
  },
};

// =============================================================================
// SCENARIO COLLECTION
// =============================================================================

export const emergencyScenarios: EmergencyScenario[] = [
  misfireScenario,
  recoilFailureScenario,
  breechFailureScenario,
  hydraulicLeakScenario,
  fireHazardScenario,
];

// Get scenario by ID
export function getEmergencyScenario(id: string): EmergencyScenario | undefined {
  return emergencyScenarios.find((s) => s.id === id);
}

// Get scenarios by type
export function getScenariosByType(type: EmergencyType): EmergencyScenario[] {
  return emergencyScenarios.filter((s) => s.type === type);
}

// Get scenarios by severity
export function getScenariosBySeverity(severity: SeverityLevel): EmergencyScenario[] {
  return emergencyScenarios.filter((s) => s.severity === severity);
}

// Calculate drill score
export function calculateDrillScore(
  scenario: EmergencyScenario,
  session: Omit<EmergencyDrillSession, "score" | "passed" | "feedback">
): { score: number; passed: boolean; feedback: string[] } {
  const feedback: string[] = [];
  let score = 100;

  // Time penalty
  const timeTaken = (session.endTime || Date.now()) - session.startTime;
  const maxTime = scenario.passingCriteria.maxTimeSeconds * 1000;
  if (timeTaken > maxTime) {
    const overTime = Math.floor((timeTaken - maxTime) / 1000);
    score -= Math.min(30, overTime * 2);
    feedback.push(`Time exceeded by ${overTime} seconds (-${Math.min(30, overTime * 2)} points)`);
  }

  // Steps completion
  const completedSteps = session.stepsCompleted.length;
  const requiredSteps = scenario.passingCriteria.requiredStepsCompleted;

  if (completedSteps < requiredSteps) {
    score -= (requiredSteps - completedSteps) * 10;
    feedback.push(`Only ${completedSteps}/${requiredSteps} required steps completed`);
  }

  // Error penalties
  const errors = session.errors.length;
  const maxErrors = scenario.passingCriteria.maxErrors;
  if (errors > maxErrors) {
    score -= (errors - maxErrors) * 15;
    feedback.push(`${errors} errors committed (max allowed: ${maxErrors})`);
  }

  // Safety violation severe penalty
  const safetyViolations = session.errors.filter((e) => e.errorType === "safety_violation");
  if (safetyViolations.length > 0) {
    score -= safetyViolations.length * 25;
    feedback.push(`SAFETY VIOLATION: ${safetyViolations.length} safety violations (-${safetyViolations.length * 25} points)`);
  }

  score = Math.max(0, score);
  const passed = score >= 70 && safetyViolations.length === 0;

  if (passed) {
    feedback.unshift("Drill completed successfully");
  } else {
    feedback.unshift("Drill FAILED - Review procedures and retry");
  }

  return { score, passed, feedback };
}
