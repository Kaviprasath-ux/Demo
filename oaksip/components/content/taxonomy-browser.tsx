"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Shield,
  Target,
  Layers,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Filter,
} from "lucide-react";
import {
  courses,
  securityLevels,
  weaponSystemTags,
  contentCategories,
  topicHierarchy,
  difficultyLevels,
  getTopicsByParent,
  type SecurityLevel,
  type DifficultyLevel,
  type ContentTaxonomy,
} from "@/lib/taxonomy";

// Security level badge colors
const securityColors: Record<SecurityLevel, string> = {
  unclassified: "bg-green-500/10 text-green-700 border-green-500/30",
  restricted: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  confidential: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
  secret: "bg-orange-500/10 text-orange-700 border-orange-500/30",
  "top-secret": "bg-red-500/10 text-red-700 border-red-500/30",
};

// Difficulty badge colors
const difficultyColors: Record<DifficultyLevel, string> = {
  basic: "bg-green-500/10 text-green-700 border-green-500/30",
  intermediate: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  advanced: "bg-orange-500/10 text-orange-700 border-orange-500/30",
  expert: "bg-red-500/10 text-red-700 border-red-500/30",
};

interface TaxonomySelectorProps {
  value: Partial<ContentTaxonomy>;
  onChange: (value: Partial<ContentTaxonomy>) => void;
}

