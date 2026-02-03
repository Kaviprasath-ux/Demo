// 155mm Artillery Gun Components & Training Data

export interface GunComponent {
  id: string;
  name: string;
  description: string;
  safetyNotes?: string[];
  technicalSpecs?: Record<string, string>;
}

export interface DrillStep {
  action: string;
  component: string;
  animation: string;
  duration: number; // in milliseconds
  safetyWarning?: string;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  steps: DrillStep[];
  estimatedTime: number; // in seconds
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface SafetyAlert {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  sopReference?: string;
}

// 155mm Artillery Gun Components
export const gunComponents: GunComponent[] = [
  {
    id: "barrel",
    name: "Barrel",
    description:
      "155mm rifled barrel, 39 caliber length. Primary component for projectile acceleration and stabilization through rifling grooves.",
    safetyNotes: [
      "Never look down the barrel",
      "Check for obstructions before loading",
      "Inspect for wear after every 500 rounds",
    ],
    technicalSpecs: {
      Caliber: "155mm",
      Length: "39 calibers (6.045m)",
      Rifling: "Right-hand twist",
      "Muzzle Velocity": "827 m/s (standard)",
    },
  },
  {
    id: "breech",
    name: "Breech Block",
    description:
      "Vertical sliding breech mechanism. Seals the chamber during firing and provides access for loading ammunition.",
    safetyNotes: [
      "Ensure breech is clear before closing",
      "Keep hands clear during operation",
      "Verify locked position before firing",
    ],
    technicalSpecs: {
      Type: "Vertical sliding wedge",
      Operation: "Semi-automatic",
      "Lock Mechanism": "Interrupted screw",
    },
  },
  {
    id: "recoil",
    name: "Recoil System",
    description:
      "Hydro-pneumatic recoil mechanism. Absorbs firing shock and returns barrel to battery position.",
    safetyNotes: [
      "Check fluid levels daily",
      "Do not tamper with pressure settings",
      "Report any leaks immediately",
    ],
    technicalSpecs: {
      Type: "Hydro-pneumatic",
      "Recoil Length": "1100mm",
      "Working Pressure": "100 bar",
    },
  },
  {
    id: "carriage",
    name: "Carriage",
    description:
      "Split-trail carriage assembly. Provides stable platform for firing and enables towing.",
    safetyNotes: [
      "Ensure proper ground anchoring",
      "Check structural integrity before firing",
    ],
    technicalSpecs: {
      Type: "Split-trail",
      "Travel Weight": "7200 kg",
      "Crew Size": "8-10",
    },
  },
  {
    id: "elevation",
    name: "Elevation Mechanism",
    description:
      "Manual and powered elevation control. Adjusts barrel angle for range setting.",
    safetyNotes: [
      "Verify elevation lock before firing",
      "Keep hands clear of gears",
    ],
    technicalSpecs: {
      Range: "-3° to +70°",
      "Rate (Manual)": "3°/sec",
      "Rate (Powered)": "6°/sec",
    },
  },
  {
    id: "traverse",
    name: "Traverse Mechanism",
    description:
      "Limited traverse system for fine azimuth adjustments without repositioning trails.",
    safetyNotes: ["Ensure trails are properly spread before traverse"],
    technicalSpecs: {
      "Total Traverse": "58° (29° left/right)",
      "Fine Adjustment": "0.1 mil increments",
    },
  },
  {
    id: "sights",
    name: "Sighting System",
    description:
      "Panoramic telescope and direct fire sight. Enables accurate target acquisition and fire control.",
    safetyNotes: [
      "Handle optics with care",
      "Calibrate before each mission",
      "Protect from impacts",
    ],
    technicalSpecs: {
      "Primary Sight": "Panoramic telescope",
      Magnification: "4x / 10x",
      "Graduation": "6400 mils",
    },
  },
  {
    id: "wheels",
    name: "Wheels",
    description:
      "Dual pneumatic tires on each side. Provides mobility for road and cross-country movement.",
    safetyNotes: [
      "Check tire pressure before movement",
      "Inspect for damage after operations",
    ],
    technicalSpecs: {
      Type: "Pneumatic dual",
      Size: "14.00-20",
      Pressure: "4.5 bar",
    },
  },
  {
    id: "trails",
    name: "Split Trails",
    description:
      "Two trail legs that spread for stability during firing and close for towing.",
    safetyNotes: [
      "Ensure full spread before firing",
      "Clear area before closing",
      "Secure locking pins",
    ],
    technicalSpecs: {
      "Spread Angle": "50°",
      Length: "5.5m each",
      Material: "High-strength steel",
    },
  },
  {
    id: "spade",
    name: "Trail Spade",
    description:
      "Ground anchoring spades at trail ends. Digs into ground to prevent movement during firing.",
    safetyNotes: [
      "Ensure proper penetration depth",
      "Check soil conditions",
      "Clear debris before anchoring",
    ],
    technicalSpecs: {
      Type: "Folding blade",
      "Penetration Depth": "300-400mm",
      "Ground Types": "All soil conditions",
    },
  },
];

// Training Drills
export const drills: Drill[] = [
  {
    id: "loading",
    name: "Loading Procedure",
    description:
      "Standard procedure for loading a 155mm projectile and propellant charge.",
    estimatedTime: 45,
    difficulty: "beginner",
    steps: [
      {
        action: "Open breech block",
        component: "breech",
        animation: "breechOpen",
        duration: 1500,
        safetyWarning: "Ensure barrel is clear before opening",
      },
      {
        action: "Insert projectile into chamber",
        component: "breech",
        animation: "loadRound",
        duration: 2000,
        safetyWarning: "Handle ammunition with care",
      },
      {
        action: "Ram projectile to seating position",
        component: "breech",
        animation: "ramRound",
        duration: 1500,
      },
      {
        action: "Insert propellant charge",
        component: "breech",
        animation: "loadCharge",
        duration: 1500,
        safetyWarning: "Keep propellant away from heat sources",
      },
      {
        action: "Close breech block",
        component: "breech",
        animation: "breechClose",
        duration: 1500,
      },
      {
        action: "Verify breech lock indicator",
        component: "breech",
        animation: "breechLock",
        duration: 1000,
        safetyWarning: "Never fire with unlocked breech",
      },
    ],
  },
  {
    id: "firing",
    name: "Firing Drill",
    description:
      "Complete firing sequence from ready position to projectile discharge.",
    estimatedTime: 30,
    difficulty: "intermediate",
    steps: [
      {
        action: "Verify elevation setting",
        component: "elevation",
        animation: "elevationCheck",
        duration: 1000,
      },
      {
        action: "Verify traverse setting",
        component: "traverse",
        animation: "traverseCheck",
        duration: 1000,
      },
      {
        action: "Confirm firing data",
        component: "sights",
        animation: "sightCheck",
        duration: 1500,
      },
      {
        action: "Clear firing area",
        component: "carriage",
        animation: "areaClear",
        duration: 1000,
        safetyWarning: "All personnel must be clear of recoil path",
      },
      {
        action: "Arm firing mechanism",
        component: "breech",
        animation: "armFiring",
        duration: 1000,
      },
      {
        action: "Fire on command",
        component: "barrel",
        animation: "fire",
        duration: 500,
        safetyWarning: "Hearing protection mandatory",
      },
      {
        action: "Observe recoil cycle",
        component: "recoil",
        animation: "recoilCycle",
        duration: 2000,
      },
    ],
  },
  {
    id: "misfire",
    name: "Misfire Procedure",
    description:
      "Safety procedure when gun fails to fire after firing mechanism activation.",
    estimatedTime: 120,
    difficulty: "advanced",
    steps: [
      {
        action: "Wait 30 seconds - DO NOT OPEN BREECH",
        component: "breech",
        animation: "wait",
        duration: 3000,
        safetyWarning: "CRITICAL: Wait period prevents hangfire injury",
      },
      {
        action: "Attempt second firing",
        component: "breech",
        animation: "retryFire",
        duration: 1500,
      },
      {
        action: "If still misfire, wait additional 30 seconds",
        component: "breech",
        animation: "wait",
        duration: 3000,
        safetyWarning: "Extended wait for hangfire safety",
      },
      {
        action: "Clear all personnel from immediate area",
        component: "carriage",
        animation: "evacuate",
        duration: 2000,
        safetyWarning: "Minimum safe distance: 50 meters",
      },
      {
        action: "Carefully open breech from side position",
        component: "breech",
        animation: "safeBreechOpen",
        duration: 2500,
        safetyWarning: "Never stand behind breech during this operation",
      },
      {
        action: "Extract unfired round with extraction tool",
        component: "breech",
        animation: "extractRound",
        duration: 3000,
        safetyWarning: "Handle as live ammunition",
      },
      {
        action: "Inspect chamber for debris",
        component: "breech",
        animation: "inspectChamber",
        duration: 2000,
      },
      {
        action: "Report incident to officer",
        component: "carriage",
        animation: "report",
        duration: 1500,
      },
    ],
  },
  {
    id: "emplacement",
    name: "Emplacement Drill",
    description: "Procedure for setting up the gun in firing position.",
    estimatedTime: 180,
    difficulty: "beginner",
    steps: [
      {
        action: "Position gun at designated location",
        component: "wheels",
        animation: "position",
        duration: 2000,
      },
      {
        action: "Spread trail legs",
        component: "trails",
        animation: "spreadTrails",
        duration: 2500,
        safetyWarning: "Clear area before spreading trails",
      },
      {
        action: "Lock trail legs in position",
        component: "trails",
        animation: "lockTrails",
        duration: 1500,
      },
      {
        action: "Lower and set trail spades",
        component: "spade",
        animation: "setSpades",
        duration: 2000,
        safetyWarning: "Ensure adequate ground penetration",
      },
      {
        action: "Level the gun platform",
        component: "carriage",
        animation: "level",
        duration: 2000,
      },
      {
        action: "Install sighting equipment",
        component: "sights",
        animation: "installSights",
        duration: 2500,
      },
      {
        action: "Perform functions check",
        component: "carriage",
        animation: "functionsCheck",
        duration: 3000,
      },
      {
        action: "Report gun ready",
        component: "carriage",
        animation: "ready",
        duration: 1000,
      },
    ],
  },
];

// Safety Alerts
export const safetyAlerts: SafetyAlert[] = [
  {
    id: "breech-unlocked",
    type: "danger",
    title: "Breech Not Locked",
    message:
      "The breech block is not fully locked. DO NOT fire until breech lock indicator shows GREEN.",
    sopReference: "SOP-155-FIRING-03 Section 4.2",
  },
  {
    id: "misfire-wait",
    type: "danger",
    title: "Misfire - Wait Required",
    message:
      "After a misfire, wait a minimum of 30 seconds before any action. This prevents injury from hangfire.",
    sopReference: "SOP-155-SAFETY-01 Section 7.1",
  },
  {
    id: "recoil-area",
    type: "warning",
    title: "Recoil Area Warning",
    message:
      "Ensure all personnel are clear of the recoil path before firing. The breech travels approximately 1.1 meters rearward.",
    sopReference: "SOP-155-SAFETY-01 Section 3.4",
  },
  {
    id: "elevation-limit",
    type: "warning",
    title: "Elevation Limit",
    message:
      "Approaching maximum elevation (+70°). Verify firing data and ensure stable platform.",
    sopReference: "SOP-155-FIRING-03 Section 2.1",
  },
  {
    id: "trail-spread",
    type: "info",
    title: "Trail Position",
    message:
      "Trails must be fully spread and locked before firing. Verify spade penetration in soft soil.",
    sopReference: "SOP-155-EMPLACE-02 Section 5.3",
  },
  {
    id: "hot-barrel",
    type: "warning",
    title: "Barrel Temperature",
    message:
      "After sustained firing, allow barrel to cool. Maximum rate: 3 rounds/minute for extended periods.",
    sopReference: "SOP-155-FIRING-03 Section 6.2",
  },
  {
    id: "ammunition-handling",
    type: "info",
    title: "Ammunition Safety",
    message:
      "Handle all ammunition as live. Store propellant away from heat sources and direct sunlight.",
    sopReference: "SOP-155-AMMO-04 Section 2.1",
  },
];

// Get component by ID
export function getComponentById(id: string): GunComponent | undefined {
  return gunComponents.find((c) => c.id === id);
}

// Get drill by ID
export function getDrillById(id: string): Drill | undefined {
  return drills.find((d) => d.id === id);
}

// Get safety alert by ID
export function getSafetyAlertById(id: string): SafetyAlert | undefined {
  return safetyAlerts.find((a) => a.id === id);
}

// =============================================================================
// MISSION SCENARIOS - SOW Section 8.4
// =============================================================================

export type ScenarioObjectiveType = "destroy_target" | "suppression" | "illumination" | "smoke" | "defense";
export type TerrainCondition = "plains" | "desert" | "mountain" | "high-altitude";
export type WeatherCondition = "clear" | "rain" | "fog" | "night";

export interface MissionObjective {
  id: string;
  type: ScenarioObjectiveType;
  description: string;
  targetCoordinates?: { grid: string; distance: number; direction: number };
  requiredRounds?: number;
  timeLimit?: number; // in seconds
  successCriteria: string;
}

export interface MissionScenario {
  id: string;
  name: string;
  description: string;
  briefing: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  terrain: TerrainCondition;
  weather: WeatherCondition;
  objectives: MissionObjective[];
  drillsRequired: string[]; // drill IDs that must be completed
  estimatedTime: number; // in minutes
  maxScore: number;
  passingScore: number;
  tacticalContext: string;
  enemySituation?: string;
  friendlySituation?: string;
  ammunitionAllowed: string[];
}

// Mission Scenarios
export const missionScenarios: MissionScenario[] = [
  {
    id: "mission-001",
    name: "Dawn Strike",
    description: "Engage enemy forward observation post at first light",
    briefing: "Enemy FOP identified at Grid Reference 123456. Mission: Neutralize observation capability to support friendly advance. Time-critical - must complete before 0630hrs.",
    difficulty: "beginner",
    terrain: "plains",
    weather: "clear",
    objectives: [
      {
        id: "obj-001-1",
        type: "destroy_target",
        description: "Destroy enemy observation post",
        targetCoordinates: { grid: "123456", distance: 8500, direction: 45 },
        requiredRounds: 3,
        timeLimit: 180,
        successCriteria: "Target neutralized within 3 rounds",
      },
    ],
    drillsRequired: ["emplacement", "firing"],
    estimatedTime: 10,
    maxScore: 100,
    passingScore: 70,
    tacticalContext: "Supporting battalion advance through open terrain",
    enemySituation: "Enemy defensive positions 10km ahead, FOP providing targeting data",
    friendlySituation: "Friendly infantry battalion preparing to advance at 0630hrs",
    ammunitionAllowed: ["HE", "HESH"],
  },
  {
    id: "mission-002",
    name: "Defensive Fire Support",
    description: "Provide defensive fire support against advancing enemy armor",
    briefing: "Enemy armored column detected advancing on friendly positions. Establish gun position and prepare to engage multiple targets. Continuous fire support required until threat neutralized.",
    difficulty: "intermediate",
    terrain: "desert",
    weather: "clear",
    objectives: [
      {
        id: "obj-002-1",
        type: "defense",
        description: "Establish defensive firing position",
        timeLimit: 300,
        successCriteria: "Gun emplaced and ready within 5 minutes",
      },
      {
        id: "obj-002-2",
        type: "destroy_target",
        description: "Engage lead enemy vehicles",
        targetCoordinates: { grid: "234567", distance: 12000, direction: 90 },
        requiredRounds: 6,
        timeLimit: 240,
        successCriteria: "Engage 3 targets with 2 rounds each",
      },
      {
        id: "obj-002-3",
        type: "suppression",
        description: "Maintain suppressive fire",
        requiredRounds: 4,
        timeLimit: 120,
        successCriteria: "Sustained rate of fire for 2 minutes",
      },
    ],
    drillsRequired: ["emplacement", "loading", "firing"],
    estimatedTime: 20,
    maxScore: 150,
    passingScore: 100,
    tacticalContext: "Hasty defense against armored thrust",
    enemySituation: "T-90 tank platoon with BMP support advancing along Route Alpha",
    friendlySituation: "Friendly mechanized company in hasty defensive positions 2km behind gun line",
    ammunitionAllowed: ["HE", "HEAT", "APFSDS"],
  },
  {
    id: "mission-003",
    name: "Mountain Firebase",
    description: "High-altitude fire support for mountain operations",
    briefing: "Establish firing position at altitude 3500m. Provide fire support for special forces team operating in high-altitude terrain. Weather conditions deteriorating - window of opportunity limited.",
    difficulty: "advanced",
    terrain: "high-altitude",
    weather: "fog",
    objectives: [
      {
        id: "obj-003-1",
        type: "destroy_target",
        description: "Destroy enemy bunker complex",
        targetCoordinates: { grid: "345678", distance: 6000, direction: 270 },
        requiredRounds: 4,
        timeLimit: 300,
        successCriteria: "Bunker neutralized with precision fire",
      },
      {
        id: "obj-003-2",
        type: "illumination",
        description: "Provide illumination for extraction",
        requiredRounds: 2,
        timeLimit: 60,
        successCriteria: "Illuminate LZ for helicopter extraction",
      },
    ],
    drillsRequired: ["emplacement", "loading", "firing", "misfire"],
    estimatedTime: 25,
    maxScore: 200,
    passingScore: 140,
    tacticalContext: "Support to special operations in denied terrain",
    enemySituation: "Enemy mountain outpost with AAA capability",
    friendlySituation: "SF team requiring extraction under fire",
    ammunitionAllowed: ["HE", "ILLUM", "SMOKE"],
  },
  {
    id: "mission-004",
    name: "Night Fire Mission",
    description: "Conduct night fire mission with limited visibility",
    briefing: "Enemy supply convoy identified moving along MSR during night. Conduct interdiction fire to disrupt enemy logistics. No illumination available - rely on computed fire data.",
    difficulty: "expert",
    terrain: "mountain",
    weather: "night",
    objectives: [
      {
        id: "obj-004-1",
        type: "destroy_target",
        description: "Interdict enemy convoy",
        targetCoordinates: { grid: "456789", distance: 10000, direction: 180 },
        requiredRounds: 8,
        timeLimit: 360,
        successCriteria: "Destroy or disable convoy vehicles",
      },
      {
        id: "obj-004-2",
        type: "smoke",
        description: "Screen friendly movement",
        requiredRounds: 3,
        timeLimit: 120,
        successCriteria: "Establish smoke screen on Phase Line Alpha",
      },
    ],
    drillsRequired: ["emplacement", "loading", "firing"],
    estimatedTime: 30,
    maxScore: 250,
    passingScore: 175,
    tacticalContext: "Deep strike to disrupt enemy logistics",
    enemySituation: "Major supply column moving to reinforce forward positions",
    friendlySituation: "Friendly reconnaissance team in observation position",
    ammunitionAllowed: ["HE", "DPICM", "SMOKE"],
  },
  {
    id: "mission-005",
    name: "Counter-Battery",
    description: "Locate and destroy enemy artillery position",
    briefing: "Enemy artillery has been engaging friendly positions. Radar has located enemy battery at Grid 567890. Execute counter-battery fire before enemy can displace.",
    difficulty: "intermediate",
    terrain: "plains",
    weather: "rain",
    objectives: [
      {
        id: "obj-005-1",
        type: "destroy_target",
        description: "Neutralize enemy battery position",
        targetCoordinates: { grid: "567890", distance: 15000, direction: 315 },
        requiredRounds: 6,
        timeLimit: 180,
        successCriteria: "Enemy battery silenced",
      },
    ],
    drillsRequired: ["loading", "firing"],
    estimatedTime: 15,
    maxScore: 120,
    passingScore: 85,
    tacticalContext: "Counter-battery fire in support of defensive operations",
    enemySituation: "Enemy 122mm battery engaging friendly HQ",
    friendlySituation: "Friendly units under sustained artillery fire",
    ammunitionAllowed: ["HE", "ERFB-BB"],
  },
];

// Get scenario by ID
export function getScenarioById(id: string): MissionScenario | undefined {
  return missionScenarios.find((s) => s.id === id);
}

// Get scenarios by difficulty
export function getScenariosByDifficulty(difficulty: MissionScenario["difficulty"]): MissionScenario[] {
  return missionScenarios.filter((s) => s.difficulty === difficulty);
}

// Get scenarios by terrain
export function getScenariosByTerrain(terrain: TerrainCondition): MissionScenario[] {
  return missionScenarios.filter((s) => s.terrain === terrain);
}

// =============================================================================
// ENHANCED MISSION SCENARIOS - Additional scenarios for full SOW compliance
// =============================================================================

// Additional scenarios covering all gun systems and tactical situations
export const additionalScenarios: MissionScenario[] = [
  {
    id: "mission-006",
    name: "K9 Vajra Rapid Deployment",
    description: "Self-propelled howitzer shoot-and-scoot operation",
    briefing: "Deploy K9 Vajra battery for rapid fire mission. Execute 3 rounds fire for effect, then displace before enemy counter-battery. Time is critical.",
    difficulty: "intermediate",
    terrain: "desert",
    weather: "clear",
    objectives: [
      {
        id: "obj-006-1",
        type: "destroy_target",
        description: "Fire for effect on enemy assembly area",
        targetCoordinates: { grid: "678901", distance: 25000, direction: 45 },
        requiredRounds: 3,
        timeLimit: 60,
        successCriteria: "Complete FFE in under 60 seconds",
      },
      {
        id: "obj-006-2",
        type: "defense",
        description: "Displace to alternate position",
        timeLimit: 90,
        successCriteria: "Complete displacement before enemy response",
      },
    ],
    drillsRequired: ["firing"],
    estimatedTime: 8,
    maxScore: 150,
    passingScore: 100,
    tacticalContext: "Shoot-and-scoot against enemy with counter-battery radar",
    enemySituation: "Enemy has ARTHUR counter-battery radar, response time 3 minutes",
    friendlySituation: "Friendly mechanized brigade preparing attack",
    ammunitionAllowed: ["HE", "DPICM"],
  },
  {
    id: "mission-007",
    name: "Pinaka Area Saturation",
    description: "MBRL salvo fire against area target",
    briefing: "Enemy battalion assembly area identified. Execute Pinaka salvo to disrupt and attrit before friendly assault. Single salvo opportunity before displacement required.",
    difficulty: "intermediate",
    terrain: "plains",
    weather: "clear",
    objectives: [
      {
        id: "obj-007-1",
        type: "destroy_target",
        description: "Saturate enemy assembly area",
        targetCoordinates: { grid: "789012", distance: 40000, direction: 90 },
        requiredRounds: 12,
        timeLimit: 60,
        successCriteria: "Complete salvo of 12 rockets",
      },
      {
        id: "obj-007-2",
        type: "suppression",
        description: "Assess damage and report",
        timeLimit: 30,
        successCriteria: "BDA report to higher HQ",
      },
    ],
    drillsRequired: ["firing"],
    estimatedTime: 10,
    maxScore: 180,
    passingScore: 120,
    tacticalContext: "Deep fires in support of division offensive",
    enemySituation: "Enemy mechanized battalion in assembly area",
    friendlySituation: "Friendly division attacking at H+2",
    ammunitionAllowed: ["HE", "AT-SUBMUNITION"],
  },
  {
    id: "mission-008",
    name: "ATAGS Precision Strike",
    description: "Long-range precision engagement with ATAGS",
    briefing: "High-value target identified: enemy command post at maximum range. Single opportunity for precision strike using ATAGS extended range capability.",
    difficulty: "advanced",
    terrain: "mountain",
    weather: "clear",
    objectives: [
      {
        id: "obj-008-1",
        type: "destroy_target",
        description: "Destroy enemy command post",
        targetCoordinates: { grid: "890123", distance: 48000, direction: 270 },
        requiredRounds: 4,
        timeLimit: 240,
        successCriteria: "Target destroyed with base-bleed rounds",
      },
    ],
    drillsRequired: ["emplacement", "loading", "firing"],
    estimatedTime: 15,
    maxScore: 200,
    passingScore: 140,
    tacticalContext: "Precision deep strike against enemy C2",
    enemySituation: "Enemy divisional HQ at extreme range",
    friendlySituation: "SF team providing terminal guidance",
    ammunitionAllowed: ["BB-HE", "ERFB-BB", "PGM"],
  },
  {
    id: "mission-009",
    name: "Bofors Battery Defense",
    description: "Multi-gun coordinated defensive fire",
    briefing: "Enemy breakthrough imminent at Phase Line Delta. Coordinate 3-gun Bofors battery to establish defensive barrier. Sustained fire required to halt enemy advance.",
    difficulty: "advanced",
    terrain: "plains",
    weather: "rain",
    objectives: [
      {
        id: "obj-009-1",
        type: "defense",
        description: "Establish coordinated battery fire",
        timeLimit: 180,
        successCriteria: "3-gun battery synchronized",
      },
      {
        id: "obj-009-2",
        type: "suppression",
        description: "Create defensive fire barrier",
        targetCoordinates: { grid: "901234", distance: 18000, direction: 0 },
        requiredRounds: 18,
        timeLimit: 300,
        successCriteria: "Sustained ROF for 5 minutes",
      },
      {
        id: "obj-009-3",
        type: "destroy_target",
        description: "Engage penetrating elements",
        requiredRounds: 6,
        timeLimit: 120,
        successCriteria: "Destroy breakthrough armor",
      },
    ],
    drillsRequired: ["emplacement", "loading", "firing", "misfire"],
    estimatedTime: 25,
    maxScore: 300,
    passingScore: 200,
    tacticalContext: "Emergency defensive fires",
    enemySituation: "Enemy armor breakthrough with mechanized infantry support",
    friendlySituation: "Friendly infantry in prepared defensive positions",
    ammunitionAllowed: ["HE", "DPICM", "SMOKE"],
  },
  {
    id: "mission-010",
    name: "Joint Fire Support",
    description: "Coordinate with air and naval fires",
    briefing: "Complex joint fire support mission. Coordinate with CAS aircraft and naval gunfire to support amphibious landing. Timing and deconfliction critical.",
    difficulty: "expert",
    terrain: "plains",
    weather: "fog",
    objectives: [
      {
        id: "obj-010-1",
        type: "suppression",
        description: "Pre-landing bombardment",
        targetCoordinates: { grid: "012345", distance: 12000, direction: 180 },
        requiredRounds: 12,
        timeLimit: 180,
        successCriteria: "Complete prep fires before H-Hour",
      },
      {
        id: "obj-010-2",
        type: "smoke",
        description: "Screen landing craft approach",
        requiredRounds: 6,
        timeLimit: 120,
        successCriteria: "Smoke screen across beach",
      },
      {
        id: "obj-010-3",
        type: "destroy_target",
        description: "Neutralize bunker complex",
        targetCoordinates: { grid: "012567", distance: 8000, direction: 200 },
        requiredRounds: 8,
        timeLimit: 240,
        successCriteria: "Beach defense destroyed",
      },
      {
        id: "obj-010-4",
        type: "illumination",
        description: "Illuminate for second wave",
        requiredRounds: 4,
        timeLimit: 60,
        successCriteria: "Continuous illumination for 10 minutes",
      },
    ],
    drillsRequired: ["emplacement", "loading", "firing"],
    estimatedTime: 35,
    maxScore: 400,
    passingScore: 280,
    tacticalContext: "Joint amphibious assault support",
    enemySituation: "Fortified beach defenses with artillery",
    friendlySituation: "Marine brigade landing at H-Hour",
    ammunitionAllowed: ["HE", "SMOKE", "ILLUM", "DPICM"],
  },
];

// Combine all scenarios
export const allMissionScenarios: MissionScenario[] = [...missionScenarios, ...additionalScenarios];

// Get all scenarios
export function getAllScenarios(): MissionScenario[] {
  return allMissionScenarios;
}

// Get scenario count by difficulty
export function getScenarioCountByDifficulty(): Record<MissionScenario["difficulty"], number> {
  return allMissionScenarios.reduce((acc, s) => {
    acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<MissionScenario["difficulty"], number>);
}

// Calculate mission score based on performance
export interface MissionPerformance {
  objectivesCompleted: number;
  totalObjectives: number;
  roundsFired: number;
  roundsRequired: number;
  timeElapsed: number;
  timeLimit: number;
  errorsCommitted: number;
  safetyViolations: number;
}

export function calculateMissionScore(scenario: MissionScenario, performance: MissionPerformance): {
  totalScore: number;
  breakdown: { category: string; points: number; maxPoints: number }[];
  grade: string;
  passed: boolean;
} {
  const breakdown: { category: string; points: number; maxPoints: number }[] = [];

  // Objectives completion (50% of max score)
  const objectiveMax = scenario.maxScore * 0.5;
  const objectiveScore = Math.round((performance.objectivesCompleted / performance.totalObjectives) * objectiveMax);
  breakdown.push({ category: "Objectives", points: objectiveScore, maxPoints: objectiveMax });

  // Ammunition efficiency (20% of max score)
  const ammoMax = scenario.maxScore * 0.2;
  const ammoEfficiency = Math.min(1, performance.roundsRequired / Math.max(1, performance.roundsFired));
  const ammoScore = Math.round(ammoEfficiency * ammoMax);
  breakdown.push({ category: "Ammo Efficiency", points: ammoScore, maxPoints: ammoMax });

  // Time bonus (15% of max score)
  const timeMax = scenario.maxScore * 0.15;
  const timeEfficiency = Math.max(0, 1 - (performance.timeElapsed / performance.timeLimit));
  const timeScore = Math.round(timeEfficiency * timeMax);
  breakdown.push({ category: "Time Bonus", points: timeScore, maxPoints: timeMax });

  // Safety (15% of max score)
  const safetyMax = scenario.maxScore * 0.15;
  const safetyPenalty = (performance.errorsCommitted * 5) + (performance.safetyViolations * 20);
  const safetyScore = Math.max(0, safetyMax - safetyPenalty);
  breakdown.push({ category: "Safety", points: safetyScore, maxPoints: safetyMax });

  const totalScore = breakdown.reduce((sum, b) => sum + b.points, 0);
  const percentage = (totalScore / scenario.maxScore) * 100;

  let grade: string;
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 85) grade = "A";
  else if (percentage >= 80) grade = "B+";
  else if (percentage >= 75) grade = "B";
  else if (percentage >= 70) grade = "C+";
  else if (percentage >= 65) grade = "C";
  else if (percentage >= 60) grade = "D";
  else grade = "F";

  return {
    totalScore,
    breakdown,
    grade,
    passed: totalScore >= scenario.passingScore,
  };
}
