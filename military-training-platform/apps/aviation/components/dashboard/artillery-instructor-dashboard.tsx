"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Target,
  Crosshair,
  Clock,
  Activity,
  Calendar,
  BarChart3,
  Navigation,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  GraduationCap,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from "@military/ui";
import { useAuthStore } from "@/lib/store";

export function ArtilleryInstructorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const quickLinks = [
    {
      title: "Trainee List",
      description: "Manage FOO trainees",
      href: "/artillery-instructor/trainees",
      icon: GraduationCap,
      count: 18,
    },
    {
      title: "Training Scenarios",
      description: "Fire support scenarios",
      href: "/artillery-instructor/scenarios",
      icon: Crosshair,
      count: 12,
    },
    {
      title: "Sessions",
      description: "Training sessions",
      href: "/artillery-instructor/sessions",
      icon: Calendar,
    },
    {
      title: "Joint Exercises",
      description: "Air-ground coordination",
      href: "/artillery-instructor/joint-exercises",
      icon: Target,
    },
    {
      title: "3D Simulator",
      description: "Fire support training",
      href: "/training",
      icon: Navigation,
    },
    {
      title: "Knowledge Search",
      description: "Search doctrine",
      href: "/search",
      icon: Search,
    },
  ];

  const upcomingSessions = [
    { name: "Fire Adjustment Basics", time: "09:00 AM", trainees: 6 },
    { name: "Joint Fire Support Ex", time: "1:00 PM", trainees: 8 },
    { name: "Night Fire Mission", time: "7:00 PM", trainees: 4 },
  ];

  const traineeStats = {
    total: 18,
    onTrack: 14,
    needsAttention: 4,
    avgScore: 78,
  };

  const recentActivities = [
    { action: "Lt. Verma completed fire adjustment", status: "success", time: "45 min ago" },
    { action: "Batch Charlie started CFF exercise", status: "info", time: "2 hours ago" },
    { action: "2Lt. Patel needs re-evaluation", status: "warning", time: "3 hours ago" },
    { action: "Joint exercise scheduled", status: "info", time: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artillery Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <Crosshair className="h-3 w-3" />
          Artillery Instructor
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">FOO Trainees</p>
                <p className="text-2xl font-bold">{traineeStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold text-green-500">{traineeStats.onTrack}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">{traineeStats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links & Sessions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Card
                key={link.href}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => router.push(link.href)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{link.title}</h3>
                        {link.count && (
                          <Badge variant="secondary" className="text-xs">
                            {link.count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{session.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.trainees} trainees
                    </p>
                  </div>
                  <Badge variant="outline">{session.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                {item.status === "success" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {item.status === "warning" && (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                {item.status === "info" && (
                  <Activity className="h-4 w-4 text-emerald-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
