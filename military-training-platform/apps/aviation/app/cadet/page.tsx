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
      <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(" ").pop()}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your Joint Fire Support training journey
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Phase</p>
            <p className="text-lg font-semibold text-primary">{progress.currentPhase}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.overallProgress}%</p>
          <p className="text-xs text-muted-foreground">Overall Progress</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {progress.modulesCompleted}/{progress.totalModules}
          </p>
          <p className="text-xs text-muted-foreground">Modules Done</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {progress.assessmentsPassed}/{progress.totalAssessments}
          </p>
          <p className="text-xs text-muted-foreground">Assessments Passed</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.simulatorHours}h</p>
          <p className="text-xs text-muted-foreground">Simulator Hours</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.fieldHours}h</p>
          <p className="text-xs text-muted-foreground">Field Hours</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.certifications.length}</p>
          <p className="text-xs text-muted-foreground">Certifications</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Continue Learning
            </h2>
            <Link href="/cadet/training">
              <Button variant="ghost" size="sm" className="text-primary hover:text-green-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {inProgressModules.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No modules in progress</p>
            ) : (
              inProgressModules.map((module) => (
                <Link
                  key={module.id}
                  href="/cadet/training"
                  className="block p-4 bg-muted/50 rounded-lg hover:bg-background transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-foreground font-medium">{module.name}</h3>
                    <span className="text-sm text-primary">{module.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full mb-2">
                    <div
                      className="h-2 bg-primary rounded-full transition-all"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {module.topics.filter((t) => t.completed).length}/{module.topics.length} topics
                    completed
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Sessions
            </h2>
            <Link href="/cadet/sessions">
              <Button variant="ghost" size="sm" className="text-primary hover:text-green-300">
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
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.date} | {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      session.status === "confirmed"
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/20 text-primary"
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
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Upcoming Assessments
            </h2>
            <Link href="/cadet/assessments">
              <Button variant="ghost" size="sm" className="text-primary hover:text-green-300">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {upcomingAssessments.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">No pending assessments</p>
              </div>
            ) : (
              upcomingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{assessment.moduleName}</p>
                      <p className="text-xs text-muted-foreground">
                        {assessment.type.replace("-", " ")} | {assessment.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                    Due
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
              {unreadNotifications.length > 0 && (
                <span className="bg-red-500 text-foreground text-xs px-2 py-0.5 rounded-full">
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
                  notification.isRead ? "bg-muted/50" : "bg-primary/5 border border-primary/20"
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === "success"
                      ? "bg-primary/20 text-primary"
                      : notification.type === "warning"
                      ? "bg-primary/20 text-primary"
                      : notification.type === "reminder"
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-500/20 text-muted-foreground"
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
                  <p className="text-foreground text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Badges & Achievements
          </h2>
          <Link href="/cadet/progress">
            <Button variant="ghost" size="sm" className="text-primary hover:text-green-300">
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
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Earned: {badge.earnedDate}</p>
                  </div>
                </div>
              );
            })}
            {progress.badges.length === 0 && (
              <p className="text-muted-foreground">Complete modules to earn badges!</p>
            )}
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-800/20 border border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Next Milestone</p>
            <p className="text-xl font-bold text-foreground mt-1">{progress.nextMilestone}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete the remaining modules and assessments to unlock
            </p>
          </div>
          <Link href="/cadet/training">
            <Button className="bg-primary hover:bg-primary/90">
              Continue Training
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
