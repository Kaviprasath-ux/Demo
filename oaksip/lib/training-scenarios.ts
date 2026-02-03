// Training Scenarios - Layer 3 Scenario Training
// Combat scenarios with stress conditions and decision making

export type ScenarioDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type ScenarioType = "qualification" | "combat" | "stress" | "decision";

export interface ScenarioTarget {
  id: string;
  type: "static" | "popup" | "moving" | "hostile" | "civilian";
  position: [number, number, number];
  distance: number; // meters
  appearTime?: number; // seconds after scenario start
  disappearTime?: number; // seconds (for popup targets)
  moveSpeed?: number; // for moving targets
  movePath?: [number, number, number][]; // waypoints for moving targets
  points: number;
  penalty?: number; // negative points for hitting civilians
  requiredHits?: number; // some targets need multiple hits
}

export interface ScenarioObjective {
  id: string;
  description: string;
  type: "hit_targets" | "accuracy" | "time" | "no_civilians" | "reload_drill";
  targetCount?: number;
  accuracyThreshold?: number;
  timeLimit?: number;
  points: number;
}

export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  briefing: string;
  difficulty: ScenarioDifficulty;
  type: ScenarioType;
  weaponCategory: "pistol" | "assault-rifle" | "machine-gun" | "towed" | "any";
  timeLimit: number; // seconds
  targets: ScenarioTarget[];
  objectives: ScenarioObjective[];
  passingScore: number;
  medalThresholds: {
    bronze: number;
    silver: number;
    gold: number;
  };
  environmentConditions?: {
    terrain?: string;
    weather?: string;
    timeOfDay?: "day" | "night" | "dusk";
  };
  tips: string[];
}

