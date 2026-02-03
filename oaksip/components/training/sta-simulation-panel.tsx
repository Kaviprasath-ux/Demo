"use client";

import { useState, useEffect } from "react";
import {
  Radar,
  Plane,
  Eye,
  Target,
  MapPin,
  Battery,
  Clock,
  Radio,
  Crosshair,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Zap,
  Thermometer,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockSTANetwork,
  type Target as TargetType,
  type UAVFeed,
  type RadarStation,
  type ForwardObserver,
  type FireMissionRequest,
  createFireMissionRequest,
  getSensorStatusColor,
} from "@/lib/sta-simulation";
import { cn } from "@/lib/utils";

// Target priority colors
const priorityColors = {
  high: "text-red-500 bg-red-500/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  low: "text-green-500 bg-green-500/10",
};

// Target type icons
const targetTypeIcons: Record<string, React.ReactNode> = {
  armor: <span className="text-lg">🛡️</span>,
  infantry: <span className="text-lg">👥</span>,
  artillery: <span className="text-lg">🎯</span>,
  vehicle: <span className="text-lg">🚛</span>,
  structure: <span className="text-lg">🏢</span>,
  unknown: <span className="text-lg">❓</span>,
};

// UAV Card Component
function UAVCard({ uav, onSelect }: { uav: UAVFeed; onSelect: () => void }) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all"
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Plane className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{uav.name}</h4>
              <Badge
                variant="outline"
                className={cn("text-[10px]", getSensorStatusColor(uav.status))}
              >
                {uav.status.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                ALT: {uav.altitude}m
              </span>
              <span className="flex items-center gap-1">
                <Battery className="h-3 w-3" />
                {uav.battery}%
              </span>
              <span className="flex items-center gap-1">
                <Crosshair className="h-3 w-3" />
                {uav.cameraMode}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {uav.fuelTime}min
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Target className="h-3 w-3 text-red-500" />
              <span className="text-xs">
                {uav.detectedTargets.length} targets detected
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Radar Card Component
function RadarCard({ radar }: { radar: RadarStation }) {
  const timeSinceSweep = Math.floor((Date.now() - radar.lastSweep) / 1000);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Radar className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{radar.name}</h4>
              <Badge
                variant="outline"
                className={cn("text-[10px]", getSensorStatusColor(radar.status))}
              >
                {radar.status.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Range: {radar.range}km</span>
              <span>
                Sector: {radar.bearing.min}°-{radar.bearing.max}°
              </span>
              <span>Sweep: {timeSinceSweep}s ago</span>
              <span>Interval: {radar.sweepInterval}s</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Target className="h-3 w-3 text-red-500" />
              <span className="text-xs">
                {radar.detectedTargets.length} contacts
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Forward Observer Card Component
function FOCard({ fo }: { fo: ForwardObserver }) {
  const timeSinceReport = Math.floor((Date.now() - fo.lastReport) / 60000);

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Eye className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{fo.callsign}</h4>
              <Badge
                variant="outline"
                className={cn("text-[10px]", getSensorStatusColor(fo.status))}
              >
                {fo.status.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Sector: {fo.assignedSector.bearing}° ± {fo.assignedSector.width}°
              </p>
              <p>Last Report: {timeSinceReport}min ago</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                <Radio
                  className={cn(
                    "h-3 w-3",
                    getSensorStatusColor(fo.equipmentStatus.radio)
                  )}
                />
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Crosshair
                  className={cn(
                    "h-3 w-3",
                    getSensorStatusColor(fo.equipmentStatus.laser)
                  )}
                />
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Eye
                  className={cn(
                    "h-3 w-3",
                    getSensorStatusColor(fo.equipmentStatus.optics)
                  )}
                />
              </span>
              <span className="ml-auto text-xs">
                <Target className="h-3 w-3 inline text-red-500" />{" "}
                {fo.detectedTargets.length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Target List Item Component
function TargetListItem({
  target,
  isExpanded,
  onToggle,
  onRequestFire,
}: {
  target: TargetType;
  isExpanded: boolean;
  onToggle: () => void;
  onRequestFire: () => void;
}) {
  const timeSinceUpdate = Math.floor((Date.now() - target.lastUpdated) / 1000);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className={cn(
          "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
          target.status === "engaged" && "bg-orange-500/10"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", priorityColors[target.priority])}>
            {targetTypeIcons[target.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{target.id.toUpperCase()}</span>
              <Badge
                variant="outline"
                className={cn("text-[10px]", priorityColors[target.priority])}
              >
                {target.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {target.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {target.type} - {target.estimatedStrength || "unknown strength"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {target.confidence}%
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 border-t bg-muted/30">
          <div className="grid grid-cols-2 gap-3 py-3 text-xs">
            <div>
              <p className="text-muted-foreground mb-1">Position</p>
              <p className="font-mono">
                {target.position.gridReference ||
                  `${target.position.latitude.toFixed(4)}, ${target.position.longitude.toFixed(4)}`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Last Updated</p>
              <p>{timeSinceUpdate}s ago</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Detected By</p>
              <div className="flex gap-1">
                {target.detectedBy.map((sensor) => (
                  <Badge key={sensor} variant="outline" className="text-[10px]">
                    {sensor}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Signatures</p>
              <div className="flex gap-2">
                {target.signature?.thermal && (
                  <span className="flex items-center gap-0.5">
                    <Thermometer className="h-3 w-3 text-orange-500" />
                    {target.signature.thermal}%
                  </span>
                )}
                {target.signature?.radar && (
                  <span className="flex items-center gap-0.5">
                    <Radar className="h-3 w-3 text-purple-500" />
                    {target.signature.radar}%
                  </span>
                )}
                {target.signature?.acoustic && (
                  <span className="flex items-center gap-0.5">
                    <Volume2 className="h-3 w-3 text-blue-500" />
                    {target.signature.acoustic}%
                  </span>
                )}
              </div>
            </div>
          </div>
          {target.notes && (
            <p className="text-xs text-muted-foreground mb-3 italic">
              &quot;{target.notes}&quot;
            </p>
          )}
          {target.velocity && (
            <p className="text-xs mb-3">
              Moving: {Math.sqrt(target.velocity.x ** 2 + target.velocity.y ** 2).toFixed(1)}{" "}
              m/s @ {target.heading}°
            </p>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onRequestFire();
              }}
              disabled={target.status === "engaged" || target.status === "destroyed"}
            >
              <Zap className="h-3 w-3 mr-1" />
              Request Fire Mission
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Fire Mission Queue Component
function FireMissionQueue({
  missions,
  onApprove,
  onCancel,
}: {
  missions: FireMissionRequest[];
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  if (missions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No pending fire missions</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {missions.map((mission) => (
        <div
          key={mission.id}
          className={cn(
            "p-3 rounded-lg border",
            mission.status === "pending" && "bg-yellow-500/10 border-yellow-500/30",
            mission.status === "approved" && "bg-blue-500/10 border-blue-500/30",
            mission.status === "firing" && "bg-red-500/10 border-red-500/30"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className={cn(priorityColors[mission.priority])}>
                {mission.priority.toUpperCase()}
              </Badge>
              <span className="font-medium text-sm">{mission.targetId.toUpperCase()}</span>
            </div>
            <Badge variant="outline">{mission.status.toUpperCase()}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {mission.targetDescription}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span>
              Effect: {mission.effectDesired} | Rounds: {mission.roundsRequested}
            </span>
            <span>From: {mission.requestedBy}</span>
          </div>
          {mission.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onApprove(mission.id)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onCancel(mission.id)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Main STA Simulation Panel
export function STASimulationPanel() {
  const [network] = useState(mockSTANetwork);
  const [expandedTarget, setExpandedTarget] = useState<string | null>(null);
  const [fireMissions, setFireMissions] = useState<FireMissionRequest[]>([]);
  const [selectedUAV, setSelectedUAV] = useState<UAVFeed | null>(null);
  const [simulationTime, setSimulationTime] = useState(Date.now());

  // Update simulation time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulationTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestFire = (target: TargetType) => {
    const mission = createFireMissionRequest(target, "FDC-Main");
    setFireMissions((prev) => [...prev, mission]);
  };

  const handleApproveMission = (id: string) => {
    setFireMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "approved" as const } : m))
    );
    // Simulate firing after 2 seconds
    setTimeout(() => {
      setFireMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "firing" as const } : m))
      );
    }, 2000);
    // Complete after 5 seconds
    setTimeout(() => {
      setFireMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "completed" as const } : m))
      );
    }, 5000);
  };

  const handleCancelMission = (id: string) => {
    setFireMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "cancelled" as const } : m))
    );
  };

  // Sort targets by priority
  const sortedTargets = [...network.targets].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Radar className="h-4 w-4" />
            STA Network - {network.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Updated:{" "}
            {Math.floor((simulationTime - network.lastUpdate) / 1000)}s ago
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="targets" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="targets" className="text-xs">
              Targets ({network.targets.length})
            </TabsTrigger>
            <TabsTrigger value="uav" className="text-xs">
              UAV ({network.uavs.length})
            </TabsTrigger>
            <TabsTrigger value="sensors" className="text-xs">
              Sensors
            </TabsTrigger>
            <TabsTrigger value="missions" className="text-xs">
              Missions ({fireMissions.filter((m) => m.status === "pending").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="targets" className="mt-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-2">
                {sortedTargets.map((target) => (
                  <TargetListItem
                    key={target.id}
                    target={target}
                    isExpanded={expandedTarget === target.id}
                    onToggle={() =>
                      setExpandedTarget(
                        expandedTarget === target.id ? null : target.id
                      )
                    }
                    onRequestFire={() => handleRequestFire(target)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="uav" className="mt-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-2">
                {network.uavs.map((uav) => (
                  <UAVCard
                    key={uav.id}
                    uav={uav}
                    onSelect={() => setSelectedUAV(uav)}
                  />
                ))}
              </div>
            </ScrollArea>

            {selectedUAV && (
              <div className="mt-4 p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{selectedUAV.name} Feed</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedUAV(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Plane className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Live Feed - {selectedUAV.cameraMode.toUpperCase()} Mode
                    </p>
                    <p className="text-xs mt-1">
                      ALT: {selectedUAV.altitude}m | SPD: {selectedUAV.speed}km/h |
                      HDG: {selectedUAV.heading}°
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sensors" className="mt-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-2">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Radar className="h-3 w-3" />
                    RADAR STATIONS
                  </h4>
                  <div className="space-y-2">
                    {network.radars.map((radar) => (
                      <RadarCard key={radar.id} radar={radar} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    FORWARD OBSERVERS
                  </h4>
                  <div className="space-y-2">
                    {network.forwardObservers.map((fo) => (
                      <FOCard key={fo.id} fo={fo} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="missions" className="mt-3">
            <ScrollArea className="h-[400px]">
              <FireMissionQueue
                missions={fireMissions.filter(
                  (m) => m.status !== "completed" && m.status !== "cancelled"
                )}
                onApprove={handleApproveMission}
                onCancel={handleCancelMission}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-red-500/10 rounded-lg">
            <p className="text-lg font-bold text-red-500">
              {network.targets.filter((t) => t.priority === "high").length}
            </p>
            <p className="text-[10px] text-muted-foreground">HIGH PRI</p>
          </div>
          <div className="text-center p-2 bg-green-500/10 rounded-lg">
            <p className="text-lg font-bold text-green-500">
              {network.uavs.filter((u) => u.status === "active").length}
            </p>
            <p className="text-[10px] text-muted-foreground">ACTIVE UAV</p>
          </div>
          <div className="text-center p-2 bg-purple-500/10 rounded-lg">
            <p className="text-lg font-bold text-purple-500">
              {network.radars.filter((r) => r.status === "active").length}
            </p>
            <p className="text-[10px] text-muted-foreground">RADAR</p>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded-lg">
            <p className="text-lg font-bold text-blue-500">
              {network.forwardObservers.filter((f) => f.status === "active").length}
            </p>
            <p className="text-[10px] text-muted-foreground">FO ACTIVE</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
