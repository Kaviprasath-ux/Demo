import { create } from "zustand";
import { persist } from "zustand/middleware";
import { drills, type Drill, type DrillStep } from "./gun-data";

// Training modes
export type TrainingMode = "cadet" | "instructor" | "assessment";

// View modes for 3D model
export type ViewMode = "normal" | "exploded" | "xray";

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

// Training session state
interface TrainingState {
  // Current mode
  mode: TrainingMode;
  setMode: (mode: TrainingMode) => void;

  // View settings
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
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
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: "cadet",
      viewMode: "normal",
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
        }
      },

      nextStep: () => {
        const { currentDrill, currentStepIndex } = get();
        if (currentDrill && currentStepIndex < currentDrill.steps.length - 1) {
          const newIndex = currentStepIndex + 1;
          const progress = ((newIndex + 1) / currentDrill.steps.length) * 100;
          set({
            currentStepIndex: newIndex,
            drillProgress: progress,
          });

          // Check for safety warnings
          const step = currentDrill.steps[newIndex];
          if (step.safetyWarning) {
            get().addAlert(`step-warning-${newIndex}`);
          }

          // Trigger firing animation if it's a fire step
          if (step.animation === "fire") {
            get().triggerFiring();
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
        const { mode } = get();
        if (mode === "assessment") {
          get().stopAssessmentTimer();
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
        set((state) => ({
          assessmentScore: Math.max(0, state.assessmentScore - 10),
          assessmentErrors: [...state.assessmentErrors, error],
        }));
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
    }),
    {
      name: "oaksip-training",
      partialize: (state) => ({
        mode: state.mode,
        showLabels: state.showLabels,
        soundEnabled: state.soundEnabled,
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
