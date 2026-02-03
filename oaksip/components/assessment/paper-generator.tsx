"use client";

import { useState } from "react";
import {
  FileText,
  Shield,
  Lock,
  Download,
  Eye,
  Printer,
  RefreshCw,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockPaperTemplates,
  generatePaperVariants,
  type PaperTemplate,
  type GeneratedPaper,
  getSecurityLevelColor,
  getPaperTypeColor,
} from "@/lib/secure-paper-generation";
import { cn } from "@/lib/utils";

// Template Card Component
function TemplateCard({
  template,
  onSelect,
  isSelected,
}: {
  template: PaperTemplate;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50",
        isSelected && "border-primary ring-1 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-medium text-sm truncate">{template.name}</h4>
              <Badge className={cn("text-[10px]", getSecurityLevelColor(template.securityLevel))}>
                <Lock className="h-2 w-2 mr-1" />
                {template.securityLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn("text-[10px]", getPaperTypeColor(template.paperType))}>
                {template.paperType.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">{template.course}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {template.totalMarks} marks
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {template.duration} min
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {template.passingPercentage}% pass
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {template.negativeMarking && (
                <Badge variant="outline" className="text-[10px] text-orange-500">
                  Negative Marking
                </Badge>
              )}
              {template.randomizeQuestions && (
                <Badge variant="outline" className="text-[10px]">
                  Randomized
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Generated Paper Preview
function PaperPreview({ paper }: { paper: GeneratedPaper }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <p className="text-xs text-muted-foreground mb-1">{paper.watermark}</p>
        <h2 className="text-xl font-bold">{paper.templateName}</h2>
        <div className="flex items-center justify-center gap-3 mt-2">
          <Badge className={cn(getPaperTypeColor(paper.metadata.paperType))}>
            {paper.metadata.paperType.toUpperCase()}
          </Badge>
          <Badge variant="outline">VARIANT {paper.variant}</Badge>
          <Badge variant="outline">{paper.metadata.course}</Badge>
        </div>
        <div className="mt-2 text-sm">
          <span>Total Marks: {paper.totalMarks}</span>
          <span className="mx-3">|</span>
          <span>Duration: {paper.duration} min</span>
        </div>
      </div>

      {/* Security Code */}
      <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
        <span className="text-sm font-medium">Security Code:</span>
        <code className="font-mono text-sm">{paper.securityCode}</code>
      </div>

      {/* Instructions */}
      <div>
        <h4 className="font-medium text-sm mb-2">General Instructions:</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          {paper.instructions.map((inst, i) => (
            <li key={i}>• {inst}</li>
          ))}
        </ul>
      </div>

      {/* Questions Preview */}
      <ScrollArea className="h-[300px] border rounded-lg p-4">
        <div className="space-y-4">
          {paper.questions.map((q, index) => (
            <div key={index} className="pb-4 border-b last:border-0">
              <div className="flex items-start gap-2">
                <span className="font-bold text-sm min-w-[30px]">Q{q.questionNumber}.</span>
                <div className="flex-1">
                  <p className="text-sm">{q.questionText}</p>
                  {q.options && (
                    <div className="mt-2 space-y-1">
                      {q.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2 text-sm">
                          <span className="font-medium">({opt.id})</span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {q.marks} marks
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {q.topic}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {q.difficulty}
                    </Badge>
                    {q.negativeMarks && (
                      <Badge variant="outline" className="text-[10px] text-orange-500">
                        -{q.negativeMarks} for wrong
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Answer Key View
function AnswerKeyView({ paper }: { paper: GeneratedPaper }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-red-500/10 rounded border border-red-500/30">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="font-medium text-red-500">CONFIDENTIAL - ANSWER KEY</span>
        </div>
        <Badge variant="outline">VARIANT {paper.variant}</Badge>
      </div>

      <div className="text-xs text-muted-foreground">
        Security Code: <code className="font-mono">{paper.answerKey.securityCode}</code>
      </div>

      <ScrollArea className="h-[400px] border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="text-left p-2 w-16">Q.No</th>
              <th className="text-left p-2">Answer</th>
              <th className="text-left p-2">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {paper.answerKey.answers.map((ans) => (
              <tr key={ans.questionNumber} className="border-b">
                <td className="p-2 font-medium">{ans.questionNumber}</td>
                <td className="p-2">
                  <Badge variant="outline" className="font-mono">
                    {ans.correctAnswer.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-2 text-xs text-muted-foreground">{ans.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}

// Main Paper Generator Component
export function PaperGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<PaperTemplate | null>(null);
  const [variantCount, setVariantCount] = useState("4");
  const [generatedPapers, setGeneratedPapers] = useState<GeneratedPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<GeneratedPaper | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const papers = generatePaperVariants(
        selectedTemplate,
        parseInt(variantCount),
        "Current User", // Would come from auth context
        {
          batch: "Batch 2026-A",
          examDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
          venue: "Examination Hall 1",
        }
      );
      setGeneratedPapers(papers);
      setSelectedPaper(papers[0]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Paper Generation
          </CardTitle>
          {selectedTemplate && (
            <div className="flex items-center gap-2">
              <Select value={variantCount} onValueChange={setVariantCount}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Variants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Variants</SelectItem>
                  <SelectItem value="4">4 Variants</SelectItem>
                  <SelectItem value="6">6 Variants</SelectItem>
                  <SelectItem value="8">8 Variants</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Papers
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="generated" disabled={generatedPapers.length === 0}>
              Generated ({generatedPapers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Template List */}
              <div>
                <h4 className="text-sm font-medium mb-3">Select Template</h4>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-2">
                    {mockPaperTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplate?.id === template.id}
                        onSelect={() => setSelectedTemplate(template)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Template Details */}
              <div>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Template Details</h4>
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{selectedTemplate.name}</h3>
                        <Badge className={cn(getSecurityLevelColor(selectedTemplate.securityLevel))}>
                          <Lock className="h-3 w-3 mr-1" />
                          {selectedTemplate.securityLevel.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Course</p>
                          <p className="font-medium">{selectedTemplate.course}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <Badge className={cn(getPaperTypeColor(selectedTemplate.paperType))}>
                            {selectedTemplate.paperType}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Marks</p>
                          <p className="font-medium">{selectedTemplate.totalMarks}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{selectedTemplate.duration} minutes</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Passing %</p>
                          <p className="font-medium">{selectedTemplate.passingPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Negative Marking</p>
                          <p className="font-medium">
                            {selectedTemplate.negativeMarking
                              ? `-${selectedTemplate.negativeMarkingRatio} per wrong`
                              : "No"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Sections</p>
                        <div className="space-y-2">
                          {selectedTemplate.sections.map((section) => (
                            <div
                              key={section.id}
                              className="p-2 bg-muted/50 rounded text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{section.name}</span>
                                <span>
                                  {section.questionCount} × {section.marksPerQuestion} marks
                                </span>
                              </div>
                              <div className="flex gap-1 mt-1">
                                {section.topics.map((topic) => (
                                  <Badge key={topic} variant="outline" className="text-[10px]">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p>Created by: {selectedTemplate.createdBy}</p>
                        {selectedTemplate.approvedBy && (
                          <p>Approved by: {selectedTemplate.approvedBy}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>Select a template to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generated" className="mt-4">
            {generatedPapers.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Variant Selector */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Paper Variants</h4>
                  <div className="space-y-2">
                    {generatedPapers.map((paper) => (
                      <div
                        key={paper.paperId}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50",
                          selectedPaper?.paperId === paper.paperId &&
                            "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedPaper(paper)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Variant {paper.variant}</span>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {paper.securityCode.slice(0, 4)}...
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {paper.questions.length} questions
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download All PDFs
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Printer className="h-4 w-4 mr-1" />
                      Print All
                    </Button>
                  </div>
                </div>

                {/* Paper Preview */}
                <div className="lg:col-span-2">
                  {selectedPaper && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">
                          Preview - Variant {selectedPaper.variant}
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant={showAnswerKey ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowAnswerKey(!showAnswerKey)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {showAnswerKey ? "Hide Key" : "Show Key"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>

                      {showAnswerKey ? (
                        <AnswerKeyView paper={selectedPaper} />
                      ) : (
                        <PaperPreview paper={selectedPaper} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
