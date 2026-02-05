"use client";

export const dynamic = "force-dynamic";

import {
  Users,
  Crosshair,
  Calendar,
  ClipboardCheck,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plane,
  ArrowRight,
} from "lucide-react";
import { Button } from "@military/ui";
import Link from "next/link";
import { useAviationInstructorStore } from "@/lib/stores/aviation-instructor-store";

export default function AviationInstructorDashboard() {
  const { pilots, scenarios, sessions, assessments, jointOperations, getInstructorStats } =
    useAviationInstructorStore();

  const stats = getInstructorStats();

  const upcomingSessions = sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const pendingAssessments = assessments
    .filter((a) => a.status === "scheduled")
    .slice(0, 3);

  const topPilots = [...pilots]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 4);

  const upcomingJointOps = jointOperations
    .filter((j) => j.status === "approved" || j.status === "planning")
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aviation Instructor Dashboard</h1>
        <p className="text-muted-foreground">
          Joint Fire Support Platform - Pilot Training Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-xs text-primary">Active: {stats.activePilots}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalPilots}</p>
          <p className="text-xs text-muted-foreground">Total Pilots</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Crosshair className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalScenarios}</p>
          <p className="text-xs text-muted-foreground">Flight Scenarios</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground">Flight Sessions</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            {stats.pendingAssessments > 0 && (
              <span className="text-xs text-primary">
                {stats.pendingAssessments} pending
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">
            {assessments.filter((a) => a.status === "completed").length}
          </p>
          <p className="text-xs text-muted-foreground">Assessments Done</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.jointOperations}</p>
          <p className="text-xs text-muted-foreground">Joint Operations</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.avgCASCompetency}%</p>
          <p className="text-xs text-muted-foreground">Avg CAS Competency</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Flight Sessions */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Flight Sessions
            </h2>
            <Link href="/aviation-instructor/sessions">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming sessions</p>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session.jointWithArtillery
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.date} | {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        session.jointWithArtillery
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {session.type.replace("-", " ")}
                    </span>
                    {session.jointWithArtillery && (
                      <p className="text-xs text-primary mt-1">Joint Exercise</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Assessments */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Pending Assessments
            </h2>
            <Link href="/aviation-instructor/assessments">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {pendingAssessments.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">All assessments completed</p>
              </div>
            ) : (
              pendingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{assessment.pilotName}</p>
                      <p className="text-xs text-muted-foreground">
                        {assessment.type.replace("-", " ")} | {assessment.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                    Scheduled
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pilot Performance */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Performing Pilots
            </h2>
            <Link href="/aviation-instructor/pilots">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {topPilots.map((pilot, index) => (
              <div
                key={pilot.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-foreground font-bold ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-primary"
                        : "bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{pilot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pilot.rank} | {pilot.flightHours}h flight time
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{pilot.overallScore}%</p>
                  <p className="text-xs text-muted-foreground">CAS: {pilot.casCompetency}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Joint Operations */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Upcoming Joint Operations
            </h2>
            <Link href="/aviation-instructor/joint-operations">
              <Button variant="ghost" size="sm" className="text-primary hover:text-emerald-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingJointOps.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming joint operations</p>
            ) : (
              upcomingJointOps.map((op) => (
                <div
                  key={op.id}
                  className="p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-foreground font-medium">{op.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        op.status === "approved"
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {op.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{op.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{op.date} | {op.startTime}</span>
                    <span>{op.pilotIds.length} pilots assigned</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/aviation-instructor/sessions">
            <Button className="bg-primary hover:bg-primary/90">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Flight Session
            </Button>
          </Link>
          <Link href="/aviation-instructor/assessments">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Schedule Assessment
            </Button>
          </Link>
          <Link href="/aviation-instructor/scenarios">
            <Button className="bg-primary hover:bg-primary/90">
              <Crosshair className="w-4 h-4 mr-2" />
              Create Flight Scenario
            </Button>
          </Link>
          <Link href="/aviation-instructor/joint-operations">
            <Button className="bg-red-600 hover:bg-red-700">
              <Target className="w-4 h-4 mr-2" />
              Plan Joint Operation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
