"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuizStore } from "@/lib/quiz-store";
import { useLeaderboardStore } from "@/lib/leaderboard-store";
import { soundEffects } from "@/lib/sound-effects";
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
} from "lucide-react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Quiz Setup Screen
function QuizSetup({ onStart }: { onStart: (cat: string, diff: string, count: number) => void }) {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [questionCount, setQuestionCount] = useState(10);
  const { attempts } = useQuizStore();

  const categories = ["all", "General", "Components", "Safety", "Technical", "Procedures"];
  const difficulties = ["all", "easy", "medium", "hard"];
  const counts = [5, 10, 15, 20];

  // Calculate stats from attempts
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0
    ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.totalQuestions) * 100, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0
    ? Math.max(...attempts.map(a => Math.round((a.score / a.totalQuestions) * 100)))
    : 0;

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
            Start New Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
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

          {/* Start Button */}
          <Button
            className="w-full mt-4"
            size="lg"
            onClick={() => onStart(category, difficulty, questionCount)}
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Quiz
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {attempt.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(attempt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {attempt.score}/{attempt.totalQuestions}
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

// Quiz Results Screen
function QuizResults({ onRetry, onExit }: { onRetry: () => void; onExit: () => void }) {
  const { currentQuiz, selectedAnswers, getScore } = useQuizStore();
  const { addPoints } = useLeaderboardStore();
  const [showReview, setShowReview] = useState(false);

  const score = getScore();

  useEffect(() => {
    // Add points based on score
    const points = Math.round(score.percentage * 0.5);
    addPoints("quiz", points);

    // Play sound
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

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-500">{score.correct}</div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-500">{score.total - score.correct}</div>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">+{Math.round(score.percentage * 0.5)}</div>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onExit}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setShowReview(!showReview)}>
          <BookOpen className="h-4 w-4 mr-1" />
          {showReview ? "Hide Review" : "Review Answers"}
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
                      <Badge variant="outline" className="mt-1 text-xs">
                        {question.category} - {question.difficulty}
                      </Badge>
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

  const handleStart = (category: string, difficulty: string, count: number) => {
    startQuiz(category, difficulty, count);
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
          Knowledge Quiz
        </h1>
        <p className="text-muted-foreground">
          Test your artillery knowledge with timed assessments
        </p>
      </div>

      {/* Content based on state */}
      {!currentQuiz && <QuizSetup onStart={handleStart} />}
      {currentQuiz && !isCompleted && <QuizQuestion />}
      {currentQuiz && isCompleted && <QuizResults onRetry={handleRetry} onExit={handleExit} />}
    </div>
  );
}
