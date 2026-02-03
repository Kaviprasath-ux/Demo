"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tags,
  Loader2,
  FileText,
  Crosshair,
  GraduationCap,
  BookOpen,
  X,
  Plus,
  Save,
  Sparkles,
} from "lucide-react";
import { useAI } from "@/lib/ai/use-ai";
import { ContentTag } from "@/lib/ai/types";

// Pre-defined tag options
const weaponSystemOptions = [
  "155mm Dhanush",
  "155mm Bofors FH-77B",
  "K9 Vajra",
  "ATAGS",
  "Pinaka MBRL",
  "130mm M-46",
  "105mm IFG",
  "105mm LFG",
];

const courseOptions = [
  { value: "YO", label: "Young Officers (YO)" },
  { value: "LGSC", label: "Long Gunnery Staff Course (LGSC)" },
  { value: "JCO", label: "JCO Technical Course" },
  { value: "OR_CADRE", label: "OR Upgrading Cadre" },
  { value: "STA", label: "STA Course" },
];

const topicOptions = [
  "Gunnery Theory",
  "Fire Control",
  "Gun Drill",
  "Safety Procedures",
  "Tactical Employment",
  "Survey & Positioning",
  "Ammunition Handling",
  "Equipment Maintenance",
];

const categoryOptions = [
  { value: "doctrine", label: "Doctrine" },
  { value: "sop", label: "SOP" },
  { value: "technical-manual", label: "Technical Manual" },
  { value: "firing-table", label: "Firing Table" },
  { value: "course-notes", label: "Course Notes" },
  { value: "reference", label: "Reference" },
];

interface SelectedTags {
  weaponSystems: string[];
  courses: string[];
  topics: string[];
  category: string;
}

