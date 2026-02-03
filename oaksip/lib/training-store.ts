import { create } from "zustand";
import { persist } from "zustand/middleware";
import { drills, type Drill, type DrillStep, type MissionScenario, missionScenarios } from "./gun-data";
import { type GunSystemId, getGunSystemById } from "./gun-systems";

// =============================================================================
// AAR (After-Action Review) Types - SOW Section 8.4
// =============================================================================

export interface AAREvent {
  timestamp: number;
  type: "step_start" | "step_complete" | "error" | "safety_alert" | "firing" | "camera_change";
  stepIndex?: number;
  description: string;
  data?: Record<string, unknown>;
}

export interface AARSession {
  id: string;
  drillId: string;
  drillName: string;
  traineeId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  terrain: TerrainType;
  weather: WeatherType;
  events: AAREvent[];
  finalScore?: number;
  errors: string[];
  completed: boolean;
}

// =============================================================================
// MISSION SCENARIO Types - SOW Section 8.4
// =============================================================================

export interface ObjectiveProgress {
  objectiveId: string;
  completed: boolean;
  roundsFired: number;
  timeSpent: number;
  score: number;
}

export interface ScenarioSession {
  scenarioId: string;
  startTime: Date;
  objectiveProgress: ObjectiveProgress[];
  currentObjectiveIndex: number;
  totalScore: number;
  roundsFired: number;
  isActive: boolean;
}

// Training modes
export type TrainingMode = "cadet" | "instructor" | "assessment";

// View modes for 3D model
export type ViewMode = "normal" | "exploded" | "xray";

// Viewer type - custom 3D or Sketchfab embed
export type ViewerType = "custom" | "sketchfab";

// Terrain types - SOW Section 8.4
export type TerrainType = "plains" | "desert" | "mountain" | "high-altitude";

// Weather conditions - SOW Section 8.4
export type WeatherType = "clear" | "rain" | "fog" | "night";

// Terrain configurations
export const terrainConfigs: Record<TerrainType, {
  label: string;
  groundColor: string;
  skyColor: string;
  fogColor: string;
  fogDensity: number;
  ambientIntensity: number;
  description: string;
}> = {
  plains: {
    label: "Plains",
    groundColor: "#4a6741",
    skyColor: "#87ceeb",
    fogColor: "#c9d6c3",
    fogDensity: 0.005,
    ambientIntensity: 0.5,
    description: "Open grassland terrain with good visibility",
  },
  desert: {
    label: "Desert",
    groundColor: "#c2a366",
    skyColor: "#f4d279",
    fogColor: "#e8d4a8",
    fogDensity: 0.008,
    ambientIntensity: 0.7,
    description: "Sandy terrain with heat haze effects",
  },
  mountain: {
    label: "Mountain",
    groundColor: "#6b7b6b",
    skyColor: "#a8c4d4",
    fogColor: "#b8c8c8",
    fogDensity: 0.015,
    ambientIntensity: 0.4,
    description: "Rocky terrain at moderate altitude",
  },
  "high-altitude": {
    label: "High Altitude",
    groundColor: "#d4d4d4",
    skyColor: "#1a1a3a",
    fogColor: "#e0e0e8",
    fogDensity: 0.003,
    ambientIntensity: 0.6,
    description: "Snow-covered terrain at extreme elevation",
  },
};

// Weather configurations
export const weatherConfigs: Record<WeatherType, {
  label: string;
  visibility: number;
  particleCount: number;
  lightIntensity: number;
  fogMultiplier: number;
  description: string;
}> = {
  clear: {
    label: "Clear",
    visibility: 1.0,
    particleCount: 0,
    lightIntensity: 1.0,
    fogMultiplier: 1.0,
    description: "Perfect visibility conditions",
  },
  rain: {
    label: "Rain",
    visibility: 0.6,
    particleCount: 5000,
    lightIntensity: 0.5,
    fogMultiplier: 2.0,
    description: "Reduced visibility, wet conditions",
  },
  fog: {
    label: "Fog",
    visibility: 0.3,
    particleCount: 0,
    lightIntensity: 0.4,
    fogMultiplier: 5.0,
    description: "Heavy fog, severely limited visibility",
  },
  night: {
    label: "Night",
    visibility: 0.4,
    particleCount: 0,
    lightIntensity: 0.15,
    fogMultiplier: 1.5,
    description: "Night operations with reduced visibility",
  },
};

