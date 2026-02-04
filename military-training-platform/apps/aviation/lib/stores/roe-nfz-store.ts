import { create } from "zustand";
import { persist } from "zustand/middleware";

// ROE (Rules of Engagement) Types
export interface ROERule {
  id: string;
  name: string;
  code: string;
  category: "weapons" | "airspace" | "coordination" | "safety" | "general";
  conditions: string[];
  restrictions: string[];
  authority: string;
  clearanceRequired: "restricted" | "confidential" | "secret";
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// No-Fly Zone Types
export interface NoFlyZone {
  id: string;
  name: string;
  code: string;
  type: "permanent" | "temporary" | "conditional";
  reason: "military" | "civilian" | "diplomatic" | "environmental" | "training";
  coordinates: [number, number][]; // [lat, lng] polygon
  center: [number, number];
  radius?: number; // For circular NFZs in km
  altitudeMin: number; // In feet AGL
  altitudeMax: number;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  exceptions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Airspace Coordination Types
export interface AirspaceCoordination {
  id: string;
  name: string;
  type: "FSCL" | "CFL" | "ACL" | "ROZ" | "KILLBOX";
  coordinates: [number, number][];
  altitudeMin: number;
  altitudeMax: number;
  controlAuthority: string;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

interface ROENFZState {
  // ROE Rules
  roeRules: ROERule[];
  addROERule: (rule: Omit<ROERule, "id" | "createdAt" | "updatedAt">) => void;
  updateROERule: (id: string, updates: Partial<ROERule>) => void;
  deleteROERule: (id: string) => void;
  toggleROERule: (id: string) => void;
  getActiveROERules: () => ROERule[];
  getROERulesByCategory: (category: ROERule["category"]) => ROERule[];

  // No-Fly Zones
  noFlyZones: NoFlyZone[];
  addNoFlyZone: (zone: Omit<NoFlyZone, "id" | "createdAt" | "updatedAt">) => void;
  updateNoFlyZone: (id: string, updates: Partial<NoFlyZone>) => void;
  deleteNoFlyZone: (id: string) => void;
  toggleNoFlyZone: (id: string) => void;
  getActiveNoFlyZones: () => NoFlyZone[];

  // Airspace Coordination
  airspaceCoordinations: AirspaceCoordination[];
  addAirspaceCoordination: (coord: Omit<AirspaceCoordination, "id">) => void;
  updateAirspaceCoordination: (id: string, updates: Partial<AirspaceCoordination>) => void;
  deleteAirspaceCoordination: (id: string) => void;

