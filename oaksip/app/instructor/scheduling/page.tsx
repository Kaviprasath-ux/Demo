"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Clock,
  Users,
  FileText,
  GraduationCap,
  Target,
  CheckCircle,
  AlertCircle,
  MapPin,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockScheduledAssessments, getUpcomingAssessments } from "@/lib/mock-data";
import { ScheduledAssessment, AssessmentType } from "@/types";
import { cn } from "@/lib/utils";

const assessmentTypeConfig: Record<AssessmentType, { label: string; color: string; bgColor: string }> = {
  diagnostic: { label: "Diagnostic", color: "text-blue-500", bgColor: "bg-blue-500" },
  practice: { label: "Practice", color: "text-green-500", bgColor: "bg-green-500" },
  summative: { label: "Summative", color: "text-orange-500", bgColor: "bg-orange-500" },
  requalification: { label: "Requalification", color: "text-purple-500", bgColor: "bg-purple-500" },
};

const statusConfig = {
  scheduled: { label: "Scheduled", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  "in-progress": { label: "In Progress", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  completed: { label: "Completed", color: "text-green-500", bgColor: "bg-green-500/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", bgColor: "bg-red-500/10" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Assessment Card Component
function AssessmentCard({ assessment }: { assessment: ScheduledAssessment }) {
  const typeConfig = assessmentTypeConfig[assessment.assessmentType];
  const status = statusConfig[assessment.status];
  const daysUntil = getDaysUntil(assessment.scheduledDate);

  return (
    <Card className={cn(
      "border-border/50 hover:border-primary/50 transition-all cursor-pointer",
      assessment.status === "scheduled" && daysUntil <= 1 && "border-yellow-500/50"
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={typeConfig.bgColor}>
                  {typeConfig.label}
                </Badge>
                <Badge variant="outline">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {assessment.course}
                </Badge>
                {assessment.negativeMarking && (
                  <Badge variant="destructive" className="text-xs">-ve Marking</Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{assessment.title}</h3>
              <p className="text-sm text-muted-foreground">{assessment.description}</p>
            </div>
            <Badge variant="outline" className={cn(status.color, status.bgColor)}>
              {status.label}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(assessment.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{assessment.startTime} - {assessment.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Duration:</span>
              <span>{assessment.duration} mins</span>
            </div>
          </div>

          {/* Venue & Participants */}
          <div className="flex items-center gap-6 text-sm">
            {assessment.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{assessment.venue}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{assessment.assignedBatches.length} batch(es)</span>
            </div>
          </div>

          {/* Question Config */}
          <div className="flex items-center gap-4 text-sm p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span><strong>{assessment.questionConfig.mcqCount}</strong> MCQ</span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong>{assessment.questionConfig.subjectiveCount}</strong> Subjective</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Total: <strong>{assessment.totalMarks}</strong> marks</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Pass: <strong>{assessment.passingMarks}</strong></span>
            </div>
          </div>

          {/* Days Until */}
          {assessment.status === "scheduled" && (
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              daysUntil <= 1 ? "bg-yellow-500/10" : "bg-muted/50"
            )}>
              <span className="text-sm">
                {daysUntil === 0 ? "Today" :
                 daysUntil === 1 ? "Tomorrow" :
                 daysUntil < 0 ? "Overdue" :
                 `In ${daysUntil} days`}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm">
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              </div>
            </div>
          )}

          {assessment.status === "completed" && (
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-sm text-green-500">Assessment completed</span>
              <Button size="sm" variant="outline">
                View Results
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Calendar View Component (simplified)
function CalendarView({ assessments }: { assessments: ScheduledAssessment[] }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayAssessments = assessments.filter(a =>
              a.scheduledDate.toDateString() === day.toDateString()
            );
            const isToday = day.toDateString() === today.toDateString();

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 rounded-lg text-center min-h-[100px]",
                  isToday ? "bg-primary/10 border border-primary" : "bg-muted/50",
                  dayAssessments.length > 0 && "border-2 border-dashed border-blue-500"
                )}
              >
                <p className={cn(
                  "text-xs font-medium",
                  isToday && "text-primary"
                )}>
                  {day.toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <p className={cn(
                  "text-lg font-bold",
                  isToday && "text-primary"
                )}>
                  {day.getDate()}
                </p>
                {dayAssessments.map((a) => (
                  <div
                    key={a.id}
                    className={cn(
                      "mt-1 p-1 rounded text-xs truncate",
                      assessmentTypeConfig[a.assessmentType].bgColor,
                      "text-white"
                    )}
                    title={a.title}
                  >
                    {a.course}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SchedulingPage() {
  const [filter, setFilter] = useState<string>("all");

  const upcomingAssessments = getUpcomingAssessments();
  const scheduledCount = mockScheduledAssessments.filter(a => a.status === "scheduled").length;
  const completedCount = mockScheduledAssessments.filter(a => a.status === "completed").length;
  const todayCount = mockScheduledAssessments.filter(a =>
    a.scheduledDate.toDateString() === new Date().toDateString() &&
    a.status === "scheduled"
  ).length;

  const filteredAssessments = filter === "all"
    ? mockScheduledAssessments
    : mockScheduledAssessments.filter(a => a.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Assessment Scheduling
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage assessments for all courses
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Assessment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{scheduledCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-yellow-500">{todayCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-500">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{upcomingAssessments.length}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <CalendarView assessments={mockScheduledAssessments} />

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "scheduled", "in-progress", "completed", "cancelled"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig]?.label || status}
          </Button>
        ))}
      </div>

      {/* Upcoming Section */}
      {upcomingAssessments.length > 0 && filter === "all" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Upcoming Assessments
          </h2>
          {upcomingAssessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      )}

      {/* All Assessments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {filter === "all" ? "All Assessments" : `${statusConfig[filter as keyof typeof statusConfig]?.label || filter} Assessments`}
        </h2>
        {filteredAssessments.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}

        {filteredAssessments.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No assessments found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
