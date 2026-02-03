"use client";

import { useState } from "react";
import {
  GraduationCap,
  Search,
  CheckCircle,
  AlertCircle,
  Star,
  Clock,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTraineeProgress } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";

const statusConfig = {
  "on-track": { label: "On Track", icon: CheckCircle, color: "text-blue-500", bgColor: "bg-blue-500/10", variant: "secondary" as const },
  "needs-attention": { label: "Needs Attention", icon: AlertCircle, color: "text-red-500", bgColor: "bg-red-500/10", variant: "destructive" as const },
  "excelling": { label: "Excelling", icon: Star, color: "text-green-500", bgColor: "bg-green-500/10", variant: "success" as const },
};

export default function TraineeListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Combine mock trainee progress with actual trainee users
  const trainees = mockTraineeProgress;

  const filteredTrainees = trainees
    .filter((t) => {
      const matchesSearch = t.userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.avgScore - a.avgScore;
        case "quizzes":
          return b.quizzesCompleted - a.quizzesCompleted;
        case "hours":
          return b.trainingHours - a.trainingHours;
        case "lastActive":
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return a.userName.localeCompare(b.userName);
      }
    });

  const statusCounts = {
    total: trainees.length,
    excelling: trainees.filter((t) => t.status === "excelling").length,
    onTrack: trainees.filter((t) => t.status === "on-track").length,
    needsAttention: trainees.filter((t) => t.status === "needs-attention").length,
  };

  const avgScore = Math.round(
    trainees.reduce((sum, t) => sum + t.avgScore, 0) / trainees.length
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          Trainee List
        </h1>
        <p className="text-muted-foreground">
          Monitor trainee progress and performance across all training modules.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trainees</p>
                <p className="text-3xl font-bold text-foreground">{statusCounts.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Excelling</p>
                <p className="text-3xl font-bold text-green-500">{statusCounts.excelling}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Star className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Track</p>
                <p className="text-3xl font-bold text-blue-500">{statusCounts.onTrack}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <CheckCircle className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
                <p className="text-3xl font-bold text-red-500">{statusCounts.needsAttention}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trainees..."
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
                  <SelectItem value="excelling">Excelling</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="quizzes">Quizzes</SelectItem>
                  <SelectItem value="hours">Training Hours</SelectItem>
                  <SelectItem value="lastActive">Last Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Average */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Class Average Score</p>
              <div className="flex items-center gap-3">
                <p className="text-4xl font-bold">{avgScore}%</p>
                <Badge variant={avgScore >= 75 ? "success" : avgScore >= 60 ? "warning" : "destructive"}>
                  {avgScore >= 75 ? (
                    <><TrendingUp className="h-3 w-3 mr-1" /> Above Target</>
                  ) : avgScore >= 60 ? (
                    <>On Target</>
                  ) : (
                    <><TrendingDown className="h-3 w-3 mr-1" /> Below Target</>
                  )}
                </Badge>
              </div>
            </div>
            <div className="w-48">
              <Progress value={avgScore} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1 text-right">Target: 75%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trainee Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTrainees.map((trainee) => {
          const status = statusConfig[trainee.status];

          return (
            <Card key={trainee.userId} className={cn(
              "border-border/50 transition-all hover:shadow-md",
              trainee.status === "needs-attention" && "border-red-500/30"
            )}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {trainee.userName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{trainee.userName}</p>
                        <p className="text-xs text-muted-foreground">{trainee.userId}</p>
                      </div>
                    </div>
                    <Badge variant={status.variant} className="gap-1">
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Score Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className={cn(
                        "font-medium",
                        trainee.avgScore >= 80 ? "text-green-500" :
                        trainee.avgScore >= 70 ? "text-blue-500" : "text-red-500"
                      )}>{trainee.avgScore}%</span>
                    </div>
                    <Progress
                      value={trainee.avgScore}
                      className={cn(
                        "h-2",
                        trainee.avgScore >= 80 ? "[&>div]:bg-green-500" :
                        trainee.avgScore >= 70 ? "[&>div]:bg-blue-500" : "[&>div]:bg-red-500"
                      )}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Brain className="h-3 w-3" />
                        Quizzes
                      </div>
                      <p className="font-semibold">{trainee.quizzesCompleted}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Hours
                      </div>
                      <p className="font-semibold">{trainee.trainingHours}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" />
                        Score
                      </div>
                      <p className="font-semibold">{trainee.avgScore}%</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <span>Last active</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(trainee.lastActive)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTrainees.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No trainees found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
