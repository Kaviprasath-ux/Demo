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
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Plus,
  FileText,
} from "lucide-react";
import { useAI } from "@/lib/ai/use-ai";
import { GeneratedQuestion, QuestionType } from "@/lib/ai/types";

const categories = [
  { value: "gunnery-theory", label: "Gunnery Theory" },
  { value: "safety-procedures", label: "Safety Procedures" },
  { value: "gun-drill", label: "Gun Drill" },
  { value: "tactical-employment", label: "Tactical Employment" },
  { value: "fire-control", label: "Fire Control" },
  { value: "ammunition", label: "Ammunition Handling" },
];

const difficulties = [
  { value: "basic", label: "Basic (YO/JCO)" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced (LGSC)" },
];

const weaponSystems = [
  { value: "", label: "Any Weapon System" },
  { value: "155mm Dhanush", label: "155mm Dhanush" },
  { value: "155mm Bofors", label: "155mm Bofors FH-77B" },
  { value: "K9 Vajra", label: "K9 Vajra" },
  { value: "ATAGS", label: "ATAGS" },
  { value: "Pinaka", label: "Pinaka MBRL" },
];

const questionTypeOptions: { value: QuestionType; label: string }[] = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "true-false", label: "True/False" },
  { value: "fill-blank", label: "Fill in the Blank" },
  { value: "short-answer", label: "Short Answer" },
  { value: "essay", label: "Essay/Tactical" },
];

export function AIQuestionGenerator() {
  const { generateQuestions, isLoading, error } = useAI();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("gunnery-theory");
  const [difficulty, setDifficulty] = useState<"basic" | "intermediate" | "advanced">("intermediate");
  const [weaponSystem, setWeaponSystem] = useState("");
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(["mcq"]);
  const [count, setCount] = useState(5);

  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    if (content.trim().length < 50) {
      alert("Please enter at least 50 characters of content");
      return;
    }

    const questions = await generateQuestions({
      content,
      category,
      difficulty,
      questionTypes,
      count,
      weaponSystem: weaponSystem || undefined,
    });

    setGeneratedQuestions(questions);
    setSelectedQuestions(new Set());
  };

  const toggleQuestionType = (type: QuestionType) => {
    setQuestionTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const toggleQuestionSelection = (index: number) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const copySelectedToClipboard = () => {
    const selected = generatedQuestions.filter((_, i) => selectedQuestions.has(i));
    const text = selected
      .map((q, i) => {
        let questionText = `${i + 1}. ${q.question}`;
        if (q.options) {
          questionText += "\n" + q.options.map((o, j) => `   ${String.fromCharCode(65 + j)}. ${o}`).join("\n");
        }
        questionText += `\n   Answer: ${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : q.correctAnswer}`;
        if (q.explanation) {
          questionText += `\n   Explanation: ${q.explanation}`;
        }
        return questionText;
      })
      .join("\n\n");

    navigator.clipboard.writeText(text);
    alert("Questions copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Question Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content Input */}
          <div className="space-y-2">
            <Label htmlFor="content">Source Content</Label>
            <Textarea
              id="content"
              placeholder="Paste doctrinal content, manual excerpt, or training material here... (minimum 50 characters)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              {content.length} characters {content.length < 50 && "(need 50+)"}
            </p>
          </div>

          {/* Configuration Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weapon System</Label>
              <Select value={weaponSystem} onValueChange={setWeaponSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {weaponSystems.map((w) => (
                    <SelectItem key={w.value} value={w.value}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Select value={count.toString()} onValueChange={(v) => setCount(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 10, 15, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question Types */}
          <div className="space-y-2">
            <Label>Question Types</Label>
            <div className="flex flex-wrap gap-2">
              {questionTypeOptions.map((type) => (
                <button
                  key={type.value}
                  onClick={() => toggleQuestionType(type.value)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    questionTypes.includes(type.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border hover:bg-muted/80"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || content.length < 50 || questionTypes.length === 0}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Questions
                </>
              )}
            </Button>

            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Questions ({generatedQuestions.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedQuestions.size > 0 && (
                <>
                  <Badge variant="secondary">{selectedQuestions.size} selected</Badge>
                  <Button variant="outline" size="sm" onClick={copySelectedToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Selected
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add to Question Bank
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedQuestions.has(index)
                      ? "bg-primary/5 border-primary"
                      : "bg-muted/30 border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleQuestionSelection(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-5 w-5 rounded border flex items-center justify-center ${
                      selectedQuestions.has(index)
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}>
                      {selectedQuestions.has(index) && (
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {question.type.replace("-", " ").toUpperCase()}
                        </Badge>
                        <Badge
                          variant={
                            question.difficulty === "basic"
                              ? "secondary"
                              : question.difficulty === "advanced"
                              ? "destructive"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {question.difficulty}
                        </Badge>
                        {question.weaponSystem && (
                          <Badge variant="outline" className="text-xs">
                            {question.weaponSystem}
                          </Badge>
                        )}
                      </div>

                      <p className="font-medium">{question.question}</p>

                      {question.options && (
                        <div className="space-y-1 pl-4">
                          {question.options.map((option, optIndex) => (
                            <p
                              key={optIndex}
                              className={`text-sm ${
                                option === question.correctAnswer
                                  ? "text-green-600 dark:text-green-400 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {option === question.correctAnswer && " ✓"}
                            </p>
                          ))}
                        </div>
                      )}

                      {!question.options && (
                        <div className="pl-4">
                          <p className="text-sm text-green-600 dark:text-green-400">
                            <span className="font-medium">Answer:</span>{" "}
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : question.correctAnswer}
                          </p>
                        </div>
                      )}

                      {question.explanation && (
                        <p className="text-sm text-muted-foreground pl-4 italic">
                          Explanation: {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Status Card */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>
              AI Engine: Running in mock mode. Connect Ollama (localhost:11434) for real AI generation.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
