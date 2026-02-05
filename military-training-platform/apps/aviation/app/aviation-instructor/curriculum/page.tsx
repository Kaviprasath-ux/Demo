"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Circle,
  Plane,
} from "lucide-react";
import {
  useAviationInstructorStore,
  FlightCurriculum,
} from "@/lib/stores/aviation-instructor-store";

export default function CurriculumPage() {
  const { curriculum, addCurriculum, updateCurriculum, deleteCurriculum } =
    useAviationInstructorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<FlightCurriculum | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phase: "ground-school" as FlightCurriculum["phase"],
    description: "",
    duration: {
      theoryHours: 0,
      simulatorHours: 0,
      flightHours: 0,
      totalHours: 0,
    },
    topics: [{ id: "", name: "", completed: false }],
    prerequisites: [] as string[],
    helicopterTypes: [] as string[],
    learningObjectives: [""],
    assessmentCriteria: [""],
    isActive: true,
  });

  const filteredCurriculum = curriculum.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phaseFilter === "all" || c.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phase: "ground-school",
      description: "",
      duration: {
        theoryHours: 0,
        simulatorHours: 0,
        flightHours: 0,
        totalHours: 0,
      },
      topics: [{ id: "", name: "", completed: false }],
      prerequisites: [],
      helicopterTypes: [],
      learningObjectives: [""],
      assessmentCriteria: [""],
      isActive: true,
    });
  };

  const handleAdd = () => {
    const totalHours =
      formData.duration.theoryHours +
      formData.duration.simulatorHours +
      formData.duration.flightHours;
    addCurriculum({
      ...formData,
      duration: { ...formData.duration, totalHours },
      topics: formData.topics
        .filter((t) => t.name.trim() !== "")
        .map((t, i) => ({ ...t, id: `T${i + 1}` })),
      learningObjectives: formData.learningObjectives.filter((o) => o.trim() !== ""),
      assessmentCriteria: formData.assessmentCriteria.filter((c) => c.trim() !== ""),
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedCurriculum) {
      const totalHours =
        formData.duration.theoryHours +
        formData.duration.simulatorHours +
        formData.duration.flightHours;
      updateCurriculum(selectedCurriculum.id, {
        ...formData,
        duration: { ...formData.duration, totalHours },
        topics: formData.topics
          .filter((t) => t.name.trim() !== "")
          .map((t, i) => ({ ...t, id: t.id || `T${i + 1}` })),
        learningObjectives: formData.learningObjectives.filter((o) => o.trim() !== ""),
        assessmentCriteria: formData.assessmentCriteria.filter((c) => c.trim() !== ""),
      });
      setShowEditModal(false);
      setSelectedCurriculum(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedCurriculum) {
      deleteCurriculum(selectedCurriculum.id);
      setShowDeleteModal(false);
      setSelectedCurriculum(null);
    }
  };

  const openEditModal = (cur: FlightCurriculum) => {
    setSelectedCurriculum(cur);
    setFormData({
      name: cur.name,
      phase: cur.phase,
      description: cur.description,
      duration: cur.duration,
      topics: cur.topics.length > 0 ? cur.topics : [{ id: "", name: "", completed: false }],
      prerequisites: cur.prerequisites,
      helicopterTypes: cur.helicopterTypes,
      learningObjectives: cur.learningObjectives.length > 0 ? cur.learningObjectives : [""],
      assessmentCriteria: cur.assessmentCriteria.length > 0 ? cur.assessmentCriteria : [""],
      isActive: cur.isActive,
    });
    setShowEditModal(true);
  };

  const toggleTopicComplete = (curId: string, topicId: string) => {
    const cur = curriculum.find((c) => c.id === curId);
    if (cur) {
      const updatedTopics = cur.topics.map((t) =>
        t.id === topicId ? { ...t, completed: !t.completed } : t
      );
      updateCurriculum(curId, { topics: updatedTopics });
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      "ground-school": "bg-gray-500/20 text-muted-foreground",
      "basic-flight": "bg-primary/20 text-primary",
      advanced: "bg-primary/20 text-primary",
      "cas-training": "bg-red-500/20 text-red-400",
      "joint-ops": "bg-primary/20 text-primary",
    };
    return colors[phase] || "bg-gray-500/20 text-muted-foreground";
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      "ground-school": "Ground School",
      "basic-flight": "Basic Flight",
      advanced: "Advanced",
      "cas-training": "CAS Training",
      "joint-ops": "Joint Operations",
    };
    return labels[phase] || phase;
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, { id: "", name: "", completed: false }],
    });
  };

  const removeTopic = (index: number) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index),
    });
  };

  const updateTopic = (index: number, name: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = { ...newTopics[index], name };
    setFormData({ ...formData, topics: newTopics });
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      learningObjectives: [...formData.learningObjectives, ""],
    });
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      learningObjectives: formData.learningObjectives.filter((_, i) => i !== index),
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.learningObjectives];
    newObjectives[index] = value;
    setFormData({ ...formData, learningObjectives: newObjectives });
  };

  const toggleHelicopterType = (type: string) => {
    if (formData.helicopterTypes.includes(type)) {
      setFormData({
        ...formData,
        helicopterTypes: formData.helicopterTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        helicopterTypes: [...formData.helicopterTypes, type],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Flight Curriculum
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage training curriculum modules and track topic completion
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
          Add Module
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search curriculum..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Phases</option>
          <option value="ground-school">Ground School</option>
          <option value="basic-flight">Basic Flight</option>
          <option value="advanced">Advanced</option>
          <option value="cas-training">CAS Training</option>
          <option value="joint-ops">Joint Operations</option>
        </select>
      </div>

      {/* Curriculum List */}
      <div className="space-y-4">
        {filteredCurriculum.map((cur) => {
          const isExpanded = expandedIds.includes(cur.id);
          const completedTopics = cur.topics.filter((t) => t.completed).length;
          const progress = cur.topics.length > 0 ? (completedTopics / cur.topics.length) * 100 : 0;

          return (
            <div
              key={cur.id}
              className={`bg-card border rounded-lg overflow-hidden ${
                cur.isActive ? "border-border" : "border-border opacity-60"
              }`}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50/50"
                onClick={() => toggleExpand(cur.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{cur.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${getPhaseColor(cur.phase)}`}>
                        {getPhaseLabel(cur.phase)}
                      </span>
                      {!cur.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{cur.description}</p>

                    {/* Progress and Hours */}
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {cur.duration.totalHours}h total
                        </span>
                      </div>
                      <div className="flex-1 max-w-xs">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-muted-foreground">
                            {completedTopics}/{cur.topics.length} topics
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full">
                          <div
                            className="h-1.5 bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(cur);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCurriculum(cur);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Duration Breakdown */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-foreground">{cur.duration.theoryHours}h</p>
                      <p className="text-xs text-muted-foreground">Theory</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-foreground">{cur.duration.simulatorHours}h</p>
                      <p className="text-xs text-muted-foreground">Simulator</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-foreground">{cur.duration.flightHours}h</p>
                      <p className="text-xs text-muted-foreground">Flight</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-primary">{cur.duration.totalHours}h</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="text-foreground font-medium mb-2">Topics</h4>
                    <div className="space-y-2">
                      {cur.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-background"
                          onClick={() => toggleTopicComplete(cur.id, topic.id)}
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span
                            className={
                              topic.completed ? "text-muted-foreground line-through" : "text-foreground"
                            }
                          >
                            {topic.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Helicopters */}
                  {cur.helicopterTypes.length > 0 && (
                    <div>
                      <h4 className="text-foreground font-medium mb-2">Helicopter Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {cur.helicopterTypes.map((heli) => (
                          <span
                            key={heli}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-1"
                          >
                            <Plane className="w-3 h-3" />
                            {heli}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Objectives */}
                  {cur.learningObjectives.length > 0 && (
                    <div>
                      <h4 className="text-foreground font-medium mb-2">Learning Objectives</h4>
                      <ul className="space-y-1">
                        {cur.learningObjectives.map((obj, i) => (
                          <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Assessment Criteria */}
                  {cur.assessmentCriteria.length > 0 && (
                    <div>
                      <h4 className="text-foreground font-medium mb-2">Assessment Criteria</h4>
                      <ul className="space-y-1">
                        {cur.assessmentCriteria.map((crit, i) => (
                          <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            {crit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCurriculum.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No curriculum modules found</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Add Curriculum Module</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Module Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g., CAS Training - Advanced"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phase *</label>
                  <select
                    value={formData.phase}
                    onChange={(e) =>
                      setFormData({ ...formData, phase: e.target.value as FlightCurriculum["phase"] })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="ground-school">Ground School</option>
                    <option value="basic-flight">Basic Flight</option>
                    <option value="advanced">Advanced</option>
                    <option value="cas-training">CAS Training</option>
                    <option value="joint-ops">Joint Operations</option>
                  </select>
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
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Duration (hours)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Theory</label>
                    <input
                      type="number"
                      value={formData.duration.theoryHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            theoryHours: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Simulator</label>
                    <input
                      type="number"
                      value={formData.duration.simulatorHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            simulatorHours: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Flight</label>
                    <input
                      type="number"
                      value={formData.duration.flightHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            flightHours: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Helicopter Types */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Helicopter Types</label>
                <div className="flex flex-wrap gap-2">
                  {["ALH Dhruv", "Rudra", "Chetak", "Apache AH-64E"].map((heli) => (
                    <label
                      key={heli}
                      className={`px-3 py-1 rounded-lg cursor-pointer border ${
                        formData.helicopterTypes.includes(heli)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-border"
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

              {/* Topics */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Topics</label>
                {formData.topics.map((topic, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topic.name}
                      onChange={(e) => updateTopic(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      placeholder={`Topic ${index + 1}`}
                    />
                    {formData.topics.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTopic(index)}
                        className="text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addTopic} className="text-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Topic
                </Button>
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Learning Objectives</label>
                {formData.learningObjectives.map((obj, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      placeholder={`Objective ${index + 1}`}
                    />
                    {formData.learningObjectives.length > 1 && (
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

              <label className="flex items-center gap-2 text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-muted/50 text-primary"
                />
                Active Module
              </label>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!formData.name}
                className="bg-primary hover:bg-primary/90"
              >
                Add Module
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCurriculum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Edit Curriculum Module</h2>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Module Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phase</label>
                  <select
                    value={formData.phase}
                    onChange={(e) =>
                      setFormData({ ...formData, phase: e.target.value as FlightCurriculum["phase"] })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="ground-school">Ground School</option>
                    <option value="basic-flight">Basic Flight</option>
                    <option value="advanced">Advanced</option>
                    <option value="cas-training">CAS Training</option>
                    <option value="joint-ops">Joint Operations</option>
                  </select>
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
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Duration (hours)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Theory</label>
                    <input
                      type="number"
                      value={formData.duration.theoryHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            theoryHours: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Simulator</label>
                    <input
                      type="number"
                      value={formData.duration.simulatorHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            simulatorHours: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Flight</label>
                    <input
                      type="number"
                      value={formData.duration.flightHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: {
                            ...formData.duration,
                            flightHours: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-muted/50 text-primary"
                />
                Active Module
              </label>
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

      {/* Delete Modal */}
      {showDeleteModal && selectedCurriculum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md m-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Delete Module</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete{" "}
                <span className="text-foreground font-medium">{selectedCurriculum.name}</span>?
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
