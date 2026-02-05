"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  X,
  Download,
  Calendar,
  User,
  Shield,
  Database,
  LogIn,
  Settings,
  FileText,
} from "lucide-react";
import { useAdminStore, AuditLog } from "@/lib/stores/admin-store";

export default function AuditLogsPage() {
  const { auditLogs } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesStatus && matchesAction;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return "bg-primary/20 text-primary";
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "warning":
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <LogIn className="w-4 h-4" />;
      case "CREATE":
        return <FileText className="w-4 h-4" />;
      case "UPDATE":
        return <Settings className="w-4 h-4" />;
      case "CONFIG_CHANGE":
        return <Settings className="w-4 h-4" />;
      case "BACKUP":
        return <Database className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-primary/20 text-primary";
      case "CREATE":
        return "bg-primary/20 text-primary";
      case "UPDATE":
        return "bg-primary/20 text-primary";
      case "DELETE":
        return "bg-red-500/20 text-red-400";
      case "CONFIG_CHANGE":
        return "bg-primary/20 text-primary";
      case "BACKUP":
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)));

  const stats = {
    total: auditLogs.length,
    success: auditLogs.filter((l) => l.status === "success").length,
    failed: auditLogs.filter((l) => l.status === "failed").length,
    warning: auditLogs.filter((l) => l.status === "warning").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            System activity and security logs
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <Activity className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Events</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <CheckCircle2 className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.success}</p>
          <p className="text-xs text-muted-foreground">Successful</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
          <p className="text-xs text-muted-foreground">Failed</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Clock className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.warning}</p>
          <p className="text-xs text-muted-foreground">Warnings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Timestamp
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Action
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Resource
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                IP Address
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/50/50">
                <td className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{log.timestamp}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-foreground text-sm font-bold">
                      {log.userName.charAt(0)}
                    </div>
                    <span className="text-foreground text-sm">{log.userName}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded ${getActionColor(
                      log.action
                    )}`}
                  >
                    {getActionIcon(log.action)}
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground text-sm">{log.resource}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded ${getStatusBadge(
                      log.status
                    )}`}
                  >
                    {getStatusIcon(log.status)}
                    {log.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground text-sm font-mono">
                  {log.ipAddress}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Log Details
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedLog.status === "success"
                      ? "bg-primary/20"
                      : selectedLog.status === "failed"
                      ? "bg-red-500/20"
                      : "bg-primary/20"
                  }`}
                >
                  {selectedLog.status === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : selectedLog.status === "failed" ? (
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  ) : (
                    <Clock className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedLog.action}
                  </h3>
                  <p className="text-muted-foreground">{selectedLog.resource}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Log ID</p>
                  <p className="text-foreground font-mono">{selectedLog.id}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-foreground">{selectedLog.timestamp}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">User</p>
                  <p className="text-foreground">{selectedLog.userName}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">User ID</p>
                  <p className="text-foreground font-mono">{selectedLog.userId}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">IP Address</p>
                  <p className="text-foreground font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm px-2 py-1 rounded ${getStatusBadge(
                      selectedLog.status
                    )}`}
                  >
                    {getStatusIcon(selectedLog.status)}
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Details</p>
                <p className="text-foreground">{selectedLog.details}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
