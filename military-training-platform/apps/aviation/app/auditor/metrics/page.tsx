"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  AlertTriangle,
  CheckCircle2,
  Crosshair,
  Plane,
  Shield,
  Users,
} from "lucide-react";
import { useAuditorStore, TrainingMetric } from "@/lib/stores/auditor-store";

export default function MetricsPage() {
  const { metrics } = useAuditorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredMetrics = metrics.filter((metric) => {
    const matchesSearch = metric.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || metric.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-5 h-5 text-green-400" />;
      case "down":
        return <ArrowDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "artillery":
        return <Crosshair className="w-5 h-5" />;
      case "aviation":
        return <Plane className="w-5 h-5" />;
      case "joint":
        return <Users className="w-5 h-5" />;
      case "safety":
        return <Shield className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "artillery":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "aviation":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "joint":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "safety":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusIndicator = (current: number, target: number) => {
    if (current >= target) {
      return (
        <span className="flex items-center gap-1 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          On Target
        </span>
      );
    } else if (current >= target * 0.8) {
      return (
        <span className="flex items-center gap-1 text-yellow-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          Near Target
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-400 text-sm">
        <AlertTriangle className="w-4 h-4" />
        Below Target
      </span>
    );
  };

  // Calculate summary stats
  const onTargetCount = metrics.filter((m) => m.currentValue >= m.targetValue).length;
  const nearTargetCount = metrics.filter(
    (m) => m.currentValue < m.targetValue && m.currentValue >= m.targetValue * 0.8
  ).length;
  const belowTargetCount = metrics.filter(
    (m) => m.currentValue < m.targetValue * 0.8
  ).length;
  const improvingCount = metrics.filter((m) => m.trend === "up").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-red-500" />
          Training Metrics
        </h1>
        <p className="text-gray-400 mt-1">
          Monitor key performance indicators and training effectiveness
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-green-500/30 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-400">{onTargetCount}</p>
          <p className="text-xs text-gray-500">On Target</p>
        </div>
        <div className="bg-[#12121a] border border-yellow-500/30 rounded-xl p-4 text-center">
          <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-400">{nearTargetCount}</p>
          <p className="text-xs text-gray-500">Near Target</p>
        </div>
        <div className="bg-[#12121a] border border-red-500/30 rounded-xl p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-400">{belowTargetCount}</p>
          <p className="text-xs text-gray-500">Below Target</p>
        </div>
        <div className="bg-[#12121a] border border-emerald-500/30 rounded-xl p-4 text-center">
          <ArrowUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-400">{improvingCount}</p>
          <p className="text-xs text-gray-500">Improving</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="artillery">Artillery</option>
              <option value="aviation">Aviation</option>
              <option value="joint">Joint Operations</option>
              <option value="safety">Safety</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-[#12121a] border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(
                    metric.category
                  )}`}
                >
                  {getCategoryIcon(metric.category)}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{metric.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(
                      metric.category
                    )}`}
                  >
                    {metric.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                  {metric.trend === "up"
                    ? "Improving"
                    : metric.trend === "down"
                    ? "Declining"
                    : "Stable"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {metric.currentValue}
                    <span className="text-lg text-gray-400">{metric.unit}</span>
                  </p>
                  <p className="text-sm text-gray-500">Current Value</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-gray-400">
                    {metric.targetValue}
                    {metric.unit}
                  </p>
                  <p className="text-sm text-gray-500">Target</p>
                </div>
              </div>

              <div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(
                      metric.currentValue,
                      metric.targetValue
                    )}`}
                    style={{
                      width: `${Math.min(
                        (metric.currentValue / metric.targetValue) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{metric.period}</span>
                  {getStatusIndicator(metric.currentValue, metric.targetValue)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Summary */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">Category Performance</h2>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            {["artillery", "aviation", "joint", "safety"].map((category) => {
              const categoryMetrics = metrics.filter(
                (m) => m.category === category
              );
              const avgPerformance =
                categoryMetrics.length > 0
                  ? Math.round(
                      categoryMetrics.reduce(
                        (sum, m) => sum + (m.currentValue / m.targetValue) * 100,
                        0
                      ) / categoryMetrics.length
                    )
                  : 0;

              return (
                <div
                  key={category}
                  className={`p-4 rounded-lg border ${getCategoryColor(category)}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {getCategoryIcon(category)}
                    <span className="text-white font-medium capitalize">
                      {category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{avgPerformance}%</p>
                  <p className="text-xs text-gray-500">
                    Average Performance ({categoryMetrics.length} metrics)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
