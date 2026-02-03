"use client";

import { useTrainingStore, useCurrentStep } from "@/lib/training-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Loader2, Target } from "lucide-react";

export function DrillPlayer() {
  const { currentDrill, currentStepIndex, playbackState, drillProgress, mode } =
    useTrainingStore();
  const currentStep = useCurrentStep();

  if (!currentDrill) {
    return null;
  }

  return (
    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {currentStepIndex + 1}/{currentDrill.steps.length}
            </Badge>
            <span className="text-sm font-medium">{currentDrill.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {playbackState === "playing" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {playbackState === "completed" && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {mode === "assessment" && (
              <Badge variant="secondary" className="text-xs">
                Assessment Mode
              </Badge>
            )}
          </div>
        </div>

        <Progress value={drillProgress} className="h-1.5 mb-3" />

        {currentStep && (
          <div className="space-y-2">
            {/* Current action */}
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">{currentStep.action}</p>
            </div>

            {/* Component indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Component:</span>
              <Badge variant="secondary" className="text-xs">
                {currentStep.component.charAt(0).toUpperCase() +
                  currentStep.component.slice(1)}
              </Badge>
            </div>

            {/* Safety warning */}
            {currentStep.safetyWarning && (
              <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {currentStep.safetyWarning}
                </p>
              </div>
            )}
          </div>
        )}

        {playbackState === "completed" && (
          <div className="mt-3 text-center">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Drill completed successfully!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
