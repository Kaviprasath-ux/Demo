"use client";

import { useEffect, useRef } from "react";
import { useTrainingStore, useCurrentStep } from "@/lib/training-store";
import { drills } from "@/lib/gun-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  Circle,
  CircleDot,
  AlertTriangle,
  Clock,
  Target,
} from "lucide-react";

export function AssemblyGuide() {
  const {
    currentDrill,
    currentStepIndex,
    playbackState,
    drillProgress,
    startDrill,
    pauseDrill,
    resumeDrill,
    nextStep,
    previousStep,
    resetDrill,
    setSelectedComponent,
    mode,
  } = useTrainingStore();

  const currentStep = useCurrentStep();
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance in cadet mode when playing
  useEffect(() => {
    if (playbackState === "playing" && currentDrill && mode === "cadet") {
      const step = currentDrill.steps[currentStepIndex];
      if (step) {
        // Highlight the current component
        setSelectedComponent(step.component);

        // Auto-advance after step duration
        autoPlayRef.current = setTimeout(() => {
          nextStep();
        }, step.duration);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackState, currentStepIndex, currentDrill, mode]);

  // Handle component selection in instructor mode
  useEffect(() => {
    if (currentStep && playbackState !== "idle") {
      setSelectedComponent(currentStep.component);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500";
      case "advanced":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Training Drills</CardTitle>
          {currentDrill && (
            <Badge variant="outline" className="text-xs">
              {Math.round(drillProgress)}% Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        {!currentDrill ? (
          // Drill selection
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {drills.map((drill) => (
                <button
                  key={drill.id}
                  onClick={() => startDrill(drill.id)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{drill.name}</span>
                    <Badge className={getDifficultyColor(drill.difficulty)}>
                      {drill.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {drill.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {drill.steps.length} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />~{drill.estimatedTime}s
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          // Active drill view
          <div className="flex-1 flex flex-col">
            {/* Drill header */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{currentDrill.name}</h3>
                <Button variant="ghost" size="sm" onClick={resetDrill}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Exit
                </Button>
              </div>
              <Progress value={drillProgress} className="h-2" />
            </div>

            {/* Steps list */}
            <ScrollArea className="flex-1 mb-3">
              <div className="space-y-1">
                {currentDrill.steps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;

                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-primary/10 border border-primary/30"
                          : isCompleted
                          ? "bg-muted/30"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : isCurrent ? (
                            <CircleDot className="h-4 w-4 text-primary" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              isPending ? "text-muted-foreground" : ""
                            }`}
                          >
                            {step.action}
                          </p>
                          {isCurrent && step.safetyWarning && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-yellow-600 dark:text-yellow-500">
                              <AlertTriangle className="h-3 w-3" />
                              {step.safetyWarning}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {step.component}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="icon"
                onClick={previousStep}
                disabled={currentStepIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              {playbackState === "playing" ? (
                <Button size="icon" onClick={pauseDrill}>
                  <Pause className="h-4 w-4" />
                </Button>
              ) : playbackState === "completed" ? (
                <Button size="icon" onClick={resetDrill}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  onClick={playbackState === "paused" ? resumeDrill : () => {}}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={nextStep}
                disabled={
                  currentStepIndex === currentDrill.steps.length - 1 ||
                  playbackState === "completed"
                }
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Completion message */}
            {playbackState === "completed" && (
              <div className="mt-3 p-3 bg-green-500/10 rounded-lg text-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Drill Completed!
                </p>
                <p className="text-xs text-muted-foreground">
                  Select another drill or reset to practice again.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
