"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Tag,
  FolderOpen,
  Trash2,
  Eye,
  RefreshCw,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "@military/ui";

// Document types
interface IngestedDocument {
  id: string;
  name: string;
  type: "pdf" | "docx" | "txt" | "markdown";
  size: number; // in bytes
  status: "pending" | "processing" | "completed" | "failed";
  uploadedAt: Date;
  processedAt?: Date;
  category: string;
  tags: string[];
  chunks: number;
  errorMessage?: string;
  metadata: {
    helicopterType?: string;
    missionType?: string;
    classification?: string;
    author?: string;
  };
}

// Mock documents
const mockDocuments: IngestedDocument[] = [
  {
    id: "doc-1",
    name: "CAS_Procedures_HAL_Rudra.pdf",
    type: "pdf",
    size: 2456789,
    status: "completed",
    uploadedAt: new Date("2024-01-10"),
    processedAt: new Date("2024-01-10"),
    category: "CAS Procedures",
    tags: ["Rudra", "CAS", "Air-Ground"],
    chunks: 45,
    metadata: {
      helicopterType: "Rudra",
      missionType: "CAS",
      classification: "Restricted",
      author: "Aviation Doctrine Cell",
    },
  },
  {
    id: "doc-2",
    name: "Fire_Adjustment_SOP.pdf",
    type: "pdf",
    size: 1234567,
    status: "completed",
    uploadedAt: new Date("2024-01-12"),
    processedAt: new Date("2024-01-12"),
    category: "SOPs",
    tags: ["Fire Adjustment", "Artillery", "Coordination"],
    chunks: 32,
    metadata: {
      missionType: "Fire Support",
      classification: "Confidential",
      author: "Joint Fire Support Cell",
    },
  },
  {
    id: "doc-3",
    name: "Apache_Weapons_Systems.pdf",
    type: "pdf",
    size: 3456789,
    status: "processing",
    uploadedAt: new Date("2024-01-15"),
    category: "Technical Manuals",
    tags: ["Apache", "Weapons", "Technical"],
    chunks: 0,
    metadata: {
      helicopterType: "Apache",
      classification: "Secret",
    },
  },
  {
    id: "doc-4",
    name: "Airspace_Coordination_Guide.docx",
    type: "docx",
    size: 567890,
    status: "failed",
    uploadedAt: new Date("2024-01-14"),
    category: "Coordination",
    tags: ["Airspace", "NFZ", "Coordination"],
    chunks: 0,
    errorMessage: "Failed to extract text from document",
    metadata: {
      classification: "Restricted",
    },
  },
  {
    id: "doc-5",
    name: "LCH_Prachand_Operations.pdf",
    type: "pdf",
    size: 2100000,
    status: "pending",
    uploadedAt: new Date("2024-01-16"),
    category: "Technical Manuals",
    tags: ["LCH", "Prachand", "Operations"],
    chunks: 0,
    metadata: {
      helicopterType: "LCH Prachand",
      classification: "Confidential",
    },
  },
];

const categories = [
  "All Categories",
  "CAS Procedures",
  "SOPs",
  "Technical Manuals",
  "Coordination",
  "Training Materials",
  "Doctrine",
];

export default function DocumentIngestionPage() {
  const [documents, setDocuments] = useState<IngestedDocument[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "All Categories" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: documents.length,
    completed: documents.filter((d) => d.status === "completed").length,
    processing: documents.filter((d) => d.status === "processing").length,
    failed: documents.filter((d) => d.status === "failed").length,
    totalChunks: documents.reduce((sum, d) => sum + d.chunks, 0),
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRetry = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, status: "processing" as const, errorMessage: undefined } : d
      )
    );
    // Simulate processing
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? { ...d, status: "completed" as const, processedAt: new Date(), chunks: 28 }
            : d
        )
      );
    }, 2000);
  };

  const handleDelete = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Document Ingestion</h1>
              <p className="text-sm text-muted-foreground">
                Manage knowledge base documents (SOW 6.1)
              </p>
            </div>
          </div>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Documents" value={stats.total} icon={FileText} />
          <StatCard
            label="Processed"
            value={stats.completed}
            icon={CheckCircle}
            color="text-primary"
          />
          <StatCard
            label="Processing"
            value={stats.processing}
            icon={Clock}
            color="text-primary"
          />
          <StatCard
            label="Failed"
            value={stats.failed}
            icon={XCircle}
            color="text-red-500"
          />
          <StatCard label="Total Chunks" value={stats.totalChunks} icon={FolderOpen} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {(["all", "completed", "processing", "failed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isExpanded={expandedId === doc.id}
              onToggle={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
              onRetry={() => handleRetry(doc.id)}
              onDelete={() => handleDelete(doc.id)}
              formatSize={formatSize}
            />
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents found matching your criteria.</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={(files) => {
              const newDocs: IngestedDocument[] = files.map((file, i) => ({
                id: `doc-new-${Date.now()}-${i}`,
                name: file.name,
                type: file.name.split(".").pop() as any,
                size: file.size,
                status: "pending" as const,
                uploadedAt: new Date(),
                category: "Uncategorized",
                tags: [],
                chunks: 0,
                metadata: {},
              }));
              setDocuments((prev) => [...newDocs, ...prev]);
              setShowUploadModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color} opacity-50`} />
      </div>
    </div>
  );
}

function DocumentCard({
  document: doc,
  isExpanded,
  onToggle,
  onRetry,
  onDelete,
  formatSize,
}: {
  document: IngestedDocument;
  isExpanded: boolean;
  onToggle: () => void;
  onRetry: () => void;
  onDelete: () => void;
  formatSize: (bytes: number) => string;
}) {
  const statusConfig = {
    pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
    processing: { icon: RefreshCw, color: "text-primary", bg: "bg-primary/20" },
    completed: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/20" },
    failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/20" },
  };

  const status = statusConfig[doc.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${status.bg}`}>
            <StatusIcon
              className={`w-5 h-5 ${status.color} ${
                doc.status === "processing" ? "animate-spin" : ""
              }`}
            />
          </div>
          <div className="text-left">
            <h3 className="font-semibold">{doc.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{formatSize(doc.size)}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{doc.category}</span>
              {doc.chunks > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{doc.chunks} chunks</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {doc.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-muted rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
            {doc.status}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-border space-y-4">
          {/* Error Message */}
          {doc.errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500">{doc.errorMessage}</span>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h4 className="text-sm font-medium mb-2">Metadata</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {doc.metadata.helicopterType && (
                <MetadataItem label="Helicopter" value={doc.metadata.helicopterType} />
              )}
              {doc.metadata.missionType && (
                <MetadataItem label="Mission Type" value={doc.metadata.missionType} />
              )}
              {doc.metadata.classification && (
                <MetadataItem label="Classification" value={doc.metadata.classification} />
              )}
              {doc.metadata.author && (
                <MetadataItem label="Author" value={doc.metadata.author} />
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Uploaded: {doc.uploadedAt.toLocaleString()}</span>
            {doc.processedAt && <span>Processed: {doc.processedAt.toLocaleString()}</span>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Tag className="w-4 h-4 mr-1" />
              Edit Tags
            </Button>
            {doc.status === "failed" && (
              <Button size="sm" onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-muted rounded-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function UploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Upload Documents</h2>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop files here, or click to select
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.docx,.txt,.md"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild>
              <span>Select Files</span>
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            Supported: PDF, DOCX, TXT, Markdown
          </p>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">{files.length} files selected</p>
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                {file.name}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={files.length === 0}
            onClick={() => onUpload(files)}
          >
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
