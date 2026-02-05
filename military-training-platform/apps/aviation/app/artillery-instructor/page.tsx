"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Target,
  Calendar,
  ClipboardCheck,
  Plane,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Crosshair,
  BookOpen,
} from "lucide-react";
import { Button } from "@military/ui";
import { useArtilleryInstructorStore } from "@/lib/stores/artillery-instructor-store";
import { useAuthStore } from "@/lib/store";

export default function ArtilleryInstructorDashboard() {
  const { user } = useAuthStore();
  const {
    trainees,
    scenarios,
    sessions,
    assessments,
    curriculum,
    jointExercises,
    getInstructorStats,
  } = useArtilleryInstructorStore();

  const stats = getInstructorStats();

  // Get recent/upcoming items
  const upcomingSessions = sessions
    .filter((s) => s.status === "scheduled")
    .slice(0, 3);

  const pendingAssessments = assessments
    .filter((a) => a.status === "pending")
    .slice(0, 3);

  const activeTrainees = trainees.filter((t) => t.status === "active");

  const upcomingExercises = jointExercises
    .filter((e) => e.status === "scheduled" || e.status === "planning")
    .slice(0, 2);

  // Performance data for quick view
  const topPerformers = [...activeTrainees]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);

  const needsAttention = activeTrainees.filter((t) => t.averageScore < 70);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Welcome back, {user?.name || "Instructor"}
            </h1>
            <p className="text-muted-foreground">
              Joint Fire Support Training Platform - Artillery Instructor Portal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/artillery-instructor/sessions">
              <Button className="bg-primary hover:bg-primary/90">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </Link>
            <Link href="/artillery-instructor/scenarios">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                <Target className="w-4 h-4 mr-2" />
                New Scenario
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Trainees</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalTrainees}</p>
          <p className="text-xs text-primary mt-1">{stats.activeTrainees} active</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Scenarios</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.activeScenarios}</p>
          <p className="text-xs text-muted-foreground mt-1">active scenarios</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.scheduledSessions}</p>
          <p className="text-xs text-muted-foreground mt-1">scheduled</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Assessments</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pendingAssessments}</p>
          <p className="text-xs text-primary mt-1">pending review</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Joint Exercises</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.upcomingExercises}</p>
          <p className="text-xs text-muted-foreground mt-1">upcoming</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.averageTraineeScore}%</p>
          <p className="text-xs text-muted-foreground mt-1">class average</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Sessions
            </h2>
            <Link href="/artillery-instructor/sessions">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-muted/50 rounded-lg border border-border hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground text-sm">{session.title}</h3>
                    <span className={`
                      px-2 py-0.5 rounded text-xs
                      ${session.type === 'field' ? 'bg-primary/20 text-primary' :
                        session.type === 'simulator' ? 'bg-primary/20 text-primary' :
                        'bg-gray-500/20 text-muted-foreground'}
                    `}>
                      {session.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.date} {session.startTime}
                    </span>
                    <span>{session.traineeNames.length} trainees</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">No upcoming sessions</p>
            )}
          </div>
        </div>

        {/* Pending Assessments */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Pending Assessments
            </h2>
            <Link href="/artillery-instructor/assessments">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {pendingAssessments.length > 0 ? (
              pendingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-3 bg-muted/50 rounded-lg border border-border hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground text-sm">{assessment.traineeName}</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                      {assessment.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{assessment.phase}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Scheduled: {assessment.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">No pending assessments</p>
            )}
          </div>
        </div>

        {/* Trainee Performance */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trainee Performance
            </h2>
            <Link href="/artillery-instructor/trainees">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4">
            {/* Top Performers */}
            <div className="mb-4">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Top Performers</h3>
              <div className="space-y-2">
                {topPerformers.map((trainee, index) => (
                  <div
                    key={trainee.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-primary/20 text-primary' :
                          index === 1 ? 'bg-gray-400/20 text-muted-foreground' :
                          'bg-primary/20 text-primary'}
                      `}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm text-foreground">{trainee.rank} {trainee.name}</p>
                        <p className="text-xs text-muted-foreground">{trainee.currentPhase}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{trainee.averageScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            {needsAttention.length > 0 && (
              <div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-primary" />
                  Needs Attention
                </h3>
                <div className="space-y-2">
                  {needsAttention.slice(0, 2).map((trainee) => (
                    <div
                      key={trainee.id}
                      className="flex items-center justify-between p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/20"
                    >
                      <div>
                        <p className="text-sm text-foreground">{trainee.rank} {trainee.name}</p>
                        <p className="text-xs text-muted-foreground">{trainee.currentPhase}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{trainee.averageScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Joint Exercises */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              Joint Exercises
            </h2>
            <Link href="/artillery-instructor/joint-exercises">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingExercises.length > 0 ? (
              upcomingExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 rounded-lg border border-primary/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">{exercise.code}</p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded text-xs
                      ${exercise.status === 'scheduled' ? 'bg-primary/20 text-primary' :
                        'bg-primary/20 text-primary'}
                    `}>
                      {exercise.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="text-foreground">{exercise.startDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="text-foreground">{exercise.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Artillery Trainees</p>
                      <p className="text-foreground">{exercise.artilleryTrainees.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Aviation Trainees</p>
                      <p className="text-foreground">{exercise.aviationTrainees.length}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">No upcoming exercises</p>
            )}
          </div>
        </div>

        {/* Quick Actions & Curriculum Overview */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/artillery-instructor/trainees">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Add Trainee
                </Button>
              </Link>
              <Link href="/artillery-instructor/scenarios">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted">
                  <Target className="w-4 h-4 mr-2 text-primary" />
                  Create Scenario
                </Button>
              </Link>
              <Link href="/artillery-instructor/sessions">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  Schedule Session
                </Button>
              </Link>
              <Link href="/artillery-instructor/assessments">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted">
                  <ClipboardCheck className="w-4 h-4 mr-2 text-primary" />
                  New Assessment
                </Button>
              </Link>
            </div>
          </div>

          {/* Curriculum Overview */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Curriculum
              </h2>
              <Link href="/artillery-instructor/curriculum">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Manage <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {curriculum.filter(c => c.status === 'active').slice(0, 3).map((cur) => (
                <div
                  key={cur.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{cur.name}</p>
                    <p className="text-xs text-muted-foreground">{cur.code} • {cur.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{cur.enrolledTrainees}</p>
                    <p className="text-xs text-muted-foreground">enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
