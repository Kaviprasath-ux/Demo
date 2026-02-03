"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useQuizStore, QuizConfig, TopicScore } from "@/lib/quiz-store";
import { soundEffects } from "@/lib/sound-effects";
import { CourseType, AssessmentType } from "@/types";
import {
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Target,
  Zap,
  BookOpen,
  AlertCircle,
  Award,
  GraduationCap,
  FileText,
  Minus,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Course labels for display
const courseLabels: Record<CourseType, string> = {
  YO: "Young Officers (YO)",
  LGSC: "Long Gunnery Staff Course",
  JCO: "JCO Course",
  OR_CADRE: "OR Cadre",
  STA: "STA Course",
  ALL: "All Courses",
};

// Assessment type labels
const assessmentLabels: Record<AssessmentType, { label: string; description: string; color: string }> = {
  diagnostic: { label: "Diagnostic", description: "Pre-course assessment", color: "bg-blue-500" },
  practice: { label: "Practice", description: "Formative, no records", color: "bg-green-500" },
  summative: { label: "Summative", description: "Graded examination", color: "bg-orange-500" },
  requalification: { label: "Requalification", description: "Re-certification test", color: "bg-purple-500" },
};

// Quiz Setup Screen
function QuizSetup({ onStart }: { onStart: (config: QuizConfig) => void }) {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [questionCount, setQuestionCount] = useState(10);
  const [course, setCourse] = useState<CourseType>("ALL");
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("practice");
  const [negativeMarking, setNegativeMarking] = useState(false);
  const { attempts } = useQuizStore();

  const categories = ["all", "General", "Components", "Safety", "Technical", "Procedures", "Tactics", "Maintenance"];
  const difficulties = ["all", "easy", "medium", "hard"];
  const counts = [5, 10, 15, 20];
  const courses: CourseType[] = ["ALL", "YO", "LGSC", "JCO", "OR_CADRE", "STA"];
  const assessmentTypes: AssessmentType[] = ["practice", "diagnostic", "summative", "requalification"];

  // Calculate stats from attempts
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0
    ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.totalQuestions) * 100, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0
    ? Math.max(...attempts.map(a => Math.round((a.score / a.totalQuestions) * 100)))
    : 0;

  const handleStart = () => {
    onStart({
      category,
      difficulty,
      count: questionCount,
      course,
      assessmentType,
      negativeMarking,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Quizzes Taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-500">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-500">{bestScore}%</div>
            <p className="text-xs text-muted-foreground">Best Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Start New Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Course Selection - SOW Requirement */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Course
            </label>
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <Button
                  key={c}
                  variant={course === c ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCourse(c)}
                  className="text-xs"
                >
                  {courseLabels[c]}
                </Button>
              ))}
            </div>
          </div>

          {/* Assessment Type - SOW Section 8.2 */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Assessment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {assessmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setAssessmentType(type)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    assessmentType === type
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${assessmentLabels[type].color}`} />
                    <span className="text-sm font-medium">{assessmentLabels[type].label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{assessmentLabels[type].description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Topic Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                >
                  {cat === "all" ? "All Topics" : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  className={
                    diff === "easy" ? "border-green-500" :
                    diff === "medium" ? "border-yellow-500" :
                    diff === "hard" ? "border-red-500" : ""
                  }
                >
                  {diff === "all" ? "Mixed" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="text-sm font-medium mb-2 block">Number of Questions</label>
            <div className="flex gap-2">
              {counts.map((count) => (
                <Button
                  key={count}
                  variant={questionCount === count ? "default" : "outline"}
                  size="sm"
                  onClick={() => setQuestionCount(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>

          {/* Negative Marking Toggle - SOW Requirement */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <Minus className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Negative Marking</p>
                <p className="text-xs text-muted-foreground">
                  -0.25 marks for each wrong answer (Standard -1/4 rule)
                </p>
              </div>
            </div>
            <Switch
              checked={negativeMarking}
              onCheckedChange={setNegativeMarking}
            />
          </div>

          {/* Start Button */}
          <Button
            className="w-full mt-4"
            size="lg"
            onClick={handleStart}
          >
            <Zap className="h-4 w-4 mr-2" />
            Start {assessmentLabels[assessmentType].label} Assessment
          </Button>
        </CardContent>
      </Card>

      {/* Recent Attempts */}
      {attempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {attempt.category}
                    </Badge>
                    {attempt.course && attempt.course !== "ALL" && (
                      <Badge variant="secondary" className="text-xs">
                        {attempt.course}
                      </Badge>
                    )}
                    {attempt.negativeMarking && (
                      <Badge variant="destructive" className="text-xs">
                        -ve
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(attempt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {attempt.negativeMarking ? attempt.netScore?.toFixed(1) : attempt.score}/{attempt.totalQuestions}
                    </span>
                    <span className={`text-sm font-bold ${
                      (attempt.score / attempt.totalQuestions) >= 0.8 ? "text-green-500" :
                      (attempt.score / attempt.totalQuestions) >= 0.6 ? "text-yellow-500" :
                      "text-red-500"
                    }`}>
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Quiz Question Screen
function QuizQuestion() {
  const {
    currentQuiz,
    currentQuestionIndex,
    selectedAnswers,
    startTime,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
  } = useQuizStore();

  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!currentQuiz) return null;

  const question = currentQuiz[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuiz.length - 1;
  const answeredCount = selectedAnswers.filter((a) => a !== null).length;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {currentQuiz.length}
          </Badge>
          <Badge
            className={
              question.difficulty === "easy" ? "bg-green-500" :
              question.difficulty === "medium" ? "bg-yellow-500" :
              "bg-red-500"
            }
          >
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Target className="h-4 w-4" />
            {answeredCount}/{currentQuiz.length}
          </div>
          <div className="flex items-center gap-1 text-sm font-mono">
            <Clock className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={((currentQuestionIndex + 1) / currentQuiz.length) * 100} className="h-2" />

      {/* Question Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {question.category}
              </Badge>
              <h2 className="text-lg font-semibold">{question.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        selectedAnswer === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={submitQuiz}
            disabled={answeredCount < currentQuiz.length}
          >
            Submit Quiz
            <CheckCircle2 className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={nextQuestion}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-1 justify-center">
        {currentQuiz.map((_, index) => (
          <button
            key={index}
            onClick={() => useQuizStore.setState({ currentQuestionIndex: index })}
            className={`w-8 h-8 rounded text-xs font-medium ${
              currentQuestionIndex === index
                ? "bg-primary text-primary-foreground"
                : selectedAnswers[index] !== null
                ? "bg-green-500/20 text-green-500 border border-green-500"
                : "bg-muted"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Topic Breakdown Component - SOW Section 8.3 requirement
function TopicBreakdown({ breakdown }: { breakdown: TopicScore[] }) {
  if (breakdown.length === 0) return null;

  // Sort by percentage (lowest first to highlight weak areas)
  const sortedBreakdown = [...breakdown].sort((a, b) => a.percentage - b.percentage);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Topic-wise Performance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedBreakdown.map((topic) => {
            const isWeak = topic.percentage < 60;
            const isStrong = topic.percentage >= 80;

            return (
              <div key={topic.topic} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{topic.topic}</span>
                    {isWeak && (
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Needs Focus
                      </Badge>
                    )}
                    {isStrong && (
                      <Badge variant="default" className="text-xs flex items-center gap-1 bg-green-500">
                        <TrendingUp className="h-3 w-3" />
                        Strong
                      </Badge>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isStrong ? "text-green-500" : isWeak ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {topic.correct}/{topic.total} ({topic.percentage}%)
                  </span>
                </div>
                <Progress
                  value={topic.percentage}
                  className={`h-2 ${isWeak ? "[&>div]:bg-red-500" : isStrong ? "[&>div]:bg-green-500" : ""}`}
                />
              </div>
            );
          })}
        </div>

        {/* Weak Areas Summary */}
        {sortedBreakdown.filter(t => t.percentage < 60).length > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm font-medium text-red-500 mb-1">Areas Requiring Improvement</p>
            <p className="text-xs text-muted-foreground">
              Focus on: {sortedBreakdown.filter(t => t.percentage < 60).map(t => t.topic).join(", ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Export Report Function
function exportQuizReport(
  score: { correct: number; total: number; percentage: number; netScore: number; wrongAnswers: number },
  breakdown: TopicScore[],
  config: QuizConfig | null
) {
  // Generate report content
  const reportDate = new Date().toLocaleString();
  const reportContent = `
OAKSIP ARTILLERY TRAINING PLATFORM
ASSESSMENT REPORT
================================

Report Generated: ${reportDate}

ASSESSMENT CONFIGURATION
------------------------
Course: ${config ? courseLabels[config.course] : "All Courses"}
Assessment Type: ${config ? assessmentLabels[config.assessmentType].label : "Practice"}
Category: ${config?.category === "all" ? "All Topics" : config?.category || "All Topics"}
Difficulty: ${config?.difficulty === "all" ? "Mixed" : config?.difficulty || "Mixed"}
Negative Marking: ${config?.negativeMarking ? "Enabled (-0.25 per wrong answer)" : "Disabled"}

RESULTS SUMMARY
---------------
Total Questions: ${score.total}
Correct Answers: ${score.correct}
Wrong Answers: ${score.wrongAnswers}
Unanswered: ${score.total - score.correct - score.wrongAnswers}
Raw Score: ${score.correct}/${score.total}
${config?.negativeMarking ? `Net Score (after deductions): ${score.netScore.toFixed(2)}/${score.total}` : ""}
Percentage: ${score.percentage}%
Grade: ${score.percentage >= 90 ? "A+" : score.percentage >= 80 ? "A" : score.percentage >= 70 ? "B" : score.percentage >= 60 ? "C" : score.percentage >= 50 ? "D" : "F"}

TOPIC-WISE ANALYSIS
-------------------
${breakdown.map(t => `${t.topic}: ${t.correct}/${t.total} (${t.percentage}%) ${t.percentage < 60 ? "- NEEDS IMPROVEMENT" : t.percentage >= 80 ? "- STRONG" : ""}`).join("\n")}

AREAS REQUIRING FOCUS
---------------------
${breakdown.filter(t => t.percentage < 60).length > 0
  ? breakdown.filter(t => t.percentage < 60).map(t => `- ${t.topic}`).join("\n")
  : "No significant weak areas identified."}

RECOMMENDATIONS
---------------
${score.percentage >= 80
  ? "Excellent performance. Continue with advanced topics and practical exercises."
  : score.percentage >= 60
  ? "Good progress. Focus on weak areas identified above for improvement."
  : "Additional study recommended. Review fundamental concepts and retake assessment."}

================================
School of Artillery, Deolali
AI-Based Offline Artillery Intelligence Platform
  `.trim();

  // Create and download file
  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `OAKSIP_Assessment_Report_${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Quiz Results Screen
function QuizResults({ onRetry, onExit }: { onRetry: () => void; onExit: () => void }) {
  const { currentQuiz, selectedAnswers, getScore, getTopicBreakdown, currentConfig } = useQuizStore();
  const [showReview, setShowReview] = useState(false);

  const score = getScore();
  const topicBreakdown = getTopicBreakdown();

  useEffect(() => {
    // Play sound on completion
    if (score.percentage >= 70) {
      soundEffects.playSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentQuiz) return null;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { grade: "A+", text: "EXCELLENT!", color: "text-green-500" };
    if (pct >= 80) return { grade: "A", text: "Great Job!", color: "text-green-500" };
    if (pct >= 70) return { grade: "B", text: "Good Work", color: "text-yellow-500" };
    if (pct >= 60) return { grade: "C", text: "Satisfactory", color: "text-yellow-500" };
    if (pct >= 50) return { grade: "D", text: "Needs Improvement", color: "text-orange-500" };
    return { grade: "F", text: "Try Again", color: "text-red-500" };
  };

  const gradeInfo = getGrade(score.percentage);

  return (
    <div className="space-y-6">
      {/* Results Card */}
      <Card className="text-center">
        <CardContent className="pt-6 pb-8">
          <div className="mb-4">
            <Award className={`h-16 w-16 mx-auto ${gradeInfo.color}`} />
          </div>

          <h2 className={`text-4xl font-bold mb-2 ${gradeInfo.color}`}>
            {score.percentage}%
          </h2>
          <p className="text-xl font-semibold mb-1">{gradeInfo.text}</p>
          <p className="text-muted-foreground">
            {score.correct} of {score.total} questions correct
          </p>

          {/* Assessment Info */}
          {currentConfig && (
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <Badge variant="outline">{courseLabels[currentConfig.course]}</Badge>
              <Badge className={assessmentLabels[currentConfig.assessmentType].color}>
                {assessmentLabels[currentConfig.assessmentType].label}
              </Badge>
              {currentConfig.negativeMarking && (
                <Badge variant="destructive">-ve Marking</Badge>
              )}
            </div>
          )}

          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-500">{score.correct}</div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-500">{score.wrongAnswers}</div>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-gray-500">{score.total - score.correct - score.wrongAnswers}</div>
              <p className="text-xs text-muted-foreground">Skipped</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className={`text-2xl font-bold ${currentConfig?.negativeMarking ? "text-orange-500" : "text-primary"}`}>
                {currentConfig?.negativeMarking ? score.netScore.toFixed(1) : score.correct}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentConfig?.negativeMarking ? "Net Score" : "Points"}
              </p>
            </div>
          </div>

          {/* Negative Marking Breakdown */}
          {currentConfig?.negativeMarking && score.wrongAnswers > 0 && (
            <div className="mt-4 p-3 bg-orange-500/10 rounded-lg text-sm">
              <p className="text-orange-500">
                Deduction: -{(score.wrongAnswers * 0.25).toFixed(2)} ({score.wrongAnswers} wrong × 0.25)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topic Breakdown - SOW requirement */}
      <TopicBreakdown breakdown={topicBreakdown} />

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" className="flex-1" onClick={onExit}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setShowReview(!showReview)}>
          <BookOpen className="h-4 w-4 mr-1" />
          {showReview ? "Hide Review" : "Review Answers"}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => exportQuizReport(score, topicBreakdown, currentConfig)}
        >
          <Download className="h-4 w-4 mr-1" />
          Export Report
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
      </div>

      {/* Review Section */}
      {showReview && (
        <div className="space-y-4">
          {currentQuiz.map((question, qIndex) => {
            const userAnswer = selectedAnswers[qIndex];
            const isCorrect = userAnswer === question.correctIndex;

            return (
              <Card key={question.id} className={isCorrect ? "border-green-500/50" : "border-red-500/50"}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{question.question}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.difficulty}
                        </Badge>
                        {question.course && question.course !== "ALL" && (
                          <Badge variant="secondary" className="text-xs">
                            {question.course}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 ml-7">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`text-sm p-2 rounded ${
                          oIndex === question.correctIndex
                            ? "bg-green-500/20 text-green-700 dark:text-green-300"
                            : userAnswer === oIndex && !isCorrect
                            ? "bg-red-500/20 text-red-700 dark:text-red-300"
                            : ""
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + oIndex)}.
                        </span>
                        {option}
                        {oIndex === question.correctIndex && " ✓"}
                        {userAnswer === oIndex && !isCorrect && " ✗"}
                      </div>
                    ))}
                  </div>

                  {!isCorrect && (
                    <div className="mt-3 ml-7 p-2 bg-muted rounded-lg">
                      <div className="flex items-start gap-1">
                        <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  const { currentQuiz, isCompleted, startQuiz, resetQuiz } = useQuizStore();

  const handleStart = (config: QuizConfig) => {
    startQuiz(config);
  };

  const handleRetry = () => {
    resetQuiz();
  };

  const handleExit = () => {
    resetQuiz();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Artillery Knowledge Assessment
        </h1>
        <p className="text-muted-foreground">
          SoA course-aligned assessments with multi-dimensional analytics
        </p>
      </div>

      {/* Content based on state */}
      {!currentQuiz && <QuizSetup onStart={handleStart} />}
      {currentQuiz && !isCompleted && <QuizQuestion />}
      {currentQuiz && isCompleted && <QuizResults onRetry={handleRetry} onExit={handleExit} />}
    </div>
  );
}
