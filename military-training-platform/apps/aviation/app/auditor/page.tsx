"use client";

export const dynamic = "force-dynamic";

import {
  Eye,
  FileText,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { Button } from "@military/ui";
import Link from "next/link";
import { useAuditorStore } from "@/lib/stores/auditor-store";

export default function AuditorDashboard() {
  const { reports, complianceItems, metrics, findings, overview } =
    useAuditorStore();

  const recentReports = reports.slice(0, 4);
  const openFindings = findings.filter(
    (f) => f.status === "open" || f.status === "in-progress"
  );
  const criticalFindings = findings.filter((f) => f.severity === "critical" || f.severity === "major");

  const complianceStats = {
    compliant: complianceItems.filter((c) => c.status === "compliant").length,
    partial: complianceItems.filter((c) => c.status === "partial").length,
    nonCompliant: complianceItems.filter((c) => c.status === "non-compliant").length,
    pending: complianceItems.filter((c) => c.status === "pending").length,
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400";
      case "major":
        return "bg-emerald-500/20 text-emerald-400";
      case "minor":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-emerald-500/20 text-emerald-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Eye className="w-8 h-8 text-red-500" />
          Audit Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Training compliance and performance overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-green-400">
              {overview.completedSessions} completed
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {overview.totalTrainingSessions}
          </p>
          <p className="text-xs text-gray-500">Total Sessions</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {overview.avgComplianceRate}%
          </p>
          <p className="text-xs text-gray-500">Compliance Rate</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{overview.openFindings}</p>
          <p className="text-xs text-gray-500">Open Findings</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {overview.pendingReports}
          </p>
          <p className="text-xs text-gray-500">Pending Reports</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Users className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-white">
            {overview.activeTrainees}
          </p>
          <p className="text-xs text-gray-500">Active Trainees</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Users className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-white">
            {overview.activeInstructors}
          </p>
          <p className="text-xs text-gray-500">Active Instructors</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <FileText className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-white">{reports.length}</p>
          <p className="text-xs text-gray-500">Total Reports</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Calendar className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-white">{overview.lastAuditDate}</p>
          <p className="text-xs text-gray-500">Last Audit</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compliance Overview */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-green-500" />
              Compliance Status
            </h2>
            <Link href="/auditor/compliance">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {complianceStats.compliant}
                </p>
                <p className="text-sm text-gray-400">Compliant</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {complianceStats.partial}
                </p>
                <p className="text-sm text-gray-400">Partial</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-400">
                  {complianceStats.nonCompliant}
                </p>
                <p className="text-sm text-gray-400">Non-Compliant</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gray-400">
                  {complianceStats.pending}
                </p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Key Metrics
            </h2>
            <Link href="/auditor/metrics">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {metrics.slice(0, 4).map((metric) => (
              <div
                key={metric.id}
                className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{metric.name}</p>
                  <p className="text-xs text-gray-500">{metric.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {metric.currentValue}
                      {metric.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Target: {metric.targetValue}
                      {metric.unit}
                    </p>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Findings */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emerald-500" />
              Open Findings
            </h2>
            <Link href="/auditor/findings">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {openFindings.slice(0, 4).map((finding) => (
              <div
                key={finding.id}
                className="p-3 bg-[#0a0a0f] rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium">{finding.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(
                      finding.severity
                    )}`}
                  >
                    {finding.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{finding.category}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Due: {finding.dueDate}</span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      finding.status === "in-progress"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {finding.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Recent Reports
            </h2>
            <Link href="/auditor/reports">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-3 bg-[#0a0a0f] rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium text-sm">{report.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      report.status === "final"
                        ? "bg-green-500/20 text-green-400"
                        : report.status === "draft"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{report.type}</span>
                  <span>{report.period}</span>
                  <span>{report.generatedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/auditor/reports">
            <Button className="bg-red-600 hover:bg-red-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </Link>
          <Link href="/auditor/compliance">
            <Button className="bg-green-600 hover:bg-green-700">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Review Compliance
            </Button>
          </Link>
          <Link href="/auditor/findings">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Log Finding
            </Button>
          </Link>
          <Link href="/auditor/metrics">
            <Button variant="outline" className="border-gray-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Metrics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
