"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  CheckCircle,
  GraduationCap,
  Calendar,
  FileText,
  FileDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockUnitStats, mockSimulatorStats, mockTraineeProgress } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  generateUnitPerformanceReport,
  downloadPDF,
} from "@/lib/pdf-export";

// PDF export function
function exportPDFReport(timeRange: string) {
  const period = timeRange === "week" ? "This Week" :
    timeRange === "month" ? "This Month" :
    timeRange === "quarter" ? "This Quarter" : "This Year";

  const unitPerformance = mockUnitStats.map((u) => ({
    unitName: u.unitName,
    totalTrainees: u.totalTrainees,
    completionRate: u.completionRate,
    averageScore: u.avgScore,
    passRate: u.passRate,
  }));

  const doc = generateUnitPerformanceReport("School of Artillery, Deolali", unitPerformance, period);
  downloadPDF(doc, `OAKSIP_Unit_Report_${timeRange}_${new Date().toISOString().split("T")[0]}.pdf`);
}

// Export report function for leadership analytics
function exportLeadershipReport(timeRange: string) {
  const reportDate = new Date().toLocaleString();
  const totalTrainees = mockUnitStats.reduce((sum, u) => sum + u.totalTrainees, 0);
  const avgCompletionRate = mockUnitStats.reduce((sum, u) => sum + u.completionRate, 0) / mockUnitStats.length;
  const avgScore = mockUnitStats.reduce((sum, u) => sum + u.avgScore, 0) / mockUnitStats.length;
  const avgPassRate = mockUnitStats.reduce((sum, u) => sum + u.passRate, 0) / mockUnitStats.length;

  const sortedUnits = [...mockUnitStats].sort((a, b) => b.avgScore - a.avgScore);
  const topUnit = sortedUnits[0];
  const bottomUnit = sortedUnits[sortedUnits.length - 1];

  const reportContent = `
================================================================================
                    OAKSIP ARTILLERY TRAINING PLATFORM
                         UNIT PERFORMANCE REPORT
================================================================================

Report Generated: ${reportDate}
Time Period: ${timeRange === "week" ? "This Week" : timeRange === "month" ? "This Month" : timeRange === "quarter" ? "This Quarter" : "This Year"}
School of Artillery, Deolali

--------------------------------------------------------------------------------
                           EXECUTIVE SUMMARY
--------------------------------------------------------------------------------

Total Personnel Under Training: ${totalTrainees}
Number of Units: ${mockUnitStats.length}
Average Completion Rate: ${Math.round(avgCompletionRate)}%
Average Assessment Score: ${Math.round(avgScore)}%
Overall Pass Rate: ${Math.round(avgPassRate)}%

--------------------------------------------------------------------------------
                        PERFORMANCE HIGHLIGHTS
--------------------------------------------------------------------------------

TOP PERFORMING UNIT
Unit Name: ${topUnit.unitName}
Average Score: ${topUnit.avgScore}%
Pass Rate: ${topUnit.passRate}%
Completion Rate: ${topUnit.completionRate}%
Trainees: ${topUnit.totalTrainees}
Active Trainings: ${topUnit.activeTrainings}

UNIT REQUIRING ATTENTION
Unit Name: ${bottomUnit.unitName}
Average Score: ${bottomUnit.avgScore}%
Pass Rate: ${bottomUnit.passRate}%
Completion Rate: ${bottomUnit.completionRate}%
Trainees: ${bottomUnit.totalTrainees}

--------------------------------------------------------------------------------
                      UNIT-WISE PERFORMANCE BREAKDOWN
--------------------------------------------------------------------------------

${sortedUnits.map((unit, index) => `
${index + 1}. ${unit.unitName}
   - Total Trainees: ${unit.totalTrainees}
   - Completion Rate: ${unit.completionRate}%
   - Average Score: ${unit.avgScore}%
   - Pass Rate: ${unit.passRate}%
   - Active Trainings: ${unit.activeTrainings}
   - Status: ${unit.avgScore >= 80 ? "EXCELLENT" : unit.avgScore >= 70 ? "GOOD" : "NEEDS FOCUS"}
`).join("")}

--------------------------------------------------------------------------------
                         SIMULATOR STATISTICS
--------------------------------------------------------------------------------

Total Exercises Conducted: ${mockSimulatorStats.totalExercises.toLocaleString()}
Total Participants: ${mockSimulatorStats.totalParticipants.toLocaleString()}
Overall Accuracy: ${mockSimulatorStats.avgAccuracy}%

Monthly Exercise Volume:
${mockSimulatorStats.exercisesByMonth.map(m => `  ${m.month}: ${m.count} exercises`).join("\n")}

Accuracy Trend:
${mockSimulatorStats.accuracyTrend.map(t => `  ${t.date}: ${t.accuracy}%`).join("\n")}

--------------------------------------------------------------------------------
                       COMMON TRAINING GAPS
--------------------------------------------------------------------------------

${mockSimulatorStats.commonErrors.map((error, index) => `${index + 1}. ${error}`).join("\n")}

--------------------------------------------------------------------------------
                     TRAINEE STATUS SUMMARY
--------------------------------------------------------------------------------

Excelling: ${mockTraineeProgress.filter(t => t.status === "excelling").length} trainees
On Track: ${mockTraineeProgress.filter(t => t.status === "on-track").length} trainees
Needs Attention: ${mockTraineeProgress.filter(t => t.status === "needs-attention").length} trainees

--------------------------------------------------------------------------------
                         RECOMMENDATIONS
--------------------------------------------------------------------------------

1. ${bottomUnit.unitName} requires additional support and focused instruction
2. Common errors in simulator exercises should be addressed in classroom sessions
3. Consider additional practice sessions for trainees marked "Needs Attention"
4. Leverage best practices from ${topUnit.unitName} across other units

================================================================================
                         END OF REPORT
                  School of Artillery, Deolali
           AI-Based Offline Artillery Intelligence Platform
================================================================================
  `.trim();

  // Create and download file
  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `OAKSIP_Unit_Report_${timeRange}_${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export ACR-style report
function exportACRReport(timeRange: string) {
  const reportDate = new Date().toLocaleString();

  const acrContent = `
================================================================================
              ANNUAL CONFIDENTIAL REPORT (ACR) - TRAINING SUMMARY
                    OAKSIP ARTILLERY TRAINING PLATFORM
================================================================================

Date of Report: ${reportDate}
Reporting Period: ${timeRange === "year" ? "Annual" : timeRange === "quarter" ? "Quarterly" : "Monthly"}
School of Artillery, Deolali

--------------------------------------------------------------------------------
                    INDIVIDUAL TRAINEE PERFORMANCE
--------------------------------------------------------------------------------

${mockTraineeProgress.map((trainee, index) => `
TRAINEE ${index + 1}
-----------
Name: ${trainee.userName}
Service ID: ${trainee.userId}
Status: ${trainee.status.toUpperCase().replace("-", " ")}

Performance Metrics:
  - Quizzes Completed: ${trainee.quizzesCompleted}
  - Average Score: ${trainee.avgScore}%
  - Training Hours: ${trainee.trainingHours}
  - Last Active: ${trainee.lastActive.toLocaleDateString()}

Assessment:
  ${trainee.avgScore >= 85 ? "OUTSTANDING - Recommended for advanced training" :
    trainee.avgScore >= 75 ? "VERY GOOD - Meeting all objectives" :
    trainee.avgScore >= 65 ? "GOOD - Steady progress observed" :
    "SATISFACTORY - Additional coaching recommended"}

Recommendations:
  ${trainee.status === "excelling" ? "Consider for instructor assistance role" :
    trainee.status === "on-track" ? "Continue current training regimen" :
    "Assign mentor and increase practical sessions"}
`).join("\n--------------------------------------------------------------------------------\n")}

--------------------------------------------------------------------------------
                        SUMMARY STATISTICS
--------------------------------------------------------------------------------

Total Trainees Evaluated: ${mockTraineeProgress.length}
Average Score (All Trainees): ${Math.round(mockTraineeProgress.reduce((sum, t) => sum + t.avgScore, 0) / mockTraineeProgress.length)}%
Total Training Hours Logged: ${mockTraineeProgress.reduce((sum, t) => sum + t.trainingHours, 0)}
Total Quizzes Completed: ${mockTraineeProgress.reduce((sum, t) => sum + t.quizzesCompleted, 0)}

Performance Distribution:
  - Excelling: ${mockTraineeProgress.filter(t => t.avgScore >= 85).length} (${Math.round(mockTraineeProgress.filter(t => t.avgScore >= 85).length / mockTraineeProgress.length * 100)}%)
  - Very Good: ${mockTraineeProgress.filter(t => t.avgScore >= 75 && t.avgScore < 85).length} (${Math.round(mockTraineeProgress.filter(t => t.avgScore >= 75 && t.avgScore < 85).length / mockTraineeProgress.length * 100)}%)
  - Good: ${mockTraineeProgress.filter(t => t.avgScore >= 65 && t.avgScore < 75).length} (${Math.round(mockTraineeProgress.filter(t => t.avgScore >= 65 && t.avgScore < 75).length / mockTraineeProgress.length * 100)}%)
  - Satisfactory: ${mockTraineeProgress.filter(t => t.avgScore < 65).length} (${Math.round(mockTraineeProgress.filter(t => t.avgScore < 65).length / mockTraineeProgress.length * 100)}%)

================================================================================
                    REPORTING OFFICER CERTIFICATION
================================================================================

I certify that this report accurately reflects the training performance
of the personnel listed above during the reporting period.

Signature: _____________________     Date: _______________

Countersigned: _________________     Date: _______________

================================================================================
                         END OF ACR SUMMARY
                    School of Artillery, Deolali
================================================================================
  `.trim();

  const blob = new Blob([acrContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `OAKSIP_ACR_Report_${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function LeadershipReportsPage() {
  const [timeRange, setTimeRange] = useState("month");

  const totalTrainees = mockUnitStats.reduce((sum, u) => sum + u.totalTrainees, 0);
  const avgCompletionRate =
    mockUnitStats.reduce((sum, u) => sum + u.completionRate, 0) / mockUnitStats.length;
  const avgScore =
    mockUnitStats.reduce((sum, u) => sum + u.avgScore, 0) / mockUnitStats.length;
  const avgPassRate =
    mockUnitStats.reduce((sum, u) => sum + u.passRate, 0) / mockUnitStats.length;

  // Sort units by performance
  const sortedUnits = [...mockUnitStats].sort((a, b) => b.avgScore - a.avgScore);
  const topUnit = sortedUnits[0];
  const bottomUnit = sortedUnits[sortedUnits.length - 1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Unit Reports
          </h1>
          <p className="text-muted-foreground">
            Comprehensive training performance analytics and metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => exportLeadershipReport(timeRange)}
          >
            <FileDown className="h-4 w-4" />
            Unit Report
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => exportACRReport(timeRange)}
          >
            <Download className="h-4 w-4" />
            ACR Summary
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={() => exportPDFReport(timeRange)}
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Personnel</p>
                <p className="text-3xl font-bold text-foreground">{totalTrainees}</p>
                <p className="text-xs text-muted-foreground">Across {mockUnitStats.length} units</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(avgCompletionRate)}%</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% from last period
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(avgScore)}%</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Above 70% target
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(avgPassRate)}%</p>
                <p className="text-xs text-muted-foreground">Assessment success</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Highlights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-green-500/50 bg-gradient-to-br from-card to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                <TrendingUp className="h-7 w-7 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Top Performing Unit</p>
                <p className="text-xl font-bold">{topUnit.unitName}</p>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="text-green-500 font-medium">{topUnit.avgScore}% avg score</span>
                  <span className="text-muted-foreground">{topUnit.passRate}% pass rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-gradient-to-br from-card to-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
                <TrendingDown className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Needs Improvement</p>
                <p className="text-xl font-bold">{bottomUnit.unitName}</p>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="text-yellow-500 font-medium">{bottomUnit.avgScore}% avg score</span>
                  <span className="text-muted-foreground">{bottomUnit.passRate}% pass rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Comparison Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Unit Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Trainees</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead>Pass Rate</TableHead>
                <TableHead>Active Trainings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUnits.map((unit, index) => (
                <TableRow key={unit.unitName}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {index === 0 && <Badge variant="success" className="text-xs">Top</Badge>}
                      <span className="font-medium">{unit.unitName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {unit.totalTrainees}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <Progress value={unit.completionRate} className="h-2" />
                      </div>
                      <span className="text-sm">{unit.completionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium",
                      unit.avgScore >= 80 ? "text-green-500" :
                      unit.avgScore >= 70 ? "text-blue-500" : "text-yellow-500"
                    )}>
                      {unit.avgScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium",
                      unit.passRate >= 90 ? "text-green-500" :
                      unit.passRate >= 80 ? "text-blue-500" : "text-yellow-500"
                    )}>
                      {unit.passRate}%
                    </span>
                  </TableCell>
                  <TableCell>{unit.activeTrainings}</TableCell>
                  <TableCell>
                    <Badge variant={
                      unit.avgScore >= 80 ? "success" :
                      unit.avgScore >= 70 ? "secondary" : "warning"
                    }>
                      {unit.avgScore >= 80 ? "Excellent" :
                       unit.avgScore >= 70 ? "Good" : "Needs Focus"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Simulator Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accuracy Trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Simulator Accuracy Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSimulatorStats.accuracyTrend.map((point, index) => {
                const prevValue = index > 0 ? mockSimulatorStats.accuracyTrend[index - 1].accuracy : point.accuracy;
                const trend = point.accuracy - prevValue;
                return (
                  <div
                    key={point.date}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">{point.date}</span>
                      <div className="w-40">
                        <Progress value={point.accuracy} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{point.accuracy}%</span>
                      {trend !== 0 && (
                        <span
                          className={cn(
                            "text-xs flex items-center",
                            trend > 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {trend > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(trend).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Volume */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Exercise Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSimulatorStats.exercisesByMonth.map((point) => {
                const maxCount = Math.max(...mockSimulatorStats.exercisesByMonth.map(p => p.count));
                const percentage = (point.count / maxCount) * 100;
                return (
                  <div
                    key={point.month}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-12">{point.month}</span>
                      <div className="w-40">
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </div>
                    <span className="font-medium">{point.count} exercises</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Issues */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-purple-500" />
            Common Training Gaps - Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {mockSimulatorStats.commonErrors.map((error, index) => (
              <Card key={error} className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500 mb-2">
                    #{index + 1}
                  </div>
                  <p className="text-sm font-medium">{error}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(Math.random() * 20 + 10)}% of trainees affected
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Simulator Sessions</p>
              <p className="text-3xl font-bold">{mockSimulatorStats.totalExercises.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Accuracy</p>
              <p className="text-3xl font-bold">{mockSimulatorStats.avgAccuracy}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
              <p className="text-3xl font-bold">{mockSimulatorStats.totalParticipants.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Improvement Rate</p>
              <p className="text-3xl font-bold text-green-500">+8.6%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