// Training Scenarios
export const trainingScenarios: TrainingScenario[] = [
  // ==================== QUALIFICATION SCENARIOS ====================
  {
    id: "pistol-qual-basic",
    name: "Pistol Qualification - Basic",
    description: "Standard pistol qualification course at close range",
    briefing: "Complete the basic pistol qualification. Engage all targets within the time limit. Accuracy is key - take your time on the first few shots.",
    difficulty: "beginner",
    type: "qualification",
    weaponCategory: "pistol",
    timeLimit: 60,
    targets: [
      { id: "t1", type: "static", position: [0, 1, 1.5], distance: 10, points: 100 },
      { id: "t2", type: "static", position: [-0.8, 1, 2.25], distance: 15, points: 100 },
      { id: "t3", type: "static", position: [0.8, 1, 2.25], distance: 15, points: 100 },
      { id: "t4", type: "static", position: [0, 1, 3.75], distance: 25, points: 150 },
    ],
    objectives: [
      { id: "obj1", description: "Hit all 4 targets", type: "hit_targets", targetCount: 4, points: 200 },
      { id: "obj2", description: "Achieve 75% accuracy", type: "accuracy", accuracyThreshold: 75, points: 150 },
      { id: "obj3", description: "Complete within 60 seconds", type: "time", timeLimit: 60, points: 100 },
    ],
    passingScore: 400,
    medalThresholds: { bronze: 400, silver: 550, gold: 700 },
    tips: [
      "Focus on sight alignment before each shot",
      "Breathe steadily - shoot on the exhale",
      "Start with closer targets to build confidence",
    ],
  },
  {
    id: "rifle-qual-standard",
    name: "Rifle Qualification - Standard",
    description: "Standard rifle qualification at varying distances",
    briefing: "Complete the standard rifle qualification course. Targets are placed at 50m, 100m, and 200m. Adjust your aim for distance.",
    difficulty: "intermediate",
    type: "qualification",
    weaponCategory: "assault-rifle",
    timeLimit: 90,
    targets: [
      { id: "t1", type: "static", position: [-1, 1, 4], distance: 50, points: 100 },
      { id: "t2", type: "static", position: [0, 1, 4], distance: 50, points: 100 },
      { id: "t3", type: "static", position: [1, 1, 4], distance: 50, points: 100 },
      { id: "t4", type: "static", position: [-0.5, 1, 8], distance: 100, points: 150 },
      { id: "t5", type: "static", position: [0.5, 1, 8], distance: 100, points: 150 },
      { id: "t6", type: "static", position: [0, 1, 16], distance: 200, points: 200 },
    ],
    objectives: [
      { id: "obj1", description: "Hit all 6 targets", type: "hit_targets", targetCount: 6, points: 300 },
      { id: "obj2", description: "Achieve 70% accuracy", type: "accuracy", accuracyThreshold: 70, points: 200 },
    ],
    passingScore: 600,
    medalThresholds: { bronze: 600, silver: 800, gold: 1000 },
    tips: [
      "Account for bullet drop at longer ranges",
      "Use controlled bursts for better accuracy",
      "Clear close targets before engaging far ones",
    ],
  },

  // ==================== COMBAT SCENARIOS ====================
  {
    id: "cqb-room-clear",
    name: "CQB Room Clearing",
    description: "Close quarters battle - clear hostiles, protect civilians",
    briefing: "HOSTILE SITUATION: Clear the room of enemy combatants. CRITICAL: Civilians are present - positive identification required before engaging. Civilian casualties will result in mission failure.",
    difficulty: "advanced",
    type: "combat",
    weaponCategory: "pistol",
    timeLimit: 30,
    targets: [
      { id: "h1", type: "hostile", position: [-1, 1, 2], distance: 10, points: 200, appearTime: 0 },
      { id: "c1", type: "civilian", position: [0.5, 1, 2.5], distance: 12, points: 0, penalty: -500, appearTime: 1 },
      { id: "h2", type: "hostile", position: [1, 1, 3], distance: 15, points: 200, appearTime: 2 },
      { id: "h3", type: "hostile", position: [-0.5, 1, 3.5], distance: 18, points: 200, appearTime: 3 },
      { id: "c2", type: "civilian", position: [0, 1, 2], distance: 10, points: 0, penalty: -500, appearTime: 4 },
    ],
    objectives: [
      { id: "obj1", description: "Neutralize all hostiles", type: "hit_targets", targetCount: 3, points: 400 },
      { id: "obj2", description: "Zero civilian casualties", type: "no_civilians", points: 300 },
      { id: "obj3", description: "Complete within 30 seconds", type: "time", timeLimit: 30, points: 200 },
    ],
    passingScore: 600,
    medalThresholds: { bronze: 600, silver: 800, gold: 1000 },
    environmentConditions: { timeOfDay: "day" },
    tips: [
      "Identify targets before shooting - red = hostile, blue = civilian",
      "Hostiles appear in sequence - stay alert",
      "Speed is important but accuracy prevents civilian casualties",
    ],
  },
  {
    id: "defense-position",
    name: "Defensive Position",
    description: "Hold position against advancing hostiles",
    briefing: "DEFENSIVE OPERATION: Enemy forces are advancing on your position. Engage and neutralize all hostiles before they reach your line. Use sustained fire to suppress multiple targets.",
    difficulty: "advanced",
    type: "combat",
    weaponCategory: "machine-gun",
    timeLimit: 60,
    targets: [
      { id: "h1", type: "moving", position: [0, 1, 20], distance: 400, points: 150, appearTime: 0, moveSpeed: 2 },
      { id: "h2", type: "moving", position: [-2, 1, 22], distance: 440, points: 150, appearTime: 3, moveSpeed: 2 },
      { id: "h3", type: "moving", position: [2, 1, 22], distance: 440, points: 150, appearTime: 3, moveSpeed: 2 },
      { id: "h4", type: "moving", position: [-1, 1, 25], distance: 500, points: 200, appearTime: 8, moveSpeed: 3 },
      { id: "h5", type: "moving", position: [1, 1, 25], distance: 500, points: 200, appearTime: 8, moveSpeed: 3 },
      { id: "h6", type: "moving", position: [0, 1, 30], distance: 600, points: 250, appearTime: 15, moveSpeed: 3 },
    ],
    objectives: [
      { id: "obj1", description: "Neutralize all hostiles", type: "hit_targets", targetCount: 6, points: 500 },
      { id: "obj2", description: "Achieve 60% accuracy", type: "accuracy", accuracyThreshold: 60, points: 200 },
    ],
    passingScore: 800,
    medalThresholds: { bronze: 800, silver: 1000, gold: 1200 },
    tips: [
      "Lead moving targets - aim ahead of their movement",
      "Use short bursts to conserve ammo and maintain accuracy",
      "Prioritize closer threats first",
    ],
  },

  // ==================== STRESS SCENARIOS ====================
  {
    id: "rapid-engagement",
    name: "Rapid Target Engagement",
    description: "Engage popup targets under extreme time pressure",
    briefing: "STRESS TEST: Popup targets will appear for only 2 seconds each. You must identify and engage quickly. This tests your reaction time and accuracy under pressure.",
    difficulty: "expert",
    type: "stress",
    weaponCategory: "assault-rifle",
    timeLimit: 45,
    targets: [
      { id: "p1", type: "popup", position: [-1.5, 1, 6], distance: 75, points: 150, appearTime: 2, disappearTime: 4 },
      { id: "p2", type: "popup", position: [1.5, 1, 6], distance: 75, points: 150, appearTime: 5, disappearTime: 7 },
      { id: "p3", type: "popup", position: [0, 1, 8], distance: 100, points: 200, appearTime: 8, disappearTime: 10 },
      { id: "p4", type: "popup", position: [-1, 1, 10], distance: 125, points: 200, appearTime: 12, disappearTime: 14 },
      { id: "p5", type: "popup", position: [1, 1, 10], distance: 125, points: 200, appearTime: 15, disappearTime: 17 },
      { id: "p6", type: "popup", position: [0, 1, 12], distance: 150, points: 250, appearTime: 20, disappearTime: 22 },
      { id: "p7", type: "popup", position: [-0.5, 1, 14], distance: 175, points: 250, appearTime: 25, disappearTime: 27 },
      { id: "p8", type: "popup", position: [0.5, 1, 16], distance: 200, points: 300, appearTime: 30, disappearTime: 32 },
    ],
    objectives: [
      { id: "obj1", description: "Hit at least 6 targets", type: "hit_targets", targetCount: 6, points: 400 },
      { id: "obj2", description: "Achieve 50% accuracy", type: "accuracy", accuracyThreshold: 50, points: 200 },
    ],
    passingScore: 800,
    medalThresholds: { bronze: 800, silver: 1100, gold: 1500 },
    environmentConditions: { weather: "fog", timeOfDay: "dusk" },
    tips: [
      "Pre-aim at likely target locations",
      "React quickly but don't panic",
      "Accept that you may miss some - focus on the next target",
    ],
  },
  {
    id: "night-ops",
    name: "Night Operations",
    description: "Low visibility engagement scenario",
    briefing: "NIGHT OPERATION: Visibility is severely limited. Targets will appear briefly - use muzzle flash to locate subsequent targets. Stay calm and control your breathing.",
    difficulty: "expert",
    type: "stress",
    weaponCategory: "any",
    timeLimit: 60,
    targets: [
      { id: "n1", type: "popup", position: [0, 1, 4], distance: 50, points: 200, appearTime: 3, disappearTime: 6 },
      { id: "n2", type: "popup", position: [-1, 1, 6], distance: 75, points: 200, appearTime: 10, disappearTime: 13 },
      { id: "n3", type: "popup", position: [1, 1, 6], distance: 75, points: 200, appearTime: 18, disappearTime: 21 },
      { id: "n4", type: "popup", position: [0, 1, 8], distance: 100, points: 250, appearTime: 28, disappearTime: 31 },
      { id: "n5", type: "popup", position: [-0.5, 1, 10], distance: 125, points: 300, appearTime: 40, disappearTime: 43 },
    ],
    objectives: [
      { id: "obj1", description: "Hit at least 4 targets", type: "hit_targets", targetCount: 4, points: 500 },
    ],
    passingScore: 700,
    medalThresholds: { bronze: 700, silver: 900, gold: 1150 },
    environmentConditions: { weather: "clear", timeOfDay: "night" },
    tips: [
      "Let your eyes adjust to the darkness",
      "Use the aiming reticle as your guide",
      "Fire when you're confident of target location",
    ],
  },

  // ==================== DECISION SCENARIOS ====================
  {
    id: "hostage-situation",
    name: "Hostage Rescue",
    description: "Precision shooting with hostages present",
    briefing: "CRITICAL SITUATION: Hostiles have taken hostages. You must neutralize the threats without harming hostages. Take only clear shots - a missed shot could hit a hostage. Patience and precision are paramount.",
    difficulty: "expert",
    type: "decision",
    weaponCategory: "pistol",
    timeLimit: 45,
    targets: [
      { id: "hostage1", type: "civilian", position: [-0.3, 1, 2], distance: 10, points: 0, penalty: -1000 },
      { id: "hostile1", type: "hostile", position: [-0.6, 1, 2.2], distance: 11, points: 300 },
      { id: "hostage2", type: "civilian", position: [0.3, 1, 3], distance: 15, points: 0, penalty: -1000 },
      { id: "hostile2", type: "hostile", position: [0.6, 1, 3.2], distance: 16, points: 300 },
      { id: "hostage3", type: "civilian", position: [0, 1, 4], distance: 20, points: 0, penalty: -1000 },
      { id: "hostile3", type: "hostile", position: [0.2, 1.2, 4], distance: 20, points: 400 },
    ],
    objectives: [
      { id: "obj1", description: "Neutralize all 3 hostiles", type: "hit_targets", targetCount: 3, points: 500 },
      { id: "obj2", description: "Zero hostage casualties", type: "no_civilians", points: 500 },
      { id: "obj3", description: "Achieve 80% accuracy", type: "accuracy", accuracyThreshold: 80, points: 200 },
    ],
    passingScore: 800,
    medalThresholds: { bronze: 800, silver: 1000, gold: 1200 },
    tips: [
      "Hostiles are marked RED, hostages are marked BLUE",
      "Take your time - rushing leads to mistakes",
      "Aim for center mass on hostiles only",
      "If unsure, don't shoot",
    ],
  },
  {
    id: "fire-mission",
    name: "Artillery Fire Mission",
    description: "Coordinate artillery fire on enemy positions",
    briefing: "FIRE MISSION: Enemy armor has been spotted at multiple grid references. Coordinate fire to destroy enemy vehicles while avoiding the marked civilian area. Adjust fire based on impact observation.",
    difficulty: "advanced",
    type: "decision",
    weaponCategory: "towed",
    timeLimit: 120,
    targets: [
      { id: "armor1", type: "hostile", position: [-3, 0, 2.5], distance: 5000, points: 400 },
      { id: "armor2", type: "hostile", position: [0, 0, 5], distance: 10000, points: 500 },
      { id: "armor3", type: "hostile", position: [3, 0, 7.5], distance: 15000, points: 600 },
      { id: "civilian_area", type: "civilian", position: [1, 0, 4], distance: 8000, points: 0, penalty: -800 },
    ],
    objectives: [
      { id: "obj1", description: "Destroy all enemy armor", type: "hit_targets", targetCount: 3, points: 600 },
      { id: "obj2", description: "Avoid civilian area", type: "no_civilians", points: 400 },
    ],
    passingScore: 1000,
    medalThresholds: { bronze: 1000, silver: 1300, gold: 1500 },
    environmentConditions: { terrain: "plains", weather: "clear" },
    tips: [
      "Observe where rounds impact and adjust",
      "Account for distance when aiming",
      "The civilian area is clearly marked - stay clear",
    ],
  },
];

// Helper functions
export function getScenarioById(id: string): TrainingScenario | undefined {
  return trainingScenarios.find((s) => s.id === id);
}

export function getScenariosByDifficulty(difficulty: ScenarioDifficulty): TrainingScenario[] {
  return trainingScenarios.filter((s) => s.difficulty === difficulty);
}

export function getScenariosByType(type: ScenarioType): TrainingScenario[] {
  return trainingScenarios.filter((s) => s.type === type);
}

export function getScenariosByWeapon(category: string): TrainingScenario[] {
  return trainingScenarios.filter((s) => s.weaponCategory === category || s.weaponCategory === "any");
}

export function calculateMedal(score: number, thresholds: { bronze: number; silver: number; gold: number }): "none" | "bronze" | "silver" | "gold" {
  if (score >= thresholds.gold) return "gold";
  if (score >= thresholds.silver) return "silver";
  if (score >= thresholds.bronze) return "bronze";
  return "none";
}
