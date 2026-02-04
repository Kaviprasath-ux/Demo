"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Target,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plane,
  Shield,
  Radio,
} from "lucide-react";
import {
  useAviationInstructorStore,
  JointOperation,
} from "@/lib/stores/aviation-instructor-store";

export default function JointOperationsPage() {
  const {
    jointOperations,
    pilots,
    scenarios,
    addJointOperation,
    updateJointOperation,
    deleteJointOperation,
  } = useAviationInstructorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOp, setSelectedOp] = useState<JointOperation | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "cas-coordination" as JointOperation["type"],
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    status: "planning" as JointOperation["status"],
    pilotIds: [] as string[],
    artilleryTraineeIds: [] as string[],
    scenarioId: "",
    helicopterTypes: [] as string[],
    artilleryAssets: [] as string[],
    objectives: [""],
    safetyOfficer: "",
    flightLeader: "",
    groundCommander: "",
    communicationPlan: "",
    weatherMinimums: "",
  });

  const filteredOps = jointOperations.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || op.status === statusFilter;
    const matchesType = typeFilter === "all" || op.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "cas-coordination",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      status: "planning",
      pilotIds: [],
      artilleryTraineeIds: [],
      scenarioId: "",
      helicopterTypes: [],
      artilleryAssets: [],
      objectives: [""],
      safetyOfficer: "",
      flightLeader: "",
      groundCommander: "",
      communicationPlan: "",
      weatherMinimums: "",
    });
  };

  const handleAdd = () => {
    addJointOperation({
      ...formData,
      objectives: formData.objectives.filter((o) => o.trim() !== ""),
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedOp) {
      updateJointOperation(selectedOp.id, {
        ...formData,
        objectives: formData.objectives.filter((o) => o.trim() !== ""),
      });
      setShowEditModal(false);
      setSelectedOp(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedOp) {
      deleteJointOperation(selectedOp.id);
      setShowDeleteModal(false);
      setSelectedOp(null);
    }
  };

  const openEditModal = (op: JointOperation) => {
    setSelectedOp(op);
    setFormData({
      name: op.name,
      type: op.type,
      description: op.description,
      date: op.date,
      startTime: op.startTime,
      endTime: op.endTime,
      location: op.location,
      status: op.status,
      pilotIds: op.pilotIds,
      artilleryTraineeIds: op.artilleryTraineeIds,
      scenarioId: op.scenarioId || "",
      helicopterTypes: op.helicopterTypes,
      artilleryAssets: op.artilleryAssets,
      objectives: op.objectives.length > 0 ? op.objectives : [""],
      safetyOfficer: op.safetyOfficer,
      flightLeader: op.flightLeader,
      groundCommander: op.groundCommander,
      communicationPlan: op.communicationPlan,
      weatherMinimums: op.weatherMinimums,
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      "in-progress": "bg-emerald-500/20 text-emerald-400",
      completed: "bg-emerald-500/20 text-emerald-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "cas-coordination": "CAS Coordination",
      "fire-support": "Fire Support",
      "tactical-insertion": "Tactical Insertion",
      "medevac-under-fire": "MEDEVAC Under Fire",
      "combined-arms": "Combined Arms",
    };
    return labels[type] || type;
  };

  const togglePilotSelection = (id: string) => {
    if (formData.pilotIds.includes(id)) {
      setFormData({ ...formData, pilotIds: formData.pilotIds.filter((p) => p !== id) });
    } else {
      setFormData({ ...formData, pilotIds: [...formData.pilotIds, id] });
    }
  };

  const toggleHelicopterType = (type: string) => {
    if (formData.helicopterTypes.includes(type)) {
      setFormData({
        ...formData,
        helicopterTypes: formData.helicopterTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({ ...formData, helicopterTypes: [...formData.helicopterTypes, type] });
    }
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

  const getPilotName = (id: string) => pilots.find((p) => p.id === id)?.name || id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-500" />
            Joint Operations
          </h1>
          <p className="text-gray-400 mt-1">
            Plan and coordinate joint Aviation-Artillery training exercises
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Plan Operation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="planning">Planning</option>
          <option value="approved">Approved</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="cas-coordination">CAS Coordination</option>
          <option value="fire-support">Fire Support</option>
          <option value="tactical-insertion">Tactical Insertion</option>
          <option value="medevac-under-fire">MEDEVAC Under Fire</option>
          <option value="combined-arms">Combined Arms</option>
        </select>
      </div>

      {/* Operations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredOps.map((op) => (
          <div
            key={op.id}
            className="bg-[#12121a] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{op.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {getTypeLabel(op.type)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(op.status)}`}>
                    {op.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{op.description}</p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">{op.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">
                  {op.startTime} - {op.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400 truncate">{op.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">{op.pilotIds.length} pilots</span>
              </div>
            </div>

            {/* Helicopters */}
            <div className="flex flex-wrap gap-1 mb-4">
              {op.helicopterTypes.map((heli) => (
                <span
                  key={heli}
                  className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded"
                >
                  {heli}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOp(op);
                  setShowViewModal(true);
                }}
                className="flex-1 text-gray-400 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(op)}
                className="flex-1 text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOp(op);
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

      {filteredOps.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No joint operations found</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Plan Joint Operation</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Operation Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Exercise Steel Thunder"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Operation Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as JointOperation["type"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="cas-coordination">CAS Coordination</option>
                    <option value="fire-support">Fire Support</option>
                    <option value="tactical-insertion">Tactical Insertion</option>
                    <option value="medevac-under-fire">MEDEVAC Under Fire</option>
                    <option value="combined-arms">Combined Arms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as JointOperation["status"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="approved">Approved</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Training area or range"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Helicopter Types */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Helicopter Types</label>
                <div className="flex flex-wrap gap-2">
                  {["ALH Dhruv", "Rudra", "Chetak", "Apache AH-64E"].map((heli) => (
                    <label
                      key={heli}
                      className={`px-3 py-1 rounded-lg cursor-pointer border ${
                        formData.helicopterTypes.includes(heli)
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.helicopterTypes.includes(heli)}
                        onChange={() => toggleHelicopterType(heli)}
                      />
                      {heli}
                    </label>
                  ))}
                </div>
              </div>

              {/* Pilots Selection */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Assign Pilots</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {pilots
                    .filter((p) => p.status === "active")
                    .map((pilot) => (
                      <label
                        key={pilot.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${
                          formData.pilotIds.includes(pilot.id)
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-gray-800 hover:border-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.pilotIds.includes(pilot.id)}
                          onChange={() => togglePilotSelection(pilot.id)}
                          className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                        />
                        <span className="text-white text-sm">{pilot.name}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Command Structure */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Safety Officer</label>
                  <input
                    type="text"
                    value={formData.safetyOfficer}
                    onChange={(e) => setFormData({ ...formData, safetyOfficer: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Flight Leader</label>
                  <input
                    type="text"
                    value={formData.flightLeader}
                    onChange={(e) => setFormData({ ...formData, flightLeader: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Ground Commander</label>
                  <input
                    type="text"
                    value={formData.groundCommander}
                    onChange={(e) => setFormData({ ...formData, groundCommander: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Objectives</label>
                {formData.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
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
                <Button variant="ghost" size="sm" onClick={addObjective} className="text-emerald-400">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Objective
                </Button>
              </div>

              {/* Communication and Weather */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Communication Plan</label>
                  <input
                    type="text"
                    value={formData.communicationPlan}
                    onChange={(e) => setFormData({ ...formData, communicationPlan: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., TAC1 123.45, Guard 121.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Weather Minimums</label>
                  <input
                    type="text"
                    value={formData.weatherMinimums}
                    onChange={(e) => setFormData({ ...formData, weatherMinimums: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., VFR, ceiling >1500ft"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!formData.name || !formData.date || !formData.location}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Create Operation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Edit Operation</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Operation Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as JointOperation["status"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="approved">Approved</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} className="bg-emerald-600 hover:bg-emerald-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedOp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Operation Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{selectedOp.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(selectedOp.status)}`}>
                    {selectedOp.status}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {getTypeLabel(selectedOp.type)}
                </span>
                <p className="text-gray-400 mt-2">{selectedOp.description}</p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Date</span>
                  </div>
                  <p className="text-white">{selectedOp.date}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Time</span>
                  </div>
                  <p className="text-white">
                    {selectedOp.startTime} - {selectedOp.endTime}
                  </p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Location</span>
                  </div>
                  <p className="text-white">{selectedOp.location}</p>
                </div>
              </div>

              {/* Command Structure */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Command Structure
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Safety Officer</p>
                    <p className="text-white text-sm">{selectedOp.safetyOfficer || "-"}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Flight Leader</p>
                    <p className="text-white text-sm">{selectedOp.flightLeader || "-"}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Ground Commander</p>
                    <p className="text-white text-sm">{selectedOp.groundCommander || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Assigned Pilots */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-emerald-400" />
                  Assigned Pilots
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOp.pilotIds.map((id) => (
                    <span
                      key={id}
                      className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm"
                    >
                      {getPilotName(id)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Helicopters */}
              <div>
                <h4 className="text-white font-semibold mb-3">Helicopter Types</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOp.helicopterTypes.map((heli) => (
                    <span
                      key={heli}
                      className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm"
                    >
                      {heli}
                    </span>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="text-white font-semibold mb-3">Objectives</h4>
                <ul className="space-y-2">
                  {selectedOp.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400">
                      <Target className="w-4 h-4 text-emerald-400 mt-0.5" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Communication */}
              {selectedOp.communicationPlan && (
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-green-400" />
                    Communication Plan
                  </h4>
                  <p className="text-gray-400 bg-[#0a0a0f] rounded-lg p-3">
                    {selectedOp.communicationPlan}
                  </p>
                </div>
              )}

              {/* Results if completed */}
              {selectedOp.results && (
                <div>
                  <h4 className="text-white font-semibold mb-3">Results</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">
                        {selectedOp.results.objectivesAchieved}/{selectedOp.results.totalObjectives}
                      </p>
                      <p className="text-xs text-gray-500">Objectives</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-400">
                        {selectedOp.results.coordinationRating}%
                      </p>
                      <p className="text-xs text-gray-500">Coordination</p>
                    </div>
                    <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {selectedOp.results.safetyIncidents}
                      </p>
                      <p className="text-xs text-gray-500">Safety Incidents</p>
                    </div>
                  </div>
                  {selectedOp.results.lessonsLearned && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Lessons Learned</p>
                      <p className="text-gray-400 bg-[#0a0a0f] rounded-lg p-3">
                        {selectedOp.results.lessonsLearned}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end">
              <Button variant="ghost" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedOp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-md m-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Delete Operation</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">{selectedOp.name}</span>?
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
