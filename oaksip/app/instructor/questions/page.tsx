"use client";

import { useState } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Bot,
  FileText,
  MessageSquare,
  ListChecks,
  Eye,
  ChevronDown,
  ChevronUp,
  ScrollText,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockQuestionBank, mockSubjectiveQuestions, getRubricById } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import type { Question, SubjectiveQuestion, CourseType } from "@/types";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500/10", variant: "warning" as const },
  approved: { label: "Approved", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-500/10", variant: "success" as const },
  rejected: { label: "Rejected", icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10", variant: "destructive" as const },
};

const difficultyConfig = {
  easy: { label: "Easy", color: "text-green-500", bgColor: "bg-green-500/10" },
  medium: { label: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  hard: { label: "Hard", color: "text-red-500", bgColor: "bg-red-500/10" },
};

const courseLabels: Record<CourseType, string> = {
  YO: "YO",
  LGSC: "LGSC",
  JCO: "JCO",
  OR_CADRE: "OR",
  STA: "STA",
  ALL: "All",
};

// MCQ Question Card Component
function MCQQuestionCard({ question, onApprove, onReject }: {
  question: Question;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const status = statusConfig[question.status];
  const difficulty = difficultyConfig[question.difficulty];

  return (
    <Card className={cn(
      "border-border/50 transition-all",
      question.status === "pending" && "border-yellow-500/30"
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1">
                  <ListChecks className="h-3 w-3" />
                  MCQ
                </Badge>
                <Badge variant={status.variant} className="gap-1">
                  <status.icon className="h-3 w-3" />
                  {status.label}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", difficulty.color)}>
                  {difficulty.label}
                </Badge>
                <Badge variant="secondary">{question.category}</Badge>
              </div>
              <p className="font-medium text-lg">{question.question}</p>
            </div>
            {question.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  onClick={() => onApprove(question.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => onReject(question.id)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border p-3 text-sm",
                  index === question.correctIndex
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border/50"
                )}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {index === question.correctIndex && (
                  <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Explanation: </span>
              {question.explanation}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                AI Generated
              </span>
              {question.source && (
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {question.source}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(question.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Subjective Question Card Component
function SubjectiveQuestionCard({ question, onApprove, onReject }: {
  question: SubjectiveQuestion;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[question.status];
  const difficulty = difficultyConfig[question.difficulty];
  const rubric = getRubricById(question.rubricId);

  return (
    <Card className={cn(
      "border-border/50 transition-all",
      question.status === "pending" && "border-purple-500/30"
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1 border-purple-500 text-purple-500">
                  <MessageSquare className="h-3 w-3" />
                  Subjective
                </Badge>
                <Badge variant={status.variant} className="gap-1">
                  <status.icon className="h-3 w-3" />
                  {status.label}
                </Badge>
                <Badge variant="outline" className={cn("gap-1", difficulty.color)}>
                  {difficulty.label}
                </Badge>
                <Badge variant="secondary">{question.category}</Badge>
                <Badge variant="outline" className="gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {courseLabels[question.course]}
                </Badge>
              </div>
              <p className="font-medium text-lg">{question.question}</p>
            </div>
            {question.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  onClick={() => onApprove(question.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => onReject(question.id)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>

          {/* Context/Scenario */}
          {question.context && (
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Scenario: </span>
                {question.context}
              </p>
            </div>
          )}

          {/* Marks & Time Info */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="font-medium">Max Marks:</span> {question.maxMarks}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Time:</span> {question.timeAllocation} mins
            </span>
            {rubric && (
              <span className="flex items-center gap-1 text-purple-500">
                <ScrollText className="h-4 w-4" />
                Rubric: {rubric.name}
              </span>
            )}
          </div>

          {/* Expand/Collapse */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {expanded ? "Hide Details" : "View Expected Points & Sample Answer"}
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expanded && (
            <>
              {/* Expected Points */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">Expected Points:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {question.expectedPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Sample Answer */}
              {question.sampleAnswer && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                    Model Answer:
                  </p>
                  <p className="text-sm text-muted-foreground">{question.sampleAnswer}</p>
                </div>
              )}

              {/* Rubric Info */}
              {rubric && (
                <div className="rounded-lg border border-purple-500/20 p-4">
                  <p className="text-sm font-medium text-purple-500 mb-2">
                    Evaluation Rubric: {rubric.name}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {rubric.criteria.map((criterion) => (
                      <div key={criterion.id} className="text-xs p-2 bg-muted/50 rounded">
                        <span className="font-medium">{criterion.name}</span>
                        <span className="text-muted-foreground"> (Max: {criterion.maxScore})</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total: {rubric.totalMaxScore} | Pass: {rubric.passingScore}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {question.source && (
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {question.source}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(question.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestionBank);
  const [subjectiveQuestions, setSubjectiveQuestions] = useState<SubjectiveQuestion[]>(mockSubjectiveQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const allCategories = [
    ...new Set([
      ...mockQuestionBank.map((q) => q.category),
      ...mockSubjectiveQuestions.map((q) => q.category),
    ]),
  ];

  const filteredMCQs = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === "all" || q.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory;
  });

  const filteredSubjective = subjectiveQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === "all" || q.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory;
  });

  // Stats
  const mcqPendingCount = questions.filter((q) => q.status === "pending").length;
  const mcqApprovedCount = questions.filter((q) => q.status === "approved").length;
  const subjectivePendingCount = subjectiveQuestions.filter((q) => q.status === "pending").length;
  const subjectiveApprovedCount = subjectiveQuestions.filter((q) => q.status === "approved").length;

  const handleApproveMCQ = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "approved" as const } : q))
    );
  };

  const handleRejectMCQ = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "rejected" as const } : q))
    );
  };

  const handleApproveSubjective = (id: string) => {
    setSubjectiveQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "approved" as const } : q))
    );
  };

  const handleRejectSubjective = (id: string) => {
    setSubjectiveQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "rejected" as const } : q))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ClipboardList className="h-8 w-8" />
          Question Bank
        </h1>
        <p className="text-muted-foreground">
          Review and manage MCQ and subjective questions for assessments.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">MCQ Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
                <p className="text-xs text-muted-foreground">
                  {mcqPendingCount} pending
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ListChecks className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Subjective Questions</p>
                <p className="text-2xl font-bold">{subjectiveQuestions.length}</p>
                <p className="text-xs text-muted-foreground">
                  {subjectivePendingCount} pending
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {mcqPendingCount + subjectivePendingCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-500">
                  {mcqApprovedCount + subjectiveApprovedCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ready for assessments
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
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
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Question Types */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all" className="gap-2">
            All ({filteredMCQs.length + filteredSubjective.length})
          </TabsTrigger>
          <TabsTrigger value="mcq" className="gap-2">
            <ListChecks className="h-4 w-4" />
            MCQ ({filteredMCQs.length})
          </TabsTrigger>
          <TabsTrigger value="subjective" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Subjective ({filteredSubjective.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {/* Show pending first */}
          {[...filteredMCQs.filter(q => q.status === 'pending'), ...filteredSubjective.filter(q => q.status === 'pending')].length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending Review
              </h3>
              {filteredMCQs.filter(q => q.status === 'pending').map((question) => (
                <MCQQuestionCard
                  key={question.id}
                  question={question}
                  onApprove={handleApproveMCQ}
                  onReject={handleRejectMCQ}
                />
              ))}
              {filteredSubjective.filter(q => q.status === 'pending').map((question) => (
                <SubjectiveQuestionCard
                  key={question.id}
                  question={question}
                  onApprove={handleApproveSubjective}
                  onReject={handleRejectSubjective}
                />
              ))}
            </>
          )}

          {/* Approved */}
          {[...filteredMCQs.filter(q => q.status === 'approved'), ...filteredSubjective.filter(q => q.status === 'approved')].length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-6">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </h3>
              {filteredMCQs.filter(q => q.status === 'approved').map((question) => (
                <MCQQuestionCard
                  key={question.id}
                  question={question}
                  onApprove={handleApproveMCQ}
                  onReject={handleRejectMCQ}
                />
              ))}
              {filteredSubjective.filter(q => q.status === 'approved').map((question) => (
                <SubjectiveQuestionCard
                  key={question.id}
                  question={question}
                  onApprove={handleApproveSubjective}
                  onReject={handleRejectSubjective}
                />
              ))}
            </>
          )}

          {filteredMCQs.length === 0 && filteredSubjective.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No questions found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mcq" className="space-y-4 mt-4">
          {filteredMCQs.map((question) => (
            <MCQQuestionCard
              key={question.id}
              question={question}
              onApprove={handleApproveMCQ}
              onReject={handleRejectMCQ}
            />
          ))}
          {filteredMCQs.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No MCQ questions found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subjective" className="space-y-4 mt-4">
          {filteredSubjective.map((question) => (
            <SubjectiveQuestionCard
              key={question.id}
              question={question}
              onApprove={handleApproveSubjective}
              onReject={handleRejectSubjective}
            />
          ))}
          {filteredSubjective.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No subjective questions found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
