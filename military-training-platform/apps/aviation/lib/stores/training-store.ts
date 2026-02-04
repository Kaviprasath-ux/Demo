"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================================
// TYPES
// ============================================================================

export type ViewMode = "normal" | "cockpit" | "external" | "battlespace" | "exploded";
export type TerrainType = "plains" | "mountains" | "urban" | "desert" | "jungle" | "maritime" | "high_altitude";
export type WeatherType = "clear" | "rain" | "fog" | "night" | "snow" | "dust";
export type DayNight = "day" | "night" | "dusk";

export interface FlightWaypoint {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  altitude: number; // meters AGL
  type: "ingress" | "egress" | "holding" | "target" | "ip" | "checkpoint";
}

export interface ArtilleryPosition {
  id: string;
  unit: string;
  weaponSystem: string;
  coordinates: { lat: number; lng: number };
  firingArcMin: number;
  firingArcMax: number;
  maxRange: number;
  active: boolean;
}

export interface NoFlyZone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
  altitudeMin: number;
  altitudeMax: number;
  reason: string;
  active: boolean;
}

export interface TrainingTask {
  id: string;
  title: string;
  description: string;
  type: "navigation" | "communication" | "engagement" | "safety" | "coordination";
  points: number;
  completed: boolean;
  completedAt?: string;
  order: number;
}

export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  helicopterType: string;
  terrain: TerrainType;
  weather: WeatherType;
  dayNight: DayNight;
  difficulty: "basic" | "intermediate" | "advanced" | "expert";
  objectives: string[];
  tasks: TrainingTask[];
  flightPath: FlightWaypoint[];
  artilleryPositions: ArtilleryPosition[];
  noFlyZones: NoFlyZone[];
  duration: number; // minutes
  passingScore: number; // percentage
}

export interface TrainingSession {
  id: string;
  scenarioId: string;
  startTime: string;
  endTime?: string;
  status: "in_progress" | "completed" | "paused" | "aborted";
  events: TrainingEvent[];
  completedTasks: string[]; // task IDs
  score?: number;
  elapsedTime: number; // seconds
}

export interface TrainingEvent {
  id: string;
  timestamp: string;
  type: "waypoint_reached" | "altitude_violation" | "nfz_violation" | "target_engaged" | "safety_alert" | "mission_complete" | "abort";
  details: string;
  severity?: "info" | "warning" | "critical";
}

// ============================================================================
// MOCK SCENARIOS
// ============================================================================

