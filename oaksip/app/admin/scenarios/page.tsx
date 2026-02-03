"use client";

import { useState } from "react";
import {
  Target,
  Clock,
  Mountain,
  Cloud,
  Shield,
  Users,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allMissionScenarios, type MissionScenario } from "@/lib/gun-data";
import { terrainConfigs, weatherConfigs } from "@/lib/training-store";

const difficultyConfig = {
  beginner: { label: "Beginner", color: "bg-green-500/10 text-green-700" },
  intermediate: { label: "Intermediate", color: "bg-yellow-500/10 text-yellow-700" },
  advanced: { label: "Advanced", color: "bg-orange-500/10 text-orange-700" },
  expert: { label: "Expert", color: "bg-red-500/10 text-red-700" },
};

const objectiveIcons = {
  destroy_target: <Target className="h-4 w-4 text-red-500" />,
  suppression: <Flame className="h-4 w-4 text-orange-500" />,
  illumination: <Flame className="h-4 w-4 text-yellow-500" />,
  smoke: <Cloud className="h-4 w-4 text-gray-500" />,
  defense: <Shield className="h-4 w-4 text-blue-500" />,
};

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<MissionScenario | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const scenariosByDifficulty = {
    beginner: allMissionScenarios.filter((s) => s.difficulty === "beginner"),
    intermediate: allMissionScenarios.filter((s) => s.difficulty === "intermediate"),
    advanced: allMissionScenarios.filter((s) => s.difficulty === "advanced"),
    expert: allMissionScenarios.filter((s) => s.difficulty === "expert"),
  };

  const openDetails = (scenario: MissionScenario) => {
    setSelectedScenario(scenario);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Mission Scenarios
          </h1>
          <Badge variant="secondary">{allMissionScenarios.length} Scenarios</Badge>
        </div>
        <p className="text-muted-foreground">
          Configure and manage training mission scenarios for artillery operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries(scenariosByDifficulty).map(([difficulty, scenarios]) => (
          <Card key={difficulty} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {difficulty}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{scenarios.length}</p>
                </div>
                <Badge
                  className={`${difficultyConfig[difficulty as keyof typeof difficultyConfig].color}`}
                >
                  {difficultyConfig[difficulty as keyof typeof difficultyConfig].label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scenarios List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            All Mission Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="expert">Expert</TabsTrigger>
            </TabsList>

            {["all", "beginner", "intermediate", "advanced", "expert"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="space-y-4">
                  {(tab === "all"
                    ? allMissionScenarios
                    : allMissionScenarios.filter((s) => s.difficulty === tab)
                  ).map((scenario) => (
                    <Card
                      key={scenario.id}
                      className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => openDetails(scenario)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{scenario.name}</h3>
                              <Badge
                                className={`text-xs ${
                                  difficultyConfig[scenario.difficulty].color
                                }`}
                              >
                                {difficultyConfig[scenario.difficulty].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {scenario.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {scenario.estimatedTime} min
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {scenario.objectives.length} objectives
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <Mountain className="h-3 w-3 mr-1" />
                                {terrainConfigs[scenario.terrain as keyof typeof terrainConfigs]?.label}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <Cloud className="h-3 w-3 mr-1" />
                                {weatherConfigs[scenario.weather as keyof typeof weatherConfigs]?.label}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-primary">
                              {scenario.maxScore}
                            </p>
                            <p className="text-xs text-muted-foreground">Max Score</p>
                            <p className="text-xs text-green-500 mt-1">
                              Pass: {scenario.passingScore}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedScenario && (
                <>
                  <Target className="h-6 w-6 text-primary" />
                  <div>
                    <span>{selectedScenario.name}</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedScenario.description}
                    </p>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedScenario && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Briefing */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Mission Briefing</h4>
                  <p className="text-sm">{selectedScenario.briefing}</p>
                </div>

                {/* Situation */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedScenario.enemySituation && (
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <h5 className="font-medium text-red-700 flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        Enemy Situation
                      </h5>
                      <p className="text-sm">{selectedScenario.enemySituation}</p>
                    </div>
                  )}
                  {selectedScenario.friendlySituation && (
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <h5 className="font-medium text-blue-700 flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4" />
                        Friendly Situation
                      </h5>
                      <p className="text-sm">{selectedScenario.friendlySituation}</p>
                    </div>
                  )}
                </div>

                {/* Objectives */}
                <div>
                  <h4 className="font-semibold mb-3">Mission Objectives</h4>
                  <div className="space-y-2">
                    {selectedScenario.objectives.map((obj, idx) => (
                      <div
                        key={obj.id}
                        className="p-3 border border-border/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            Objective {idx + 1}
                          </span>
                          {objectiveIcons[obj.type]}
                          <span className="font-medium text-sm">{obj.description}</span>
                        </div>
                        {obj.targetCoordinates && (
                          <p className="text-xs text-muted-foreground">
                            Grid: {obj.targetCoordinates.grid} • Distance: {obj.targetCoordinates.distance}m
                          </p>
                        )}
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {obj.successCriteria}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {obj.requiredRounds && (
                            <Badge variant="outline" className="text-[10px]">
                              {obj.requiredRounds} rounds
                            </Badge>
                          )}
                          {obj.timeLimit && (
                            <Badge variant="outline" className="text-[10px]">
                              {Math.floor(obj.timeLimit / 60)}m limit
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Required Drills</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedScenario.drillsRequired.map((drill) => (
                        <Badge key={drill} variant="secondary" className="text-xs">
                          {drill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Allowed Ammunition</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedScenario.ammunitionAllowed.map((ammo) => (
                        <Badge key={ammo} variant="outline" className="text-xs">
                          {ammo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scoring */}
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Scoring</h4>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {selectedScenario.maxScore}
                      </p>
                      <p className="text-xs text-muted-foreground">Maximum Score</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedScenario.passingScore}
                      </p>
                      <p className="text-xs text-muted-foreground">Passing Score</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {selectedScenario.estimatedTime}
                      </p>
                      <p className="text-xs text-muted-foreground">Est. Minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
