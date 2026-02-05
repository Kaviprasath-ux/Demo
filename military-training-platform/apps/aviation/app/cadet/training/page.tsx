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
      artillery: "bg-primary/20 text-primary",
      aviation: "bg-primary/20 text-primary",
      "joint-ops": "bg-primary/20 text-primary",
      safety: "bg-red-500/20 text-red-400",
      communication: "bg-primary/20 text-primary",
    };
    return colors[category] || "bg-gray-500/20 text-muted-foreground";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "not-started": "bg-gray-500/20 text-muted-foreground",
      "in-progress": "bg-primary/20 text-primary",
      completed: "bg-primary/20 text-primary",
    };
    return colors[status] || "bg-gray-500/20 text-muted-foreground";
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
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Training Modules
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete training modules to progress through your JFSP certification
        </p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Not Started</p>
          <p className="text-2xl font-bold text-foreground">
            {modules.filter((m) => m.status === "not-started").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">In Progress</p>
          <p className="text-2xl font-bold text-primary">
            {modules.filter((m) => m.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Completed</p>
          <p className="text-2xl font-bold text-primary">
            {modules.filter((m) => m.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
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
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
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
              className={`bg-card border rounded-lg overflow-hidden ${
                !canStart ? "border-border opacity-60" : "border-border"
              }`}
            >
              {/* Module Header */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50/50"
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
                        <h3 className="font-semibold text-foreground">{module.name}</h3>
                        {!canStart && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(
                            module.category
                          )}`}
                        >
                          {module.category.replace("-", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration} min
                        </span>
                        <span className="text-xs text-muted-foreground">{getTypeLabel(module.type)}</span>
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
                          <div className="text-xs text-muted-foreground mb-1">
                            {completedTopics}/{module.topics.length} topics
                          </div>
                          <div className="w-24 h-1.5 bg-muted rounded-full">
                            <div
                              className="h-1.5 bg-primary rounded-full"
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {canStart && (
                      isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && canStart && (
                <div className="border-t border-border p-4">
                  {/* Prerequisites */}
                  {module.prerequisiteIds.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Prerequisites:</p>
                      <div className="flex flex-wrap gap-2">
                        {module.prerequisiteIds.map((prereqId) => {
                          const prereq = modules.find((m) => m.id === prereqId);
                          return (
                            <span
                              key={prereqId}
                              className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-primary" />
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
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 hover:bg-background"
                        }`}
                        onClick={() => {
                          if (!topic.completed) {
                            completeModuleTopic(module.id, topic.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
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
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{topic.duration} min</span>
                          {!topic.completed && (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
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
                      <p className="text-sm text-primary">
                        Assessment required after completing this module
                      </p>
                    </div>
                  )}

                  {/* Start Button for not-started modules */}
                  {module.status === "not-started" && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={() => startModule(module.id)}
                        className="bg-primary hover:bg-primary/90"
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
                <div className="border-t border-border p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
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
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No modules found</p>
        </div>
      )}
    </div>
  );
}
