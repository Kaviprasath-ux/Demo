"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Square,
  Flame,
  AlertOctagon,
  Wrench,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  emergencyScenarios,
  type EmergencyScenario,
  type EmergencyDrillSession,
  calculateDrillScore,
} from "@/lib/emergency-scenarios";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { color: "text-red-500", bg: "bg-red-500/10", label: "CRITICAL" },
  high: { color: "text-orange-500", bg: "bg-orange-500/10", label: "HIGH" },
  medium: { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "MEDIUM" },
  low: { color: "text-green-500", bg: "bg-green-500/10", label: "LOW" },
};

const typeIcons = {
  misfire: <AlertOctagon className="h-5 w-5" />,
  hangfire: <AlertOctagon className="h-5 w-5" />,
  premature: <Flame className="h-5 w-5" />,
  breech_failure: <Shield className="h-5 w-5" />,
  recoil_failure: <Wrench className="h-5 w-5" />,
  hydraulic_leak: <Droplets className="h-5 w-5" />,
  electrical_fault: <AlertTriangle className="h-5 w-5" />,
  ammunition_defect: <AlertTriangle className="h-5 w-5" />,
  barrel_obstruction: <AlertTriangle className="h-5 w-5" />,
  fire_hazard: <Flame className="h-5 w-5" />,
};

