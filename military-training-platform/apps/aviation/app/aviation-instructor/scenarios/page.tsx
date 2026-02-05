"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Crosshair,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Copy,
  Plane,
  Clock,
  Mountain,
  Shield,
  Target,
} from "lucide-react";
import {
  useAviationInstructorStore,
  FlightScenario,
} from "@/lib/stores/aviation-instructor-store";

export default function ScenariosPage() {
  const { scenarios, addScenario, updateScenario, deleteScenario } =
    useAviationInstructorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<FlightScenario | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "cas-mission" as FlightScenario["type"],
    difficulty: "basic" as FlightScenario["difficulty"],
    helicopterType: "",
    duration: 60,
    objectives: [""],
    weatherConditions: {
      visibility: "10km+",
      windSpeed: "5-10 knots",
      ceiling: "3000ft AGL",
      conditions: "clear" as FlightScenario["weatherConditions"]["conditions"],
    },
    terrainType: "plains" as FlightScenario["terrainType"],
    threatLevel: "none" as FlightScenario["threatLevel"],
    coordinationRequired: false,
    passingScore: 70,
    isActive: true,
    createdAt: new Date().toISOString().split("T")[0],
  });

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || scenario.type === typeFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || scenario.difficulty === difficultyFilter;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "cas-mission",
      difficulty: "basic",
      helicopterType: "",
      duration: 60,
      objectives: [""],
      weatherConditions: {
        visibility: "10km+",
        windSpeed: "5-10 knots",
        ceiling: "3000ft AGL",
        conditions: "clear",
      },
      terrainType: "plains",
      threatLevel: "none",
      coordinationRequired: false,
      passingScore: 70,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleAdd = () => {
    addScenario({
      ...formData,
      objectives: formData.objectives.filter((o) => o.trim() !== ""),
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedScenario) {
      updateScenario(selectedScenario.id, {
        ...formData,
        objectives: formData.objectives.filter((o) => o.trim() !== ""),
      });
      setShowEditModal(false);
      setSelectedScenario(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedScenario) {
      deleteScenario(selectedScenario.id);
      setShowDeleteModal(false);
      setSelectedScenario(null);
    }
  };

  const handleDuplicate = (scenario: FlightScenario) => {
    addScenario({
      ...scenario,
      name: `${scenario.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  const openEditModal = (scenario: FlightScenario) => {
    setSelectedScenario(scenario);
    setFormData({
      name: scenario.name,
      description: scenario.description,
      type: scenario.type,
      difficulty: scenario.difficulty,
      helicopterType: scenario.helicopterType,
      duration: scenario.duration,
      objectives: scenario.objectives.length > 0 ? scenario.objectives : [""],
      weatherConditions: scenario.weatherConditions,
      terrainType: scenario.terrainType,
      threatLevel: scenario.threatLevel,
      coordinationRequired: scenario.coordinationRequired,
      passingScore: scenario.passingScore,
      isActive: scenario.isActive,
      createdAt: scenario.createdAt,
    });
    setShowEditModal(true);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "cas-mission": "bg-red-500/20 text-red-400",
      reconnaissance: "bg-primary/20 text-primary",
      "troop-transport": "bg-primary/20 text-primary",
      medevac: "bg-primary/20 text-primary",
      "search-rescue": "bg-primary/20 text-primary",
      "nap-of-earth": "bg-primary/20 text-primary",
      "night-ops": "bg-gray-500/20 text-muted-foreground",
    };
    return colors[type] || "bg-gray-500/20 text-muted-foreground";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      basic: "bg-primary/20 text-primary",
      intermediate: "bg-primary/20 text-primary",
      advanced: "bg-primary/20 text-primary",
      "combat-ready": "bg-red-500/20 text-red-400",
    };
    return colors[difficulty] || "bg-gray-500/20 text-muted-foreground";
  };

  const getThreatColor = (threat: string) => {
    const colors: Record<string, string> = {
      none: "text-primary",
      low: "text-primary",
      medium: "text-primary",
      high: "text-red-400",
    };
    return colors[threat] || "text-muted-foreground";
  };

  const addObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ""] });
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-primary" />
            Flight Scenarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage flight training scenarios for CAS and joint operations
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="cas-mission">CAS Mission</option>
          <option value="reconnaissance">Reconnaissance</option>
          <option value="troop-transport">Troop Transport</option>
          <option value="medevac">MEDEVAC</option>
          <option value="search-rescue">Search & Rescue</option>
          <option value="nap-of-earth">Nap-of-Earth</option>
          <option value="night-ops">Night Operations</option>
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Difficulty</option>
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="combat-ready">Combat Ready</option>
        </select>
      </div>

      {/* Scenarios Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`bg-card border rounded-lg p-4 hover:border-border transition-colors ${
              scenario.isActive ? "border-border" : "border-border opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{scenario.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(scenario.type)}`}>
                    {scenario.type.replace("-", " ")}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(scenario.difficulty)}`}
                  >
                    {scenario.difficulty}
                  </span>
                </div>
              </div>
              {!scenario.isActive && (
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  Inactive
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{scenario.description}</p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Plane className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{scenario.helicopterType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{scenario.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mountain className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground capitalize">{scenario.terrainType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className={`w-4 h-4 ${getThreatColor(scenario.threatLevel)}`} />
                <span className={getThreatColor(scenario.threatLevel)}>
                  {scenario.threatLevel} threat
                </span>
              </div>
            </div>

            {scenario.coordinationRequired && (
              <div className="mb-4 px-2 py-1 bg-primary/10 rounded-lg">
                <span className="text-xs text-primary">Requires FOO Coordination</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedScenario(scenario);
                  setShowViewModal(true);
                }}
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(scenario)}
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDuplicate(scenario)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedScenario(scenario);
                  setShowDeleteModal(true);
                }}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <Crosshair className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No scenarios found matching your criteria</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Create Flight Scenario</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Scenario Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g., Mountain CAS - Advanced"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    placeholder="Describe the scenario..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as FlightScenario["type"] })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="cas-mission">CAS Mission</option>
                    <option value="reconnaissance">Reconnaissance</option>
                    <option value="troop-transport">Troop Transport</option>
                    <option value="medevac">MEDEVAC</option>
                    <option value="search-rescue">Search & Rescue</option>
                    <option value="nap-of-earth">Nap-of-Earth</option>
                    <option value="night-ops">Night Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as FlightScenario["difficulty"],
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="combat-ready">Combat Ready</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Helicopter Type *</label>
                  <select
                    value={formData.helicopterType}
                    onChange={(e) => setFormData({ ...formData, helicopterType: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Select helicopter</option>
                    <option value="ALH Dhruv">ALH Dhruv</option>
                    <option value="Rudra">Rudra (ALH WSI)</option>
                    <option value="Chetak">Chetak</option>
                    <option value="Apache AH-64E">Apache AH-64E</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Terrain Type</label>
                  <select
                    value={formData.terrainType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terrainType: e.target.value as FlightScenario["terrainType"],
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="plains">Plains</option>
                    <option value="mountains">Mountains</option>
                    <option value="urban">Urban</option>
                    <option value="desert">Desert</option>
                    <option value="jungle">Jungle</option>
                    <option value="maritime">Maritime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Threat Level</label>
                  <select
                    value={formData.threatLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        threatLevel: e.target.value as FlightScenario["threatLevel"],
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Weather Conditions */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Weather Conditions</label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Visibility"
                    value={formData.weatherConditions.visibility}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weatherConditions: { ...formData.weatherConditions, visibility: e.target.value },
                      })
                    }
                    className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Wind Speed"
                    value={formData.weatherConditions.windSpeed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weatherConditions: { ...formData.weatherConditions, windSpeed: e.target.value },
                      })
                    }
                    className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Ceiling"
                    value={formData.weatherConditions.ceiling}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weatherConditions: { ...formData.weatherConditions, ceiling: e.target.value },
                      })
                    }
                    className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
                  />
                  <select
                    value={formData.weatherConditions.conditions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weatherConditions: {
                          ...formData.weatherConditions,
                          conditions: e.target.value as FlightScenario["weatherConditions"]["conditions"],
                        },
                      })
                    }
                    className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="clear">Clear</option>
                    <option value="overcast">Overcast</option>
                    <option value="rain">Rain</option>
                    <option value="fog">Fog</option>
                    <option value="night">Night</option>
                  </select>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Objectives</label>
                {formData.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      placeholder={`Objective ${index + 1}`}
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                        className="text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addObjective} className="text-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Objective
                </Button>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.coordinationRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, coordinationRequired: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-emerald-500"
                  />
                  Requires FOO Coordination
                </label>
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-emerald-500"
                  />
                  Active Scenario
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!formData.name || !formData.description || !formData.helicopterType}
                className="bg-primary hover:bg-primary/90"
              >
                Create Scenario
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Edit Scenario</h2>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Scenario Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as FlightScenario["type"] })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="cas-mission">CAS Mission</option>
                    <option value="reconnaissance">Reconnaissance</option>
                    <option value="troop-transport">Troop Transport</option>
                    <option value="medevac">MEDEVAC</option>
                    <option value="search-rescue">Search & Rescue</option>
                    <option value="nap-of-earth">Nap-of-Earth</option>
                    <option value="night-ops">Night Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as FlightScenario["difficulty"],
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="combat-ready">Combat Ready</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Helicopter Type</label>
                  <select
                    value={formData.helicopterType}
                    onChange={(e) => setFormData({ ...formData, helicopterType: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="ALH Dhruv">ALH Dhruv</option>
                    <option value="Rudra">Rudra (ALH WSI)</option>
                    <option value="Chetak">Chetak</option>
                    <option value="Apache AH-64E">Apache AH-64E</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Terrain Type</label>
                  <select
                    value={formData.terrainType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terrainType: e.target.value as FlightScenario["terrainType"],
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="plains">Plains</option>
                    <option value="mountains">Mountains</option>
                    <option value="urban">Urban</option>
                    <option value="desert">Desert</option>
                    <option value="jungle">Jungle</option>
                    <option value="maritime">Maritime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Threat Level</label>
                  <select
                    value={formData.threatLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        threatLevel: e.target.value as FlightScenario["threatLevel"],
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Objectives</label>
                {formData.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                        className="text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addObjective} className="text-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Objective
                </Button>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.coordinationRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, coordinationRequired: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-emerald-500"
                  />
                  Requires FOO Coordination
                </label>
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-emerald-500"
                  />
                  Active Scenario
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Scenario Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{selectedScenario.name}</h3>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(selectedScenario.type)}`}>
                      {selectedScenario.type.replace("-", " ")}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getDifficultyColor(selectedScenario.difficulty)}`}
                    >
                      {selectedScenario.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">{selectedScenario.description}</p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Helicopter</span>
                  </div>
                  <p className="text-foreground font-medium">{selectedScenario.helicopterType}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Duration</span>
                  </div>
                  <p className="text-foreground font-medium">{selectedScenario.duration} minutes</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Mountain className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Terrain</span>
                  </div>
                  <p className="text-foreground font-medium capitalize">{selectedScenario.terrainType}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className={`w-4 h-4 ${getThreatColor(selectedScenario.threatLevel)}`} />
                    <span className="text-sm text-muted-foreground">Threat Level</span>
                  </div>
                  <p className={`font-medium capitalize ${getThreatColor(selectedScenario.threatLevel)}`}>
                    {selectedScenario.threatLevel}
                  </p>
                </div>
              </div>

              {/* Weather Conditions */}
              <div>
                <h4 className="text-foreground font-semibold mb-3">Weather Conditions</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Visibility</p>
                    <p className="text-foreground text-sm">{selectedScenario.weatherConditions.visibility}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Wind</p>
                    <p className="text-foreground text-sm">{selectedScenario.weatherConditions.windSpeed}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ceiling</p>
                    <p className="text-foreground text-sm">{selectedScenario.weatherConditions.ceiling}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Conditions</p>
                    <p className="text-foreground text-sm capitalize">
                      {selectedScenario.weatherConditions.conditions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="text-foreground font-semibold mb-3">Objectives</h4>
                <ul className="space-y-2">
                  {selectedScenario.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary mt-0.5" />
                      <span className="text-gray-300">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-muted/50 rounded-lg px-4 py-2">
                  <span className="text-sm text-muted-foreground">Passing Score: </span>
                  <span className="text-foreground font-medium">{selectedScenario.passingScore}%</span>
                </div>
                {selectedScenario.coordinationRequired && (
                  <div className="bg-primary/10 rounded-lg px-4 py-2">
                    <span className="text-primary">Requires FOO Coordination</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="ghost" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md m-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Delete Scenario</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete{" "}
                <span className="text-foreground font-medium">{selectedScenario.name}</span>? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
