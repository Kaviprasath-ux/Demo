"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Plane,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Mountain,
  Cloud,
  Sun,
  Moon,
  Target,
  Route,
  Shield,
  Info,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@military/ui";
import { useTrainingStore } from "@/lib/stores/training-store";
import { helicopterSystems } from "@/lib/helicopter-systems";

// Dynamically import 3D viewer to avoid SSR issues
const HelicopterViewer = dynamic(
  () => import("@/components/training/helicopter-viewer").then((mod) => mod.HelicopterViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-card rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading 3D Scene...</span>
        </div>
      </div>
    ),
  }
);

export default function CadetFlightSimulatorPage() {
  const {
    selectedHelicopter,
    setSelectedHelicopter,
    viewMode,
    setViewMode,
    terrain,
    setTerrain,
    weather,
    setWeather,
    dayNight,
    setDayNight,
    showArtilleryOverlay,
    toggleArtilleryOverlay,
    showFlightPath,
    toggleFlightPath,
    showNFZs,
    toggleNFZs,
    showLabels,
    toggleLabels,
    scenarios,
    selectedScenarioId,
    selectScenario,
    activeSession,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    getSelectedScenario,
  } = useTrainingStore();

  const [showControls, setShowControls] = useState(true);
  const selectedScenario = getSelectedScenario();

  // Filter scenarios for cadet level
  const cadetScenarios = scenarios.filter(s =>
    s.difficulty === "basic" || s.difficulty === "intermediate"
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Plane className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">3D Flight Simulator</h1>
            <p className="text-sm text-muted-foreground">
              Interactive helicopter training with air-ground coordination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSession && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Session Active</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowControls(!showControls)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showControls ? "Hide" : "Show"} Controls
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main 3D Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-[500px]">
              <HelicopterViewer />
            </div>

            {/* Viewer Controls Bar */}
            <div className="p-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* View Mode */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  {(["normal", "cockpit", "external", "battlespace"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        viewMode === mode
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted-foreground/10"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle buttons */}
                <Button
                  variant={showFlightPath ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFlightPath}
                  title="Flight Path"
                >
                  <Route className="w-4 h-4" />
                </Button>
                <Button
                  variant={showArtilleryOverlay ? "default" : "outline"}
                  size="sm"
                  onClick={toggleArtilleryOverlay}
                  title="Artillery Overlay"
                >
                  <Target className="w-4 h-4" />
                </Button>
                <Button
                  variant={showNFZs ? "default" : "outline"}
                  size="sm"
                  onClick={toggleNFZs}
                  title="No-Fly Zones"
                >
                  <Shield className="w-4 h-4" />
                </Button>
                <Button
                  variant={showLabels ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLabels}
                  title="Labels"
                >
                  {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        {showControls && (
          <div className="space-y-4">
            {/* Helicopter Selection */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary" />
                Select Helicopter
              </h3>
              <select
                value={selectedHelicopter}
                onChange={(e) => setSelectedHelicopter(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg p-2 text-sm"
              >
                {helicopterSystems.map((heli) => (
                  <option key={heli.id} value={heli.id}>
                    {heli.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                {helicopterSystems.find((h) => h.id === selectedHelicopter)?.description}
              </p>
            </div>

            {/* Environment */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-primary" />
                Environment
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Terrain</label>
                  <select
                    value={terrain}
                    onChange={(e) => setTerrain(e.target.value as any)}
                    className="w-full bg-muted border border-border rounded-lg p-2 text-sm mt-1"
                  >
                    <option value="plains">Plains</option>
                    <option value="mountains">Mountains</option>
                    <option value="urban">Urban</option>
                    <option value="desert">Desert</option>
                    <option value="jungle">Jungle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Weather</label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value as any)}
                    className="w-full bg-muted border border-border rounded-lg p-2 text-sm mt-1"
                  >
                    <option value="clear">Clear</option>
                    <option value="rain">Rain</option>
                    <option value="fog">Fog</option>
                    <option value="dust">Dust</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Time of Day</label>
                  <div className="flex items-center gap-1 mt-1">
                    {(["day", "dusk", "night"] as const).map((time) => (
                      <button
                        key={time}
                        onClick={() => setDayNight(time)}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
                          dayNight === time
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted-foreground/10"
                        }`}
                      >
                        {time === "day" && <Sun className="w-3 h-3 mx-auto" />}
                        {time === "dusk" && <Cloud className="w-3 h-3 mx-auto" />}
                        {time === "night" && <Moon className="w-3 h-3 mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Training Scenario */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Training Scenario
              </h3>

              <select
                value={selectedScenarioId || ""}
                onChange={(e) => selectScenario(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg p-2 text-sm"
              >
                <option value="">Select a scenario...</option>
                {cadetScenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </select>

              {selectedScenario && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {selectedScenario.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      selectedScenario.difficulty === "basic"
                        ? "bg-primary/20 text-primary"
                        : selectedScenario.difficulty === "intermediate"
                        ? "bg-primary/20 text-primary"
                        : selectedScenario.difficulty === "advanced"
                        ? "bg-primary/20 text-primary"
                        : "bg-red-500/20 text-red-500"
                    }`}>
                      {selectedScenario.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                      {selectedScenario.duration} min
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium mb-1">Objectives:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {selectedScenario.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Session controls */}
                  <div className="pt-2 flex gap-2">
                    {!activeSession ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => startSession(selectedScenario.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start Training
                      </Button>
                    ) : activeSession.status === "in_progress" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={pauseSession}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => endSession(85)}
                        >
                          End
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={resumeSession}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Guide */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Controls Guide
              </h3>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  <span className="font-medium text-foreground">Mouse Drag:</span> Rotate view
                </p>
                <p>
                  <span className="font-medium text-foreground">Scroll:</span> Zoom in/out
                </p>
                <p>
                  <span className="font-medium text-foreground">Green Line:</span> Flight path
                </p>
                <p>
                  <span className="font-medium text-foreground">Orange Arcs:</span> Artillery zones
                </p>
                <p>
                  <span className="font-medium text-foreground">Red Areas:</span> No-fly zones
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
