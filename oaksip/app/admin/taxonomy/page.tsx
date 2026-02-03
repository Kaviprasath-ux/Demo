"use client";

import { useState } from "react";
import {
  BookOpen,
  Shield,
  Crosshair,
  FolderTree,
  ChevronDown,
  ChevronRight,
  FileText,
  Wrench,
  Table,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  Settings,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courses,
  securityLevels,
  weaponSystemTags,
  contentCategories,
  topicHierarchy,
  difficultyLevels,
  type SecurityLevel,
  type ContentCategory,
  type DifficultyLevel,
} from "@/lib/taxonomy";

const categoryIcons: Record<ContentCategory, React.ReactNode> = {
  doctrine: <BookOpen className="h-4 w-4" />,
  sop: <FileText className="h-4 w-4" />,
  technical: <Wrench className="h-4 w-4" />,
  reference: <Table className="h-4 w-4" />,
  training: <GraduationCap className="h-4 w-4" />,
  assessment: <ClipboardCheck className="h-4 w-4" />,
  safety: <AlertTriangle className="h-4 w-4" />,
  maintenance: <Settings className="h-4 w-4" />,
};

const securityColors: Record<SecurityLevel, string> = {
  unclassified: "bg-green-500/10 text-green-700 border-green-500/30",
  restricted: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  confidential: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
  secret: "bg-orange-500/10 text-orange-700 border-orange-500/30",
  "top-secret": "bg-red-500/10 text-red-700 border-red-500/30",
};

const difficultyColors: Record<DifficultyLevel, string> = {
  basic: "bg-green-500/10 text-green-700",
  intermediate: "bg-blue-500/10 text-blue-700",
  advanced: "bg-orange-500/10 text-orange-700",
  expert: "bg-red-500/10 text-red-700",
};

export default function TaxonomyPage() {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const rootTopics = topicHierarchy.filter((t) => !t.parentId);
  const getChildTopics = (parentId: string) =>
    topicHierarchy.filter((t) => t.parentId === parentId);

  const totalModules = courses.reduce((sum, c) => sum + c.modules.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Content Taxonomy
          </h1>
          <Badge variant="secondary">SOW Section 8.5</Badge>
        </div>
        <p className="text-muted-foreground">
          Comprehensive classification system for artillery training content per School of Artillery curriculum.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Courses</p>
              <p className="text-3xl font-bold text-foreground">{courses.length}</p>
              <p className="text-xs text-muted-foreground">{totalModules} modules</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <p className="text-3xl font-bold text-foreground">
                {Object.keys(contentCategories).length}
              </p>
              <p className="text-xs text-muted-foreground">content types</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Weapon Systems</p>
              <p className="text-3xl font-bold text-foreground">
                {Object.keys(weaponSystemTags).length}
              </p>
              <p className="text-xs text-muted-foreground">tags defined</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Topics</p>
              <p className="text-3xl font-bold text-foreground">{topicHierarchy.length}</p>
              <p className="text-xs text-muted-foreground">in hierarchy</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Security Levels</p>
              <p className="text-3xl font-bold text-foreground">
                {Object.keys(securityLevels).length}
              </p>
              <p className="text-xs text-muted-foreground">classifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taxonomy Tabs */}
      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="weapons">Weapons</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
        </TabsList>

        {/* Content Categories */}
        <TabsContent value="categories" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Content Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.values(contentCategories).map((category) => (
                  <div
                    key={category.id}
                    className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {categoryIcons[category.id]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {category.examples.map((example, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Levels */}
        <TabsContent value="security" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Classification Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(securityLevels).map((level, idx) => (
                  <div
                    key={level.level}
                    className={`p-4 border rounded-lg ${securityColors[level.level]}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50 font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            {level.label}
                          </h3>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {level.accessRequirement}
                      </Badge>
                    </div>
                    <p className="text-sm ml-11">{level.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weapon Systems */}
        <TabsContent value="weapons" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair className="h-5 w-5" />
                Weapon System Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(weaponSystemTags).map((weapon) => (
                  <div
                    key={weapon.tag}
                    className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Crosshair className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{weapon.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {weapon.description}
                    </p>
                    {weapon.relatedSystems.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Related:</p>
                        <div className="flex flex-wrap gap-1">
                          {weapon.relatedSystems.map((related) => (
                            <Badge key={related} variant="secondary" className="text-xs">
                              {weaponSystemTags[related]?.name || related}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topic Hierarchy */}
        <TabsContent value="topics" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Topic Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rootTopics.map((topic) => {
                  const children = getChildTopics(topic.id);
                  const hasChildren = children.length > 0;
                  const isExpanded = expandedTopics.has(topic.id);

                  return (
                    <div key={topic.id} className="border border-border/50 rounded-lg">
                      <button
                        onClick={() => hasChildren && toggleTopic(topic.id)}
                        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        disabled={!hasChildren}
                      >
                        <div className="flex items-center gap-2">
                          {hasChildren ? (
                            isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )
                          ) : (
                            <div className="w-4" />
                          )}
                          <span className="font-medium">{topic.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {children.length} subtopics
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          {topic.keywords.slice(0, 3).map((kw) => (
                            <Badge key={kw} variant="secondary" className="text-[10px]">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </button>

                      {isExpanded && children.length > 0 && (
                        <div className="border-t border-border/50 bg-muted/30 p-3 space-y-2">
                          {children.map((child) => (
                            <div
                              key={child.id}
                              className="ml-6 p-2 bg-background rounded border border-border/50"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{child.name}</span>
                                <div className="flex gap-1">
                                  {child.keywords.slice(0, 2).map((kw) => (
                                    <Badge key={kw} variant="outline" className="text-[10px]">
                                      {kw}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Difficulty Levels */}
        <TabsContent value="difficulty" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Difficulty Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.values(difficultyLevels).map((level) => (
                  <div
                    key={level.level}
                    className="p-4 border border-border/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={difficultyColors[level.level]}>
                        {level.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {level.description}
                    </p>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Applicable Courses:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {level.applicableCourses.map((courseCode) => {
                          const course = courses.find((c) => c.code === courseCode);
                          return (
                            <Badge key={courseCode} variant="outline" className="text-xs">
                              {course?.name || courseCode.toUpperCase()}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