// Camera preset positions
export type CameraPreset = "default" | "front" | "side" | "top" | "detail";

export const cameraPresetPositions: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  default: { position: [4, 3, 4], target: [0, 0.3, 0] },
  front: { position: [0, 1, 6], target: [0, 0.3, 0] },
  side: { position: [6, 1, 0], target: [0, 0.3, 0] },
  top: { position: [0, 6, 0.1], target: [0, 0, 0] },
  detail: { position: [1.5, 1, 1.5], target: [0, 0.4, 0] },
};

// Drill playback state
export type PlaybackState = "idle" | "playing" | "paused" | "completed";

// Animation types
export type AnimationType = "none" | "firing" | "recoil" | "loading";

// Shooting score tracking - Layer 2 Marksmanship Training
export interface ShootingScore {
  totalShots: number;
  hits: number;
  misses: number;
  points: number;
  accuracy: number;
  bestStreak: number;
  currentStreak: number;
  shotHistory: Array<{
    hit: boolean;
    points: number;
    distance: number;
    timestamp: number;
  }>;
}

// Training session state
interface TrainingState {
  // Current mode
  mode: TrainingMode;
  setMode: (mode: TrainingMode) => void;

  // View settings
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  viewerType: ViewerType;
  setViewerType: (type: ViewerType) => void;
  showLabels: boolean;
  toggleLabels: () => void;
  isFullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;

  // Selected component
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;

  // Drill state
  currentDrill: Drill | null;
  currentStepIndex: number;
  playbackState: PlaybackState;
  drillProgress: number; // 0-100

  // Drill actions
  startDrill: (drillId: string) => void;
  pauseDrill: () => void;
  resumeDrill: () => void;
  nextStep: () => void;
  previousStep: () => void;
  resetDrill: () => void;
  completeDrill: () => void;

  // Safety alerts
  activeAlerts: string[];
  addAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearAlerts: () => void;

  // Assessment tracking
  assessmentScore: number;
  assessmentErrors: string[];
  assessmentStartTime: number | null;
  assessmentEndTime: number | null;
  recordError: (error: string) => void;
  resetAssessment: () => void;
  startAssessmentTimer: () => void;
  stopAssessmentTimer: () => void;

  // Camera presets
  cameraPreset: "default" | "front" | "side" | "top" | "detail";
  setCameraPreset: (preset: "default" | "front" | "side" | "top" | "detail") => void;

  // Animation state
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  currentAnimation: AnimationType;
  triggerAnimation: (animation: AnimationType) => void;

  // Firing sequence
  triggerFiring: () => void;

  // Sound effects
  soundEnabled: boolean;
  toggleSound: () => void;

  // Terrain & Weather - SOW Section 8.4
  terrain: TerrainType;
  weather: WeatherType;
  setTerrain: (terrain: TerrainType) => void;
  setWeather: (weather: WeatherType) => void;

  // AAR (After-Action Review) - SOW Section 8.4
  isRecording: boolean;
  currentSession: AARSession | null;
  savedSessions: AARSession[];
  aarPlaybackIndex: number;
  isAARPlaying: boolean;

  startRecording: (drillId: string, drillName: string, traineeId?: string) => void;
  recordEvent: (event: Omit<AAREvent, "timestamp">) => void;
  stopRecording: (finalScore?: number) => void;
  loadAARSession: (sessionId: string) => void;
  playAAR: () => void;
  pauseAAR: () => void;
  seekAAR: (index: number) => void;
  clearCurrentSession: () => void;
  deleteAARSession: (sessionId: string) => void;

  // Mission Scenarios - SOW Section 8.4
  activeScenario: MissionScenario | null;
  scenarioSession: ScenarioSession | null;
  startScenario: (scenarioId: string) => void;
  completeObjective: (objectiveId: string, score: number) => void;
  fireRound: () => void;
  endScenario: () => void;
  getScenarioProgress: () => number;

