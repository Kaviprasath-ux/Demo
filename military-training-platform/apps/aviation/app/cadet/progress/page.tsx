"use client";

export const dynamic = "force-dynamic";

import {
  Award,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
  Clock,
  Target,
  Plane,
  Shield,
  Zap,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useCadetStore } from "@/lib/stores/cadet-store";
import { useAuthStore } from "@/lib/store";

export default function ProgressPage() {
  const { user } = useAuthStore();
  const { modules, assessments, progress } = useCadetStore();

  const completedModules = modules.filter((m) => m.status === "completed");
  const passedAssessments = assessments.filter((a) => a.passed === true);
  const averageScore =
    passedAssessments.length > 0
      ? Math.round(
          passedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) /
            passedAssessments.length
        )
      : 0;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "zap":
        return Zap;
      case "shield":
        return Shield;
      case "star":
        return Star;
      default:
        return Award;
    }
  };

  const skillsData = [
    { name: "Fire Support", score: 78, color: "bg-emerald-500" },
    { name: "CAS Coordination", score: 72, color: "bg-emerald-500" },
    { name: "Communication", score: 85, color: "bg-green-500" },
    { name: "Navigation", score: 68, color: "bg-emerald-500" },
    { name: "Safety Awareness", score: 95, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Award className="w-8 h-8 text-green-500" />
          My Progress
        </h1>
        <p className="text-gray-400 mt-1">
          Track your training achievements and certifications
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {user?.name.charAt(0) || "C"}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">
              {user?.rank} | {user?.unit}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-green-400">{progress.currentPhase}</span>
              <span className="text-gray-500">|</span>
              <span className="text-sm text-gray-400">
                Next: {progress.nextMilestone}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{progress.overallProgress}%</p>
            <p className="text-sm text-gray-400">Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {completedModules.length}/{modules.length}
          </p>
          <p className="text-xs text-gray-500">Modules</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <ClipboardCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {passedAssessments.length}/{assessments.length}
          </p>
          <p className="text-xs text-gray-500">Assessments</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{averageScore}%</p>
          <p className="text-xs text-gray-500">Avg Score</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <Plane className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{progress.simulatorHours}h</p>
          <p className="text-xs text-gray-500">Simulator</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{progress.fieldHours}h</p>
          <p className="text-xs text-gray-500">Field</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {progress.simulatorHours + progress.fieldHours + progress.flightHours}h
          </p>
          <p className="text-xs text-gray-500">Total Hours</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Breakdown */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Skills Breakdown
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {skillsData.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">{skill.name}</span>
                  <span className="text-gray-400">{skill.score}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full">
                  <div
                    className={`h-2 rounded-full ${skill.color}`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Certifications
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {progress.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[#0a0a0f] rounded-lg"
              >
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{cert}</p>
                  <p className="text-xs text-gray-500">Certified</p>
                </div>
              </div>
            ))}
            {progress.certifications.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Complete modules to earn certifications
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-emerald-500" />
            Badges & Achievements
          </h2>
        </div>
        <div className="p-4">
          {progress.badges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progress.badges.map((badge) => {
                const IconComponent = getIconComponent(badge.icon);
                return (
                  <div
                    key={badge.id}
                    className="flex items-center gap-4 p-4 bg-[#0a0a0f] rounded-lg border border-gray-800"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{badge.name}</p>
                      <p className="text-sm text-gray-400">{badge.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Earned: {badge.earnedDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Complete training to earn badges!</p>
            </div>
          )}
        </div>
      </div>

      {/* Module Completion Timeline */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Training Progress
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.id} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    module.status === "completed"
                      ? "bg-green-500"
                      : module.status === "in-progress"
                      ? "bg-yellow-500"
                      : "bg-gray-700"
                  }`}
                >
                  {module.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-medium ${
                        module.status === "completed"
                          ? "text-green-400"
                          : module.status === "in-progress"
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {module.name}
                    </p>
                    <span className="text-sm text-gray-500">{module.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full mt-2">
                    <div
                      className={`h-1.5 rounded-full ${
                        module.status === "completed"
                          ? "bg-green-500"
                          : module.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-gray-700"
                      }`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
