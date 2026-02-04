"use client";

export const dynamic = "force-dynamic";

import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  Award,
  Clock,
  TrendingUp,
  Bell,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@military/ui";
import Link from "next/link";
import { useCadetStore } from "@/lib/stores/cadet-store";
import { useAuthStore } from "@/lib/store";

export default function CadetDashboard() {
  const { user } = useAuthStore();
  const {
    modules,
    sessions,
    assessments,
    progress,
    notifications,
    markNotificationRead,
  } = useCadetStore();

  const inProgressModules = modules.filter((m) => m.status === "in-progress");
  const upcomingSessions = sessions
    .filter((s) => s.status !== "cancelled")
    .slice(0, 3);
  const upcomingAssessments = assessments
    .filter((a) => a.status === "upcoming")
    .slice(0, 3);
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "zap":
        return Zap;
      case "shield":
        return Shield;
      default:
        return Award;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(" ").pop()}!
            </h1>
            <p className="text-gray-400 mt-1">
              Continue your Joint Fire Support training journey
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Phase</p>
            <p className="text-lg font-semibold text-green-400">{progress.currentPhase}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">{progress.overallProgress}%</p>
          <p className="text-xs text-gray-500">Overall Progress</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {progress.modulesCompleted}/{progress.totalModules}
          </p>
          <p className="text-xs text-gray-500">Modules Done</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {progress.assessmentsPassed}/{progress.totalAssessments}
          </p>
          <p className="text-xs text-gray-500">Assessments Passed</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{progress.simulatorHours}h</p>
          <p className="text-xs text-gray-500">Simulator Hours</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{progress.fieldHours}h</p>
          <p className="text-xs text-gray-500">Field Hours</p>
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{progress.certifications.length}</p>
          <p className="text-xs text-gray-500">Certifications</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              Continue Learning
            </h2>
            <Link href="/cadet/training">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {inProgressModules.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No modules in progress</p>
            ) : (
              inProgressModules.map((module) => (
                <Link
                  key={module.id}
                  href="/cadet/training"
                  className="block p-4 bg-[#0a0a0f] rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{module.name}</h3>
                    <span className="text-sm text-green-400">{module.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full mb-2">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {module.topics.filter((t) => t.completed).length}/{module.topics.length} topics
                    completed
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Upcoming Sessions
            </h2>
            <Link href="/cadet/sessions">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{session.title}</p>
                      <p className="text-xs text-gray-500">
                        {session.date} | {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      session.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Assessments */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-yellow-500" />
              Upcoming Assessments
            </h2>
            <Link href="/cadet/assessments">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingAssessments.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">No pending assessments</p>
              </div>
            ) : (
              upcomingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{assessment.moduleName}</p>
                      <p className="text-xs text-gray-500">
                        {assessment.type.replace("-", " ")} | {assessment.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                    Due
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" />
              Notifications
              {unreadNotifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadNotifications.length}
                </span>
              )}
            </h2>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {notifications.slice(0, 4).map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  notification.isRead ? "bg-[#0a0a0f]" : "bg-green-500/5 border border-green-500/20"
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === "success"
                      ? "bg-green-500/20 text-green-400"
                      : notification.type === "warning"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : notification.type === "reminder"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : notification.type === "warning" ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.date}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            Badges & Achievements
          </h2>
          <Link href="/cadet/progress">
            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4">
            {progress.badges.map((badge) => {
              const IconComponent = getIconComponent(badge.icon);
              return (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg border border-gray-800"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{badge.name}</p>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                    <p className="text-xs text-gray-600 mt-1">Earned: {badge.earnedDate}</p>
                  </div>
                </div>
              );
            })}
            {progress.badges.length === 0 && (
              <p className="text-gray-500">Complete modules to earn badges!</p>
            )}
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Next Milestone</p>
            <p className="text-xl font-bold text-white mt-1">{progress.nextMilestone}</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete the remaining modules and assessments to unlock
            </p>
          </div>
          <Link href="/cadet/training">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Continue Training
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
