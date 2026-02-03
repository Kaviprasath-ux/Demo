// Gun Systems Configuration - SOW Section 8.4
// Simplified: 5 weapon systems for training

export type GunSystemId = "dhanush" | "ak47" | "glock-17" | "pkm" | "m249";
export type GunCategory = "towed" | "assault-rifle" | "pistol" | "machine-gun";

export interface GunSystemSpecs {
  caliber: string;
  barrelLength: string;
  muzzleVelocity: string;
  maxRange: string;
  maxRangeExtended?: string;
  rateOfFire: string;
  rateOfFireBurst?: string;
  elevation: string;
  traverse: string;
  crewSize: number;
  weight: string;
  travelWeight?: string;
}

export interface GunSystemAmmo {
  type: string;
  description: string;
  range: string;
}

export interface GunSystem {
  id: GunSystemId;
  name: string;
  fullName: string;
  origin: string;
  category: GunCategory;
  description: string;
  inServiceYear: number;
  image?: string;
  specs: GunSystemSpecs;
  ammunition: GunSystemAmmo[];
  features: string[];
  advantages: string[];
  crewPositions: CrewPosition[];
  modelScale: number;
  modelColor: string;
  modelSecondaryColor: string;
}

export interface CrewPosition {
  id: string;
  title: string;
  role: string;
  responsibilities: string[];
  location: string;
}

// Crew positions for towed artillery
const standardTowedCrew: CrewPosition[] = [
  {
    id: "no1",
    title: "No. 1 (Gun Commander)",
    role: "Command",
    responsibilities: [
      "Overall command of the gun",
      "Responsible for safety",
      "Receives and implements fire orders",
      "Supervises all crew actions",
    ],
    location: "Right side of breech",
  },
  {
    id: "no2",
    title: "No. 2 (Breech Operator)",
    role: "Firing",
    responsibilities: [
      "Operates breech mechanism",
      "Responsible for firing",
      "Maintains breech area cleanliness",
    ],
    location: "Directly behind breech",
  },
  {
    id: "no3",
    title: "No. 3 (Layer)",
    role: "Laying",
    responsibilities: [
      "Sets and maintains elevation",
      "Sets and maintains bearing/azimuth",
      "Operates laying equipment",
    ],
    location: "Left side at laying controls",
  },
  {
    id: "no4",
    title: "No. 4 (Loader)",
    role: "Loading",
    responsibilities: [
      "Loads projectiles into breech",
      "Uses rammer for proper seating",
      "Coordinates with No. 5 for ammunition",
    ],
    location: "Left rear of breech",
  },
  {
    id: "no5",
    title: "No. 5 (Ammunition Handler)",
    role: "Ammunition",
    responsibilities: [
      "Prepares ammunition",
      "Sets fuses as ordered",
      "Passes rounds to No. 4",
    ],
    location: "Ammunition point",
  },
  {
    id: "no6",
    title: "No. 6 (Driver)",
    role: "Support",
    responsibilities: [
      "Operates towing vehicle",
      "Maintains communication equipment",
      "Assists with gun positioning",
    ],
    location: "Prime mover vehicle",
  },
];

