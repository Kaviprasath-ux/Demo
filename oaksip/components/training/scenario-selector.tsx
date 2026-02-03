"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  Trophy,
  Clock,
  Crosshair,
  Shield,
  Zap,
  Brain,
  ChevronRight,
  Star,
  AlertTriangle,
} from "lucide-react";
import { useTrainingStore } from "@/lib/training-store";
import {
  trainingScenarios,
  type TrainingScenario,
  type ScenarioType,
  type ScenarioDifficulty,
  getScenariosByWeapon,
} from "@/lib/training-scenarios";
import { ScenarioRunner, ScenarioResults, type ScenarioResult } from "./scenario-runner";

const typeIcons: Record<ScenarioType, React.ReactNode> = {
  qualification: <Trophy className="h-4 w-4" />,
  combat: <Crosshair className="h-4 w-4" />,
  stress: <Zap className="h-4 w-4" />,
  decision: <Brain className="h-4 w-4" />,
};

const typeDescriptions: Record<ScenarioType, string> = {
  qualification: "Standard qualification courses to test basic proficiency",
  combat: "Simulated combat scenarios with hostiles and objectives",
  stress: "High-pressure scenarios testing reaction time and accuracy",
  decision: "Scenarios requiring target identification and judgment",
};

const difficultyColors: Record<ScenarioDifficulty, string> = {
  beginner: "bg-green-500/10 text-green-700 border-green-500/30",
  intermediate: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  advanced: "bg-orange-500/10 text-orange-700 border-orange-500/30",
  expert: "bg-red-500/10 text-red-700 border-red-500/30",
};

interface ScenarioCardProps {
  scenario: TrainingScenario;
  onSelect: () => void;
}

function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  const hostileCount = scenario.targets.filter((t) => t.type !== "civilian").length;
  const civilianCount = scenario.targets.filter((t) => t.type === "civilian").length;

  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          {typeIcons[scenario.type]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{scenario.name}</h4>
            <Badge variant="outline" className={`text-[10px] ${difficultyColors[scenario.difficulty]}`}>
              {scenario.difficulty}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {scenario.description}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {scenario.timeLimit}s
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {hostileCount} targets
            </span>
            {civilianCount > 0 && (
              <span className="flex items-center gap-1 text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                {civilianCount} civilians
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {scenario.passingScore}+ to pass
            </span>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  );
}

export function ScenarioSelector() {
  const { getGunSystemInfo } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);
  const [selectedType, setSelectedType] = useState<ScenarioType | "all">("all");

  // Get scenarios compatible with current weapon
  const weaponCategory = gunSystem?.category || "any";
  const compatibleScenarios = getScenariosByWeapon(weaponCategory);

  // Filter by type
  const filteredScenarios = selectedType === "all"
    ? compatibleScenarios
    : compatibleScenarios.filter((s) => s.type === selectedType);

  // Handle scenario completion
  const handleScenarioComplete = (result: ScenarioResult) => {
    setScenarioResult(result);
  };

  // Reset to scenario selection
  const handleBackToSelection = () => {
    setActiveScenario(null);
    setScenarioResult(null);
  };

  // Retry current scenario
  const handleRetry = () => {
    setScenarioResult(null);
  };

  // If showing results
  if (scenarioResult && activeScenario) {
    const scenario = trainingScenarios.find((s) => s.id === activeScenario);
    if (scenario) {
      return (
        <ScenarioResults
          result={scenarioResult}
          scenario={scenario}
          onRetry={handleRetry}
          onBack={handleBackToSelection}
        />
      );
    }
  }

  // If running a scenario
  if (activeScenario) {
    return (
      <ScenarioRunner
        scenarioId={activeScenario}
        onComplete={handleScenarioComplete}
        onCancel={handleBackToSelection}
      />
    );
  }

  // Scenario selection view
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Training Scenarios
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Select a scenario to practice with {gunSystem?.name || "your weapon"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Filter */}
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as ScenarioType | "all")}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
            <TabsTrigger value="qualification" className="text-[10px]">
              <Trophy className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="combat" className="text-[10px]">
              <Crosshair className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="stress" className="text-[10px]">
              <Zap className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="decision" className="text-[10px]">
              <Brain className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Type Description */}
        {selectedType !== "all" && (
          <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground">
            {typeDescriptions[selectedType]}
          </div>
        )}

        {/* Scenario List */}
        <ScrollArea className="h-[350px]">
          <div className="space-y-2 pr-4">
            {filteredScenarios.length > 0 ? (
              filteredScenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={() => setActiveScenario(scenario.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No scenarios available for this weapon type</p>
                <p className="text-xs">Try selecting a different weapon</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">
              {compatibleScenarios.filter((s) => s.difficulty === "beginner").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Beginner</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">
              {compatibleScenarios.filter((s) => s.difficulty === "intermediate").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Intermediate</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-orange-600">
              {compatibleScenarios.filter((s) => s.difficulty === "advanced").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Advanced</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">
              {compatibleScenarios.filter((s) => s.difficulty === "expert").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Expert</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
