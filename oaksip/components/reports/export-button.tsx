"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  generateTraineeACRReport,
  generateUnitPerformanceReport,
  generateAssessmentResultReport,
  downloadPDF,
} from "@/lib/pdf-export";
import { QuizAttempt } from "@/lib/quiz-store";
import { UnitPerformance } from "@/types";

interface ExportButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

// Export button for trainee reports
export function ExportTraineeReport({
  traineeName,
  traineeId,
  course,
  batch,
  attempts,
  variant = "outline",
  size = "default",
  className,
}: ExportButtonProps & {
  traineeName: string;
  traineeId: string;
  course: string;
  batch: string;
  attempts: QuizAttempt[];
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = generateTraineeACRReport(
        traineeName,
        traineeId,
        course,
        batch,
        attempts
      );
      downloadPDF(doc, `ACR_${traineeId}_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Export ACR
    </Button>
  );
}

// Export button for unit performance
export function ExportUnitReport({
  unitName,
  unitPerformance,
  period,
  variant = "outline",
  size = "default",
  className,
}: ExportButtonProps & {
  unitName: string;
  unitPerformance: UnitPerformance[];
  period: string;
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = generateUnitPerformanceReport(unitName, unitPerformance, period);
      downloadPDF(doc, `Unit_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Export Report
    </Button>
  );
}

// Export button for assessment results
export function ExportAssessmentReport({
  assessmentName,
  assessmentType,
  date,
  results,
  variant = "outline",
  size = "default",
  className,
}: ExportButtonProps & {
  assessmentName: string;
  assessmentType: string;
  date: Date;
  results: Array<{
    traineeName: string;
    traineeId: string;
    score: number;
    totalMarks: number;
    passed: boolean;
  }>;
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = generateAssessmentResultReport(
        assessmentName,
        assessmentType,
        date,
        results
      );
      downloadPDF(doc, `Assessment_${assessmentName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Export Results
    </Button>
  );
}

// Multi-option export dropdown
export function ExportDropdown({
  onExportTrainee,
  onExportUnit,
  onExportAssessment,
  variant = "outline",
  size = "default",
  className,
}: ExportButtonProps & {
  onExportTrainee?: () => void;
  onExportUnit?: () => void;
  onExportAssessment?: () => void;
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportFn: () => void) => {
    setIsExporting(true);
    try {
      await exportFn();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Export Reports
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onExportTrainee && (
          <DropdownMenuItem onClick={() => handleExport(onExportTrainee)}>
            <Download className="h-4 w-4 mr-2" />
            Trainee ACR
          </DropdownMenuItem>
        )}
        {onExportUnit && (
          <DropdownMenuItem onClick={() => handleExport(onExportUnit)}>
            <Download className="h-4 w-4 mr-2" />
            Unit Performance
          </DropdownMenuItem>
        )}
        {onExportAssessment && (
          <DropdownMenuItem onClick={() => handleExport(onExportAssessment)}>
            <Download className="h-4 w-4 mr-2" />
            Assessment Results
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
