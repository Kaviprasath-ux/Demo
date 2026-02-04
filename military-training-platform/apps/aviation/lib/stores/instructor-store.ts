"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface TraineePilot {
  id: string;
  rank: string;
  name: string;
  serviceNumber: string;
  unit: string;
  batch: string;
  enrollmentDate: string;
  status: "active" | "on-leave" | "graduated" | "washed-out";
  currentPhase: string;
  totalHours: number;
  soloHours: number;
  dualHours: number;
  progress: number;
  averageScore: number;
}

export interface FlightTrainingSession {
  id: string;
  title: string;
  type: "ground-school" | "simulator" | "dual-flight" | "solo-flight" | "checkride";
  traineeId: string;
  traineeName: string;
  aircraft?: string;
  registration?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructorId: string;
  instructorName: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  flightHours?: number;
  maneuvers: string[];
  grade?: "satisfactory" | "unsatisfactory" | "incomplete";
  remarks?: string;
}

export interface FlightAssessmentResult {
  id: string;
  traineeId: string;
  traineeName: string;
  assessmentType: "stage-check" | "progress-check" | "final-check" | "written-exam";
  phase: string;
  date: string;
  duration: string;
  aircraft?: string;
  instructorId: string;
  instructorName: string;
  status: "pending" | "passed" | "failed" | "incomplete";
  score?: number;
  maneuversEvaluated: {
    maneuver: string;
    grade: "excellent" | "satisfactory" | "unsatisfactory";
    remarks?: string;
  }[];
  overallRemarks: string;
  recommendations: string[];
}

export interface TrainingCurriculum {
  id: string;
  name: string;
  code: string;
  aircraft: string;
  phase: string;
  duration: string;
  description: string;
  prerequisites: string[];
  objectives: string[];
  status: "active" | "draft" | "archived";
  totalSessions: number;
  groundHours: number;
  simulatorHours: number;
  flightHours: number;
  enrolledTrainees: number;
}

// Mock Data
const mockTrainees: TraineePilot[] = [
  {
    id: "tp1",
    rank: "Fg Off",
    name: "Rahul Verma",
    serviceNumber: "AVN-24001",
    unit: "Aviation Training School",
    batch: "AVN-2024-A",
    enrollmentDate: "2024-06-01",
    status: "active",
    currentPhase: "Phase II - Basic Instruments",
    totalHours: 45,
    soloHours: 8,
    dualHours: 37,
    progress: 55,
    averageScore: 78,
  },
  {
    id: "tp2",
    rank: "Fg Off",
    name: "Anjali Sharma",
    serviceNumber: "AVN-24002",
    unit: "Aviation Training School",
    batch: "AVN-2024-A",
    enrollmentDate: "2024-06-01",
    status: "active",
    currentPhase: "Phase II - Basic Instruments",
    totalHours: 52,
    soloHours: 12,
    dualHours: 40,
    progress: 62,
    averageScore: 85,
  },
  {
    id: "tp3",
    rank: "Plt Off",
    name: "Vikram Singh",
    serviceNumber: "AVN-24003",
    unit: "Aviation Training School",
    batch: "AVN-2024-A",
    enrollmentDate: "2024-06-01",
    status: "active",
    currentPhase: "Phase I - Primary",
    totalHours: 28,
    soloHours: 0,
    dualHours: 28,
    progress: 35,
    averageScore: 72,
  },
  {
    id: "tp4",
    rank: "Fg Off",
    name: "Priya Menon",
    serviceNumber: "AVN-24004",
    unit: "Aviation Training School",
    batch: "AVN-2024-B",
    enrollmentDate: "2024-09-01",
    status: "active",
    currentPhase: "Phase I - Primary",
    totalHours: 15,
    soloHours: 0,
    dualHours: 15,
    progress: 20,
    averageScore: 80,
  },
  {
    id: "tp5",
    rank: "Flt Lt",
    name: "Ravi Sharma",
    serviceNumber: "AVN-23010",
    unit: "125 HU",
    batch: "AVN-2023-C",
    enrollmentDate: "2023-03-01",
    status: "graduated",
    currentPhase: "Completed",
    totalHours: 180,
    soloHours: 60,
    dualHours: 120,
    progress: 100,
    averageScore: 88,
  },
];

