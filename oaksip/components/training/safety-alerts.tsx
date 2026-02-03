"use client";

import { useTrainingStore } from "@/lib/training-store";
import { safetyAlerts, getSafetyAlertById } from "@/lib/gun-data";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  XCircle,
  Info,
  X,
  Shield,
  FileText,
} from "lucide-react";

export function SafetyAlerts() {
  const { activeAlerts, dismissAlert, clearAlerts } = useTrainingStore();

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {activeAlerts.map((alertId) => {
        // Check if it's a step warning or a predefined safety alert
        const isStepWarning = alertId.startsWith("step-warning-");
        const alert = isStepWarning
          ? null
          : getSafetyAlertById(alertId) || safetyAlerts[0];

        const getAlertStyles = (type: string) => {
          switch (type) {
            case "danger":
              return {
                bg: "bg-red-500/10 border-red-500/30",
                icon: XCircle,
                iconColor: "text-red-500",
                titleColor: "text-red-600 dark:text-red-400",
              };
            case "warning":
              return {
                bg: "bg-yellow-500/10 border-yellow-500/30",
                icon: AlertTriangle,
                iconColor: "text-yellow-500",
                titleColor: "text-yellow-600 dark:text-yellow-400",
              };
            default:
              return {
                bg: "bg-blue-500/10 border-blue-500/30",
                icon: Info,
                iconColor: "text-blue-500",
                titleColor: "text-blue-600 dark:text-blue-400",
              };
          }
        };

        const type = alert?.type || "warning";
        const styles = getAlertStyles(type);
        const Icon = styles.icon;

        return (
          <div
            key={alertId}
            className={`${styles.bg} border rounded-lg p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-5`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`h-5 w-5 ${styles.iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-medium text-sm ${styles.titleColor}`}>
                    {alert?.title || "Safety Warning"}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => dismissAlert(alertId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert?.message || "Pay attention to this step."}
                </p>
                {alert?.sopReference && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>{alert.sopReference}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {activeAlerts.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="self-end"
          onClick={clearAlerts}
        >
          Dismiss All
        </Button>
      )}
    </div>
  );
}

// Demo safety alert trigger component
export function SafetyAlertDemo() {
  const { addAlert, activeAlerts } = useTrainingStore();

  const triggerAlerts = [
    { id: "breech-unlocked", label: "Breech Unlocked" },
    { id: "misfire-wait", label: "Misfire" },
    { id: "recoil-area", label: "Recoil Warning" },
    { id: "hot-barrel", label: "Hot Barrel" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {triggerAlerts.map((alert) => (
        <Button
          key={alert.id}
          variant="outline"
          size="sm"
          onClick={() => addAlert(alert.id)}
          disabled={activeAlerts.includes(alert.id)}
          className="text-xs"
        >
          <Shield className="h-3 w-3 mr-1" />
          {alert.label}
        </Button>
      ))}
    </div>
  );
}
