"use client";

import {
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataChart, SimpleBarChart } from "@/components/simulator/data-chart";
import { mockSimulatorStats, mockSimulatorExercises } from "@/lib/mock-data";
import { formatDateShort } from "@/lib/utils";

export default function SimulatorPage() {
  const stats = mockSimulatorStats;
  const exercises = mockSimulatorExercises;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Simulator Intelligence
        </h1>
        <p className="text-muted-foreground">
          Training analytics, performance metrics, and exercise insights from
          artillery simulator sessions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Exercises</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalExercises.toLocaleString()}
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
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.avgAccuracy}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Total Participants
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalParticipants.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Error Types</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.commonErrors.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exercises by Month */}
        <SimpleBarChart
          title="Exercises by Month"
          data={stats.exercisesByMonth.map((d) => ({
            label: d.month,
            value: d.count,
          }))}
          height={200}
        />

        {/* Accuracy Trend */}
        <DataChart
          title="Accuracy Trend (%)"
          data={stats.accuracyTrend.map((d) => ({
            label: d.date,
            value: d.accuracy,
          }))}
          maxValue={100}
          valueLabel="%"
          color="success"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Exercises */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Recent Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {exercise.name}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateShort(exercise.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {exercise.participants} participants
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {exercise.duration} min
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={exercise.avgAccuracy >= 80 ? "success" : "warning"}
                  >
                    {exercise.avgAccuracy}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Errors */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Common Training Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.commonErrors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-4"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-sm font-medium text-yellow-500">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{error}</p>
                    <p className="text-xs text-muted-foreground">
                      Identified in training analysis
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
