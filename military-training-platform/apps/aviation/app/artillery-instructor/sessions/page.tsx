"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Calendar,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Users,
  X,
  Filter,
  Target,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Plane,
} from "lucide-react";
import {
  useArtilleryInstructorStore,
  ArtilleryTrainingSession,
} from "@/lib/stores/artillery-instructor-store";

export default function SessionsPage() {
  const {
    sessions,
    addSession,
    updateSession,
    removeSession,
    trainees,
    scenarios,
  } = useArtilleryInstructorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<ArtilleryTrainingSession | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<ArtilleryTrainingSession | null>(null);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.traineeNames.some((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter((s) => s.status === "scheduled").length,
    inProgress: sessions.filter((s) => s.status === "in-progress").length,
    completed: sessions.filter((s) => s.status === "completed").length,
  };

  const getTypeColor = (type: ArtilleryTrainingSession["type"]) => {
    switch (type) {
      case "classroom":
        return "bg-primary/20 text-primary";
      case "simulator":
        return "bg-primary/20 text-primary";
      case "field":
        return "bg-primary/20 text-primary";
      case "live-fire":
        return "bg-red-500/20 text-red-400";
      case "joint-exercise":
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const getStatusColor = (status: ArtilleryTrainingSession["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-primary/20 text-primary";
      case "in-progress":
        return "bg-primary/20 text-primary";
      case "completed":
        return "bg-gray-500/20 text-muted-foreground";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      case "postponed":
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: ArtilleryTrainingSession["status"]) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="w-4 h-4" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      case "postponed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const activeTrainees = trainees.filter((t) => t.status === "active");
  const activeScenarios = scenarios.filter((s) => s.status === "active");

  const handleAddSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const selectedTraineeIds = formData.getAll("trainees") as string[];
    const selectedTraineeNames = selectedTraineeIds.map((id) => {
      const trainee = trainees.find((t) => t.id === id);
      return trainee ? `${trainee.rank} ${trainee.name}` : "";
    }).filter(Boolean);

    const scenarioId = formData.get("scenario") as string;
    const scenario = scenarios.find((s) => s.id === scenarioId);

    addSession({
      title: formData.get("title") as string,
      type: formData.get("type") as ArtilleryTrainingSession["type"],
      scenarioId: scenarioId || undefined,
      scenarioName: scenario?.title,
      traineeIds: selectedTraineeIds,
      traineeNames: selectedTraineeNames,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      location: formData.get("location") as string,
      instructorId: "ins1",
      instructorName: "Col R.K. Sharma",
      aviationInstructorId: formData.get("aviationInstructor") ? "avi1" : undefined,
      aviationInstructorName: formData.get("aviationInstructor") ? "Wg Cdr P. Nair" : undefined,
      status: "scheduled",
      objectives: (formData.get("objectives") as string).split("\n").filter((o) => o.trim()),
      equipment: (formData.get("equipment") as string).split(",").map((e) => e.trim()).filter(Boolean),
      safetyBriefCompleted: false,
    });
    setShowAddDialog(false);
  };

  const handleEditSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSession) return;

    const formData = new FormData(e.currentTarget);

    const selectedTraineeIds = formData.getAll("trainees") as string[];
    const selectedTraineeNames = selectedTraineeIds.map((id) => {
      const trainee = trainees.find((t) => t.id === id);
      return trainee ? `${trainee.rank} ${trainee.name}` : "";
    }).filter(Boolean);

    const scenarioId = formData.get("scenario") as string;
    const scenario = scenarios.find((s) => s.id === scenarioId);

    updateSession(editingSession.id, {
      title: formData.get("title") as string,
      type: formData.get("type") as ArtilleryTrainingSession["type"],
      scenarioId: scenarioId || undefined,
      scenarioName: scenario?.title,
      traineeIds: selectedTraineeIds,
      traineeNames: selectedTraineeNames,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as ArtilleryTrainingSession["status"],
      objectives: (formData.get("objectives") as string).split("\n").filter((o) => o.trim()),
      equipment: (formData.get("equipment") as string).split(",").map((e) => e.trim()).filter(Boolean),
      remarks: formData.get("remarks") as string || undefined,
      safetyBriefCompleted: formData.get("safetyBriefCompleted") === "on",
    });
    setShowEditDialog(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: string) => {
    removeSession(id);
    setShowDeleteConfirm(null);
    if (selectedSession?.id === id) {
      setSelectedSession(null);
    }
  };

  // Sort sessions by date
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.startTime}`);
    const dateB = new Date(`${b.date} ${b.startTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Training Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage training sessions for FOO trainees
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.scheduled}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <PlayCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Types</option>
            <option value="classroom">Classroom</option>
            <option value="simulator">Simulator</option>
            <option value="field">Field</option>
            <option value="live-fire">Live Fire</option>
            <option value="joint-exercise">Joint Exercise</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="postponed">Postponed</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            className="bg-card border border-border rounded-lg hover:border-border transition-colors cursor-pointer"
            onClick={() => setSelectedSession(session)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(session.type)}`}>
                      {session.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status.replace("-", " ")}
                    </span>
                    {session.aviationInstructorName && (
                      <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary flex items-center gap-1">
                        <Plane className="w-3 h-3" />
                        Joint
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{session.title}</h3>
                  {session.scenarioName && (
                    <p className="text-sm text-primary flex items-center gap-1 mt-1">
                      <Target className="w-3 h-3" />
                      {session.scenarioName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-foreground font-medium">{session.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.startTime} - {session.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {session.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {session.traineeNames.length} trainee{session.traineeNames.length !== 1 ? "s" : ""}
                </span>
                {session.safetyBriefCompleted && (
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    Safety Brief Complete
                  </span>
                )}
              </div>

              {session.traineeNames.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {session.traineeNames.slice(0, 3).map((name, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted/50 rounded text-xs text-gray-300"
                    >
                      {name}
                    </span>
                  ))}
                  {session.traineeNames.length > 3 && (
                    <span className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                      +{session.traineeNames.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No sessions found matching your criteria</p>
        </div>
      )}

      {/* View Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(selectedSession.type)}`}>
                      {selectedSession.type.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(selectedSession.status)}`}>
                      {getStatusIcon(selectedSession.status)}
                      {selectedSession.status.replace("-", " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedSession.title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSession(null)}
                  className="text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Schedule Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-foreground font-medium">{selectedSession.date}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-foreground font-medium">
                    {selectedSession.startTime} - {selectedSession.endTime}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">{selectedSession.location}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Safety Brief</p>
                  <p className={`font-medium ${selectedSession.safetyBriefCompleted ? 'text-primary' : 'text-primary'}`}>
                    {selectedSession.safetyBriefCompleted ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Scenario */}
              {selectedSession.scenarioName && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Scenario
                  </h3>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <p className="text-primary font-medium">{selectedSession.scenarioName}</p>
                  </div>
                </div>
              )}

              {/* Instructors */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Instructors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Artillery Instructor</p>
                    <p className="text-foreground font-medium">{selectedSession.instructorName}</p>
                  </div>
                  {selectedSession.aviationInstructorName && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                      <p className="text-xs text-primary">Aviation Instructor</p>
                      <p className="text-foreground font-medium">{selectedSession.aviationInstructorName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trainees */}
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Trainees ({selectedSession.traineeNames.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.traineeNames.map((name, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted/50 border border-border rounded-lg text-sm text-foreground"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Objectives */}
              {selectedSession.objectives.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Objectives</h3>
                  <ul className="space-y-2">
                    {selectedSession.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Equipment */}
              {selectedSession.equipment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Remarks */}
              {selectedSession.remarks && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Remarks</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-gray-300">
                    {selectedSession.remarks}
                  </div>
                </div>
              )}

              {/* Weather */}
              {selectedSession.weatherConditions && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Weather Conditions</h3>
                  <div className="bg-muted/50 rounded-lg p-3 text-gray-300">
                    {selectedSession.weatherConditions}
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {(["scheduled", "in-progress", "completed", "cancelled", "postponed"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={selectedSession.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          updateSession(selectedSession.id, { status });
                          setSelectedSession({ ...selectedSession, status });
                        }}
                        className={
                          selectedSession.status === status
                            ? "bg-primary"
                            : "border-border"
                        }
                      >
                        {status.replace("-", " ")}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-between">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(selectedSession.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedSession(null)} className="border-border">
                  Close
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingSession(selectedSession);
                    setShowEditDialog(true);
                    setSelectedSession(null);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Session Dialog */}
      {(showAddDialog || showEditDialog) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {showEditDialog ? "Edit Session" : "Schedule New Session"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                  setEditingSession(null);
                }}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form
              onSubmit={showEditDialog ? handleEditSession : handleAddSession}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Title</label>
                <input
                  name="title"
                  required
                  defaultValue={editingSession?.title}
                  placeholder="e.g., CAS Communication Protocols"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Type</label>
                  <select
                    name="type"
                    required
                    defaultValue={editingSession?.type || "classroom"}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="classroom">Classroom</option>
                    <option value="simulator">Simulator</option>
                    <option value="field">Field</option>
                    <option value="live-fire">Live Fire</option>
                    <option value="joint-exercise">Joint Exercise</option>
                  </select>
                </div>
                {showEditDialog && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Status</label>
                    <select
                      name="status"
                      required
                      defaultValue={editingSession?.status}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="postponed">Postponed</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Scenario (Optional)</label>
                <select
                  name="scenario"
                  defaultValue={editingSession?.scenarioId || ""}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">No scenario</option>
                  {activeScenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.title} ({scenario.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={editingSession?.date}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Start Time</label>
                  <input
                    name="startTime"
                    type="time"
                    required
                    defaultValue={editingSession?.startTime}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">End Time</label>
                  <input
                    name="endTime"
                    type="time"
                    required
                    defaultValue={editingSession?.endTime}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Location</label>
                <input
                  name="location"
                  required
                  defaultValue={editingSession?.location}
                  placeholder="e.g., Classroom A - Fire Control Wing"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Trainees</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-muted/50 border border-border rounded-lg p-3">
                  {activeTrainees.map((trainee) => (
                    <label key={trainee.id} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        name="trainees"
                        value={trainee.id}
                        defaultChecked={editingSession?.traineeIds.includes(trainee.id)}
                        className="rounded border-border bg-card"
                      />
                      {trainee.rank} {trainee.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="aviationInstructor"
                  id="aviationInstructor"
                  defaultChecked={!!editingSession?.aviationInstructorId}
                  className="rounded border-border bg-card"
                />
                <label htmlFor="aviationInstructor" className="text-sm text-foreground cursor-pointer flex items-center gap-2">
                  <Plane className="w-4 h-4 text-primary" />
                  Include Aviation Instructor (Joint Session)
                </label>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Objectives (one per line)</label>
                <textarea
                  name="objectives"
                  required
                  defaultValue={editingSession?.objectives.join("\n")}
                  placeholder="Master CAS brevity codes&#10;Practice 9-line brief format"
                  rows={3}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Equipment (comma-separated)</label>
                <input
                  name="equipment"
                  defaultValue={editingSession?.equipment.join(", ")}
                  placeholder="e.g., Radio simulator, Projector, Training manuals"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {showEditDialog && (
                <>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Remarks</label>
                    <textarea
                      name="remarks"
                      defaultValue={editingSession?.remarks}
                      placeholder="Session notes and observations..."
                      rows={2}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="safetyBriefCompleted"
                      id="safetyBriefCompleted"
                      defaultChecked={editingSession?.safetyBriefCompleted}
                      className="rounded border-border bg-card"
                    />
                    <label htmlFor="safetyBriefCompleted" className="text-sm text-foreground cursor-pointer">
                      Safety Brief Completed
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setShowEditDialog(false);
                    setEditingSession(null);
                  }}
                  className="border-border"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {showEditDialog ? "Save Changes" : "Schedule Session"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Confirm Delete</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDeleteSession(showDeleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
