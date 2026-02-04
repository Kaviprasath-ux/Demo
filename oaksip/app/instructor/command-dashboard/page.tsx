"use client";

import { useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  AlertTriangle,
  Shield,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Brain,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useProgressionStore,
  PROGRESSION_LEVELS,
  type ProgressionLevel,
} from "@/lib/progression-model";

// Mock data for command dashboard
const batchErrorData = {
  "Batch-2024-A": {
    totalCadets: 25,
    avgAccuracy: 78,
    commonErrors: [
      { step: "Breech Loading", count: 12, percentage: 48 },
      { step: "Elevation Setting", count: 8, percentage: 32 },
      { step: "Safety Check", count: 6, percentage: 24 },
      { step: "Firing Sequence", count: 4, percentage: 16 },
    ],
    safetyViolations: 8,
    avgDrillTime: 145, // seconds
    trend: "improving",
  },
  "Batch-2024-B": {
    totalCadets: 22,
    avgAccuracy: 72,
    commonErrors: [
      { step: "Safety Check", count: 15, percentage: 68 },
      { step: "Breech Loading", count: 9, percentage: 41 },
      { step: "Traverse Adjustment", count: 7, percentage: 32 },
      { step: "Elevation Setting", count: 5, percentage: 23 },
    ],
    safetyViolations: 14,
    avgDrillTime: 168,
    trend: "declining",
  },
};

const safetyTrendData = [
  { week: "W1", violations: 12 },
  { week: "W2", violations: 8 },
  { week: "W3", violations: 15 },
  { week: "W4", violations: 6 },
  { week: "W5", violations: 4 },
  { week: "W6", violations: 3 },
];

const drillTimingData = [
  { drill: "Loading Drill", avgTime: 45, targetTime: 40, variance: 12 },
  { drill: "Firing Drill", avgTime: 62, targetTime: 55, variance: 18 },
  { drill: "Safety Drill", avgTime: 28, targetTime: 30, variance: 8 },
  { drill: "Emergency Drill", avgTime: 95, targetTime: 80, variance: 25 },
  { drill: "Maintenance Drill", avgTime: 120, targetTime: 110, variance: 15 },
];

const aiRecommendations = [
  {
    type: "critical",
    batch: "Batch-2024-B",
    message: "High safety violation rate detected. Recommend mandatory safety refresher for 6 cadets.",
    action: "Schedule Safety Module",
  },
  {
    type: "warning",
    batch: "Batch-2024-A",
    message: "48% of batch struggling with Breech Loading. Consider additional demonstration.",
    action: "View Affected Cadets",
  },
  {
    type: "info",
    batch: "Batch-2024-A",
    message: "3 cadets ready for Level 4 promotion based on performance metrics.",
    action: "Review for Promotion",
  },
  {
    type: "success",
    batch: "All",
    message: "Overall safety violations down 75% over 6 weeks. Positive trend continuing.",
    action: "View Report",
  },
];

