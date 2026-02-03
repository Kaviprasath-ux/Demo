// Fire Direction Center (FDC) Simulation - SOW Section 8.4
// Simulates fire mission processing, firing data computation, and battery control

// =============================================================================
// TYPES
// =============================================================================

export type MissionType =
  | "adjust_fire" // Observed fire with adjustments
  | "fire_for_effect" // Immediate engagement
  | "suppression" // Area suppression
  | "illumination" // Night illumination
  | "smoke" // Smoke screen
  | "registration"; // Pre-planned registration point

export type TargetType =
  | "point" // Single point target
  | "linear" // Linear target (trench, road)
  | "area" // Area target
  | "moving"; // Moving target

export type AmmunitionType = "HE" | "SMOKE" | "ILLUM" | "WP" | "ICM" | "RAP";

export type FuzeType = "quick" | "delay" | "vt" | "time" | "mtsq";

export type MissionStatus =
  | "pending" // Awaiting processing
  | "computing" // FDC computing data
  | "ready" // Data computed, ready to fire
  | "firing" // Rounds in the air
  | "adjusting" // Awaiting adjustment
  | "complete" // Mission complete
  | "cancelled"; // Mission cancelled

// =============================================================================
// INTERFACES
// =============================================================================

export interface GridCoordinate {
  easting: number; // Easting in meters
  northing: number; // Northing in meters
  altitude: number; // Altitude in meters MSL
}

export interface Observer {
  id: string;
  callsign: string;
  position: GridCoordinate;
  type: "fop" | "air" | "radar" | "survey";
}

export interface Target {
  id: string;
  grid: GridCoordinate;
  type: TargetType;
  description: string;
  dimensions?: {
    length?: number; // For linear/area
    width?: number; // For area
    attitude?: number; // Direction for linear
  };
  priority: "immediate" | "priority" | "routine";
}

export interface FiringData {
  deflection: number; // Mils
  quadrantElevation: number; // Mils
  charge: number; // Charge number
  fuzeTime?: number; // For time fuze
  range: number; // Meters
  timeOfFlight: number; // Seconds
}

