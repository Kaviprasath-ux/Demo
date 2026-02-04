// Indian Army Helicopter Systems Data - SOW Annexure G

export type HelicopterCategory = "attack" | "utility" | "light" | "trainer";
export type HelicopterRole = "CAS" | "reconnaissance" | "transport" | "CASEVAC" | "escort" | "training" | "liaison";

export interface HelicopterWeapon {
  name: string;
  type: "gun" | "rocket" | "missile" | "bomb";
  quantity?: number;
  caliber?: string;
  range?: number;
  description: string;
}

export interface HelicopterSensor {
  name: string;
  type: "EO" | "IR" | "radar" | "laser" | "RWR";
  description: string;
}

export interface HelicopterSpecs {
  maxSpeed: number;           // km/h
  cruiseSpeed: number;        // km/h
  serviceCeiling: number;     // meters
  range: number;              // km
  endurance: number;          // hours
  maxTakeoffWeight: number;   // kg
  emptyWeight: number;        // kg
  crew: number;
  passengers?: number;
  cargoCapacity?: number;     // kg
  rotorDiameter: number;      // meters
  length: number;             // meters
  height: number;             // meters
  engines: string;
  enginePower: string;
}

export interface HelicopterSystem {
  id: string;
  name: string;
  designation: string;
  manufacturer: string;
  category: HelicopterCategory;
  roles: HelicopterRole[];
  description: string;
  doctrinalContext: string;
  specs: HelicopterSpecs;
  weapons?: HelicopterWeapon[];
  sensors?: HelicopterSensor[];
  variants?: string[];
  inService: boolean;
  primaryColor: string;       // For 3D model
  secondaryColor: string;     // For 3D model
}

// ============================================================================
// HELICOPTER SYSTEMS DATABASE
// ============================================================================

