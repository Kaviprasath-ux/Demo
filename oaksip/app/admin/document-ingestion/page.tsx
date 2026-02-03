"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { DocumentIngestionPanel } from "@/components/content/document-ingestion-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  BookOpen,
  Tag,
} from "lucide-react";
import { mockIngestedDocuments, mockIngestionJobs } from "@/lib/document-ingestion";

export default function DocumentIngestionPage() {
  // Calculate stats
  const totalDocs = mockIngestedDocuments.length;
  const completedDocs = mockIngestedDocuments.filter((d) => d.status === "completed").length;
  const reviewRequired = mockIngestedDocuments.filter((d) => d.status === "review_required").length;
  const processing = mockIngestionJobs.length;

  // Calculate unique entities
  const allTags = new Set(mockIngestedDocuments.flatMap((d) => d.tags));
  const allWeaponSystems = new Set(mockIngestedDocuments.flatMap((d) => d.weaponSystems));
  const allCourses = new Set(mockIngestedDocuments.flatMap((d) => d.courseAssociations));

  return (
    <RouteGuard>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-6 w-6" />
            Document Ingestion
          </h1>
          <p className="text-muted-foreground">
            Upload, process, and manage doctrinal content for the knowledge base
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDocs}</p>
                  <p className="text-xs text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedDocs}</p>
                  <p className="text-xs text-muted-foreground">Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reviewRequired}</p>
                  <p className="text-xs text-muted-foreground">Review Required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Clock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{processing}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DocumentIngestionPanel />
          </div>

          <div className="space-y-4">
            {/* Knowledge Base Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Unique Tags
                    </span>
                    <Badge variant="outline">{allTags.size}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Weapon Systems
                    </span>
                    <Badge variant="outline">{allWeaponSystems.size}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Linked Courses
                    </span>
                    <Badge variant="outline">{allCourses.size}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Types */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: "Doctrine", count: mockIngestedDocuments.filter((d) => d.classification === "doctrine").length, color: "bg-purple-500" },
                    { label: "SOP", count: mockIngestedDocuments.filter((d) => d.classification === "sop").length, color: "bg-blue-500" },
                    { label: "Technical", count: mockIngestedDocuments.filter((d) => d.classification === "technical").length, color: "bg-orange-500" },
                    { label: "Firing Tables", count: mockIngestedDocuments.filter((d) => d.classification === "firing_table").length, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded", item.color)}></div>
                        {item.label}
                      </span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supported Formats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["PDF", "DOCX", "DOC", "TXT", "HTML", "MD", "XLSX"].map((format) => (
                    <Badge key={format} variant="outline">
                      .{format.toLowerCase()}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Documents are automatically parsed, sectioned, and indexed for the AI knowledge base.
                </p>
              </CardContent>
            </Card>

            {/* Processing Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Automatic text extraction from all formats</p>
                  <p>• Section and heading detection</p>
                  <p>• Named entity recognition (weapons, procedures)</p>
                  <p>• Auto-classification by content type</p>
                  <p>• Keyword extraction using TF-IDF</p>
                  <p>• Course and weapon system linking</p>
                  <p>• Quality review workflow</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
