"use client";

import { useState } from "react";
import {
  useTrainingStore,
  terrainConfigs,
  weatherConfigs,
} from "@/lib/training-store";
import { allMissionScenarios, type MissionScenario } from "@/lib/gun-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Clock,
  Mountain,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Play,
  Square,
  ChevronDown,
  ChevronUp,
  Users,
  Shield,
  Crosshair,
  MapPin,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const difficultyConfig = {
  beginner: { label: "Beginner", color: "text-green-500", bg: "bg-green-500/10" },
  intermediate: { label: "Intermediate", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  advanced: { label: "Advanced", color: "text-orange-500", bg: "bg-orange-500/10" },
  expert: { label: "Expert", color: "text-red-500", bg: "bg-red-500/10" },
};

const objectiveTypeConfig = {
  destroy_target: { icon: Target, label: "Destroy", color: "text-red-500" },
  suppression: { icon: Flame, label: "Suppress", color: "text-orange-500" },
  illumination: { icon: Flame, label: "Illuminate", color: "text-yellow-500" },
  smoke: { icon: Cloud, label: "Smoke", color: "text-gray-500" },
  defense: { icon: Shield, label: "Defend", color: "text-blue-500" },
};

// Scenario card for selection
function ScenarioCard({
  scenario,
  onSelect,
  isSelected,
}: {
  scenario: MissionScenario;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const difficulty = difficultyConfig[scenario.difficulty];

  return (
    <Card
      className={cn(
        "border-border/50 cursor-pointer transition-all",
        isSelected && "border-primary ring-1 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{scenario.name}</h3>
              <p className="text-xs text-muted-foreground">{scenario.description}</p>
            </div>
            <Badge className={cn("text-xs", difficulty.color, difficulty.bg)}>
              {difficulty.label}
            </Badge>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {scenario.estimatedTime} min
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {scenario.objectives.length} objectives
            </span>
            <Badge variant="secondary" className="text-xs">
              <Mountain className="h-3 w-3 mr-1" />
              {terrainConfigs[scenario.terrain as keyof typeof terrainConfigs]?.label}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Cloud className="h-3 w-3 mr-1" />
              {weatherConfigs[scenario.weather as keyof typeof weatherConfigs]?.label}
            </Badge>
          </div>

          {/* Expand details */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Hide Details" : "View Briefing"}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          {expanded && (
            <div className="space-y-3 pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
              {/* Briefing */}
              <div className="p-2 bg-muted/50 rounded text-xs">
                <p className="font-medium mb-1">Mission Briefing:</p>
                <p className="text-muted-foreground">{scenario.briefing}</p>
              </div>

              {/* Tactical Context */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {scenario.enemySituation && (
                  <div className="p-2 bg-red-500/10 rounded">
                    <p className="font-medium text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Enemy
                    </p>
                    <p className="text-muted-foreground mt-1">{scenario.enemySituation}</p>
                  </div>
                )}
                {scenario.friendlySituation && (
                  <div className="p-2 bg-blue-500/10 rounded">
                    <p className="font-medium text-blue-500 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Friendly
                    </p>
                    <p className="text-muted-foreground mt-1">{scenario.friendlySituation}</p>
                  </div>
                )}
              </div>

              {/* Objectives */}
              <div>
                <p className="text-xs font-medium mb-2">Objectives:</p>
                <div className="space-y-1">
                  {scenario.objectives.map((obj, idx) => {
                    const typeConfig = objectiveTypeConfig[obj.type];
                    return (
                      <div key={obj.id} className="flex items-center gap-2 text-xs p-1.5 bg-muted/30 rounded">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <typeConfig.icon className={cn("h-3 w-3", typeConfig.color)} />
                        <span className="flex-1">{obj.description}</span>
                        {obj.timeLimit && (
                          <span className="text-muted-foreground">{Math.floor(obj.timeLimit / 60)}m</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score info */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                <span className="text-muted-foreground">
                  Max Score: <span className="font-medium text-foreground">{scenario.maxScore}</span>
                </span>
                <span className="text-muted-foreground">
                  Pass: <span className="font-medium text-green-500">{scenario.passingScore}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Active scenario display
function ActiveScenarioView() {
  const { activeScenario, scenarioSession, endScenario, fireRound, completeObjective } = useTrainingStore();

  if (!activeScenario || !scenarioSession) return null;

  const currentObjective = activeScenario.objectives[scenarioSession.currentObjectiveIndex];
  const progress = (scenarioSession.objectiveProgress.filter((p) => p.completed).length / scenarioSession.objectiveProgress.length) * 100;

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-primary" />
            {activeScenario.name}
          </span>
          <Badge variant="outline" className={scenarioSession.isActive ? "text-green-500" : "text-muted-foreground"}>
            {scenarioSession.isActive ? "Active" : "Complete"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Mission Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current objective */}
        {currentObjective && scenarioSession.isActive && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="text-xs">Current Objective</Badge>
              <span className="text-xs text-muted-foreground">
                {scenarioSession.currentObjectiveIndex + 1} of {activeScenario.objectives.length}
              </span>
            </div>
            <p className="text-sm font-medium">{currentObjective.description}</p>
            {currentObjective.targetCoordinates && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Grid: {currentObjective.targetCoordinates.grid} | Distance: {currentObjective.targetCoordinates.distance}m
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{currentObjective.successCriteria}</p>

            {/* Quick actions */}
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={fireRound}>
                <Flame className="h-3 w-3 mr-1" />
                Fire Round ({scenarioSession.roundsFired})
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => completeObjective(currentObjective.id, 25)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Button>
            </div>
          </div>
        )}

        {/* Objectives list */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">All Objectives:</p>
          {activeScenario.objectives.map((obj, idx) => {
            const objProgress = scenarioSession.objectiveProgress.find((p) => p.objectiveId === obj.id);
            const typeConfig = objectiveTypeConfig[obj.type];
            const isCurrent = idx === scenarioSession.currentObjectiveIndex && scenarioSession.isActive;

            return (
              <div
                key={obj.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded text-xs",
                  objProgress?.completed ? "bg-green-500/10" : isCurrent ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                )}
              >
                {objProgress?.completed ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <typeConfig.icon className={cn("h-3 w-3", typeConfig.color)} />
                )}
                <span className={cn("flex-1", objProgress?.completed && "line-through text-muted-foreground")}>
                  {obj.description}
                </span>
                {objProgress?.completed && (
                  <Badge variant="outline" className="text-[10px] text-green-500">
                    +{objProgress.score}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{scenarioSession.roundsFired}</p>
            <p className="text-[10px] text-muted-foreground">Rounds Fired</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{scenarioSession.totalScore}</p>
            <p className="text-[10px] text-muted-foreground">Score</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{activeScenario.maxScore}</p>
            <p className="text-[10px] text-muted-foreground">Max Score</p>
          </div>
        </div>

        {/* End mission button */}
        {scenarioSession.isActive && (
          <Button variant="destructive" size="sm" className="w-full" onClick={endScenario}>
            <Square className="h-3 w-3 mr-1" />
            End Mission
          </Button>
        )}

        {/* Results */}
        {!scenarioSession.isActive && (
          <div className="p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm font-medium">Mission Complete!</p>
            <p className="text-2xl font-bold text-primary mt-1">{scenarioSession.totalScore} pts</p>
            <p className="text-xs text-muted-foreground">
              {scenarioSession.totalScore >= activeScenario.passingScore ? (
                <span className="text-green-500">PASSED</span>
              ) : (
                <span className="text-red-500">BELOW PASSING ({activeScenario.passingScore} required)</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main scenario panel
export function ScenarioPanel() {
  const { activeScenario, startScenario } = useTrainingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredScenarios =
    filter === "all"
      ? allMissionScenarios
      : allMissionScenarios.filter((s) => s.difficulty === filter);

  // If a scenario is active, show the active view
  if (activeScenario) {
    return <ActiveScenarioView />;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="h-4 w-4" />
          Mission Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter */}
        <div className="flex gap-1 flex-wrap">
          {["all", "beginner", "intermediate", "advanced", "expert"].map((level) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              size="sm"
              className="text-xs h-6 px-2"
              onClick={() => setFilter(level)}
            >
              {level === "all" ? "All" : difficultyConfig[level as keyof typeof difficultyConfig].label}
            </Button>
          ))}
        </div>

        {/* Scenario list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isSelected={selectedId === scenario.id}
              onSelect={() => setSelectedId(scenario.id)}
            />
          ))}
        </div>

        {/* Start button */}
        {selectedId && (
          <Button className="w-full" onClick={() => startScenario(selectedId)}>
            <Play className="h-4 w-4 mr-1" />
            Start Mission
          </Button>
        )}

        {filteredScenarios.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scenarios found for this difficulty.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
