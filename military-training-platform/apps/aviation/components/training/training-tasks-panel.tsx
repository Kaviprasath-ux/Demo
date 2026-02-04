"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Radio,
  Shield,
  Navigation,
  Users,
  Trophy,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@military/ui";
import { useTrainingStore, type TrainingTask } from "@/lib/stores/training-store";

// ============================================================================
// TASK ICON HELPER
// ============================================================================

function getTaskIcon(type: TrainingTask["type"]) {
  switch (type) {
    case "navigation":
      return Navigation;
    case "communication":
      return Radio;
    case "engagement":
      return Target;
    case "safety":
      return Shield;
    case "coordination":
      return Users;
    default:
      return Circle;
  }
}

function getTaskColor(type: TrainingTask["type"]) {
  switch (type) {
    case "navigation":
      return "text-emerald-400";
    case "communication":
      return "text-emerald-500";
    case "engagement":
      return "text-red-400";
    case "safety":
      return "text-yellow-400";
    case "coordination":
      return "text-emerald-300";
    default:
      return "text-gray-400";
  }
}

// ============================================================================
// TIMER COMPONENT
// ============================================================================

function Timer({ isRunning }: { isRunning: boolean }) {
  const { activeSession, updateElapsedTime } = useTrainingStore();
  const [elapsed, setElapsed] = useState(activeSession?.elapsedTime || 0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const newTime = prev + 1;
        updateElapsedTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, updateElapsedTime]);

  // Sync with store on session change
  useEffect(() => {
    if (activeSession) {
      setElapsed(activeSession.elapsedTime);
    }
  }, [activeSession?.id]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex items-center gap-2 text-lg font-mono">
      <Clock className="w-5 h-5 text-emerald-500" />
      <span className="text-white">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

// ============================================================================
// SCORE DISPLAY
// ============================================================================

function ScoreDisplay() {
  const { calculateScore, getCompletedTasksCount, getTotalTasksCount, getSelectedScenario } =
    useTrainingStore();

  const score = calculateScore();
  const completed = getCompletedTasksCount();
  const total = getTotalTasksCount();
  const scenario = getSelectedScenario();
  const passingScore = scenario?.passingScore || 70;

  const isPassing = score >= passingScore;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Progress</span>
        <span className="text-sm text-white">
          {completed}/{total} tasks
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-muted-foreground">Score</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-bold ${
              isPassing ? "text-emerald-400" : "text-yellow-400"
            }`}
          >
            {score}%
          </span>
          {isPassing && <Trophy className="w-5 h-5 text-emerald-400" />}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Passing score: {passingScore}%
      </p>
    </div>
  );
}

// ============================================================================
// TASK ITEM
// ============================================================================

function TaskItem({
  task,
  isCompleted,
  isAvailable,
  onToggle,
}: {
  task: TrainingTask;
  isCompleted: boolean;
  isAvailable: boolean;
  onToggle: () => void;
}) {
  const Icon = getTaskIcon(task.type);
  const colorClass = getTaskColor(task.type);

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isCompleted
          ? "bg-emerald-500/10 border-emerald-500/30"
          : isAvailable
          ? "bg-card border-border hover:border-emerald-500/50 cursor-pointer"
          : "bg-muted/30 border-border/50 opacity-50"
      }`}
      onClick={isAvailable && !isCompleted ? onToggle : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isAvailable) onToggle();
          }}
          disabled={!isAvailable}
          className={`mt-0.5 ${isAvailable ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Circle
              className={`w-5 h-5 ${
                isAvailable ? "text-muted-foreground hover:text-emerald-500" : "text-muted"
              }`}
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${colorClass}`} />
            <span
              className={`font-medium text-sm ${
                isCompleted ? "text-emerald-400 line-through" : "text-white"
              }`}
            >
              {task.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
        </div>

        {/* Points */}
        <div
          className={`text-xs font-medium px-2 py-1 rounded ${
            isCompleted
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          +{task.points}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLETION MODAL
// ============================================================================

function CompletionModal({
  isOpen,
  onClose,
  onRestart,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}) {
  const { activeSession, calculateScore, getSelectedScenario, getCompletedTasksCount, getTotalTasksCount } =
    useTrainingStore();

  if (!isOpen || !activeSession) return null;

  const score = calculateScore();
  const scenario = getSelectedScenario();
  const passingScore = scenario?.passingScore || 70;
  const isPassing = score >= passingScore;
  const completed = getCompletedTasksCount();
  const total = getTotalTasksCount();

  const elapsed = activeSession.elapsedTime;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          {isPassing ? (
            <>
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mission Complete!</h2>
              <p className="text-emerald-400 mt-1">You passed the training scenario</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Training Incomplete</h2>
              <p className="text-yellow-400 mt-1">Score below passing threshold</p>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-white">{score}%</p>
            <p className="text-xs text-muted-foreground mt-1">Final Score</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-white">
              {completed}/{total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-white">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Time Elapsed</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className={`text-3xl font-bold ${isPassing ? "text-emerald-400" : "text-yellow-400"}`}>
              {isPassing ? "PASS" : "FAIL"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Required: {passingScore}%</p>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white">Performance Breakdown</h3>
          <div className="space-y-1">
            {scenario?.tasks.map((task) => {
              const isTaskCompleted = activeSession.completedTasks.includes(task.id);
              return (
                <div key={task.id} className="flex items-center justify-between text-xs">
                  <span className={isTaskCompleted ? "text-emerald-400" : "text-muted-foreground"}>
                    {isTaskCompleted ? "✓" : "○"} {task.title}
                  </span>
                  <span className={isTaskCompleted ? "text-emerald-400" : "text-muted-foreground"}>
                    {isTaskCompleted ? `+${task.points}` : "0"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={onRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TrainingTasksPanel() {
  const {
    activeSession,
    getSelectedScenario,
    completeTask,
    uncompleteTask,
    isTaskAvailable,
    calculateScore,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
  } = useTrainingStore();

  const [showCompletion, setShowCompletion] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const scenario = getSelectedScenario();
  const isRunning = activeSession?.status === "in_progress";

  if (!scenario) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white">No Scenario Selected</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select a training scenario to begin
          </p>
        </div>
      </div>
    );
  }

  const handleToggleTask = (taskId: string) => {
    if (!activeSession) return;

    if (activeSession.completedTasks.includes(taskId)) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
    }
  };

  const handleEndTraining = () => {
    const score = calculateScore();
    endSession(score);
    setShowCompletion(true);
  };

  const handleRestart = () => {
    setShowCompletion(false);
    startSession(scenario.id);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className="p-4 border-b border-border flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            Training Tasks
          </h3>
          <div className="flex items-center gap-3">
            {activeSession && <Timer isRunning={isRunning} />}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Score Section */}
            {activeSession && (
              <div className="p-4 border-b border-border">
                <ScoreDisplay />
              </div>
            )}

            {/* Tasks List */}
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {scenario.tasks
                .sort((a, b) => a.order - b.order)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isCompleted={activeSession?.completedTasks.includes(task.id) || false}
                    isAvailable={activeSession ? isTaskAvailable(task.id) : false}
                    onToggle={() => handleToggleTask(task.id)}
                  />
                ))}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border">
              {!activeSession ? (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => startSession(scenario.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Training
                </Button>
              ) : (
                <div className="flex gap-2">
                  {isRunning ? (
                    <Button variant="outline" className="flex-1" onClick={pauseSession}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" onClick={resumeSession}>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleEndTraining}
                  >
                    Complete Training
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        onRestart={handleRestart}
      />
    </>
  );
}

export default TrainingTasksPanel;
