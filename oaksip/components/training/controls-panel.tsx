"use client";

import { useTrainingStore, type TrainingMode, type ViewMode } from "@/lib/training-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  UserCog,
  ClipboardCheck,
  Eye,
  Layers,
  Scan,
  Tag,
  RotateCcw,
  Crosshair,
  ArrowUp,
  ArrowRight,
  Move3d,
  ZoomIn,
  Volume2,
  VolumeX,
} from "lucide-react";

export function ControlsPanel() {
  const {
    mode,
    setMode,
    viewMode,
    setViewMode,
    showLabels,
    toggleLabels,
    soundEnabled,
    toggleSound,
    cameraPreset,
    setCameraPreset,
    setSelectedComponent,
  } = useTrainingStore();

  const modeDescriptions: Record<TrainingMode, string> = {
    cadet: "Guided step-by-step learning",
    instructor: "Free exploration mode",
    assessment: "Timed drill assessment",
  };

  const viewModeOptions: { value: ViewMode; label: string; icon: typeof Eye }[] = [
    { value: "normal", label: "Normal", icon: Eye },
    { value: "exploded", label: "Exploded", icon: Layers },
    { value: "xray", label: "X-Ray", icon: Scan },
  ];

  const cameraPresets = [
    { value: "default" as const, label: "Default", icon: Move3d },
    { value: "front" as const, label: "Front", icon: Crosshair },
    { value: "side" as const, label: "Side", icon: ArrowRight },
    { value: "top" as const, label: "Top", icon: ArrowUp },
    { value: "detail" as const, label: "Detail", icon: ZoomIn },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Training Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Training Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Training Mode
          </label>
          <Tabs value={mode} onValueChange={(v) => setMode(v as TrainingMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cadet" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                Cadet
              </TabsTrigger>
              <TabsTrigger value="instructor" className="text-xs">
                <UserCog className="h-3 w-3 mr-1" />
                Instructor
              </TabsTrigger>
              <TabsTrigger value="assessment" className="text-xs">
                <ClipboardCheck className="h-3 w-3 mr-1" />
                Assessment
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">{modeDescriptions[mode]}</p>
        </div>

        {/* View Mode */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            View Mode
          </label>
          <div className="flex gap-2">
            {viewModeOptions.map((option) => (
              <Button
                key={option.value}
                variant={viewMode === option.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setViewMode(option.value)}
              >
                <option.icon className="h-3 w-3 mr-1" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Camera Presets */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Camera View
          </label>
          <div className="grid grid-cols-5 gap-1">
            {cameraPresets.map((preset) => (
              <Button
                key={preset.value}
                variant={cameraPreset === preset.value ? "default" : "outline"}
                size="sm"
                className="text-xs px-2"
                onClick={() => setCameraPreset(preset.value)}
                title={preset.label}
              >
                <preset.icon className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Display Options
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={showLabels ? "default" : "outline"}
              size="sm"
              onClick={toggleLabels}
              title="Toggle Labels"
            >
              <Tag className="h-3 w-3 mr-1" />
              Labels
            </Button>
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleSound}
              title="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="h-3 w-3 mr-1" />
              ) : (
                <VolumeX className="h-3 w-3 mr-1" />
              )}
              Sound
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedComponent(null);
                setViewMode("normal");
                setCameraPreset("default");
              }}
              title="Reset View"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Mode-specific info */}
        {mode === "assessment" && (
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              In assessment mode, your actions will be timed and scored.
              Complete drills accurately to earn your certification.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
