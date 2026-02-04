// Cadet Cognitive Progression & Skill Maturity Model
// Based on military training pipeline principles

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Progression Levels
export const PROGRESSION_LEVELS = {
  1: {
    id: 1,
    name: "Rote Drill",
    description: "Memorize and execute drill steps with AI guidance",
    color: "#6b7280", // gray
    icon: "BookOpen",
    requirements: {
      drillsCompleted: 0,
      accuracy: 0,
      safetyViolations: 0,
    },
    aiUnlocks: [
      "Step-by-step drill guidance",
      "Voice commands for each action",
      "Immediate error correction",
    ],
    safetyGates: ["Basic safety briefing completed", "Supervisor present required"],
  },
  2: {
    id: 2,
    name: "Conceptual Understanding",
    description: "Understand WHY each step matters, doctrine knowledge",
    color: "#3b82f6", // blue
    icon: "Brain",
    requirements: {
      drillsCompleted: 10,
      accuracy: 70,
      safetyViolations: 5,
    },
    aiUnlocks: [
      "Doctrine explanations on demand",
      "Why-based questioning",
      "Component function details",
    ],
    safetyGates: ["Level 1 certified", "Written test passed (60%+)"],
  },
  3: {
    id: 3,
    name: "Spatial Awareness",
    description: "3D visualization mastery, component identification",
    color: "#8b5cf6", // purple
    icon: "Box",
    requirements: {
      drillsCompleted: 25,
      accuracy: 80,
      safetyViolations: 3,
    },
    aiUnlocks: [
      "Full 3D Digital Twin interaction",
      "Exploded view analysis",
      "X-ray mode for internals",
      "Trajectory visualization",
    ],
    safetyGates: ["Level 2 certified", "3D assessment passed", "No major violations in 10 drills"],
  },
  4: {
    id: 4,
    name: "Error-Free Execution",
    description: "Execute drills without mistakes under time pressure",
    color: "#10b981", // green
    icon: "CheckCircle",
    requirements: {
      drillsCompleted: 50,
      accuracy: 95,
      safetyViolations: 1,
    },
    aiUnlocks: [
      "Timed drill assessments",
      "Performance analytics",
      "Comparative benchmarking",
      "Certification examinations",
    ],
    safetyGates: ["Level 3 certified", "5 consecutive error-free drills", "Instructor sign-off"],
  },
  5: {
    id: 5,
    name: "Tactical Reasoning",
    description: "Apply doctrine in scenarios, make tactical decisions",
    color: "#f59e0b", // amber/gold
    icon: "Target",
    requirements: {
      drillsCompleted: 100,
      accuracy: 98,
      safetyViolations: 0,
    },
    aiUnlocks: [
      "Scenario-based training",
      "FDC calculations",
      "Multi-gun coordination",
      "Emergency drill simulation",
      "After Action Review (AAR)",
    ],
    safetyGates: ["Level 4 certified", "Tactical assessment passed", "Zero safety violations in 20 drills", "Board examination cleared"],
  },
} as const;

export type ProgressionLevel = keyof typeof PROGRESSION_LEVELS;

export interface CadetProgress {
  odNumber: string;
  name: string;
  currentLevel: ProgressionLevel;
  drillsCompleted: number;
  totalAccuracy: number;
  safetyViolations: number;
  levelStartDate: string;
  certifications: number[];
  lastActivityDate: string;
  batch: string;
}

export interface ProgressionStore {
  cadets: Record<string, CadetProgress>;

  // Actions
  getCadetProgress: (odNumber: string) => CadetProgress | null;
  updateCadetProgress: (odNumber: string, updates: Partial<CadetProgress>) => void;
  recordDrillCompletion: (odNumber: string, accuracy: number, safetyViolation: boolean) => void;
  promoteToLevel: (odNumber: string, level: ProgressionLevel) => void;
  checkLevelEligibility: (odNumber: string, targetLevel: ProgressionLevel) => { eligible: boolean; gaps: string[] };
  getBatchStats: (batch: string) => { levelDistribution: Record<ProgressionLevel, number>; avgAccuracy: number };
}

// Calculate level based on progress
export function calculateLevel(progress: CadetProgress): ProgressionLevel {
  const levels = [5, 4, 3, 2, 1] as ProgressionLevel[];

  for (const level of levels) {
    const req = PROGRESSION_LEVELS[level].requirements;
    if (
      progress.drillsCompleted >= req.drillsCompleted &&
      progress.totalAccuracy >= req.accuracy &&
      progress.safetyViolations <= req.safetyViolations
    ) {
      return level;
    }
  }
  return 1;
}

// Get progress percentage towards next level
export function getProgressToNextLevel(progress: CadetProgress): {
  percentage: number;
  drillsNeeded: number;
  accuracyNeeded: number;
  safetyGap: number;
} {
  const currentLevel = progress.currentLevel;
  if (currentLevel >= 5) {
    return { percentage: 100, drillsNeeded: 0, accuracyNeeded: 0, safetyGap: 0 };
  }

  const nextLevel = (currentLevel + 1) as ProgressionLevel;
  const req = PROGRESSION_LEVELS[nextLevel].requirements;

  const drillProgress = Math.min(100, (progress.drillsCompleted / req.drillsCompleted) * 100);
  const accuracyProgress = Math.min(100, (progress.totalAccuracy / req.accuracy) * 100);
  const safetyProgress = progress.safetyViolations <= req.safetyViolations ? 100 :
    Math.max(0, 100 - ((progress.safetyViolations - req.safetyViolations) * 20));

  return {
    percentage: Math.round((drillProgress + accuracyProgress + safetyProgress) / 3),
    drillsNeeded: Math.max(0, req.drillsCompleted - progress.drillsCompleted),
    accuracyNeeded: Math.max(0, req.accuracy - progress.totalAccuracy),
    safetyGap: Math.max(0, progress.safetyViolations - req.safetyViolations),
  };
}