// Scenario selection card
function ScenarioCard({
  scenario,
  onSelect,
  isSelected,
}: {
  scenario: EmergencyScenario;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const severity = severityConfig[scenario.severity];

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50",
        isSelected && "border-primary ring-1 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", severity.bg, severity.color)}>
            {typeIcons[scenario.type]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{scenario.name}</h3>
              <Badge className={cn("text-[10px]", severity.bg, severity.color)}>
                {severity.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {scenario.description}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {scenario.estimatedTime} min
              </span>
              <span>
                {scenario.immediateActions.length + scenario.followUpActions.length} steps
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Active drill view
function ActiveDrill({
  scenario,
  session,
  onCompleteStep,
  onError,
  onEnd,
}: {
  scenario: EmergencyScenario;
  session: EmergencyDrillSession;
  onCompleteStep: (stepId: string) => void;
  onError: (stepId: string, errorType: string) => void;
  onEnd: () => void;
}) {
  const [currentPhase, setCurrentPhase] = useState<"immediate" | "followup">("immediate");

  const allSteps =
    currentPhase === "immediate"
      ? scenario.immediateActions
      : scenario.followUpActions;

  const completedCount = session.stepsCompleted.filter((id) =>
    allSteps.some((s) => s.id === id)
  ).length;

  const progress = (completedCount / allSteps.length) * 100;
  const elapsedTime = Math.floor((Date.now() - session.startTime) / 1000);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {scenario.name}
          </h3>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={onEnd}>
          <Square className="h-4 w-4 mr-1" />
          End Drill
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            {currentPhase === "immediate" ? "Immediate Actions" : "Follow-up Actions"}
          </span>
          <span>
            {completedCount}/{allSteps.length} steps
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
          <span>Errors: {session.errors.length}</span>
        </div>
      </div>

      {/* Phase Toggle */}
      <div className="flex gap-2">
        <Button
          variant={currentPhase === "immediate" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPhase("immediate")}
        >
          Immediate ({scenario.immediateActions.length})
        </Button>
        <Button
          variant={currentPhase === "followup" ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPhase("followup")}
        >
          Follow-up ({scenario.followUpActions.length})
        </Button>
      </div>

      {/* Steps */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {allSteps.map((step) => {
            const isCompleted = session.stepsCompleted.includes(step.id);
            return (
              <div
                key={step.id}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  isCompleted
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-muted/30 border-border/50 hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                      isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : step.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{step.action}</span>
                      {step.isCritical && (
                        <Badge variant="destructive" className="text-[10px]">
                          CRITICAL
                        </Badge>
                      )}
                      {step.timeLimit && (
                        <Badge variant="outline" className="text-[10px]">
                          {step.timeLimit}s limit
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    {step.safetyNote && (
                      <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {step.safetyNote}
                      </p>
                    )}
                    {!isCompleted && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => onCompleteStep(step.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-red-500"
                          onClick={() => onError(step.id, "wrong_order")}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Skip/Error
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Safety Warnings */}
      <div className="p-3 bg-red-500/10 rounded-lg">
        <h4 className="font-medium text-red-500 text-sm mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Safety Warnings
        </h4>
        <ul className="text-xs space-y-1">
          {scenario.safetyWarnings.slice(0, 3).map((warning, i) => (
            <li key={i} className="text-muted-foreground">
              • {warning}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Results view
function DrillResults({
  session,
  onRetry,
  onBack,
}: {
  scenario: EmergencyScenario;
  session: EmergencyDrillSession;
  onRetry: () => void;
  onBack: () => void;
}) {
  const timeTaken = Math.floor(((session.endTime || Date.now()) - session.startTime) / 1000);

  return (
    <div className="space-y-4">
      {/* Result Header */}
      <div
        className={cn(
          "p-4 rounded-lg text-center",
          session.passed ? "bg-green-500/10" : "bg-red-500/10"
        )}
      >
        {session.passed ? (
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
        ) : (
          <XCircle className="h-12 w-12 mx-auto text-red-500 mb-2" />
        )}
        <h3 className={cn("text-xl font-bold", session.passed ? "text-green-500" : "text-red-500")}>
          {session.passed ? "DRILL PASSED" : "DRILL FAILED"}
        </h3>
        <p className="text-3xl font-bold mt-2">{session.score}/100</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold">{session.stepsCompleted.length}</p>
          <p className="text-xs text-muted-foreground">Steps Completed</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold">{session.errors.length}</p>
          <p className="text-xs text-muted-foreground">Errors</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold">
            {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, "0")}
          </p>
          <p className="text-xs text-muted-foreground">Time</p>
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Feedback:</h4>
        {session.feedback.map((item, i) => (
          <p
            key={i}
            className={cn(
              "text-sm p-2 rounded",
              i === 0
                ? session.passed
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
                : "bg-muted/50"
            )}
          >
            {item}
          </p>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back to Scenarios
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          <Play className="h-4 w-4 mr-1" />
          Retry Drill
        </Button>
      </div>
    </div>
  );
}

// Main panel
export function EmergencyDrillPanel() {
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario | null>(null);
  const [session, setSession] = useState<EmergencyDrillSession | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startDrill = (scenario: EmergencyScenario) => {
    setSession({
      id: `drill-${Date.now()}`,
      scenarioId: scenario.id,
      startTime: Date.now(),
      stepsCompleted: [],
      errors: [],
      score: 0,
      passed: false,
      feedback: [],
    });
    setSelectedScenario(scenario);
    setIsComplete(false);
  };

  const completeStep = (stepId: string) => {
    if (!session) return;
    setSession({
      ...session,
      stepsCompleted: [...session.stepsCompleted, stepId],
    });
  };

  const recordError = (stepId: string, errorType: string) => {
    if (!session) return;
    setSession({
      ...session,
      errors: [
        ...session.errors,
        {
          stepId,
          errorType: errorType as "wrong_order" | "skipped" | "timeout" | "safety_violation",
          description: `Error on step ${stepId}`,
          timestamp: Date.now(),
        },
      ],
    });
  };

  const endDrill = () => {
    if (!session || !selectedScenario) return;

    const endTime = Date.now();
    const { score, passed, feedback } = calculateDrillScore(selectedScenario, {
      ...session,
      endTime,
    });

    setSession({
      ...session,
      endTime,
      score,
      passed,
      feedback,
    });
    setIsComplete(true);
  };

  const resetDrill = () => {
    setSession(null);
    setIsComplete(false);
  };

  // Active drill view
  if (session && selectedScenario && !isComplete) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Emergency Drill Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActiveDrill
            scenario={selectedScenario}
            session={session}
            onCompleteStep={completeStep}
            onError={recordError}
            onEnd={endDrill}
          />
        </CardContent>
      </Card>
    );
  }

  // Results view
  if (session && selectedScenario && isComplete) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Drill Results</CardTitle>
        </CardHeader>
        <CardContent>
          <DrillResults
            scenario={selectedScenario}
            session={session}
            onRetry={() => startDrill(selectedScenario)}
            onBack={resetDrill}
          />
        </CardContent>
      </Card>
    );
  }

  // Scenario selection view
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Emergency Drills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Practice emergency procedures including misfire drills, system failures, and safety protocols.
        </p>

        <ScrollArea className="h-[350px]">
          <div className="space-y-3">
            {emergencyScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isSelected={selectedScenario?.id === scenario.id}
                onSelect={() => setSelectedScenario(scenario)}
              />
            ))}
          </div>
        </ScrollArea>

        {selectedScenario && (
          <Button className="w-full" onClick={() => startDrill(selectedScenario)}>
            <Play className="h-4 w-4 mr-1" />
            Start Drill: {selectedScenario.name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
