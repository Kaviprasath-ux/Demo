import { create } from "zustand";
import { persist } from "zustand/middleware";

// Analytics Types
export interface MissionEvent {
  id: string;
  missionId: string;
  timestamp: Date;
  type: "waypoint" | "weapon" | "communication" | "observation" | "correction" | "abort";
  description: string;
  location?: [number, number];
  data?: Record<string, unknown>;
}

export interface MissionMetrics {
  missionId: string;
  helicopterType: string;
  missionType: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes

  // Performance Metrics
  waypointsCompleted: number;
  waypointsTotal: number;
  timeOnTarget: number; // seconds
  deviationFromPlan: number; // percentage

  // Air-Ground Coordination
  artilleryCoordinations: number;
  fireAdjustments: number;
  correctionAccuracy: number; // percentage

  // Safety Metrics
  nfzViolations: number;
  altitudeViolations: number;
  safetyIncidents: number;

  // Communication
  totalCommunications: number;
  averageResponseTime: number; // seconds

  // Score
  overallScore: number; // 0-100
}

export interface TraineeProgress {
  traineeId: string;
  traineeName: string;
  missions: MissionMetrics[];
  totalFlightHours: number;
  certificationsEarned: string[];
  currentLevel: "beginner" | "intermediate" | "advanced" | "expert";
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
}

export interface PlatformAnalytics {
  totalMissions: number;
  totalFlightHours: number;
  activeTrainees: number;
  averageMissionScore: number;
  missionsByType: Record<string, number>;
  missionsByHelicopter: Record<string, number>;
  weeklyTrend: { week: string; missions: number; avgScore: number }[];
  topPerformers: { name: string; score: number }[];
}

interface AnalyticsState {
  // Mission Events
  missionEvents: MissionEvent[];
  addMissionEvent: (event: Omit<MissionEvent, "id">) => void;
  getMissionEvents: (missionId: string) => MissionEvent[];

  // Mission Metrics
  missionMetrics: MissionMetrics[];
  addMissionMetrics: (metrics: MissionMetrics) => void;
  getMissionMetrics: (missionId: string) => MissionMetrics | undefined;
  getMetricsByHelicopter: (helicopterType: string) => MissionMetrics[];
  getMetricsByMissionType: (missionType: string) => MissionMetrics[];

  // Trainee Progress
  traineeProgress: TraineeProgress[];
  getTraineeProgress: (traineeId: string) => TraineeProgress | undefined;
  updateTraineeProgress: (traineeId: string, metrics: MissionMetrics) => void;

  // Platform Analytics
  getPlatformAnalytics: () => PlatformAnalytics;

  // Charts Data
  getTimelineData: (missionId: string) => { time: number; event: string; value: number }[];
  getPerformanceTrend: (traineeId: string) => { date: string; score: number }[];
  getHelicopterUtilization: () => { helicopter: string; hours: number; missions: number }[];
}

// Mock Mission Metrics
const mockMissionMetrics: MissionMetrics[] = [
  {
    missionId: "mission-1",
    helicopterType: "rudra",
    missionType: "CAS",
    startTime: new Date("2024-01-15T09:00:00"),
    endTime: new Date("2024-01-15T10:30:00"),
    duration: 90,
    waypointsCompleted: 8,
    waypointsTotal: 8,
    timeOnTarget: 1200,
    deviationFromPlan: 5,
    artilleryCoordinations: 12,
    fireAdjustments: 4,
    correctionAccuracy: 92,
    nfzViolations: 0,
    altitudeViolations: 0,
    safetyIncidents: 0,
    totalCommunications: 45,
    averageResponseTime: 8,
    overallScore: 94,
  },
  {
    missionId: "mission-2",
    helicopterType: "lch",
    missionType: "CAS",
    startTime: new Date("2024-01-16T14:00:00"),
    endTime: new Date("2024-01-16T15:45:00"),
    duration: 105,
    waypointsCompleted: 10,
    waypointsTotal: 10,
    timeOnTarget: 1800,
    deviationFromPlan: 8,
    artilleryCoordinations: 15,
    fireAdjustments: 6,
    correctionAccuracy: 88,
    nfzViolations: 0,
    altitudeViolations: 1,
    safetyIncidents: 0,
    totalCommunications: 52,
    averageResponseTime: 10,
    overallScore: 87,
  },
  {
    missionId: "mission-3",
    helicopterType: "dhruv",
    missionType: "Reconnaissance",
    startTime: new Date("2024-01-17T08:00:00"),
    endTime: new Date("2024-01-17T09:15:00"),
    duration: 75,
    waypointsCompleted: 6,
    waypointsTotal: 6,
    timeOnTarget: 900,
    deviationFromPlan: 3,
    artilleryCoordinations: 5,
    fireAdjustments: 2,
    correctionAccuracy: 95,
    nfzViolations: 0,
    altitudeViolations: 0,
    safetyIncidents: 0,
    totalCommunications: 28,
    averageResponseTime: 6,
    overallScore: 96,
  },
  {
    missionId: "mission-4",
    helicopterType: "apache",
    missionType: "CAS",
    startTime: new Date("2024-01-18T10:00:00"),
    endTime: new Date("2024-01-18T12:00:00"),
    duration: 120,
    waypointsCompleted: 12,
    waypointsTotal: 12,
    timeOnTarget: 2400,
    deviationFromPlan: 4,
    artilleryCoordinations: 20,
    fireAdjustments: 8,
    correctionAccuracy: 94,
    nfzViolations: 0,
    altitudeViolations: 0,
    safetyIncidents: 0,
    totalCommunications: 68,
    averageResponseTime: 7,
    overallScore: 98,
  },
];