const mockSessions: FlightTrainingSession[] = [
  {
    id: "fts1",
    title: "Instrument Approach Procedures",
    type: "dual-flight",
    traineeId: "tp1",
    traineeName: "Fg Off Rahul Verma",
    aircraft: "Chetak",
    registration: "Z-2105",
    date: "2024-12-20",
    startTime: "09:00",
    endTime: "11:00",
    location: "VIJP",
    instructorId: "i1",
    instructorName: "Gp Capt Sanjay Mehra",
    status: "scheduled",
    flightHours: 2,
    maneuvers: ["VOR Approach", "ILS Approach", "Missed Approach"],
  },
  {
    id: "fts2",
    title: "Solo Navigation Exercise",
    type: "solo-flight",
    traineeId: "tp2",
    traineeName: "Fg Off Anjali Sharma",
    aircraft: "Chetak",
    registration: "Z-2106",
    date: "2024-12-20",
    startTime: "14:00",
    endTime: "16:30",
    location: "VIJP - Area Charlie",
    instructorId: "i1",
    instructorName: "Gp Capt Sanjay Mehra",
    status: "scheduled",
    flightHours: 2.5,
    maneuvers: ["Cross-country Navigation", "Diversion Procedures"],
  },
  {
    id: "fts3",
    title: "Basic Autorotation",
    type: "dual-flight",
    traineeId: "tp3",
    traineeName: "Plt Off Vikram Singh",
    aircraft: "Chetak",
    registration: "Z-2105",
    date: "2024-12-19",
    startTime: "09:00",
    endTime: "10:30",
    location: "Training Area Alpha",
    instructorId: "i2",
    instructorName: "Sqn Ldr Prakash Kumar",
    status: "completed",
    flightHours: 1.5,
    maneuvers: ["Straight-in Autorotation", "180° Autorotation"],
    grade: "satisfactory",
    remarks: "Good progress. Needs work on collective timing during flare.",
  },
  {
    id: "fts4",
    title: "Ground School - Weather Theory",
    type: "ground-school",
    traineeId: "tp4",
    traineeName: "Fg Off Priya Menon",
    date: "2024-12-20",
    startTime: "08:00",
    endTime: "12:00",
    location: "Classroom B",
    instructorId: "i1",
    instructorName: "Gp Capt Sanjay Mehra",
    status: "scheduled",
    maneuvers: [],
  },
];

const mockResults: FlightAssessmentResult[] = [
  {
    id: "far1",
    traineeId: "tp1",
    traineeName: "Fg Off Rahul Verma",
    assessmentType: "progress-check",
    phase: "Phase II",
    date: "2024-12-15",
    duration: "2h",
    aircraft: "Chetak",
    instructorId: "i1",
    instructorName: "Gp Capt Sanjay Mehra",
    status: "passed",
    score: 82,
    maneuversEvaluated: [
      { maneuver: "Normal Takeoff", grade: "satisfactory" },
      { maneuver: "Traffic Pattern", grade: "excellent" },
      { maneuver: "Normal Landing", grade: "satisfactory" },
      { maneuver: "Emergency Procedures", grade: "satisfactory", remarks: "Response time could be faster" },
    ],
    overallRemarks: "Good overall performance. Ready to progress to instrument training.",
    recommendations: ["Continue with Phase II instrument training", "Extra practice on emergency procedures"],
  },
  {
    id: "far2",
    traineeId: "tp2",
    traineeName: "Fg Off Anjali Sharma",
    assessmentType: "stage-check",
    phase: "Phase II",
    date: "2024-12-10",
    duration: "2.5h",
    aircraft: "Chetak",
    instructorId: "i1",
    instructorName: "Gp Capt Sanjay Mehra",
    status: "passed",
    score: 88,
    maneuversEvaluated: [
      { maneuver: "Hovering", grade: "excellent" },
      { maneuver: "Slope Operations", grade: "excellent" },
      { maneuver: "Confined Area Operations", grade: "satisfactory" },
      { maneuver: "Quick Stop", grade: "excellent" },
    ],
    overallRemarks: "Excellent performance. Top of the class in maneuver execution.",
    recommendations: ["Ready for solo cross-country", "Consider for accelerated advancement"],
  },
  {
    id: "far3",
    traineeId: "tp3",
    traineeName: "Plt Off Vikram Singh",
    assessmentType: "progress-check",
    phase: "Phase I",
    date: "2024-12-18",
    duration: "1.5h",
    aircraft: "Chetak",
    instructorId: "i2",
    instructorName: "Sqn Ldr Prakash Kumar",
    status: "pending",
    maneuversEvaluated: [],
    overallRemarks: "",
    recommendations: [],
  },
];