  // Gun System Selection - SOW Section 8.4 (Multiple systems)
  selectedGunSystem: GunSystemId;
  setGunSystem: (systemId: GunSystemId) => void;
  getGunSystemInfo: () => ReturnType<typeof getGunSystemById>;

  // Crew Station Simulation - SOW Section 8.4
  selectedCrewStation: string | null;
  setCrewStation: (stationId: string | null) => void;
  getCrewPositions: () => import("./gun-systems").CrewPosition[];
  getCrewPositionInfo: () => import("./gun-systems").CrewPosition | null;
  crewInteractionMode: "observe" | "train" | "assess";
  setCrewInteractionMode: (mode: "observe" | "train" | "assess") => void;

  // Shooting Score - Layer 2 Marksmanship Training
  shootingScore: ShootingScore;
  recordShot: (hit: boolean, points: number, distance: number) => void;
  resetShootingScore: () => void;
  aimingMode: boolean;
  setAimingMode: (enabled: boolean) => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: "cadet",
      viewMode: "normal",
      viewerType: "custom",
      showLabels: true,
      isFullscreen: false,
      selectedComponent: null,
      currentDrill: null,
      currentStepIndex: 0,
      playbackState: "idle",
      drillProgress: 0,
      activeAlerts: [],
      assessmentScore: 100,
      assessmentErrors: [],
      assessmentStartTime: null,
      assessmentEndTime: null,
      cameraPreset: "default",
      isAnimating: false,
      currentAnimation: "none",
      soundEnabled: true,
      terrain: "plains",
      weather: "clear",
      isRecording: false,
      currentSession: null,
      savedSessions: [],
      aarPlaybackIndex: 0,
      isAARPlaying: false,
      activeScenario: null,
      scenarioSession: null,
      selectedGunSystem: "dhanush",
      selectedCrewStation: null,
      crewInteractionMode: "observe",
      shootingScore: {
        totalShots: 0,
        hits: 0,
        misses: 0,
        points: 0,
        accuracy: 0,
        bestStreak: 0,
        currentStreak: 0,
        shotHistory: [],
      },
      aimingMode: true,

      // Mode actions
      setMode: (mode) => {
        set({ mode });
        // Reset drill when changing modes
        if (mode !== get().mode) {
          get().resetDrill();
        }
      },

      // View actions
      setViewMode: (viewMode) => set({ viewMode }),
      setViewerType: (viewerType) => set({ viewerType }),
      toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
      setFullscreen: (isFullscreen) => set({ isFullscreen }),

      // Component selection
      setSelectedComponent: (id) => set({ selectedComponent: id }),

      // Drill actions
      startDrill: (drillId) => {
        const drill = drills.find((d) => d.id === drillId);
        if (drill) {
          const isAssessment = get().mode === "assessment";
          set({
            currentDrill: drill,
            currentStepIndex: 0,
            playbackState: "paused", // Start paused, user clicks Play to begin
            drillProgress: 0,
            activeAlerts: [],
            assessmentScore: isAssessment ? 100 : get().assessmentScore,
            assessmentErrors: isAssessment ? [] : get().assessmentErrors,
            assessmentStartTime: null,
            assessmentEndTime: null,
          });
        }
      },

      pauseDrill: () => {
        if (get().playbackState === "playing") {
          set({ playbackState: "paused" });
        }
      },

      resumeDrill: () => {
        if (get().playbackState === "paused") {
          set({ playbackState: "playing" });
          // Start timer for assessment mode
          if (get().mode === "assessment" && !get().assessmentStartTime) {
            get().startAssessmentTimer();
          }
          // Start AAR recording if not already recording
          const { currentDrill, isRecording } = get();
          if (currentDrill && !isRecording) {
            get().startRecording(currentDrill.id, currentDrill.name);
            get().recordEvent({
              type: "step_start",
              stepIndex: 0,
              description: `Started drill: ${currentDrill.name}`,
            });
          }
        }
      },

