"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  X,
  Filter,
  CheckCircle2,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
} from "lucide-react";
import {
  useArtilleryInstructorStore,
  ArtilleryCurriculum,
} from "@/lib/stores/artillery-instructor-store";

export default function CurriculumPage() {
  const {
    curriculum,
    addCurriculum,
    updateCurriculum,
    removeCurriculum,
    completeTopicInCurriculum,
  } = useArtilleryInstructorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState<ArtilleryCurriculum | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingCurriculum, setEditingCurriculum] = useState<ArtilleryCurriculum | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const filteredCurriculum = curriculum.filter((cur) => {
    const matchesSearch =
      cur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cur.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cur.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: curriculum.length,
    active: curriculum.filter((c) => c.status === "active").length,
    totalEnrolled: curriculum.reduce((sum, c) => sum + c.enrolledTrainees, 0),
    avgPassRate: curriculum.length > 0
      ? Math.round(curriculum.reduce((sum, c) => sum + c.passRate, 0) / curriculum.length)
      : 0,
  };

  const getStatusColor = (status: ArtilleryCurriculum["status"]) => {
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

  const getTopicTypeColor = (type: string) => {
    switch (type) {
      case "theory":
        return "bg-emerald-500/20 text-emerald-400";
      case "practical":
        return "bg-green-500/20 text-green-400";
      case "simulator":
        return "bg-emerald-500/20 text-emerald-400";
      case "field":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const toggleTopicExpanded = (curId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(curId) ? prev.filter((id) => id !== curId) : [...prev, curId]
    );
  };

  const handleAddCurriculum = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addCurriculum({
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      phase: formData.get("phase") as string,
      duration: formData.get("duration") as string,
      description: formData.get("description") as string,
      prerequisites: (formData.get("prerequisites") as string).split(",").map(p => p.trim()).filter(Boolean),
      objectives: (formData.get("objectives") as string).split("\n").filter(o => o.trim()),
      topics: [],
      assessments: [],
      status: "draft",
      totalHours: parseInt(formData.get("totalHours") as string) || 0,
      theoryHours: parseInt(formData.get("theoryHours") as string) || 0,
      practicalHours: parseInt(formData.get("practicalHours") as string) || 0,
      simulatorHours: parseInt(formData.get("simulatorHours") as string) || 0,
      fieldHours: parseInt(formData.get("fieldHours") as string) || 0,
      enrolledTrainees: 0,
      passRate: 0,
    });
    setShowAddDialog(false);
  };

  const handleEditCurriculum = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCurriculum) return;

    const formData = new FormData(e.currentTarget);
    updateCurriculum(editingCurriculum.id, {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      phase: formData.get("phase") as string,
      duration: formData.get("duration") as string,
      description: formData.get("description") as string,
      prerequisites: (formData.get("prerequisites") as string).split(",").map(p => p.trim()).filter(Boolean),
      objectives: (formData.get("objectives") as string).split("\n").filter(o => o.trim()),
      status: formData.get("status") as ArtilleryCurriculum["status"],
      totalHours: parseInt(formData.get("totalHours") as string) || 0,
      theoryHours: parseInt(formData.get("theoryHours") as string) || 0,
      practicalHours: parseInt(formData.get("practicalHours") as string) || 0,
      simulatorHours: parseInt(formData.get("simulatorHours") as string) || 0,
      fieldHours: parseInt(formData.get("fieldHours") as string) || 0,
    });
    setShowEditDialog(false);
    setEditingCurriculum(null);
  };

  const handleDeleteCurriculum = (id: string) => {
    removeCurriculum(id);
    setShowDeleteConfirm(null);
    if (selectedCurriculum?.id === id) {
      setSelectedCurriculum(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-500" />
            Curriculum Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage FOO training curriculum, modules, and learning objectives
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Curriculum
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Modules</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalEnrolled}</p>
              <p className="text-sm text-gray-400">Total Enrolled</p>
            </div>
          </div>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgPassRate}%</p>
              <p className="text-sm text-gray-400">Avg Pass Rate</p>
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
            placeholder="Search curriculum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-orange-500 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg focus:outline-none focus:border-orange-500 text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="space-y-4">
        {filteredCurriculum.map((cur) => (
          <div
            key={cur.id}
            className="bg-[#12121a] border border-gray-800 rounded-lg overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-[#16161f] transition-colors"
              onClick={() => toggleTopicExpanded(cur.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(cur.status)}`}>
                      {cur.status}
                    </span>
                    <span className="text-gray-500 text-sm">{cur.code}</span>
                  </div>
                  <h3 className="font-semibold text-white text-lg">{cur.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{cur.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{cur.totalHours}h</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{cur.enrolledTrainees}</p>
                    <p className="text-xs text-gray-500">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-400">{cur.passRate}%</p>
                    <p className="text-xs text-gray-500">Pass Rate</p>
                  </div>
                  {expandedTopics.includes(cur.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Hours Breakdown */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="bg-[#0a0a0f] rounded p-2 text-center">
                  <p className="text-sm font-medium text-emerald-400">{cur.theoryHours}h</p>
                  <p className="text-xs text-gray-500">Theory</p>
                </div>
                <div className="bg-[#0a0a0f] rounded p-2 text-center">
                  <p className="text-sm font-medium text-green-400">{cur.practicalHours}h</p>
                  <p className="text-xs text-gray-500">Practical</p>
                </div>
                <div className="bg-[#0a0a0f] rounded p-2 text-center">
                  <p className="text-sm font-medium text-emerald-400">{cur.simulatorHours}h</p>
                  <p className="text-xs text-gray-500">Simulator</p>
                </div>
                <div className="bg-[#0a0a0f] rounded p-2 text-center">
                  <p className="text-sm font-medium text-emerald-400">{cur.fieldHours}h</p>
                  <p className="text-xs text-gray-500">Field</p>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedTopics.includes(cur.id) && (
              <div className="border-t border-gray-800 p-4 bg-[#0a0a0f]">
                {/* Objectives */}
                <div className="mb-4">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    Learning Objectives
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {cur.objectives.map((obj, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {cur.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-white mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {cur.prerequisites.map((prereq, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics */}
                {cur.topics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Topics ({cur.topics.length})
                    </h4>
                    <div className="space-y-2">
                      {cur.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            topic.completed
                              ? 'bg-green-500/5 border-green-500/30'
                              : 'bg-[#12121a] border-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs ${getTopicTypeColor(topic.type)}`}>
                              {topic.type}
                            </span>
                            <div>
                              <p className={`font-medium ${topic.completed ? 'text-green-400' : 'text-white'}`}>
                                {topic.title}
                              </p>
                              <p className="text-xs text-gray-500">{topic.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {topic.duration}
                            </span>
                            {topic.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  completeTopicInCurriculum(cur.id, topic.id);
                                }}
                                className="text-gray-400 hover:text-green-400"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => setShowDeleteConfirm(cur.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    onClick={() => setSelectedCurriculum(cur)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      setEditingCurriculum(cur);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCurriculum.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No curriculum found matching your criteria</p>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedCurriculum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedCurriculum.status)}`}>
                      {selectedCurriculum.status}
                    </span>
                    <span className="text-gray-500">{selectedCurriculum.code}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedCurriculum.name}</h2>
                  <p className="text-gray-400">{selectedCurriculum.phase} • {selectedCurriculum.duration}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCurriculum(null)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#0a0a0f] rounded-lg p-4">
                <p className="text-gray-300">{selectedCurriculum.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedCurriculum.totalHours}h</p>
                  <p className="text-sm text-gray-500">Total Hours</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedCurriculum.topics.length}</p>
                  <p className="text-sm text-gray-500">Topics</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{selectedCurriculum.enrolledTrainees}</p>
                  <p className="text-sm text-gray-500">Enrolled</p>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{selectedCurriculum.passRate}%</p>
                  <p className="text-sm text-gray-500">Pass Rate</p>
                </div>
              </div>

              {/* Hours Breakdown */}
              <div>
                <h3 className="font-semibold text-white mb-3">Hours Breakdown</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">{selectedCurriculum.theoryHours}h</p>
                    <p className="text-sm text-gray-400">Theory</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-400">{selectedCurriculum.practicalHours}h</p>
                    <p className="text-sm text-gray-400">Practical</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">{selectedCurriculum.simulatorHours}h</p>
                    <p className="text-sm text-gray-400">Simulator</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">{selectedCurriculum.fieldHours}h</p>
                    <p className="text-sm text-gray-400">Field</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedCurriculum(null)} className="border-gray-700">
                Close
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  setEditingCurriculum(selectedCurriculum);
                  setShowEditDialog(true);
                  setSelectedCurriculum(null);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
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
                {showEditDialog ? "Edit Curriculum" : "Add New Curriculum"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                  setEditingCurriculum(null);
                }}
                className="text-gray-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              onSubmit={showEditDialog ? handleEditCurriculum : handleAddCurriculum}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingCurriculum?.name}
                    placeholder="e.g., Phase I - Basic FOO Procedures"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code</label>
                  <input
                    name="code"
                    required
                    defaultValue={editingCurriculum?.code}
                    placeholder="e.g., FOO-101"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phase</label>
                  <select
                    name="phase"
                    required
                    defaultValue={editingCurriculum?.phase || "Phase I"}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration</label>
                  <input
                    name="duration"
                    required
                    defaultValue={editingCurriculum?.duration}
                    placeholder="e.g., 8 weeks"
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {showEditDialog && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    required
                    defaultValue={editingCurriculum?.status}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  defaultValue={editingCurriculum?.description}
                  rows={2}
                  placeholder="Brief description of the curriculum..."
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Prerequisites (comma-separated)</label>
                <input
                  name="prerequisites"
                  defaultValue={editingCurriculum?.prerequisites.join(", ")}
                  placeholder="e.g., FOO-101, Ground School Certificate"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Learning Objectives (one per line)</label>
                <textarea
                  name="objectives"
                  required
                  defaultValue={editingCurriculum?.objectives.join("\n")}
                  rows={4}
                  placeholder="Master military communication protocols&#10;Learn target identification procedures"
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Hours</label>
                  <input
                    name="totalHours"
                    type="number"
                    required
                    defaultValue={editingCurriculum?.totalHours || 0}
                    min={0}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Theory</label>
                  <input
                    name="theoryHours"
                    type="number"
                    required
                    defaultValue={editingCurriculum?.theoryHours || 0}
                    min={0}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Practical</label>
                  <input
                    name="practicalHours"
                    type="number"
                    required
                    defaultValue={editingCurriculum?.practicalHours || 0}
                    min={0}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Simulator</label>
                  <input
                    name="simulatorHours"
                    type="number"
                    required
                    defaultValue={editingCurriculum?.simulatorHours || 0}
                    min={0}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Field</label>
                  <input
                    name="fieldHours"
                    type="number"
                    required
                    defaultValue={editingCurriculum?.fieldHours || 0}
                    min={0}
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setShowEditDialog(false);
                    setEditingCurriculum(null);
                  }}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {showEditDialog ? "Save Changes" : "Add Curriculum"}
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
              Are you sure you want to delete this curriculum? This action cannot be undone.
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
                onClick={() => handleDeleteCurriculum(showDeleteConfirm)}
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
