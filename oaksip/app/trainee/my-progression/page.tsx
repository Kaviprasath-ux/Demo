"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  ChevronRight,
  Clock,
  Crosshair,
  Star,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PROGRESSION_LEVELS,
  useProgressionStore,
  getProgressToNextLevel,
  type ProgressionLevel,
} from "@/lib/progression-model";

const levelIcons: Record<number, React.ReactNode> = {
  1: <BookOpen className="h-6 w-6" />,
  2: <Brain className="h-6 w-6" />,
  3: <Box className="h-6 w-6" />,
  4: <CheckCircle className="h-6 w-6" />,
  5: <Target className="h-6 w-6" />,
};

export default function MyProgressionPage() {
  const router = useRouter();
  const { getCadetProgress } = useProgressionStore();

  // In real app, get from auth context
  const odNumber = "OD-2024-001";
  const progress = getCadetProgress(odNumber);

  if (!progress) {
    return (
      <RouteGuard requiredRoles={["trainee"]}>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Progression data not found</p>
        </div>
      </RouteGuard>
    );
  }

  const currentLevelData = PROGRESSION_LEVELS[progress.currentLevel];
  const nextLevelProgress = getProgressToNextLevel(progress);
  const isMaxLevel = progress.currentLevel >= 5;

  return (
    <RouteGuard requiredRoles={["trainee"]}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            My Training Journey
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progression through the 5 levels of artillery training mastery
          </p>
        </div>

        {/* Journey Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Progression Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between relative">
              {/* Connection line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-muted -z-10" />
              <div
                className="absolute top-6 left-0 h-1 bg-primary -z-10 transition-all"
                style={{ width: `${((progress.currentLevel - 1) / 4) * 100}%` }}
              />

              {([1, 2, 3, 4, 5] as ProgressionLevel[]).map((level) => {
                const levelData = PROGRESSION_LEVELS[level];
                const isCompleted = level < progress.currentLevel;
                const isCurrent = level === progress.currentLevel;
                const isLocked = level > progress.currentLevel;

                return (
                  <div key={level} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                        isCompleted
                          ? "bg-primary border-primary text-white"
                          : isCurrent
                          ? "bg-white border-primary text-primary"
                          : "bg-muted border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{level}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-2 text-center max-w-[80px] ${
                      isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                    }`}>
                      {levelData.name}
                    </p>
                    {isCurrent && (
                      <Badge className="mt-1 text-xs">Current</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Level Details */}
        <Card className="border-2" style={{ borderColor: currentLevelData.color }}>
          <CardHeader style={{ backgroundColor: `${currentLevelData.color}15` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: currentLevelData.color }}
                >
                  {levelIcons[progress.currentLevel]}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <CardTitle className="text-2xl">
                    Level {progress.currentLevel}: {currentLevelData.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {currentLevelData.description}
                  </p>
                </div>
              </div>
              {isMaxLevel && (
                <div className="text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto" />
                  <p className="text-sm font-bold text-yellow-600">Master</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Requirements Status */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Requirements Met
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Crosshair className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Drills Completed</p>
                        <p className="text-sm text-muted-foreground">
                          Required: {currentLevelData.requirements.drillsCompleted}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-500">{progress.drillsCompleted}</p>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Accuracy</p>
                        <p className="text-sm text-muted-foreground">
                          Required: {currentLevelData.requirements.accuracy}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-500">{progress.totalAccuracy}%</p>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Safety Violations</p>
                        <p className="text-sm text-muted-foreground">
                          Maximum allowed: {currentLevelData.requirements.safetyViolations}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        progress.safetyViolations <= currentLevelData.requirements.safetyViolations
                          ? "text-green-500"
                          : "text-red-500"
                      }`}>
                        {progress.safetyViolations}
                      </p>
                      {progress.safetyViolations <= currentLevelData.requirements.safetyViolations ? (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Features Unlocked */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Unlock className="h-5 w-5 text-green-500" />
                  AI Features You Have Access To
                </h3>
                <div className="space-y-2">
                  {currentLevelData.aiUnlocks.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold mt-6 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Safety Gates Cleared
                </h3>
                <div className="space-y-2">
                  {currentLevelData.safetyGates.map((gate, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{gate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Level Preview */}
        {!isMaxLevel && (
          <Card className="border-dashed border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Level</p>
                    <CardTitle>
                      Level {progress.currentLevel + 1}: {PROGRESSION_LEVELS[(progress.currentLevel + 1) as ProgressionLevel].name}
                    </CardTitle>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{nextLevelProgress.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={nextLevelProgress.percentage} className="h-3 mb-6" />

              <div className="grid md:grid-cols-2 gap-8">
                {/* What You Need */}
                <div>
                  <h3 className="font-semibold mb-4">What You Need to Reach Level {progress.currentLevel + 1}</h3>
                  <div className="space-y-3">
                    {nextLevelProgress.drillsNeeded > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">{nextLevelProgress.drillsNeeded} more drills</p>
                          <p className="text-sm text-muted-foreground">
                            Current: {progress.drillsCompleted} / Required: {PROGRESSION_LEVELS[(progress.currentLevel + 1) as ProgressionLevel].requirements.drillsCompleted}
                          </p>
                        </div>
                      </div>
                    )}

                    {nextLevelProgress.accuracyNeeded > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <Target className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">{nextLevelProgress.accuracyNeeded}% more accuracy</p>
                          <p className="text-sm text-muted-foreground">
                            Current: {progress.totalAccuracy}% / Required: {PROGRESSION_LEVELS[(progress.currentLevel + 1) as ProgressionLevel].requirements.accuracy}%
                          </p>
                        </div>
                      </div>
                    )}

                    {nextLevelProgress.safetyGap > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-red-600">Safety record needs improvement</p>
                          <p className="text-sm text-muted-foreground">
                            You have {nextLevelProgress.safetyGap} excess violations
                          </p>
                        </div>
                      </div>
                    )}

                    {nextLevelProgress.drillsNeeded === 0 &&
                     nextLevelProgress.accuracyNeeded === 0 &&
                     nextLevelProgress.safetyGap === 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <Zap className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-green-600">Ready for promotion!</p>
                          <p className="text-sm text-muted-foreground">
                            Contact your instructor for level assessment
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* What You'll Unlock */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    What You'll Unlock
                  </h3>
                  <div className="space-y-2">
                    {PROGRESSION_LEVELS[(progress.currentLevel + 1) as ProgressionLevel].aiUnlocks.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg opacity-70"
                      >
                        <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button size="lg" onClick={() => router.push("/training")}>
                  <Crosshair className="h-5 w-5 mr-2" />
                  Start Training to Level Up
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Levels Reference */}
        <Card>
          <CardHeader>
            <CardTitle>All 5 Levels Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {([1, 2, 3, 4, 5] as ProgressionLevel[]).map((level) => {
                const levelData = PROGRESSION_LEVELS[level];
                const isCompleted = level < progress.currentLevel;
                const isCurrent = level === progress.currentLevel;
                const isLocked = level > progress.currentLevel;

                return (
                  <div
                    key={level}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrent
                        ? "border-primary bg-primary/5"
                        : isCompleted
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border bg-muted/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                        style={isCurrent ? { backgroundColor: levelData.color } : {}}
                      >
                        {isCompleted ? <CheckCircle className="h-6 w-6" /> : levelIcons[level]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">Level {level}: {levelData.name}</h3>
                          {isCompleted && <Badge className="bg-green-500">Completed</Badge>}
                          {isCurrent && <Badge>Current</Badge>}
                          {isLocked && <Badge variant="secondary">Locked</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{levelData.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <span>
                            <strong>Drills:</strong> {levelData.requirements.drillsCompleted}
                          </span>
                          <span>
                            <strong>Accuracy:</strong> {levelData.requirements.accuracy}%
                          </span>
                          <span>
                            <strong>Max Violations:</strong> {levelData.requirements.safetyViolations}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              My Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {([1, 2, 3, 4, 5] as ProgressionLevel[]).map((level) => {
                const levelData = PROGRESSION_LEVELS[level];
                const hasCert = progress.certifications.includes(level);

                return (
                  <div
                    key={level}
                    className={`p-4 rounded-lg border-2 text-center min-w-[120px] ${
                      hasCert
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-border bg-muted/30 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        hasCert ? "bg-yellow-500 text-white" : "bg-muted"
                      }`}
                    >
                      {hasCert ? <Star className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <p className="font-semibold">Level {level}</p>
                    <p className="text-xs text-muted-foreground">{levelData.name}</p>
                    {hasCert && (
                      <Badge className="mt-2 bg-yellow-500">Certified</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
