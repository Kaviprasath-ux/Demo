"use client";

import { useState } from "react";
import {
  Database,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  Archive,
  Tag,
  FolderOpen,
  Upload,
} from "lucide-react";
import { Button } from "@military/ui";
import { useDatasetStore, type Dataset } from "@/lib/stores/dataset-store";

const categoryConfig = {
  doctrine: { label: "Doctrine", color: "text-primary", bg: "bg-primary/20" },
  sop: { label: "SOP", color: "text-primary", bg: "bg-primary/20" },
  technical: { label: "Technical", color: "text-primary", bg: "bg-primary/20" },
  training: { label: "Training", color: "text-primary", bg: "bg-primary/20" },
  assessment: { label: "Assessment", color: "text-primary", bg: "bg-primary/20" },
  general: { label: "General", color: "text-muted-foreground", bg: "bg-gray-500/20" },
};

const statusConfig = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-gray-500/20" },
  processing: { label: "Processing", color: "text-primary", bg: "bg-primary/20" },
  ready: { label: "Ready", color: "text-primary", bg: "bg-primary/20" },
  archived: { label: "Archived", color: "text-muted-foreground", bg: "bg-muted" },
};

export default function DatasetFactoryPage() {
  const {
    datasets,
    deleteDataset,
    archiveDataset,
    requestExport,
    getExportStatus,
  } = useDatasetStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || ds.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: datasets.length,
    ready: datasets.filter((ds) => ds.status === "ready").length,
    totalDocs: datasets.reduce((sum, ds) => sum + ds.stats.documentCount, 0),
    totalChunks: datasets.reduce((sum, ds) => sum + ds.stats.chunkCount, 0),
  };

  const handleExport = async (datasetId: string, format: "json" | "jsonl") => {
    setExportingId(datasetId);
    const exportId = requestExport(datasetId, format);

    // Simulate waiting for export
    setTimeout(() => {
      setExportingId(null);
    }, 2500);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dataset Factory</h1>
              <p className="text-sm text-muted-foreground">
                Manage training datasets for AI/LLM (SOW 6.6)
              </p>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Dataset
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Datasets" value={stats.total} icon={Database} />
          <StatCard
            label="Ready"
            value={stats.ready}
            icon={CheckCircle}
            color="text-primary"
          />
          <StatCard label="Documents" value={stats.totalDocs} icon={FileText} />
          <StatCard label="Total Chunks" value={stats.totalChunks} icon={FolderOpen} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:border-primary/50"
              }`}
            >
              All
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Datasets List */}
        <div className="space-y-3">
          {filteredDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              isExpanded={expandedId === dataset.id}
              isExporting={exportingId === dataset.id}
              onToggle={() => setExpandedId(expandedId === dataset.id ? null : dataset.id)}
              onExport={(format) => handleExport(dataset.id, format)}
              onArchive={() => archiveDataset(dataset.id)}
              onDelete={() => deleteDataset(dataset.id)}
              formatSize={formatSize}
            />
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No datasets found matching your criteria.</p>
          </div>
        )}

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <CreateDatasetModal onClose={() => setShowCreateModal(false)} />
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

function DatasetCard({
  dataset,
  isExpanded,
  isExporting,
  onToggle,
  onExport,
  onArchive,
  onDelete,
  formatSize,
}: {
  dataset: Dataset;
  isExpanded: boolean;
  isExporting: boolean;
  onToggle: () => void;
  onExport: (format: "json" | "jsonl") => void;
  onArchive: () => void;
  onDelete: () => void;
  formatSize: (bytes: number) => string;
}) {
  const catConfig = categoryConfig[dataset.category];
  const statConfig = statusConfig[dataset.status];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${catConfig.bg}`}>
            <Database className={`w-5 h-5 ${catConfig.color}`} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold">{dataset.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {dataset.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${catConfig.bg} ${catConfig.color}`}>
                {catConfig.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statConfig.bg} ${statConfig.color}`}>
                {statConfig.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {dataset.stats.documentCount} docs • {dataset.stats.chunkCount} chunks
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatSize(dataset.stats.totalSize)}
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
          {/* Metadata */}
          <div>
            <h4 className="text-sm font-medium mb-2">Metadata</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dataset.metadata.helicopterTypes && dataset.metadata.helicopterTypes.length > 0 && (
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Helicopters</p>
                  <p className="text-sm">{dataset.metadata.helicopterTypes.join(", ")}</p>
                </div>
              )}
              {dataset.metadata.missionTypes && dataset.metadata.missionTypes.length > 0 && (
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Missions</p>
                  <p className="text-sm">{dataset.metadata.missionTypes.join(", ")}</p>
                </div>
              )}
              {dataset.metadata.classification && (
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Classification</p>
                  <p className="text-sm capitalize">{dataset.metadata.classification}</p>
                </div>
              )}
              {dataset.metadata.version && (
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="text-sm">v{dataset.metadata.version}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {dataset.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Documents ({dataset.documents.length})</h4>
              <div className="space-y-2">
                {dataset.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doc.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatSize(doc.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {dataset.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Created: {dataset.createdAt.toLocaleDateString()}</span>
            <span>Updated: {dataset.stats.lastUpdated.toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport("json")}
              disabled={isExporting || dataset.status !== "ready"}
            >
              {isExporting ? (
                <Clock className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport("jsonl")}
              disabled={isExporting || dataset.status !== "ready"}
            >
              Export JSONL
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Add Docs
            </Button>
            <Button variant="outline" size="sm" onClick={onArchive}>
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
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

function CreateDatasetModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Create Dataset</h2>
        <p className="text-muted-foreground mb-4">
          Dataset creation form would go here. For now, datasets are pre-populated with mock data.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
