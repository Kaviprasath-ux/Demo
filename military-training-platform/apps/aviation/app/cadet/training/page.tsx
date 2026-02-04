"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  BookOpen,
  Search,
  Filter,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  Target,
  Radio,
  Shield,
  Plane,
} from "lucide-react";
import { useCadetStore, TrainingModule } from "@/lib/stores/cadet-store";

export default function TrainingPage() {
  const { modules, startModule, completeModuleTopic } = useCadetStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || module.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const canStartModule = (module: TrainingModule) => {
    if (module.prerequisiteIds.length === 0) return true;
    return module.prerequisiteIds.every((prereqId) => {
      const prereq = modules.find((m) => m.id === prereqId);
      return prereq?.status === "completed";
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "artillery":
        return Target;
      case "aviation":
        return Plane;
      case "joint-ops":
        return Target;
      case "safety":
        return Shield;
      case "communication":
        return Radio;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      artillery: "bg-emerald-500/20 text-emerald-400",
      aviation: "bg-emerald-500/20 text-emerald-400",
      "joint-ops": "bg-emerald-500/20 text-emerald-400",
      safety: "bg-red-500/20 text-red-400",
      communication: "bg-green-500/20 text-green-400",
    };
    return colors[category] || "bg-gray-500/20 text-gray-400";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "not-started": "bg-gray-500/20 text-gray-400",
      "in-progress": "bg-yellow-500/20 text-yellow-400",
      completed: "bg-green-500/20 text-green-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      theory: "Theory",
      practical: "Practical",
      simulator: "Simulator",
      field: "Field",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-green-500" />
          Training Modules
        </h1>
        <p className="text-gray-400 mt-1">
          Complete training modules to progress through your JFSP certification
        </p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Not Started</p>
          <p className="text-2xl font-bold text-white">
            {modules.filter((m) => m.status === "not-started").length}
          </p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-yellow-400">
            {modules.filter((m) => m.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400">
            {modules.filter((m) => m.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="artillery">Artillery</option>
          <option value="aviation">Aviation</option>
          <option value="joint-ops">Joint Operations</option>
          <option value="safety">Safety</option>
          <option value="communication">Communication</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#12121a] border border-gray-800 rounded-lg text-white focus:border-green-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {filteredModules.map((module) => {
          const isExpanded = expandedIds.includes(module.id);
          const canStart = canStartModule(module);
          const CategoryIcon = getCategoryIcon(module.category);
          const completedTopics = module.topics.filter((t) => t.completed).length;

          return (
            <div
              key={module.id}
              className={`bg-[#12121a] border rounded-xl overflow-hidden ${
                !canStart ? "border-gray-800 opacity-60" : "border-gray-800"
              }`}
            >
              {/* Module Header */}
              <div
                className="p-4 cursor-pointer hover:bg-[#0a0a0f]/50"
                onClick={() => canStart && toggleExpand(module.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(
                        module.category
                      )}`}
                    >
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{module.name}</h3>
                        {!canStart && <Lock className="w-4 h-4 text-gray-500" />}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(
                            module.category
                          )}`}
                        >
                          {module.category.replace("-", " ")}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration} min
                        </span>
                        <span className="text-xs text-gray-500">{getTypeLabel(module.type)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Progress */}
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(module.status)}`}>
                        {module.status.replace("-", " ")}
                      </span>
                      {module.status !== "not-started" && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">
                            {completedTopics}/{module.topics.length} topics
                          </div>
                          <div className="w-24 h-1.5 bg-gray-800 rounded-full">
                            <div
                              className="h-1.5 bg-green-500 rounded-full"
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {canStart && (
                      isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && canStart && (
                <div className="border-t border-gray-800 p-4">
                  {/* Prerequisites */}
                  {module.prerequisiteIds.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Prerequisites:</p>
                      <div className="flex flex-wrap gap-2">
                        {module.prerequisiteIds.map((prereqId) => {
                          const prereq = modules.find((m) => m.id === prereqId);
                          return (
                            <span
                              key={prereqId}
                              className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              {prereq?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Topics */}
                  <div className="space-y-2">
                    {module.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          topic.completed
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-[#0a0a0f] hover:bg-gray-900"
                        }`}
                        onClick={() => {
                          if (!topic.completed) {
                            completeModuleTopic(module.id, topic.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {topic.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-600" />
                          )}
                          <span
                            className={
                              topic.completed ? "text-gray-400 line-through" : "text-white"
                            }
                          >
                            {topic.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{topic.duration} min</span>
                          {!topic.completed && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                completeModuleTopic(module.id, topic.id);
                              }}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Assessment Info */}
                  {module.assessmentRequired && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-400">
                        Assessment required after completing this module
                      </p>
                    </div>
                  )}

                  {/* Start Button for not-started modules */}
                  {module.status === "not-started" && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={() => startModule(module.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Module
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Locked Message */}
              {!canStart && (
                <div className="border-t border-gray-800 p-4 bg-[#0a0a0f]">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Complete prerequisites to unlock this module
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No modules found</p>
        </div>
      )}
    </div>
  );
}