// Gun System Definitions - 5 Systems
export const gunSystems: GunSystem[] = [
  // ==================== ARTILLERY ====================
  {
    id: "dhanush",
    name: "Dhanush",
    fullName: "155mm/45 Dhanush Howitzer",
    origin: "India (OFB)",
    category: "towed",
    description: "Indigenous towed howitzer developed by OFB, based on Bofors design with Indian improvements. First indigenous 155mm artillery gun of the Indian Army.",
    inServiceYear: 2019,
    specs: {
      caliber: "155mm",
      barrelLength: "45 calibers (6.975m)",
      muzzleVelocity: "827 m/s",
      maxRange: "30 km (standard HE)",
      maxRangeExtended: "38 km (base bleed)",
      rateOfFire: "3 rounds/min (sustained)",
      rateOfFireBurst: "6 rounds/min (burst)",
      elevation: "-3° to +70°",
      traverse: "58° (29° L/R)",
      crewSize: 6,
      weight: "12,750 kg (combat)",
      travelWeight: "13,350 kg",
    },
    ammunition: [
      { type: "HE-FRAG", description: "High Explosive Fragmentation", range: "30 km" },
      { type: "BB-HE", description: "Base Bleed Extended Range", range: "38 km" },
      { type: "ILLUM", description: "Illumination Round", range: "18 km" },
      { type: "SMOKE", description: "Smoke Screen", range: "20 km" },
    ],
    features: [
      "Electronic gun laying system",
      "Inertial navigation integration",
      "Auxiliary power unit",
      "Self-propulsion kit available",
    ],
    advantages: [
      "Indigenous production",
      "All-weather capability",
      "Multiple ammunition compatibility",
      "Advanced fire control",
    ],
    crewPositions: standardTowedCrew,
    modelScale: 1.0,
    modelColor: "#4a5243",
    modelSecondaryColor: "#3d4339",
  },

  // ==================== RIFLE ====================
  {
    id: "ak47",
    name: "AK-47",
    fullName: "Avtomat Kalashnikova Model 1947",
    origin: "Russia/Soviet Union",
    category: "assault-rifle",
    description: "Legendary Soviet assault rifle known for extreme reliability and durability. One of the most widely used firearms in the world, featuring a gas-operated rotating bolt system.",
    inServiceYear: 1949,
    specs: {
      caliber: "7.62x39mm",
      barrelLength: "415mm",
      muzzleVelocity: "715 m/s",
      maxRange: "350m (effective)",
      rateOfFire: "600 rounds/min",
      elevation: "N/A",
      traverse: "N/A",
      crewSize: 1,
      weight: "3.47 kg (empty)",
    },
    ammunition: [
      { type: "7.62x39mm FMJ", description: "Full Metal Jacket", range: "350m" },
      { type: "7.62x39mm AP", description: "Armor Piercing", range: "300m" },
      { type: "7.62x39mm Tracer", description: "Tracer Round", range: "350m" },
    ],
    features: [
      "Gas-operated, rotating bolt",
      "30-round detachable magazine",
      "Selective fire (semi/full auto)",
      "Simple disassembly",
    ],
    advantages: [
      "Extreme reliability",
      "Low maintenance",
      "Tolerant to dirt and mud",
      "Widely available parts",
    ],
    crewPositions: [
      { id: "shooter", title: "Rifleman", role: "Primary", responsibilities: ["Operation", "Maintenance", "Marksmanship"], location: "Individual" },
    ],
    modelScale: 4.0,
    modelColor: "#4a3c2e",
    modelSecondaryColor: "#2a2420",
  },

  // ==================== PISTOL ====================
  {
    id: "glock-17",
    name: "Glock 17",
    fullName: "Glock 17 Gen 5",
    origin: "Austria",
    category: "pistol",
    description: "Standard-frame semi-automatic pistol designed by Gaston Glock. Revolutionary polymer-framed design that became the benchmark for modern combat pistols worldwide.",
    inServiceYear: 1982,
    specs: {
      caliber: "9x19mm Parabellum",
      barrelLength: "114mm",
      muzzleVelocity: "375 m/s",
      maxRange: "50m (effective)",
      rateOfFire: "Semi-automatic",
      elevation: "N/A",
      traverse: "N/A",
      crewSize: 1,
      weight: "0.63 kg (empty)",
    },
    ammunition: [
      { type: "9mm FMJ", description: "Full Metal Jacket", range: "50m" },
      { type: "9mm JHP", description: "Jacketed Hollow Point", range: "50m" },
      { type: "9mm +P", description: "Overpressure Load", range: "50m" },
    ],
    features: [
      "Polymer frame",
      "Safe Action trigger",
      "17-round magazine",
      "Striker-fired",
    ],
    advantages: [
      "Lightweight",
      "Reliable",
      "Easy maintenance",
      "Large aftermarket",
    ],
    crewPositions: [
      { id: "shooter", title: "Shooter", role: "Primary", responsibilities: ["Operation", "Maintenance"], location: "Individual" },
    ],
    modelScale: 6.0,
    modelColor: "#1a1a1a",
    modelSecondaryColor: "#2a2a2a",
  },

  // ==================== MACHINE GUNS ====================
  {
    id: "pkm",
    name: "PKM",
    fullName: "Pulemyot Kalashnikova Modernizirovanny",
    origin: "Russia/Soviet Union",
    category: "machine-gun",
    description: "Belt-fed general-purpose machine gun designed by Mikhail Kalashnikov. Known for reliability and firepower, used as both a squad automatic weapon and vehicle-mounted weapon.",
    inServiceYear: 1969,
    specs: {
      caliber: "7.62x54mmR",
      barrelLength: "658mm",
      muzzleVelocity: "825 m/s",
      maxRange: "1000m (effective)",
      rateOfFire: "650-750 rounds/min",
      elevation: "N/A",
      traverse: "N/A",
      crewSize: 2,
      weight: "7.5 kg (gun only)",
    },
    ammunition: [
      { type: "7.62x54mmR Ball", description: "Standard Ball", range: "1000m" },
      { type: "7.62x54mmR AP", description: "Armor Piercing", range: "800m" },
      { type: "7.62x54mmR Tracer", description: "Tracer", range: "1000m" },
    ],
    features: [
      "Belt-fed operation",
      "Quick-change barrel",
      "Integral bipod",
      "Tripod mountable",
    ],
    advantages: [
      "High firepower",
      "Reliability",
      "Long effective range",
      "Sustained fire capability",
    ],
    crewPositions: [
      { id: "gunner", title: "Machine Gunner", role: "Primary", responsibilities: ["Operation", "Fire control"], location: "Bipod/Tripod" },
      { id: "assistant", title: "Assistant Gunner", role: "Support", responsibilities: ["Ammunition", "Barrel changes"], location: "Adjacent" },
    ],
    modelScale: 4.0,
    modelColor: "#3d3530",
    modelSecondaryColor: "#2a2520",
  },
  {
    id: "m249",
    name: "M249 SAW",
    fullName: "M249 Squad Automatic Weapon",
    origin: "Belgium/USA",
    category: "machine-gun",
    description: "Light machine gun used by the US Armed Forces. Gas-operated, air-cooled, belt-fed weapon providing suppressive fire at the squad level. Also known as the FN Minimi.",
    inServiceYear: 1984,
    specs: {
      caliber: "5.56x45mm NATO",
      barrelLength: "465mm",
      muzzleVelocity: "915 m/s",
      maxRange: "800m (effective)",
      rateOfFire: "750-1000 rounds/min",
      elevation: "N/A",
      traverse: "N/A",
      crewSize: 1,
      weight: "7.5 kg (empty)",
    },
    ammunition: [
      { type: "5.56x45mm M855", description: "Standard Ball", range: "800m" },
      { type: "5.56x45mm M856", description: "Tracer", range: "800m" },
      { type: "5.56x45mm M855A1", description: "Enhanced Performance", range: "800m" },
    ],
    features: [
      "Belt or magazine fed",
      "Quick-change barrel",
      "Folding bipod",
      "Gas regulator",
    ],
    advantages: [
      "Light weight for class",
      "High rate of fire",
      "Magazine compatibility",
      "Reliable operation",
    ],
    crewPositions: [
      { id: "gunner", title: "Automatic Rifleman", role: "Primary", responsibilities: ["Operation", "Fire support"], location: "Bipod" },
    ],
    modelScale: 4.0,
    modelColor: "#4a4a3a",
    modelSecondaryColor: "#3a3a2a",
  },
];

// Helper functions
export function getGunSystemById(id: GunSystemId): GunSystem | undefined {
  return gunSystems.find((g) => g.id === id);
}

export function getGunSystemsByCategory(category: GunCategory): GunSystem[] {
  return gunSystems.filter((g) => g.category === category);
}

export function getCrewPosition(systemId: GunSystemId, positionId: string): CrewPosition | undefined {
  const system = getGunSystemById(systemId);
  if (!system) return undefined;
  return system.crewPositions.find((p) => p.id === positionId);
}
