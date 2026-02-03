"use client";

import { useEffect, useState } from "react";
import { useTrainingStore } from "@/lib/training-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CertificateGenerator } from "./certificate-generator";
import { soundEffects } from "@/lib/sound-effects";
import {
  Timer,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target,
  Clock,
  Award,
} from "lucide-react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function getScoreGrade(score: number): string {
  if (score >= 90) return "EXCELLENT";
  if (score >= 80) return "VERY GOOD";
  if (score >= 70) return "GOOD";
  if (score >= 60) return "SATISFACTORY";
  if (score >= 50) return "NEEDS IMPROVEMENT";
  return "UNSATISFACTORY";
}

export function AssessmentPanel() {
  const {
    mode,
    assessmentScore,
    assessmentErrors,
    assessmentStartTime,
    assessmentEndTime,
    playbackState,
    currentDrill,
    drillProgress,
    soundEnabled,
  } = useTrainingStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [soundPlayed, setSoundPlayed] = useState(false);

  // Update timer every second
  useEffect(() => {
    if (mode !== "assessment" || !assessmentStartTime) return;

    const interval = setInterval(() => {
      if (assessmentEndTime) {
        setElapsedTime(Math.floor((assessmentEndTime - assessmentStartTime) / 1000));
      } else {
        setElapsedTime(Math.floor((Date.now() - assessmentStartTime) / 1000));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [mode, assessmentStartTime, assessmentEndTime]);

  // Play completion sound
  useEffect(() => {
    if (playbackState === "completed" && soundEnabled && !soundPlayed) {
      soundEffects.playSuccess();
      setSoundPlayed(true);
    }
    if (playbackState !== "completed") {
      setSoundPlayed(false);
    }
  }, [playbackState, soundEnabled, soundPlayed]);

  // Don't show if not in assessment mode
  if (mode !== "assessment") return null;

  // Show minimal panel when no drill is active
  if (!currentDrill) {
    return (
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-500">Assessment Mode Active</h3>
              <p className="text-xs text-muted-foreground">
                Select a drill to begin your timed assessment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Completion panel
  if (playbackState === "completed") {
    const timeBonus = currentDrill.estimatedTime > elapsedTime ? 10 : 0;
    const finalScore = Math.min(100, assessmentScore + timeBonus);

    return (
      <Card className="bg-gradient-to-r from-primary/10 to-green-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/20 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-primary">Assessment Complete!</h3>
              <p className="text-sm text-muted-foreground">{currentDrill.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(finalScore)}`}>
                  {finalScore}%
                </div>
                <div className="text-xs text-muted-foreground">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-xs text-muted-foreground">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {assessmentErrors.length}
                </div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>

            <Badge
              className={`text-sm px-4 py-1 ${
                finalScore >= 70
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {finalScore >= 70 ? (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              {getScoreGrade(finalScore)}
            </Badge>

            {timeBonus > 0 && (
              <p className="text-xs text-green-500">
                +{timeBonus} bonus points for fast completion!
              </p>
            )}

            {assessmentErrors.length > 0 && (
              <div className="text-left bg-red-500/10 rounded-lg p-3">
                <p className="text-xs font-medium text-red-500 mb-1">Errors:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {assessmentErrors.slice(0, 3).map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                  {assessmentErrors.length > 3 && (
                    <li>• +{assessmentErrors.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            {/* Certificate Generator - only for passing scores */}
            {finalScore >= 60 && (
              <div className="pt-2">
                <CertificateGenerator
                  drillName={currentDrill.name}
                  score={finalScore}
                  timeElapsed={elapsedTime}
                  errors={assessmentErrors.length}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active assessment panel
  return (
    <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Assessment in Progress</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {currentDrill.name}
            </Badge>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Timer */}
            <div className="bg-background/50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Timer className="h-3 w-3" />
                <span className="text-xs">Time</span>
              </div>
              <div className="text-lg font-mono font-bold">
                {formatTime(elapsedTime)}
              </div>
              {currentDrill.estimatedTime && (
                <div className="text-xs text-muted-foreground">
                  Target: {formatTime(currentDrill.estimatedTime)}
                </div>
              )}
            </div>

            {/* Score */}
            <div className="bg-background/50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Target className="h-3 w-3" />
                <span className="text-xs">Score</span>
              </div>
              <div className={`text-lg font-bold ${getScoreColor(assessmentScore)}`}>
                {assessmentScore}%
              </div>
              <Progress
                value={assessmentScore}
                className="h-1 mt-1"
              />
            </div>

            {/* Errors */}
            <div className="bg-background/50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs">Errors</span>
              </div>
              <div className={`text-lg font-bold ${assessmentErrors.length > 0 ? "text-red-500" : "text-green-500"}`}>
                {assessmentErrors.length}
              </div>
              <div className="text-xs text-muted-foreground">
                -10 per error
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(drillProgress)}%</span>
            </div>
            <Progress value={drillProgress} className="h-2" />
          </div>

          {/* Warning if timer not started */}
          {!assessmentStartTime && (
            <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 rounded-lg p-2">
              <Clock className="h-4 w-4" />
              <span>Press Play to start the timer</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