      nextStep: () => {
        const { currentDrill, currentStepIndex, isRecording } = get();
        if (currentDrill && currentStepIndex < currentDrill.steps.length - 1) {
          // Record completion of current step
          if (isRecording) {
            const completedStep = currentDrill.steps[currentStepIndex];
            get().recordEvent({
              type: "step_complete",
              stepIndex: currentStepIndex,
              description: `Completed: ${completedStep.action}`,
            });
          }

          const newIndex = currentStepIndex + 1;
          const progress = ((newIndex + 1) / currentDrill.steps.length) * 100;
          set({
            currentStepIndex: newIndex,
            drillProgress: progress,
          });

          // Record start of new step
          const step = currentDrill.steps[newIndex];
          if (isRecording) {
            get().recordEvent({
              type: "step_start",
              stepIndex: newIndex,
              description: `Starting: ${step.action}`,
            });
          }

          // Check for safety warnings
          if (step.safetyWarning) {
            get().addAlert(`step-warning-${newIndex}`);
            if (isRecording) {
              get().recordEvent({
                type: "safety_alert",
                stepIndex: newIndex,
                description: step.safetyWarning,
              });
            }
          }

          // Trigger firing animation if it's a fire step
          if (step.animation === "fire") {
            get().triggerFiring();
            if (isRecording) {
              get().recordEvent({
                type: "firing",
                stepIndex: newIndex,
                description: "Gun fired",
              });
            }
          }
        } else if (currentDrill && currentStepIndex === currentDrill.steps.length - 1) {
          get().completeDrill();
        }
      },

      previousStep: () => {
        const { currentDrill, currentStepIndex, mode } = get();
        if (currentDrill && currentStepIndex > 0) {
          const newIndex = currentStepIndex - 1;
          const progress = ((newIndex + 1) / currentDrill.steps.length) * 100;
          set({
            currentStepIndex: newIndex,
            drillProgress: progress,
          });

          // Penalty for going back in assessment mode
          if (mode === "assessment") {
            get().recordError("Went back a step");
          }
        }
      },

      resetDrill: () => {
        set({
          currentDrill: null,
          currentStepIndex: 0,
          playbackState: "idle",
          drillProgress: 0,
          activeAlerts: [],
          currentAnimation: "none",
        });
      },

      completeDrill: () => {
        const { mode, isRecording, currentDrill, assessmentScore } = get();
        if (mode === "assessment") {
          get().stopAssessmentTimer();
        }

        // Record completion and stop AAR
        if (isRecording && currentDrill) {
          get().recordEvent({
            type: "step_complete",
            stepIndex: currentDrill.steps.length - 1,
            description: `Drill completed: ${currentDrill.name}`,
          });
          get().stopRecording(mode === "assessment" ? assessmentScore : undefined);
        }

        set({
          playbackState: "completed",
          drillProgress: 100,
        });
      },

      // Alert actions
      addAlert: (alertId) => {
        const { activeAlerts } = get();
        if (!activeAlerts.includes(alertId)) {
          set({ activeAlerts: [...activeAlerts, alertId] });
        }
      },

      dismissAlert: (alertId) => {
        set((state) => ({
          activeAlerts: state.activeAlerts.filter((id) => id !== alertId),
        }));
      },

      clearAlerts: () => set({ activeAlerts: [] }),

      // Assessment actions
      recordError: (error) => {
        const { isRecording } = get();
        set((state) => ({
          assessmentScore: Math.max(0, state.assessmentScore - 10),
          assessmentErrors: [...state.assessmentErrors, error],
        }));
        // Record error in AAR
        if (isRecording) {
          get().recordEvent({
            type: "error",
            description: error,
          });
        }
      },

      resetAssessment: () => {
        set({
          assessmentScore: 100,
          assessmentErrors: [],
          assessmentStartTime: null,
          assessmentEndTime: null,
        });
      },

      startAssessmentTimer: () => {
        set({ assessmentStartTime: Date.now() });
      },

      stopAssessmentTimer: () => {
        set({ assessmentEndTime: Date.now() });
      },

      // Camera actions
      setCameraPreset: (preset) => set({ cameraPreset: preset }),

      // Animation actions
      setIsAnimating: (isAnimating) => set({ isAnimating }),

      triggerAnimation: (animation) => {
        set({ currentAnimation: animation, isAnimating: true });
        // Reset after animation completes
        setTimeout(() => {
          set({ currentAnimation: "none", isAnimating: false });
        }, 2000);
      },