  // Validation
  checkRouteAgainstNFZs: (route: [number, number][]) => NoFlyZone[];
  validateMissionROE: (missionType: string, weapons: string[]) => { valid: boolean; violations: string[] };
}

// Mock ROE Rules
const mockROERules: ROERule[] = [
  {
    id: "roe-1",
    name: "CAS Weapons Release Authority",
    code: "ROE-CAS-001",
    category: "weapons",
    conditions: [
      "Positive identification of hostile target",
      "FAC/JTAC clearance received",
      "Friendly force positions confirmed",
    ],
    restrictions: [
      "No weapons release within 500m of friendly positions without JTAC clearance",
      "Collateral damage estimate required for all strikes",
    ],
    authority: "Division Commander",
    clearanceRequired: "secret",
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "roe-2",
    name: "Airspace Coordination Line",
    code: "ROE-AIR-001",
    category: "airspace",
    conditions: [
      "Flight operations require airspace clearance",
      "Artillery firing notifications active",
    ],
    restrictions: [
      "No flight below CFL without artillery coordination",
      "Mandatory position reporting every 5 minutes",
    ],
    authority: "Air Coordination Center",
    clearanceRequired: "confidential",
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "roe-3",
    name: "MEDEVAC Priority Protocol",
    code: "ROE-MED-001",
    category: "safety",
    conditions: [
      "Medical evacuation missions",
      "Marked MEDEVAC aircraft",
    ],
    restrictions: [
      "MEDEVAC aircraft must not carry weapons",
      "Red Cross markings mandatory",
    ],
    authority: "Medical Command",
    clearanceRequired: "restricted",
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "roe-4",
    name: "Night Operations Protocol",
    code: "ROE-NIT-001",
    category: "coordination",
    conditions: [
      "Operations between sunset and sunrise",
      "NVG-equipped aircraft only",
    ],
    restrictions: [
      "Minimum crew rest 12 hours before night ops",
      "Two-pilot requirement for all night missions",
    ],
    authority: "Squadron Commander",
    clearanceRequired: "confidential",
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock No-Fly Zones
const mockNoFlyZones: NoFlyZone[] = [
  {
    id: "nfz-1",
    name: "Training Area Alpha - Active Range",
    code: "NFZ-TRN-A",
    type: "temporary",
    reason: "training",
    coordinates: [
      [28.5, 77.0],
      [28.5, 77.5],
      [28.0, 77.5],
      [28.0, 77.0],
    ],
    center: [28.25, 77.25],
    altitudeMin: 0,
    altitudeMax: 15000,
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
    effectiveTo: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "nfz-2",
    name: "Delhi Airport TMA",
    code: "NFZ-CIV-DEL",
    type: "permanent",
    reason: "civilian",
    coordinates: [
      [28.7, 77.0],
      [28.7, 77.3],
      [28.4, 77.3],
      [28.4, 77.0],
    ],
    center: [28.55, 77.15],
    radius: 30,
    altitudeMin: 0,
    altitudeMax: 25000,
    isActive: true,
    effectiveFrom: new Date("2020-01-01"),
    exceptions: ["Emergency MEDEVAC with ATC clearance"],
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "nfz-3",
    name: "Forward Operating Base Perimeter",
    code: "NFZ-MIL-FOB",
    type: "permanent",
    reason: "military",
    coordinates: [
      [28.3, 77.8],
      [28.3, 77.9],
      [28.2, 77.9],
      [28.2, 77.8],
    ],
    center: [28.25, 77.85],
    radius: 5,
    altitudeMin: 0,
    altitudeMax: 5000,
    isActive: true,
    effectiveFrom: new Date("2023-01-01"),
    exceptions: ["Authorized military aircraft with FOB clearance"],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock Airspace Coordinations
const mockAirspaceCoordinations: AirspaceCoordination[] = [
  {
    id: "ac-1",
    name: "Fire Support Coordination Line - East",
    type: "FSCL",
    coordinates: [
      [28.0, 77.0],
      [28.0, 78.0],
    ],
    altitudeMin: 0,
    altitudeMax: 99999,
    controlAuthority: "Corps Artillery",
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    id: "ac-2",
    name: "Coordinated Fire Line - Sector A",
    type: "CFL",
    coordinates: [
      [28.2, 77.0],
      [28.2, 77.5],
    ],
    altitudeMin: 0,
    altitudeMax: 10000,
    controlAuthority: "Division Artillery",
    isActive: true,
    effectiveFrom: new Date("2024-01-01"),
  },
];

export const useROENFZStore = create<ROENFZState>()(
  persist(
    (set, get) => ({
      roeRules: mockROERules,
      noFlyZones: mockNoFlyZones,
      airspaceCoordinations: mockAirspaceCoordinations,

      // ROE Rule Methods
      addROERule: (rule) =>
        set((state) => ({
          roeRules: [
            ...state.roeRules,
            {
              ...rule,
              id: `roe-${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateROERule: (id, updates) =>
        set((state) => ({
          roeRules: state.roeRules.map((rule) =>
            rule.id === id ? { ...rule, ...updates, updatedAt: new Date() } : rule
          ),
        })),

      deleteROERule: (id) =>
        set((state) => ({
          roeRules: state.roeRules.filter((rule) => rule.id !== id),
        })),

      toggleROERule: (id) =>
        set((state) => ({
          roeRules: state.roeRules.map((rule) =>
            rule.id === id ? { ...rule, isActive: !rule.isActive, updatedAt: new Date() } : rule
          ),
        })),

      getActiveROERules: () => get().roeRules.filter((rule) => rule.isActive),

      getROERulesByCategory: (category) =>
        get().roeRules.filter((rule) => rule.category === category),

      // No-Fly Zone Methods
      addNoFlyZone: (zone) =>
        set((state) => ({
          noFlyZones: [
            ...state.noFlyZones,
            {
              ...zone,
              id: `nfz-${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateNoFlyZone: (id, updates) =>
        set((state) => ({
          noFlyZones: state.noFlyZones.map((zone) =>
            zone.id === id ? { ...zone, ...updates, updatedAt: new Date() } : zone
          ),
        })),

      deleteNoFlyZone: (id) =>
        set((state) => ({
          noFlyZones: state.noFlyZones.filter((zone) => zone.id !== id),
        })),

      toggleNoFlyZone: (id) =>
        set((state) => ({
          noFlyZones: state.noFlyZones.map((zone) =>
            zone.id === id ? { ...zone, isActive: !zone.isActive, updatedAt: new Date() } : zone
          ),
        })),

      getActiveNoFlyZones: () => get().noFlyZones.filter((zone) => zone.isActive),

      // Airspace Coordination Methods
      addAirspaceCoordination: (coord) =>
        set((state) => ({
          airspaceCoordinations: [
            ...state.airspaceCoordinations,
            { ...coord, id: `ac-${Date.now()}` },
          ],
        })),

      updateAirspaceCoordination: (id, updates) =>
        set((state) => ({
          airspaceCoordinations: state.airspaceCoordinations.map((coord) =>
            coord.id === id ? { ...coord, ...updates } : coord
          ),
        })),

      deleteAirspaceCoordination: (id) =>
        set((state) => ({
          airspaceCoordinations: state.airspaceCoordinations.filter((coord) => coord.id !== id),
        })),

      // Validation Methods
      checkRouteAgainstNFZs: (route) => {
        const activeNFZs = get().getActiveNoFlyZones();
        const violations: NoFlyZone[] = [];

        // Simple point-in-polygon check for each waypoint
        route.forEach((point) => {
          activeNFZs.forEach((nfz) => {
            if (nfz.radius) {
              // Circular NFZ check
              const distance = Math.sqrt(
                Math.pow(point[0] - nfz.center[0], 2) + Math.pow(point[1] - nfz.center[1], 2)
              );
              if (distance * 111 < nfz.radius && !violations.includes(nfz)) {
                violations.push(nfz);
              }
            }
          });
        });

        return violations;
      },

      validateMissionROE: (missionType, weapons) => {
        const activeRules = get().getActiveROERules();
        const violations: string[] = [];

        // Check weapons ROE
        if (weapons.length > 0) {
          const weaponsRules = activeRules.filter((r) => r.category === "weapons");
          weaponsRules.forEach((rule) => {
            if (!rule.conditions.every((c) => c.includes("confirmed"))) {
              violations.push(`${rule.code}: ${rule.name} requires verification`);
            }
          });
        }

        // Check mission-specific ROE
        if (missionType === "CAS") {
          const casRules = activeRules.filter((r) => r.code.includes("CAS"));
          if (casRules.length === 0) {
            violations.push("No active CAS ROE rules found");
          }
        }

        return {
          valid: violations.length === 0,
          violations,
        };
      },
    }),
    {
      name: "aviation-roe-nfz-store",
    }
  )
);
