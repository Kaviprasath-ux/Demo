"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Box,
  CheckCircle,
  Target,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  PROGRESSION_LEVELS,
  useProgressionStore,
  getProgressToNextLevel,
  type ProgressionLevel,
} from "@/lib/progression-model";

const levelIcons: Record<number, React.ReactNode> = {
  1: <BookOpen className="h-5 w-5" />,
  2: <Brain className="h-5 w-5" />,
  3: <Box className="h-5 w-5" />,
  4: <CheckCircle className="h-5 w-5" />,
  5: <Target className="h-5 w-5" />,
};

interface TraineeProgressionCardProps {
  odNumber?: string;
}

export function TraineeProgressionCard({ odNumber = "OD-2024-001" }: TraineeProgressionCardProps) {
  const { getCadetProgress } = useProgressionStore();
  const progress = getCadetProgress(odNumber);

  if (!progress) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Cadet not found</p>
        </CardContent>
      </Card>
    );
  }

  const currentLevelData = PROGRESSION_LEVELS[progress.currentLevel];
  const nextLevelProgress = getProgressToNextLevel(progress);
  const isMaxLevel = progress.currentLevel >= 5;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            My Progression
          </CardTitle>
          <Badge
            variant="outline"
            className="text-sm font-bold px-3 py-1"
            style={{ borderColor: currentLevelData.color, color: currentLevelData.color }}
          >
            Level {progress.currentLevel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Level Banner */}
        <div
          className="p-4 rounded-lg border-2"
          style={{ borderColor: currentLevelData.color, backgroundColor: `${currentLevelData.color}15` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: currentLevelData.color }}
            >
              <span className="text-white">{levelIcons[progress.currentLevel]}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{currentLevelData.name}</h3>
              <p className="text-sm text-muted-foreground">{currentLevelData.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{progress.drillsCompleted}</p>
            <p className="text-xs text-muted-foreground">Drills Done</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{progress.totalAccuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold flex items-center justify-center gap-1">
              {progress.safetyViolations === 0 ? (
                <Shield className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              {progress.safetyViolations}
            </p>
            <p className="text-xs text-muted-foreground">Violations</p>
          </div>
        </div>

        {/* Next Level Progress */}
        {!isMaxLevel && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress to Level {progress.currentLevel + 1}</span>
              <span className="text-muted-foreground">{nextLevelProgress.percentage}%</span>
            </div>
            <Progress value={nextLevelProgress.percentage} className="h-3" />
            <div className="flex flex-wrap gap-2 mt-2">
              {nextLevelProgress.drillsNeeded > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {nextLevelProgress.drillsNeeded} more drills needed
                </Badge>
              )}
              {nextLevelProgress.accuracyNeeded > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Need {nextLevelProgress.accuracyNeeded}% more accuracy
                </Badge>
              )}
              {nextLevelProgress.safetyGap > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {nextLevelProgress.safetyGap} excess violations
                </Badge>
              )}
            </div>
          </div>
        )}

        {isMaxLevel && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <Award className="h-8 w-8 mx-auto text-amber-500 mb-2" />
            <p className="font-bold text-amber-600">Maximum Level Achieved!</p>
            <p className="text-sm text-muted-foreground">You have mastered tactical reasoning</p>
          </div>
        )}

        {/* AI Unlocks */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Unlock className="h-4 w-4 text-green-500" />
            AI Features Unlocked
          </h4>
          <div className="grid gap-1">
            {currentLevelData.aiUnlocks.map((unlock, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                {unlock}
              </div>
            ))}
          </div>
        </div>

        {/* Locked Features (Next Level) */}
        {!isMaxLevel && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Unlock at Level {progress.currentLevel + 1}
            </h4>
            <div className="grid gap-1 opacity-60">
              {PROGRESSION_LEVELS[(progress.currentLevel + 1) as ProgressionLevel].aiUnlocks
                .slice(0, 3)
                .map((unlock, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-3 w-3 flex-shrink-0" />
                    {unlock}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Safety Clearance */}
        <div className="p-3 border rounded-lg">
          <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            Safety Clearance Status
          </h4>
          <div className="space-y-1">
            {currentLevelData.safetyGates.map((gate, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-muted-foreground">{gate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Certifications:</span>
          {[1, 2, 3, 4, 5].map((level) => (
            <Badge
              key={level}
              variant={progress.certifications.includes(level) ? "default" : "outline"}
              className={`${
                progress.certifications.includes(level)
                  ? ""
                  : "opacity-40"
              }`}
              style={{
                backgroundColor: progress.certifications.includes(level)
                  ? PROGRESSION_LEVELS[level as ProgressionLevel].color
                  : undefined,
              }}
            >
              L{level}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for sidebar/header
export function ProgressionBadge({ odNumber = "OD-2024-001" }: { odNumber?: string }) {
  const { getCadetProgress } = useProgressionStore();
  const progress = getCadetProgress(odNumber);

  if (!progress) return null;

  const levelData = PROGRESSION_LEVELS[progress.currentLevel];

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium"
      style={{ backgroundColor: levelData.color }}
    >
      {levelIcons[progress.currentLevel]}
      <span>Level {progress.currentLevel}: {levelData.name}</span>
    </div>
  );
}