      // Firing sequence
      triggerFiring: () => {
        set({ currentAnimation: "firing", isAnimating: true });
        // Firing animation sequence
        setTimeout(() => {
          set({ currentAnimation: "recoil" });
        }, 100);
        setTimeout(() => {
          set({ currentAnimation: "none", isAnimating: false });
        }, 2500);
      },

      // Sound effects
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Terrain & Weather actions
      setTerrain: (terrain) => set({ terrain }),
      setWeather: (weather) => set({ weather }),

      // AAR (After-Action Review) actions - SOW Section 8.4
      startRecording: (drillId, drillName, traineeId) => {
        const session: AARSession = {
          id: `aar-${Date.now()}`,
          drillId,
          drillName,
          traineeId,
          startTime: new Date(),
          duration: 0,
          terrain: get().terrain,
          weather: get().weather,
          events: [],
          errors: [],
          completed: false,
        };
        set({ isRecording: true, currentSession: session });
      },

      recordEvent: (event) => {
        const { currentSession, isRecording } = get();
        if (!isRecording || !currentSession) return;

        const newEvent: AAREvent = {
          ...event,
          timestamp: Date.now() - currentSession.startTime.getTime(),
        };

        set({
          currentSession: {
            ...currentSession,
            events: [...currentSession.events, newEvent],
          },
        });
      },

      stopRecording: (finalScore) => {
        const { currentSession, savedSessions, assessmentErrors } = get();
        if (!currentSession) return;

        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);

        const completedSession: AARSession = {
          ...currentSession,
          endTime,
          duration,
          finalScore,
          errors: assessmentErrors,
          completed: true,
        };

