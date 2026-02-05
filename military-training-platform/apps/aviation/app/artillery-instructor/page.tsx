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
      <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user?.name || "Instructor"}
            </h1>
            <p className="text-gray-400">
              Joint Fire Support Training Platform - Artillery Instructor Portal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/artillery-instructor/sessions">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
            </Link>
            <Link href="/artillery-instructor/scenarios">
              <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                <Target className="w-4 h-4 mr-2" />
                New Scenario
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-gray-400">Total Trainees</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalTrainees}</p>
          <p className="text-xs text-green-400 mt-1">{stats.activeTrainees} active</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-gray-400">Scenarios</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeScenarios}</p>
          <p className="text-xs text-gray-500 mt-1">active scenarios</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-gray-400">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.scheduledSessions}</p>
          <p className="text-xs text-gray-500 mt-1">scheduled</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-sm text-gray-400">Assessments</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pendingAssessments}</p>
          <p className="text-xs text-yellow-400 mt-1">pending review</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Plane className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-gray-400">Joint Exercises</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.upcomingExercises}</p>
          <p className="text-xs text-gray-500 mt-1">upcoming</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-sm text-gray-400">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageTraineeScore}%</p>
          <p className="text-xs text-gray-500 mt-1">class average</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Upcoming Sessions
            </h2>
            <Link href="/artillery-instructor/sessions">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-[#0a0a0f] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm">{session.title}</h3>
                    <span className={`
                      px-2 py-0.5 rounded text-xs
                      ${session.type === 'field' ? 'bg-green-500/20 text-green-400' :
                        session.type === 'simulator' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-gray-500/20 text-gray-400'}
                    `}>
                      {session.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.date} {session.startTime}
                    </span>
                    <span>{session.traineeNames.length} trainees</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No upcoming sessions</p>
            )}
          </div>
        </div>

        {/* Pending Assessments */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-yellow-500" />
              Pending Assessments
            </h2>
            <Link href="/artillery-instructor/assessments">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {pendingAssessments.length > 0 ? (
              pendingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-3 bg-[#0a0a0f] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm">{assessment.traineeName}</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">
                      {assessment.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{assessment.phase}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Scheduled: {assessment.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No pending assessments</p>
            )}
          </div>
        </div>

        {/* Trainee Performance */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Trainee Performance
            </h2>
            <Link href="/artillery-instructor/trainees">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4">
            {/* Top Performers */}
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Top Performers</h3>
              <div className="space-y-2">
                {topPerformers.map((trainee, index) => (
                  <div
                    key={trainee.id}
                    className="flex items-center justify-between p-2 bg-[#0a0a0f] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          'bg-emerald-600/20 text-emerald-500'}
                      `}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm text-white">{trainee.rank} {trainee.name}</p>
                        <p className="text-xs text-gray-500">{trainee.currentPhase}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-400">{trainee.averageScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            {needsAttention.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  Needs Attention
                </h3>
                <div className="space-y-2">
                  {needsAttention.slice(0, 2).map((trainee) => (
                    <div
                      key={trainee.id}
                      className="flex items-center justify-between p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/20"
                    >
                      <div>
                        <p className="text-sm text-white">{trainee.rank} {trainee.name}</p>
                        <p className="text-xs text-gray-500">{trainee.currentPhase}</p>
                      </div>
                      <span className="text-sm font-semibold text-yellow-400">{trainee.averageScore}%</span>
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
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-emerald-500" />
              Joint Exercises
            </h2>
            <Link href="/artillery-instructor/joint-exercises">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingExercises.length > 0 ? (
              upcomingExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 rounded-lg border border-emerald-500/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{exercise.name}</h3>
                      <p className="text-sm text-gray-400">{exercise.code}</p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded text-xs
                      ${exercise.status === 'scheduled' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'}
                    `}>
                      {exercise.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="text-white">{exercise.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="text-white">{exercise.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Artillery Trainees</p>
                      <p className="text-white">{exercise.artilleryTrainees.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Aviation Trainees</p>
                      <p className="text-white">{exercise.aviationTrainees.length}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No upcoming exercises</p>
            )}
          </div>
        </div>

        {/* Quick Actions & Curriculum Overview */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-emerald-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/artillery-instructor/trainees">
                <Button variant="outline" className="w-full justify-start border-gray-700 hover:bg-gray-800">
                  <Users className="w-4 h-4 mr-2 text-emerald-500" />
                  Add Trainee
                </Button>
              </Link>
              <Link href="/artillery-instructor/scenarios">
                <Button variant="outline" className="w-full justify-start border-gray-700 hover:bg-gray-800">
                  <Target className="w-4 h-4 mr-2 text-emerald-500" />
                  Create Scenario
                </Button>
              </Link>
              <Link href="/artillery-instructor/sessions">
                <Button variant="outline" className="w-full justify-start border-gray-700 hover:bg-gray-800">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                  Schedule Session
                </Button>
              </Link>
              <Link href="/artillery-instructor/assessments">
                <Button variant="outline" className="w-full justify-start border-gray-700 hover:bg-gray-800">
                  <ClipboardCheck className="w-4 h-4 mr-2 text-yellow-500" />
                  New Assessment
                </Button>
              </Link>
            </div>
          </div>

          {/* Curriculum Overview */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Curriculum
              </h2>
              <Link href="/artillery-instructor/curriculum">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Manage <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {curriculum.filter(c => c.status === 'active').slice(0, 3).map((cur) => (
                <div
                  key={cur.id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{cur.name}</p>
                    <p className="text-xs text-gray-500">{cur.code} • {cur.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{cur.enrolledTrainees}</p>
                    <p className="text-xs text-gray-500">enrolled</p>
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
