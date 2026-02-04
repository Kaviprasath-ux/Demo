"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface FlightModule {
  id: string;
  name: string;
  code: string;
  aircraft: string;
  category: "basic" | "advanced" | "combat" | "emergency" | "navigation";
  duration: string;
  description: string;
  prerequisites: string[];
  objectives: string[];
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  lessons: {
    id: string;
    title: string;
    type: "theory" | "simulator" | "flight";
    duration: string;
    completed: boolean;
  }[];
}

export interface FlightAssessment {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  type: "written" | "simulator" | "checkride" | "oral";
  questions: number;
  duration: string;
  passingScore: number;
  status: "not-attempted" | "in-progress" | "completed" | "failed";
  score?: number;
  attemptedAt?: string;
  feedback?: string;
}

export interface FlightDocument {
  id: string;
  title: string;
  category: "manual" | "checklist" | "procedure" | "regulation" | "technical";
  aircraft: string;
  version: string;
  pages: number;
  lastUpdated: string;
  classification: "unclassified" | "restricted" | "confidential";
  downloadUrl: string;
  bookmarked: boolean;
}

export interface FlightLog {
  id: string;
  date: string;
  aircraft: string;
  registration: string;
  flightType: "training" | "operational" | "test" | "ferry";
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  totalTime: string;
  dayHours: number;
  nightHours: number;
  instrumentHours: number;
  remarks: string;
  instructor?: string;
  approved: boolean;
}

export interface PilotProfile {
  id: string;
  rank: string;
  name: string;
  serviceNumber: string;
  unit: string;
  squadron: string;
  license: string;
  ratings: string[];
  totalHours: number;
  aircraftQualified: string[];
  currentAircraft: string;
  medicalExpiry: string;
  checkrideExpiry: string;
}

// Mock Data
const mockModules: FlightModule[] = [
  {
    id: "fm1",
    name: "ALH Dhruv Basic Flight",
    code: "ALH-101",
    aircraft: "ALH Dhruv",
    category: "basic",
    duration: "8 weeks",
    description: "Basic flight training on Advanced Light Helicopter Dhruv including systems, procedures, and maneuvers",
    prerequisites: [],
    objectives: [
      "Master pre-flight procedures",
      "Execute basic flight maneuvers",
      "Understand helicopter systems",
      "Complete solo flight requirements",
    ],
    status: "in-progress",
    progress: 65,
    lessons: [
      { id: "l1", title: "Aircraft Systems Overview", type: "theory", duration: "2h", completed: true },
      { id: "l2", title: "Pre-flight Procedures", type: "theory", duration: "1h", completed: true },
      { id: "l3", title: "Simulator: Basic Controls", type: "simulator", duration: "3h", completed: true },
      { id: "l4", title: "First Flight Training", type: "flight", duration: "1h", completed: false },
    ],
  },
  {
    id: "fm2",
    name: "Emergency Procedures",
    code: "EMG-201",
    aircraft: "All Rotary",
    category: "emergency",
    duration: "2 weeks",
    description: "Critical emergency procedures including autorotation, engine failures, and system malfunctions",
    prerequisites: ["ALH-101"],
    objectives: [
      "Execute autorotation procedures",
      "Handle engine failure scenarios",
      "Manage hydraulic failures",
      "Perform emergency landings",
    ],
    status: "not-started",
    progress: 0,
    lessons: [
      { id: "l5", title: "Emergency Theory", type: "theory", duration: "4h", completed: false },
      { id: "l6", title: "Autorotation Simulator", type: "simulator", duration: "4h", completed: false },
    ],
  },
  {
    id: "fm3",
    name: "Night Vision Operations",
    code: "NVG-301",
    aircraft: "ALH Dhruv",
    category: "advanced",
    duration: "3 weeks",
    description: "Night flying operations using NVG equipment",
    prerequisites: ["ALH-101", "EMG-201"],
    objectives: [
      "Operate NVG equipment",
      "Execute night navigation",
      "Perform night tactical maneuvers",
    ],
    status: "not-started",
    progress: 0,
    lessons: [],
  },
  {
    id: "fm4",
    name: "Rudra Weapons Systems",
    code: "WPN-401",
    aircraft: "Rudra (ALH WSI)",
    category: "combat",
    duration: "6 weeks",
    description: "Weapons systems integration and combat tactics for Rudra helicopter",
    prerequisites: ["ALH-101", "EMG-201"],
    objectives: [
      "Operate weapons systems",
      "Execute combat maneuvers",
      "Coordinate with ground forces",
    ],
    status: "not-started",
    progress: 0,
    lessons: [],
  },
];

const mockAssessments: FlightAssessment[] = [
  {
    id: "fa1",
    title: "ALH Systems Knowledge Test",
    moduleId: "fm1",
    moduleName: "ALH Dhruv Basic Flight",
    type: "written",
    questions: 50,
    duration: "90 min",
    passingScore: 70,
    status: "completed",
    score: 85,
    attemptedAt: "2024-12-10",
    feedback: "Good understanding of systems. Review hydraulic system details.",
  },
  {
    id: "fa2",
    title: "Simulator Check - Basic Maneuvers",
    moduleId: "fm1",
    moduleName: "ALH Dhruv Basic Flight",
    type: "simulator",
    questions: 10,
    duration: "2h",
    passingScore: 80,
    status: "not-attempted",
  },
  {
    id: "fa3",
    title: "Emergency Procedures Oral",
    moduleId: "fm2",
    moduleName: "Emergency Procedures",
    type: "oral",
    questions: 20,
    duration: "45 min",
    passingScore: 80,
    status: "not-attempted",
  },
];

