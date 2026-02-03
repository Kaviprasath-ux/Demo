"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Types for heatmap data
interface TopicPerformance {
  topicId: string;
  topicName: string;
  averageScore: number;
  attemptCount: number;
  passRate: number;
  trend: "up" | "down" | "stable";
}

interface TraineePerformance {
  traineeId: string;
  traineeName: string;
  topics: Record<string, number>; // topicId -> score
  overall: number;
}

interface CoursePerformance {
  courseId: string;
  courseName: string;
  topics: TopicPerformance[];
  trainees: TraineePerformance[];
  overallAverage: number;
  passRate: number;
}

// Mock data for demonstration
const mockCourseData: CoursePerformance[] = [
  {
    courseId: "yo-gunnery",
    courseName: "YO Gunnery Course",
    overallAverage: 72,
    passRate: 85,
    topics: [
      { topicId: "gun-drill", topicName: "Gun Drill", averageScore: 78, attemptCount: 45, passRate: 88, trend: "up" },
      { topicId: "ballistics", topicName: "Ballistics", averageScore: 65, attemptCount: 42, passRate: 72, trend: "stable" },
      { topicId: "fire-control", topicName: "Fire Control", averageScore: 71, attemptCount: 40, passRate: 82, trend: "up" },
      { topicId: "safety", topicName: "Safety Procedures", averageScore: 85, attemptCount: 48, passRate: 95, trend: "stable" },
      { topicId: "tactics", topicName: "Fire Tactics", averageScore: 68, attemptCount: 38, passRate: 75, trend: "down" },
      { topicId: "communications", topicName: "Communications", averageScore: 74, attemptCount: 44, passRate: 80, trend: "up" },
    ],
    trainees: [
      { traineeId: "YO-001", traineeName: "Lt. Sharma", topics: { "gun-drill": 85, "ballistics": 72, "fire-control": 78, "safety": 92, "tactics": 75, "communications": 80 }, overall: 80 },
      { traineeId: "YO-002", traineeName: "Lt. Verma", topics: { "gun-drill": 78, "ballistics": 68, "fire-control": 72, "safety": 88, "tactics": 70, "communications": 76 }, overall: 75 },
      { traineeId: "YO-003", traineeName: "Lt. Singh", topics: { "gun-drill": 82, "ballistics": 75, "fire-control": 80, "safety": 90, "tactics": 72, "communications": 82 }, overall: 80 },
      { traineeId: "YO-004", traineeName: "Lt. Kumar", topics: { "gun-drill": 70, "ballistics": 55, "fire-control": 62, "safety": 78, "tactics": 58, "communications": 65 }, overall: 65 },
      { traineeId: "YO-005", traineeName: "Lt. Rao", topics: { "gun-drill": 88, "ballistics": 80, "fire-control": 85, "safety": 95, "tactics": 82, "communications": 88 }, overall: 86 },
      { traineeId: "YO-006", traineeName: "Lt. Patel", topics: { "gun-drill": 75, "ballistics": 62, "fire-control": 68, "safety": 82, "tactics": 65, "communications": 72 }, overall: 71 },
      { traineeId: "YO-007", traineeName: "Lt. Das", topics: { "gun-drill": 80, "ballistics": 70, "fire-control": 75, "safety": 85, "tactics": 68, "communications": 78 }, overall: 76 },
      { traineeId: "YO-008", traineeName: "Lt. Reddy", topics: { "gun-drill": 72, "ballistics": 58, "fire-control": 65, "safety": 80, "tactics": 60, "communications": 68 }, overall: 67 },
    ],
  },
  {
    courseId: "lgsc",
    courseName: "Long Gunnery Staff Course",
    overallAverage: 76,
    passRate: 90,
    topics: [
      { topicId: "advanced-ballistics", topicName: "Advanced Ballistics", averageScore: 72, attemptCount: 28, passRate: 82, trend: "stable" },
      { topicId: "fire-planning", topicName: "Fire Planning", averageScore: 78, attemptCount: 30, passRate: 90, trend: "up" },
      { topicId: "target-acquisition", topicName: "Target Acquisition", averageScore: 75, attemptCount: 26, passRate: 85, trend: "up" },
      { topicId: "survey", topicName: "Survey & Orientation", averageScore: 80, attemptCount: 32, passRate: 92, trend: "stable" },
      { topicId: "meteorology", topicName: "Meteorology", averageScore: 70, attemptCount: 24, passRate: 78, trend: "down" },
    ],
    trainees: [
      { traineeId: "LGSC-001", traineeName: "Capt. Mehta", topics: { "advanced-ballistics": 78, "fire-planning": 85, "target-acquisition": 80, "survey": 88, "meteorology": 72 }, overall: 81 },
      { traineeId: "LGSC-002", traineeName: "Capt. Joshi", topics: { "advanced-ballistics": 75, "fire-planning": 80, "target-acquisition": 78, "survey": 82, "meteorology": 68 }, overall: 77 },
      { traineeId: "LGSC-003", traineeName: "Capt. Nair", topics: { "advanced-ballistics": 70, "fire-planning": 75, "target-acquisition": 72, "survey": 78, "meteorology": 65 }, overall: 72 },
      { traineeId: "LGSC-004", traineeName: "Capt. Gupta", topics: { "advanced-ballistics": 82, "fire-planning": 88, "target-acquisition": 85, "survey": 90, "meteorology": 78 }, overall: 85 },
    ],
  },
  {
    courseId: "jco-cadre",
    courseName: "JCO Cadre Training",
    overallAverage: 68,
    passRate: 78,
    topics: [
      { topicId: "basic-gunnery", topicName: "Basic Gunnery", averageScore: 72, attemptCount: 60, passRate: 82, trend: "up" },
      { topicId: "gun-maintenance", topicName: "Gun Maintenance", averageScore: 75, attemptCount: 58, passRate: 85, trend: "stable" },
      { topicId: "ammunition", topicName: "Ammunition Handling", averageScore: 80, attemptCount: 62, passRate: 90, trend: "up" },
      { topicId: "safety-drills", topicName: "Safety Drills", averageScore: 82, attemptCount: 65, passRate: 92, trend: "stable" },
      { topicId: "crew-duties", topicName: "Crew Duties", averageScore: 68, attemptCount: 55, passRate: 75, trend: "down" },
      { topicId: "field-procedures", topicName: "Field Procedures", averageScore: 65, attemptCount: 52, passRate: 70, trend: "down" },
    ],
    trainees: [
      { traineeId: "JCO-001", traineeName: "Nb Sub Rawat", topics: { "basic-gunnery": 75, "gun-maintenance": 80, "ammunition": 85, "safety-drills": 88, "crew-duties": 72, "field-procedures": 70 }, overall: 78 },
      { traineeId: "JCO-002", traineeName: "Nb Sub Thapa", topics: { "basic-gunnery": 70, "gun-maintenance": 78, "ammunition": 82, "safety-drills": 85, "crew-duties": 68, "field-procedures": 65 }, overall: 75 },
      { traineeId: "JCO-003", traineeName: "Hav Yadav", topics: { "basic-gunnery": 68, "gun-maintenance": 72, "ammunition": 78, "safety-drills": 80, "crew-duties": 65, "field-procedures": 62 }, overall: 71 },
      { traineeId: "JCO-004", traineeName: "Hav Chauhan", topics: { "basic-gunnery": 78, "gun-maintenance": 82, "ammunition": 88, "safety-drills": 90, "crew-duties": 75, "field-procedures": 72 }, overall: 81 },
      { traineeId: "JCO-005", traineeName: "Nk Prasad", topics: { "basic-gunnery": 65, "gun-maintenance": 70, "ammunition": 75, "safety-drills": 78, "crew-duties": 60, "field-procedures": 58 }, overall: 68 },
    ],
  },
];

