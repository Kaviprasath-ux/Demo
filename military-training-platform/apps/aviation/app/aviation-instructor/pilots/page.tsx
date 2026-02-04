"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Plane,
  Clock,
  Target,
  Award,
} from "lucide-react";
import {
  useAviationInstructorStore,
  PilotTrainee,
} from "@/lib/stores/aviation-instructor-store";

export default function PilotsPage() {
  const { pilots, addPilot, updatePilot, deletePilot } = useAviationInstructorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<PilotTrainee | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    serviceNumber: "",
    unit: "",
    squadron: "",
    batch: "",
    enrollmentDate: "",
    status: "active" as PilotTrainee["status"],
    flightHours: 0,
    simulatorHours: 0,
    casCompetency: 0,
    navigationScore: 0,
    emergencyProceduresScore: 0,
    communicationScore: 0,
    overallScore: 0,
    helicoptersCertified: [] as string[],
    currentPhase: "ground-school" as PilotTrainee["currentPhase"],
    notes: "",
  });

  const filteredPilots = pilots.filter((pilot) => {
    const matchesSearch =
      pilot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilot.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pilot.status === statusFilter;
    const matchesPhase = phaseFilter === "all" || pilot.currentPhase === phaseFilter;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      rank: "",
      serviceNumber: "",
      unit: "",
      squadron: "",
      batch: "",
      enrollmentDate: "",
      status: "active",
      flightHours: 0,
      simulatorHours: 0,
      casCompetency: 0,
      navigationScore: 0,
      emergencyProceduresScore: 0,
      communicationScore: 0,
      overallScore: 0,
      helicoptersCertified: [],
      currentPhase: "ground-school",
      notes: "",
    });
  };

  const handleAdd = () => {
    addPilot(formData);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedPilot) {
      updatePilot(selectedPilot.id, formData);
      setShowEditModal(false);
      setSelectedPilot(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedPilot) {
      deletePilot(selectedPilot.id);
      setShowDeleteModal(false);
      setSelectedPilot(null);
    }
  };

  const openEditModal = (pilot: PilotTrainee) => {
    setSelectedPilot(pilot);
    setFormData({
      name: pilot.name,
      rank: pilot.rank,
      serviceNumber: pilot.serviceNumber,
      unit: pilot.unit,
      squadron: pilot.squadron,
      batch: pilot.batch,
      enrollmentDate: pilot.enrollmentDate,
      status: pilot.status,
      flightHours: pilot.flightHours,
      simulatorHours: pilot.simulatorHours,
      casCompetency: pilot.casCompetency,
      navigationScore: pilot.navigationScore,
      emergencyProceduresScore: pilot.emergencyProceduresScore,
      communicationScore: pilot.communicationScore,
      overallScore: pilot.overallScore,
      helicoptersCertified: pilot.helicoptersCertified,
      currentPhase: pilot.currentPhase,
      notes: pilot.notes,
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "on-leave":
        return "bg-yellow-500/20 text-yellow-400";
      case "graduated":
        return "bg-emerald-500/20 text-emerald-400";
      case "suspended":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      "ground-school": "Ground School",
      "basic-flight": "Basic Flight",
      advanced: "Advanced",
      "cas-training": "CAS Training",
      "joint-ops": "Joint Ops",
    };
    return labels[phase] || phase;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-500" />
            Pilot Trainees
          </h1>
          <p className="text-gray-400 mt-1">
            Manage pilots enrolled in the Joint Fire Support training program
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
          Add Pilot
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or service number..."
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
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="graduated">Graduated</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">All Phases</option>
          <option value="ground-school">Ground School</option>
          <option value="basic-flight">Basic Flight</option>
          <option value="advanced">Advanced</option>
          <option value="cas-training">CAS Training</option>
          <option value="joint-ops">Joint Ops</option>
        </select>
      </div>

      {/* Pilots Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPilots.map((pilot) => (
          <div
            key={pilot.id}
            className="bg-[#12121a] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {pilot.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pilot.name}</h3>
                  <p className="text-sm text-gray-400">{pilot.rank}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pilot.status)}`}>
                {pilot.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Service No:</span>
                <span className="text-white">{pilot.serviceNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Squadron:</span>
                <span className="text-white">{pilot.squadron}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Phase:</span>
                <span className="text-emerald-400">{getPhaseLabel(pilot.currentPhase)}</span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{pilot.flightHours}h</p>
                <p className="text-xs text-gray-500">Flight</p>
              </div>
              <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                <Target className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{pilot.casCompetency}%</p>
                <p className="text-xs text-gray-500">CAS</p>
              </div>
              <div className="bg-[#0a0a0f] rounded-lg p-2 text-center">
                <Award className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{pilot.overallScore}%</p>
                <p className="text-xs text-gray-500">Overall</p>
              </div>
            </div>

            {/* Helicopters Certified */}
            <div className="flex flex-wrap gap-1 mb-4">
              {pilot.helicoptersCertified.map((heli) => (
                <span
                  key={heli}
                  className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded"
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
                  setSelectedPilot(pilot);
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
                onClick={() => openEditModal(pilot)}
                className="flex-1 text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPilot(pilot);
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

      {filteredPilots.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No pilots found matching your criteria</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Add New Pilot</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter pilot name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rank *</label>
                  <select
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select rank</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                    <option value="Major">Major</option>
                    <option value="Lt Colonel">Lt Colonel</option>
                    <option value="Colonel">Colonel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service Number *</label>
                  <input
                    type="text"
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="IC-XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter unit"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Squadron</label>
                  <input
                    type="text"
                    value={formData.squadron}
                    onChange={(e) => setFormData({ ...formData, squadron: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter squadron"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Batch</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="JFSP-2024-A"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Current Phase</label>
                  <select
                    value={formData.currentPhase}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPhase: e.target.value as PilotTrainee["currentPhase"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ground-school">Ground School</option>
                    <option value="basic-flight">Basic Flight</option>
                    <option value="advanced">Advanced</option>
                    <option value="cas-training">CAS Training</option>
                    <option value="joint-ops">Joint Ops</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Additional notes about the pilot..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!formData.name || !formData.rank || !formData.serviceNumber}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Add Pilot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPilot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Edit Pilot</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rank *</label>
                  <select
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                    <option value="Major">Major</option>
                    <option value="Lt Colonel">Lt Colonel</option>
                    <option value="Colonel">Colonel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service Number</label>
                  <input
                    type="text"
                    value={formData.serviceNumber}
                    disabled
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as PilotTrainee["status"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Squadron</label>
                  <input
                    type="text"
                    value={formData.squadron}
                    onChange={(e) => setFormData({ ...formData, squadron: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Current Phase</label>
                  <select
                    value={formData.currentPhase}
                    onChange={(e) =>
                      setFormData({ ...formData, currentPhase: e.target.value as PilotTrainee["currentPhase"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ground-school">Ground School</option>
                    <option value="basic-flight">Basic Flight</option>
                    <option value="advanced">Advanced</option>
                    <option value="cas-training">CAS Training</option>
                    <option value="joint-ops">Joint Ops</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Flight Hours</label>
                  <input
                    type="number"
                    value={formData.flightHours}
                    onChange={(e) => setFormData({ ...formData, flightHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Simulator Hours</label>
                  <input
                    type="number"
                    value={formData.simulatorHours}
                    onChange={(e) => setFormData({ ...formData, simulatorHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CAS %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.casCompetency}
                    onChange={(e) => setFormData({ ...formData, casCompetency: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nav %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.navigationScore}
                    onChange={(e) => setFormData({ ...formData, navigationScore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Emergency %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.emergencyProceduresScore}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyProceduresScore: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Overall %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.overallScore}
                    onChange={(e) => setFormData({ ...formData, overallScore: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
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
      {showViewModal && selectedPilot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Pilot Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {selectedPilot.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedPilot.name}</h3>
                  <p className="text-gray-400">
                    {selectedPilot.rank} | {selectedPilot.serviceNumber}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(selectedPilot.status)}`}>
                    {selectedPilot.status}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-sm text-gray-500">Unit</p>
                  <p className="text-white font-medium">{selectedPilot.unit}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-sm text-gray-500">Squadron</p>
                  <p className="text-white font-medium">{selectedPilot.squadron}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="text-white font-medium">{selectedPilot.batch}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  <p className="text-white font-medium">{selectedPilot.enrollmentDate}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-sm text-gray-500">Current Phase</p>
                  <p className="text-emerald-400 font-medium">{getPhaseLabel(selectedPilot.currentPhase)}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <h4 className="text-white font-semibold mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedPilot.flightHours}h</p>
                  <p className="text-sm text-gray-500">Flight Hours</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <Plane className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedPilot.simulatorHours}h</p>
                  <p className="text-sm text-gray-500">Simulator Hours</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedPilot.overallScore}%</p>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
              </div>

              {/* Skill Breakdown */}
              <h4 className="text-white font-semibold mb-3">Skill Breakdown</h4>
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">CAS Competency</span>
                    <span className="text-white">{selectedPilot.casCompetency}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{ width: `${selectedPilot.casCompetency}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Navigation</span>
                    <span className="text-white">{selectedPilot.navigationScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{ width: `${selectedPilot.navigationScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Emergency Procedures</span>
                    <span className="text-white">{selectedPilot.emergencyProceduresScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{ width: `${selectedPilot.emergencyProceduresScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Communication</span>
                    <span className="text-white">{selectedPilot.communicationScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${selectedPilot.communicationScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Helicopters Certified */}
              <h4 className="text-white font-semibold mb-3">Helicopters Certified</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPilot.helicoptersCertified.map((heli) => (
                  <span
                    key={heli}
                    className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg"
                  >
                    {heli}
                  </span>
                ))}
              </div>

              {/* Notes */}
              {selectedPilot.notes && (
                <>
                  <h4 className="text-white font-semibold mb-3">Notes</h4>
                  <p className="text-gray-400 bg-[#0a0a0f] rounded-lg p-4">{selectedPilot.notes}</p>
                </>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPilot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-md m-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Delete Pilot</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">{selectedPilot.name}</span>? This action
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