const mockDocuments: FlightDocument[] = [
  {
    id: "fd1",
    title: "ALH Dhruv Flight Manual",
    category: "manual",
    aircraft: "ALH Dhruv",
    version: "Rev 12",
    pages: 450,
    lastUpdated: "2024-06-15",
    classification: "restricted",
    downloadUrl: "/docs/alh-flight-manual.pdf",
    bookmarked: true,
  },
  {
    id: "fd2",
    title: "Pre-Flight Checklist - ALH",
    category: "checklist",
    aircraft: "ALH Dhruv",
    version: "v3.2",
    pages: 12,
    lastUpdated: "2024-09-01",
    classification: "unclassified",
    downloadUrl: "/docs/alh-preflight.pdf",
    bookmarked: true,
  },
  {
    id: "fd3",
    title: "Emergency Procedures Quick Reference",
    category: "procedure",
    aircraft: "All Rotary",
    version: "v2.1",
    pages: 24,
    lastUpdated: "2024-08-20",
    classification: "unclassified",
    downloadUrl: "/docs/emergency-qrc.pdf",
    bookmarked: false,
  },
  {
    id: "fd4",
    title: "Rudra Weapons Integration Manual",
    category: "technical",
    aircraft: "Rudra (ALH WSI)",
    version: "Rev 5",
    pages: 280,
    lastUpdated: "2024-07-10",
    classification: "confidential",
    downloadUrl: "/docs/rudra-weapons.pdf",
    bookmarked: false,
  },
];

const mockFlightLogs: FlightLog[] = [
  {
    id: "fl1",
    date: "2024-12-18",
    aircraft: "ALH Dhruv",
    registration: "Z-3201",
    flightType: "training",
    departure: "VIJP",
    arrival: "VIJP",
    departureTime: "09:00",
    arrivalTime: "10:30",
    totalTime: "1:30",
    dayHours: 1.5,
    nightHours: 0,
    instrumentHours: 0.5,
    remarks: "Circuit training, 5 landings",
    instructor: "Gp Capt Sanjay Mehra",
    approved: true,
  },
  {
    id: "fl2",
    date: "2024-12-15",
    aircraft: "ALH Dhruv",
    registration: "Z-3201",
    flightType: "training",
    departure: "VIJP",
    arrival: "VIJP",
    departureTime: "14:00",
    arrivalTime: "15:45",
    totalTime: "1:45",
    dayHours: 1.75,
    nightHours: 0,
    instrumentHours: 0,
    remarks: "Area familiarization, emergency drills",
    instructor: "Gp Capt Sanjay Mehra",
    approved: true,
  },
];

const mockProfile: PilotProfile = {
  id: "p1",
  rank: "Wg Cdr",
  name: "Arjun Rao",
  serviceNumber: "AVN-15234",
  unit: "125 HU",
  squadron: "Army Aviation",
  license: "Military Rotary Wing",
  ratings: ["Single Engine", "Multi Engine", "NVG", "IFR"],
  totalHours: 1250,
  aircraftQualified: ["ALH Dhruv", "Chetak", "Cheetah"],
  currentAircraft: "ALH Dhruv",
  medicalExpiry: "2025-06-30",
  checkrideExpiry: "2025-03-15",
};

interface PilotState {
  modules: FlightModule[];
  assessments: FlightAssessment[];
  documents: FlightDocument[];
  flightLogs: FlightLog[];
  profile: PilotProfile;

  // Module actions
  updateModuleProgress: (id: string, progress: number) => void;
  completeLesson: (moduleId: string, lessonId: string) => void;

  // Assessment actions
  startAssessment: (id: string) => void;
  completeAssessment: (id: string, score: number, feedback: string) => void;

  // Document actions
  toggleBookmark: (id: string) => void;

  // Flight log actions
  addFlightLog: (log: Omit<FlightLog, "id">) => void;

  // Profile actions
  updateProfile: (updates: Partial<PilotProfile>) => void;

  // Stats
  getPilotStats: () => {
    totalModules: number;
    completedModules: number;
    totalHours: number;
    pendingAssessments: number;
    upcomingCheckrides: number;
  };
}

export const usePilotStore = create<PilotState>()(
  persist(
    (set, get) => ({
      modules: mockModules,
      assessments: mockAssessments,
      documents: mockDocuments,
      flightLogs: mockFlightLogs,
      profile: mockProfile,

      updateModuleProgress: (id, progress) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === id
              ? {
                  ...m,
                  progress,
                  status: progress >= 100 ? "completed" : progress > 0 ? "in-progress" : "not-started",
                }
              : m
          ),
        })),

      completeLesson: (moduleId, lessonId) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === lessonId ? { ...l, completed: true } : l
                  ),
                }
              : m
          ),
        })),

      startAssessment: (id) =>
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === id ? { ...a, status: "in-progress" } : a
          ),
        })),

      completeAssessment: (id, score, feedback) =>
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: score >= a.passingScore ? "completed" : "failed",
                  score,
                  feedback,
                  attemptedAt: new Date().toISOString().split("T")[0],
                }
              : a
          ),
        })),

      toggleBookmark: (id) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, bookmarked: !d.bookmarked } : d
          ),
        })),

      addFlightLog: (log) =>
        set((state) => ({
          flightLogs: [...state.flightLogs, { ...log, id: `fl${Date.now()}` }],
        })),

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      getPilotStats: () => {
        const state = get();
        return {
          totalModules: state.modules.length,
          completedModules: state.modules.filter((m) => m.status === "completed").length,
          totalHours: state.flightLogs.reduce((sum, l) => sum + l.dayHours + l.nightHours, 0),
          pendingAssessments: state.assessments.filter((a) => a.status === "not-attempted").length,
          upcomingCheckrides: 1,
        };
      },
    }),
    {
      name: "pilot-storage",
    }
  )
);
