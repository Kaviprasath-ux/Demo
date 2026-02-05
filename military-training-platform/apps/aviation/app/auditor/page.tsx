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
        return <ArrowUp className="w-4 h-4 text-primary" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400";
      case "major":
        return "bg-primary/20 text-primary";
      case "minor":
        return "bg-primary/20 text-primary";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Eye className="w-8 h-8 text-red-500" />
          Audit Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Training compliance and performance overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-xs text-primary">
              {overview.completedSessions} completed
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {overview.totalTrainingSessions}
          </p>
          <p className="text-xs text-muted-foreground">Total Sessions</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {overview.avgComplianceRate}%
          </p>
          <p className="text-xs text-muted-foreground">Compliance Rate</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{overview.openFindings}</p>
          <p className="text-xs text-muted-foreground">Open Findings</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {overview.pendingReports}
          </p>
          <p className="text-xs text-muted-foreground">Pending Reports</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {overview.activeTrainees}
          </p>
          <p className="text-xs text-muted-foreground">Active Trainees</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">
            {overview.activeInstructors}
          </p>
          <p className="text-xs text-muted-foreground">Active Instructors</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <FileText className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{reports.length}</p>
          <p className="text-xs text-muted-foreground">Total Reports</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{overview.lastAuditDate}</p>
          <p className="text-xs text-muted-foreground">Last Audit</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compliance Overview */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
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
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {complianceStats.compliant}
                </p>
                <p className="text-sm text-muted-foreground">Compliant</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {complianceStats.partial}
                </p>
                <p className="text-sm text-muted-foreground">Partial</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-400">
                  {complianceStats.nonCompliant}
                </p>
                <p className="text-sm text-muted-foreground">Non-Compliant</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-muted-foreground">
                  {complianceStats.pending}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
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
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="text-foreground font-medium">{metric.name}</p>
                  <p className="text-xs text-muted-foreground">{metric.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-foreground font-semibold">
                      {metric.currentValue}
                      {metric.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
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
                className="p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-foreground font-medium">{finding.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(
                      finding.severity
                    )}`}
                  >
                    {finding.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{finding.category}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Due: {finding.dueDate}</span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      finding.status === "in-progress"
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-500/20 text-muted-foreground"
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
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
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
                className="p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-foreground font-medium text-sm">{report.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      report.status === "final"
                        ? "bg-primary/20 text-primary"
                        : report.status === "draft"
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-500/20 text-muted-foreground"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/auditor/reports">
            <Button className="bg-red-600 hover:bg-red-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </Link>
          <Link href="/auditor/compliance">
            <Button className="bg-primary hover:bg-primary/90">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Review Compliance
            </Button>
          </Link>
          <Link href="/auditor/findings">
            <Button className="bg-primary hover:bg-primary/90">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Log Finding
            </Button>
          </Link>
          <Link href="/auditor/metrics">
            <Button variant="outline" className="border-border">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Metrics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
