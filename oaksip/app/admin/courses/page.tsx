"use client";

import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/lib/taxonomy";

export default function CoursesPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const toggleExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const totalModules = courses.reduce((sum, c) => sum + c.modules.length, 0);
  const totalWeeks = courses.reduce(
    (sum, c) => sum + c.modules.reduce((mSum, m) => mSum + m.weeks, 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Course Management
          </h1>
          <Badge variant="secondary">{courses.length} Courses</Badge>
        </div>
        <p className="text-muted-foreground">
          Manage training courses and curriculum for School of Artillery.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold text-foreground">{courses.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Modules</p>
                <p className="text-3xl font-bold text-foreground">{totalModules}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                <p className="text-3xl font-bold text-foreground">{totalWeeks} weeks</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Trainees</p>
                <p className="text-3xl font-bold text-foreground">142</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Training Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              {/* Course Header */}
              <button
                onClick={() => toggleExpand(course.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{course.name}</h3>
                      <Badge variant="outline">{course.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{course.modules.length} modules</p>
                    <p className="text-xs text-muted-foreground">
                      {course.modules.reduce((sum, m) => sum + m.weeks, 0)} weeks total
                    </p>
                  </div>
                  {expandedCourse === course.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedCourse === course.id && (
                <div className="border-t border-border/50 p-4 bg-muted/30 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{course.description}</p>

                  {/* Eligibility */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Eligibility</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.eligibility.map((e, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Modules */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Course Modules</h4>
                    <div className="space-y-3">
                      {course.modules.map((module, idx) => (
                        <div
                          key={module.id}
                          className="p-3 bg-background rounded-lg border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Module {idx + 1}
                              </span>
                              <h5 className="font-medium text-sm">{module.name}</h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  module.assessmentType === "both"
                                    ? "default"
                                    : module.assessmentType === "practical"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-[10px]"
                              >
                                {module.assessmentType}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {module.weeks} weeks
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {module.topics.map((topic, tIdx) => (
                              <Badge
                                key={tIdx}
                                variant="outline"
                                className="text-[10px]"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
