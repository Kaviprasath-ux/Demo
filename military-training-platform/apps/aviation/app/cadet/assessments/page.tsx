"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Award,
} from "lucide-react";
import { useCadetStore } from "@/lib/stores/cadet-store";

export default function AssessmentsPage() {
  const { assessments, startAssessment, submitAssessment } = useCadetStore();
  const [viewMode, setViewMode] = useState<"upcoming" | "completed" | "all">("all");
  const [takingAssessment, setTakingAssessment] = useState<string | null>(null);

  const filteredAssessments = assessments.filter((a) => {
    if (viewMode === "upcoming") return a.status === "upcoming";
    if (viewMode === "completed") return a.status === "completed";
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "missed":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: "bg-primary/20 text-primary",
      "in-progress": "bg-primary/20 text-primary",
      completed: "bg-primary/20 text-primary",
      missed: "bg-red-500/20 text-red-400",
    };
    return colors[status] || "bg-gray-500/20 text-muted-foreground";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      quiz: "Quiz",
      practical: "Practical",
      simulator: "Simulator",
      "field-eval": "Field Evaluation",
      "written-exam": "Written Exam",
    };
    return labels[type] || type;
  };

  const handleStartAssessment = (id: string) => {
    startAssessment(id);
    setTakingAssessment(id);
  };

  const handleSubmitAssessment = (id: string) => {
    // Simulate a score for demo
    const score = Math.floor(Math.random() * 30) + 70;
    submitAssessment(id, score);
    setTakingAssessment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            Assessments
          </h1>
          <p className="text-muted-foreground mt-1">Track and complete your assessments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "all"
                ? "bg-primary text-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "upcoming"
                ? "bg-primary text-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewMode("completed")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "completed"
                ? "bg-primary text-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="text-2xl font-bold text-foreground">{assessments.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Upcoming</p>
          <p className="text-2xl font-bold text-primary">
            {assessments.filter((a) => a.status === "upcoming").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Passed</p>
          <p className="text-2xl font-bold text-primary">
            {assessments.filter((a) => a.passed === true).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Avg Score</p>
          <p className="text-2xl font-bold text-primary">
            {Math.round(
              assessments
                .filter((a) => a.score !== undefined)
                .reduce((sum, a) => sum + (a.score || 0), 0) /
                (assessments.filter((a) => a.score !== undefined).length || 1)
            )}
            %
          </p>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {assessment.moduleName}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getStatusColor(
                      assessment.status
                    )}`}
                  >
                    {assessment.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ClipboardCheck className="w-4 h-4" />
                    {getTypeLabel(assessment.type)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {assessment.date}
                  </span>
                  {assessment.timeLimit && (
                    <span className="flex items-center gap-1">
                      Time limit: {assessment.timeLimit} min
                    </span>
                  )}
                  <span>
                    Passing: {assessment.passingScore}%
                  </span>
                  <span>
                    Attempts: {assessment.attemptsMade}/{assessment.attemptsAllowed}
                  </span>
                </div>

                {/* Score Display */}
                {assessment.status === "completed" && assessment.score !== undefined && (
                  <div className="mt-4 flex items-center gap-6">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        assessment.passed
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-red-500/20 border border-red-500/30"
                      }`}
                    >
                      {assessment.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          assessment.passed ? "text-primary" : "text-red-400"
                        }`}
                      >
                        {assessment.score}%
                      </span>
                      <span
                        className={assessment.passed ? "text-primary" : "text-red-400"}
                      >
                        {assessment.passed ? "PASSED" : "FAILED"}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 max-w-xs">
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-3 rounded-full ${
                            assessment.passed ? "bg-primary" : "bg-red-500"
                          }`}
                          style={{ width: `${assessment.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {assessment.feedback && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-muted-foreground">Feedback: </span>
                      {assessment.feedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="ml-4">
                {assessment.status === "upcoming" && (
                  <Button
                    onClick={() => handleStartAssessment(assessment.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}
                {assessment.status === "in-progress" && (
                  <Button
                    onClick={() => handleSubmitAssessment(assessment.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Submit
                  </Button>
                )}
                {assessment.status === "completed" &&
                  !assessment.passed &&
                  assessment.attemptsMade < assessment.attemptsAllowed && (
                    <Button
                      onClick={() => handleStartAssessment(assessment.id)}
                      variant="outline"
                      className="border-border"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No assessments found</p>
        </div>
      )}

      {/* Taking Assessment Modal */}
      {takingAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg m-4 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Assessment in Progress</h2>
              <p className="text-muted-foreground mb-6">
                Complete the assessment questions. This is a demo - click submit to finish.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setTakingAssessment(null)}
                  className="border-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmitAssessment(takingAssessment)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Submit Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
