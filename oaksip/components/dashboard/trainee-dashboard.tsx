"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  Brain,
  Crosshair,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Star,
  Zap,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QueryInput } from "@/components/search/query-input";
import { useQueryStore, useAuthStore } from "@/lib/store";
import { getUserStats, getTraineeProgressHistory, getUpcomingAssessments } from "@/lib/mock-data";
import { useQuizStore, TopicScore } from "@/lib/quiz-store";
import { Calendar, Flag, Clock } from "lucide-react";
import { TraineeProgressionCard } from "./trainee-progression-card";

// Calculate aggregate topic performance from all quiz attempts
function calculateTopicPerformance(attempts: { topicBreakdown?: TopicScore[] }[]): TopicScore[] {
  const topicAggregates: Record<string, { correct: number; total: number }> = {};

  attempts.forEach((attempt) => {
    if (attempt.topicBreakdown) {
      attempt.topicBreakdown.forEach((topic) => {
        if (!topicAggregates[topic.topic]) {
          topicAggregates[topic.topic] = { correct: 0, total: 0 };
        }
        topicAggregates[topic.topic].correct += topic.correct;
        topicAggregates[topic.topic].total += topic.total;
      });
    }
  });

  return Object.entries(topicAggregates)
    .map(([topic, scores]) => ({
      topic,
      correct: scores.correct,
      total: scores.total,
      percentage: scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage); // Sort by weakest first
}

// Progress Chart Component - SOW Section 8.3
function ProgressChart({ data }: { data: { date: Date; score: number }[] }) {
  if (data.length === 0) return null;

  const maxScore = Math.max(...data.map(d => d.score), 100);
  const minScore = Math.min(...data.map(d => d.score), 0);

  return (
    <div className="h-32 flex items-end gap-1">
      {data.slice(-10).map((point, index) => {
        const height = ((point.score - minScore) / (maxScore - minScore)) * 100;

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t transition-all ${
                point.score >= 80 ? "bg-green-500" :
                point.score >= 60 ? "bg-blue-500" :
                point.score >= 40 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              style={{ height: `${Math.max(height, 10)}%` }}
              title={`${point.score}%`}
            />
            <span className="text-[10px] text-muted-foreground">
              {point.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }).split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TraineeDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { search, isLoading } = useQueryStore();
  const { attempts } = useQuizStore();
  const userStats = user ? getUserStats(user.id) : null;

  // Get progress history for the trainee - SOW Section 8.3
  const progressHistory = user ? getTraineeProgressHistory(user.id) : undefined;
  const upcomingAssessments = getUpcomingAssessments();

  // Calculate topic performance from quiz history - SOW Section 8.3 requirement
  const topicPerformance = calculateTopicPerformance(attempts);
  const weakTopics = topicPerformance.filter((t) => t.percentage < 60);
  const strongTopics = topicPerformance.filter((t) => t.percentage >= 80);

  const handleQuickSearch = async (query: string) => {
    await search(query);
    router.push("/search");
  };

  // Calculate training progress
  const trainingModules = [
    { name: "Gun Components", progress: 85, status: "completed" },
    { name: "Safety Procedures", progress: 100, status: "completed" },
    { name: "Firing Procedures", progress: 60, status: "in-progress" },
    { name: "Maintenance", progress: 30, status: "in-progress" },
    { name: "Tactical Operations", progress: 0, status: "locked" },
  ];

  const recentAchievements = [
    { title: "Safety Expert", description: "Completed all safety modules", icon: Award },
    { title: "Quick Learner", description: "5-day learning streak", icon: Zap },
    { title: "Sharp Shooter", description: "90%+ on targeting quiz", icon: Target },
  ];

  const quickLinks = [
    {
      title: "Knowledge Search",
      description: "Search technical manuals",
      href: "/search",
      icon: Search,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Take a Quiz",
      description: "Test your knowledge",
      href: "/quiz",
      icon: Brain,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "3D Training",
      description: "Interactive gun model",
      href: "/training",
      icon: Crosshair,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "My Stats",
      description: "View performance",
      href: "/simulator",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Training Dashboard
          </h1>
          <Badge className="gap-1 bg-green-500 hover:bg-green-600">
            <BookOpen className="h-3 w-3" />
            Trainee
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Continue your artillery training journey.
        </p>
      </div>

      {/* Quick Search */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Quick Knowledge Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QueryInput
            onSearch={handleQuickSearch}
            isLoading={isLoading}
            size="large"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {[
              "Range of 155mm gun",
              "Fire control procedures",
              "Safety protocols",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleQuickSearch(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Scorecard */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Quiz Score</p>
                <p className="text-3xl font-bold text-foreground">
                  {userStats?.avgQuizScore || 0}%
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% this week
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Brain className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Quizzes Taken</p>
                <p className="text-3xl font-bold text-foreground">
                  {userStats?.quizzesTaken || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {attempts.length} recent attempts
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Training Hours</p>
                <p className="text-3xl font-bold text-foreground">
                  {userStats?.trainingSessionsCompleted || 0}
                </p>
                <p className="text-xs text-muted-foreground">Sessions completed</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                <Crosshair className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Queries</p>
                <p className="text-3xl font-bold text-foreground">
                  {userStats?.queriesThisMonth || 0}
                </p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cognitive Progression Card - Client Improvement 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TraineeProgressionCard odNumber="OD-2024-001" />
        </div>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary mb-2">Level 4</div>
              <p className="text-sm text-muted-foreground">Error-Free Execution</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Drills Required</span>
                <span className="font-medium">50 (32 done)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Accuracy Target</span>
                <span className="font-medium">95% (82% current)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Safety Record</span>
                <span className="font-medium text-green-500">On track</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/training")}>
              Continue Training
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Topic Performance Analysis - SOW Section 8.3 */}
      {topicPerformance.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Topic-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Performance Bars */}
              <div className="space-y-3">
                {topicPerformance.slice(0, 6).map((topic) => {
                  const isWeak = topic.percentage < 60;
                  const isStrong = topic.percentage >= 80;

                  return (
                    <div key={topic.topic} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{topic.topic}</span>
                          {isWeak && (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                          {isStrong && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isStrong ? "text-green-500" : isWeak ? "text-red-500" : "text-yellow-500"
                          }`}
                        >
                          {topic.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={topic.percentage}
                        className={`h-2 ${
                          isWeak ? "[&>div]:bg-red-500" : isStrong ? "[&>div]:bg-green-500" : ""
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                {/* Strong Areas */}
                {strongTopics.length > 0 && (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Strong Areas</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {strongTopics.map((t) => t.topic).join(", ")}
                    </p>
                  </div>
                )}

                {/* Weak Areas */}
                {weakTopics.length > 0 && (
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">Focus Areas</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {weakTopics.map((t) => t.topic).join(", ")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() => router.push("/quiz")}
                    >
                      Practice These Topics
                    </Button>
                  </div>
                )}

                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{attempts.length}</div>
                    <p className="text-xs text-muted-foreground">Total Quizzes</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {topicPerformance.length > 0
                        ? Math.round(
                            topicPerformance.reduce((sum, t) => sum + t.percentage, 0) /
                              topicPerformance.length
                          )
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">Avg. Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Over Time & Upcoming - SOW Section 8.3 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Progress Over Time */}
        {progressHistory && progressHistory.scoreHistory.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Score Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chart */}
                <ProgressChart data={progressHistory.scoreHistory} />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">
                      {progressHistory.scoreHistory[progressHistory.scoreHistory.length - 1]?.score || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-muted-foreground">
                      {progressHistory.batchAverage}%
                    </p>
                    <p className="text-xs text-muted-foreground">Batch Avg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-500">
                      Top {100 - progressHistory.percentileRank}%
                    </p>
                    <p className="text-xs text-muted-foreground">Percentile</p>
                  </div>
                </div>

                {/* Improvement */}
                {progressHistory.scoreHistory.length >= 2 && (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <span className="text-sm text-green-500">
                      Overall Improvement
                    </span>
                    <span className="text-sm font-bold text-green-500">
                      +{progressHistory.scoreHistory[progressHistory.scoreHistory.length - 1].score -
                        progressHistory.scoreHistory[0].score}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Assessments & Milestones */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming & Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upcoming Assessments */}
              {upcomingAssessments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">UPCOMING ASSESSMENTS</p>
                  {upcomingAssessments.slice(0, 2).map((assessment) => {
                    const daysUntil = Math.ceil(
                      (assessment.scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{assessment.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {assessment.scheduledDate.toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })} at {assessment.startTime}
                            </p>
                          </div>
                        </div>
                        <Badge variant={daysUntil <= 1 ? "destructive" : "secondary"}>
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Milestones */}
              {progressHistory && progressHistory.milestones.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">RECENT MILESTONES</p>
                  {progressHistory.milestones.slice(-3).reverse().map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                        <Flag className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{milestone.name}</p>
                        <p className="text-xs text-muted-foreground">{milestone.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {milestone.achievedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {upcomingAssessments.length === 0 && (!progressHistory || progressHistory.milestones.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming assessments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Progress & Quick Access */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Training Progress */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">My Training Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingModules.map((module) => (
                <div key={module.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{module.name}</span>
                      {module.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {module.status === "locked" && (
                        <Badge variant="secondary" className="text-xs">Locked</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{module.progress}%</span>
                  </div>
                  <Progress
                    value={module.progress}
                    className={`h-2 ${module.status === "locked" ? "opacity-50" : ""}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border/50 p-4 text-center transition-colors hover:bg-muted/50"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${link.bgColor}`}>
                    <link.icon className={`h-6 w-6 ${link.color}`} />
                  </div>
                  <p className="font-medium">{link.title}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.title}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                  <achievement.icon className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Continue Learning CTA */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Crosshair className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">Continue Training</p>
                <p className="text-sm text-muted-foreground">
                  Pick up where you left off in Firing Procedures
                </p>
              </div>
            </div>
            <Button onClick={() => router.push("/training")} size="lg">
              Resume Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