// Mock data for demo
const mockCadets: Record<string, CadetProgress> = {
  "OD-2024-001": {
    odNumber: "OD-2024-001",
    name: "Cadet Arjun Singh",
    currentLevel: 3,
    drillsCompleted: 32,
    totalAccuracy: 82,
    safetyViolations: 2,
    levelStartDate: "2024-11-15",
    certifications: [1, 2],
    lastActivityDate: "2025-01-20",
    batch: "Batch-2024-A",
  },
  "OD-2024-002": {
    odNumber: "OD-2024-002",
    name: "Cadet Priya Sharma",
    currentLevel: 4,
    drillsCompleted: 58,
    totalAccuracy: 96,
    safetyViolations: 0,
    levelStartDate: "2024-10-01",
    certifications: [1, 2, 3],
    lastActivityDate: "2025-01-21",
    batch: "Batch-2024-A",
  },
  "OD-2024-003": {
    odNumber: "OD-2024-003",
    name: "Cadet Rahul Verma",
    currentLevel: 2,
    drillsCompleted: 15,
    totalAccuracy: 71,
    safetyViolations: 4,
    levelStartDate: "2024-12-01",
    certifications: [1],
    lastActivityDate: "2025-01-19",
    batch: "Batch-2024-A",
  },
  "OD-2024-004": {
    odNumber: "OD-2024-004",
    name: "Cadet Amit Kumar",
    currentLevel: 1,
    drillsCompleted: 5,
    totalAccuracy: 65,
    safetyViolations: 3,
    levelStartDate: "2025-01-01",
    certifications: [],
    lastActivityDate: "2025-01-18",
    batch: "Batch-2024-B",
  },
  "OD-2024-005": {
    odNumber: "OD-2024-005",
    name: "Cadet Neha Patel",
    currentLevel: 5,
    drillsCompleted: 112,
    totalAccuracy: 98,
    safetyViolations: 0,
    levelStartDate: "2024-06-01",
    certifications: [1, 2, 3, 4],
    lastActivityDate: "2025-01-21",
    batch: "Batch-2024-B",
  },
};

export const useProgressionStore = create<ProgressionStore>()(
  persist(
    (set, get) => ({
      cadets: mockCadets,

      getCadetProgress: (odNumber) => {
        return get().cadets[odNumber] || null;
      },

      updateCadetProgress: (odNumber, updates) => {
        set((state) => ({
          cadets: {
            ...state.cadets,
            [odNumber]: {
              ...state.cadets[odNumber],
              ...updates,
              lastActivityDate: new Date().toISOString().split("T")[0],
            },
          },
        }));
      },

      recordDrillCompletion: (odNumber, accuracy, safetyViolation) => {
        const cadet = get().cadets[odNumber];
        if (!cadet) return;

        const newDrillsCompleted = cadet.drillsCompleted + 1;
        const newTotalAccuracy = Math.round(
          (cadet.totalAccuracy * cadet.drillsCompleted + accuracy) / newDrillsCompleted
        );
        const newSafetyViolations = safetyViolation
          ? cadet.safetyViolations + 1
          : cadet.safetyViolations;

        set((state) => ({
          cadets: {
            ...state.cadets,
            [odNumber]: {
              ...cadet,
              drillsCompleted: newDrillsCompleted,
              totalAccuracy: newTotalAccuracy,
              safetyViolations: newSafetyViolations,
              lastActivityDate: new Date().toISOString().split("T")[0],
            },
          },
        }));
      },

      promoteToLevel: (odNumber, level) => {
        const cadet = get().cadets[odNumber];
        if (!cadet) return;

        const newCertifications = [...cadet.certifications];
        if (!newCertifications.includes(cadet.currentLevel)) {
          newCertifications.push(cadet.currentLevel);
        }

        set((state) => ({
          cadets: {
            ...state.cadets,
            [odNumber]: {
              ...cadet,
              currentLevel: level,
              levelStartDate: new Date().toISOString().split("T")[0],
              certifications: newCertifications,
            },
          },
        }));
      },

      checkLevelEligibility: (odNumber, targetLevel) => {
        const cadet = get().cadets[odNumber];
        if (!cadet) return { eligible: false, gaps: ["Cadet not found"] };

        const req = PROGRESSION_LEVELS[targetLevel].requirements;
        const gaps: string[] = [];

        if (cadet.drillsCompleted < req.drillsCompleted) {
          gaps.push(`Need ${req.drillsCompleted - cadet.drillsCompleted} more drills`);
        }
        if (cadet.totalAccuracy < req.accuracy) {
          gaps.push(`Accuracy ${cadet.totalAccuracy}% below required ${req.accuracy}%`);
        }
        if (cadet.safetyViolations > req.safetyViolations) {
          gaps.push(`${cadet.safetyViolations - req.safetyViolations} excess safety violations`);
        }

        return { eligible: gaps.length === 0, gaps };
      },

      getBatchStats: (batch) => {
        const cadets = Object.values(get().cadets).filter((c) => c.batch === batch);

        const levelDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<ProgressionLevel, number>;
        let totalAccuracy = 0;

        cadets.forEach((c) => {
          levelDistribution[c.currentLevel]++;
          totalAccuracy += c.totalAccuracy;
        });

        return {
          levelDistribution,
          avgAccuracy: cadets.length > 0 ? Math.round(totalAccuracy / cadets.length) : 0,
        };
      },
    }),
    {
      name: "oaksip-progression",
    }
  )
);
