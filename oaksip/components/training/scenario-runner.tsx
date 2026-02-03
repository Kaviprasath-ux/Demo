"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Medal,
  Crosshair,
  Users,
  Skull,
} from "lucide-react";
import { useTrainingStore } from "@/lib/training-store";
import {
  type TrainingScenario,
  type ScenarioTarget,
  getScenarioById,
  calculateMedal,
} from "@/lib/training-scenarios";

interface ScenarioRunnerProps {
  scenarioId: string;
  onComplete: (result: ScenarioResult) => void;
  onCancel: () => void;
}

export interface ScenarioResult {
  scenarioId: string;
  score: number;
  medal: "none" | "bronze" | "silver" | "gold";
  passed: boolean;
  timeElapsed: number;
  targetsHit: number;
  totalTargets: number;
  accuracy: number;
  civilianCasualties: number;
  objectivesCompleted: string[];
}

export function ScenarioRunner({ scenarioId, onComplete, onCancel }: ScenarioRunnerProps) {
  const scenario = getScenarioById(scenarioId);
  const { triggerFiring, shootingScore, resetShootingScore } = useTrainingStore();

  const [phase, setPhase] = useState<"briefing" | "running" | "paused" | "complete">("briefing");
  const [timeRemaining, setTimeRemaining] = useState(scenario?.timeLimit || 60);
  const [activeTargets, setActiveTargets] = useState<ScenarioTarget[]>([]);
  const [hitTargets, setHitTargets] = useState<string[]>([]);
  const [civilianHits, setCivilianHits] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Initialize scenario
  useEffect(() => {
    if (scenario) {
      setTimeRemaining(scenario.timeLimit);
      resetShootingScore();
    }
  }, [scenario, resetShootingScore]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "running") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setPhase("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Update active targets based on time
  useEffect(() => {
    if (phase !== "running" || !scenario) return;

    const elapsed = scenario.timeLimit - timeRemaining;

    const nowActive = scenario.targets.filter((t) => {
      const appeared = (t.appearTime || 0) <= elapsed;
      const notDisappeared = !t.disappearTime || t.disappearTime > elapsed;
      const notHit = !hitTargets.includes(t.id) && !civilianHits.includes(t.id);
      return appeared && notDisappeared && notHit;
    });

    setActiveTargets(nowActive);
  }, [phase, timeRemaining, scenario, hitTargets, civilianHits]);

  // Handle fire action
  const handleFire = useCallback(() => {
    if (phase !== "running" || activeTargets.length === 0) {
      triggerFiring();
      return;
    }

    triggerFiring();

    // Simulate hitting a random active target (simplified - in real implementation would use ray casting)
    const hitChance = Math.random();
    if (hitChance > 0.3) {
      // 70% chance to hit an active target
      const targetIndex = Math.floor(Math.random() * activeTargets.length);
      const hitTarget = activeTargets[targetIndex];

      if (hitTarget.type === "civilian") {
        setCivilianHits((prev) => [...prev, hitTarget.id]);
        setScore((prev) => prev + (hitTarget.penalty || -500));
      } else {
        setHitTargets((prev) => [...prev, hitTarget.id]);
        setScore((prev) => prev + hitTarget.points);
      }
    }
  }, [phase, activeTargets, triggerFiring]);

  // Calculate results
  const calculateResults = useCallback((): ScenarioResult => {
    if (!scenario) {
      return {
        scenarioId,
        score: 0,
        medal: "none",
        passed: false,
        timeElapsed: 0,
        targetsHit: 0,
        totalTargets: 0,
        accuracy: 0,
        civilianCasualties: 0,
        objectivesCompleted: [],
      };
    }

    const hostileTargets = scenario.targets.filter((t) => t.type !== "civilian");
    const targetsHit = hitTargets.length;
    const totalTargets = hostileTargets.length;
    const accuracy = shootingScore.totalShots > 0 ? shootingScore.accuracy : 0;
    const civilianCasualties = civilianHits.length;
    const timeElapsed = scenario.timeLimit - timeRemaining;

    // Calculate objective completion
    const objectivesCompleted: string[] = [];
    let bonusPoints = 0;

    scenario.objectives.forEach((obj) => {
      let completed = false;

      switch (obj.type) {
        case "hit_targets":
          completed = targetsHit >= (obj.targetCount || 0);
          break;
        case "accuracy":
          completed = accuracy >= (obj.accuracyThreshold || 0);
          break;
        case "time":
          completed = timeElapsed <= (obj.timeLimit || scenario.timeLimit);
          break;
        case "no_civilians":
          completed = civilianCasualties === 0;
          break;
      }

      if (completed) {
        objectivesCompleted.push(obj.id);
        bonusPoints += obj.points;
      }
    });

    const finalScore = score + bonusPoints;
    const medal = calculateMedal(finalScore, scenario.medalThresholds);
    const passed = finalScore >= scenario.passingScore;

    return {
      scenarioId,
      score: finalScore,
      medal,
      passed,
      timeElapsed,
      targetsHit,
      totalTargets,
      accuracy,
      civilianCasualties,
      objectivesCompleted,
    };
  }, [scenario, scenarioId, hitTargets, civilianHits, shootingScore, score, timeRemaining]);

  // Handle completion
  useEffect(() => {
    if (phase === "complete") {
      const results = calculateResults();
      onComplete(results);
    }
  }, [phase, calculateResults, onComplete]);

  if (!scenario) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Scenario not found</p>
        </CardContent>
      </Card>
    );
  }

  const hostileTargets = scenario.targets.filter((t) => t.type !== "civilian");
  const progressPercent = ((scenario.timeLimit - timeRemaining) / scenario.timeLimit) * 100;

  // Briefing Phase
  if (phase === "briefing") {
    return (
      <Card className="border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {scenario.name}
            </CardTitle>
            <Badge variant={
              scenario.difficulty === "beginner" ? "secondary" :
              scenario.difficulty === "intermediate" ? "default" :
              scenario.difficulty === "advanced" ? "destructive" :
              "outline"
            }>
              {scenario.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Briefing */}
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Mission Briefing
            </h4>
            <p className="text-sm text-muted-foreground">{scenario.briefing}</p>
          </div>

          {/* Objectives */}
          <div>
            <h4 className="font-medium text-sm mb-2">Objectives</h4>
            <ul className="space-y-1">
              {scenario.objectives.map((obj) => (
                <li key={obj.id} className="text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                  <span>{obj.description}</span>
                  <Badge variant="outline" className="text-[10px] ml-auto">
                    +{obj.points}pts
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted/30 rounded">
              <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{scenario.timeLimit}s</p>
              <p className="text-[10px] text-muted-foreground">Time Limit</p>
            </div>
            <div className="p-2 bg-muted/30 rounded">
              <Crosshair className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{hostileTargets.length}</p>
              <p className="text-[10px] text-muted-foreground">Targets</p>
            </div>
            <div className="p-2 bg-muted/30 rounded">
              <Trophy className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{scenario.passingScore}</p>
              <p className="text-[10px] text-muted-foreground">Pass Score</p>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-medium text-sm mb-2">Tips</h4>
            <ul className="space-y-1">
              {scenario.tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setPhase("running")} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Mission
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Running/Paused Phase
  return (
    <Card className={phase === "paused" ? "border-yellow-500/50" : "border-red-500/50"}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {phase === "paused" ? (
              <Pause className="h-4 w-4 text-yellow-500" />
            ) : (
              <Target className="h-4 w-4 text-red-500 animate-pulse" />
            )}
            {scenario.name}
          </CardTitle>
          <Badge variant={phase === "paused" ? "secondary" : "destructive"}>
            {phase === "paused" ? "PAUSED" : "LIVE"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Timer */}
        <div className="text-center">
          <div className={`text-4xl font-mono font-bold ${timeRemaining <= 10 ? "text-red-500 animate-pulse" : ""}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
          </div>
          <Progress value={progressPercent} className="h-2 mt-2" />
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-green-500/10 rounded">
            <p className="text-lg font-bold text-green-600">{hitTargets.length}</p>
            <p className="text-[10px] text-muted-foreground">Hits</p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded">
            <p className="text-lg font-bold text-blue-600">{activeTargets.length}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="p-2 bg-yellow-500/10 rounded">
            <p className="text-lg font-bold text-yellow-600">{score}</p>
            <p className="text-[10px] text-muted-foreground">Score</p>
          </div>
          <div className="p-2 bg-red-500/10 rounded">
            <p className="text-lg font-bold text-red-600">{civilianHits.length}</p>
            <p className="text-[10px] text-muted-foreground">Civ Hits</p>
          </div>
        </div>

        {/* Active Targets */}
        {activeTargets.length > 0 && (
          <div className="p-2 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground mb-1">Active Targets:</p>
            <div className="flex flex-wrap gap-1">
              {activeTargets.map((t) => (
                <Badge
                  key={t.id}
                  variant={t.type === "civilian" ? "secondary" : "destructive"}
                  className="text-[10px]"
                >
                  {t.type === "civilian" ? (
                    <Users className="h-3 w-3 mr-1" />
                  ) : (
                    <Skull className="h-3 w-3 mr-1" />
                  )}
                  {t.distance}m
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Civilian Warning */}
        {activeTargets.some((t) => t.type === "civilian") && (
          <div className="p-2 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-yellow-700 font-medium">CIVILIANS PRESENT - CHECK TARGETS</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleFire}
            disabled={phase === "paused"}
            variant="destructive"
            className="flex-1"
          >
            <Crosshair className="h-4 w-4 mr-2" />
            FIRE
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPhase(phase === "paused" ? "running" : "paused")}
          >
            {phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPhase("complete")}
            title="End Mission"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Results display component
interface ScenarioResultsProps {
  result: ScenarioResult;
  scenario: TrainingScenario;
  onRetry: () => void;
  onBack: () => void;
}

export function ScenarioResults({ result, scenario, onRetry, onBack }: ScenarioResultsProps) {
  const medalColors = {
    none: "text-gray-400",
    bronze: "text-amber-600",
    silver: "text-gray-400",
    gold: "text-yellow-500",
  };

  const medalBgs = {
    none: "bg-gray-500/10",
    bronze: "bg-amber-500/10",
    silver: "bg-gray-400/10",
    gold: "bg-yellow-500/10",
  };

  return (
    <Card className={result.passed ? "border-green-500/50" : "border-red-500/50"}>
      <CardHeader className="pb-2 text-center">
        <div className={`mx-auto w-16 h-16 rounded-full ${medalBgs[result.medal]} flex items-center justify-center mb-2`}>
          {result.passed ? (
            <Medal className={`h-8 w-8 ${medalColors[result.medal]}`} />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
        </div>
        <CardTitle className="text-lg">
          {result.passed ? "Mission Complete!" : "Mission Failed"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{scenario.name}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-4xl font-bold">{result.score}</p>
          <p className="text-sm text-muted-foreground">
            {result.passed ? `Pass: ${scenario.passingScore}` : `Needed: ${scenario.passingScore}`}
          </p>
          {result.medal !== "none" && (
            <Badge className={`mt-2 ${medalBgs[result.medal]} ${medalColors[result.medal]} border-0`}>
              {result.medal.toUpperCase()} MEDAL
            </Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="text-lg font-bold">{result.targetsHit}/{result.totalTargets}</p>
            <p className="text-[10px] text-muted-foreground">Targets Hit</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="text-lg font-bold">{result.accuracy.toFixed(0)}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <p className="text-lg font-bold">{result.timeElapsed}s</p>
            <p className="text-[10px] text-muted-foreground">Time</p>
          </div>
          <div className={`p-2 rounded text-center ${result.civilianCasualties > 0 ? "bg-red-500/10" : "bg-green-500/10"}`}>
            <p className={`text-lg font-bold ${result.civilianCasualties > 0 ? "text-red-600" : "text-green-600"}`}>
              {result.civilianCasualties}
            </p>
            <p className="text-[10px] text-muted-foreground">Civ Casualties</p>
          </div>
        </div>

        {/* Objectives */}
        <div>
          <h4 className="font-medium text-sm mb-2">Objectives</h4>
          <ul className="space-y-1">
            {scenario.objectives.map((obj) => {
              const completed = result.objectivesCompleted.includes(obj.id);
              return (
                <li key={obj.id} className="text-xs flex items-center gap-2">
                  {completed ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span className={completed ? "" : "text-muted-foreground line-through"}>
                    {obj.description}
                  </span>
                  <Badge variant={completed ? "default" : "secondary"} className="text-[10px] ml-auto">
                    {completed ? `+${obj.points}` : "0"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button onClick={onBack} className="flex-1">
            Back to Scenarios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
