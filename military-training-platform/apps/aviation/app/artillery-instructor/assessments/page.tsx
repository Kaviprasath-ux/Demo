"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  ClipboardCheck,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  X,
  Filter,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  User,
  FileText,
} from "lucide-react";
import {
  useArtilleryInstructorStore,
  FOOAssessment,
} from "@/lib/stores/artillery-instructor-store";

export default function AssessmentsPage() {
  const {
    assessments,
    addAssessment,
    updateAssessment,
    removeAssessment,
    trainees,
    scenarios,
  } = useArtilleryInstructorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAssessment, setSelectedAssessment] = useState<FOOAssessment | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGradeDialog, setShowGradeDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [gradingAssessment, setGradingAssessment] = useState<FOOAssessment | null>(null);

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.phase.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: assessments.length,
    pending: assessments.filter((a) => a.status === "pending").length,
    passed: assessments.filter((a) => a.status === "passed").length,
    failed: assessments.filter((a) => a.status === "failed").length,
  };

  const getTypeColor = (type: FOOAssessment["type"]) => {
    switch (type) {
      case "written":
        return "bg-primary/20 text-primary";
      case "practical":
        return "bg-primary/20 text-primary";
      case "simulator":
        return "bg-primary/20 text-primary";
      case "field":
        return "bg-primary/20 text-primary";
      case "final-checkride":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const getStatusColor = (status: FOOAssessment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-primary/20 text-primary";
      case "passed":
        return "bg-primary/20 text-primary";
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "incomplete":
        return "bg-gray-500/20 text-muted-foreground";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: FOOAssessment["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "passed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "incomplete":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeTrainees = trainees.filter((t) => t.status === "active");
  const activeScenarios = scenarios.filter((s) => s.status === "active");

  const handleAddAssessment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const traineeId = formData.get("trainee") as string;
    const trainee = trainees.find((t) => t.id === traineeId);

    const scenarioId = formData.get("scenario") as string;
    const scenario = scenarios.find((s) => s.id === scenarioId);

    addAssessment({
      traineeId,
      traineeName: trainee ? `${trainee.rank} ${trainee.name}` : "",
      type: formData.get("type") as FOOAssessment["type"],
      phase: formData.get("phase") as string,
      scenarioId: scenarioId || undefined,
      scenarioName: scenario?.title,
      date: formData.get("date") as string,
      duration: formData.get("duration") as string,
      instructorId: "ins1",
      instructorName: "Col R.K. Sharma",
      status: "pending",
      maxScore: parseInt(formData.get("maxScore") as string) || 100,
      passingScore: parseInt(formData.get("passingScore") as string) || 70,
      evaluations: [],
      overallRemarks: "",
      recommendations: [],
      retakeAllowed: true,
    });
    setShowAddDialog(false);
  };

  const handleGradeAssessment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gradingAssessment) return;

    const formData = new FormData(e.currentTarget);
    const score = parseInt(formData.get("score") as string);
    const passingScore = gradingAssessment.passingScore;

    updateAssessment(gradingAssessment.id, {
      score,
      status: score >= passingScore ? "passed" : "failed",
      fireCallAccuracy: parseInt(formData.get("fireCallAccuracy") as string) || undefined,
      targetEngagementTime: parseFloat(formData.get("targetEngagementTime") as string) || undefined,
      communicationScore: parseInt(formData.get("communicationScore") as string) || undefined,
      safetyScore: parseInt(formData.get("safetyScore") as string) || undefined,
      overallRemarks: formData.get("overallRemarks") as string,
      recommendations: (formData.get("recommendations") as string).split("\n").filter((r) => r.trim()),
      retakeAllowed: formData.get("retakeAllowed") === "on",
    });
    setShowGradeDialog(false);
    setGradingAssessment(null);
  };

  const handleDeleteAssessment = (id: string) => {
    removeAssessment(id);
    setShowDeleteConfirm(null);
    if (selectedAssessment?.id === id) {
      setSelectedAssessment(null);
    }
  };

  // Sort by date descending
  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            FOO Assessments
          </h1>
          <p className="text-muted-foreground mt-1">
            Evaluate and grade trainee performance
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Assessments</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.passed}</p>
              <p className="text-sm text-muted-foreground">Passed</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by trainee name or phase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Types</option>
            <option value="written">Written</option>
            <option value="practical">Practical</option>
            <option value="simulator">Simulator</option>
            <option value="field">Field</option>
            <option value="final-checkride">Final Checkride</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-3">
        {sortedAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-card border border-border rounded-lg hover:border-border transition-colors cursor-pointer"
            onClick={() => setSelectedAssessment(assessment)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-lg font-bold text-foreground">
                    {assessment.traineeName.split(" ").pop()?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{assessment.traineeName}</h3>
                    <p className="text-sm text-muted-foreground">{assessment.phase}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(assessment.type)}`}>
                      {assessment.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(assessment.status)}`}>
                      {getStatusIcon(assessment.status)}
                      {assessment.status}
                    </span>
                  </div>

                  {assessment.score !== undefined && (
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        assessment.score >= assessment.passingScore ? 'text-primary' : 'text-red-400'
                      }`}>
                        {assessment.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">Pass: {assessment.passingScore}%</p>
                    </div>
                  )}

                  <div className="text-right text-sm text-muted-foreground">
                    <p>{assessment.date}</p>
                    <p>{assessment.duration}</p>
                  </div>
                </div>
              </div>

              {assessment.scenarioName && (
                <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                  <Target className="w-4 h-4" />
                  {assessment.scenarioName}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No assessments found matching your criteria</p>
        </div>
      )}

      {/* View Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(selectedAssessment.type)}`}>
                      {selectedAssessment.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(selectedAssessment.status)}`}>
                      {getStatusIcon(selectedAssessment.status)}
                      {selectedAssessment.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedAssessment.traineeName}</h2>
                  <p className="text-muted-foreground">{selectedAssessment.phase}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAssessment(null)}
                  className="text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Assessment Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-foreground font-medium">{selectedAssessment.date}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-foreground font-medium">{selectedAssessment.duration}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Max Score</p>
                  <p className="text-foreground font-medium">{selectedAssessment.maxScore}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Passing Score</p>
                  <p className="text-foreground font-medium">{selectedAssessment.passingScore}%</p>
                </div>
              </div>

              {/* Scenario */}
              {selectedAssessment.scenarioName && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Scenario
                  </h3>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <p className="text-primary font-medium">{selectedAssessment.scenarioName}</p>
                  </div>
                </div>
              )}

              {/* Score */}
              {selectedAssessment.score !== undefined && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Score</h3>
                  <div className={`rounded-lg p-6 text-center ${
                    selectedAssessment.score >= selectedAssessment.passingScore
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <p className={`text-5xl font-bold ${
                      selectedAssessment.score >= selectedAssessment.passingScore
                        ? 'text-primary'
                        : 'text-red-400'
                    }`}>
                      {selectedAssessment.score}%
                    </p>
                    <p className="text-muted-foreground mt-2">
                      {selectedAssessment.score >= selectedAssessment.passingScore ? 'PASSED' : 'FAILED'}
                    </p>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {(selectedAssessment.fireCallAccuracy ||
                selectedAssessment.communicationScore ||
                selectedAssessment.safetyScore) && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedAssessment.fireCallAccuracy && (
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedAssessment.fireCallAccuracy}%
                        </p>
                        <p className="text-xs text-muted-foreground">Fire Call Accuracy</p>
                      </div>
                    )}
                    {selectedAssessment.targetEngagementTime && (
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedAssessment.targetEngagementTime}min
                        </p>
                        <p className="text-xs text-muted-foreground">Engagement Time</p>
                      </div>
                    )}
                    {selectedAssessment.communicationScore && (
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedAssessment.communicationScore}%
                        </p>
                        <p className="text-xs text-muted-foreground">Communication</p>
                      </div>
                    )}
                    {selectedAssessment.safetyScore && (
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedAssessment.safetyScore}%
                        </p>
                        <p className="text-xs text-muted-foreground">Safety</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Evaluations */}
              {selectedAssessment.evaluations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Detailed Evaluations</h3>
                  <div className="space-y-2">
                    {selectedAssessment.evaluations.map((evaluation, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs text-muted-foreground">{evaluation.category}</span>
                            <p className="text-foreground font-medium">{evaluation.criterion}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              evaluation.points >= evaluation.maxPoints * 0.8
                                ? 'text-primary'
                                : evaluation.points >= evaluation.maxPoints * 0.6
                                  ? 'text-primary'
                                  : 'text-red-400'
                            }`}>
                              {evaluation.points}/{evaluation.maxPoints}
                            </p>
                          </div>
                        </div>
                        {evaluation.remarks && (
                          <p className="text-sm text-muted-foreground mt-1">{evaluation.remarks}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remarks */}
              {selectedAssessment.overallRemarks && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Overall Remarks</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-gray-300">
                    {selectedAssessment.overallRemarks}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedAssessment.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Retake Info */}
              {selectedAssessment.status === "failed" && (
                <div className={`rounded-lg p-4 ${
                  selectedAssessment.retakeAllowed
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <p className={`font-medium ${
                    selectedAssessment.retakeAllowed ? 'text-primary' : 'text-red-400'
                  }`}>
                    {selectedAssessment.retakeAllowed
                      ? 'Retake Allowed'
                      : 'Retake Not Allowed'}
                  </p>
                  {selectedAssessment.retakeDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Scheduled: {selectedAssessment.retakeDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex justify-between">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(selectedAssessment.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedAssessment(null)} className="border-border">
                  Close
                </Button>
                {selectedAssessment.status === "pending" && (
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setGradingAssessment(selectedAssessment);
                      setShowGradeDialog(true);
                      setSelectedAssessment(null);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Grade Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Assessment Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Schedule New Assessment</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddDialog(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleAddAssessment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Trainee</label>
                <select
                  name="trainee"
                  required
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">Select trainee</option>
                  {activeTrainees.map((trainee) => (
                    <option key={trainee.id} value={trainee.id}>
                      {trainee.rank} {trainee.name} - {trainee.currentPhase}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Type</label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="written">Written</option>
                    <option value="practical">Practical</option>
                    <option value="simulator">Simulator</option>
                    <option value="field">Field</option>
                    <option value="final-checkride">Final Checkride</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phase</label>
                  <select
                    name="phase"
                    required
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Scenario (Optional)</label>
                <select
                  name="scenario"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">No scenario</option>
                  {activeScenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.title} ({scenario.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Duration</label>
                  <input
                    name="duration"
                    required
                    placeholder="e.g., 2h"
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Max Score</label>
                  <input
                    name="maxScore"
                    type="number"
                    required
                    defaultValue={100}
                    min={1}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Passing Score (%)</label>
                  <input
                    name="passingScore"
                    type="number"
                    required
                    defaultValue={70}
                    min={1}
                    max={100}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  className="border-border"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Schedule Assessment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Assessment Dialog */}
      {showGradeDialog && gradingAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Grade Assessment</h2>
                <p className="text-muted-foreground">{gradingAssessment.traineeName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowGradeDialog(false);
                  setGradingAssessment(null);
                }}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleGradeAssessment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Score (Passing: {gradingAssessment.passingScore}%)
                </label>
                <input
                  name="score"
                  type="number"
                  required
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none text-2xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Fire Call Accuracy (%)</label>
                  <input
                    name="fireCallAccuracy"
                    type="number"
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Engagement Time (min)</label>
                  <input
                    name="targetEngagementTime"
                    type="number"
                    step="0.1"
                    min={0}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Communication Score (%)</label>
                  <input
                    name="communicationScore"
                    type="number"
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Safety Score (%)</label>
                  <input
                    name="safetyScore"
                    type="number"
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Overall Remarks</label>
                <textarea
                  name="overallRemarks"
                  required
                  rows={3}
                  placeholder="Assessment feedback and observations..."
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Recommendations (one per line)</label>
                <textarea
                  name="recommendations"
                  rows={3}
                  placeholder="Practice abort procedures&#10;Continue to advanced scenarios"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="retakeAllowed"
                  id="retakeAllowed"
                  defaultChecked={true}
                  className="rounded border-border bg-card"
                />
                <label htmlFor="retakeAllowed" className="text-sm text-foreground cursor-pointer">
                  Allow retake if failed
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowGradeDialog(false);
                    setGradingAssessment(null);
                  }}
                  className="border-border"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Submit Grade
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Confirm Delete</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this assessment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDeleteAssessment(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
