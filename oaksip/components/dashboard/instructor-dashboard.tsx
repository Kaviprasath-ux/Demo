"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardList,
  GraduationCap,
  Search,
  Brain,
  Crosshair,
  Target,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import {
  mockQuestionBank,
  mockTraineeProgress,
  getUserStats,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function InstructorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userStats = user ? getUserStats(user.id) : null;

  const pendingQuestions = mockQuestionBank.filter((q) => q.status === "pending");
  const traineesNeedingAttention = mockTraineeProgress.filter(
    (t) => t.status === "needs-attention"
  );

  const quickLinks = [
    {
      title: "Question Bank",
      description: "Review AI-generated questions",
      href: "/instructor/questions",
      icon: ClipboardList,
      badge: pendingQuestions.length > 0 ? `${pendingQuestions.length} pending` : undefined,
      badgeVariant: "warning" as const,
    },
    {
      title: "Trainee List",
      description: "Monitor trainee progress",
      href: "/instructor/trainees",
      icon: GraduationCap,
      badge: traineesNeedingAttention.length > 0 ? `${traineesNeedingAttention.length} need attention` : undefined,
      badgeVariant: "destructive" as const,
    },
    {
      title: "Knowledge Search",
      description: "Search technical manuals",
      href: "/search",
      icon: Search,
    },
    {
      title: "Quiz Mode",
      description: "Demo quiz for training",
      href: "/quiz",
      icon: Brain,
    },
    {
      title: "3D Training",
      description: "Interactive gun model demo",
      href: "/training",
      icon: Crosshair,
    },
    {
      title: "Documents",
      description: "View training documents",
      href: "/documents",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Instructor Dashboard
          </h1>
          <Badge className="gap-1 bg-blue-500 hover:bg-blue-600">
            <GraduationCap className="h-3 w-3" />
            Instructor
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Training delivery and content management.
        </p>
      </div>

      {/* Alerts */}
      {(pendingQuestions.length > 0 || traineesNeedingAttention.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {pendingQuestions.length > 0 && (
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{pendingQuestions.length} Questions Pending Review</p>
                    <p className="text-sm text-muted-foreground">
                      AI-generated questions need your approval
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/instructor/questions")}
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {traineesNeedingAttention.length > 0 && (
            <Card className="border-red-500/50 bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <Users className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{traineesNeedingAttention.length} Trainees Need Attention</p>
                    <p className="text-sm text-muted-foreground">
                      Below expected progress level
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/instructor/trainees")}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Trainees</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockTraineeProgress.length}
                </p>
                <p className="text-xs text-muted-foreground">Under your supervision</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Trainee Score</p>
                <p className="text-3xl font-bold text-foreground">
                  {Math.round(
                    mockTraineeProgress.reduce((sum, t) => sum + t.avgScore, 0) /
                      mockTraineeProgress.length
                  )}%
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Above target
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Questions Reviewed</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockQuestionBank.filter((q) => q.status !== "pending").length}
                </p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">My Queries</p>
                <p className="text-3xl font-bold text-foreground">
                  {userStats?.queriesThisMonth || 0}
                </p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Links */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickLinks.slice(0, 4).map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                  {link.badge && (
                    <Badge variant={link.badgeVariant}>{link.badge}</Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trainee Activity */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Trainee Progress</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/instructor/trainees")}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTraineeProgress.slice(0, 4).map((trainee) => (
                <div
                  key={trainee.userId}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{trainee.userName}</span>
                      <Badge
                        variant={
                          trainee.status === "excelling"
                            ? "success"
                            : trainee.status === "needs-attention"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {trainee.status === "excelling" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {trainee.status === "needs-attention" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {trainee.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Score: {trainee.avgScore}%</span>
                      <span>Quizzes: {trainee.quizzesCompleted}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20">
                      <Progress value={trainee.avgScore} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(trainee.lastActive)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Tools */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crosshair className="h-5 w-5 text-blue-500" />
            Training Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickLinks.slice(2, 5).map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="flex flex-col items-center gap-2 rounded-lg border border-border/50 p-6 text-center transition-colors hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                  <link.icon className="h-6 w-6 text-blue-500" />
                </div>
                <p className="font-medium">{link.title}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
