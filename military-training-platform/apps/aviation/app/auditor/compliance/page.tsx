"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  ClipboardCheck,
  Search,
  Filter,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { useAuditorStore, ComplianceItem } from "@/lib/stores/auditor-store";

export default function CompliancePage() {
  const { complianceItems } = useAuditorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const filteredItems = complianceItems.filter((item) => {
    const matchesSearch =
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "non-compliant":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "partial":
        return <AlertTriangle className="w-5 h-5 text-primary" />;
      case "pending":
        return <Clock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-primary/20 text-primary border-primary/30";
      case "non-compliant":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "partial":
        return "bg-primary/20 text-primary border-yellow-500/30";
      case "pending":
        return "bg-gray-500/20 text-muted-foreground border-gray-500/30";
      default:
        return "bg-gray-500/20 text-muted-foreground border-gray-500/30";
    }
  };

  const stats = {
    total: complianceItems.length,
    compliant: complianceItems.filter((c) => c.status === "compliant").length,
    partial: complianceItems.filter((c) => c.status === "partial").length,
    nonCompliant: complianceItems.filter((c) => c.status === "non-compliant").length,
    pending: complianceItems.filter((c) => c.status === "pending").length,
  };

  const complianceRate = Math.round(
    ((stats.compliant + stats.partial * 0.5) / stats.total) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-red-500" />
          Compliance Tracking
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor training compliance and regulatory requirements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{complianceRate}%</p>
          <p className="text-xs text-muted-foreground">Overall Compliance</p>
        </div>
        <div className="bg-card border border-primary/30 rounded-lg p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{stats.compliant}</p>
          <p className="text-xs text-muted-foreground">Compliant</p>
        </div>
        <div className="bg-card border border-yellow-500/30 rounded-lg p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{stats.partial}</p>
          <p className="text-xs text-muted-foreground">Partial</p>
        </div>
        <div className="bg-card border border-red-500/30 rounded-lg p-4 text-center">
          <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-400">{stats.nonCompliant}</p>
          <p className="text-xs text-muted-foreground">Non-Compliant</p>
        </div>
        <div className="bg-card border border-gray-500/30 rounded-lg p-4 text-center">
          <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-2xl font-bold text-muted-foreground">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
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
                placeholder="Search compliance items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="partial">Partial</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-card border rounded-lg overflow-hidden ${getStatusBadge(
              item.status
            ).replace("text-", "border-").split(" ")[2]}`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      item.status === "compliant"
                        ? "bg-primary/20"
                        : item.status === "non-compliant"
                        ? "bg-red-500/20"
                        : item.status === "partial"
                        ? "bg-primary/20"
                        : "bg-gray-500/20"
                    }`}
                  >
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground font-semibold">{item.category}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{item.requirement}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last Audit: {item.lastAuditDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Next Audit: {item.nextAuditDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.assignedTo}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              {item.notes && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-muted-foreground">Notes:</span> {item.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-red-500" />
                Compliance Details
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    selectedItem.status === "compliant"
                      ? "bg-primary/20"
                      : selectedItem.status === "non-compliant"
                      ? "bg-red-500/20"
                      : selectedItem.status === "partial"
                      ? "bg-primary/20"
                      : "bg-gray-500/20"
                  }`}
                >
                  {getStatusIcon(selectedItem.status)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedItem.category}
                  </h3>
                  <span
                    className={`text-sm px-2 py-1 rounded border ${getStatusBadge(
                      selectedItem.status
                    )}`}
                  >
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Requirement</p>
                <p className="text-foreground">{selectedItem.requirement}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Item ID</p>
                  <p className="text-foreground font-mono">{selectedItem.id}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
                  <p className="text-foreground">{selectedItem.assignedTo}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Last Audit Date</p>
                  <p className="text-foreground">{selectedItem.lastAuditDate}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Next Audit Date</p>
                  <p className="text-foreground">{selectedItem.nextAuditDate}</p>
                </div>
              </div>

              {selectedItem.notes && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="text-foreground">{selectedItem.notes}</p>
                </div>
              )}

              {selectedItem.evidence.length > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Evidence</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.evidence.map((ev, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-muted text-gray-300 rounded"
                      >
                        <FileText className="w-3 h-3" />
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
