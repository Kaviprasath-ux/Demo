"use client";

import { useEffect, useRef } from "react";
import {
  useTrainingStore,
  type AARSession,
  type AAREvent,
  terrainConfigs,
  weatherConfigs,
} from "@/lib/training-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Circle,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trash2,
  FileText,
  Mountain,
  Cloud,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Event type colors and icons
const eventTypeConfig = {
  step_start: { color: "text-blue-500", bg: "bg-blue-500/10", label: "Step Started" },
  step_complete: { color: "text-green-500", bg: "bg-green-500/10", label: "Step Complete" },
  error: { color: "text-red-500", bg: "bg-red-500/10", label: "Error" },
  safety_alert: { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Safety Alert" },
  firing: { color: "text-orange-500", bg: "bg-orange-500/10", label: "Fired" },
  camera_change: { color: "text-purple-500", bg: "bg-purple-500/10", label: "Camera" },
};

// Format timestamp to mm:ss
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Format date
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Recording indicator
function RecordingIndicator() {
  const { isRecording, currentSession } = useTrainingStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRecording || !currentSession) return;

    const interval = setInterval(() => {
      setElapsed(Date.now() - currentSession.startTime.getTime());
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, currentSession]);

  if (!isRecording) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/30">
      <Circle className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
      <span className="text-sm font-medium text-red-500">Recording</span>
      <span className="text-sm text-muted-foreground">{formatTime(elapsed)}</span>
      <span className="text-xs text-muted-foreground">
        {currentSession?.events.length || 0} events
      </span>
    </div>
  );
}

// Event timeline item
function EventItem({ event, index, isActive }: { event: AAREvent; index: number; isActive: boolean }) {
  const config = eventTypeConfig[event.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-lg transition-colors",
        isActive ? "bg-primary/10 border border-primary" : "hover:bg-muted/50"
      )}
    >
      <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs", config.bg)}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-xs", config.color)}>
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
        </div>
        <p className="text-sm truncate">{event.description}</p>
      </div>
    </div>
  );
}

// Session card in the list
function SessionCard({
  session,
  onLoad,
  onDelete,
}: {
  session: AARSession;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/50">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm">{session.drillName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(session.startTime)}</p>
            </div>
            <div className="flex items-center gap-1">
              {session.completed ? (
                <Badge variant="outline" className="text-green-500 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-500 text-xs">
                  Partial
                </Badge>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(session.duration * 1000)}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {session.events.length} events
            </span>
            {session.errors.length > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-3 w-3" />
                {session.errors.length} errors
              </span>
            )}
            {session.finalScore !== undefined && (
              <span className="flex items-center gap-1 font-medium">
                Score: {session.finalScore}%
              </span>
            )}
          </div>

          {/* Environment info */}
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-xs">
              <Mountain className="h-3 w-3 mr-1" />
              {terrainConfigs[session.terrain].label}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Cloud className="h-3 w-3 mr-1" />
              {weatherConfigs[session.weather].label}
            </Badge>
          </div>

          {/* Expand/collapse */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs h-7"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Details" : "Show Details"}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          {/* Expanded details */}
          {expanded && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              {/* Event summary */}
              <div className="max-h-32 overflow-y-auto space-y-1">
                {session.events.slice(0, 10).map((event, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-12">{formatTime(event.timestamp)}</span>
                    <Badge variant="outline" className={cn("text-[10px]", eventTypeConfig[event.type].color)}>
                      {eventTypeConfig[event.type].label}
                    </Badge>
                    <span className="truncate flex-1">{event.description}</span>
                  </div>
                ))}
                {session.events.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{session.events.length - 10} more events
                  </p>
                )}
              </div>

              {/* Errors */}
              {session.errors.length > 0 && (
                <div className="p-2 bg-red-500/10 rounded text-xs">
                  <p className="font-medium text-red-500 mb-1">Errors:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    {session.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1 h-7 text-xs" onClick={onLoad}>
              <Play className="h-3 w-3 mr-1" />
              Review
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AAR Playback controls
function AARPlayback() {
  const {
    currentSession,
    aarPlaybackIndex,
    isAARPlaying,
    playAAR,
    pauseAAR,
    seekAAR,
    clearCurrentSession,
  } = useTrainingStore();

  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance playback
  useEffect(() => {
    if (!isAARPlaying || !currentSession) return;

    playbackRef.current = setInterval(() => {
      const nextIndex = aarPlaybackIndex + 1;
      if (nextIndex >= currentSession.events.length) {
        pauseAAR();
      } else {
        seekAAR(nextIndex);
      }
    }, 1500);

    return () => {
      if (playbackRef.current) clearInterval(playbackRef.current);
    };
  }, [isAARPlaying, aarPlaybackIndex, currentSession, pauseAAR, seekAAR]);

  if (!currentSession) return null;

  const progress =
    currentSession.events.length > 0
      ? ((aarPlaybackIndex + 1) / currentSession.events.length) * 100
      : 0;

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            AAR Review: {currentSession.drillName}
          </span>
          <Button variant="ghost" size="sm" onClick={clearCurrentSession} className="h-6 text-xs">
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>
              Event {aarPlaybackIndex + 1} of {currentSession.events.length}
            </span>
            <span className="text-muted-foreground">
              {formatTime(currentSession.events[aarPlaybackIndex]?.timestamp || 0)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => seekAAR(Math.max(0, aarPlaybackIndex - 1))}
            disabled={aarPlaybackIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          {isAARPlaying ? (
            <Button size="sm" onClick={pauseAAR}>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={playAAR}>
              <Play className="h-4 w-4 mr-1" />
              Play
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => seekAAR(Math.min(currentSession.events.length - 1, aarPlaybackIndex + 1))}
            disabled={aarPlaybackIndex >= currentSession.events.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Event timeline */}
        <div className="max-h-48 overflow-y-auto space-y-1">
          {currentSession.events.map((event, idx) => (
            <div
              key={idx}
              onClick={() => seekAAR(idx)}
              className="cursor-pointer"
            >
              <EventItem event={event} index={idx} isActive={idx === aarPlaybackIndex} />
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold">{formatTime(currentSession.duration * 1000)}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{currentSession.errors.length}</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">
              {currentSession.finalScore !== undefined ? `${currentSession.finalScore}%` : "-"}
            </p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main AAR Panel
export function AARPanel() {
  const {
    isRecording,
    currentSession,
    savedSessions,
    stopRecording,
    loadAARSession,
    deleteAARSession,
    assessmentScore,
  } = useTrainingStore();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          After-Action Review (AAR)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording indicator */}
        <RecordingIndicator />

        {/* Stop recording button */}
        {isRecording && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => stopRecording(assessmentScore)}
          >
            <Square className="h-4 w-4 mr-1" />
            Stop Recording
          </Button>
        )}

        {/* Current AAR playback */}
        {currentSession && !isRecording && <AARPlayback />}

        {/* Saved sessions list */}
        {!currentSession && savedSessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">
              Recent Sessions ({savedSessions.length})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {savedSessions
                .slice()
                .reverse()
                .map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onLoad={() => loadAARSession(session.id)}
                    onDelete={() => deleteAARSession(session.id)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isRecording && !currentSession && savedSessions.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No AAR sessions recorded yet.</p>
            <p className="text-xs">Start a drill to begin recording.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
