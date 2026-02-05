"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  ClipboardCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  Award,
} from "lucide-react";
import {
  useAviationInstructorStore,
  PilotAssessment,
} from "@/lib/stores/aviation-instructor-store";

export default function AssessmentsPage() {
  const { assessments, pilots, addAssessment, updateAssessment, deleteAssessment } =
    useAviationInstructorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<PilotAssessment | null>(null);

  const [formData, setFormData] = useState({
    pilotId: "",
    pilotName: "",
    type: "flight-check" as PilotAssessment["type"],
    date: "",
    status: "scheduled" as PilotAssessment["status"],
    scores: {} as PilotAssessment["scores"],
    passingScore: 75,
    passed: undefined as boolean | undefined,
    examinerNotes: "",
    recommendations: "",
    retakeAllowed: true,
  });

  const [gradeData, setGradeData] = useState({
    preFlightProcedures: 0,
    takeoffLanding: 0,
    navigation: 0,
    emergencyProcedures: 0,
    communication: 0,
    casExecution: 0,
    crewCoordination: 0,
    decisionMaking: 0,
    examinerNotes: "",
    recommendations: "",
  });

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.pilotName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const resetForm = () => {
    setFormData({
      pilotId: "",
      pilotName: "",
      type: "flight-check",
      date: "",
      status: "scheduled",
      scores: {},
      passingScore: 75,
      passed: undefined,
      examinerNotes: "",
      recommendations: "",
      retakeAllowed: true,
    });
  };

  const handleAdd = () => {
    const pilot = pilots.find((p) => p.id === formData.pilotId);
    addAssessment({
      ...formData,
      pilotName: pilot?.name || "",
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleGrade = () => {
    if (selectedAssessment) {
      const overall = Math.round(
        (gradeData.preFlightProcedures +
          gradeData.takeoffLanding +
          gradeData.navigation +
          gradeData.emergencyProcedures +
          gradeData.communication +
          gradeData.casExecution +
          gradeData.crewCoordination +
          gradeData.decisionMaking) /
          8
      );
      updateAssessment(selectedAssessment.id, {
        status: "completed",
        scores: {
          preFlightProcedures: gradeData.preFlightProcedures,
          takeoffLanding: gradeData.takeoffLanding,
          navigation: gradeData.navigation,
          emergencyProcedures: gradeData.emergencyProcedures,
          communication: gradeData.communication,
          casExecution: gradeData.casExecution,
          crewCoordination: gradeData.crewCoordination,
          decisionMaking: gradeData.decisionMaking,
          overall,
        },
        passed: overall >= selectedAssessment.passingScore,
        examinerNotes: gradeData.examinerNotes,
        recommendations: gradeData.recommendations,
      });
      setShowGradeModal(false);
      setSelectedAssessment(null);
    }
  };

  const handleDelete = () => {
    if (selectedAssessment) {
      deleteAssessment(selectedAssessment.id);
      setShowDeleteModal(false);
      setSelectedAssessment(null);
    }
  };

  const openGradeModal = (assessment: PilotAssessment) => {
    setSelectedAssessment(assessment);
    setGradeData({
      preFlightProcedures: assessment.scores.preFlightProcedures || 0,
      takeoffLanding: assessment.scores.takeoffLanding || 0,
      navigation: assessment.scores.navigation || 0,
      emergencyProcedures: assessment.scores.emergencyProcedures || 0,
      communication: assessment.scores.communication || 0,
      casExecution: assessment.scores.casExecution || 0,
      crewCoordination: assessment.scores.crewCoordination || 0,
      decisionMaking: assessment.scores.decisionMaking || 0,
      examinerNotes: assessment.examinerNotes,
      recommendations: assessment.recommendations,
    });
    setShowGradeModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-primary/20 text-primary",
      "in-progress": "bg-primary/20 text-primary",
      completed: "bg-primary/20 text-primary",
      failed: "bg-red-500/20 text-red-400",
      retake: "bg-primary/20 text-primary",
    };
    return colors[status] || "bg-gray-500/20 text-muted-foreground";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      written: "Written Exam",
      oral: "Oral Exam",
      "simulator-check": "Simulator Check",
      "flight-check": "Flight Check",
      "cas-evaluation": "CAS Evaluation",
      "final-checkride": "Final Checkride",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            Pilot Assessments
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and grade pilot proficiency assessments
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Assessment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by pilot name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="retake">Retake</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="written">Written</option>
          <option value="oral">Oral</option>
          <option value="simulator-check">Simulator Check</option>
          <option value="flight-check">Flight Check</option>
          <option value="cas-evaluation">CAS Evaluation</option>
          <option value="final-checkride">Final Checkride</option>
        </select>
      </div>

      {/* Assessments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Pilot</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Result</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredAssessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-muted/50/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-foreground font-medium">{assessment.pilotName}</p>
                    <p className="text-xs text-muted-foreground">{assessment.pilotId}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{getTypeLabel(assessment.type)}</td>
                <td className="px-4 py-3 text-gray-300">{assessment.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(assessment.status)}`}>
                    {assessment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {assessment.scores.overall !== undefined ? (
                    <span className="text-foreground font-medium">{assessment.scores.overall}%</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {assessment.passed !== undefined ? (
                    assessment.passed ? (
                      <span className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        Pass
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-4 h-4" />
                        Fail
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setShowViewModal(true);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {(assessment.status === "scheduled" || assessment.status === "in-progress") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openGradeModal(assessment)}
                        className="text-primary hover:text-emerald-300"
                      >
                        <Award className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assessments found</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Schedule Assessment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Select Pilot *</label>
                <select
                  value={formData.pilotId}
                  onChange={(e) => setFormData({ ...formData, pilotId: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">Select pilot</option>
                  {pilots
                    .filter((p) => p.status === "active")
                    .map((pilot) => (
                      <option key={pilot.id} value={pilot.id}>
                        {pilot.name} ({pilot.rank})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Assessment Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as PilotAssessment["type"] })
                  }
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="written">Written Exam</option>
                  <option value="oral">Oral Exam</option>
                  <option value="simulator-check">Simulator Check</option>
                  <option value="flight-check">Flight Check</option>
                  <option value="cas-evaluation">CAS Evaluation</option>
                  <option value="final-checkride">Final Checkride</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Passing Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData({ ...formData, passingScore: parseInt(e.target.value) || 75 })
                  }
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.retakeAllowed}
                  onChange={(e) => setFormData({ ...formData, retakeAllowed: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-muted/50 text-primary"
                />
                Retake Allowed
              </label>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!formData.pilotId || !formData.date}
                className="bg-primary hover:bg-primary/90"
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Grade Assessment</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedAssessment.pilotName} - {getTypeLabel(selectedAssessment.type)}
                </p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Pre-flight Procedures</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.preFlightProcedures}
                    onChange={(e) =>
                      setGradeData({
                        ...gradeData,
                        preFlightProcedures: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Takeoff/Landing</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.takeoffLanding}
                    onChange={(e) =>
                      setGradeData({
                        ...gradeData,
                        takeoffLanding: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Navigation</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.navigation}
                    onChange={(e) =>
                      setGradeData({ ...gradeData, navigation: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Emergency Procedures</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.emergencyProcedures}
                    onChange={(e) =>
                      setGradeData({
                        ...gradeData,
                        emergencyProcedures: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Communication</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.communication}
                    onChange={(e) =>
                      setGradeData({ ...gradeData, communication: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">CAS Execution</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.casExecution}
                    onChange={(e) =>
                      setGradeData({ ...gradeData, casExecution: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Crew Coordination</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.crewCoordination}
                    onChange={(e) =>
                      setGradeData({
                        ...gradeData,
                        crewCoordination: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Decision Making</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeData.decisionMaking}
                    onChange={(e) =>
                      setGradeData({
                        ...gradeData,
                        decisionMaking: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculated Overall */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Calculated Overall Score:</span>
                  <span className="text-2xl font-bold text-foreground">
                    {Math.round(
                      (gradeData.preFlightProcedures +
                        gradeData.takeoffLanding +
                        gradeData.navigation +
                        gradeData.emergencyProcedures +
                        gradeData.communication +
                        gradeData.casExecution +
                        gradeData.crewCoordination +
                        gradeData.decisionMaking) /
                        8
                    )}
                    %
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Passing Score: {selectedAssessment.passingScore}%
                </p>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Examiner Notes</label>
                <textarea
                  value={gradeData.examinerNotes}
                  onChange={(e) => setGradeData({ ...gradeData, examinerNotes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  placeholder="Observations and feedback..."
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Recommendations</label>
                <textarea
                  value={gradeData.recommendations}
                  onChange={(e) => setGradeData({ ...gradeData, recommendations: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  placeholder="Areas for improvement..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowGradeModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleGrade} className="bg-primary hover:bg-primary/90">
                Submit Grades
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Assessment Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedAssessment.pilotName}</h3>
                  <p className="text-muted-foreground">{getTypeLabel(selectedAssessment.type)}</p>
                  <p className="text-sm text-muted-foreground">Date: {selectedAssessment.date}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(selectedAssessment.status)}`}>
                    {selectedAssessment.status}
                  </span>
                  {selectedAssessment.passed !== undefined && (
                    <div className="mt-2">
                      {selectedAssessment.passed ? (
                        <span className="flex items-center justify-end gap-1 text-primary">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-red-400">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Scores */}
              {selectedAssessment.scores.overall !== undefined && (
                <div>
                  <h4 className="text-foreground font-semibold mb-3">Score Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedAssessment.scores).map(([key, value]) => {
                      if (key === "overall") return null;
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-foreground">{value}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                (value || 0) >= selectedAssessment.passingScore
                                  ? "bg-primary"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Overall Score:</span>
                      <span
                        className={`text-2xl font-bold ${
                          selectedAssessment.passed ? "text-primary" : "text-red-400"
                        }`}
                      >
                        {selectedAssessment.scores.overall}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Passing Score: {selectedAssessment.passingScore}%
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedAssessment.examinerNotes && (
                <div>
                  <h4 className="text-foreground font-semibold mb-2">Examiner Notes</h4>
                  <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                    {selectedAssessment.examinerNotes}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {selectedAssessment.recommendations && (
                <div>
                  <h4 className="text-foreground font-semibold mb-2">Recommendations</h4>
                  <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                    {selectedAssessment.recommendations}
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="ghost" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md m-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Delete Assessment</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete the {getTypeLabel(selectedAssessment.type)} for{" "}
                <span className="text-foreground font-medium">{selectedAssessment.pilotName}</span>?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
