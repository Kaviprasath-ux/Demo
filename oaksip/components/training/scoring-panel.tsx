"use client";

import { useTrainingStore } from "@/lib/training-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Crosshair,
  TrendingUp,
  RotateCcw,
  Award,
  Flame,
} from "lucide-react";

export function ScoringPanel() {
  const {
    shootingScore,
    resetShootingScore,
    getGunSystemInfo,
  } = useTrainingStore();

  const gunSystem = getGunSystemInfo();
  const { totalShots, hits, misses, points, accuracy, bestStreak, currentStreak } = shootingScore;

  // Calculate rating based on accuracy
  const getRating = () => {
    if (totalShots < 3) return { label: "Not Rated", color: "text-muted-foreground" };
    if (accuracy >= 90) return { label: "Expert", color: "text-yellow-500" };
    if (accuracy >= 75) return { label: "Sharpshooter", color: "text-blue-500" };
    if (accuracy >= 60) return { label: "Marksman", color: "text-green-500" };
    if (accuracy >= 40) return { label: "Qualified", color: "text-orange-500" };
    return { label: "Needs Practice", color: "text-red-500" };
  };

  const rating = getRating();

  return (
    <Card className="bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Shooting Score
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={resetShootingScore}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current weapon */}
        <div className="text-xs text-muted-foreground">
          Training: <span className="font-medium text-foreground">{gunSystem?.name || "Unknown"}</span>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded">
            <div className="text-2xl font-bold text-foreground">{totalShots}</div>
            <div className="text-[10px] text-muted-foreground">Shots</div>
          </div>
          <div className="p-2 bg-green-500/10 rounded">
            <div className="text-2xl font-bold text-green-600">{hits}</div>
            <div className="text-[10px] text-muted-foreground">Hits</div>
          </div>
          <div className="p-2 bg-red-500/10 rounded">
            <div className="text-2xl font-bold text-red-600">{misses}</div>
            <div className="text-[10px] text-muted-foreground">Misses</div>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Accuracy</span>
            <span className="font-medium">{accuracy.toFixed(1)}%</span>
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        {/* Points */}
        <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Total Points</span>
          </div>
          <span className="text-xl font-bold text-primary">{points}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-muted-foreground">Current Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentStreak >= 3 ? "default" : "secondary"}>
              {currentStreak}
            </Badge>
            <span className="text-xs text-muted-foreground">
              (Best: {bestStreak})
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
          <span className="text-sm text-muted-foreground">Rating</span>
          <span className={`text-sm font-bold ${rating.color}`}>
            {rating.label}
          </span>
        </div>

        {/* Quick tips based on performance */}
        {totalShots >= 5 && accuracy < 50 && (
          <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-700">
            <strong>Tip:</strong> Focus on breathing control and trigger squeeze. Take your time with each shot.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact inline score display
export function ScoreDisplay() {
  const { shootingScore } = useTrainingStore();
  const { totalShots, hits, accuracy, points } = shootingScore;

  if (totalShots === 0) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-black/70 rounded-full text-white text-xs">
      <div className="flex items-center gap-1">
        <Crosshair className="h-3 w-3" />
        <span>{hits}/{totalShots}</span>
      </div>
      <div className="w-px h-3 bg-white/30" />
      <div className="flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        <span>{accuracy.toFixed(0)}%</span>
      </div>
      <div className="w-px h-3 bg-white/30" />
      <div className="flex items-center gap-1">
        <Target className="h-3 w-3 text-yellow-400" />
        <span className="font-bold">{points}</span>
      </div>
    </div>
  );
}
