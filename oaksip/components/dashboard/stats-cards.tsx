"use client";

import {
  Search,
  FileText,
  Target,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const stats: StatCardProps[] = [
    {
      title: "Total Queries",
      value: "1,247",
      description: "This month",
      icon: Search,
      trend: { value: 12, positive: true },
    },
    {
      title: "Documents Indexed",
      value: "156",
      description: "Technical manuals & SOPs",
      icon: FileText,
    },
    {
      title: "Simulator Sessions",
      value: "89",
      description: "This month",
      icon: Target,
      trend: { value: 8, positive: true },
    },
    {
      title: "Active Users",
      value: "34",
      description: "Instructors & Trainees",
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
