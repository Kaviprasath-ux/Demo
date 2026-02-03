"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  Target,
  FileText,
  Shield,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import {
  mockUnitStats,
  mockSimulatorStats,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function LeadershipDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const totalTrainees = mockUnitStats.reduce((sum, u) => sum + u.totalTrainees, 0);
  const avgCompletionRate =
    mockUnitStats.reduce((sum, u) => sum + u.completionRate, 0) / mockUnitStats.length;
  const avgScore =
    mockUnitStats.reduce((sum, u) => sum + u.avgScore, 0) / mockUnitStats.length;
  const avgPassRate =
    mockUnitStats.reduce((sum, u) => sum + u.passRate, 0) / mockUnitStats.length;

  const quickLinks = [
    {
      title: "Unit Reports",
      description: "Detailed performance analytics",
      href: "/leadership/reports",
      icon: BarChart3,
    },
    {
      title: "Simulator Intel",
      description: "Unit-wide training statistics",
      href: "/simulator",
      icon: Target,
    },
    {
      title: "Documents",
      description: "View training documents",
      href: "/documents",
      icon: FileText,
    },
    {
      title: "Audit Logs",
      description: "System activity oversight",
      href: "/audit",
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Command Overview
          </h1>
          <Badge className="gap-1 bg-purple-500 hover:bg-purple-600">
            <Award className="h-3 w-3" />
            Leadership
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome, {user?.name}. Unit performance and training oversight.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Trainees</p>
                <p className="text-3xl font-bold text-foreground">{totalTrainees}</p>
                <p className="text-xs text-muted-foreground">Across all units</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(avgCompletionRate)}%</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% from last month
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(avgScore)}%</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Above target (70%)
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(avgPassRate)}%</p>
                <p className="text-xs text-muted-foreground">Assessment success</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Performance */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Unit Performance Comparison</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/leadership/reports")}
          >
            Detailed Reports
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUnitStats.map((unit) => (
              <div
                key={unit.unitName}
                className="rounded-lg border border-border/50 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{unit.unitName}</p>
                      <p className="text-sm text-muted-foreground">
                        {unit.totalTrainees} trainees | {unit.activeTrainings} active trainings
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={unit.completionRate >= 85 ? "success" : unit.completionRate >= 75 ? "warning" : "destructive"}
                  >
                    {unit.completionRate}% complete
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Score</span>
                      <span className="font-medium">{unit.avgScore}%</span>
                    </div>
                    <Progress value={unit.avgScore} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate</span>
                      <span className="font-medium">{unit.passRate}%</span>
                    </div>
                    <Progress value={unit.passRate} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{unit.completionRate}%</span>
                    </div>
                    <Progress value={unit.completionRate} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access & Accuracy Trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Links */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{link.title}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Simulator Accuracy Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSimulatorStats.accuracyTrend.map((point, index) => {
                const prevValue = index > 0 ? mockSimulatorStats.accuracyTrend[index - 1].accuracy : point.accuracy;
                const trend = point.accuracy - prevValue;
                return (
                  <div
                    key={point.date}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">{point.date}</span>
                      <div className="w-32">
                        <Progress value={point.accuracy} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{point.accuracy}%</span>
                      {trend !== 0 && (
                        <span
                          className={cn(
                            "text-xs flex items-center",
                            trend > 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {trend > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(trend).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Training Issues */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Common Training Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {mockSimulatorStats.commonErrors.map((error, index) => (
              <div
                key={error}
                className="rounded-lg border border-border/50 p-4 text-center"
              >
                <div className="text-2xl font-bold text-purple-500 mb-1">
                  #{index + 1}
                </div>
                <p className="text-sm">{error}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
