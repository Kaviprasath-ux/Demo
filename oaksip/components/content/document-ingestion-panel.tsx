"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  Check,
  AlertTriangle,
  Clock,
  Loader2,
  Eye,
  Trash2,
  RefreshCw,
  Tag,
  BookOpen,
  Target,
  ChevronRight,
  FolderOpen,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mockIngestedDocuments,
  mockIngestionJobs,
  type IngestedDocument,
  type IngestionJob,
  getIngestionStatusColor,
  getClassificationColor,
} from "@/lib/document-ingestion";
import { cn } from "@/lib/utils";

// Upload Drop Zone
function UploadDropZone({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onUpload(files);
    },
    [onUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(Array.from(e.target.files));
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="font-medium mb-2">Upload Documents</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop files here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Supported: PDF, DOCX, TXT, HTML, Markdown
      </p>
      <label>
        <input
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.docx,.doc,.txt,.html,.md"
          onChange={handleFileSelect}
        />
        <Button variant="outline" asChild>
          <span>Browse Files</span>
        </Button>
      </label>
    </div>
  );
}

// Ingestion Job Card
function IngestionJobCard({ job }: { job: IngestionJob }) {
  const completedSteps = job.steps.filter((s) => s.status === "completed").length;
  const totalSteps = job.steps.length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{job.filename}</h4>
            <p className="text-xs text-muted-foreground">
              {job.currentStep} • {completedSteps}/{totalSteps} steps
            </p>
          </div>
          <Badge className={cn(getIngestionStatusColor(job.status))}>
            {job.status.toUpperCase()}
          </Badge>
        </div>

        <Progress value={job.progress} className="h-2 mb-3" />

        <div className="grid grid-cols-7 gap-1">
          {job.steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full",
                step.status === "completed" && "bg-green-500",
                step.status === "running" && "bg-blue-500 animate-pulse",
                step.status === "pending" && "bg-muted",
                step.status === "failed" && "bg-red-500"
              )}
              title={step.name}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Document List Item
function DocumentListItem({
  doc,
  onView,
}: {
  doc: IngestedDocument;
  onView: () => void;
}) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all"
      onClick={onView}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{doc.filename}</h4>
              <Badge className={cn("text-[10px]", getIngestionStatusColor(doc.status))}>
                {doc.status === "review_required" ? "REVIEW" : doc.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs mb-2">
              <Badge className={cn("text-[10px]", getClassificationColor(doc.classification))}>
                {doc.classification.replace("_", " ").toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">{doc.documentType.toUpperCase()}</span>
              {doc.metadata.pageCount && (
                <span className="text-muted-foreground">{doc.metadata.pageCount} pages</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {doc.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {doc.tags.length > 4 && (
                <Badge variant="outline" className="text-[10px]">
                  +{doc.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Document Detail View
function DocumentDetailView({
  doc,
}: {
  doc: IngestedDocument;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={cn(getIngestionStatusColor(doc.status))}>
            {doc.status.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge className={cn(getClassificationColor(doc.classification))}>
            {doc.classification.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge variant="outline">{doc.documentType.toUpperCase()}</Badge>
        </div>
        <h3 className="font-semibold text-lg">{doc.metadata.title || doc.filename}</h3>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {doc.metadata.author && (
          <div>
            <p className="text-muted-foreground">Author</p>
            <p className="font-medium">{doc.metadata.author}</p>
          </div>
        )}
        {doc.metadata.pageCount && (
          <div>
            <p className="text-muted-foreground">Pages</p>
            <p className="font-medium">{doc.metadata.pageCount}</p>
          </div>
        )}
        {doc.metadata.wordCount && (
          <div>
            <p className="text-muted-foreground">Words</p>
            <p className="font-medium">{doc.metadata.wordCount.toLocaleString()}</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground">Uploaded</p>
          <p className="font-medium">
            {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Associations */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Course Associations</p>
        <div className="flex flex-wrap gap-1">
          {doc.courseAssociations.map((course) => (
            <Badge key={course} variant="outline">
              <BookOpen className="h-3 w-3 mr-1" />
              {course}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Weapon Systems</p>
        <div className="flex flex-wrap gap-1">
          {doc.weaponSystems.map((ws) => (
            <Badge key={ws} variant="outline">
              <Target className="h-3 w-3 mr-1" />
              {ws}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Tags</p>
        <div className="flex flex-wrap gap-1">
          {doc.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sections */}
      {doc.sections.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Extracted Sections</p>
          <ScrollArea className="h-[200px] border rounded-lg p-2">
            <div className="space-y-2">
              {doc.sections.map((section) => (
                <div key={section.id} className="p-2 bg-muted/30 rounded text-sm">
                  <p className="font-medium">{section.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {section.content}
                  </p>
                  {section.entities.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {section.entities.map((entity, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">
                          {entity.type}: {entity.value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Warnings/Errors */}
      {doc.warnings && doc.warnings.length > 0 && (
        <div className="p-3 bg-yellow-500/10 rounded-lg">
          <p className="font-medium text-yellow-600 text-sm flex items-center gap-1 mb-2">
            <AlertTriangle className="h-4 w-4" />
            Warnings
          </p>
          <ul className="text-xs space-y-1">
            {doc.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Approval */}
      {doc.approvedBy && (
        <div className="p-3 bg-green-500/10 rounded-lg">
          <p className="font-medium text-green-600 text-sm flex items-center gap-1">
            <Check className="h-4 w-4" />
            Approved by {doc.approvedBy}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(doc.approvedAt!).toLocaleString("en-IN")}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {doc.status === "review_required" && (
          <Button className="flex-1">
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
        )}
        <Button variant="outline" className="flex-1">
          <Eye className="h-4 w-4 mr-1" />
          View Content
        </Button>
        <Button variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Main Panel
export function DocumentIngestionPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<IngestedDocument | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const handleUpload = (files: File[]) => {
    setUploadingFiles(files);
    // Mock upload - in production would actually upload
    setTimeout(() => {
      setUploadingFiles([]);
    }, 3000);
  };

  const filteredDocs = mockIngestedDocuments.filter(
    (doc) =>
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.classification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Document Ingestion Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({mockIngestionJobs.length})
            </TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({mockIngestedDocuments.length})
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-4">
            <UploadDropZone onUpload={handleUpload} />

            {uploadingFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadingFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">Uploading...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Ingestion Pipeline Steps</h4>
              <div className="grid grid-cols-7 gap-2 text-xs text-center">
                {["Upload", "Extract", "Sections", "Entities", "Classify", "Keywords", "Review"].map(
                  (step, i) => (
                    <div key={i} className="p-2 bg-background rounded">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary mx-auto mb-1 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <p>{step}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </TabsContent>

          {/* Processing Tab */}
          <TabsContent value="processing" className="mt-4">
            {mockIngestionJobs.length > 0 ? (
              <div className="space-y-3">
                {mockIngestionJobs.map((job) => (
                  <IngestionJobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No documents currently processing</p>
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredDocs.map((doc) => (
                  <DocumentListItem
                    key={doc.id}
                    doc={doc}
                    onView={() => setSelectedDoc(doc)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Document Detail Dialog */}
        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>
            {selectedDoc && (
              <DocumentDetailView doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
