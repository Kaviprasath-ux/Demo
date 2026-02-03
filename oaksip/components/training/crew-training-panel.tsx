"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { useTrainingStore } from "@/lib/training-store";

// Training procedures for each crew role
const crewProcedures: Record<string, { steps: string[]; safetyNotes: string[] }> = {
  // Towed gun crew
  no1: {
    steps: [
      "Verify all crew members are at their positions",
      "Receive fire mission from Battery Commander",
      "Command: 'LOAD' - signal to prepare ammunition",
      "Verify bearing and elevation settings with No. 3",
      "Confirm breech is clear - visual inspection",
      "Command: 'FIRE' - authorize No. 2 to fire",
      "Observe impact and report corrections",
      "Command 'CEASE FIRE' when mission complete",
    ],
    safetyNotes: [
      "Never stand in recoil path",
      "Verify all crew clear before firing",
      "Check for bore obstructions",
      "Maintain communication with FDC",
    ],
  },
  no2: {
    steps: [
      "Open breech mechanism",
      "Visually inspect bore is clear",
      "Signal 'CLEAR' to No. 4 for loading",
      "Close and lock breech after loading",
      "Verify breech indicator shows 'LOCKED'",
      "Report 'READY' to No. 1",
      "On 'FIRE' command, pull firing lanyard",
      "Open breech, extract spent casing",
    ],
    safetyNotes: [
      "Keep hands clear of breech during closure",
      "Never fire without locked breech indicator",
      "Handle firing lanyard carefully",
      "Watch for misfires - wait 30 seconds",
    ],
  },
  no3: {
    steps: [
      "Zero the sighting system",
      "Set deflection as called by No. 1",
      "Set quadrant elevation",
      "Track laying data on reference points",
      "Cross-level the gun",
      "Report 'ON TARGET' when ready",
      "Maintain laying during firing sequence",
      "Re-lay after each round",
    ],
    safetyNotes: [
      "Double-check all settings before firing",
      "Report any sight discrepancies immediately",
      "Maintain bubble level during high angle fire",
    ],
  },
  no4: {
    steps: [
      "Receive projectile from No. 5",
      "Inspect fuze setting",
      "Position projectile at breech opening",
      "Use rammer to seat projectile",
      "Position propellant charge",
      "Clear breech area",
      "Signal 'CLEAR' to No. 2",
    ],
    safetyNotes: [
      "Never drop projectiles",
      "Verify fuze is armed correctly",
      "Keep clear of breech during closure",
      "Handle propellant carefully",
    ],
  },
  no5: {
    steps: [
      "Receive fire order ammunition type",
      "Select correct projectile",
      "Verify lot number matches",
      "Set fuze per fire orders",
      "Pass projectile to No. 4",
      "Prepare propellant charge",
      "Maintain ammunition count",
      "Report low ammunition levels",
    ],
    safetyNotes: [
      "Never mix ammunition lots",
      "Store propellant away from heat",
      "Handle fuzes carefully",
      "Maintain accurate count",
    ],
  },
  no6: {
    steps: [
      "Position prime mover for rapid displacement",
      "Maintain radio watch on battery net",
      "Monitor for displacement orders",
      "Assist with gun positioning as needed",
      "Perform driver maintenance checks",
      "Report any vehicle issues",
    ],
    safetyNotes: [
      "Keep vehicle ready for rapid move",
      "Maintain safe distance during firing",
      "Test radio communications regularly",
    ],
  },
  // Self-propelled crew
  commander: {
    steps: [
      "Receive fire mission from FDC",
      "Designate target in fire control system",
      "Verify ammunition selection",
      "Authorize weapon system engagement",
      "Monitor fire sequence",
      "Report rounds complete to FDC",
      "Order displacement if required",
    ],
    safetyNotes: [
      "Maintain situational awareness",
      "Verify friendly positions before firing",
      "Monitor ammunition consumption",
    ],
  },
  gunner: {
    steps: [
      "Receive target data from commander",
      "Verify laying data on fire control display",
      "Engage auto-lay if equipped",
      "Monitor gun status indicators",
      "Execute firing on command",
      "Report gun status after each round",
    ],
    safetyNotes: [
      "Monitor hydraulic pressure",
      "Report any system warnings",
      "Verify safety interlocks",
    ],
  },
  loader: {
    steps: [
      "Receive ammunition type selection",
      "Verify autoloader ammunition count",
      "Monitor loading sequence",
      "Clear jams if required",
      "Report ammunition status",
      "Perform manual backup loading if needed",
    ],
    safetyNotes: [
      "Never reach into autoloader while active",
      "Follow jam clearance procedures exactly",
      "Maintain ammunition inventory",
    ],
  },
  driver: {
    steps: [
      "Position vehicle per commander orders",
      "Engage parking brake during firing",
      "Monitor engine and systems",
      "Prepare for rapid displacement",
      "Execute movement on command",
    ],
    safetyNotes: [
      "Maintain stable platform during firing",
      "Be ready for emergency movement",
      "Monitor vehicle systems continuously",
    ],
  },
};

