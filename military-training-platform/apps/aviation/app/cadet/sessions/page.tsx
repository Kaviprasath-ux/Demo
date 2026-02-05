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
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/20 text-primary border-primary/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-primary/20 text-primary border-yellow-500/30";
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      classroom: "bg-primary/20 text-primary",
      simulator: "bg-primary/20 text-primary",
      field: "bg-primary/20 text-primary",
      "live-fire": "bg-red-500/20 text-red-400",
      "joint-exercise": "bg-primary/20 text-primary",
    };
    return colors[type] || "bg-gray-500/20 text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            My Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            View your scheduled training sessions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "upcoming"
                ? "bg-primary text-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              viewMode === "all"
                ? "bg-primary text-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Sessions
          </button>
        </div>
      </div>

      {/* Sessions Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Confirmed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {sessions.filter((s) => s.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {sessions.filter((s) => s.status === "scheduled").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-muted-foreground">Cancelled</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {sessions.filter((s) => s.status === "cancelled").length}
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className={`bg-card border rounded-lg p-5 ${
              session.status === "cancelled"
                ? "border-red-500/30 opacity-60"
                : "border-border"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{session.title}</h3>
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
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-foreground">{session.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-foreground">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-foreground">{session.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                  <p className="text-foreground">{session.instructorName}</p>
                </div>
              </div>
            </div>

            {/* Equipment Info */}
            {(session.helicopterType || session.artillerySystem) && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-4">
                  {session.helicopterType && (
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Helicopter: <span className="text-foreground">{session.helicopterType}</span>
                      </span>
                    </div>
                  )}
                  {session.artillerySystem && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Artillery: <span className="text-foreground">{session.artillerySystem}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {session.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="text-muted-foreground">Notes: </span>
                  {session.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No sessions found</p>
        </div>
      )}
    </div>
  );
}