// Get color based on score
function getScoreColor(score: number): string {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-green-400";
  if (score >= 60) return "bg-yellow-400";
  if (score >= 50) return "bg-orange-400";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-green-400";
  if (score >= 60) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

// Topic Heatmap Cell
function HeatmapCell({ score, label }: { score: number; label?: string }) {
  return (
    <div
      className={cn(
        "relative w-full h-10 rounded flex items-center justify-center text-xs font-medium text-white transition-all hover:scale-105 cursor-pointer",
        getScoreColor(score)
      )}
      title={label ? `${label}: ${score}%` : `${score}%`}
    >
      {score}%
    </div>
  );
}

// Topic Performance Row
function TopicRow({ topic }: { topic: TopicPerformance }) {
  const trendIcon = topic.trend === "up" ? "↑" : topic.trend === "down" ? "↓" : "→";
  const trendColor = topic.trend === "up" ? "text-green-500" : topic.trend === "down" ? "text-red-500" : "text-gray-500";

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <div className="w-40 truncate text-sm">{topic.topicName}</div>
      <div className="flex-1">
        <div className="h-6 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", getScoreColor(topic.averageScore))}
            style={{ width: `${topic.averageScore}%` }}
          />
        </div>
      </div>
      <div className={cn("w-12 text-right font-medium", getScoreTextColor(topic.averageScore))}>
        {topic.averageScore}%
      </div>
      <div className="w-16 text-right text-xs text-muted-foreground">
        {topic.attemptCount} attempts
      </div>
      <div className={cn("w-8 text-center", trendColor)}>{trendIcon}</div>
    </div>
  );
}

