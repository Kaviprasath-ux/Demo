"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  User,
  FileText,
  Eye,
  Edit2,
  Download,
  MessageSquare,
  Award,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAnswerScripts, mockScheduledAssessments } from "@/lib/mock-data";
import { AnswerScript } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig = {
  submitted: { label: "Submitted", color: "text-blue-500", bgColor: "bg-blue-500/10", icon: FileText },
  "under-review": { label: "Under Review", color: "text-yellow-500", bgColor: "bg-yellow-500/10", icon: Clock },
  graded: { label: "Graded", color: "text-green-500", bgColor: "bg-green-500/10", icon: CheckCircle },
  returned: { label: "Returned", color: "text-purple-500", bgColor: "bg-purple-500/10", icon: Award },
};

const gradeConfig: Record<string, { color: string; bgColor: string }> = {
  "A+": { color: "text-green-500", bgColor: "bg-green-500/10" },
  "A": { color: "text-green-500", bgColor: "bg-green-500/10" },
  "B": { color: "text-blue-500", bgColor: "bg-blue-500/10" },
  "C": { color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  "D": { color: "text-orange-500", bgColor: "bg-orange-500/10" },
  "F": { color: "text-red-500", bgColor: "bg-red-500/10" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Answer Script Card Component
function AnswerScriptCard({ script, onGrade }: { script: AnswerScript; onGrade: (id: string) => void }) {
  const status = statusConfig[script.status];
  const StatusIcon = status.icon;
  const assessment = mockScheduledAssessments.find(a => a.id === script.assessmentId);
  const grade = gradeConfig[script.grade] || { color: "text-muted-foreground", bgColor: "bg-muted" };

  return (
    <Card className={cn(
      "border-border/50 transition-all",
      script.status === "submitted" && "border-blue-500/30",
      script.status === "under-review" && "border-yellow-500/30"
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{script.traineeName}</h3>
                <p className="text-sm text-muted-foreground">ID: {script.traineeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn(status.color, status.bgColor)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
              {script.status === "graded" && (
                <Badge className={cn(grade.color, grade.bgColor, "text-lg font-bold px-3")}>
                  {script.grade}
                </Badge>
              )}
            </div>
          </div>

          {/* Assessment Info */}
          {assessment && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">{assessment.title}</p>
              <p className="text-xs text-muted-foreground">
                {assessment.course} | {formatDate(assessment.scheduledDate)}
              </p>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">MCQ Score</span>
                <span className="font-medium">{script.mcqScore}</span>
              </div>
              <Progress value={(script.mcqScore / (assessment?.totalMarks || 100)) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subjective Score</span>
                <span className="font-medium">{script.subjectiveScore}</span>
              </div>
              <Progress value={(script.subjectiveScore / (assessment?.totalMarks || 100)) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Score</span>
                <span className="font-bold text-lg">{script.totalScore} ({script.percentage}%)</span>
              </div>
              <Progress
                value={script.percentage}
                className={cn(
                  "h-2",
                  script.percentage >= 80 ? "[&>div]:bg-green-500" :
                  script.percentage >= 60 ? "[&>div]:bg-blue-500" :
                  script.percentage >= 40 ? "[&>div]:bg-yellow-500" :
                  "[&>div]:bg-red-500"
                )}
              />
            </div>
          </div>

          {/* MCQ Summary */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {script.mcqAnswers.filter(a => a.isCorrect).length} correct
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              {script.mcqAnswers.filter(a => !a.isCorrect).length} incorrect
            </span>
            {script.subjectiveAnswers.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                {script.subjectiveAnswers.length} subjective answers
              </span>
            )}
          </div>

          {/* Feedback */}
          {script.overallFeedback && (
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-sm">
                <span className="font-medium text-green-500">Feedback: </span>
                {script.overallFeedback}
              </p>
            </div>
          )}

          {/* Submission Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Submitted: {formatDate(script.submittedAt)}</span>
            {script.gradedAt && script.gradedBy && (
              <span>Graded by {script.gradedBy} on {formatDate(script.gradedAt)}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              View Full Script
            </Button>
            {(script.status === "submitted" || script.status === "under-review") && (
              <Button size="sm" className="flex-1" onClick={() => onGrade(script.id)}>
                <Edit2 className="h-4 w-4 mr-1" />
                Grade Script
              </Button>
            )}
            {script.status === "graded" && (
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnswerScriptsPage() {
  const [scripts, setScripts] = useState<AnswerScript[]>(mockAnswerScripts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assessmentFilter, setAssessmentFilter] = useState<string>("all");

  const filteredScripts = scripts.filter((s) => {
    const matchesSearch =
      s.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.traineeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesAssessment = assessmentFilter === "all" || s.assessmentId === assessmentFilter;
    return matchesSearch && matchesStatus && matchesAssessment;
  });

  // Stats
  const submittedCount = scripts.filter(s => s.status === "submitted").length;
  const underReviewCount = scripts.filter(s => s.status === "under-review").length;
  const gradedCount = scripts.filter(s => s.status === "graded").length;
  const avgScore = gradedCount > 0
    ? Math.round(scripts.filter(s => s.status === "graded").reduce((sum, s) => sum + s.percentage, 0) / gradedCount)
    : 0;

  const handleGrade = (id: string) => {
    // In a real app, this would open a grading interface
    setScripts((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "graded" as const,
              gradedAt: new Date(),
              gradedBy: "USR002",
              overallFeedback: "Good performance. Review safety procedures for improvement.",
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          Answer Scripts
        </h1>
        <p className="text-muted-foreground">
          Review, grade, and manage trainee answer scripts
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold">{submittedCount}</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-yellow-500">{underReviewCount}</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold text-green-500">{gradedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-purple-500">{avgScore}%</p>
                <p className="text-xs text-muted-foreground">Graded scripts</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by trainee name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={assessmentFilter} onValueChange={setAssessmentFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Assessment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assessments</SelectItem>
                  {mockScheduledAssessments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Review Alert */}
      {submittedCount > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm">
                <span className="font-medium">{submittedCount} scripts</span> awaiting review.
                Please grade them to provide timely feedback to trainees.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scripts List */}
      <div className="space-y-4">
        {filteredScripts.map((script) => (
          <AnswerScriptCard key={script.id} script={script} onGrade={handleGrade} />
        ))}

        {filteredScripts.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No answer scripts found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