export const helicopterSystems: HelicopterSystem[] = [
  {
    id: "ALH_Dhruv",
    name: "HAL ALH Dhruv",
    designation: "Advanced Light Helicopter",
    manufacturer: "Hindustan Aeronautics Limited (HAL)",
    category: "utility",
    roles: ["transport", "CASEVAC", "reconnaissance", "liaison"],
    description: "Multi-role utility helicopter forming the backbone of Army Aviation for logistics, troop transport, and high-altitude support.",
    doctrinalContext: "Used extensively in Siachen, Ladakh and North-East for troop transport, logistics, CASEVAC, and HADR operations. Supports artillery units with observation and liaison.",
    specs: {
      maxSpeed: 290,
      cruiseSpeed: 245,
      serviceCeiling: 6500,
      range: 630,
      endurance: 4,
      maxTakeoffWeight: 5500,
      emptyWeight: 2502,
      crew: 2,
      passengers: 12,
      cargoCapacity: 1500,
      rotorDiameter: 13.2,
      length: 15.87,
      height: 4.98,
      engines: "2x Turbomeca TM 333-2B2 / Shakti",
      enginePower: "2x 1000 shp",
    },
    sensors: [
      { name: "Weather Radar", type: "radar", description: "All-weather navigation" },
      { name: "GPS/INS", type: "radar", description: "Navigation system" },
    ],
    variants: ["Dhruv Mk I", "Dhruv Mk III", "Dhruv Mk IV"],
    inService: true,
    primaryColor: "#4a5d23", // Olive drab
    secondaryColor: "#2d3a16",
  },
  {
    id: "Rudra_WSI",
    name: "HAL Rudra",
    designation: "ALH Weapon System Integrated (WSI)",
    manufacturer: "Hindustan Aeronautics Limited (HAL)",
    category: "attack",
    roles: ["CAS", "escort", "reconnaissance"],
    description: "Weaponized variant of ALH Dhruv. Forms the core of Army Aviation's attack/escort capability for CAS and armed overwatch.",
    doctrinalContext: "Primary role is CAS and armed reconnaissance in support of ground forces. Provides armed escort to Dhruv formations and direct fire support to artillery and maneuver units.",
    specs: {
      maxSpeed: 275,
      cruiseSpeed: 230,
      serviceCeiling: 6000,
      range: 500,
      endurance: 3.5,
      maxTakeoffWeight: 5500,
      emptyWeight: 2900,
      crew: 2,
      rotorDiameter: 13.2,
      length: 15.87,
      height: 4.98,
      engines: "2x Shakti (HAL/Turbomeca)",
      enginePower: "2x 1100 shp",
    },
    weapons: [
      { name: "M621 Cannon", type: "gun", caliber: "20mm", quantity: 1, description: "Turret-mounted automatic cannon" },
      { name: "70mm Rockets", type: "rocket", quantity: 4, description: "Rocket pods (12 rockets each)" },
      { name: "Mistral ATAM", type: "missile", quantity: 4, description: "Air-to-air missiles" },
      { name: "Helina/SANT", type: "missile", quantity: 4, range: 7, description: "Anti-tank guided missiles" },
    ],
    sensors: [
      { name: "Helmet Mounted Sight", type: "EO", description: "Pilot targeting system" },
      { name: "FLIR", type: "IR", description: "Forward-looking infrared" },
      { name: "Laser Rangefinder", type: "laser", description: "Target ranging" },
      { name: "RWR", type: "RWR", description: "Radar warning receiver" },
    ],
    variants: ["Rudra Mk I", "Rudra Mk IV"],
    inService: true,
    primaryColor: "#3d4f1f", // Dark olive
    secondaryColor: "#2a3815",
  },
  {
    id: "LCH_Prachand",
    name: "HAL LCH Prachand",
    designation: "Light Combat Helicopter",
    manufacturer: "Hindustan Aeronautics Limited (HAL)",
    category: "attack",
    roles: ["CAS", "escort", "reconnaissance"],
    description: "Dedicated attack helicopter designed for high-altitude combat. Crucial for anti-armour and direct fire support in mountain warfare.",
    doctrinalContext: "Designed specifically for high-altitude operations above 15,000ft. Primary missions include anti-armour, CAS, and deep support of ground forces in difficult terrain. Key asset for mountain warfare.",
    specs: {
      maxSpeed: 268,
      cruiseSpeed: 220,
      serviceCeiling: 6500,
      range: 550,
      endurance: 3.0,
      maxTakeoffWeight: 5800,
      emptyWeight: 2750,
      crew: 2,
      rotorDiameter: 13.2,
      length: 15.8,
      height: 4.7,
      engines: "2x Shakti (HAL/Turbomeca)",
      enginePower: "2x 1067 shp",
    },
    weapons: [
      { name: "M621 Cannon", type: "gun", caliber: "20mm", quantity: 1, description: "Turret-mounted automatic cannon" },
      { name: "70mm Rockets", type: "rocket", quantity: 4, description: "Rocket pods" },
      { name: "Mistral ATAM", type: "missile", quantity: 4, description: "Air-to-air missiles" },
      { name: "Helina/SANT", type: "missile", quantity: 8, range: 7, description: "Anti-tank guided missiles" },
    ],
    sensors: [
      { name: "CCD Camera", type: "EO", description: "Day sight" },
      { name: "FLIR", type: "IR", description: "Thermal imaging" },
      { name: "Laser Designator", type: "laser", description: "Target designation" },
      { name: "Helmet Mounted Display", type: "EO", description: "HMD for crew" },
      { name: "RWR", type: "RWR", description: "Radar warning receiver" },
      { name: "CMDS", type: "RWR", description: "Countermeasures dispensing system" },
    ],
    inService: true,
    primaryColor: "#404a2e", // Military green
    secondaryColor: "#2b3320",
  },
  {
    id: "Apache_AH64E",
    name: "Boeing AH-64E Apache Guardian",
    designation: "AH-64E",
    manufacturer: "Boeing",
    category: "attack",
    roles: ["CAS", "escort", "reconnaissance"],
    description: "Heavily armed, sensor-rich attack helicopter providing high-end CAS and anti-armour capability.",
    doctrinalContext: "Joint doctrines foresee close integration with mechanised and artillery elements. Provides the most lethal CAS capability in the inventory with Hellfire missiles and 30mm chain gun.",
    specs: {
      maxSpeed: 293,
      cruiseSpeed: 265,
      serviceCeiling: 6400,
      range: 476,
      endurance: 2.5,
      maxTakeoffWeight: 10433,
      emptyWeight: 5165,
      crew: 2,
      rotorDiameter: 14.63,
      length: 17.76,
      height: 4.64,
      engines: "2x GE T700-GE-701D",
      enginePower: "2x 1994 shp",
    },
    weapons: [
      { name: "M230 Chain Gun", type: "gun", caliber: "30mm", quantity: 1, description: "1200 rounds, turret-mounted" },
      { name: "AGM-114 Hellfire", type: "missile", quantity: 16, range: 8, description: "Anti-tank missiles" },
      { name: "Hydra 70 Rockets", type: "rocket", quantity: 76, description: "70mm rockets in pods" },
      { name: "AIM-92 Stinger", type: "missile", quantity: 4, description: "Air-to-air missiles" },
    ],
    sensors: [
      { name: "AN/APG-78 Longbow", type: "radar", description: "Fire control radar" },
      { name: "TADS/PNVS", type: "EO", description: "Target acquisition and night vision" },
      { name: "AN/ASQ-170", type: "IR", description: "Modernized target acquisition" },
      { name: "RWR/CMDS", type: "RWR", description: "Electronic warfare suite" },
    ],
    inService: true,
    primaryColor: "#4b5320", // Army green
    secondaryColor: "#343b17",
  },
  {
    id: "Chetak",
    name: "HAL Chetak",
    designation: "SA 316B Alouette III",
    manufacturer: "HAL (license from Sud Aviation)",
    category: "light",
    roles: ["reconnaissance", "liaison", "training", "transport"],
    description: "Legacy light helicopter for observation, light transport, and artillery OP roles in high-altitude areas.",
    doctrinalContext: "Used for observation and light transport, particularly in high-altitude and remote areas. Can support artillery OP roles and liaison. Being phased out but still operational.",
    specs: {
      maxSpeed: 210,
      cruiseSpeed: 185,
      serviceCeiling: 4100,
      range: 540,
      endurance: 4.0,
      maxTakeoffWeight: 2200,
      emptyWeight: 1143,
      crew: 1,
      passengers: 6,
      rotorDiameter: 11.02,
      length: 12.84,
      height: 3.09,
      engines: "1x Turbomeca Artouste IIIB",
      enginePower: "870 shp",
    },
    inService: true,
    primaryColor: "#556b2f", // Dark olive green
    secondaryColor: "#3d4d22",
  },
  {
    id: "Cheetah",
    name: "HAL Cheetah",
    designation: "SA 315B Lama",
    manufacturer: "HAL (license from Aerospatiale)",
    category: "light",
    roles: ["reconnaissance", "liaison", "CASEVAC", "transport"],
    description: "High-altitude specialist helicopter, holds world record for highest altitude landing. Critical for Siachen operations.",
    doctrinalContext: "Specialized for extreme high-altitude operations. Essential for Siachen and other high-altitude posts. Used for reconnaissance, casualty evacuation, and limited logistics.",
    specs: {
      maxSpeed: 192,
      cruiseSpeed: 170,
      serviceCeiling: 7000,
      range: 515,
      endurance: 3.5,
      maxTakeoffWeight: 2300,
      emptyWeight: 1021,
      crew: 1,
      passengers: 4,
      cargoCapacity: 500,
      rotorDiameter: 11.02,
      length: 12.92,
      height: 3.09,
      engines: "1x Turbomeca Artouste IIIB",
      enginePower: "870 shp",
    },
    inService: true,
    primaryColor: "#5a6b3c", // Sage green
    secondaryColor: "#414d2b",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getHelicopterById(id: string): HelicopterSystem | undefined {
  return helicopterSystems.find((h) => h.id === id);
}

export function getHelicoptersByCategory(category: HelicopterCategory): HelicopterSystem[] {
  return helicopterSystems.filter((h) => h.category === category);
}

export function getHelicoptersByRole(role: HelicopterRole): HelicopterSystem[] {
  return helicopterSystems.filter((h) => h.roles.includes(role));
}

export function getAttackHelicopters(): HelicopterSystem[] {
  return helicopterSystems.filter((h) => h.category === "attack");
}

export function getUtilityHelicopters(): HelicopterSystem[] {
  return helicopterSystems.filter((h) => h.category === "utility" || h.category === "light");
}

export function getCASCapableHelicopters(): HelicopterSystem[] {
  return helicopterSystems.filter((h) => h.roles.includes("CAS"));
}

// ============================================================================
// 3D MODEL CONFIGURATION
// ============================================================================

export interface Helicopter3DConfig {
  id: string;
  scale: number;
  rotorSpeed: number;         // RPM for animation
  tailRotorSpeed: number;     // RPM for animation
  defaultPosition: [number, number, number];
  cameraOffset: [number, number, number];
  cockpitPosition: [number, number, number];
}

export const helicopter3DConfigs: Record<string, Helicopter3DConfig> = {
  ALH_Dhruv: {
    id: "ALH_Dhruv",
    scale: 0.8,
    rotorSpeed: 300,
    tailRotorSpeed: 1200,
    defaultPosition: [0, 0, 0],
    cameraOffset: [10, 5, 10],
    cockpitPosition: [0, 1.5, 2],
  },
  Rudra_WSI: {
    id: "Rudra_WSI",
    scale: 0.8,
    rotorSpeed: 300,
    tailRotorSpeed: 1200,
    defaultPosition: [0, 0, 0],
    cameraOffset: [10, 5, 10],
    cockpitPosition: [0, 1.5, 2],
  },
  LCH_Prachand: {
    id: "LCH_Prachand",
    scale: 0.75,
    rotorSpeed: 320,
    tailRotorSpeed: 1300,
    defaultPosition: [0, 0, 0],
    cameraOffset: [8, 4, 8],
    cockpitPosition: [0, 1.2, 1.8],
  },
  Apache_AH64E: {
    id: "Apache_AH64E",
    scale: 0.9,
    rotorSpeed: 280,
    tailRotorSpeed: 1100,
    defaultPosition: [0, 0, 0],
    cameraOffset: [12, 6, 12],
    cockpitPosition: [0, 2, 2.5],
  },
  Chetak: {
    id: "Chetak",
    scale: 0.6,
    rotorSpeed: 350,
    tailRotorSpeed: 1400,
    defaultPosition: [0, 0, 0],
    cameraOffset: [6, 3, 6],
    cockpitPosition: [0, 1, 1.5],
  },
  Cheetah: {
    id: "Cheetah",
    scale: 0.6,
    rotorSpeed: 350,
    tailRotorSpeed: 1400,
    defaultPosition: [0, 0, 0],
    cameraOffset: [6, 3, 6],
    cockpitPosition: [0, 1, 1.5],
  },
};

export function get3DConfig(helicopterId: string): Helicopter3DConfig | undefined {
  return helicopter3DConfigs[helicopterId];
}