export interface FireMission {
  id: string;
  observer: Observer;
  target: Target;
  missionType: MissionType;
  ammunition: AmmunitionType;
  fuze: FuzeType;
  roundsRequested: number;
  status: MissionStatus;
  firingData?: FiringData;
  adjustments: Adjustment[];
  roundsFired: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Adjustment {
  id: string;
  direction: "add" | "drop" | "left" | "right";
  distance: number; // Meters
  timestamp: Date;
}

export interface Battery {
  id: string;
  designation: string; // e.g., "Alpha Battery"
  position: GridCoordinate;
  gunCount: number;
  status: "ready" | "firing" | "reloading" | "moving";
  roundsAvailable: Record<AmmunitionType, number>;
  currentMission?: string; // Mission ID
}

export interface MeteorologicalData {
  timestamp: Date;
  temperature: number; // Celsius
  pressure: number; // mb
  humidity: number; // Percentage
  windSpeed: number; // m/s
  windDirection: number; // Degrees
  airDensity: number; // kg/m³
}

// =============================================================================
// FDC STATE
// =============================================================================

export interface FDCState {
  batteries: Battery[];
  missions: FireMission[];
  observers: Observer[];
  metro: MeteorologicalData;
  currentMissionId: string | null;
}

// =============================================================================
// INITIAL DATA
// =============================================================================

export const defaultMetro: MeteorologicalData = {
  timestamp: new Date(),
  temperature: 25,
  pressure: 1013.25,
  humidity: 60,
  windSpeed: 5,
  windDirection: 270,
  airDensity: 1.225,
};

export const defaultBatteries: Battery[] = [
  {
    id: "bat-alpha",
    designation: "Alpha Battery",
    position: { easting: 500000, northing: 3500000, altitude: 450 },
    gunCount: 6,
    status: "ready",
    roundsAvailable: { HE: 240, SMOKE: 48, ILLUM: 24, WP: 12, ICM: 36, RAP: 12 },
  },
  {
    id: "bat-bravo",
    designation: "Bravo Battery",
    position: { easting: 502000, northing: 3500500, altitude: 445 },
    gunCount: 6,
    status: "ready",
    roundsAvailable: { HE: 200, SMOKE: 36, ILLUM: 18, WP: 12, ICM: 24, RAP: 6 },
  },
];

export const defaultObservers: Observer[] = [
  {
    id: "obs-1",
    callsign: "FALCON-1",
    position: { easting: 505000, northing: 3508000, altitude: 520 },
    type: "fop",
  },
  {
    id: "obs-2",
    callsign: "EAGLE-6",
    position: { easting: 508000, northing: 3506000, altitude: 480 },
    type: "fop",
  },
];

// =============================================================================
// BALLISTIC CALCULATIONS (Simplified)
// =============================================================================

export function calculateRange(from: GridCoordinate, to: GridCoordinate): number {
  const dx = to.easting - from.easting;
  const dy = to.northing - from.northing;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateDeflection(from: GridCoordinate, to: GridCoordinate): number {
  const dx = to.easting - from.easting;
  const dy = to.northing - from.northing;
  let azimuth = Math.atan2(dx, dy) * (180 / Math.PI);
  if (azimuth < 0) azimuth += 360;
  // Convert to mils (1 degree = 17.78 mils)
  return Math.round(azimuth * 17.78);
}

export function calculateCharge(range: number): number {
  // Simplified charge selection based on range
  if (range < 5000) return 1;
  if (range < 10000) return 2;
  if (range < 15000) return 3;
  if (range < 20000) return 4;
  if (range < 25000) return 5;
  if (range < 30000) return 6;
  return 7;
}

export function calculateQE(range: number, altitudeDiff: number): number {
  // Simplified quadrant elevation calculation
  // Real calculation would use firing tables
  const baseElevation = Math.atan(range / 30000) * (180 / Math.PI) * 17.78;
  const siteFactor = (altitudeDiff / range) * 1000; // Simplified site adjustment
  return Math.round(baseElevation + siteFactor);
}

export function calculateTimeOfFlight(range: number, charge: number): number {
  // Simplified TOF calculation
  const baseVelocity = 500 + charge * 50; // m/s
  return Math.round((range / baseVelocity) * 10) / 10;
}

export function computeFiringData(
  battery: Battery,
  target: Target,
  metro: MeteorologicalData
): FiringData {
  const range = calculateRange(battery.position, target.grid);
  const deflection = calculateDeflection(battery.position, target.grid);
  const charge = calculateCharge(range);
  const altitudeDiff = target.grid.altitude - battery.position.altitude;
  const qe = calculateQE(range, altitudeDiff);
  const tof = calculateTimeOfFlight(range, charge);

  // Apply metro corrections (simplified)
  const tempCorrection = (metro.temperature - 15) * 0.5; // mils per degree
  const pressCorrection = (1013.25 - metro.pressure) * 0.3; // mils per mb

  return {
    deflection,
    quadrantElevation: Math.round(qe + tempCorrection + pressCorrection),
    charge,
    range: Math.round(range),
    timeOfFlight: tof,
  };
}

// =============================================================================
// FIRE MISSION PROCESSING
// =============================================================================

export function createFireMission(
  observer: Observer,
  target: Target,
  missionType: MissionType,
  ammunition: AmmunitionType,
  fuze: FuzeType,
  roundsRequested: number
): FireMission {
  return {
    id: `fm-${Date.now()}`,
    observer,
    target,
    missionType,
    ammunition,
    fuze,
    roundsRequested,
    status: "pending",
    adjustments: [],
    roundsFired: 0,
    createdAt: new Date(),
  };
}

export function processMission(
  mission: FireMission,
  battery: Battery,
  metro: MeteorologicalData
): FireMission {
  const firingData = computeFiringData(battery, mission.target, metro);

  return {
    ...mission,
    status: "ready",
    firingData,
  };
}

export function applyAdjustment(
  mission: FireMission,
  adjustment: Adjustment,
  battery: Battery,
  metro: MeteorologicalData
): FireMission {
  // Apply adjustment to target grid
  let newEasting = mission.target.grid.easting;
  let newNorthing = mission.target.grid.northing;

  // Calculate observer-target azimuth for left/right adjustment
  const dx = mission.target.grid.easting - mission.observer.position.easting;
  const dy = mission.target.grid.northing - mission.observer.position.northing;
  const azimuth = Math.atan2(dx, dy);

  switch (adjustment.direction) {
    case "add":
      newNorthing += adjustment.distance;
      break;
    case "drop":
      newNorthing -= adjustment.distance;
      break;
    case "left":
      newEasting -= Math.cos(azimuth) * adjustment.distance;
      newNorthing -= Math.sin(azimuth) * adjustment.distance;
      break;
    case "right":
      newEasting += Math.cos(azimuth) * adjustment.distance;
      newNorthing += Math.sin(azimuth) * adjustment.distance;
      break;
  }

  const updatedTarget: Target = {
    ...mission.target,
    grid: {
      ...mission.target.grid,
      easting: newEasting,
      northing: newNorthing,
    },
  };

  const updatedMission: FireMission = {
    ...mission,
    target: updatedTarget,
    adjustments: [...mission.adjustments, adjustment],
    status: "computing",
  };

  // Recompute firing data
  return processMission(updatedMission, battery, metro);
}

export function formatFiringCommand(mission: FireMission, battery: Battery): string {
  if (!mission.firingData) return "";

  const fd = mission.firingData;
  const lines = [
    `BATTERY: ${battery.designation}`,
    `MISSION: ${mission.id}`,
    `TARGET: ${mission.target.description}`,
    ``,
    `DEFLECTION: ${fd.deflection} MILS`,
    `QUADRANT: ${fd.quadrantElevation} MILS`,
    `CHARGE: ${fd.charge}`,
    `FUZE: ${mission.fuze.toUpperCase()}`,
    `AMMUNITION: ${mission.ammunition}`,
    ``,
    `ROUNDS: ${mission.roundsRequested} ROUNDS`,
    `AT MY COMMAND`,
  ];

  return lines.join("\n");
}

// =============================================================================
// SAMPLE FIRE MISSIONS (Training scenarios)
// =============================================================================

export const sampleMissions: Omit<FireMission, "id" | "createdAt" | "adjustments" | "roundsFired" | "status" | "firingData">[] = [
  {
    observer: defaultObservers[0],
    target: {
      id: "tgt-1",
      grid: { easting: 510000, northing: 3510000, altitude: 480 },
      type: "point",
      description: "Enemy OP on Hill 480",
      priority: "immediate",
    },
    missionType: "adjust_fire",
    ammunition: "HE",
    fuze: "quick",
    roundsRequested: 6,
  },
  {
    observer: defaultObservers[1],
    target: {
      id: "tgt-2",
      grid: { easting: 512000, northing: 3508000, altitude: 420 },
      type: "area",
      description: "Troop concentration in open",
      dimensions: { length: 200, width: 100 },
      priority: "priority",
    },
    missionType: "fire_for_effect",
    ammunition: "HE",
    fuze: "vt",
    roundsRequested: 18,
  },
  {
    observer: defaultObservers[0],
    target: {
      id: "tgt-3",
      grid: { easting: 508000, northing: 3512000, altitude: 500 },
      type: "linear",
      description: "Enemy trench line",
      dimensions: { length: 300, attitude: 45 },
      priority: "priority",
    },
    missionType: "suppression",
    ammunition: "HE",
    fuze: "delay",
    roundsRequested: 12,
  },
  {
    observer: defaultObservers[1],
    target: {
      id: "tgt-4",
      grid: { easting: 515000, northing: 3505000, altitude: 400 },
      type: "point",
      description: "Night defensive fire point",
      priority: "routine",
    },
    missionType: "illumination",
    ammunition: "ILLUM",
    fuze: "time",
    roundsRequested: 4,
  },
];

// =============================================================================
// FDC TRAINING SCENARIOS
// =============================================================================

export interface FDCScenario {
  id: string;
  name: string;
  description: string;
  difficulty: "basic" | "intermediate" | "advanced";
  objectives: string[];
  missions: typeof sampleMissions;
  timeLimit?: number; // seconds
}

export const fdcScenarios: FDCScenario[] = [
  {
    id: "fdc-basic-1",
    name: "Single Adjust Fire",
    description: "Process a single adjust fire mission with one adjustment",
    difficulty: "basic",
    objectives: [
      "Receive fire mission from FOP",
      "Compute initial firing data",
      "Issue fire command",
      "Apply one adjustment",
      "Complete fire for effect",
    ],
    missions: [sampleMissions[0]],
    timeLimit: 300,
  },
  {
    id: "fdc-basic-2",
    name: "Fire for Effect",
    description: "Process an immediate fire for effect mission",
    difficulty: "basic",
    objectives: [
      "Receive immediate fire mission",
      "Select appropriate battery",
      "Compute firing data",
      "Issue fire command",
    ],
    missions: [sampleMissions[1]],
    timeLimit: 180,
  },
  {
    id: "fdc-int-1",
    name: "Multiple Missions",
    description: "Manage multiple concurrent fire missions",
    difficulty: "intermediate",
    objectives: [
      "Process high priority mission first",
      "Assign missions to different batteries",
      "Manage ammunition consumption",
      "Complete all missions",
    ],
    missions: [sampleMissions[0], sampleMissions[1]],
    timeLimit: 600,
  },
  {
    id: "fdc-adv-1",
    name: "Full FDC Operations",
    description: "Complete FDC operations under time pressure",
    difficulty: "advanced",
    objectives: [
      "Process all missions by priority",
      "Optimize battery assignments",
      "Handle mission adjustments",
      "Maintain fire support coverage",
      "Complete within time limit",
    ],
    missions: sampleMissions,
    timeLimit: 900,
  },
];
