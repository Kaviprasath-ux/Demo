"use client";

import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Eye,
  Edit2,
  Archive,
  CheckCircle,
  Target,
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockRubrics } from "@/lib/mock-data";
import { Rubric, RubricCriterion } from "@/types";
import { cn } from "@/lib/utils";

// Rubric criterion detail view
function CriterionCard({ criterion }: { criterion: RubricCriterion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border/50 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{criterion.name}</h4>
            <p className="text-xs text-muted-foreground">{criterion.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">Max: {criterion.maxScore}</Badge>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2 pl-11">
          <p className="text-xs font-medium text-muted-foreground mb-2">Scoring Levels:</p>
          {criterion.levels.map((level) => (
            <div
              key={level.score}
              className={cn(
                "flex items-start gap-3 p-2 rounded-lg",
                level.score >= 4 ? "bg-green-500/10" :
                level.score >= 3 ? "bg-yellow-500/10" :
                "bg-red-500/10"
              )}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: level.score }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      level.score >= 4 ? "text-green-500 fill-green-500" :
                      level.score >= 3 ? "text-yellow-500 fill-yellow-500" :
                      "text-red-500 fill-red-500"
                    )}
                  />
                ))}
              </div>
              <div>
                <span className="text-sm font-medium">{level.label}</span>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Rubric detail view
function RubricDetail({ rubric, onClose }: { rubric: Rubric; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{rubric.name}</h2>
          <p className="text-sm text-muted-foreground">{rubric.description}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Back to List
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{rubric.totalMaxScore}</div>
            <p className="text-xs text-muted-foreground">Total Max Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{rubric.passingScore}</div>
            <p className="text-xs text-muted-foreground">Passing Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{rubric.criteria.length}</div>
            <p className="text-xs text-muted-foreground">Criteria</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rubric.criteria.map((criterion) => (
            <CriterionCard key={criterion.id} criterion={criterion} />
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Category: <span className="text-foreground font-medium">{rubric.category}</span></span>
            <span className="text-muted-foreground">Status: <Badge variant={rubric.status === "active" ? "default" : "secondary"}>{rubric.status}</Badge></span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Created: {rubric.createdAt.toLocaleDateString()}</span>
            <span className="text-muted-foreground">Updated: {rubric.updatedAt.toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main rubric management page
export default function RubricsPage() {
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(mockRubrics.map(r => r.category)))];

  const filteredRubrics = mockRubrics.filter(
    r => filterCategory === "all" || r.category === filterCategory
  );

  const activeRubrics = mockRubrics.filter(r => r.status === "active").length;
  const totalCriteria = mockRubrics.reduce((sum, r) => sum + r.criteria.length, 0);

  if (selectedRubric) {
    return (
      <div className="space-y-6">
        <RubricDetail rubric={selectedRubric} onClose={() => setSelectedRubric(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            Rubric Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage evaluation rubrics for subjective assessments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Rubric
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockRubrics.length}</div>
                <p className="text-xs text-muted-foreground">Total Rubrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeRubrics}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Target className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCriteria}</div>
                <p className="text-xs text-muted-foreground">Total Criteria</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{categories.length - 1}</div>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filterCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(cat)}
          >
            {cat === "all" ? "All Categories" : cat}
          </Button>
        ))}
      </div>

      {/* Rubric List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredRubrics.map((rubric) => (
          <Card
            key={rubric.id}
            className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedRubric(rubric)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{rubric.name}</h3>
                    <Badge variant="outline" className="mt-1">{rubric.category}</Badge>
                  </div>
                </div>
                <Badge variant={rubric.status === "active" ? "default" : "secondary"}>
                  {rubric.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {rubric.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Criteria</span>
                  <span className="font-medium">{rubric.criteria.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Max Score</span>
                  <span className="font-medium">{rubric.totalMaxScore}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pass Mark</span>
                  <span className="font-medium text-green-500">{rubric.passingScore} ({Math.round(rubric.passingScore / rubric.totalMaxScore * 100)}%)</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); setSelectedRubric(rubric); }}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Archive className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