export function TaxonomySelector({
  value,
  onChange,
}: TaxonomySelectorProps) {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleSelection = (
    field: keyof ContentTaxonomy,
    item: string,
    multi: boolean = true
  ) => {
    if (multi) {
      const current = (value[field] as string[]) || [];
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      onChange({ ...value, [field]: updated });
    } else {
      onChange({ ...value, [field]: item });
    }
  };

  const isSelected = (field: keyof ContentTaxonomy, item: string): boolean => {
    const fieldValue = value[field];
    if (Array.isArray(fieldValue)) {
      return (fieldValue as string[]).includes(item);
    }
    return fieldValue === item;
  };

  const clearField = (field: keyof ContentTaxonomy) => {
    const newValue = { ...value };
    delete newValue[field];
    onChange(newValue);
  };

  return (
    <Tabs defaultValue="category" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="category" className="text-xs">
          <Layers className="h-3 w-3 mr-1" />
          Type
        </TabsTrigger>
        <TabsTrigger value="courses" className="text-xs">
          <GraduationCap className="h-3 w-3 mr-1" />
          Course
        </TabsTrigger>
        <TabsTrigger value="security" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Security
        </TabsTrigger>
        <TabsTrigger value="weapons" className="text-xs">
          <Target className="h-3 w-3 mr-1" />
          Weapon
        </TabsTrigger>
        <TabsTrigger value="topics" className="text-xs">
          <BookOpen className="h-3 w-3 mr-1" />
          Topic
        </TabsTrigger>
      </TabsList>

      {/* Content Category */}
      <TabsContent value="category" className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Content Category
            </label>
            {value.category && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => clearField("category")}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(contentCategories).map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleSelection("category", cat.id, false)}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  isSelected("category", cat.id)
                    ? "bg-primary/10 border-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected("category", cat.id) && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                  <span className="text-xs font-medium">{cat.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Courses */}
      <TabsContent value="courses" className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Applicable Courses
            </label>
            {value.courses && value.courses.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => clearField("courses")}
              >
                <X className="h-3 w-3 mr-1" />
                Clear ({value.courses.length})
              </Button>
            )}
          </div>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-4">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => toggleSelection("courses", course.code)}
                  className={`w-full p-2 rounded-lg border text-left transition-colors ${
                    isSelected("courses", course.code)
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isSelected("courses", course.code) && (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                      <span className="text-xs font-medium">{course.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {course.duration}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {course.fullName}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>

      {/* Security */}
      <TabsContent value="security" className="mt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Security Classification
            </label>
            <div className="space-y-1">
              {Object.values(securityLevels).map((sec) => (
                <button
                  key={sec.level}
                  onClick={() => toggleSelection("security", sec.level, false)}
                  className={`w-full p-2 rounded-lg border text-left transition-colors ${
                    isSelected("security", sec.level)
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isSelected("security", sec.level) && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${securityColors[sec.level]}`}
                    >
                      {sec.label}
                    </Badge>
                    <span className="text-xs">{sec.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(difficultyLevels).map((diff) => (
                <button
                  key={diff.level}
                  onClick={() => toggleSelection("difficulty", diff.level, false)}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    isSelected("difficulty", diff.level)
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isSelected("difficulty", diff.level) && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${difficultyColors[diff.level]}`}
                    >
                      {diff.name}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Weapon Systems */}
      <TabsContent value="weapons" className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Weapon Systems
            </label>
            {value.weaponSystems && value.weaponSystems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => clearField("weaponSystems")}
              >
                <X className="h-3 w-3 mr-1" />
                Clear ({value.weaponSystems.length})
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(weaponSystemTags).map((ws) => (
              <button
                key={ws.tag}
                onClick={() => toggleSelection("weaponSystems", ws.tag)}
                className={`p-2 rounded-lg border text-left transition-colors ${
                  isSelected("weaponSystems", ws.tag)
                    ? "bg-primary/10 border-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected("weaponSystems", ws.tag) && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                  <span className="text-xs font-medium">{ws.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {ws.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Topics */}
      <TabsContent value="topics" className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Topics
            </label>
            {value.topics && value.topics.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => clearField("topics")}
              >
                <X className="h-3 w-3 mr-1" />
                Clear ({value.topics.length})
              </Button>
            )}
          </div>
          <ScrollArea className="h-[200px]">
            <div className="space-y-1 pr-4">
              {getTopicsByParent().map((topic) => {
                const children = getTopicsByParent(topic.id);
                const isExpanded = expandedTopics.includes(topic.id);

                return (
                  <div key={topic.id}>
                    <button
                      onClick={() => {
                        if (children.length > 0) {
                          toggleTopic(topic.id);
                        } else {
                          toggleSelection("topics", topic.id);
                        }
                      }}
                      className={`w-full p-2 rounded-lg border text-left transition-colors ${
                        isSelected("topics", topic.id)
                          ? "bg-primary/10 border-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {children.length > 0 && (
                          isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )
                        )}
                        {isSelected("topics", topic.id) && (
                          <Check className="h-3 w-3 text-primary" />
                        )}
                        <span className="text-xs font-medium">{topic.name}</span>
                      </div>
                    </button>

                    {/* Children */}
                    {isExpanded && children.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => toggleSelection("topics", child.id)}
                            className={`w-full p-2 rounded-lg border text-left transition-colors ${
                              isSelected("topics", child.id)
                                ? "bg-primary/10 border-primary"
                                : "border-border hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected("topics", child.id) && (
                                <Check className="h-3 w-3 text-primary" />
                              )}
                              <span className="text-xs">{child.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Summary display of selected taxonomy
export function TaxonomySummary({ taxonomy }: { taxonomy: Partial<ContentTaxonomy> }) {
  const hasFilters =
    taxonomy.category ||
    (taxonomy.courses && taxonomy.courses.length > 0) ||
    taxonomy.security ||
    (taxonomy.weaponSystems && taxonomy.weaponSystems.length > 0) ||
    (taxonomy.topics && taxonomy.topics.length > 0) ||
    taxonomy.difficulty;

  if (!hasFilters) {
    return (
      <div className="text-xs text-muted-foreground italic">
        No taxonomy filters applied
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {taxonomy.category && (
        <Badge variant="outline" className="text-[10px]">
          {contentCategories[taxonomy.category]?.name}
        </Badge>
      )}
      {taxonomy.courses?.map((c) => (
        <Badge key={c} variant="secondary" className="text-[10px]">
          {courses.find((course) => course.code === c)?.name || c}
        </Badge>
      ))}
      {taxonomy.security && (
        <Badge
          variant="outline"
          className={`text-[10px] ${securityColors[taxonomy.security]}`}
        >
          {securityLevels[taxonomy.security]?.label}
        </Badge>
      )}
      {taxonomy.weaponSystems?.map((ws) => (
        <Badge key={ws} variant="outline" className="text-[10px]">
          {weaponSystemTags[ws]?.name}
        </Badge>
      ))}
      {taxonomy.topics?.map((t) => (
        <Badge key={t} variant="secondary" className="text-[10px]">
          {topicHierarchy.find((topic) => topic.id === t)?.name || t}
        </Badge>
      ))}
      {taxonomy.difficulty && (
        <Badge
          variant="outline"
          className={`text-[10px] ${difficultyColors[taxonomy.difficulty]}`}
        >
          {difficultyLevels[taxonomy.difficulty]?.name}
        </Badge>
      )}
    </div>
  );
}

// Full taxonomy browser card
export function TaxonomyBrowser() {
  const [filters, setFilters] = useState<Partial<ContentTaxonomy>>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Content Taxonomy Browser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaxonomySelector value={filters} onChange={setFilters} />

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Active Filters
            </span>
            {Object.keys(filters).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setFilters({})}
              >
                Clear All
              </Button>
            )}
          </div>
          <TaxonomySummary taxonomy={filters} />
        </div>
      </CardContent>
    </Card>
  );
}
