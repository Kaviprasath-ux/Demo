"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCircle,
  Target,
  Eye,
  GraduationCap,
  ClipboardCheck,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useTrainingStore } from "@/lib/training-store";
import { type CrewPosition } from "@/lib/gun-systems";

// Role to icon mapping
const roleIcons: Record<string, React.ReactNode> = {
  Command: <Target className="h-4 w-4" />,
  Firing: <Target className="h-4 w-4 text-red-500" />,
  Laying: <Target className="h-4 w-4 text-blue-500" />,
  Loading: <Target className="h-4 w-4 text-amber-500" />,
  Ammunition: <Target className="h-4 w-4 text-orange-500" />,
  Support: <Target className="h-4 w-4 text-gray-500" />,
  Mobility: <Target className="h-4 w-4 text-green-500" />,
  Primary: <Target className="h-4 w-4 text-red-500" />,
};

// Role to color mapping
const roleColors: Record<string, string> = {
  Command: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  Firing: "bg-red-500/10 text-red-700 border-red-500/30",
  Laying: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  Loading: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Ammunition: "bg-orange-500/10 text-orange-700 border-orange-500/30",
  Support: "bg-gray-500/10 text-gray-700 border-gray-500/30",
  Mobility: "bg-green-500/10 text-green-700 border-green-500/30",
  Primary: "bg-red-500/10 text-red-700 border-red-500/30",
};

interface CrewPositionCardProps {
  position: CrewPosition;
  isSelected: boolean;
  onSelect: () => void;
}

function CrewPositionCard({ position, isSelected, onSelect }: CrewPositionCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? "bg-primary/10 border-primary ring-1 ring-primary"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Role icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${
            roleColors[position.role] || "bg-gray-500/10"
          }`}
        >
          {roleIcons[position.role] || <UserCircle className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{position.title}</h4>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 mt-1 ${roleColors[position.role] || ""}`}
          >
            {position.role}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {position.location}
          </p>
        </div>

        {isSelected && (
          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
        )}
      </div>
    </button>
  );
}

export function CrewStationSelector() {
  const {
    selectedCrewStation,
    setCrewStation,
    getCrewPositions,
    getCrewPositionInfo,
    getGunSystemInfo,
    crewInteractionMode,
    setCrewInteractionMode,
  } = useTrainingStore();

  const crewPositions = getCrewPositions();
  const currentPosition = getCrewPositionInfo();
  const gunSystem = getGunSystemInfo();

  return (
    <div className="space-y-4">
      {/* Header with gun system info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>
          {gunSystem?.name} Crew ({gunSystem?.specs.crewSize || crewPositions.length} members)
        </span>
      </div>

      {/* Interaction Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Training Mode
        </label>
        <Tabs
          value={crewInteractionMode}
          onValueChange={(v) => setCrewInteractionMode(v as "observe" | "train" | "assess")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="observe" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Observe
            </TabsTrigger>
            <TabsTrigger value="train" className="text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              Train
            </TabsTrigger>
            <TabsTrigger value="assess" className="text-xs">
              <ClipboardCheck className="h-3 w-3 mr-1" />
              Assess
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-[10px] text-muted-foreground">
          {crewInteractionMode === "observe" && "Watch crew procedures without interaction"}
          {crewInteractionMode === "train" && "Practice crew duties with guidance"}
          {crewInteractionMode === "assess" && "Timed assessment of crew competency"}
        </p>
      </div>

      {/* Crew Position List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Select Crew Station
          </label>
          {selectedCrewStation && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setCrewStation(null)}
            >
              Clear
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {crewPositions.map((position) => (
              <CrewPositionCard
                key={position.id}
                position={position}
                isSelected={selectedCrewStation === position.id}
                onSelect={() =>
                  setCrewStation(
                    selectedCrewStation === position.id ? null : position.id
                  )
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Selected Position Details */}
      {currentPosition && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              {currentPosition.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Badge
                variant="outline"
                className={roleColors[currentPosition.role]}
              >
                {currentPosition.role}
              </Badge>
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentPosition.location}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-medium mb-2">Responsibilities:</h4>
              <ul className="space-y-1">
                {currentPosition.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {crewInteractionMode !== "observe" && (
              <Button size="sm" className="w-full">
                {crewInteractionMode === "train"
                  ? "Start Training"
                  : "Begin Assessment"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Compact selector for controls panel
export function CrewStationSelectorCompact() {
  const {
    selectedCrewStation,
    setCrewStation,
    getCrewPositions,
    getCrewPositionInfo,
    getGunSystemInfo,
  } = useTrainingStore();

  const crewPositions = getCrewPositions();
  const currentPosition = getCrewPositionInfo();
  const gunSystem = getGunSystemInfo();

  // Only show crew station selector for artillery (towed)
  // Small arms are operated by individuals - no crew concept
  if (gunSystem?.category !== "towed") return null;

  if (crewPositions.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Crew Station
      </label>
      <select
        value={selectedCrewStation || ""}
        onChange={(e) => setCrewStation(e.target.value || null)}
        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">All Stations (Overview)</option>
        {crewPositions.map((position) => (
          <option key={position.id} value={position.id}>
            {position.title}
          </option>
        ))}
      </select>
      {currentPosition && (
        <p className="text-[10px] text-muted-foreground">
          {currentPosition.role} • {currentPosition.location}
        </p>
      )}
    </div>
  );
}

// Crew position indicator badge
export function CrewPositionBadge() {
  const { getCrewPositionInfo } = useTrainingStore();
  const position = getCrewPositionInfo();

  if (!position) return null;

  return (
    <Badge variant="outline" className={`${roleColors[position.role]} text-xs`}>
      <UserCircle className="h-3 w-3 mr-1" />
      {position.title}
    </Badge>
  );
}
