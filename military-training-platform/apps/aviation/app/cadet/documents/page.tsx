"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Circle,
  BookOpen,
  Shield,
  ListChecks,
  FileVideo,
  MousePointer,
} from "lucide-react";
import { useCadetStore } from "@/lib/stores/cadet-store";

export default function DocumentsPage() {
  const { documents, markDocumentRead } = useCadetStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && doc.isRead) ||
      (readFilter === "unread" && !doc.isRead);
    return matchesSearch && matchesCategory && matchesRead;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "manual":
        return BookOpen;
      case "procedure":
        return FileText;
      case "reference":
        return FileText;
      case "safety":
        return Shield;
      case "checklist":
        return ListChecks;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      manual: "bg-primary/20 text-primary",
      procedure: "bg-primary/20 text-primary",
      reference: "bg-primary/20 text-primary",
      safety: "bg-red-500/20 text-red-400",
      checklist: "bg-primary/20 text-primary",
    };
    return colors[category] || "bg-gray-500/20 text-muted-foreground";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return FileVideo;
      case "interactive":
        return MousePointer;
      default:
        return FileText;
    }
  };

  const requiredDocs = documents.filter((d) => d.isRequired);
  const readRequiredDocs = requiredDocs.filter((d) => d.isRead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Training Documents
        </h1>
        <p className="text-muted-foreground mt-1">
          Access manuals, procedures, and reference materials
        </p>
      </div>

      {/* Required Documents Progress */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-foreground font-medium">Required Documents Progress</span>
          <span className="text-primary">
            {readRequiredDocs.length}/{requiredDocs.length} read
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all"
            style={{
              width: `${(readRequiredDocs.length / requiredDocs.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Complete all required documents before field training
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="manual">Manuals</option>
          <option value="procedure">Procedures</option>
          <option value="reference">References</option>
          <option value="safety">Safety</option>
          <option value="checklist">Checklists</option>
        </select>
        <select
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => {
          const CategoryIcon = getCategoryIcon(doc.category);
          const TypeIcon = getTypeIcon(doc.type);

          return (
            <div
              key={doc.id}
              className={`bg-card border rounded-lg p-4 transition-colors ${
                doc.isRead ? "border-border" : "border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(
                    doc.category
                  )}`}
                >
                  <CategoryIcon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  {doc.isRequired && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                      Required
                    </span>
                  )}
                  {doc.isRead ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doc.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <TypeIcon className="w-4 h-4" />
                  <span className="capitalize">{doc.type}</span>
                </div>
                <span>{doc.fileSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Updated: {doc.lastUpdated}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markDocumentRead(doc.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No documents found</p>
        </div>
      )}
    </div>
  );
}