// Mock Trainee Progress
const mockTraineeProgress: TraineeProgress[] = [
  {
    traineeId: "trainee-1",
    traineeName: "Lt. Sharma",
    missions: mockMissionMetrics.slice(0, 2),
    totalFlightHours: 45,
    certificationsEarned: ["Basic CAS", "Night Operations"],
    currentLevel: "intermediate",
    averageScore: 90.5,
    strongAreas: ["Fire Adjustment", "Communication"],
    weakAreas: ["High Altitude Operations"],
  },
  {
    traineeId: "trainee-2",
    traineeName: "Capt. Verma",
    missions: mockMissionMetrics.slice(2, 4),
    totalFlightHours: 120,
    certificationsEarned: ["Basic CAS", "Advanced CAS", "Night Operations", "Mountain Ops"],
    currentLevel: "advanced",
    averageScore: 97,
    strongAreas: ["Reconnaissance", "Air-Ground Coordination", "Weapons Employment"],
    weakAreas: [],
  },
];

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      missionEvents: [],
      missionMetrics: mockMissionMetrics,
      traineeProgress: mockTraineeProgress,

      addMissionEvent: (event) =>
        set((state) => ({
          missionEvents: [
            ...state.missionEvents,
            { ...event, id: `event-${Date.now()}` },
          ],
        })),

      getMissionEvents: (missionId) =>
        get().missionEvents.filter((e) => e.missionId === missionId),

      addMissionMetrics: (metrics) =>
        set((state) => ({
          missionMetrics: [...state.missionMetrics, metrics],
        })),

      getMissionMetrics: (missionId) =>
        get().missionMetrics.find((m) => m.missionId === missionId),

      getMetricsByHelicopter: (helicopterType) =>
        get().missionMetrics.filter((m) => m.helicopterType === helicopterType),

      getMetricsByMissionType: (missionType) =>
        get().missionMetrics.filter((m) => m.missionType === missionType),

      getTraineeProgress: (traineeId) =>
        get().traineeProgress.find((t) => t.traineeId === traineeId),

      updateTraineeProgress: (traineeId, metrics) =>
        set((state) => ({
          traineeProgress: state.traineeProgress.map((t) =>
            t.traineeId === traineeId
              ? {
                  ...t,
                  missions: [...t.missions, metrics],
                  totalFlightHours: t.totalFlightHours + (metrics.duration || 0) / 60,
                  averageScore:
                    (t.averageScore * t.missions.length + metrics.overallScore) /
                    (t.missions.length + 1),
                }
              : t
          ),
        })),

      getPlatformAnalytics: () => {
        const metrics = get().missionMetrics;
        const trainees = get().traineeProgress;

        const missionsByType: Record<string, number> = {};
        const missionsByHelicopter: Record<string, number> = {};

        metrics.forEach((m) => {
          missionsByType[m.missionType] = (missionsByType[m.missionType] || 0) + 1;
          missionsByHelicopter[m.helicopterType] = (missionsByHelicopter[m.helicopterType] || 0) + 1;
        });

        return {
          totalMissions: metrics.length,
          totalFlightHours: metrics.reduce((sum, m) => sum + (m.duration || 0) / 60, 0),
          activeTrainees: trainees.length,
          averageMissionScore:
            metrics.reduce((sum, m) => sum + m.overallScore, 0) / metrics.length || 0,
          missionsByType,
          missionsByHelicopter,
          weeklyTrend: [
            { week: "Week 1", missions: 5, avgScore: 85 },
            { week: "Week 2", missions: 8, avgScore: 88 },
            { week: "Week 3", missions: 6, avgScore: 90 },
            { week: "Week 4", missions: 10, avgScore: 92 },
          ],
          topPerformers: trainees
            .map((t) => ({ name: t.traineeName, score: t.averageScore }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5),
        };
      },

      getTimelineData: (missionId) => {
        const events = get().getMissionEvents(missionId);
        return events.map((e, i) => ({
          time: i * 5,
          event: e.type,
          value: e.type === "correction" ? 80 : e.type === "weapon" ? 100 : 50,
        }));
      },

      getPerformanceTrend: (traineeId) => {
        const trainee = get().getTraineeProgress(traineeId);
        if (!trainee) return [];
        return trainee.missions.map((m) => ({
          date: new Date(m.startTime).toLocaleDateString(),
          score: m.overallScore,
        }));
      },

      getHelicopterUtilization: () => {
        const metrics = get().missionMetrics;
        const utilization: Record<string, { hours: number; missions: number }> = {};

        metrics.forEach((m) => {
          if (!utilization[m.helicopterType]) {
            utilization[m.helicopterType] = { hours: 0, missions: 0 };
          }
          utilization[m.helicopterType].hours += (m.duration || 0) / 60;
          utilization[m.helicopterType].missions += 1;
        });

        return Object.entries(utilization).map(([helicopter, data]) => ({
          helicopter,
          ...data,
        }));
      },
    }),
    {
      name: "aviation-analytics-store",
    }
  )
);
