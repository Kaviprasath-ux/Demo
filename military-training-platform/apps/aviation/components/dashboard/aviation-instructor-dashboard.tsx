"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Target,
  Plane,
  Clock,
  Activity,
  Calendar,
  BarChart3,
  Sparkles,
  BookOpen,
  Navigation,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from "@military/ui";
import { useAuthStore } from "@/lib/store";

export function AviationInstructorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const quickLinks = [
    {
      title: "AI Mission Generator",
      description: "Generate fire plans & missions",
      href: "/aviation-instructor/ai-generator",
      icon: Sparkles,
    },
    {
      title: "Training Analytics",
      description: "Performance metrics",
      href: "/aviation-instructor/analytics",
      icon: BarChart3,
    },
    {
      title: "Pilot Trainees",
      description: "Manage trainees",
      href: "/aviation-instructor/pilots",
      icon: Users,
      count: 24,
    },
    {
      title: "Flight Scenarios",
      description: "Training scenarios",
      href: "/aviation-instructor/scenarios",
      icon: Target,
      count: 18,
    },
    {
      title: "3D Simulator",
      description: "Flight training",
      href: "/training",
      icon: Navigation,
    },
    {
      title: "Joint Operations",
      description: "Air-ground coordination",
      href: "/aviation-instructor/joint-operations",
      icon: Plane,
    },
  ];

  const upcomingSessions = [
    { name: "CAS Procedures - Batch Alpha", time: "10:00 AM", trainees: 8, platform: "Rudra" },
    { name: "Fire Adjustment Training", time: "2:00 PM", trainees: 6, platform: "ALH Dhruv" },
    { name: "Night Operations Simulation", time: "6:00 PM", trainees: 4, platform: "Apache" },
  ];

  const traineePerformance = {
    excellent: 8,
    good: 12,
    needsImprovement: 4,
    total: 24,
  };

  const recentActivities = [
    { action: "Lt. Kumar completed CAS module", status: "success", time: "30 min ago" },
    { action: "Capt. Sharma needs re-evaluation", status: "warning", time: "2 hours ago" },
    { action: "Batch Bravo passed fire adjustment", status: "success", time: "3 hours ago" },
    { action: "New scenario added: Urban CAS", status: "info", time: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Aviation Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <Plane className="h-3 w-3" />
          Aviation Instructor
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Trainees</p>
                <p className="text-2xl font-bold">{traineePerformance.total}</p>
              </div>
              <Users className="h-8 w-8 text-emerald-500 opacity-50" />
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
              <Calendar className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">83%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scenarios</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Target className="h-8 w-8 text-emerald-500 opacity-50" />
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
                      {session.trainees} trainees • {session.platform}
                    </p>
                  </div>
                  <Badge variant="outline">{session.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trainee Performance & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trainee Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trainee Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Excellent</span>
                  <span className="text-green-500">{traineePerformance.excellent}</span>
                </div>
                <Progress
                  value={(traineePerformance.excellent / traineePerformance.total) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Good</span>
                  <span className="text-emerald-500">{traineePerformance.good}</span>
                </div>
                <Progress
                  value={(traineePerformance.good / traineePerformance.total) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Needs Improvement</span>
                  <span className="text-yellow-500">{traineePerformance.needsImprovement}</span>
                </div>
                <Progress
                  value={(traineePerformance.needsImprovement / traineePerformance.total) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}
