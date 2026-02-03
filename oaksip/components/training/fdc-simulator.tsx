"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Radio,
  Target,
  Calculator,
  Send,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Crosshair,
  Zap,
  Volume2,
} from "lucide-react";
import {
  defaultBatteries,
  defaultMetro,
  fdcScenarios,
  sampleMissions,
  computeFiringData,
  formatFiringCommand,
  createFireMission,
  type Battery,
  type FireMission,
  type FDCScenario,
  type MissionStatus,
} from "@/lib/fdc-simulation";

// Mission status colors
const statusColors: Record<MissionStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
  computing: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  ready: "bg-green-500/10 text-green-700 border-green-500/30",
  firing: "bg-red-500/10 text-red-700 border-red-500/30",
  adjusting: "bg-orange-500/10 text-orange-700 border-orange-500/30",
  complete: "bg-gray-500/10 text-gray-700 border-gray-500/30",
  cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

interface FDCSimulatorProps {
  className?: string;
}

export function FDCSimulator({ className }: FDCSimulatorProps) {
  const [activeScenario, setActiveScenario] = useState<FDCScenario | null>(null);
  const [missions, setMissions] = useState<FireMission[]>([]);
  const [selectedMission, setSelectedMission] = useState<FireMission | null>(null);
  const [selectedBattery, setSelectedBattery] = useState<Battery>(defaultBatteries[0]);
  const [batteries] = useState<Battery[]>(defaultBatteries);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startScenario = (scenario: FDCScenario) => {
    setActiveScenario(scenario);
    setElapsedTime(0);
    setCompletedObjectives([]);
    setIsRunning(true);

    // Create missions from scenario
    const newMissions = scenario.missions.map((m) =>
      createFireMission(
        m.observer,
        m.target,
        m.missionType,
        m.ammunition,
        m.fuze,
        m.roundsRequested
      )
    );
    setMissions(newMissions);
    if (newMissions.length > 0) {
      setSelectedMission(newMissions[0]);
    }
  };

  const resetScenario = () => {
    setActiveScenario(null);
    setMissions([]);
    setSelectedMission(null);
    setIsRunning(false);
    setElapsedTime(0);
    setCompletedObjectives([]);
  };

  const processMission = () => {
    if (!selectedMission) return;

    const firingData = computeFiringData(selectedBattery, selectedMission.target, defaultMetro);

    const updatedMission: FireMission = {
      ...selectedMission,
      status: "ready",
      firingData,
    };

    setMissions((prev) =>
      prev.map((m) => (m.id === selectedMission.id ? updatedMission : m))
    );
    setSelectedMission(updatedMission);

    // Mark objective complete
    if (!completedObjectives.includes("compute")) {
      setCompletedObjectives((prev) => [...prev, "compute"]);
    }
  };

  const fireMission = () => {
    if (!selectedMission || !selectedMission.firingData) return;

    const updatedMission: FireMission = {
      ...selectedMission,
      status: "firing",
      roundsFired: selectedMission.roundsFired + 1,
    };

    setMissions((prev) =>
      prev.map((m) => (m.id === selectedMission.id ? updatedMission : m))
    );
    setSelectedMission(updatedMission);

    // Simulate firing sequence
    setTimeout(() => {
      const completedMission: FireMission = {
        ...updatedMission,
        status:
          updatedMission.roundsFired >= selectedMission.roundsRequested
            ? "complete"
            : "adjusting",
        completedAt:
          updatedMission.roundsFired >= selectedMission.roundsRequested
            ? new Date()
            : undefined,
      };

      setMissions((prev) =>
        prev.map((m) => (m.id === selectedMission.id ? completedMission : m))
      );
      setSelectedMission(completedMission);

      if (completedMission.status === "complete") {
        if (!completedObjectives.includes("fire")) {
          setCompletedObjectives((prev) => [...prev, "fire"]);
        }
      }
    }, 2000);
  };

  // Scenario Selection View
  if (!activeScenario) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            FDC Training Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a Fire Direction Center training scenario to begin
          </p>

          <div className="space-y-3">
            {fdcScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="w-full p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 text-left transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{scenario.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        scenario.difficulty === "basic"
                          ? "bg-green-500/10 text-green-700"
                          : scenario.difficulty === "intermediate"
                          ? "bg-yellow-500/10 text-yellow-700"
                          : "bg-red-500/10 text-red-700"
                      }
                    >
                      {scenario.difficulty}
                    </Badge>
                    {scenario.timeLimit && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.floor(scenario.timeLimit / 60)}min
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {scenario.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {scenario.missions.length} mission(s)
                  <span className="mx-1">•</span>
                  {scenario.objectives.length} objectives
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active Scenario View
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Scenario Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{activeScenario.name}</h3>
              <p className="text-sm text-muted-foreground">
                {activeScenario.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold">
                  {formatTime(elapsedTime)}
                </div>
                {activeScenario.timeLimit && (
                  <Progress
                    value={(elapsedTime / activeScenario.timeLimit) * 100}
                    className="w-24 h-1"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={resetScenario}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="mt-4 flex flex-wrap gap-2">
            {activeScenario.objectives.map((obj, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className={
                  completedObjectives.includes(obj.split(" ")[0].toLowerCase())
                    ? "bg-green-500/10 text-green-700"
                    : ""
                }
              >
                {completedObjectives.includes(
                  obj.split(" ")[0].toLowerCase()
                ) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {obj}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Mission List */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Fire Missions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-1 p-4 pt-0">
                {missions.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => setSelectedMission(mission)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedMission?.id === mission.id
                        ? "bg-primary/10 border-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {mission.observer.callsign}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${statusColors[mission.status]}`}
                      >
                        {mission.status}
                      </Badge>
                    </div>
                    <p className="text-sm truncate">
                      {mission.target.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px]">
                        {mission.ammunition}
                      </Badge>
                      <span>
                        {mission.roundsFired}/{mission.roundsRequested} rds
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Fire Mission Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              {selectedMission
                ? "Mission Details"
                : "Select a Mission"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMission ? (
              <Tabs defaultValue="target">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="target" className="text-xs">
                    <Crosshair className="h-3 w-3 mr-1" />
                    Target
                  </TabsTrigger>
                  <TabsTrigger value="battery" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Battery
                  </TabsTrigger>
                  <TabsTrigger value="data" className="text-xs">
                    <Calculator className="h-3 w-3 mr-1" />
                    Data
                  </TabsTrigger>
                  <TabsTrigger value="command" className="text-xs">
                    <Send className="h-3 w-3 mr-1" />
                    Command
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="target" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Observer:</span>
                      <p className="font-medium">
                        {selectedMission.observer.callsign}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <p className="font-medium capitalize">
                        {selectedMission.target.priority}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target Type:</span>
                      <p className="font-medium capitalize">
                        {selectedMission.target.type}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mission Type:</span>
                      <p className="font-medium">
                        {selectedMission.missionType.replace("_", " ")}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Grid:</span>
                      <p className="font-mono font-medium">
                        {selectedMission.target.grid.easting.toFixed(0)} E{" "}
                        {selectedMission.target.grid.northing.toFixed(0)} N{" "}
                        ALT {selectedMission.target.grid.altitude}m
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Description:</span>
                      <p className="font-medium">
                        {selectedMission.target.description}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="battery" className="mt-4 space-y-3">
                  <div className="space-y-2">
                    {batteries.map((battery) => (
                      <button
                        key={battery.id}
                        onClick={() => setSelectedBattery(battery)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          selectedBattery.id === battery.id
                            ? "bg-primary/10 border-primary"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {battery.designation}
                          </span>
                          <Badge
                            variant={
                              battery.status === "ready"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {battery.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {battery.gunCount} guns •{" "}
                          {battery.roundsAvailable[selectedMission.ammunition]}{" "}
                          {selectedMission.ammunition} available
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="data" className="mt-4 space-y-3">
                  {selectedMission.firingData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="text-xs text-muted-foreground">
                            Deflection
                          </span>
                          <p className="text-xl font-mono font-bold">
                            {selectedMission.firingData.deflection} mils
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="text-xs text-muted-foreground">
                            Quadrant Elevation
                          </span>
                          <p className="text-xl font-mono font-bold">
                            {selectedMission.firingData.quadrantElevation} mils
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="text-xs text-muted-foreground">
                            Charge
                          </span>
                          <p className="text-xl font-mono font-bold">
                            {selectedMission.firingData.charge}
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <span className="text-xs text-muted-foreground">
                            Range
                          </span>
                          <p className="text-xl font-mono font-bold">
                            {selectedMission.firingData.range}m
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Time of Flight:{" "}
                        {selectedMission.firingData.timeOfFlight}s
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Firing data not computed
                      </p>
                      <Button
                        onClick={processMission}
                        className="mt-4"
                        disabled={selectedMission.status !== "pending"}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Compute Firing Data
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="command" className="mt-4">
                  {selectedMission.firingData ? (
                    <div className="space-y-4">
                      <pre className="p-4 bg-muted/50 rounded-lg text-sm font-mono whitespace-pre-wrap">
                        {formatFiringCommand(selectedMission, selectedBattery)}
                      </pre>
                      <div className="flex gap-2">
                        <Button
                          onClick={fireMission}
                          disabled={
                            selectedMission.status === "firing" ||
                            selectedMission.status === "complete"
                          }
                          className="flex-1"
                        >
                          {selectedMission.status === "firing" ? (
                            <>
                              <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                              FIRING...
                            </>
                          ) : selectedMission.status === "complete" ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              COMPLETE
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              FIRE
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Compute firing data first
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Radio className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a fire mission to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Compact FDC panel for sidebar
export function FDCPanelCompact() {
  const [showSimulator, setShowSimulator] = useState(false);

  if (showSimulator) {
    return (
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              FDC Simulator
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSimulator(false)}
            >
              Back
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            <FDCSimulator />
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Fire Direction Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Train on Fire Direction Center operations: receiving missions,
          computing firing data, and issuing fire commands.
        </p>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xl font-bold">
              {fdcScenarios.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Scenarios</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xl font-bold">
              {sampleMissions.length}
            </p>
            <p className="text-[10px] text-muted-foreground">Missions</p>
          </div>
        </div>

        <Button onClick={() => setShowSimulator(true)} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          Start FDC Training
        </Button>
      </CardContent>
    </Card>
  );
}
