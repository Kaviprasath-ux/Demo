"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plane,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useCadetStore } from "@/lib/stores/cadet-store";

export default function SessionsPage() {
  const { sessions } = useCadetStore();
  const [viewMode, setViewMode] = useState<"upcoming" | "all">("upcoming");

  const filteredSessions =
    viewMode === "upcoming"
      ? sessions.filter((s) => s.status !== "cancelled")
      : sessions;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      classroom: "bg-emerald-500/20 text-emerald-400",
      simulator: "bg-emerald-500/20 text-emerald-400",
      field: "bg-emerald-500/20 text-emerald-400",
      "live-fire": "bg-red-500/20 text-red-400",
      "joint-exercise": "bg-green-500/20 text-green-400",
    };
    return colors[type] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-500" />
            My Sessions
          </h1>
          <p className="text-gray-400 mt-1">
            View your scheduled training sessions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "upcoming"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            All Sessions
          </button>
        </div>
      </div>

      {/* Sessions Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-gray-400">Confirmed</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {sessions.filter((s) => s.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {sessions.filter((s) => s.status === "scheduled").length}
          </p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400">Cancelled</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {sessions.filter((s) => s.status === "cancelled").length}
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className={`bg-[#12121a] border rounded-xl p-5 ${
              session.status === "cancelled"
                ? "border-red-500/30 opacity-60"
                : "border-gray-800"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(session.type)}`}>
                    {session.type.replace("-", " ")}
                  </span>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor(session.status)}`}>
                  {getStatusIcon(session.status)}
                  <span className="text-sm capitalize">{session.status}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-white">{session.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-white">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-white">{session.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="text-white">{session.instructorName}</p>
                </div>
              </div>
            </div>

            {/* Equipment Info */}
            {(session.helicopterType || session.artillerySystem) && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex flex-wrap gap-4">
                  {session.helicopterType && (
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-400">
                        Helicopter: <span className="text-white">{session.helicopterType}</span>
                      </span>
                    </div>
                  )}
                  {session.artillerySystem && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-400">
                        Artillery: <span className="text-white">{session.artillerySystem}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {session.notes && (
              <div className="mt-4 p-3 bg-[#0a0a0f] rounded-lg">
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Notes: </span>
                  {session.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No sessions found</p>
        </div>
      )}
    </div>
  );
}