const mockCurriculum: TrainingCurriculum[] = [
  {
    id: "tc1",
    name: "Phase I - Primary Flight Training",
    code: "PFT-101",
    aircraft: "Chetak",
    phase: "Phase I",
    duration: "12 weeks",
    description: "Basic helicopter flight training including hovering, takeoffs, landings, and basic maneuvers",
    prerequisites: ["Ground School Certificate"],
    objectives: [
      "Master basic helicopter controls",
      "Execute normal and crosswind takeoffs/landings",
      "Perform hovering maneuvers",
      "Complete first solo flight",
    ],
    status: "active",
    totalSessions: 48,
    groundHours: 40,
    simulatorHours: 20,
    flightHours: 40,
    enrolledTrainees: 4,
  },
  {
    id: "tc2",
    name: "Phase II - Instrument Flight Training",
    code: "IFT-201",
    aircraft: "Chetak",
    phase: "Phase II",
    duration: "8 weeks",
    description: "Instrument flight training including IFR procedures, approaches, and navigation",
    prerequisites: ["PFT-101"],
    objectives: [
      "Execute instrument approaches",
      "Navigate using VOR/ILS",
      "Perform holding patterns",
      "Handle instrument emergencies",
    ],
    status: "active",
    totalSessions: 32,
    groundHours: 25,
    simulatorHours: 30,
    flightHours: 35,
    enrolledTrainees: 2,
  },
  {
    id: "tc3",
    name: "Phase III - Advanced Rotary Wing",
    code: "ARW-301",
    aircraft: "ALH Dhruv",
    phase: "Phase III",
    duration: "10 weeks",
    description: "Advanced training on ALH Dhruv including tactical operations and NVG",
    prerequisites: ["IFT-201"],
    objectives: [
      "Transition to ALH Dhruv",
      "Execute tactical maneuvers",
      "Complete NVG qualification",
      "Perform advanced emergency procedures",
    ],
    status: "active",
    totalSessions: 40,
    groundHours: 30,
    simulatorHours: 40,
    flightHours: 50,
    enrolledTrainees: 0,
  },
];

interface InstructorState {
  trainees: TraineePilot[];
  sessions: FlightTrainingSession[];
  results: FlightAssessmentResult[];
  curriculum: TrainingCurriculum[];

  // Trainee actions
  addTrainee: (trainee: Omit<TraineePilot, "id">) => void;
  updateTrainee: (id: string, updates: Partial<TraineePilot>) => void;
  removeTrainee: (id: string) => void;

  // Session actions
  addSession: (session: Omit<FlightTrainingSession, "id">) => void;
  updateSession: (id: string, updates: Partial<FlightTrainingSession>) => void;
  removeSession: (id: string) => void;

  // Result actions
  addResult: (result: Omit<FlightAssessmentResult, "id">) => void;
  updateResult: (id: string, updates: Partial<FlightAssessmentResult>) => void;

  // Curriculum actions
  updateCurriculum: (id: string, updates: Partial<TrainingCurriculum>) => void;

  // Stats
  getInstructorStats: () => {
    totalTrainees: number;
    activeTrainees: number;
    scheduledSessions: number;
    pendingEvaluations: number;
    graduatedThisYear: number;
  };
}

export const useInstructorStore = create<InstructorState>()(
  persist(
    (set, get) => ({
      trainees: mockTrainees,
      sessions: mockSessions,
      results: mockResults,
      curriculum: mockCurriculum,

      addTrainee: (trainee) =>
        set((state) => ({
          trainees: [...state.trainees, { ...trainee, id: `tp${Date.now()}` }],
        })),

      updateTrainee: (id, updates) =>
        set((state) => ({
          trainees: state.trainees.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeTrainee: (id) =>
        set((state) => ({
          trainees: state.trainees.filter((t) => t.id !== id),
        })),

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: `fts${Date.now()}` }],
        })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      addResult: (result) =>
        set((state) => ({
          results: [...state.results, { ...result, id: `far${Date.now()}` }],
        })),

      updateResult: (id, updates) =>
        set((state) => ({
          results: state.results.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      updateCurriculum: (id, updates) =>
        set((state) => ({
          curriculum: state.curriculum.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      getInstructorStats: () => {
        const state = get();
        return {
          totalTrainees: state.trainees.length,
          activeTrainees: state.trainees.filter((t) => t.status === "active").length,
          scheduledSessions: state.sessions.filter((s) => s.status === "scheduled").length,
          pendingEvaluations: state.results.filter((r) => r.status === "pending").length,
          graduatedThisYear: state.trainees.filter((t) => t.status === "graduated").length,
        };
      },
    }),
    {
      name: "instructor-storage",
    }
  )
);
