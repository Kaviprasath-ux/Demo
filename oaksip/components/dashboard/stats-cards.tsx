"use client";

import {
  Search,
  FileText,
  Target,
  Users,
  TrendingUp,
  Brain,
  Crosshair,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { mockSystemStats, getUserStats } from "@/lib/mock-data";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    positive: boolean;
  };
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <div className="flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend.positive ? "text-green-500" : "text-red-500"
                  )}
                >
                  <TrendingUp
                    className={cn(
                      "mr-1 h-3 w-3",
                      !trend.positive && "rotate-180"
                    )}
                  />
                  {trend.value}%
                </span>
              )}
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { user } = useAuthStore();
  const userStats = user ? getUserStats(user.id) : null;

  // Admin sees system-wide stats
  if (user?.role === "admin") {
    const adminStats: StatCardProps[] = [
      {
        title: "Total Queries",
        value: mockSystemStats.totalQueries.toLocaleString(),
        description: "This month (system-wide)",
        icon: Search,
        trend: { value: mockSystemStats.queryTrend, positive: true },
      },
      {
        title: "Documents Indexed",
        value: mockSystemStats.documentsIndexed.toString(),
        description: "Technical manuals & SOPs",
        icon: FileText,
      },
      {
        title: "Simulator Sessions",
        value: mockSystemStats.simulatorSessions.toString(),
        description: "This month (system-wide)",
        icon: Target,
        trend: { value: mockSystemStats.sessionTrend, positive: true },
      },
      {
        title: "Active Users",
        value: mockSystemStats.activeUsers.toString(),
        description: "Instructors & Trainees",
        icon: Users,
      },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    );
  }

  // Instructor sees system + personal stats
  if (user?.role === "instructor") {
    const instructorStats: StatCardProps[] = [
      {
        title: "My Queries",
        value: userStats?.queriesThisMonth.toString() || "0",
        description: "This month",
        icon: Search,
      },
      {
        title: "Total Sessions",
        value: mockSystemStats.simulatorSessions.toString(),
        description: "This month (all trainees)",
        icon: Target,
        trend: { value: mockSystemStats.sessionTrend, positive: true },
      },
      {
        title: "My Quiz Score",
        value: `${userStats?.avgQuizScore || 0}%`,
        description: "Average score",
        icon: Brain,
      },
      {
        title: "Active Trainees",
        value: mockSystemStats.activeUsers.toString(),
        description: "Currently training",
        icon: Users,
      },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {instructorStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    );
  }

  // Trainee sees only personal stats
  const traineeStats: StatCardProps[] = [
    {
      title: "My Queries",
      value: userStats?.queriesThisMonth.toString() || "0",
      description: "This month",
      icon: Search,
    },
    {
      title: "Quizzes Taken",
      value: userStats?.quizzesTaken.toString() || "0",
      description: "Total completed",
      icon: Brain,
    },
    {
      title: "Quiz Score",
      value: `${userStats?.avgQuizScore || 0}%`,
      description: "Average score",
      icon: Target,
    },
    {
      title: "Training Sessions",
      value: userStats?.trainingSessionsCompleted.toString() || "0",
      description: "Completed",
      icon: Crosshair,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {traineeStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