interface CrewTrainingPanelProps {
  className?: string;
}

export function CrewTrainingPanel({ className }: CrewTrainingPanelProps) {
  const {
    getCrewPositionInfo,
    crewInteractionMode,
    getGunSystemInfo,
  } = useTrainingStore();

  const position = getCrewPositionInfo();
  const gunSystem = getGunSystemInfo();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  if (!position) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
          <UserCircle className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="font-medium">No Crew Station Selected</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select a crew station from the controls panel to begin training
          </p>
        </CardContent>
      </Card>
    );
  }

  const procedures = crewProcedures[position.id] || { steps: [], safetyNotes: [] };
  const progress = (completedSteps.length / procedures.steps.length) * 100;

  const startTraining = () => {
    setIsTraining(true);
    setStartTime(Date.now());
    setCurrentStep(0);
    setCompletedSteps([]);
    // Start timer
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  };

  const completeStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < procedures.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetTraining = () => {
    setIsTraining(false);
    setCurrentStep(0);
    setCompletedSteps([]);
    setStartTime(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            <span>{position.title}</span>
          </div>
          <Badge variant="outline">{gunSystem?.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {isTraining && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Training Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(elapsedTime)}
              </span>
              <span>
                {completedSteps.length}/{procedures.steps.length} steps
              </span>
            </div>
          </div>
        )}

        {/* Training Mode Content */}
        {crewInteractionMode === "observe" && !isTraining && (
          <div className="space-y-3">
            <Tabs defaultValue="procedures">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="procedures" className="text-xs">
                  <ListChecks className="h-3 w-3 mr-1" />
                  Steps
                </TabsTrigger>
                <TabsTrigger value="safety" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Safety
                </TabsTrigger>
                <TabsTrigger value="tips" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="procedures" className="mt-3">
                <div className="space-y-2">
                  {procedures.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px] font-medium">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="safety" className="mt-3">
                <div className="space-y-2">
                  {procedures.safetyNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tips" className="mt-3">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    <strong>Role:</strong> {position.role}
                  </p>
                  <p>
                    <strong>Location:</strong> {position.location}
                  </p>
                  <div>
                    <strong>Key Responsibilities:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      {position.responsibilities.map((r, idx) => (
                        <li key={idx}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Active Training */}
        {isTraining && (
          <div className="space-y-4">
            {/* Current Step */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {currentStep + 1}
                </span>
                <span className="text-xs font-medium text-primary">Current Step</span>
              </div>
              <p className="text-sm">{procedures.steps[currentStep]}</p>
            </div>

            {/* Step List */}
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {procedures.steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-full text-left flex items-center gap-2 p-2 rounded text-xs transition-colors ${
                    idx === currentStep
                      ? "bg-primary/10"
                      : completedSteps.includes(idx)
                      ? "bg-green-500/10"
                      : "hover:bg-muted"
                  }`}
                >
                  {completedSteps.includes(idx) ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        idx === currentStep
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  )}
                  <span className="truncate">{step}</span>
                </button>
              ))}
            </div>

            {/* Safety Reminder */}
            {procedures.safetyNotes.length > 0 && (
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-center gap-1 text-amber-600 text-xs font-medium mb-1">
                  <AlertTriangle className="h-3 w-3" />
                  Safety Note
                </div>
                <p className="text-xs text-amber-700">
                  {procedures.safetyNotes[currentStep % procedures.safetyNotes.length]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isTraining ? (
            <Button onClick={startTraining} className="flex-1">
              <Play className="h-4 w-4 mr-1" />
              {crewInteractionMode === "assess" ? "Start Assessment" : "Start Training"}
            </Button>
          ) : (
            <>
              <Button
                onClick={completeStep}
                className="flex-1"
                disabled={completedSteps.length === procedures.steps.length}
              >
                {completedSteps.length === procedures.steps.length ? (
                  <>
                    <Award className="h-4 w-4 mr-1" />
                    Complete!
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Complete Step
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={resetTraining}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Completion Summary */}
        {completedSteps.length === procedures.steps.length && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-green-700">Training Complete!</h4>
            <p className="text-xs text-green-600 mt-1">
              Completed in {formatTime(elapsedTime)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
