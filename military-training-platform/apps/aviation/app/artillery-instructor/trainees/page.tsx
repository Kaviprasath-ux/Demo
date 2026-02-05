"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  BarChart3,
  Target,
  X,
  ChevronRight,
  GraduationCap,
  Filter,
} from "lucide-react";
import {
  useArtilleryInstructorStore,
  FOOTrainee,
} from "@/lib/stores/artillery-instructor-store";

export default function FOOTraineesPage() {
  const { trainees, addTrainee, updateTrainee, removeTrainee } =
    useArtilleryInstructorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [selectedTrainee, setSelectedTrainee] = useState<FOOTrainee | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingTrainee, setEditingTrainee] = useState<FOOTrainee | null>(null);

  const batches = [...new Set(trainees.map((t) => t.batch))];

  const filteredTrainees = trainees.filter((trainee) => {
    const matchesSearch =
      trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.serviceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trainee.status === statusFilter;
    const matchesBatch = batchFilter === "all" || trainee.batch === batchFilter;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const stats = {
    total: trainees.length,
    active: trainees.filter((t) => t.status === "active").length,
    onLeave: trainees.filter((t) => t.status === "on-leave").length,
    graduated: trainees.filter((t) => t.status === "graduated").length,
  };

  const getStatusColor = (status: FOOTrainee["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "on-leave":
        return "bg-yellow-500/20 text-yellow-400";
      case "graduated":
        return "bg-emerald-500/20 text-emerald-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "medical":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleAddTrainee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addTrainee({
      rank: formData.get("rank") as string,
      name: formData.get("name") as string,
      serviceNumber: formData.get("serviceNumber") as string,
      unit: formData.get("unit") as string,
      regiment: formData.get("regiment") as string,
      batch: formData.get("batch") as string,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "active",
      currentPhase: "Phase I - Basic FOO Procedures",
      completedModules: [],
      totalHours: 0,
      fieldHours: 0,
      simulatorHours: 0,
      progress: 0,
      averageScore: 0,
      fireCallsCompleted: 0,
      accuracyRate: 0,
      specializations: [],
    });
    setShowAddDialog(false);
  };

  const handleEditTrainee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTrainee) return;

    const formData = new FormData(e.currentTarget);
    updateTrainee(editingTrainee.id, {
      rank: formData.get("rank") as string,
      name: formData.get("name") as string,
      serviceNumber: formData.get("serviceNumber") as string,
      unit: formData.get("unit") as string,
      regiment: formData.get("regiment") as string,
      batch: formData.get("batch") as string,
      currentPhase: formData.get("currentPhase") as string,
      status: formData.get("status") as FOOTrainee["status"],
    });
    setShowEditDialog(false);
    setEditingTrainee(null);
  };

  const handleDeleteTrainee = (id: string) => {
    removeTrainee(id);
    setShowDeleteConfirm(null);
    if (selectedTrainee?.id === id) {
      setSelectedTrainee(null);
    }
  };

  const openEditDialog = (trainee: FOOTrainee) => {
    setEditingTrainee(trainee);
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-500" />
            FOO Trainee Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage Forward Observation Officer trainees and their progress
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Trainee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Trainees</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.onLeave}</p>
              <p className="text-sm text-gray-400">On Leave</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <GraduationCap className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.graduated}</p>
              <p className="text-sm text-gray-400">Graduated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, service number, or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="graduated">Graduated</option>
            <option value="failed">Failed</option>
            <option value="medical">Medical</option>
          </select>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
          >
            <option value="all">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrainees.map((trainee) => (
          <div
            key={trainee.id}
            className="bg-[#12121a] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedTrainee(trainee)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                  {trainee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {trainee.rank} {trainee.name}
                  </h3>
                  <p className="text-sm text-gray-400">{trainee.serviceNumber}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(trainee.status)}`}>
                {trainee.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Unit</span>
                <span className="text-white">{trainee.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Batch</span>
                <span className="text-white">{trainee.batch}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phase</span>
                <span className="text-emerald-400 truncate max-w-[150px]">{trainee.currentPhase}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{trainee.progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(trainee.progress)} transition-all`}
                  style={{ width: `${trainee.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-400">
                  <Target className="w-4 h-4" />
                  {trainee.accuracyRate}%
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <BarChart3 className="w-4 h-4" />
                  {trainee.averageScore}%
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {filteredTrainees.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No trainees found matching your criteria</p>
        </div>
      )}

      {/* View Trainee Detail Modal */}
      {selectedTrainee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {selectedTrainee.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedTrainee.rank} {selectedTrainee.name}
                    </h2>
                    <p className="text-gray-400">{selectedTrainee.serviceNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedTrainee.status)}`}>
                    {selectedTrainee.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTrainee(null)}
                    className="text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Unit</label>
                  <p className="font-medium text-white">{selectedTrainee.unit}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Regiment</label>
                  <p className="font-medium text-white">{selectedTrainee.regiment}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Batch</label>
                  <p className="font-medium text-white">{selectedTrainee.batch}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Enrollment Date</label>
                  <p className="font-medium text-white">{selectedTrainee.enrollmentDate}</p>
                </div>
              </div>

              {/* Current Phase */}
              <div>
                <label className="text-sm text-gray-400">Current Phase</label>
                <p className="font-medium text-emerald-400">{selectedTrainee.currentPhase}</p>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="font-semibold text-white mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-emerald-400">{selectedTrainee.progress}%</p>
                    <p className="text-sm text-gray-400">Progress</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-400">{selectedTrainee.averageScore}%</p>
                    <p className="text-sm text-gray-400">Avg Score</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-emerald-400">{selectedTrainee.accuracyRate}%</p>
                    <p className="text-sm text-gray-400">Fire Accuracy</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-emerald-400">{selectedTrainee.fireCallsCompleted}</p>
                    <p className="text-sm text-gray-400">Fire Calls</p>
                  </div>
                </div>
              </div>

              {/* Training Hours */}
              <div>
                <h3 className="font-semibold text-white mb-3">Training Hours</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#0a0a0f] rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedTrainee.totalHours}h</p>
                    <p className="text-sm text-gray-400">Total Hours</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedTrainee.simulatorHours}h</p>
                    <p className="text-sm text-gray-400">Simulator</p>
                  </div>
                  <div className="bg-[#0a0a0f] rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedTrainee.fieldHours}h</p>
                    <p className="text-sm text-gray-400">Field</p>
                  </div>
                </div>
              </div>

              {/* Completed Modules */}
              {selectedTrainee.completedModules.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Completed Modules</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainee.completedModules.map((module) => (
                      <span
                        key={module}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specializations */}
              {selectedTrainee.specializations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainee.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div>
                <h3 className="font-semibold text-white mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {(["active", "on-leave", "graduated", "failed", "medical"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={selectedTrainee.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          updateTrainee(selectedTrainee.id, { status });
                          setSelectedTrainee({ ...selectedTrainee, status });
                        }}
                        className={
                          selectedTrainee.status === status
                            ? "bg-emerald-600"
                            : "border-gray-700"
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                onClick={() => setShowDeleteConfirm(selectedTrainee.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedTrainee(null)} className="border-gray-700">
                  Close
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => openEditDialog(selectedTrainee)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Trainee Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New FOO Trainee</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleAddTrainee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rank</label>
                  <select
                    name="rank"
                    required
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Lt">Lieutenant (Lt)</option>
                    <option value="Capt">Captain (Capt)</option>
                    <option value="Maj">Major (Maj)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Service Number</label>
                <input
                  name="serviceNumber"
                  required
                  placeholder="IC-XXXXX"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Unit</label>
                <input
                  name="unit"
                  required
                  placeholder="e.g., 14 Field Regiment"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Regiment</label>
                <input
                  name="regiment"
                  required
                  defaultValue="Regiment of Artillery"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Batch</label>
                <select
                  name="batch"
                  required
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                  <option value="FOO-2025-A">FOO-2025-A (New)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="border-gray-700">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Add Trainee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainee Dialog */}
      {showEditDialog && editingTrainee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit FOO Trainee</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleEditTrainee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rank</label>
                  <select
                    name="rank"
                    required
                    defaultValue={editingTrainee.rank}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Lt">Lieutenant (Lt)</option>
                    <option value="Capt">Captain (Capt)</option>
                    <option value="Maj">Major (Maj)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingTrainee.name}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Service Number</label>
                <input
                  name="serviceNumber"
                  required
                  defaultValue={editingTrainee.serviceNumber}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Unit</label>
                <input
                  name="unit"
                  required
                  defaultValue={editingTrainee.unit}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Regiment</label>
                <input
                  name="regiment"
                  required
                  defaultValue={editingTrainee.regiment}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Batch</label>
                <select
                  name="batch"
                  required
                  defaultValue={editingTrainee.batch}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  {batches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Phase</label>
                <select
                  name="currentPhase"
                  required
                  defaultValue={editingTrainee.currentPhase}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Phase I - Basic FOO Procedures">Phase I - Basic FOO Procedures</option>
                  <option value="Phase II - Advanced Fire Control">Phase II - Advanced Fire Control</option>
                  <option value="Phase III - Expert Certification">Phase III - Expert Certification</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  required
                  defaultValue={editingTrainee.status}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="graduated">Graduated</option>
                  <option value="failed">Failed</option>
                  <option value="medical">Medical</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)} className="border-gray-700">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Save Changes
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
              Are you sure you want to delete this trainee? This action cannot be undone.
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
                onClick={() => handleDeleteTrainee(showDeleteConfirm)}
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