// Error Heatmap Component
function ErrorHeatmap({ data }: { data: typeof batchErrorData }) {
  const allSteps = Array.from(
    new Set(
      Object.values(data).flatMap((b) => b.commonErrors.map((e) => e.step))
    )
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium">Drill Step</th>
            {Object.keys(data).map((batch) => (
              <th key={batch} className="text-center py-2 px-3 font-medium">
                {batch.replace("Batch-", "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allSteps.map((step) => (
            <tr key={step} className="border-b border-border/50">
              <td className="py-2 px-3">{step}</td>
              {Object.entries(data).map(([batch, batchData]) => {
                const error = batchData.commonErrors.find((e) => e.step === step);
                const percentage = error?.percentage || 0;
                const bgColor =
                  percentage >= 40
                    ? "bg-red-500/30"
                    : percentage >= 25
                    ? "bg-yellow-500/30"
                    : percentage >= 10
                    ? "bg-blue-500/20"
                    : "bg-green-500/20";

                return (
                  <td key={batch} className={`text-center py-2 px-3 ${bgColor}`}>
                    {percentage > 0 ? `${percentage}%` : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-4 text-xs">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500/30 rounded" /> High (&gt;40%)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500/30 rounded" /> Medium (25-40%)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500/20 rounded" /> Low (10-25%)
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500/20 rounded" /> Minimal (&lt;10%)
        </span>
      </div>
    </div>
  );
}

// Safety Trend Chart
function SafetyTrendChart({ data }: { data: typeof safetyTrendData }) {
  const maxValue = Math.max(...data.map((d) => d.violations));

  return (
    <div className="space-y-4">
      <div className="h-40 flex items-end gap-2">
        {data.map((point, i) => {
          const height = (point.violations / maxValue) * 100;
          const isDecreasing = i > 0 && point.violations < data[i - 1].violations;

          return (
            <div key={point.week} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium">{point.violations}</span>
              <div
                className={`w-full rounded-t transition-all ${
                  isDecreasing ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ height: `${Math.max(height, 5)}%` }}
              />
              <span className="text-xs text-muted-foreground">{point.week}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm">
        <TrendingDown className="h-4 w-4 text-green-500" />
        <span className="text-green-500 font-medium">75% reduction in violations</span>
      </div>
    </div>
  );
}

// Drill Timing Variance
function DrillTimingVariance({ data }: { data: typeof drillTimingData }) {
  return (
    <div className="space-y-4">
      {data.map((drill) => {
        const variance = ((drill.avgTime - drill.targetTime) / drill.targetTime) * 100;
        const isOverTime = drill.avgTime > drill.targetTime;

        return (
          <div key={drill.drill} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{drill.drill}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {drill.avgTime}s / {drill.targetTime}s target
                </span>
                <Badge
                  variant={isOverTime ? "destructive" : "default"}
                  className="text-xs"
                >
                  {isOverTime ? "+" : ""}{variance.toFixed(0)}%
                </Badge>
              </div>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary/30 rounded-full"
                style={{ width: `${(drill.targetTime / Math.max(...data.map(d => d.avgTime))) * 100}%` }}
              />
              <div
                className={`absolute h-full rounded-full ${
                  isOverTime ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${(drill.avgTime / Math.max(...data.map(d => d.avgTime))) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// AI Recommendations Panel
function AIRecommendations({ recommendations }: { recommendations: typeof aiRecommendations }) {
  const iconMap = {
    critical: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Lightbulb className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
  };

  const bgMap = {
    critical: "border-red-500/30 bg-red-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
    success: "border-green-500/30 bg-green-500/10",
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <div
          key={i}
          className={`p-4 rounded-lg border ${bgMap[rec.type as keyof typeof bgMap]}`}
        >
          <div className="flex items-start gap-3">
            {iconMap[rec.type as keyof typeof iconMap]}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {rec.batch}
                </Badge>
              </div>
              <p className="text-sm">{rec.message}</p>
              <Button variant="link" className="h-auto p-0 text-xs mt-2">
                {rec.action} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Batch Level Distribution
function BatchLevelDistribution() {
  const { getBatchStats } = useProgressionStore();
  const batches = ["Batch-2024-A", "Batch-2024-B"];

  return (
    <div className="space-y-4">
      {batches.map((batch) => {
        const stats = getBatchStats(batch);
        const total = Object.values(stats.levelDistribution).reduce((a, b) => a + b, 0);

        return (
          <div key={batch} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{batch}</span>
              <span className="text-xs text-muted-foreground">
                {total} cadets, {stats.avgAccuracy}% avg accuracy
              </span>
            </div>
            <div className="flex h-6 rounded-full overflow-hidden">
              {([1, 2, 3, 4, 5] as ProgressionLevel[]).map((level) => {
                const count = stats.levelDistribution[level];
                const width = total > 0 ? (count / total) * 100 : 0;
                const levelData = PROGRESSION_LEVELS[level];

                return width > 0 ? (
                  <div
                    key={level}
                    className="flex items-center justify-center text-xs text-white font-medium"
                    style={{
                      width: `${width}%`,
                      backgroundColor: levelData.color,
                    }}
                    title={`Level ${level}: ${count} cadets`}
                  >
                    {width > 10 && `L${level}`}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap gap-2 mt-2">
        {([1, 2, 3, 4, 5] as ProgressionLevel[]).map((level) => (
          <div key={level} className="flex items-center gap-1 text-xs">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: PROGRESSION_LEVELS[level].color }}
            />
            <span>L{level}: {PROGRESSION_LEVELS[level].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommandDashboardPage() {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  return (
    <RouteGuard requiredRoles={["instructor", "admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              Instructor Command Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time training intelligence and batch analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Live
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cadets</p>
                  <p className="text-3xl font-bold">47</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-80" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across 2 active batches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                  <p className="text-3xl font-bold">75%</p>
                </div>
                <Target className="h-8 w-8 text-green-500 opacity-80" />
              </div>
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +3% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safety Violations</p>
                  <p className="text-3xl font-bold">22</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-500 opacity-80" />
              </div>
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> -8 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ready for Promotion</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500 opacity-80" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Awaiting instructor approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Error Heatmap - Takes 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Batch-wise Error Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorHeatmap data={batchErrorData} />
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIRecommendations recommendations={aiRecommendations} />
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Safety Violation Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Safety Violation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SafetyTrendChart data={safetyTrendData} />
            </CardContent>
          </Card>

          {/* Drill Timing Variance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Drill Timing Variance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DrillTimingVariance data={drillTimingData} />
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Batch Progression Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BatchLevelDistribution />
          </CardContent>
        </Card>

        {/* Batch Focus Areas */}
        <div className="grid gap-6 lg:grid-cols-2">
          {Object.entries(batchErrorData).map(([batch, data]) => (
            <Card key={batch} className={data.trend === "declining" ? "border-red-500/30" : "border-green-500/30"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{batch}</CardTitle>
                  <Badge variant={data.trend === "improving" ? "default" : "destructive"}>
                    {data.trend === "improving" ? (
                      <><TrendingUp className="h-3 w-3 mr-1" /> Improving</>
                    ) : (
                      <><TrendingDown className="h-3 w-3 mr-1" /> Needs Attention</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.totalCadets}</p>
                    <p className="text-xs text-muted-foreground">Cadets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.avgAccuracy}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">{data.safetyViolations}</p>
                    <p className="text-xs text-muted-foreground">Violations</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {data.commonErrors.slice(0, 3).map((error) => (
                      <Badge key={error.step} variant="secondary" className="text-xs">
                        {error.step} ({error.percentage}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RouteGuard>
  );
}
