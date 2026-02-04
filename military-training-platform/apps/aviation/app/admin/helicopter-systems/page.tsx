"use client";

import { useState } from "react";
import {
  Plane,
  Search,
  Info,
  Target,
  Shield,
  Gauge,
  ChevronDown,
  ChevronUp,
  Radar,
  Crosshair,
} from "lucide-react";
import { helicopterSystems, type HelicopterSystem } from "@/lib/helicopter-systems";

export default function HelicopterSystemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHelicopters = helicopterSystems.filter((heli) => {
    const matchesSearch =
      heli.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      heli.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || heli.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All Types" },
    { id: "attack", label: "Attack" },
    { id: "utility", label: "Utility" },
    { id: "light", label: "Light" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Helicopter Systems</h1>
              <p className="text-sm text-muted-foreground">
                Indian Army Aviation Helicopter Database (SOW Annexure G)
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search helicopters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Helicopter Cards */}
        <div className="grid gap-4">
          {filteredHelicopters.map((heli) => (
            <HelicopterCard
              key={heli.id}
              helicopter={heli}
              isExpanded={expandedId === heli.id}
              onToggle={() => setExpandedId(expandedId === heli.id ? null : heli.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HelicopterCard({
  helicopter,
  isExpanded,
  onToggle,
}: {
  helicopter: HelicopterSystem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const categoryColors = {
    attack: "bg-red-500/20 text-red-500",
    utility: "bg-emerald-500/20 text-emerald-500",
    light: "bg-green-500/20 text-green-500",
    trainer: "bg-emerald-500/20 text-emerald-500",
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: helicopter.primaryColor + "30" }}
          >
            <Plane className="w-8 h-8" style={{ color: helicopter.primaryColor }} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">{helicopter.name}</h3>
            <p className="text-sm text-muted-foreground">{helicopter.designation}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[helicopter.category]}`}>
                {helicopter.category.toUpperCase()}
              </span>
              {helicopter.roles.slice(0, 2).map((role) => (
                <span key={role} className="px-2 py-0.5 bg-muted rounded text-xs">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border space-y-4">
          {/* Description */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              Overview
            </h4>
            <p className="text-sm text-muted-foreground">{helicopter.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{helicopter.doctrinalContext}</p>
          </div>

          {/* Specs */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-primary" />
              Specifications
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SpecItem label="Max Speed" value={`${helicopter.specs.maxSpeed} km/h`} />
              <SpecItem label="Cruise Speed" value={`${helicopter.specs.cruiseSpeed} km/h`} />
              <SpecItem label="Service Ceiling" value={`${helicopter.specs.serviceCeiling}m`} />
              <SpecItem label="Range" value={`${helicopter.specs.range} km`} />
              <SpecItem label="Endurance" value={`${helicopter.specs.endurance} hrs`} />
              <SpecItem label="Max Takeoff" value={`${helicopter.specs.maxTakeoffWeight} kg`} />
              <SpecItem label="Crew" value={`${helicopter.specs.crew}`} />
              {helicopter.specs.passengers && (
                <SpecItem label="Passengers" value={`${helicopter.specs.passengers}`} />
              )}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Engines: {helicopter.specs.engines}</p>
              <p>Power: {helicopter.specs.enginePower}</p>
            </div>
          </div>

          {/* Weapons */}
          {helicopter.weapons && helicopter.weapons.length > 0 && (
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Crosshair className="w-4 h-4 text-primary" />
                Weapons Systems
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {helicopter.weapons.map((weapon, i) => (
                  <div key={i} className="p-2 bg-muted rounded-lg flex items-start gap-2">
                    <Target className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{weapon.name}</p>
                      <p className="text-xs text-muted-foreground">{weapon.description}</p>
                      {weapon.caliber && (
                        <p className="text-xs text-muted-foreground">Caliber: {weapon.caliber}</p>
                      )}
                      {weapon.range && (
                        <p className="text-xs text-muted-foreground">Range: {weapon.range}km</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sensors */}
          {helicopter.sensors && helicopter.sensors.length > 0 && (
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Radar className="w-4 h-4 text-primary" />
                Sensors & Systems
              </h4>
              <div className="flex flex-wrap gap-2">
                {helicopter.sensors.map((sensor, i) => (
                  <div key={i} className="px-3 py-1.5 bg-muted rounded-lg text-xs">
                    <span className="font-medium">{sensor.name}</span>
                    <span className="text-muted-foreground ml-1">({sensor.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {helicopter.variants && helicopter.variants.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Variants</h4>
              <div className="flex flex-wrap gap-2">
                {helicopter.variants.map((variant, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {variant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-muted rounded-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
