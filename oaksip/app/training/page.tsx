"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ComponentInfo } from "@/components/training/component-info";
import { ControlsPanel } from "@/components/training/controls-panel";
import { AssemblyGuide } from "@/components/training/assembly-guide";
import { DrillPlayer } from "@/components/training/drill-player";
import { SafetyAlerts, SafetyAlertDemo } from "@/components/training/safety-alerts";
import { AssessmentPanel } from "@/components/training/assessment-panel";
import { useTrainingStore } from "@/lib/training-store";
import { gunComponents } from "@/lib/gun-data";
import {
  Crosshair,
  Info,
  Settings,
  BookOpen,
  AlertTriangle,
  Loader2,
  Maximize,
  Minimize,
  Flame,
  Volume2,
} from "lucide-react";

// Dynamically import 3D viewer to avoid SSR issues
const GunViewer = dynamic(
  () => import("@/components/training/gun-viewer").then((mod) => mod.GunViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading 3D Model...</p>
        </div>
      </div>
    ),
  }
);

export default function TrainingPage() {
  const {
    mode,
    currentDrill,
    viewMode,
    isFullscreen,
    setFullscreen,
    triggerFiring,
    isAnimating,
  } = useTrainingStore();

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!viewerContainerRef.current) return;

    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().then(() => {
        setFullscreen(true);
      }).catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setFullscreen(false);
      });
    }
  }, [setFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setFullscreen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen, isFullscreen]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              3D Gun Training Model
            </h1>
            <p className="text-muted-foreground">
              Interactive 155mm Artillery Gun training simulator
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            {viewMode === "exploded" && (
              <Badge variant="secondary" className="text-xs">
                Exploded View
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Panel - show at top when in assessment mode */}
      {mode === "assessment" && (
        <AssessmentPanel />
      )}

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 3D Viewer - takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                ref={viewerContainerRef}
                className={`relative ${isFullscreen ? "h-screen" : "aspect-[16/10]"} bg-background`}
              >
                {/* Fullscreen controls overlay */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  {/* Fire Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => triggerFiring()}
                    disabled={isAnimating}
                    className="shadow-lg"
                  >
                    <Flame className="h-4 w-4 mr-1" />
                    {isAnimating ? "FIRING..." : "FIRE!"}
                  </Button>

                  {/* Fullscreen Toggle */}
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="shadow-lg"
                    title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Fullscreen hint */}
                {isFullscreen && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <Badge variant="secondary" className="text-xs">
                      Press ESC or F to exit fullscreen
                    </Badge>
                  </div>
                )}

                <Suspense
                  fallback={
                    <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  }
                >
                  <GunViewer className="absolute inset-0" />
                </Suspense>

                {/* Drill player overlay */}
                {currentDrill && (
                  <div className="absolute bottom-4 left-4 right-4 max-w-xl">
                    <DrillPlayer />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Component quick list */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-muted-foreground" />
                  Gun Components
                </h3>
                <span className="text-xs text-muted-foreground">
                  {gunComponents.length} components
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gunComponents.map((component) => (
                  <ComponentButton
                    key={component.id}
                    id={component.id}
                    name={component.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar - controls and info */}
        <div className="space-y-4">
          <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="controls" className="text-xs">
                <Settings className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="drills" className="text-xs">
                <BookOpen className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs">
                <Info className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="safety" className="text-xs">
                <AlertTriangle className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="mt-4">
              <ControlsPanel />
            </TabsContent>

            <TabsContent value="drills" className="mt-4">
              <AssemblyGuide />
            </TabsContent>

            <TabsContent value="info" className="mt-4">
              <ComponentInfo />
            </TabsContent>

            <TabsContent value="safety" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Safety Simulation
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Trigger safety alerts to simulate fault conditions and
                    practice proper responses.
                  </p>
                  <SafetyAlertDemo />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Training tips based on mode */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Training Tips</h3>
              <TrainingTips mode={mode} />
            </CardContent>
          </Card>

          {/* Keyboard shortcuts */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                Keyboard Shortcuts
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fullscreen</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">F</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exit Fullscreen</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">ESC</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rotate View</span>
                  <span className="text-muted-foreground">Click + Drag</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zoom</span>
                  <span className="text-muted-foreground">Scroll</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety alerts overlay */}
      <SafetyAlerts />
    </div>
  );
}

// Component button for quick selection
function ComponentButton({ id, name }: { id: string; name: string }) {
  const { selectedComponent, setSelectedComponent } = useTrainingStore();
  const isSelected = selectedComponent === id;

  return (
    <button
      onClick={() => setSelectedComponent(isSelected ? null : id)}
      className={`px-2 py-1 text-xs rounded-md border transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted/50 border-border hover:bg-muted"
      }`}
    >
      {name}
    </button>
  );
}

// Training tips based on current mode
function TrainingTips({ mode }: { mode: string }) {
  const tips = {
    cadet: [
      "Follow the guided steps carefully",
      "Pay attention to safety warnings",
      "Click components to learn more",
      "Use exploded view to see internals",
      "Press F for fullscreen immersion",
    ],
    instructor: [
      "Free exploration of all components",
      "Demonstrate procedures to cadets",
      "Access all drill sequences",
      "Use camera presets for teaching",
      "Fire button for demonstration",
    ],
    assessment: [
      "Complete drills accurately and quickly",
      "Points deducted for errors",
      "Timer starts when you press Play",
      "Safety violations reduce score",
      "Bonus points for fast completion",
    ],
  };

  const currentTips = tips[mode as keyof typeof tips] || tips.cadet;

  return (
    <ul className="space-y-1">
      {currentTips.map((tip, index) => (
        <li key={index} className="text-xs text-muted-foreground flex gap-2">
          <span className="text-primary">•</span>
          {tip}
        </li>
      ))}
    </ul>
  );
}
