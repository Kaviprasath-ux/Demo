"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Target,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  BarChart3,
  X,
  ChevronRight,
  Filter,
  Crosshair,
  MapPin,
  Cloud,
  Users,
  AlertTriangle,
  Play,
  Copy,
} from "lucide-react";
import {
  useArtilleryInstructorStore,
  FireMissionScenario,
} from "@/lib/stores/artillery-instructor-store";

export default function ScenariosPage() {
  const { scenarios, addScenario, updateScenario, removeScenario } =
    useArtilleryInstructorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedScenario, setSelectedScenario] = useState<FireMissionScenario | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingScenario, setEditingScenario] = useState<FireMissionScenario | null>(null);

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.targetType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || scenario.type === typeFilter;
    const matchesDifficulty = difficultyFilter === "all" || scenario.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "all" || scenario.status === statusFilter;
    return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
  });

  const stats = {
    total: scenarios.length,
    active: scenarios.filter((s) => s.status === "active").length,
    cas: scenarios.filter((s) => s.type === "cas").length,
    avgScore: scenarios.length > 0
      ? Math.round(scenarios.reduce((sum, s) => sum + s.averageScore, 0) / scenarios.length)
      : 0,
  };

  const getTypeColor = (type: FireMissionScenario["type"]) => {
    switch (type) {
      case "cas":
        return "bg-red-500/20 text-red-400";
      case "direct-fire":
        return "bg-emerald-500/20 text-emerald-400";
      case "indirect-fire":
        return "bg-yellow-500/20 text-yellow-400";
      case "suppression":
        return "bg-emerald-500/20 text-emerald-400";
      case "illumination":
        return "bg-emerald-500/20 text-emerald-400";
      case "smoke":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: FireMissionScenario["difficulty"]) => {
    switch (difficulty) {
      case "basic":
        return "bg-green-500/20 text-green-400";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400";
      case "advanced":
        return "bg-emerald-500/20 text-emerald-400";
      case "expert":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status: FireMissionScenario["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleAddScenario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addScenario({
      title: formData.get("title") as string,
      code: `SCN-${formData.get("type")?.toString().toUpperCase()}-${Date.now().toString().slice(-4)}`,
      type: formData.get("type") as FireMissionScenario["type"],
      difficulty: formData.get("difficulty") as FireMissionScenario["difficulty"],
      status: "draft",
      terrain: formData.get("terrain") as string,
      weather: formData.get("weather") as string,
      visibility: formData.get("visibility") as string,
      targetType: formData.get("targetType") as string,
      targetDescription: formData.get("targetDescription") as string,
      gridReference: formData.get("gridReference") as string,
      altitude: formData.get("altitude") as string,
      friendlyPositions: formData.get("friendlyPositions") as string,
      enemyPositions: formData.get("enemyPositions") as string,
      aircraftType: formData.get("aircraftType") as string,
      munitionsAllowed: (formData.get("munitionsAllowed") as string).split(",").map(m => m.trim()),
      timeLimit: parseInt(formData.get("timeLimit") as string) || 15,
      objectives: (formData.get("objectives") as string).split("\n").filter(o => o.trim()),
      evaluationCriteria: [],
      briefingNotes: formData.get("briefingNotes") as string,
      debrief: "",
      createdBy: "Current Instructor",
      createdAt: new Date().toISOString().split("T")[0],
      timesUsed: 0,
      averageScore: 0,
    });
    setShowAddDialog(false);
  };

  const handleEditScenario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingScenario) return;

    const formData = new FormData(e.currentTarget);
    updateScenario(editingScenario.id, {
      title: formData.get("title") as string,
      type: formData.get("type") as FireMissionScenario["type"],
      difficulty: formData.get("difficulty") as FireMissionScenario["difficulty"],
      status: formData.get("status") as FireMissionScenario["status"],
      terrain: formData.get("terrain") as string,
      weather: formData.get("weather") as string,
      visibility: formData.get("visibility") as string,
      targetType: formData.get("targetType") as string,
      targetDescription: formData.get("targetDescription") as string,
      gridReference: formData.get("gridReference") as string,
      altitude: formData.get("altitude") as string,
      friendlyPositions: formData.get("friendlyPositions") as string,
      enemyPositions: formData.get("enemyPositions") as string,
      aircraftType: formData.get("aircraftType") as string,
      munitionsAllowed: (formData.get("munitionsAllowed") as string).split(",").map(m => m.trim()),
      timeLimit: parseInt(formData.get("timeLimit") as string) || 15,
      briefingNotes: formData.get("briefingNotes") as string,
    });
    setShowEditDialog(false);
    setEditingScenario(null);
  };

  const handleDeleteScenario = (id: string) => {
    removeScenario(id);
    setShowDeleteConfirm(null);
    if (selectedScenario?.id === id) {
      setSelectedScenario(null);
    }
  };

  const duplicateScenario = (scenario: FireMissionScenario) => {
    addScenario({
      ...scenario,
      title: `${scenario.title} (Copy)`,
      code: `SCN-${scenario.type.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      timesUsed: 0,
      averageScore: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-500" />
            Fire Mission Scenarios
          </h1>
          <p className="text-gray-400 mt-1">
            Create and manage training scenarios for CAS and fire support missions
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Scenarios</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Play className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Crosshair className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.cas}</p>
              <p className="text-sm text-gray-400">CAS Scenarios</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgScore}%</p>
              <p className="text-sm text-gray-400">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          >
            <option value="all">All Types</option>
            <option value="cas">CAS</option>
            <option value="direct-fire">Direct Fire</option>
            <option value="indirect-fire">Indirect Fire</option>
            <option value="suppression">Suppression</option>
            <option value="illumination">Illumination</option>
            <option value="smoke">Smoke</option>
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          >
            <option value="all">All Difficulty</option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-[#12121a] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{scenario.title}</h3>
                  <p className="text-sm text-gray-500">{scenario.code}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(scenario.status)}`}>
                  {scenario.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(scenario.type)}`}>
                  {scenario.type.replace("-", " ")}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{scenario.terrain}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Target className="w-4 h-4" />
                  <span className="truncate">{scenario.targetType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{scenario.timeLimit} min limit</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    {scenario.timesUsed}x
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <BarChart3 className="w-4 h-4" />
                    {scenario.averageScore}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedScenario(scenario)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingScenario(scenario);
                      setShowEditDialog(true);
                    }}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateScenario(scenario)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No scenarios found matching your criteria</p>
        </div>
      )}

      {/* View Scenario Detail Modal */}
      {selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(selectedScenario.type)}`}>
                      {selectedScenario.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(selectedScenario.difficulty)}`}>
                      {selectedScenario.difficulty}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedScenario.status)}`}>
                      {selectedScenario.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedScenario.title}</h2>
                  <p className="text-gray-400">{selectedScenario.code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedScenario(null)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Environment */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Environment
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Terrain</p>
                    <p className="text-white">{selectedScenario.terrain}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Weather</p>
                    <p className="text-white">{selectedScenario.weather}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Visibility</p>
                    <p className="text-white">{selectedScenario.visibility}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Altitude</p>
                    <p className="text-white">{selectedScenario.altitude}</p>
                  </div>
                </div>
              </div>

              {/* Target Information */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  Target Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Target Type</p>
                    <p className="text-white">{selectedScenario.targetType}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Grid Reference</p>
                    <p className="text-white font-mono">{selectedScenario.gridReference}</p>
                  </div>
                </div>
                <div className="mt-3 bg-[#0a0a0f] rounded-lg p-3">
                  <p className="text-xs text-gray-500">Target Description</p>
                  <p className="text-white">{selectedScenario.targetDescription}</p>
                </div>
              </div>

              {/* Tactical Situation */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Tactical Situation
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-xs text-green-400">Friendly Positions</p>
                    <p className="text-white">{selectedScenario.friendlyPositions}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-xs text-red-400">Enemy Positions</p>
                    <p className="text-white">{selectedScenario.enemyPositions}</p>
                  </div>
                </div>
              </div>

              {/* Assets */}
              <div>
                <h3 className="font-semibold text-white mb-3">Assets & Munitions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Aircraft Type</p>
                    <p className="text-white">{selectedScenario.aircraftType}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Time Limit</p>
                    <p className="text-white">{selectedScenario.timeLimit} minutes</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Munitions Allowed</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedScenario.munitionsAllowed.map((munition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm"
                      >
                        {munition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="font-semibold text-white mb-3">Mission Objectives</h3>
                <ul className="space-y-2">
                  {selectedScenario.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evaluation Criteria */}
              {selectedScenario.evaluationCriteria.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Evaluation Criteria</h3>
                  <div className="space-y-2">
                    {selectedScenario.evaluationCriteria.map((criteria, index) => (
                      <div key={index} className="bg-[#0a0a0f] rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{criteria.criterion}</p>
                          <p className="text-sm text-gray-500">{criteria.description}</p>
                        </div>
                        <span className="text-emerald-400 font-bold">{criteria.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Briefing Notes */}
              {selectedScenario.briefingNotes && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Briefing Notes</h3>
                  <div className="bg-[#0a0a0f] rounded-lg p-4 text-gray-300">
                    {selectedScenario.briefingNotes}
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div>
                <h3 className="font-semibold text-white mb-3">Statistics</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{selectedScenario.timesUsed}</p>
                    <p className="text-xs text-gray-500">Times Used</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{selectedScenario.averageScore}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-white">{selectedScenario.createdBy}</p>
                    <p className="text-xs text-gray-500">Created By</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-white">{selectedScenario.lastUsed || "Never"}</p>
                    <p className="text-xs text-gray-500">Last Used</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-between">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(selectedScenario.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedScenario(null)} className="border-gray-700">
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700"
                  onClick={() => duplicateScenario(selectedScenario)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setEditingScenario(selectedScenario);
                    setShowEditDialog(true);
                    setSelectedScenario(null);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Scenario Dialog */}
      {(showAddDialog || showEditDialog) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {showEditDialog ? "Edit Scenario" : "Create New Scenario"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                  setEditingScenario(null);
                }}
                className="text-gray-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              onSubmit={showEditDialog ? handleEditScenario : handleAddScenario}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  name="title"
                  required
                  defaultValue={editingScenario?.title}
                  placeholder="e.g., Hilltop Enemy Position Engagement"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <select
                    name="type"
                    required
                    defaultValue={editingScenario?.type || "cas"}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="cas">CAS</option>
                    <option value="direct-fire">Direct Fire</option>
                    <option value="indirect-fire">Indirect Fire</option>
                    <option value="suppression">Suppression</option>
                    <option value="illumination">Illumination</option>
                    <option value="smoke">Smoke</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    required
                    defaultValue={editingScenario?.difficulty || "intermediate"}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                {showEditDialog && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <select
                      name="status"
                      required
                      defaultValue={editingScenario?.status}
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Terrain</label>
                  <input
                    name="terrain"
                    required
                    defaultValue={editingScenario?.terrain}
                    placeholder="e.g., Mountainous"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Weather</label>
                  <input
                    name="weather"
                    required
                    defaultValue={editingScenario?.weather}
                    placeholder="e.g., Clear"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Visibility</label>
                  <input
                    name="visibility"
                    required
                    defaultValue={editingScenario?.visibility}
                    placeholder="e.g., Good (10km+)"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Target Type</label>
                  <input
                    name="targetType"
                    required
                    defaultValue={editingScenario?.targetType}
                    placeholder="e.g., Enemy Bunker Complex"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Grid Reference</label>
                  <input
                    name="gridReference"
                    required
                    defaultValue={editingScenario?.gridReference}
                    placeholder="e.g., 43R MQ 1234 5678"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Target Description</label>
                <textarea
                  name="targetDescription"
                  required
                  defaultValue={editingScenario?.targetDescription}
                  placeholder="Detailed description of the target..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Friendly Positions</label>
                  <input
                    name="friendlyPositions"
                    required
                    defaultValue={editingScenario?.friendlyPositions}
                    placeholder="e.g., 1km South, in defilade"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Enemy Positions</label>
                  <input
                    name="enemyPositions"
                    required
                    defaultValue={editingScenario?.enemyPositions}
                    placeholder="e.g., Hilltop, 360° fields of fire"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Altitude</label>
                  <input
                    name="altitude"
                    required
                    defaultValue={editingScenario?.altitude}
                    placeholder="e.g., 2400m MSL"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Aircraft Type</label>
                  <input
                    name="aircraftType"
                    required
                    defaultValue={editingScenario?.aircraftType}
                    placeholder="e.g., ALH Rudra / Mi-17"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time Limit (min)</label>
                  <input
                    name="timeLimit"
                    type="number"
                    required
                    defaultValue={editingScenario?.timeLimit || 15}
                    min={5}
                    max={60}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Munitions Allowed (comma-separated)</label>
                <input
                  name="munitionsAllowed"
                  required
                  defaultValue={editingScenario?.munitionsAllowed.join(", ")}
                  placeholder="e.g., 70mm Rockets, Cannon, ATGMs"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Objectives (one per line)</label>
                <textarea
                  name="objectives"
                  required
                  defaultValue={editingScenario?.objectives.join("\n")}
                  placeholder="Establish communication with aircraft&#10;Provide accurate target description&#10;Execute safe fire mission"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Briefing Notes</label>
                <textarea
                  name="briefingNotes"
                  defaultValue={editingScenario?.briefingNotes}
                  placeholder="Additional briefing information..."
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setShowEditDialog(false);
                    setEditingScenario(null);
                  }}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {showEditDialog ? "Save Changes" : "Create Scenario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this scenario? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="border-gray-700"
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDeleteScenario(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