        set({
          isRecording: false,
          currentSession: null,
          savedSessions: [...savedSessions, completedSession].slice(-10), // Keep last 10 sessions
        });
      },

      loadAARSession: (sessionId) => {
        const session = get().savedSessions.find((s) => s.id === sessionId);
        if (session) {
          set({
            currentSession: session,
            aarPlaybackIndex: 0,
            isAARPlaying: false,
          });
        }
      },

      playAAR: () => set({ isAARPlaying: true }),
      pauseAAR: () => set({ isAARPlaying: false }),
      seekAAR: (index) => set({ aarPlaybackIndex: index }),
      clearCurrentSession: () => set({ currentSession: null, aarPlaybackIndex: 0, isAARPlaying: false }),

      deleteAARSession: (sessionId) => {
        set((state) => ({
          savedSessions: state.savedSessions.filter((s) => s.id !== sessionId),
        }));
      },

      // Mission Scenario actions - SOW Section 8.4
      startScenario: (scenarioId) => {
        const scenario = missionScenarios.find((s) => s.id === scenarioId);
        if (!scenario) return;

        // Set terrain and weather to match scenario
        set({
          terrain: scenario.terrain as TerrainType,
          weather: scenario.weather as WeatherType,
          activeScenario: scenario,
          scenarioSession: {
            scenarioId,
            startTime: new Date(),
            objectiveProgress: scenario.objectives.map((obj) => ({
              objectiveId: obj.id,
              completed: false,
              roundsFired: 0,
              timeSpent: 0,
              score: 0,
            })),
            currentObjectiveIndex: 0,
            totalScore: 0,
            roundsFired: 0,
            isActive: true,
          },
        });
      },

      completeObjective: (objectiveId, score) => {
        const { scenarioSession, activeScenario } = get();
        if (!scenarioSession || !activeScenario) return;

        const updatedProgress = scenarioSession.objectiveProgress.map((p) =>
          p.objectiveId === objectiveId
            ? { ...p, completed: true, score }
            : p
        );

        const nextIndex = updatedProgress.findIndex((p) => !p.completed);
        const allComplete = nextIndex === -1;

        set({
          scenarioSession: {
            ...scenarioSession,
            objectiveProgress: updatedProgress,
            currentObjectiveIndex: allComplete ? scenarioSession.objectiveProgress.length : nextIndex,
            totalScore: updatedProgress.reduce((sum, p) => sum + p.score, 0),
          },
        });

        // If all objectives complete, end scenario
        if (allComplete) {
          get().endScenario();
        }
      },

      fireRound: () => {
        const { scenarioSession } = get();
        if (!scenarioSession) return;

        set({
          scenarioSession: {
            ...scenarioSession,
            roundsFired: scenarioSession.roundsFired + 1,
          },
        });
      },

      endScenario: () => {
        const { scenarioSession } = get();
        if (!scenarioSession) return;

        set({
          scenarioSession: {
            ...scenarioSession,
            isActive: false,
          },
        });
      },

      getScenarioProgress: () => {
        const { scenarioSession } = get();
        if (!scenarioSession) return 0;

        const completed = scenarioSession.objectiveProgress.filter((p) => p.completed).length;
        return (completed / scenarioSession.objectiveProgress.length) * 100;
      },

      // Gun System Selection actions - SOW Section 8.4
      setGunSystem: (systemId) => {
        set({ selectedGunSystem: systemId });
        // Reset drill when changing gun systems
        get().resetDrill();
      },

      getGunSystemInfo: () => {
        return getGunSystemById(get().selectedGunSystem);
      },

      // Crew Station Simulation actions - SOW Section 8.4
      setCrewStation: (stationId) => {
        set({ selectedCrewStation: stationId });
      },

      getCrewPositions: () => {
        const gunSystem = getGunSystemById(get().selectedGunSystem);
        return gunSystem?.crewPositions || [];
      },

      getCrewPositionInfo: () => {
        const { selectedCrewStation } = get();
        if (!selectedCrewStation) return null;
        const gunSystem = getGunSystemById(get().selectedGunSystem);
        return gunSystem?.crewPositions.find((p) => p.id === selectedCrewStation) || null;
      },

      setCrewInteractionMode: (mode) => {
        set({ crewInteractionMode: mode });
      },

      // Shooting Score actions - Layer 2 Marksmanship Training
      recordShot: (hit, points, distance) => {
        set((state) => {
          const newTotalShots = state.shootingScore.totalShots + 1;
          const newHits = hit ? state.shootingScore.hits + 1 : state.shootingScore.hits;
          const newMisses = hit ? state.shootingScore.misses : state.shootingScore.misses + 1;
          const newPoints = state.shootingScore.points + points;
          const newAccuracy = newTotalShots > 0 ? (newHits / newTotalShots) * 100 : 0;
          const newCurrentStreak = hit ? state.shootingScore.currentStreak + 1 : 0;
          const newBestStreak = Math.max(state.shootingScore.bestStreak, newCurrentStreak);

          return {
            shootingScore: {
              totalShots: newTotalShots,
              hits: newHits,
              misses: newMisses,
              points: newPoints,
              accuracy: newAccuracy,
              bestStreak: newBestStreak,
              currentStreak: newCurrentStreak,
              shotHistory: [
                ...state.shootingScore.shotHistory,
                { hit, points, distance, timestamp: Date.now() },
              ].slice(-50), // Keep last 50 shots
            },
          };
        });
      },

      resetShootingScore: () => {
        set({
          shootingScore: {
            totalShots: 0,
            hits: 0,
            misses: 0,
            points: 0,
            accuracy: 0,
            bestStreak: 0,
            currentStreak: 0,
            shotHistory: [],
          },
        });
      },

      setAimingMode: (enabled) => {
        set({ aimingMode: enabled });
      },
    }),
    {
      name: "oaksip-training",
      partialize: (state) => ({
        mode: state.mode,
        showLabels: state.showLabels,
        soundEnabled: state.soundEnabled,
        terrain: state.terrain,
        weather: state.weather,
        savedSessions: state.savedSessions,
        selectedGunSystem: state.selectedGunSystem,
        selectedCrewStation: state.selectedCrewStation,
        crewInteractionMode: state.crewInteractionMode,
        viewerType: state.viewerType,
      }),
    }
  )
);

// Helper hook for current drill step
export function useCurrentStep(): DrillStep | null {
  const { currentDrill, currentStepIndex } = useTrainingStore();
  if (!currentDrill) return null;
  return currentDrill.steps[currentStepIndex] || null;
}

// Helper to calculate elapsed time
export function useAssessmentTime(): number {
  const { assessmentStartTime, assessmentEndTime } = useTrainingStore();
  if (!assessmentStartTime) return 0;
  const endTime = assessmentEndTime || Date.now();
  return Math.floor((endTime - assessmentStartTime) / 1000);
}
