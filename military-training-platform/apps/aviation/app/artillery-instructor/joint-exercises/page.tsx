"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Plane,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  X,
  Filter,
  Target,
  CheckCircle2,
  Users,
  MapPin,
  Calendar,
  AlertTriangle,
  Radio,
  Shield,
  Crosshair,
} from "lucide-react";
import {
  useArtilleryInstructorStore,
  JointExercise,
} from "@/lib/stores/artillery-instructor-store";

export default function JointExercisesPage() {
  const {
    jointExercises,
    addJointExercise,
    updateJointExercise,
    removeJointExercise,
    trainees,
    scenarios,
  } = useArtilleryInstructorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedExercise, setSelectedExercise] = useState<JointExercise | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<JointExercise | null>(null);

  const filteredExercises = jointExercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || exercise.type === typeFilter;
    const matchesStatus = statusFilter === "all" || exercise.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: jointExercises.length,
    scheduled: jointExercises.filter((e) => e.status === "scheduled").length,
    planning: jointExercises.filter((e) => e.status === "planning").length,
    completed: jointExercises.filter((e) => e.status === "completed").length,
  };

  const getTypeColor = (type: JointExercise["type"]) => {
    switch (type) {
      case "coordination":
        return "bg-emerald-500/20 text-emerald-400";
      case "live-fire":
        return "bg-red-500/20 text-red-400";
      case "tactical":
        return "bg-emerald-500/20 text-emerald-400";
      case "search-rescue":
        return "bg-green-500/20 text-green-400";
      case "medevac":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status: JointExercise["status"]) => {
    switch (status) {
      case "planning":
        return "bg-yellow-500/20 text-yellow-400";
      case "scheduled":
        return "bg-emerald-500/20 text-emerald-400";
      case "in-progress":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-gray-500/20 text-gray-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const activeTrainees = trainees.filter((t) => t.status === "active");
  const activeScenarios = scenarios.filter((s) => s.status === "active");

  const handleAddExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const selectedArtilleryTrainees = formData.getAll("artilleryTrainees") as string[];
    const artilleryTraineesList = selectedArtilleryTrainees.map((id) => {
      const trainee = trainees.find((t) => t.id === id);
      return {
        id,
        name: trainee ? `${trainee.rank} ${trainee.name}` : "",
        role: "FOO",
      };
    });

    addJointExercise({
      name: formData.get("name") as string,
      code: `JEX-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      type: formData.get("type") as JointExercise["type"],
      status: "planning",
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      location: formData.get("location") as string,
      objectives: (formData.get("objectives") as string).split("\n").filter((o) => o.trim()),
      artilleryInstructorId: "ins1",
      artilleryInstructorName: "Col R.K. Sharma",
      aviationInstructorId: "avi1",
      aviationInstructorName: "Wg Cdr P. Nair",
      artilleryTrainees: artilleryTraineesList,
      aviationTrainees: [],
      aircraft: [],
      scenarios: formData.getAll("scenarios") as string[],
      safetyOfficer: formData.get("safetyOfficer") as string,
      medicalSupport: formData.get("medicalSupport") as string,
      communicationPlan: formData.get("communicationPlan") as string,
      contingencyPlan: formData.get("contingencyPlan") as string,
      briefingSchedule: formData.get("briefingSchedule") as string,
      debriefSchedule: formData.get("debriefSchedule") as string,
    });
    setShowAddDialog(false);
  };

  const handleEditExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExercise) return;

    const formData = new FormData(e.currentTarget);

    const selectedArtilleryTrainees = formData.getAll("artilleryTrainees") as string[];
    const artilleryTraineesList = selectedArtilleryTrainees.map((id) => {
      const trainee = trainees.find((t) => t.id === id);
      const existingRole = editingExercise.artilleryTrainees.find((t) => t.id === id)?.role || "FOO";
      return {
        id,
        name: trainee ? `${trainee.rank} ${trainee.name}` : "",
        role: existingRole,
      };
    });

    updateJointExercise(editingExercise.id, {
      name: formData.get("name") as string,
      type: formData.get("type") as JointExercise["type"],
      status: formData.get("status") as JointExercise["status"],
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      location: formData.get("location") as string,
      objectives: (formData.get("objectives") as string).split("\n").filter((o) => o.trim()),
      artilleryTrainees: artilleryTraineesList,
      scenarios: formData.getAll("scenarios") as string[],
      safetyOfficer: formData.get("safetyOfficer") as string,
      medicalSupport: formData.get("medicalSupport") as string,
      communicationPlan: formData.get("communicationPlan") as string,
      contingencyPlan: formData.get("contingencyPlan") as string,
      briefingSchedule: formData.get("briefingSchedule") as string,
      debriefSchedule: formData.get("debriefSchedule") as string,
      remarks: formData.get("remarks") as string || undefined,
    });
    setShowEditDialog(false);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (id: string) => {
    removeJointExercise(id);
    setShowDeleteConfirm(null);
    if (selectedExercise?.id === id) {
      setSelectedExercise(null);
    }
  };

  // Sort by date
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Plane className="w-8 h-8 text-emerald-500" />
            Joint Exercises
          </h1>
          <p className="text-gray-400 mt-1">
            Plan and manage joint artillery-aviation exercises
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Plan Exercise
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Plane className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Exercises</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.planning}</p>
              <p className="text-sm text-gray-400">Planning</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
              <p className="text-sm text-gray-400">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-sm text-gray-400">Completed</p>
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
            placeholder="Search exercises..."
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
            <option value="coordination">Coordination</option>
            <option value="live-fire">Live Fire</option>
            <option value="tactical">Tactical</option>
            <option value="search-rescue">Search & Rescue</option>
            <option value="medevac">MEDEVAC</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {sortedExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-[#12121a] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(exercise.type)}`}>
                      {exercise.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(exercise.status)}`}>
                      {exercise.status.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-xl">{exercise.name}</h3>
                  <p className="text-gray-500">{exercise.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {exercise.startDate} - {exercise.endDate}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center justify-end gap-1">
                    <MapPin className="w-4 h-4" />
                    {exercise.location}
                  </p>
                </div>
              </div>

              {/* Participants Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Artillery</span>
                  </div>
                  <p className="text-white font-medium">{exercise.artilleryTrainees.length} FOOs</p>
                  <p className="text-xs text-gray-500">{exercise.artilleryInstructorName}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Aviation</span>
                  </div>
                  <p className="text-white font-medium">{exercise.aviationTrainees.length} Pilots</p>
                  <p className="text-xs text-gray-500">{exercise.aviationInstructorName}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Scenarios</span>
                  </div>
                  <p className="text-white font-medium">{exercise.scenarios.length}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Safety</span>
                  </div>
                  <p className="text-white font-medium text-sm truncate">{exercise.safetyOfficer}</p>
                </div>
              </div>

              {/* Objectives Preview */}
              <div className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Objectives: </span>
                {exercise.objectives.slice(0, 2).join(", ")}
                {exercise.objectives.length > 2 && ` +${exercise.objectives.length - 2} more`}
              </div>

              {/* Results if completed */}
              {exercise.status === "completed" && exercise.results && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Results:</span>
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {exercise.results.filter((r) => r.achieved).length}/{exercise.results.length} objectives achieved
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No exercises found matching your criteria</p>
        </div>
      )}

      {/* View Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(selectedExercise.type)}`}>
                      {selectedExercise.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedExercise.status)}`}>
                      {selectedExercise.status.replace("-", " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedExercise.name}</h2>
                  <p className="text-gray-400">{selectedExercise.code}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Schedule & Location */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-white font-medium">{selectedExercise.startDate}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-white font-medium">{selectedExercise.endDate}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-white font-medium">{selectedExercise.location}</p>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Objectives
                </h3>
                <ul className="space-y-2">
                  {selectedExercise.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructors */}
              <div>
                <h3 className="font-semibold text-white mb-3">Instructors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-xs text-emerald-400">Artillery Instructor</p>
                    <p className="text-white font-medium">{selectedExercise.artilleryInstructorName}</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-xs text-emerald-400">Aviation Instructor</p>
                    <p className="text-white font-medium">{selectedExercise.aviationInstructorName}</p>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-emerald-500" />
                    Artillery Trainees ({selectedExercise.artilleryTrainees.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedExercise.artilleryTrainees.map((trainee) => (
                      <div
                        key={trainee.id}
                        className="flex items-center justify-between p-2 bg-[#0a0a0f] rounded-lg"
                      >
                        <span className="text-white">{trainee.name}</span>
                        <span className="text-xs text-emerald-400">{trainee.role}</span>
                      </div>
                    ))}
                    {selectedExercise.artilleryTrainees.length === 0 && (
                      <p className="text-gray-500 text-sm">No trainees assigned</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-emerald-500" />
                    Aviation Trainees ({selectedExercise.aviationTrainees.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedExercise.aviationTrainees.map((trainee) => (
                      <div
                        key={trainee.id}
                        className="flex items-center justify-between p-2 bg-[#0a0a0f] rounded-lg"
                      >
                        <span className="text-white">{trainee.name}</span>
                        <span className="text-xs text-emerald-400">{trainee.role}</span>
                      </div>
                    ))}
                    {selectedExercise.aviationTrainees.length === 0 && (
                      <p className="text-gray-500 text-sm">To be assigned by Aviation Instructor</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Safety & Support */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Safety & Support
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Safety Officer</p>
                    <p className="text-white">{selectedExercise.safetyOfficer}</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Medical Support</p>
                    <p className="text-white">{selectedExercise.medicalSupport}</p>
                  </div>
                </div>
              </div>

              {/* Communication */}
              <div>
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  Communication Plan
                </h3>
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-gray-300 font-mono text-sm">
                  {selectedExercise.communicationPlan}
                </div>
              </div>

              {/* Contingency */}
              {selectedExercise.contingencyPlan && (
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Contingency Plan
                  </h3>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-gray-300">
                    {selectedExercise.contingencyPlan}
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0f] rounded-lg p-3">
                  <p className="text-xs text-gray-500">Briefing Schedule</p>
                  <p className="text-white">{selectedExercise.briefingSchedule}</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-3">
                  <p className="text-xs text-gray-500">Debrief Schedule</p>
                  <p className="text-white">{selectedExercise.debriefSchedule}</p>
                </div>
              </div>

              {/* Results if completed */}
              {selectedExercise.results && selectedExercise.results.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Results</h3>
                  <div className="space-y-2">
                    {selectedExercise.results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.achieved
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-medium">{result.objective}</p>
                          {result.achieved ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <X className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        {result.remarks && (
                          <p className="text-sm text-gray-400">{result.remarks}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div>
                <h3 className="font-semibold text-white mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {(["planning", "scheduled", "in-progress", "completed", "cancelled"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={selectedExercise.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          updateJointExercise(selectedExercise.id, { status });
                          setSelectedExercise({ ...selectedExercise, status });
                        }}
                        className={
                          selectedExercise.status === status
                            ? "bg-emerald-600"
                            : "border-gray-700"
                        }
                      >
                        {status.replace("-", " ")}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-between">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(selectedExercise.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedExercise(null)} className="border-gray-700">
                  Close
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setEditingExercise(selectedExercise);
                    setShowEditDialog(true);
                    setSelectedExercise(null);
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

      {/* Add/Edit Dialog */}
      {(showAddDialog || showEditDialog) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {showEditDialog ? "Edit Joint Exercise" : "Plan New Joint Exercise"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                  setEditingExercise(null);
                }}
                className="text-gray-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              onSubmit={showEditDialog ? handleEditExercise : handleAddExercise}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">Exercise Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingExercise?.name}
                  placeholder="e.g., Operation Thunder Strike"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <select
                    name="type"
                    required
                    defaultValue={editingExercise?.type || "coordination"}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="coordination">Coordination</option>
                    <option value="live-fire">Live Fire</option>
                    <option value="tactical">Tactical</option>
                    <option value="search-rescue">Search & Rescue</option>
                    <option value="medevac">MEDEVAC</option>
                  </select>
                </div>
                {showEditDialog && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <select
                      name="status"
                      required
                      defaultValue={editingExercise?.status}
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="planning">Planning</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    required
                    defaultValue={editingExercise?.startDate}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input
                    name="endDate"
                    type="date"
                    required
                    defaultValue={editingExercise?.endDate}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input
                  name="location"
                  required
                  defaultValue={editingExercise?.location}
                  placeholder="e.g., Combined Arms Training Range"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Objectives (one per line)</label>
                <textarea
                  name="objectives"
                  required
                  defaultValue={editingExercise?.objectives.join("\n")}
                  rows={3}
                  placeholder="Execute coordinated air-ground fire mission&#10;Validate FOO-Pilot communication procedures"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Artillery Trainees</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-[#0a0a0f] border border-gray-800 rounded-lg p-3">
                  {activeTrainees.map((trainee) => (
                    <label key={trainee.id} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input
                        type="checkbox"
                        name="artilleryTrainees"
                        value={trainee.id}
                        defaultChecked={editingExercise?.artilleryTrainees.some((t) => t.id === trainee.id)}
                        className="rounded border-gray-700 bg-[#12121a]"
                      />
                      {trainee.rank} {trainee.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Scenarios</label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto bg-[#0a0a0f] border border-gray-800 rounded-lg p-3">
                  {activeScenarios.map((scenario) => (
                    <label key={scenario.id} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                      <input
                        type="checkbox"
                        name="scenarios"
                        value={scenario.id}
                        defaultChecked={editingExercise?.scenarios.includes(scenario.id)}
                        className="rounded border-gray-700 bg-[#12121a]"
                      />
                      {scenario.title} ({scenario.code})
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Safety Officer</label>
                  <input
                    name="safetyOfficer"
                    required
                    defaultValue={editingExercise?.safetyOfficer}
                    placeholder="e.g., Lt Col M. Iyer"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Medical Support</label>
                  <input
                    name="medicalSupport"
                    required
                    defaultValue={editingExercise?.medicalSupport}
                    placeholder="e.g., Medical Team Alpha"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Communication Plan</label>
                <input
                  name="communicationPlan"
                  required
                  defaultValue={editingExercise?.communicationPlan}
                  placeholder="e.g., Primary: HF 245.0, Secondary: VHF 121.5"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Contingency Plan</label>
                <textarea
                  name="contingencyPlan"
                  defaultValue={editingExercise?.contingencyPlan}
                  rows={2}
                  placeholder="Abort procedures, rally points..."
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Briefing Schedule</label>
                  <input
                    name="briefingSchedule"
                    required
                    defaultValue={editingExercise?.briefingSchedule}
                    placeholder="e.g., 2024-12-28 0500hrs at Ops Room"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Debrief Schedule</label>
                  <input
                    name="debriefSchedule"
                    required
                    defaultValue={editingExercise?.debriefSchedule}
                    placeholder="e.g., 2024-12-30 1800hrs at Ops Room"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {showEditDialog && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    defaultValue={editingExercise?.remarks}
                    rows={2}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setShowEditDialog(false);
                    setEditingExercise(null);
                  }}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {showEditDialog ? "Save Changes" : "Create Exercise"}
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
              Are you sure you want to delete this joint exercise? This action cannot be undone.
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
                onClick={() => handleDeleteExercise(showDeleteConfirm)}
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
