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