// Main Heatmap Component
export function PerformanceHeatmap() {
  const [selectedCourse, setSelectedCourse] = useState<string>(mockCourseData[0].courseId);
  const courseData = mockCourseData.find((c) => c.courseId === selectedCourse) || mockCourseData[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Course Performance Heatmap</CardTitle>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {mockCourseData.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="matrix">
          <TabsList className="mb-4">
            <TabsTrigger value="matrix">Trainee × Topic Matrix</TabsTrigger>
            <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
            <TabsTrigger value="trainees">Trainee Analysis</TabsTrigger>
          </TabsList>

          {/* Matrix View */}
          <TabsContent value="matrix">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 bg-muted/50 sticky left-0">Trainee</th>
                    {courseData.topics.map((topic) => (
                      <th
                        key={topic.topicId}
                        className="text-center py-2 px-1 bg-muted/50 min-w-[80px]"
                        title={topic.topicName}
                      >
                        <span className="block truncate max-w-[80px] text-xs">
                          {topic.topicName}
                        </span>
                      </th>
                    ))}
                    <th className="text-center py-2 px-2 bg-muted/50 min-w-[70px]">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.trainees.map((trainee) => (
                    <tr key={trainee.traineeId} className="border-b">
                      <td className="py-2 px-2 font-medium sticky left-0 bg-background">
                        <div className="truncate max-w-[120px]">{trainee.traineeName}</div>
                        <div className="text-xs text-muted-foreground">{trainee.traineeId}</div>
                      </td>
                      {courseData.topics.map((topic) => (
                        <td key={topic.topicId} className="py-1 px-1">
                          <HeatmapCell
                            score={trainee.topics[topic.topicId] || 0}
                            label={`${trainee.traineeName} - ${topic.topicName}`}
                          />
                        </td>
                      ))}
                      <td className="py-1 px-1">
                        <HeatmapCell score={trainee.overall} label={`${trainee.traineeName} - Overall`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="py-2 px-2 font-medium sticky left-0 bg-muted/30">Course Average</td>
                    {courseData.topics.map((topic) => (
                      <td key={topic.topicId} className="py-1 px-1">
                        <HeatmapCell score={topic.averageScore} label={`Avg - ${topic.topicName}`} />
                      </td>
                    ))}
                    <td className="py-1 px-1">
                      <HeatmapCell score={courseData.overallAverage} label="Course Average" />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <span className="text-muted-foreground">Performance Scale:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span>&lt;50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-orange-400"></div>
                <span>50-59%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-yellow-400"></div>
                <span>60-69%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-green-400"></div>
                <span>70-84%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span>≥85%</span>
              </div>
            </div>
          </TabsContent>

          {/* Topic Analysis View */}
          <TabsContent value="topics">
            <div className="space-y-1">
              <div className="flex items-center gap-3 py-2 text-xs text-muted-foreground font-medium">
                <div className="w-40">Topic</div>
                <div className="flex-1">Performance</div>
                <div className="w-12 text-right">Score</div>
                <div className="w-16 text-right">Attempts</div>
                <div className="w-8 text-center">Trend</div>
              </div>
              {courseData.topics.map((topic) => (
                <TopicRow key={topic.topicId} topic={topic} />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-500">{courseData.passRate}%</div>
                <div className="text-sm text-muted-foreground">Course Pass Rate</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">{courseData.overallAverage}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">{courseData.trainees.length}</div>
                <div className="text-sm text-muted-foreground">Active Trainees</div>
              </Card>
            </div>
          </TabsContent>

          {/* Trainee Analysis View */}
          <TabsContent value="trainees">
            <div className="space-y-3">
              {courseData.trainees
                .sort((a, b) => b.overall - a.overall)
                .map((trainee, index) => (
                  <div key={trainee.traineeId} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{trainee.traineeName}</div>
                      <div className="text-xs text-muted-foreground">{trainee.traineeId}</div>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", getScoreColor(trainee.overall))}
                          style={{ width: `${trainee.overall}%` }}
                        />
                      </div>
                    </div>
                    <div className={cn("text-lg font-bold w-16 text-right", getScoreTextColor(trainee.overall))}>
                      {trainee.overall}%
                    </div>
                    <Badge
                      variant={trainee.overall >= 70 ? "default" : "destructive"}
                      className="w-16 justify-center"
                    >
                      {trainee.overall >= 70 ? "PASS" : "AT RISK"}
                    </Badge>
                  </div>
                ))}
            </div>

            {/* Performance Distribution */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Score Distribution</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-3 bg-green-500/10 rounded">
                  <div className="text-lg font-bold text-green-500">
                    {courseData.trainees.filter((t) => t.overall >= 85).length}
                  </div>
                  <div className="text-muted-foreground">Excellent (≥85%)</div>
                </div>
                <div className="p-3 bg-green-400/10 rounded">
                  <div className="text-lg font-bold text-green-400">
                    {courseData.trainees.filter((t) => t.overall >= 70 && t.overall < 85).length}
                  </div>
                  <div className="text-muted-foreground">Good (70-84%)</div>
                </div>
                <div className="p-3 bg-yellow-400/10 rounded">
                  <div className="text-lg font-bold text-yellow-500">
                    {courseData.trainees.filter((t) => t.overall >= 60 && t.overall < 70).length}
                  </div>
                  <div className="text-muted-foreground">Average (60-69%)</div>
                </div>
                <div className="p-3 bg-orange-400/10 rounded">
                  <div className="text-lg font-bold text-orange-500">
                    {courseData.trainees.filter((t) => t.overall >= 50 && t.overall < 60).length}
                  </div>
                  <div className="text-muted-foreground">Below Avg (50-59%)</div>
                </div>
                <div className="p-3 bg-red-500/10 rounded">
                  <div className="text-lg font-bold text-red-500">
                    {courseData.trainees.filter((t) => t.overall < 50).length}
                  </div>
                  <div className="text-muted-foreground">At Risk (&lt;50%)</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Compact heatmap for dashboard use
export function CompactPerformanceHeatmap({ courseId }: { courseId?: string }) {
  const courseData = courseId
    ? mockCourseData.find((c) => c.courseId === courseId) || mockCourseData[0]
    : mockCourseData[0];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{courseData.courseName} - Topic Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {courseData.topics.slice(0, 6).map((topic) => (
            <div
              key={topic.topicId}
              className={cn(
                "p-2 rounded text-center text-white text-xs",
                getScoreColor(topic.averageScore)
              )}
              title={`${topic.topicName}: ${topic.averageScore}%`}
            >
              <div className="font-medium truncate">{topic.topicName}</div>
              <div className="text-lg font-bold">{topic.averageScore}%</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Course Avg: {courseData.overallAverage}%</span>
          <span>Pass Rate: {courseData.passRate}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
