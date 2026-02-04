"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Plane,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useAviationInstructorStore,
  FlightSession,
} from "@/lib/stores/aviation-instructor-store";

export default function SessionsPage() {
  const { sessions, pilots, scenarios, addSession, updateSession, deleteSession } =
    useAviationInstructorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FlightSession | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "simulator" as FlightSession["type"],
    date: "",
    startTime: "",
    endTime: "",
    pilotIds: [] as string[],
    scenarioId: "",
    helicopterType: "",
    location: "",
    status: "scheduled" as FlightSession["status"],
    preFlightBriefing: false,
    postFlightDebriefing: false,
    weatherApproved: false,
    jointWithArtillery: false,
    artilleryInstructorId: "",
    notes: "",
    flightPlanApproved: false,
  });

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      type: "simulator",
      date: "",
      startTime: "",
      endTime: "",
      pilotIds: [],
      scenarioId: "",
      helicopterType: "",
      location: "",
      status: "scheduled",
      preFlightBriefing: false,
      postFlightDebriefing: false,
      weatherApproved: false,
      jointWithArtillery: false,
      artilleryInstructorId: "",
      notes: "",
      flightPlanApproved: false,
    });
  };

  const handleAdd = () => {
    addSession(formData);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedSession) {
      updateSession(selectedSession.id, formData);
      setShowEditModal(false);
      setSelectedSession(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedSession) {
      deleteSession(selectedSession.id);
      setShowDeleteModal(false);
      setSelectedSession(null);
    }
  };

  const openEditModal = (session: FlightSession) => {
    setSelectedSession(session);
    setFormData({
      title: session.title,
      type: session.type,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      pilotIds: session.pilotIds,
      scenarioId: session.scenarioId || "",
      helicopterType: session.helicopterType,
      location: session.location,
      status: session.status,
      preFlightBriefing: session.preFlightBriefing,
      postFlightDebriefing: session.postFlightDebriefing,
      weatherApproved: session.weatherApproved,
      jointWithArtillery: session.jointWithArtillery,
      artilleryInstructorId: session.artilleryInstructorId || "",
      notes: session.notes,
      flightPlanApproved: session.flightPlanApproved,
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-emerald-500/20 text-emerald-400",
      "in-progress": "bg-yellow-500/20 text-yellow-400",
      completed: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "ground-school": "bg-gray-500/20 text-gray-400",
      simulator: "bg-emerald-500/20 text-emerald-400",
      "dual-flight": "bg-emerald-500/20 text-emerald-400",
      "solo-flight": "bg-green-500/20 text-green-400",
      "cas-exercise": "bg-red-500/20 text-red-400",
      "joint-exercise": "bg-emerald-500/20 text-emerald-400",
    };
    return colors[type] || "bg-gray-500/20 text-gray-400";
  };

  const togglePilotSelection = (pilotId: string) => {
    if (formData.pilotIds.includes(pilotId)) {
      setFormData({
        ...formData,
        pilotIds: formData.pilotIds.filter((id) => id !== pilotId),
      });
    } else {
      setFormData({ ...formData, pilotIds: [...formData.pilotIds, pilotId] });
    }
  };

  const getPilotName = (id: string) => {
    const pilot = pilots.find((p) => p.id === id);
    return pilot?.name || id;
  };

  const getScenarioName = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id);
    return scenario?.name || "No scenario";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-500" />
            Flight Sessions
          </h1>
          <p className="text-gray-400 mt-1">
            Schedule and manage flight training sessions
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
          Schedule Session
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search sessions..."
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
          <option value="scheduled">Scheduled</option>
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
          <option value="ground-school">Ground School</option>
          <option value="simulator">Simulator</option>
          <option value="dual-flight">Dual Flight</option>
          <option value="solo-flight">Solo Flight</option>
          <option value="cas-exercise">CAS Exercise</option>
          <option value="joint-exercise">Joint Exercise</option>
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-[#12121a] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white">{session.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(session.type)}`}>
                    {session.type.replace("-", " ")}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                  {session.jointWithArtillery && (
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Joint Exercise
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{session.helicopterType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400 text-sm">
                      {session.pilotIds.length} pilot(s)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {session.preFlightBriefing && (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                        Pre-flight done
                      </span>
                    )}
                    {session.weatherApproved && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Weather OK
                      </span>
                    )}
                    {session.flightPlanApproved && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Flight plan approved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSession(session);
                    setShowViewModal(true);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(session)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSession(session);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No sessions found</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Schedule Flight Session</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Session Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Basic CAS Procedures"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Session Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as FlightSession["type"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ground-school">Ground School</option>
                    <option value="simulator">Simulator</option>
                    <option value="dual-flight">Dual Flight</option>
                    <option value="solo-flight">Solo Flight</option>
                    <option value="cas-exercise">CAS Exercise</option>
                    <option value="joint-exercise">Joint Exercise</option>
                  </select>
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
                  <label className="block text-sm text-gray-400 mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Helicopter Type *</label>
                  <select
                    value={formData.helicopterType}
                    onChange={(e) => setFormData({ ...formData, helicopterType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select helicopter</option>
                    <option value="ALH Dhruv">ALH Dhruv</option>
                    <option value="Rudra">Rudra (ALH WSI)</option>
                    <option value="Chetak">Chetak</option>
                    <option value="Apache AH-64E">Apache AH-64E</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Simulator Bay 1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Scenario (Optional)</label>
                  <select
                    value={formData.scenarioId}
                    onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">No scenario</option>
                    {scenarios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pilot Selection */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Assign Pilots *</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
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
                        <span className="text-gray-500 text-xs">({pilot.rank})</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.jointWithArtillery}
                    onChange={(e) =>
                      setFormData({ ...formData, jointWithArtillery: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Joint with Artillery
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.weatherApproved}
                    onChange={(e) => setFormData({ ...formData, weatherApproved: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Weather Approved
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.flightPlanApproved}
                    onChange={(e) =>
                      setFormData({ ...formData, flightPlanApproved: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Flight Plan Approved
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={
                  !formData.title ||
                  !formData.date ||
                  !formData.startTime ||
                  !formData.helicopterType ||
                  formData.pilotIds.length === 0
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Schedule Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Edit Session</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Session Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as FlightSession["status"] })
                    }
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
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
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Briefing Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preFlightBriefing}
                    onChange={(e) =>
                      setFormData({ ...formData, preFlightBriefing: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Pre-flight Briefing Done
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.postFlightDebriefing}
                    onChange={(e) =>
                      setFormData({ ...formData, postFlightDebriefing: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Post-flight Debriefing Done
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.weatherApproved}
                    onChange={(e) => setFormData({ ...formData, weatherApproved: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Weather Approved
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.flightPlanApproved}
                    onChange={(e) =>
                      setFormData({ ...formData, flightPlanApproved: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0f] text-emerald-500"
                  />
                  Flight Plan Approved
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
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
      {showViewModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Session Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedSession.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(selectedSession.type)}`}>
                      {selectedSession.type.replace("-", " ")}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(selectedSession.status)}`}>
                      {selectedSession.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Date</span>
                  </div>
                  <p className="text-white">{selectedSession.date}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Time</span>
                  </div>
                  <p className="text-white">
                    {selectedSession.startTime} - {selectedSession.endTime}
                  </p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Location</span>
                  </div>
                  <p className="text-white">{selectedSession.location}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Helicopter</span>
                  </div>
                  <p className="text-white">{selectedSession.helicopterType}</p>
                </div>
              </div>

              {/* Assigned Pilots */}
              <div>
                <h4 className="text-white font-semibold mb-3">Assigned Pilots</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.pilotIds.map((id) => (
                    <span
                      key={id}
                      className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm"
                    >
                      {getPilotName(id)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scenario */}
              {selectedSession.scenarioId && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Scenario</h4>
                  <p className="text-gray-400">{getScenarioName(selectedSession.scenarioId)}</p>
                </div>
              )}

              {/* Status Indicators */}
              <div>
                <h4 className="text-white font-semibold mb-3">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    {selectedSession.preFlightBriefing ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                    )}
                    <span
                      className={
                        selectedSession.preFlightBriefing ? "text-green-400" : "text-gray-500"
                      }
                    >
                      Pre-flight Briefing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSession.postFlightDebriefing ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                    )}
                    <span
                      className={
                        selectedSession.postFlightDebriefing ? "text-green-400" : "text-gray-500"
                      }
                    >
                      Post-flight Debriefing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSession.weatherApproved ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                    )}
                    <span
                      className={
                        selectedSession.weatherApproved ? "text-green-400" : "text-gray-500"
                      }
                    >
                      Weather Approved
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSession.flightPlanApproved ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                    )}
                    <span
                      className={
                        selectedSession.flightPlanApproved ? "text-green-400" : "text-gray-500"
                      }
                    >
                      Flight Plan Approved
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedSession.notes && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Notes</h4>
                  <p className="text-gray-400 bg-[#0a0a0f] rounded-lg p-4">
                    {selectedSession.notes}
                  </p>
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
      {showDeleteModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-md m-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Delete Session</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">{selectedSession.title}</span>?
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
