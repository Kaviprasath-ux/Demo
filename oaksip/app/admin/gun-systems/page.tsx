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
