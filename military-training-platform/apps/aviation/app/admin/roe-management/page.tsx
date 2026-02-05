"use client";

import { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Crosshair,
  Plane,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@military/ui";
import { useROENFZStore, type ROERule } from "@/lib/stores/roe-nfz-store";

const categoryConfig = {
  weapons: { icon: Crosshair, color: "text-red-500", bg: "bg-red-500/20" },
  airspace: { icon: Plane, color: "text-primary", bg: "bg-primary/20" },
  coordination: { icon: Users, color: "text-primary", bg: "bg-primary/20" },
  safety: { icon: Shield, color: "text-primary", bg: "bg-primary/20" },
  general: { icon: FileText, color: "text-muted-foreground", bg: "bg-gray-500/20" },
};

const clearanceConfig = {
  restricted: { label: "Restricted", color: "text-primary", bg: "bg-primary/20" },
  confidential: { label: "Confidential", color: "text-primary", bg: "bg-primary/20" },
  secret: { label: "Secret", color: "text-red-500", bg: "bg-red-500/20" },
};

export default function ROEManagementPage() {
  const { roeRules, toggleROERule, deleteROERule, addROERule } = useROENFZStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredRules = roeRules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || rule.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "weapons", label: "Weapons" },
    { id: "airspace", label: "Airspace" },
    { id: "coordination", label: "Coordination" },
    { id: "safety", label: "Safety" },
    { id: "general", label: "General" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Rules of Engagement</h1>
              <p className="text-sm text-muted-foreground">
                Manage ROE policies for aviation operations (SOW 6.7)
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add ROE Rule
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Rules"
            value={roeRules.length}
            icon={FileText}
            color="text-primary"
          />
          <StatCard
            label="Active"
            value={roeRules.filter((r) => r.isActive).length}
            icon={CheckCircle}
            color="text-primary"
          />
          <StatCard
            label="Weapons ROE"
            value={roeRules.filter((r) => r.category === "weapons").length}
            icon={Crosshair}
            color="text-red-500"
          />
          <StatCard
            label="Secret Level"
            value={roeRules.filter((r) => r.clearanceRequired === "secret").length}
            icon={Lock}
            color="text-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ROE rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

        {/* ROE Rules List */}
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <ROERuleCard
              key={rule.id}
              rule={rule}
              isExpanded={expandedId === rule.id}
              onToggle={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
              onToggleActive={() => toggleROERule(rule.id)}
              onDelete={() => deleteROERule(rule.id)}
            />
          ))}
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No ROE rules found matching your criteria.</p>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <AddROEModal
            onClose={() => setShowAddModal(false)}
            onAdd={(rule) => {
              addROERule(rule);
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

function ROERuleCard({
  rule,
  isExpanded,
  onToggle,
  onToggleActive,
  onDelete,
}: {
  rule: ROERule;
  isExpanded: boolean;
  onToggle: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const catConfig = categoryConfig[rule.category];
  const clearConfig = clearanceConfig[rule.clearanceRequired];
  const CategoryIcon = catConfig.icon;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${catConfig.bg}`}>
            <CategoryIcon className={`w-5 h-5 ${catConfig.color}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{rule.name}</h3>
              {rule.isActive ? (
                <CheckCircle className="w-4 h-4 text-primary" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{rule.code}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${catConfig.bg} ${catConfig.color}`}>
                {rule.category.toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${clearConfig.bg} ${clearConfig.color}`}>
                {clearConfig.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {rule.conditions.length} conditions
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-border space-y-4">
          {/* Authority */}
          <div>
            <h4 className="text-sm font-medium mb-1">Authority</h4>
            <p className="text-sm text-muted-foreground">{rule.authority}</p>
          </div>

          {/* Conditions */}
          <div>
            <h4 className="text-sm font-medium mb-2">Conditions</h4>
            <ul className="space-y-1">
              {rule.conditions.map((condition, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          {/* Restrictions */}
          <div>
            <h4 className="text-sm font-medium mb-2">Restrictions</h4>
            <ul className="space-y-1">
              {rule.restrictions.map((restriction, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {restriction}
                </li>
              ))}
            </ul>
          </div>

          {/* Effective Dates */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Effective: {new Date(rule.effectiveFrom).toLocaleDateString()}</span>
            {rule.effectiveTo && (
              <span>Expires: {new Date(rule.effectiveTo).toLocaleDateString()}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant={rule.isActive ? "outline" : "default"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive();
              }}
            >
              {rule.isActive ? "Deactivate" : "Activate"}
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

function AddROEModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (rule: Omit<ROERule, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "general" as ROERule["category"],
    conditions: [""],
    restrictions: [""],
    authority: "",
    clearanceRequired: "restricted" as ROERule["clearanceRequired"],
    isActive: true,
    effectiveFrom: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      conditions: formData.conditions.filter((c) => c.trim()),
      restrictions: formData.restrictions.filter((r) => r.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">Add ROE Rule</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rule Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Rule Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="ROE-XXX-001"
              className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              >
                <option value="weapons">Weapons</option>
                <option value="airspace">Airspace</option>
                <option value="coordination">Coordination</option>
                <option value="safety">Safety</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Clearance Level</label>
              <select
                value={formData.clearanceRequired}
                onChange={(e) => setFormData({ ...formData, clearanceRequired: e.target.value as any })}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              >
                <option value="restricted">Restricted</option>
                <option value="confidential">Confidential</option>
                <option value="secret">Secret</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Authority</label>
            <input
              type="text"
              value={formData.authority}
              onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
              className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Conditions</label>
            {formData.conditions.map((condition, i) => (
              <input
                key={i}
                type="text"
                value={condition}
                onChange={(e) => {
                  const newConditions = [...formData.conditions];
                  newConditions[i] = e.target.value;
                  setFormData({ ...formData, conditions: newConditions });
                }}
                placeholder={`Condition ${i + 1}`}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              />
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, conditions: [...formData.conditions, ""] })}
              className="text-sm text-primary hover:underline mt-1"
            >
              + Add Condition
            </button>
          </div>

          <div>
            <label className="text-sm font-medium">Restrictions</label>
            {formData.restrictions.map((restriction, i) => (
              <input
                key={i}
                type="text"
                value={restriction}
                onChange={(e) => {
                  const newRestrictions = [...formData.restrictions];
                  newRestrictions[i] = e.target.value;
                  setFormData({ ...formData, restrictions: newRestrictions });
                }}
                placeholder={`Restriction ${i + 1}`}
                className="w-full mt-1 p-2 bg-muted border border-border rounded-lg"
              />
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, restrictions: [...formData.restrictions, ""] })}
              className="text-sm text-primary hover:underline mt-1"
            >
              + Add Restriction
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
              Add Rule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
