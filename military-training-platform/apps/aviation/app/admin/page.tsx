"use client";

export const dynamic = "force-dynamic";

import {
  Users,
  UserCheck,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Activity,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@military/ui";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";

export default function AdminDashboard() {
  const { users, auditLogs, content, getStats } = useAdminStore();
  const stats = getStats();

  const recentLogs = auditLogs.slice(0, 5);
  const recentUsers = users.slice(0, 4);

  const roleDistribution = [
    { role: "Artillery Instructors", count: users.filter((u) => u.role === "artillery-instructor").length, color: "bg-primary" },
    { role: "Aviation Instructors", count: users.filter((u) => u.role === "aviation-instructor").length, color: "bg-primary" },
    { role: "Cadets/Trainees", count: users.filter((u) => u.role === "cadet").length, color: "bg-primary" },
    { role: "Administrators", count: users.filter((u) => u.role === "admin").length, color: "bg-emerald-400" },
    { role: "Auditors", count: users.filter((u) => u.role === "auditor").length, color: "bg-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and management console
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-xs text-primary">{stats.activeUsers} active</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
          <p className="text-xs text-muted-foreground">Total Users</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalTrainees}</p>
          <p className="text-xs text-muted-foreground">Trainees</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalInstructors}</p>
          <p className="text-xs text-muted-foreground">Instructors</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.systemUptime}</p>
          <p className="text-xs text-muted-foreground">System Uptime</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground">Total Sessions</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <ClipboardCheck className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.totalAssessments}</p>
          <p className="text-xs text-muted-foreground">Assessments</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <TrendingUp className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.avgCompletionRate}%</p>
          <p className="text-xs text-muted-foreground">Avg Completion</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <Activity className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{content.length}</p>
          <p className="text-xs text-muted-foreground">Content Items</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <Link href="/admin/audit-logs">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.status === "success"
                      ? "bg-primary/20 text-primary"
                      : log.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {log.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : log.status === "failed" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-medium">{log.action}</p>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.userName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Distribution
            </h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                Manage <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {roleDistribution.map((item) => (
              <div key={item.role}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.role}</span>
                  <span className="text-foreground">{item.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{
                      width: `${(item.count / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Recent Users
            </h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-foreground font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.rank} | {user.role}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    user.status === "active"
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-500/20 text-muted-foreground"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              System Health
            </h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-foreground">Database</span>
              </div>
              <span className="text-primary text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-foreground">Authentication Service</span>
              </div>
              <span className="text-primary text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-foreground">File Storage</span>
              </div>
              <span className="text-primary text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-foreground">Notification Service</span>
              </div>
              <span className="text-primary text-sm">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/users">
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button className="bg-primary hover:bg-primary/90">
              <Activity className="w-4 h-4 mr-2" />
              Manage Content
            </Button>
          </Link>
          <Link href="/admin/audit-logs">
            <Button className="bg-primary hover:bg-primary/90">
              <Activity className="w-4 h-4 mr-2" />
              View Audit Logs
            </Button>
          </Link>
          <Link href="/admin/configuration">
            <Button variant="outline" className="border-border">
              <Shield className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
