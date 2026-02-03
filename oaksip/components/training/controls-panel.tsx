"use client";

import {
  useTrainingStore,
  type TrainingMode,
  type ViewMode,
  type TerrainType,
  type WeatherType,
  terrainConfigs,
  weatherConfigs,
} from "@/lib/training-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GunSystemSelectorCompact } from "./gun-system-selector";
import { CrewStationSelectorCompact } from "./crew-station-selector";
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
  Mountain,
  TreePine,
  Sun,
  Snowflake,
  Cloud,
  CloudRain,
  CloudFog,
  Moon,
  Target,
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
    terrain,
    setTerrain,
    weather,
    setWeather,
    aimingMode,
    setAimingMode,
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

  // Terrain options - SOW Section 8.4
  const terrainOptions: { value: TerrainType; label: string; icon: typeof Mountain }[] = [
    { value: "plains", label: "Plains", icon: TreePine },
    { value: "desert", label: "Desert", icon: Sun },
    { value: "mountain", label: "Mountain", icon: Mountain },
    { value: "high-altitude", label: "High Alt", icon: Snowflake },
  ];

  // Weather options - SOW Section 8.4
  const weatherOptions: { value: WeatherType; label: string; icon: typeof Cloud }[] = [
    { value: "clear", label: "Clear", icon: Sun },
    { value: "rain", label: "Rain", icon: CloudRain },
    { value: "fog", label: "Fog", icon: CloudFog },
    { value: "night", label: "Night", icon: Moon },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Training Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gun System Selection - SOW Section 8.4 */}
        <GunSystemSelectorCompact />

        {/* Crew Station Selection - SOW Section 8.4 */}
        <CrewStationSelectorCompact />

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

        {/* Terrain Selection - SOW Section 8.4 */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Terrain Environment
          </label>
          <div className="grid grid-cols-4 gap-1">
            {terrainOptions.map((option) => (
              <Button
                key={option.value}
                variant={terrain === option.value ? "default" : "outline"}
                size="sm"
                className="text-xs px-2"
                onClick={() => setTerrain(option.value)}
                title={terrainConfigs[option.value].description}
              >
                <option.icon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{option.label}</span>
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {terrainConfigs[terrain].description}
          </p>
        </div>

        {/* Weather Selection - SOW Section 8.4 */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Weather Conditions
          </label>
          <div className="grid grid-cols-4 gap-1">
            {weatherOptions.map((option) => (
              <Button
                key={option.value}
                variant={weather === option.value ? "default" : "outline"}
                size="sm"
                className="text-xs px-2"
                onClick={() => setWeather(option.value)}
                title={weatherConfigs[option.value].description}
              >
                <option.icon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{option.label}</span>
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {weatherConfigs[weather].description}
          </p>
        </div>

        {/* Toggle Options */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Display Options
          </label>
          <div className="grid grid-cols-2 gap-2">
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
              variant={aimingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setAimingMode(!aimingMode)}
              title="Toggle Aiming Mode"
            >
              <Target className="h-3 w-3 mr-1" />
              Aiming
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