export function ContentTagger() {
  const { analyzeContent, isLoading, error } = useAI();

  const [content, setContent] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({
    weaponSystems: [],
    courses: [],
    topics: [],
    category: "",
  });

  const [aiSuggestions, setAiSuggestions] = useState<ContentTag[]>([]);
  const [extractedTopics, setExtractedTopics] = useState<string[]>([]);
  const [summary, setSummary] = useState("");

  // Auto-analyze content with AI
  const handleAnalyze = async () => {
    if (content.trim().length < 50) {
      alert("Please enter at least 50 characters of content");
      return;
    }

    // Run all analyses in parallel
    const [tagResult, topicResult, summaryResult] = await Promise.all([
      analyzeContent({ content, analysisType: "tag-content" }),
      analyzeContent({ content, analysisType: "extract-topics" }),
      analyzeContent({ content, analysisType: "generate-summary" }),
    ]);

    if (tagResult?.tags) {
      setAiSuggestions(tagResult.tags);

      // Auto-apply high-confidence suggestions
      const highConfidenceTags = tagResult.tags.filter((t) => t.confidence > 0.8);

      setSelectedTags((prev) => ({
        ...prev,
        weaponSystems: [
          ...prev.weaponSystems,
          ...highConfidenceTags
            .filter((t) => t.category === "weapon-system")
            .map((t) => t.name)
            .filter((name) => !prev.weaponSystems.includes(name)),
        ],
        courses: [
          ...prev.courses,
          ...highConfidenceTags
            .filter((t) => t.category === "course")
            .map((t) => t.name)
            .filter((name) => !prev.courses.includes(name)),
        ],
        topics: [
          ...prev.topics,
          ...highConfidenceTags
            .filter((t) => t.category === "topic")
            .map((t) => t.name)
            .filter((name) => !prev.topics.includes(name)),
        ],
      }));
    }

    if (topicResult?.topics) {
      setExtractedTopics(topicResult.topics);
    }

    if (summaryResult?.summary) {
      setSummary(summaryResult.summary);
    }
  };

  // Tag management functions
  const addWeaponSystem = (system: string) => {
    if (!selectedTags.weaponSystems.includes(system)) {
      setSelectedTags((prev) => ({
        ...prev,
        weaponSystems: [...prev.weaponSystems, system],
      }));
    }
  };

  const removeWeaponSystem = (system: string) => {
    setSelectedTags((prev) => ({
      ...prev,
      weaponSystems: prev.weaponSystems.filter((s) => s !== system),
    }));
  };

  const addCourse = (course: string) => {
    if (!selectedTags.courses.includes(course)) {
      setSelectedTags((prev) => ({
        ...prev,
        courses: [...prev.courses, course],
      }));
    }
  };

  const removeCourse = (course: string) => {
    setSelectedTags((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c !== course),
    }));
  };

  const addTopic = (topic: string) => {
    if (!selectedTags.topics.includes(topic)) {
      setSelectedTags((prev) => ({
        ...prev,
        topics: [...prev.topics, topic],
      }));
    }
  };

  const removeTopic = (topic: string) => {
    setSelectedTags((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t !== topic),
    }));
  };

  const handleSave = async () => {
    if (!documentName.trim()) {
      alert("Please enter a document name");
      return;
    }

    if (content.trim().length < 50) {
      alert("Please enter content to save");
      return;
    }

    // Call the ingest API
    try {
      const response = await fetch("/api/ai/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          documentName,
          category: selectedTags.category || "reference",
          weaponSystems: selectedTags.weaponSystems,
          courseTypes: selectedTags.courses,
          topics: selectedTags.topics,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Document saved successfully with ${data.chunkCount} chunks!`);
        // Reset form
        setContent("");
        setDocumentName("");
        setSelectedTags({
          weaponSystems: [],
          courses: [],
          topics: [],
          category: "",
        });
        setAiSuggestions([]);
        setExtractedTopics([]);
        setSummary("");
      } else {
        alert(`Failed to save: ${data.error}`);
      }
    } catch {
      alert("Failed to save document");
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="docName">Document Name</Label>
            <input
              id="docName"
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., 155mm Dhanush Operating Manual"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste doctrinal content, manual excerpt, or training material here..."
              className="min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              {content.length} characters {content.length < 50 && "(need 50+)"}
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isLoading || content.length < 50}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-Analyze with AI
              </>
            )}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* AI Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((tag, index) => (
                <Badge
                  key={index}
                  variant={tag.confidence > 0.8 ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (tag.category === "weapon-system") addWeaponSystem(tag.name);
                    else if (tag.category === "course") addCourse(tag.name);
                    else if (tag.category === "topic") addTopic(tag.name);
                  }}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-70">
                    {Math.round(tag.confidence * 100)}%
                  </span>
                  <Plus className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tag Selection */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Document Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedTags.category}
              onValueChange={(v) => setSelectedTags((prev) => ({ ...prev, category: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Weapon Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Crosshair className="h-4 w-4" />
              Weapon Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedTags.weaponSystems.map((system) => (
                <Badge key={system} variant="secondary" className="gap-1">
                  {system}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeWeaponSystem(system)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={addWeaponSystem}>
              <SelectTrigger>
                <SelectValue placeholder="Add weapon system" />
              </SelectTrigger>
              <SelectContent>
                {weaponSystemOptions
                  .filter((ws) => !selectedTags.weaponSystems.includes(ws))
                  .map((ws) => (
                    <SelectItem key={ws} value={ws}>
                      {ws}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Course Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4" />
              Course Applicability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedTags.courses.map((course) => (
                <Badge key={course} variant="secondary" className="gap-1">
                  {course}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeCourse(course)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={addCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Add course type" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions
                  .filter((c) => !selectedTags.courses.includes(c.value))
                  .map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Tags className="h-4 w-4" />
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedTags.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="gap-1">
                  {topic}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTopic(topic)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={addTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Add topic" />
              </SelectTrigger>
              <SelectContent>
                {topicOptions
                  .filter((t) => !selectedTags.topics.includes(t))
                  .map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* AI Extracted Topics */}
            {extractedTopics.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">AI Extracted:</p>
                <div className="flex flex-wrap gap-1">
                  {extractedTopics
                    .filter((t) => !selectedTags.topics.includes(t))
                    .map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="cursor-pointer text-xs"
                        onClick={() => addTopic(topic)}
                      >
                        {topic}
                        <Plus className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={!documentName.trim() || content.length < 50}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save & Ingest Document
        </Button>
      </div>
    </div>
  );
}
