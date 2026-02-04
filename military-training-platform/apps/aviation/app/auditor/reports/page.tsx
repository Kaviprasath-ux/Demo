"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  FileText,
  Plus,
  Search,
  Eye,
  X,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
} from "lucide-react";
import { useAuditorStore, TrainingReport } from "@/lib/stores/auditor-store";

type ModalMode = "view" | "generate" | null;

export default function ReportsPage() {
  const { reports, generateReport, updateReportStatus } = useAuditorStore();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedReport, setSelectedReport] = useState<TrainingReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [newReportType, setNewReportType] = useState<TrainingReport["type"]>("compliance");
  const [newReportPeriod, setNewReportPeriod] = useState("");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openModal = (mode: ModalMode, report?: TrainingReport) => {
    setModalMode(mode);
    if (report) {
      setSelectedReport(report);
    } else {
      setSelectedReport(null);
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedReport(null);
    setNewReportPeriod("");
  };

  const handleGenerateReport = () => {
    if (newReportPeriod) {
      generateReport(newReportType, newReportPeriod);
      closeModal();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return <Shield className="w-5 h-5" />;
      case "performance":
        return <TrendingUp className="w-5 h-5" />;
      case "incident":
        return <AlertTriangle className="w-5 h-5" />;
      case "assessment":
        return <FileText className="w-5 h-5" />;
      case "operational":
        return <Activity className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "compliance":
        return "bg-green-500/20 text-green-400";
      case "performance":
        return "bg-emerald-500/20 text-emerald-400";
      case "incident":
        return "bg-red-500/20 text-red-400";
      case "assessment":
        return "bg-emerald-500/20 text-emerald-400";
      case "operational":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "final":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const stats = {
    total: reports.length,
    final: reports.filter((r) => r.status === "final").length,
    draft: reports.filter((r) => r.status === "draft").length,
    archived: reports.filter((r) => r.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-red-500" />
            Audit Reports
          </h1>
          <p className="text-gray-400 mt-1">
            Generate and manage training audit reports
          </p>
        </div>
        <Button
          onClick={() => openModal("generate")}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <FileText className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Reports</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.final}</p>
          <p className="text-xs text-gray-500">Final</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Clock className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.draft}</p>
          <p className="text-xs text-gray-500">Draft</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Archive className="w-5 h-5 text-gray-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.archived}</p>
          <p className="text-xs text-gray-500">Archived</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="compliance">Compliance</option>
              <option value="performance">Performance</option>
              <option value="incident">Incident</option>
              <option value="assessment">Assessment</option>
              <option value="operational">Operational</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="final">Final</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(
                    report.type
                  )}`}
                >
                  {getTypeIcon(report.type)}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusBadge(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{report.title}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {report.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>Period: {report.period}</span>
                <span>Generated: {report.generatedDate}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs">
                  <AlertTriangle className="w-3 h-3 text-emerald-400" />
                  <span className="text-gray-400">{report.findings} findings</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">
                    {report.recommendations} recommendations
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 p-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                By: {report.generatedBy}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openModal("view", report)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {modalMode === "generate" && "Generate New Report"}
                {modalMode === "view" && "Report Details"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalMode === "generate" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Report Type *
                    </label>
                    <select
                      value={newReportType}
                      onChange={(e) =>
                        setNewReportType(e.target.value as TrainingReport["type"])
                      }
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="compliance">Compliance Report</option>
                      <option value="performance">Performance Analysis</option>
                      <option value="incident">Incident Report</option>
                      <option value="assessment">Assessment Review</option>
                      <option value="operational">Operational Readiness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Report Period *
                    </label>
                    <input
                      type="text"
                      value={newReportPeriod}
                      onChange={(e) => setNewReportPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="e.g., Q4 2024, Dec 2024, Jan-Mar 2025"
                    />
                  </div>
                  <div className="bg-[#0a0a0f] p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Report will include:</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Training session analysis</li>
                      <li>• Assessment score trends</li>
                      <li>• Compliance metrics</li>
                      <li>• Findings and recommendations</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center ${getTypeColor(
                        selectedReport?.type || ""
                      )}`}
                    >
                      {getTypeIcon(selectedReport?.type || "")}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedReport?.title}
                      </h3>
                      <p className="text-gray-400 capitalize">
                        {selectedReport?.type} Report
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Report ID</p>
                      <p className="text-white font-mono">{selectedReport?.id}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span
                        className={`text-sm px-2 py-1 rounded ${getStatusBadge(
                          selectedReport?.status || ""
                        )}`}
                      >
                        {selectedReport?.status}
                      </span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Period</p>
                      <p className="text-white">{selectedReport?.period}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Generated</p>
                      <p className="text-white">{selectedReport?.generatedDate}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Findings</p>
                      <p className="text-emerald-400 font-semibold">
                        {selectedReport?.findings}
                      </p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Recommendations</p>
                      <p className="text-green-400 font-semibold">
                        {selectedReport?.recommendations}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0f] p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Summary</p>
                    <p className="text-white">{selectedReport?.summary}</p>
                  </div>

                  <div className="bg-[#0a0a0f] p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Generated By</p>
                    <p className="text-white">{selectedReport?.generatedBy}</p>
                  </div>

                  {selectedReport?.status === "draft" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          if (selectedReport) {
                            updateReportStatus(selectedReport.id, "final");
                            closeModal();
                          }
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Finalize Report
                      </Button>
                    </div>
                  )}

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode === "generate" && (
              <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!newReportPeriod}
                >
                  Generate Report
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
