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
    { role: "Artillery Instructors", count: users.filter((u) => u.role === "artillery-instructor").length, color: "bg-emerald-600" },
    { role: "Aviation Instructors", count: users.filter((u) => u.role === "aviation-instructor").length, color: "bg-emerald-500" },
    { role: "Cadets/Trainees", count: users.filter((u) => u.role === "cadet").length, color: "bg-green-500" },
    { role: "Administrators", count: users.filter((u) => u.role === "admin").length, color: "bg-emerald-400" },
    { role: "Auditors", count: users.filter((u) => u.role === "auditor").length, color: "bg-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">
          System overview and management console
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-green-400">{stats.activeUsers} active</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <GraduationCap className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalTrainees}</p>
          <p className="text-xs text-gray-500">Trainees</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalInstructors}</p>
          <p className="text-xs text-gray-500">Instructors</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.systemUptime}</p>
          <p className="text-xs text-gray-500">System Uptime</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Calendar className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
          <p className="text-xs text-gray-500">Total Sessions</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <ClipboardCheck className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalAssessments}</p>
          <p className="text-xs text-gray-500">Assessments</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.avgCompletionRate}%</p>
          <p className="text-xs text-gray-500">Avg Completion</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Activity className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-white">{content.length}</p>
          <p className="text-xs text-gray-500">Content Items</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Activity
            </h2>
            <Link href="/admin/audit-logs">
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-[#0a0a0f] rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : log.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
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
                    <p className="text-white text-sm font-medium">{log.action}</p>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-400">{log.userName}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              User Distribution
            </h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                Manage <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {roleDistribution.map((item) => (
              <div key={item.role}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.role}</span>
                  <span className="text-white">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full">
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
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              Recent Users
            </h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.rank} | {user.role}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    user.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              System Health
            </h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">Database</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">Authentication Service</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">File Storage</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">Notification Service</span>
              </div>
              <span className="text-green-400 text-sm">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/users">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Users className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Activity className="w-4 h-4 mr-2" />
              Manage Content
            </Button>
          </Link>
          <Link href="/admin/audit-logs">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Activity className="w-4 h-4 mr-2" />
              View Audit Logs
            </Button>
          </Link>
          <Link href="/admin/configuration">
            <Button variant="outline" className="border-gray-700">
              <Shield className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
