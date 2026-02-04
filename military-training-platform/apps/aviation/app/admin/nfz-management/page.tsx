"use client";

import { useState } from "react";
import {
  Ban,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  AlertTriangle,
  Building,
  Shield,
  Trees,
  GraduationCap,
} from "lucide-react";
import { Button } from "@military/ui";
import { useROENFZStore, type NoFlyZone } from "@/lib/stores/roe-nfz-store";

const typeConfig = {
  permanent: { label: "Permanent", color: "text-red-500", bg: "bg-red-500/20" },
  temporary: { label: "Temporary", color: "text-yellow-500", bg: "bg-yellow-500/20" },
  conditional: { label: "Conditional", color: "text-emerald-500", bg: "bg-emerald-500/20" },
};

const reasonConfig = {
  military: { icon: Shield, label: "Military", color: "text-red-500" },
  civilian: { icon: Building, label: "Civilian", color: "text-emerald-500" },
  diplomatic: { icon: Building, label: "Diplomatic", color: "text-emerald-500" },
  environmental: { icon: Trees, label: "Environmental", color: "text-green-500" },
  training: { icon: GraduationCap, label: "Training", color: "text-yellow-500" },
};

export default function NFZManagementPage() {
  const { noFlyZones, toggleNoFlyZone, deleteNoFlyZone, addNoFlyZone } = useROENFZStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredZones = noFlyZones.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || zone.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const types = [
    { id: "all", label: "All Types" },
    { id: "permanent", label: "Permanent" },
    { id: "temporary", label: "Temporary" },
    { id: "conditional", label: "Conditional" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <Ban className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">No-Fly Zones</h1>
              <p className="text-sm text-muted-foreground">
                Manage restricted airspace and NFZs (SOW 6.7)
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add NFZ
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total NFZs"
            value={noFlyZones.length}
            icon={Ban}
            color="text-primary"
          />
          <StatCard
            label="Active"
            value={noFlyZones.filter((z) => z.isActive).length}
            icon={CheckCircle}
            color="text-green-500"
          />
          <StatCard
            label="Permanent"
            value={noFlyZones.filter((z) => z.type === "permanent").length}
            icon={AlertTriangle}
            color="text-red-500"
          />
          <StatCard
            label="Temporary"
            value={noFlyZones.filter((z) => z.type === "temporary").length}
            icon={Clock}
            color="text-yellow-500"
          />
        </div>

        {/* Map Preview */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3">NFZ Coverage Map</h3>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Simple grid background */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-muted-foreground"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-muted-foreground"
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </div>

            {/* NFZ markers */}
            {noFlyZones.filter(z => z.isActive).map((zone, i) => (
              <div
                key={zone.id}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center ${
                  zone.type === "permanent" ? "bg-red-500/30 border-2 border-red-500" :
                  zone.type === "temporary" ? "bg-yellow-500/30 border-2 border-yellow-500" :
                  "bg-emerald-500/30 border-2 border-emerald-500"
                }`}
                style={{
                  left: `${20 + (i * 25)}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
              >
                <Ban className={`w-6 h-6 ${
                  zone.type === "permanent" ? "text-red-500" :
                  zone.type === "temporary" ? "text-yellow-500" :
                  "text-emerald-500"
                }`} />
              </div>
            ))}

            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
              Schematic view • Actual coordinates in zone details
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search no-fly zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setTypeFilter(type.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === type.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* NFZ List */}
        <div className="space-y-3">
          {filteredZones.map((zone) => (
            <NFZCard
              key={zone.id}
              zone={zone}
              isExpanded={expandedId === zone.id}
              onToggle={() => setExpandedId(expandedId === zone.id ? null : zone.id)}
              onToggleActive={() => toggleNoFlyZone(zone.id)}
              onDelete={() => deleteNoFlyZone(zone.id)}
            />
          ))}
        </div>

        {filteredZones.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Ban className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No NFZs found matching your criteria.</p>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <AddNFZModal
            onClose={() => setShowAddModal(false)}
            onAdd={(zone) => {
              addNoFlyZone(zone);
              setShowAddModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color} opacity-50`} />
      </div>
    </div>
  );
}

function NFZCard({
  zone,
  isExpanded,
  onToggle,
  onToggleActive,
  onDelete,
}: {
  zone: NoFlyZone;
  isExpanded: boolean;
  onToggle: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const typeConf = typeConfig[zone.type];
  const reasonConf = reasonConfig[zone.reason];
  const ReasonIcon = reasonConf.icon;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${typeConf.bg}`}>
            <Ban className={`w-5 h-5 ${typeConf.color}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{zone.name}</h3>
              {zone.isActive ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{zone.code}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConf.bg} ${typeConf.color}`}>
                {typeConf.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ReasonIcon className={`w-3 h-3 ${reasonConf.color}`} />
                {reasonConf.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="text-muted-foreground">
              {zone.altitudeMin}-{zone.altitudeMax} ft
            </p>
            {zone.radius && (
              <p className="text-xs text-muted-foreground">{zone.radius}km radius</p>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-border space-y-4">
          {/* Location */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Location
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Center</p>
                <p className="font-mono">{zone.center[0].toFixed(4)}°N, {zone.center[1].toFixed(4)}°E</p>
              </div>
              {zone.radius && (
                <div>
                  <p className="text-muted-foreground">Radius</p>
                  <p>{zone.radius} km</p>
                </div>
              )}
            </div>
            {zone.coordinates.length > 0 && (
              <div className="mt-2">
                <p className="text-muted-foreground text-xs mb-1">Polygon Coordinates</p>
                <div className="flex flex-wrap gap-2">
                  {zone.coordinates.map((coord, i) => (
                    <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                      {coord[0].toFixed(2)}, {coord[1].toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Altitude */}
          <div>
            <h4 className="text-sm font-medium mb-2">Altitude Restrictions</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Floor</p>
                <p className="font-medium">{zone.altitudeMin.toLocaleString()} ft AGL</p>
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="flex-1 bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Ceiling</p>
                <p className="font-medium">{zone.altitudeMax.toLocaleString()} ft AGL</p>
              </div>
            </div>
          </div>

          {/* Exceptions */}
          {zone.exceptions && zone.exceptions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Exceptions</h4>
              <ul className="space-y-1">
                {zone.exceptions.map((exception, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {exception}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Effective Dates */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              From: {new Date(zone.effectiveFrom).toLocaleDateString()}
            </span>
            {zone.effectiveTo && (
              <span>To: {new Date(zone.effectiveTo).toLocaleDateString()}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant={zone.isActive ? "outline" : "default"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive();
              }}
            >
              {zone.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddNFZModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (zone: Omit<NoFlyZone, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "temporary" as NoFlyZone["type"],
    reason: "military" as NoFlyZone["reason"],
    coordinates: [] as [number, number][],
    center: [0, 0] as [number, number],
    radius: 10,
    altitudeMin: 0,
    altitudeMax: 10000,
    isActive: true,
    effectiveFrom: new Date(),
    exceptions: [""],
  });

  const [centerLat, setCenterLat] = useState("28.0");
  const [centerLng, setCenterLng] = useState("77.0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      center: [parseFloat(centerLat), parseFloat(centerLng)],
      coordinates: [
        [parseFloat(centerLat) + 0.1, parseFloat(centerLng) - 0.1],
        [parseFloat(centerLat) + 0.1, parseFloat(centerLng) + 0.1],
        [parseFloat(centerLat) - 0.1, parseFloat(centerLng) + 0.1],
        [parseFloat(centerLat) - 0.1, parseFloat(centerLng) - 0.1],
      ],
      exceptions: formData.exceptions.filter((e) => e.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">Add No-Fly Zone</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Zone Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Zone Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="NFZ-XXX-001"
              className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              >
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
                <option value="conditional">Conditional</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Reason</label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              >
                <option value="military">Military</option>
                <option value="civilian">Civilian</option>
                <option value="diplomatic">Diplomatic</option>
                <option value="environmental">Environmental</option>
                <option value="training">Training</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Center Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={centerLat}
                onChange={(e) => setCenterLat(e.target.value)}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Center Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={centerLng}
                onChange={(e) => setCenterLng(e.target.value)}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Radius (km)</label>
            <input
              type="number"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
              className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Min Altitude (ft AGL)</label>
              <input
                type="number"
                value={formData.altitudeMin}
                onChange={(e) => setFormData({ ...formData, altitudeMin: parseInt(e.target.value) })}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Altitude (ft AGL)</label>
              <input
                type="number"
                value={formData.altitudeMax}
                onChange={(e) => setFormData({ ...formData, altitudeMax: parseInt(e.target.value) })}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Exceptions</label>
            {formData.exceptions.map((exception, i) => (
              <input
                key={i}
                type="text"
                value={exception}
                onChange={(e) => {
                  const newExceptions = [...formData.exceptions];
                  newExceptions[i] = e.target.value;
                  setFormData({ ...formData, exceptions: newExceptions });
                }}
                placeholder={`Exception ${i + 1}`}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              />
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, exceptions: [...formData.exceptions, ""] })}
              className="text-sm text-primary hover:underline mt-1"
            >
              + Add Exception
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm">Active immediately</label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add NFZ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
