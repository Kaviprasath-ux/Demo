"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crosshair, Info, ChevronRight, Swords, CircleDot, Target } from "lucide-react";
import { useTrainingStore } from "@/lib/training-store";
import { gunSystems, type GunSystem, type GunSystemId, type GunCategory } from "@/lib/gun-systems";

const categoryIcons: Record<GunCategory, React.ReactNode> = {
  towed: <Crosshair className="h-4 w-4" />,
  "assault-rifle": <Swords className="h-4 w-4" />,
  pistol: <CircleDot className="h-4 w-4" />,
  "machine-gun": <Target className="h-4 w-4" />,
};

const categoryLabels: Record<GunCategory, string> = {
  towed: "Towed Artillery",
  "assault-rifle": "Assault Rifle",
  pistol: "Pistol",
  "machine-gun": "Machine Gun",
};

interface GunSystemCardProps {
  system: GunSystem;
  isSelected: boolean;
  onSelect: () => void;
}

function GunSystemCard({ system, isSelected, onSelect }: GunSystemCardProps) {
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
        {/* Color indicator */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: system.modelColor }}
        >
          {categoryIcons[system.category]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{system.name}</h4>
            <Badge variant="outline" className="text-[10px] px-1.5">
              {categoryLabels[system.category]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {system.specs.caliber} • {system.specs.maxRange}
          </p>
        </div>

        <ChevronRight
          className={`h-4 w-4 transition-transform flex-shrink-0 ${
            isSelected ? "text-primary rotate-90" : "text-muted-foreground"
          }`}
        />
      </div>
    </button>
  );
}

export function GunSystemSelector() {
  const { selectedGunSystem, setGunSystem, getGunSystemInfo } = useTrainingStore();
  const currentSystem = getGunSystemInfo();

  return (
    <div className="space-y-4">
      {/* System List */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Select Gun System
        </h4>
        <div className="space-y-2">
          {gunSystems.map((system) => (
            <GunSystemCard
              key={system.id}
              system={system}
              isSelected={selectedGunSystem === system.id}
              onSelect={() => setGunSystem(system.id)}
            />
          ))}
        </div>
      </div>

      {/* Selected System Details */}
      {currentSystem && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              {currentSystem.fullName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {currentSystem.description}
            </p>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Range: </span>
                <span className="font-medium">{currentSystem.specs.maxRange}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Crew: </span>
                <span className="font-medium">{currentSystem.specs.crewSize}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ROF: </span>
                <span className="font-medium">{currentSystem.specs.rateOfFire}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Elevation: </span>
                <span className="font-medium">{currentSystem.specs.elevation}</span>
              </div>
            </div>

            {/* Features */}
            <div>
              <span className="text-xs text-muted-foreground">Key Features:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentSystem.features.slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px]">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Compact selector for sidebar/header
export function GunSystemSelectorCompact() {
  const { selectedGunSystem, setGunSystem, getGunSystemInfo } = useTrainingStore();
  const currentSystem = getGunSystemInfo();

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">Gun System</label>
      <select
        value={selectedGunSystem}
        onChange={(e) => setGunSystem(e.target.value as GunSystemId)}
        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {gunSystems.map((system) => (
          <option key={system.id} value={system.id}>
            {system.name} ({system.specs.caliber})
          </option>
        ))}
      </select>
      {currentSystem && (
        <p className="text-[10px] text-muted-foreground">
          {currentSystem.origin} • {categoryLabels[currentSystem.category]}
        </p>
      )}
    </div>
  );
}

// Full info panel for selected system
export function GunSystemInfoPanel() {
  const { getGunSystemInfo } = useTrainingStore();
  const system = getGunSystemInfo();

  if (!system) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: system.modelColor }}
          >
            {categoryIcons[system.category]}
          </div>
          <div>
            <div className="text-base">{system.fullName}</div>
            <div className="text-xs font-normal text-muted-foreground">
              {system.origin} • In service since {system.inServiceYear}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">{system.description}</p>

        {/* Specifications */}
        <div>
          <h4 className="text-sm font-medium mb-2">Technical Specifications</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Caliber:</span>
              <span>{system.specs.caliber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Barrel:</span>
              <span>{system.specs.barrelLength}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Range:</span>
              <span>{system.specs.maxRange}</span>
            </div>
            {system.specs.maxRangeExtended && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Extended:</span>
                <span>{system.specs.maxRangeExtended}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Muzzle Vel:</span>
              <span>{system.specs.muzzleVelocity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ROF:</span>
              <span>{system.specs.rateOfFire}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Elevation:</span>
              <span>{system.specs.elevation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Traverse:</span>
              <span>{system.specs.traverse}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Crew:</span>
              <span>{system.specs.crewSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight:</span>
              <span>{system.specs.weight}</span>
            </div>
          </div>
        </div>

        {/* Ammunition */}
        <div>
          <h4 className="text-sm font-medium mb-2">Ammunition Types</h4>
          <ScrollArea className="h-24">
            <div className="space-y-1">
              {system.ammunition.map((ammo, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>
                    <Badge variant="outline" className="text-[10px] mr-1">
                      {ammo.type}
                    </Badge>
                    {ammo.description}
                  </span>
                  <span className="text-muted-foreground">{ammo.range}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Crew Positions */}
        <div>
          <h4 className="text-sm font-medium mb-2">Crew Positions</h4>
          <div className="flex flex-wrap gap-1">
            {system.crewPositions.map((pos) => (
              <Badge key={pos.id} variant="secondary" className="text-[10px]">
                {pos.title}
              </Badge>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div>
          <h4 className="text-sm font-medium mb-2">Advantages</h4>
          <ul className="text-xs space-y-1">
            {system.advantages.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {adv}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
