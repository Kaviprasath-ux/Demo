"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Shield,
  Target,
  HardDrive,
  Cpu,
  Clock,
  Activity,
  Server,
  Database,
  Crosshair,
  GraduationCap,
  Layers,
  Calculator,
  Settings,
  BookOpen,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import {
  mockSystemStats,
  mockSystemHealth,
  mockAuditLogs,
  mockUsers,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { gunSystems } from "@/lib/gun-systems";
import { courses } from "@/lib/taxonomy";
import { allMissionScenarios } from "@/lib/gun-data";
import { fdcScenarios } from "@/lib/fdc-simulation";

export function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const quickLinks = [
    {
      title: "User Management",
      description: "Manage system users and roles",
      href: "/admin/users",
      icon: Users,
      count: mockUsers.length,
    },
    {
      title: "Gun Systems",
      description: "Configure artillery systems",
      href: "/admin/gun-systems",
      icon: Crosshair,
      count: gunSystems.length,
    },
    {
      title: "Course Management",
      description: "Manage training courses",
      href: "/admin/courses",
      icon: GraduationCap,
      count: courses.length,
    },
    {
      title: "Mission Scenarios",
      description: "Configure training missions",
      href: "/admin/scenarios",
      icon: Target,
      count: allMissionScenarios.length,
    },
    {
      title: "FDC Configuration",
      description: "Fire Direction Center settings",
      href: "/admin/fdc",
      icon: Calculator,
      count: fdcScenarios.length,
    },
    {
      title: "Content Taxonomy",
      description: "Manage content classification",
      href: "/admin/taxonomy",
      icon: Layers,
    },
    {
      title: "Documents",
      description: "Manage indexed documents",
      href: "/documents",
      icon: FileText,
      count: mockSystemStats.documentsIndexed,
    },
    {
      title: "Audit Logs",
      description: "View system activity",
      href: "/audit",
      icon: Shield,
      count: mockAuditLogs.length,
    },
  ];

  const recentAudit = mockAuditLogs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System Administration
          </h1>
          <Badge variant="destructive" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. System management and monitoring dashboard.
        </p>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-foreground">{mockSystemHealth.uptime}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  All systems operational
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Server className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Storage</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockSystemHealth.storageUsed} GB
                </p>
                <div className="w-32">
                  <Progress
                    value={(mockSystemHealth.storageUsed / mockSystemHealth.storageTotal) * 100}
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  of {mockSystemHealth.storageTotal} GB
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <HardDrive className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockSystemHealth.activeConnections}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockSystemStats.activeUsers} registered users
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">Last Backup</p>
                <p className="text-2xl font-bold text-foreground">6h ago</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(mockSystemHealth.lastBackup)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
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
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                  {link.count !== undefined && (
                    <Badge variant="secondary">{link.count}</Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Audit Activity */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/audit")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAudit.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{log.userName}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                    </div>
                    {log.query && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {log.query}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Stats */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cpu className="h-5 w-5 text-primary" />
            System Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Queries (This Month)</p>
              <p className="text-3xl font-bold">{mockSystemStats.totalQueries.toLocaleString()}</p>
              <p className="text-xs text-green-500">+{mockSystemStats.queryTrend}% from last month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Documents Indexed</p>
              <p className="text-3xl font-bold">{mockSystemStats.documentsIndexed}</p>
              <p className="text-xs text-muted-foreground">Technical manuals & SOPs</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Simulator Sessions</p>
              <p className="text-3xl font-bold">{mockSystemStats.simulatorSessions}</p>
              <p className="text-xs text-green-500">+{mockSystemStats.sessionTrend}% from last month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CPU / Memory</p>
              <p className="text-3xl font-bold">
                {mockSystemHealth.cpuUsage}% / {mockSystemHealth.memoryUsage}%
              </p>
              <p className="text-xs text-muted-foreground">Current usage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Platform Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gun Systems */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-primary" />
              Artillery Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gunSystems.map((system) => (
                <div
                  key={system.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: system.modelColor }}
                    >
                      <Crosshair className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{system.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {system.specs.caliber} • {system.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {system.crewPositions.length} crew
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/admin/gun-systems")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Gun Systems
            </Button>
          </CardContent>
        </Card>

        {/* Training Courses */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Training Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{course.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {course.duration}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/admin/courses")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Courses
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Mission & FDC Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Mission Scenarios</p>
                <p className="text-3xl font-bold text-foreground">{allMissionScenarios.length}</p>
                <p className="text-xs text-muted-foreground">
                  {allMissionScenarios.filter(s => s.difficulty === "beginner").length} beginner,{" "}
                  {allMissionScenarios.filter(s => s.difficulty === "advanced" || s.difficulty === "expert").length} advanced
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
                <p className="text-sm font-medium text-muted-foreground">FDC Scenarios</p>
                <p className="text-3xl font-bold text-foreground">{fdcScenarios.length}</p>
                <p className="text-xs text-muted-foreground">
                  Fire Direction Center training
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Crew Positions</p>
                <p className="text-3xl font-bold text-foreground">
                  {gunSystems.reduce((sum, g) => sum + g.crewPositions.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Across all gun systems
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
