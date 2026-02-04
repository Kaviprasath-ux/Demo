"use client";

import { useState } from "react";
import {
  Crosshair,
  Settings,
  Users,
  Target,
  Ruler,
  Swords,
  CircleDot,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  FileText,
  Calendar,
  Rocket,
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
import { gunSystems, type GunSystem, type GunCategory } from "@/lib/gun-systems";

const categoryIcons: Record<GunCategory, React.ReactNode> = {
  towed: <Crosshair className="h-5 w-5" />,
  "assault-rifle": <Swords className="h-5 w-5" />,
  pistol: <CircleDot className="h-5 w-5" />,
  "machine-gun": <Target className="h-5 w-5" />,
};

const categoryLabels: Record<GunCategory, string> = {
  towed: "Towed Artillery",
  "assault-rifle": "Assault Rifles",
  pistol: "Pistols",
  "machine-gun": "Machine Guns",
};

// Lifecycle Status Data
const lifecycleStatus: Record<string, {
  status: "active" | "legacy" | "induction" | "planned";
  doctrineVersion: string;
  lastDoctrineUpdate: string;
  digitalTwinVersion: string;
  lastModelUpdate: string;
  nextScheduledUpdate: string;
}> = {
  dhanush: {
    status: "active",
    doctrineVersion: "3.2.1",
    lastDoctrineUpdate: "2025-01-15",
    digitalTwinVersion: "2.1.0",
    lastModelUpdate: "2025-01-10",
    nextScheduledUpdate: "2025-04-01",
  },
  "k9-vajra": {
    status: "active",
    doctrineVersion: "3.1.0",
    lastDoctrineUpdate: "2024-12-20",
    digitalTwinVersion: "2.0.5",
    lastModelUpdate: "2024-12-15",
    nextScheduledUpdate: "2025-03-15",
  },
  pinaka: {
    status: "active",
    doctrineVersion: "2.8.3",
    lastDoctrineUpdate: "2024-11-30",
    digitalTwinVersion: "1.9.2",
    lastModelUpdate: "2024-11-25",
    nextScheduledUpdate: "2025-02-28",
  },
  "ak-47": {
    status: "active",
    doctrineVersion: "4.0.0",
    lastDoctrineUpdate: "2024-10-15",
    digitalTwinVersion: "2.2.0",
    lastModelUpdate: "2024-10-10",
    nextScheduledUpdate: "2025-04-15",
  },
  "glock-17": {
    status: "active",
    doctrineVersion: "3.5.0",
    lastDoctrineUpdate: "2024-09-20",
    digitalTwinVersion: "2.0.0",
    lastModelUpdate: "2024-09-15",
    nextScheduledUpdate: "2025-03-20",
  },
  pkm: {
    status: "active",
    doctrineVersion: "2.9.0",
    lastDoctrineUpdate: "2024-08-30",
    digitalTwinVersion: "1.8.0",
    lastModelUpdate: "2024-08-25",
    nextScheduledUpdate: "2025-02-28",
  },
  "m249-saw": {
    status: "active",
    doctrineVersion: "3.0.0",
    lastDoctrineUpdate: "2024-07-15",
    digitalTwinVersion: "1.7.5",
    lastModelUpdate: "2024-07-10",
    nextScheduledUpdate: "2025-01-31",
  },
};

// Version History Data
const versionHistory = [
  { date: "2025-01-15", system: "Dhanush", component: "Doctrine", version: "3.2.1", change: "Updated firing procedures for extreme cold conditions", author: "School of Artillery" },
  { date: "2025-01-10", system: "Dhanush", component: "3D Model", version: "2.1.0", change: "Enhanced breech detail and animation", author: "3D Team" },
  { date: "2024-12-20", system: "K9 Vajra", component: "Doctrine", version: "3.1.0", change: "Added shoot-and-scoot procedures", author: "School of Artillery" },
  { date: "2024-12-15", system: "AK-47", component: "3D Model", version: "2.2.0", change: "Improved wood texture and recoil animation", author: "3D Team" },
  { date: "2024-11-30", system: "Pinaka", component: "Doctrine", version: "2.8.3", change: "Updated salvo patterns for area targets", author: "DRDO" },
  { date: "2024-10-15", system: "All Systems", component: "Safety Protocols", version: "5.1.2", change: "Enhanced safety override rules", author: "Safety Directorate" },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-500 border-green-500/30",
  legacy: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  induction: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  planned: "bg-purple-500/20 text-purple-500 border-purple-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="h-4 w-4" />,
  legacy: <Clock className="h-4 w-4" />,
  induction: <Rocket className="h-4 w-4" />,
  planned: <Calendar className="h-4 w-4" />,
};

export default function GunSystemsPage() {
  const [selectedSystem, setSelectedSystem] = useState<GunSystem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const systemsByCategory = {
    towed: gunSystems.filter((g) => g.category === "towed"),
    "assault-rifle": gunSystems.filter((g) => g.category === "assault-rifle"),
    pistol: gunSystems.filter((g) => g.category === "pistol"),
    "machine-gun": gunSystems.filter((g) => g.category === "machine-gun"),
  };

  const openDetails = (system: GunSystem) => {
    setSelectedSystem(system);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gun Systems Management
          </h1>
          <Badge variant="secondary">{gunSystems.length} Systems</Badge>
        </div>
        <p className="text-muted-foreground">
          Configure and manage artillery gun systems for training simulations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(systemsByCategory).map(([category, systems]) => (
          <Card key={category} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {categoryLabels[category as GunCategory]}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {systems.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  {categoryIcons[category as GunCategory]}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gun Systems List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configured Gun Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Systems</TabsTrigger>
              <TabsTrigger value="towed">Towed</TabsTrigger>
              <TabsTrigger value="self-propelled">Self-Propelled</TabsTrigger>
              <TabsTrigger value="mbrl">MBRL</TabsTrigger>
            </TabsList>

            {["all", "towed", "self-propelled", "mbrl"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(tab === "all"
                    ? gunSystems
                    : gunSystems.filter((g) => g.category === tab)
                  ).map((system) => (
                    <Card
                      key={system.id}
                      className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => openDetails(system)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: system.modelColor }}
                          >
                            {categoryIcons[system.category]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{system.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {system.fullName}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {system.specs.caliber}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {system.origin}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <p className="text-lg font-bold">{system.specs.crewSize}</p>
                            <p className="text-[10px] text-muted-foreground">Crew</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{system.ammunition.length}</p>
                            <p className="text-[10px] text-muted-foreground">Ammo Types</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{system.features.length}</p>
                            <p className="text-[10px] text-muted-foreground">Features</p>
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

      {/* Version History */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Version Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {versionHistory.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {entry.date}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{entry.system}</span>
                    <Badge variant="secondary" className="text-xs">
                      {entry.component}
                    </Badge>
                    <Badge className="text-xs bg-primary">v{entry.version}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.change}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated by: {entry.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle Status Overview */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Lifecycle & Version Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">System</th>
                  <th className="text-center py-2 px-3">Status</th>
                  <th className="text-center py-2 px-3">Doctrine Ver.</th>
                  <th className="text-center py-2 px-3">Last Doctrine Update</th>
                  <th className="text-center py-2 px-3">3D Model Ver.</th>
                  <th className="text-center py-2 px-3">Next Scheduled</th>
                </tr>
              </thead>
              <tbody>
                {gunSystems.map((system) => {
                  const lifecycle = lifecycleStatus[system.id] || {
                    status: "active",
                    doctrineVersion: "1.0.0",
                    lastDoctrineUpdate: "N/A",
                    digitalTwinVersion: "1.0.0",
                    lastModelUpdate: "N/A",
                    nextScheduledUpdate: "TBD",
                  };
                  return (
                    <tr key={system.id} className="border-b border-border/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: system.modelColor }}
                          >
                            {categoryIcons[system.category]}
                          </div>
                          <span className="font-medium">{system.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge
                          variant="outline"
                          className={`${statusColors[lifecycle.status]} flex items-center gap-1 justify-center`}
                        >
                          {statusIcons[lifecycle.status]}
                          {lifecycle.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="outline">v{lifecycle.doctrineVersion}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center text-muted-foreground">
                        {lifecycle.lastDoctrineUpdate}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="secondary">v{lifecycle.digitalTwinVersion}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center text-muted-foreground">
                        {lifecycle.nextScheduledUpdate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedSystem && (
                <>
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: selectedSystem.modelColor }}
                  >
                    {categoryIcons[selectedSystem.category]}
                  </div>
                  <div>
                    <span>{selectedSystem.fullName}</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedSystem.origin} • In service since {selectedSystem.inServiceYear}
                    </p>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedSystem && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedSystem.description}
                  </p>
                </div>

                {/* Specifications */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Ruler className="h-4 w-4" />
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedSystem.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ammunition */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4" />
                    Ammunition Types
                  </h4>
                  <div className="space-y-2">
                    {selectedSystem.ammunition.map((ammo, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <Badge variant="outline" className="mr-2">{ammo.type}</Badge>
                          <span className="text-sm">{ammo.description}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{ammo.range}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crew Positions */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4" />
                    Crew Positions ({selectedSystem.crewPositions.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSystem.crewPositions.map((pos) => (
                      <div key={pos.id} className="p-3 bg-muted/50 rounded">
                        <p className="font-medium text-sm">{pos.title}</p>
                        <p className="text-xs text-muted-foreground">{pos.role} • {pos.location}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features & Advantages */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {selectedSystem.features.map((f, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Advantages</h4>
                    <ul className="space-y-1">
                      {selectedSystem.advantages.map((a, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-green-500">✓</span> {a}
                        </li>
                      ))}
                    </ul>
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
