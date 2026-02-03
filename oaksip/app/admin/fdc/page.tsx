"use client";

import { useState } from "react";
import {
  Target,
  Radio,
  Map,
  Users,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
  Crosshair,
  MapPin,
  Gauge,
  Thermometer,
  Wind,
  Cloud,
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
import {
  fdcScenarios,
  defaultBatteries,
  defaultObservers,
  defaultMetro,
  type FDCScenario,
} from "@/lib/fdc-simulation";

const difficultyConfig = {
  basic: { label: "Basic", color: "bg-green-500/10 text-green-700" },
  intermediate: { label: "Intermediate", color: "bg-yellow-500/10 text-yellow-700" },
  advanced: { label: "Advanced", color: "bg-red-500/10 text-red-700" },
};

export default function FDCPage() {
  const [selectedScenario, setSelectedScenario] = useState<FDCScenario | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expandedBattery, setExpandedBattery] = useState<string | null>(null);

  const openDetails = (scenario: FDCScenario) => {
    setSelectedScenario(scenario);
    setDetailsOpen(true);
  };

  const totalAmmo = defaultBatteries.reduce((sum, b) => {
    return sum + Object.values(b.roundsAvailable).reduce((a, c) => a + c, 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Fire Direction Center Configuration
          </h1>
          <Badge variant="secondary">{fdcScenarios.length} Scenarios</Badge>
        </div>
        <p className="text-muted-foreground">
          Configure and manage FDC training scenarios, battery positions, and meteorological data.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Batteries</p>
                <p className="text-3xl font-bold text-foreground">{defaultBatteries.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Crosshair className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Observers</p>
                <p className="text-3xl font-bold text-foreground">{defaultObservers.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Ammunition</p>
                <p className="text-3xl font-bold text-foreground">{totalAmmo}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Training Scenarios</p>
                <p className="text-3xl font-bold text-foreground">{fdcScenarios.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Map className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battery Configuration */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crosshair className="h-5 w-5" />
            Battery Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {defaultBatteries.map((battery) => (
            <div
              key={battery.id}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedBattery(expandedBattery === battery.id ? null : battery.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Crosshair className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{battery.designation}</h3>
                      <Badge
                        variant={battery.status === "ready" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {battery.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {battery.gunCount} guns • Grid: {battery.position.easting}E, {battery.position.northing}N
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {Object.values(battery.roundsAvailable).reduce((a, c) => a + c, 0)} rounds
                    </p>
                    <p className="text-xs text-muted-foreground">total available</p>
                  </div>
                  {expandedBattery === battery.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedBattery === battery.id && (
                <div className="border-t border-border/50 p-4 bg-muted/30 space-y-4">
                  {/* Position */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Easting</p>
                      <p className="font-mono font-medium">{battery.position.easting}</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Northing</p>
                      <p className="font-mono font-medium">{battery.position.northing}</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Altitude</p>
                      <p className="font-mono font-medium">{battery.position.altitude}m</p>
                    </div>
                  </div>

                  {/* Ammunition */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Ammunition Inventory</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {Object.entries(battery.roundsAvailable).map(([type, count]) => (
                        <div key={type} className="p-2 bg-background rounded border border-border/50 text-center">
                          <p className="text-lg font-bold">{count}</p>
                          <p className="text-[10px] text-muted-foreground">{type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Observers & Metro */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Observers */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Forward Observers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {defaultObservers.map((observer) => (
              <div key={observer.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{observer.callsign}</Badge>
                    <Badge variant="secondary" className="text-xs">{observer.type.toUpperCase()}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Grid: {observer.position.easting}E, {observer.position.northing}N</span>
                  <span>• Alt: {observer.position.altitude}m</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Meteorological Data */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Meteorological Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Temperature</span>
                </div>
                <p className="text-lg font-bold">{defaultMetro.temperature}°C</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Pressure</span>
                </div>
                <p className="text-lg font-bold">{defaultMetro.pressure} mb</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs text-muted-foreground">Wind</span>
                </div>
                <p className="text-lg font-bold">{defaultMetro.windSpeed} m/s @ {defaultMetro.windDirection}°</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Cloud className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-muted-foreground">Humidity</span>
                </div>
                <p className="text-lg font-bold">{defaultMetro.humidity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FDC Training Scenarios */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            FDC Training Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {["all", "basic", "intermediate", "advanced"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="space-y-4">
                  {(tab === "all"
                    ? fdcScenarios
                    : fdcScenarios.filter((s) => s.difficulty === tab)
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
                                <Target className="h-3 w-3 mr-1" />
                                {scenario.missions.length} missions
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {scenario.objectives.length} objectives
                              </Badge>
                              {scenario.timeLimit && (
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {Math.floor(scenario.timeLimit / 60)} min
                                </Badge>
                              )}
                            </div>
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
                {/* Overview */}
                <div className="flex items-center gap-4">
                  <Badge className={difficultyConfig[selectedScenario.difficulty].color}>
                    {difficultyConfig[selectedScenario.difficulty].label}
                  </Badge>
                  {selectedScenario.timeLimit && (
                    <span className="text-sm text-muted-foreground">
                      Time Limit: {Math.floor(selectedScenario.timeLimit / 60)} minutes
                    </span>
                  )}
                </div>

                {/* Objectives */}
                <div>
                  <h4 className="font-semibold mb-3">Training Objectives</h4>
                  <div className="space-y-2">
                    {selectedScenario.objectives.map((obj, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                      >
                        <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
                        <span className="text-sm">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missions */}
                <div>
                  <h4 className="font-semibold mb-3">Fire Missions ({selectedScenario.missions.length})</h4>
                  <div className="space-y-2">
                    {selectedScenario.missions.map((mission, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-border/50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{mission.missionType.replace("_", " ")}</Badge>
                            <Badge variant="secondary">{mission.ammunition}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {mission.roundsRequested} rounds
                          </span>
                        </div>
                        <p className="text-sm">{mission.target.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: {mission.target.type} • Priority: {mission.target.priority}
                        </p>
                      </div>
                    ))}
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
