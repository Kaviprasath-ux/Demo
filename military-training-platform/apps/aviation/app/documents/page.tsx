"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Tag,
  Plane,
  Shield,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@military/ui";
import {
  mockIngestedDocuments,
  getIngestionStatusColor,
  getClassificationColor,
  type IngestedDocument,
} from "@/lib/document-ingestion";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassification, setSelectedClassification] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<IngestedDocument | null>(null);

  // Filter documents
  const filteredDocuments = mockIngestedDocuments.filter((doc) => {
    const matchesSearch =
      doc.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClassification =
      selectedClassification === "all" || doc.classification === selectedClassification;

    const matchesPlatform =
      selectedPlatform === "all" ||
      doc.helicopterPlatforms.some((p) => p.toLowerCase().includes(selectedPlatform.toLowerCase()));

    return matchesSearch && matchesClassification && matchesPlatform;
  });

  const classifications = [
    { id: "all", label: "All Types" },
    { id: "flight_manual", label: "Flight Manuals" },
    { id: "sop", label: "SOPs" },
    { id: "doctrine", label: "Doctrine" },
    { id: "technical", label: "Technical" },
    { id: "training", label: "Training" },
    { id: "checklist", label: "Checklists" },
    { id: "weapons_employment", label: "Weapons" },
    { id: "emergency_procedures", label: "Emergency" },
  ];

  const platforms = [
    { id: "all", label: "All Platforms" },
    { id: "dhruv", label: "ALH Dhruv" },
    { id: "rudra", label: "HAL Rudra" },
    { id: "prachand", label: "LCH Prachand" },
    { id: "apache", label: "Apache AH-64E" },
    { id: "chetak", label: "Chetak" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-emerald-500 animate-spin" />;
      case "review_required":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Document Library
          </h1>
          <p className="text-muted-foreground">
            Browse and access training documents, manuals, and SOPs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 bg-card border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Classification Filter */}
        <select
          className="px-3 py-2 bg-card border rounded-lg min-w-[150px]"
          value={selectedClassification}
          onChange={(e) => setSelectedClassification(e.target.value)}
        >
          {classifications.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Platform Filter */}
        <select
          className="px-3 py-2 bg-card border rounded-lg min-w-[150px]"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Total Documents</p>
          <p className="text-2xl font-bold">{mockIngestedDocuments.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-500">
            {mockIngestedDocuments.filter((d) => d.status === "completed" && d.approvedBy).length}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-500">
            {mockIngestedDocuments.filter((d) => d.status === "review_required").length}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Processing</p>
          <p className="text-2xl font-bold text-emerald-500">
            {mockIngestedDocuments.filter((d) => d.status === "processing").length}
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-card p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${getClassificationColor(doc.classification)}`}>
                <FileText className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{doc.metadata.title}</h3>
                  {getStatusIcon(doc.status)}
                </div>
                <p className="text-sm text-muted-foreground">{doc.filename}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Classification badge */}
                  <span className={`px-2 py-0.5 rounded text-xs text-white ${getClassificationColor(doc.classification)}`}>
                    {doc.classification.replace(/_/g, " ")}
                  </span>

                  {/* Platforms */}
                  {doc.helicopterPlatforms.slice(0, 2).map((platform) => (
                    <span key={platform} className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">
                      {platform}
                    </span>
                  ))}

                  {/* Tags */}
                  {doc.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right text-sm text-muted-foreground">
                <p>{doc.metadata.pageCount} pages</p>
                <p>{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                {doc.approvedBy && (
                  <p className="text-green-500 text-xs mt-1">
                    Approved by {doc.approvedBy}
                  </p>
                )}
              </div>

              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedDocument.metadata.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)}>
                ×
              </Button>
            </div>

            <div className="p-6 space-y-4">
              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Filename</p>
                  <p className="font-medium">{selectedDocument.filename}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classification</p>
                  <span className={`px-2 py-0.5 rounded text-xs text-white ${getClassificationColor(selectedDocument.classification)}`}>
                    {selectedDocument.classification.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-medium">{selectedDocument.metadata.pageCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Word Count</p>
                  <p className="font-medium">{selectedDocument.metadata.wordCount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded By</p>
                  <p className="font-medium">{selectedDocument.uploadedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upload Date</p>
                  <p className="font-medium">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Applicable Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.helicopterPlatforms.map((platform) => (
                    <span key={platform} className="px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-400">
                      <Plane className="h-3 w-3 inline mr-1" />
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-sm bg-muted">
                      <Tag className="h-3 w-3 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Course Associations */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Course Associations</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.courseAssociations.map((course) => (
                    <span key={course} className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                      <BookOpen className="h-3 w-3 inline mr-1" />
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Approval Status */}
              {selectedDocument.approvedBy && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-500">Approved</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Approved by {selectedDocument.approvedBy} on{" "}
                    {selectedDocument.approvedAt && new Date(selectedDocument.approvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Warnings */}
              {selectedDocument.warnings && selectedDocument.warnings.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium text-yellow-500">Warnings</span>
                  </div>
                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                    {selectedDocument.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                Close
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
