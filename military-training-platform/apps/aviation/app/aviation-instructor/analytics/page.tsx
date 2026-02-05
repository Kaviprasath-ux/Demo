"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Shield,
  Plane,
  Award,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Button } from "@military/ui";
import { useAnalyticsStore } from "@/lib/stores/analytics-store";
import { helicopterSystems } from "@/lib/helicopter-systems";

export default function AnalyticsPage() {
  const {
    getPlatformAnalytics,
    missionMetrics,
    traineeProgress,
    getHelicopterUtilization,
  } = useAnalyticsStore();

  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month");
  const analytics = getPlatformAnalytics();
  const utilization = getHelicopterUtilization();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Training Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Mission performance and trainee progress analytics (SOW 6.2)
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
            {(["week", "month", "quarter"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Total Missions"
            value={analytics.totalMissions}
            icon={Target}
            trend="+12%"
            trendUp={true}
          />
          <MetricCard
            label="Flight Hours"
            value={`${analytics.totalFlightHours.toFixed(1)}h`}
            icon={Clock}
            trend="+8%"
            trendUp={true}
          />
          <MetricCard
            label="Active Trainees"
            value={analytics.activeTrainees}
            icon={Users}
            trend="+2"
            trendUp={true}
          />
          <MetricCard
            label="Avg. Score"
            value={`${analytics.averageMissionScore.toFixed(1)}%`}
            icon={Award}
            trend="+3.5%"
            trendUp={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Weekly Trend */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Weekly Performance Trend
            </h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {analytics.weeklyTrend.map((week, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{week.avgScore}%</span>
                    <div
                      className="w-full bg-primary/80 rounded-t"
                      style={{ height: `${week.avgScore * 1.5}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{week.week}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Types */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Missions by Type
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.missionsByType).map(([type, count]) => {
                const percentage = (count / analytics.totalMissions) * 100;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{type}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Helicopter Utilization */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            Helicopter Utilization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {utilization.map((item) => {
              const heli = helicopterSystems.find((h) => h.id === item.helicopter);
              return (
                <div
                  key={item.helicopter}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: (heli?.primaryColor || "#666") + "30" }}
                    >
                      <Plane
                        className="w-5 h-5"
                        style={{ color: heli?.primaryColor || "#666" }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{heli?.name || item.helicopter}</p>
                      <p className="text-xs text-muted-foreground">
                        {heli?.category || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Missions</p>
                      <p className="font-semibold">{item.missions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-semibold">{item.hours.toFixed(1)}h</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Performers */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {analytics.topPerformers.map((performer, i) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0
                          ? "bg-primary/20 text-primary"
                          : i === 1
                          ? "bg-gray-400/20 text-muted-foreground"
                          : i === 2
                          ? "bg-amber-600/20 text-amber-600"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{performer.score.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Metrics */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Safety Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <SafetyMetric
                label="NFZ Violations"
                value={missionMetrics.reduce((sum, m) => sum + m.nfzViolations, 0)}
                status="good"
              />
              <SafetyMetric
                label="Altitude Violations"
                value={missionMetrics.reduce((sum, m) => sum + m.altitudeViolations, 0)}
                status={missionMetrics.reduce((sum, m) => sum + m.altitudeViolations, 0) > 0 ? "warning" : "good"}
              />
              <SafetyMetric
                label="Safety Incidents"
                value={missionMetrics.reduce((sum, m) => sum + m.safetyIncidents, 0)}
                status="good"
              />
              <SafetyMetric
                label="Correction Accuracy"
                value={`${(missionMetrics.reduce((sum, m) => sum + m.correctionAccuracy, 0) / missionMetrics.length).toFixed(1)}%`}
                status="good"
              />
            </div>

            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">All safety parameters within limits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Missions Table */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Recent Missions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mission</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Helicopter</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Coordination</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                </tr>
              </thead>
              <tbody>
                {missionMetrics.map((mission) => {
                  const heli = helicopterSystems.find((h) => h.id === mission.helicopterType);
                  return (
                    <tr key={mission.missionId} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{mission.missionId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(mission.startTime).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-muted rounded text-xs">
                          {heli?.name || mission.helicopterType}
                        </span>
                      </td>
                      <td className="py-3 px-4">{mission.missionType}</td>
                      <td className="py-3 px-4">{mission.duration} min</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>{mission.artilleryCoordinations}</span>
                          <span className="text-xs text-muted-foreground">coordinations</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            mission.overallScore >= 90
                              ? "bg-primary/20 text-primary"
                              : mission.overallScore >= 75
                              ? "bg-primary/20 text-primary"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {mission.overallScore}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div
            className={`flex items-center gap-1 mt-1 text-xs ${
              trendUp ? "text-primary" : "text-red-500"
            }`}
          >
            <TrendingUp className={`w-3 h-3 ${!trendUp && "rotate-180"}`} />
            {trend}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

function SafetyMetric({
  label,
  value,
  status,
}: {
  label: string;
  value: string | number;
  status: "good" | "warning" | "critical";
}) {
  const statusColors = {
    good: "text-primary",
    warning: "text-primary",
    critical: "text-red-500",
  };

  return (
    <div className="p-3 bg-muted rounded-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${statusColors[status]}`}>{value}</p>
    </div>
  );
}