const mockScenarios: TrainingScenario[] = [
  {
    id: "scn-001",
    name: "Basic CAS Run - Day",
    description: "Introduction to Close Air Support procedures in clear weather conditions over plains terrain.",
    helicopterType: "Rudra_WSI",
    terrain: "plains",
    weather: "clear",
    dayNight: "day",
    difficulty: "basic",
    objectives: [
      "Navigate to holding area",
      "Establish contact with FAC",
      "Execute Type 2 CAS attack",
      "Egress safely",
    ],
    tasks: [
      { id: "t1-1", title: "Pre-flight Check", description: "Complete aircraft systems check and verify weapons status", type: "safety", points: 10, completed: false, order: 1 },
      { id: "t1-2", title: "Radio Check", description: "Establish communication with Tower and FAC on assigned frequency", type: "communication", points: 15, completed: false, order: 2 },
      { id: "t1-3", title: "Navigate to Holding Area", description: "Fly to designated holding area at correct altitude", type: "navigation", points: 15, completed: false, order: 3 },
      { id: "t1-4", title: "Contact FAC", description: "Check in with Forward Air Controller and receive target briefing", type: "communication", points: 20, completed: false, order: 4 },
      { id: "t1-5", title: "Proceed to IP", description: "Navigate to Initial Point while maintaining safe altitude", type: "navigation", points: 10, completed: false, order: 5 },
      { id: "t1-6", title: "Target Identification", description: "Visually identify target and confirm with FAC", type: "engagement", points: 15, completed: false, order: 6 },
      { id: "t1-7", title: "Execute Attack", description: "Perform Type 2 CAS attack run on designated target", type: "engagement", points: 25, completed: false, order: 7 },
      { id: "t1-8", title: "Battle Damage Assessment", description: "Report BDA to FAC and request further instructions", type: "communication", points: 10, completed: false, order: 8 },
      { id: "t1-9", title: "Safe Egress", description: "Exit target area via designated egress route", type: "navigation", points: 15, completed: false, order: 9 },
      { id: "t1-10", title: "Mission Debrief", description: "Complete post-mission checklist and debrief", type: "safety", points: 10, completed: false, order: 10 },
    ],
    passingScore: 70,
    flightPath: [
      { id: "wp-1", name: "Start Point", coordinates: { lat: 34.0300, lng: 74.7500 }, altitude: 500, type: "checkpoint" },
      { id: "wp-2", name: "Holding Area", coordinates: { lat: 34.0400, lng: 74.7700 }, altitude: 1000, type: "holding" },
      { id: "wp-3", name: "Initial Point", coordinates: { lat: 34.0500, lng: 74.7800 }, altitude: 500, type: "ip" },
      { id: "wp-4", name: "Target", coordinates: { lat: 34.0600, lng: 74.7900 }, altitude: 200, type: "target" },
      { id: "wp-5", name: "Egress Point", coordinates: { lat: 34.0700, lng: 74.8000 }, altitude: 500, type: "egress" },
    ],
    artilleryPositions: [
      {
        id: "arty-1",
        unit: "Alpha Battery",
        weaponSystem: "Bofors FH-77B",
        coordinates: { lat: 34.0450, lng: 74.7600 },
        firingArcMin: 45,
        firingArcMax: 135,
        maxRange: 24000,
        active: true,
      },
    ],
    noFlyZones: [
      {
        id: "nfz-1",
        name: "Village Protected Zone",
        coordinates: [
          { lat: 34.0550, lng: 74.7850 },
          { lat: 34.0560, lng: 74.7900 },
          { lat: 34.0540, lng: 74.7900 },
          { lat: 34.0530, lng: 74.7850 },
        ],
        altitudeMin: 0,
        altitudeMax: 5000,
        reason: "Civilian population",
        active: true,
      },
    ],
    duration: 45,
  },
  {
    id: "scn-002",
    name: "Mountain CAS - High Altitude",
    description: "CAS operations in mountainous terrain at high altitude. Tests altitude management and terrain following.",
    helicopterType: "LCH_Prachand",
    terrain: "mountains",
    weather: "clear",
    dayNight: "day",
    difficulty: "intermediate",
    objectives: [
      "Navigate through mountain passes",
      "Maintain safe altitude above terrain",
      "Execute precision attack in confined terrain",
      "Manage aircraft performance at altitude",
    ],
    tasks: [
      { id: "t2-1", title: "High Altitude Pre-flight", description: "Verify aircraft performance charts for high altitude operations", type: "safety", points: 10, completed: false, order: 1 },
      { id: "t2-2", title: "Terrain Study", description: "Review terrain map and identify safe corridors", type: "navigation", points: 15, completed: false, order: 2 },
      { id: "t2-3", title: "Valley Entry", description: "Enter valley at designated altitude maintaining terrain clearance", type: "navigation", points: 20, completed: false, order: 3 },
      { id: "t2-4", title: "Ridge Crossing", description: "Cross ridge at safe altitude accounting for updrafts", type: "navigation", points: 20, completed: false, order: 4 },
      { id: "t2-5", title: "Coordinate with Artillery", description: "Confirm artillery fire plan and deconfliction", type: "coordination", points: 15, completed: false, order: 5 },
      { id: "t2-6", title: "Attack Run", description: "Execute precision attack in confined terrain", type: "engagement", points: 25, completed: false, order: 6 },
      { id: "t2-7", title: "Valley Egress", description: "Exit through designated valley route", type: "navigation", points: 15, completed: false, order: 7 },
    ],
    passingScore: 70,
    flightPath: [
      { id: "wp-1", name: "Valley Entry", coordinates: { lat: 34.1000, lng: 74.8000 }, altitude: 3000, type: "ingress" },
      { id: "wp-2", name: "Ridge Crossing", coordinates: { lat: 34.1100, lng: 74.8200 }, altitude: 4500, type: "checkpoint" },
      { id: "wp-3", name: "Holding Point", coordinates: { lat: 34.1200, lng: 74.8400 }, altitude: 4000, type: "holding" },
      { id: "wp-4", name: "Attack IP", coordinates: { lat: 34.1300, lng: 74.8500 }, altitude: 3500, type: "ip" },
      { id: "wp-5", name: "Target Area", coordinates: { lat: 34.1350, lng: 74.8600 }, altitude: 3000, type: "target" },
      { id: "wp-6", name: "Valley Egress", coordinates: { lat: 34.1400, lng: 74.8700 }, altitude: 3500, type: "egress" },
    ],
    artilleryPositions: [
      {
        id: "arty-2",
        unit: "Mountain Battery",
        weaponSystem: "M777 Ultralight",
        coordinates: { lat: 34.1050, lng: 74.8100 },
        firingArcMin: 0,
        firingArcMax: 90,
        maxRange: 30000,
        active: true,
      },
    ],
    noFlyZones: [],
    duration: 60,
  },
  {
    id: "scn-003",
    name: "Night CAS with NVG",
    description: "Night operations using Night Vision Goggles. Limited visibility, increased coordination requirements.",
    helicopterType: "Apache_AH64E",
    terrain: "desert",
    weather: "clear",
    dayNight: "night",
    difficulty: "advanced",
    objectives: [
      "Navigate using NVG",
      "Coordinate with ground forces using IR markers",
      "Execute precision night attack",
      "Maintain situational awareness in darkness",
    ],
    tasks: [
      { id: "t3-1", title: "NVG Setup", description: "Configure and test Night Vision Goggles", type: "safety", points: 10, completed: false, order: 1 },
      { id: "t3-2", title: "Night Briefing", description: "Review night operations procedures and IR protocols", type: "safety", points: 10, completed: false, order: 2 },
      { id: "t3-3", title: "Covert Launch", description: "Depart using minimal lighting procedures", type: "navigation", points: 15, completed: false, order: 3 },
      { id: "t3-4", title: "NOE Navigation", description: "Navigate Nap-of-Earth route using NVG", type: "navigation", points: 20, completed: false, order: 4 },
      { id: "t3-5", title: "IR Marker Identification", description: "Identify friendly forces using IR markers", type: "communication", points: 15, completed: false, order: 5 },
      { id: "t3-6", title: "Pop-up Attack", description: "Execute pop-up maneuver and engage target", type: "engagement", points: 25, completed: false, order: 6 },
      { id: "t3-7", title: "Escape Maneuver", description: "Execute low-level escape route", type: "navigation", points: 15, completed: false, order: 7 },
    ],
    passingScore: 75,
    flightPath: [
      { id: "wp-1", name: "Night Launch", coordinates: { lat: 27.0000, lng: 71.0000 }, altitude: 200, type: "ingress" },
      { id: "wp-2", name: "NOE Route A", coordinates: { lat: 27.0200, lng: 71.0300 }, altitude: 50, type: "checkpoint" },
      { id: "wp-3", name: "NOE Route B", coordinates: { lat: 27.0400, lng: 71.0600 }, altitude: 50, type: "checkpoint" },
      { id: "wp-4", name: "Pop-up Point", coordinates: { lat: 27.0500, lng: 71.0800 }, altitude: 300, type: "ip" },
      { id: "wp-5", name: "Target", coordinates: { lat: 27.0550, lng: 71.0900 }, altitude: 200, type: "target" },
      { id: "wp-6", name: "Escape Route", coordinates: { lat: 27.0600, lng: 71.1000 }, altitude: 50, type: "egress" },
    ],
    artilleryPositions: [],
    noFlyZones: [],
    duration: 90,
  },
  {
    id: "scn-004",
    name: "Joint Fire Support Exercise",
    description: "Complex joint operation with artillery fire coordination. Full integration with ground fires.",
    helicopterType: "Rudra_WSI",
    terrain: "plains",
    weather: "clear",
    dayNight: "day",
    difficulty: "expert",
    objectives: [
      "Coordinate with multiple artillery units",
      "Time-on-target coordination",
      "Airspace deconfliction",
      "Battle Damage Assessment",
      "Re-attack procedures",
    ],
    tasks: [
      { id: "t4-1", title: "Joint Ops Briefing", description: "Review fire support plan and coordination measures", type: "coordination", points: 10, completed: false, order: 1 },
      { id: "t4-2", title: "Artillery Net Check", description: "Establish comms with all artillery units", type: "communication", points: 10, completed: false, order: 2 },
      { id: "t4-3", title: "Airspace Coordination", description: "Confirm ACAs and deconfliction altitudes", type: "coordination", points: 15, completed: false, order: 3 },
      { id: "t4-4", title: "Assembly Area Arrival", description: "Arrive at assembly area on time", type: "navigation", points: 10, completed: false, order: 4 },
      { id: "t4-5", title: "TOT Coordination", description: "Synchronize Time-on-Target with artillery", type: "coordination", points: 20, completed: false, order: 5 },
      { id: "t4-6", title: "First Attack Run", description: "Execute coordinated attack on Target Set 1", type: "engagement", points: 20, completed: false, order: 6 },
      { id: "t4-7", title: "BDA Report", description: "Conduct and report Battle Damage Assessment", type: "communication", points: 15, completed: false, order: 7 },
      { id: "t4-8", title: "Re-arm & Refuel", description: "Complete re-arm at designated point", type: "safety", points: 10, completed: false, order: 8 },
      { id: "t4-9", title: "Second Attack Run", description: "Execute re-attack on Target Set 2", type: "engagement", points: 20, completed: false, order: 9 },
      { id: "t4-10", title: "Mission Complete", description: "RTB and complete debrief", type: "safety", points: 10, completed: false, order: 10 },
    ],
    passingScore: 80,
    flightPath: [
      { id: "wp-1", name: "Assembly Area", coordinates: { lat: 34.0000, lng: 74.7000 }, altitude: 1000, type: "ingress" },
      { id: "wp-2", name: "Hold Alpha", coordinates: { lat: 34.0200, lng: 74.7200 }, altitude: 1500, type: "holding" },
      { id: "wp-3", name: "IP Bravo", coordinates: { lat: 34.0400, lng: 74.7400 }, altitude: 500, type: "ip" },
      { id: "wp-4", name: "Target Set 1", coordinates: { lat: 34.0500, lng: 74.7500 }, altitude: 300, type: "target" },
      { id: "wp-5", name: "Re-arm Point", coordinates: { lat: 34.0300, lng: 74.7300 }, altitude: 1000, type: "holding" },
      { id: "wp-6", name: "Target Set 2", coordinates: { lat: 34.0600, lng: 74.7600 }, altitude: 300, type: "target" },
      { id: "wp-7", name: "RTB Route", coordinates: { lat: 34.0100, lng: 74.7100 }, altitude: 1500, type: "egress" },
    ],
    artilleryPositions: [
      {
        id: "arty-3",
        unit: "155 Medium Regiment",
        weaponSystem: "K9 Vajra",
        coordinates: { lat: 34.0100, lng: 74.7050 },
        firingArcMin: 30,
        firingArcMax: 150,
        maxRange: 40000,
        active: true,
      },
      {
        id: "arty-4",
        unit: "Rocket Regiment",
        weaponSystem: "Pinaka MBRL",
        coordinates: { lat: 34.0050, lng: 74.6900 },
        firingArcMin: 45,
        firingArcMax: 90,
        maxRange: 75000,
        active: true,
      },
    ],
    noFlyZones: [
      {
        id: "nfz-2",
        name: "Friendly Position",
        coordinates: [
          { lat: 34.0450, lng: 74.7450 },
          { lat: 34.0470, lng: 74.7480 },
          { lat: 34.0450, lng: 74.7510 },
          { lat: 34.0430, lng: 74.7480 },
        ],
        altitudeMin: 0,
        altitudeMax: 10000,
        reason: "Friendly forces",
        active: true,
      },
    ],
    duration: 120,
  },
];

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface TrainingState {
  // View settings
  selectedHelicopter: string;
  viewMode: ViewMode;
  terrain: TerrainType;
  weather: WeatherType;
  dayNight: DayNight;
  showArtilleryOverlay: boolean;
  showFlightPath: boolean;
  showNFZs: boolean;
  showLabels: boolean;

  // Scenarios
  scenarios: TrainingScenario[];
  selectedScenarioId: string | null;
  activeSession: TrainingSession | null;

  // Camera
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];

  // Actions
  setSelectedHelicopter: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setTerrain: (terrain: TerrainType) => void;
  setWeather: (weather: WeatherType) => void;
  setDayNight: (dayNight: DayNight) => void;
  toggleArtilleryOverlay: () => void;
  toggleFlightPath: () => void;
  toggleNFZs: () => void;
  toggleLabels: () => void;
  setCameraPosition: (position: [number, number, number]) => void;
  setCameraTarget: (target: [number, number, number]) => void;

  // Scenario actions
  selectScenario: (id: string) => void;
  startSession: (scenarioId: string) => void;
  endSession: (score?: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  abortSession: () => void;
  logEvent: (event: Omit<TrainingEvent, "id" | "timestamp">) => void;

  // Task actions
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  updateElapsedTime: (seconds: number) => void;
  calculateScore: () => number;
  isTaskAvailable: (taskId: string) => boolean;
  getCompletedTasksCount: () => number;
  getTotalTasksCount: () => number;

  // Getters
  getSelectedScenario: () => TrainingScenario | undefined;
  getScenarioById: (id: string) => TrainingScenario | undefined;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedHelicopter: "Rudra_WSI",
      viewMode: "normal",
      terrain: "plains",
      weather: "clear",
      dayNight: "day",
      showArtilleryOverlay: true,
      showFlightPath: true,
      showNFZs: true,
      showLabels: true,

      scenarios: mockScenarios,
      selectedScenarioId: null,
      activeSession: null,

      cameraPosition: [10, 5, 10],
      cameraTarget: [0, 0, 0],

      // Actions
      setSelectedHelicopter: (id) => set({ selectedHelicopter: id }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setTerrain: (terrain) => set({ terrain }),
      setWeather: (weather) => set({ weather }),
      setDayNight: (dayNight) => set({ dayNight }),
      toggleArtilleryOverlay: () => set((s) => ({ showArtilleryOverlay: !s.showArtilleryOverlay })),
      toggleFlightPath: () => set((s) => ({ showFlightPath: !s.showFlightPath })),
      toggleNFZs: () => set((s) => ({ showNFZs: !s.showNFZs })),
      toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
      setCameraPosition: (position) => set({ cameraPosition: position }),
      setCameraTarget: (target) => set({ cameraTarget: target }),

      // Scenario actions
      selectScenario: (id) => {
        const scenario = get().scenarios.find((s) => s.id === id);
        if (scenario) {
          set({
            selectedScenarioId: id,
            selectedHelicopter: scenario.helicopterType,
            terrain: scenario.terrain,
            weather: scenario.weather,
            dayNight: scenario.dayNight,
          });
        }
      },

      startSession: (scenarioId) => {
        const session: TrainingSession = {
          id: `session-${Date.now()}`,
          scenarioId,
          startTime: new Date().toISOString(),
          status: "in_progress",
          events: [],
          completedTasks: [],
          elapsedTime: 0,
        };
        set({ activeSession: session });
      },

      endSession: (score) => {
        set((state) => ({
          activeSession: state.activeSession
            ? {
                ...state.activeSession,
                endTime: new Date().toISOString(),
                status: "completed",
                score,
              }
            : null,
        }));
      },

      pauseSession: () => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, status: "paused" }
            : null,
        }));
      },

      resumeSession: () => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, status: "in_progress" }
            : null,
        }));
      },

      abortSession: () => {
        set((state) => ({
          activeSession: state.activeSession
            ? {
                ...state.activeSession,
                endTime: new Date().toISOString(),
                status: "aborted",
              }
            : null,
        }));
      },

      logEvent: (event) => {
        const newEvent: TrainingEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...event,
        };
        set((state) => ({
          activeSession: state.activeSession
            ? {
                ...state.activeSession,
                events: [...state.activeSession.events, newEvent],
              }
            : null,
        }));
      },

      // Task actions
      completeTask: (taskId) => {
        set((state) => ({
          activeSession: state.activeSession
            ? {
                ...state.activeSession,
                completedTasks: [...state.activeSession.completedTasks, taskId],
              }
            : null,
        }));
        // Log the event
        get().logEvent({
          type: "waypoint_reached",
          details: `Task completed: ${taskId}`,
          severity: "info",
        });
      },

      uncompleteTask: (taskId) => {
        set((state) => ({
          activeSession: state.activeSession
            ? {
                ...state.activeSession,
                completedTasks: state.activeSession.completedTasks.filter((id) => id !== taskId),
              }
            : null,
        }));
      },

      updateElapsedTime: (seconds) => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, elapsedTime: seconds }
            : null,
        }));
      },

      calculateScore: () => {
        const { activeSession, scenarios } = get();
        if (!activeSession) return 0;

        const scenario = scenarios.find((s) => s.id === activeSession.scenarioId);
        if (!scenario) return 0;

        const totalPoints = scenario.tasks.reduce((sum, task) => sum + task.points, 0);
        const earnedPoints = scenario.tasks
          .filter((task) => activeSession.completedTasks.includes(task.id))
          .reduce((sum, task) => sum + task.points, 0);

        return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      },

      isTaskAvailable: (taskId) => {
        const { activeSession, scenarios } = get();
        if (!activeSession) return false;

        const scenario = scenarios.find((s) => s.id === activeSession.scenarioId);
        if (!scenario) return false;

        const task = scenario.tasks.find((t) => t.id === taskId);
        if (!task) return false;

        // Check if previous task is completed (tasks must be done in order)
        if (task.order === 1) return true;

        const previousTask = scenario.tasks.find((t) => t.order === task.order - 1);
        if (!previousTask) return true;

        return activeSession.completedTasks.includes(previousTask.id);
      },

      getCompletedTasksCount: () => {
        const { activeSession } = get();
        return activeSession?.completedTasks.length || 0;
      },

      getTotalTasksCount: () => {
        const { activeSession, scenarios } = get();
        if (!activeSession) return 0;
        const scenario = scenarios.find((s) => s.id === activeSession.scenarioId);
        return scenario?.tasks.length || 0;
      },

      // Getters
      getSelectedScenario: () => {
        const { scenarios, selectedScenarioId } = get();
        return scenarios.find((s) => s.id === selectedScenarioId);
      },

      getScenarioById: (id) => {
        return get().scenarios.find((s) => s.id === id);
      },
    }),
    {
      name: "aviation-training-store",
      partialize: (state) => ({
        selectedHelicopter: state.selectedHelicopter,
        viewMode: state.viewMode,
        showArtilleryOverlay: state.showArtilleryOverlay,
        showFlightPath: state.showFlightPath,
        showNFZs: state.showNFZs,
        showLabels: state.showLabels,
      }),
    }
  )
);
