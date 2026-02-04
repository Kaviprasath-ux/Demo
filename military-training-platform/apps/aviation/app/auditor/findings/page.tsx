"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  X,
  CheckCircle2,
  Clock,
  Calendar,
  User,
} from "lucide-react";
import { useAuditorStore, AuditFinding } from "@/lib/stores/auditor-store";

type ModalMode = "add" | "edit" | "view" | null;

export default function FindingsPage() {
  const { findings, addFinding, updateFinding } = useAuditorStore();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    severity: "minor" as AuditFinding["severity"],
    category: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  const filteredFindings = findings.filter((finding) => {
    const matchesSearch =
      finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || finding.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || finding.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const openModal = (mode: ModalMode, finding?: AuditFinding) => {
    setModalMode(mode);
    if (finding) {
      setSelectedFinding(finding);
      if (mode === "edit") {
        setFormData({
          title: finding.title,
          severity: finding.severity,
          category: finding.category,
          description: finding.description,
          assignedTo: finding.assignedTo,
          dueDate: finding.dueDate,
        });
      }
    } else {
      setSelectedFinding(null);
      setFormData({
        title: "",
        severity: "minor",
        category: "",
        description: "",
        assignedTo: "",
        dueDate: "",
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedFinding(null);
  };

  const handleSubmit = () => {
    if (modalMode === "add") {
      addFinding({
        ...formData,
        identifiedDate: new Date().toISOString().split("T")[0],
        status: "open",
      });
    } else if (modalMode === "edit" && selectedFinding) {
      updateFinding(selectedFinding.id, formData);
    }
    closeModal();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "major":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "minor":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "observation":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500/20 text-red-400";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "closed":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === "critical").length,
    major: findings.filter((f) => f.severity === "major").length,
    open: findings.filter((f) => f.status === "open" || f.status === "in-progress")
      .length,
    resolved: findings.filter(
      (f) => f.status === "resolved" || f.status === "closed"
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Audit Findings
          </h1>
          <p className="text-gray-400 mt-1">
            Track and manage audit findings and corrective actions
          </p>
        </div>
        <Button
          onClick={() => openModal("add")}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Finding
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Findings</p>
        </div>
        <div className="bg-[#12121a] border border-red-500/30 rounded-xl p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
          <p className="text-xs text-gray-500">Critical</p>
        </div>
        <div className="bg-[#12121a] border border-emerald-500/30 rounded-xl p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-400">{stats.major}</p>
          <p className="text-xs text-gray-500">Major</p>
        </div>
        <div className="bg-[#12121a] border border-yellow-500/30 rounded-xl p-4 text-center">
          <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-yellow-400">{stats.open}</p>
          <p className="text-xs text-gray-500">Open</p>
        </div>
        <div className="bg-[#12121a] border border-green-500/30 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
          <p className="text-xs text-gray-500">Resolved</p>
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
                placeholder="Search findings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="observation">Observation</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className={`bg-[#12121a] border rounded-xl overflow-hidden ${
              finding.severity === "critical"
                ? "border-red-500/30"
                : finding.severity === "major"
                ? "border-emerald-500/30"
                : "border-gray-800"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(
                      finding.severity
                    )}`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{finding.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getSeverityColor(
                          finding.severity
                        )}`}
                      >
                        {finding.severity}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getStatusColor(
                          finding.status
                        )}`}
                      >
                        {finding.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {finding.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal("view", finding)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openModal("edit", finding)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">{finding.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Identified: {finding.identifiedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due: {finding.dueDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {finding.assignedTo}
                </span>
              </div>
              {finding.resolution && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-sm text-green-400">
                    <span className="text-gray-500">Resolution:</span>{" "}
                    {finding.resolution}
                  </p>
                </div>
              )}
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
                {modalMode === "add" && "Log New Finding"}
                {modalMode === "edit" && "Edit Finding"}
                {modalMode === "view" && "Finding Details"}
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
              {modalMode === "view" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center ${getSeverityColor(
                        selectedFinding?.severity || ""
                      )}`}
                    >
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedFinding?.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-sm px-2 py-0.5 rounded border ${getSeverityColor(
                            selectedFinding?.severity || ""
                          )}`}
                        >
                          {selectedFinding?.severity}
                        </span>
                        <span
                          className={`text-sm px-2 py-0.5 rounded ${getStatusColor(
                            selectedFinding?.status || ""
                          )}`}
                        >
                          {selectedFinding?.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0f] p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-white">{selectedFinding?.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Finding ID</p>
                      <p className="text-white font-mono">{selectedFinding?.id}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="text-white">{selectedFinding?.category}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Identified Date</p>
                      <p className="text-white">
                        {selectedFinding?.identifiedDate}
                      </p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Due Date</p>
                      <p className="text-white">{selectedFinding?.dueDate}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                      <p className="text-white">{selectedFinding?.assignedTo}</p>
                    </div>
                  </div>

                  {selectedFinding?.resolution && (
                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Resolution</p>
                      <p className="text-green-400">{selectedFinding.resolution}</p>
                    </div>
                  )}

                  {(selectedFinding?.status === "open" ||
                    selectedFinding?.status === "in-progress") && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          if (selectedFinding) {
                            updateFinding(selectedFinding.id, {
                              status: "in-progress",
                            });
                            closeModal();
                          }
                        }}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        disabled={selectedFinding?.status === "in-progress"}
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedFinding) {
                            const resolution = prompt("Enter resolution:");
                            if (resolution) {
                              updateFinding(selectedFinding.id, {
                                status: "resolved",
                                resolution,
                              });
                              closeModal();
                            }
                          }
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      placeholder="Enter finding title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Severity *
                      </label>
                      <select
                        value={formData.severity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            severity: e.target.value as AuditFinding["severity"],
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="critical">Critical</option>
                        <option value="major">Major</option>
                        <option value="minor">Minor</option>
                        <option value="observation">Observation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        placeholder="e.g., Training, Safety"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
                      placeholder="Describe the finding in detail"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Assigned To *
                      </label>
                      <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) =>
                          setFormData({ ...formData, assignedTo: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        placeholder="Team or person"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode !== "view" && (
              <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {modalMode === "add" ? "Log Finding" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
