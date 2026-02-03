"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  FolderOpen,
  Upload,
  Trash2,
  Pencil,
  MoreVertical,
  RefreshCw,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockDocuments } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { formatDateShort } from "@/lib/utils";
import type { Document } from "@/types";

export default function DocumentsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dialog states (Admin only)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reindexDialogOpen, setReindexDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Form states
  const [newDocName, setNewDocName] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Doctrine");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexComplete, setReindexComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form
  const resetForm = () => {
    setNewDocName("");
    setNewDocCategory("Doctrine");
    setSelectedFileName("");
  };

  // Generate unique document ID
  const generateDocId = () => {
    const existingIds = documents.map(d => d.id);
    const maxId = Math.max(...existingIds, 0);
    return maxId + 1;
  };

  const categories = ["all", ...new Set(documents.map((d) => d.category))];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors: Record<string, string> = {
    Doctrine: "bg-blue-500/10 text-blue-500",
    SOP: "bg-green-500/10 text-green-500",
    Technical: "bg-purple-500/10 text-purple-500",
    Reference: "bg-orange-500/10 text-orange-500",
  };

  // File input handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      // Auto-fill document name from file name (without extension)
      if (!newDocName.trim()) {
        setNewDocName(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    }
  };

  // Admin action handlers
  const handleUpload = () => {
    if (!newDocName.trim()) return;

    const newDoc: Document = {
      id: generateDocId(),
      name: newDocName,
      type: "PDF",
      pages: Math.floor(Math.random() * 200) + 50,
      category: newDocCategory,
      uploadedAt: new Date(),
      size: `${(Math.random() * 20 + 5).toFixed(1)} MB`,
    };

    setDocuments([newDoc, ...documents]);
    resetForm();
    setUploadDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selectedDoc) return;
    setDocuments(documents.filter(d => d.id !== selectedDoc.id));
    setDeleteDialogOpen(false);
    setSelectedDoc(null);
  };

  const handleEdit = () => {
    if (!selectedDoc || !newDocName.trim()) return;
    setDocuments(documents.map(d =>
      d.id === selectedDoc.id
        ? { ...d, name: newDocName, category: newDocCategory }
        : d
    ));
    setEditDialogOpen(false);
    setSelectedDoc(null);
    resetForm();
  };

  const openEditDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setNewDocName(doc.name);
    setNewDocCategory(doc.category);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setDeleteDialogOpen(true);
  };

  // Re-index handlers
  const handleReindexAll = () => {
    setSelectedDoc(null);
    setIsReindexing(true);
    setReindexComplete(false);
    setReindexDialogOpen(true);

    // Simulate re-indexing
    setTimeout(() => {
      setIsReindexing(false);
      setReindexComplete(true);
    }, 2000);
  };

  const handleReindexDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setIsReindexing(true);
    setReindexComplete(false);
    setReindexDialogOpen(true);

    // Simulate re-indexing
    setTimeout(() => {
      setIsReindexing(false);
      setReindexComplete(true);
    }, 1500);
  };

  const closeReindexDialog = () => {
    setReindexDialogOpen(false);
    setSelectedDoc(null);
    setIsReindexing(false);
    setReindexComplete(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Document Library
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Upload, manage, and index artillery documents, manuals, and SOPs."
              : "Browse indexed artillery documents, manuals, and SOPs."
            }
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleReindexAll}>
              <RefreshCw className="h-4 w-4" />
              Re-index All
            </Button>
            <Button className="gap-2" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockDocuments.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <FolderOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {categories.length - 1}
                </p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockDocuments.reduce((acc, d) => acc + d.pages, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Download className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">143.5 MB</p>
                <p className="text-xs text-muted-foreground">Total Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-full sm:w-auto"
              >
                <TabsList className="h-9">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="text-xs capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredDocuments.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No documents found matching your search.
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                      <FileText className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{doc.pages} pages</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{formatDateShort(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={categoryColors[doc.category]}
                    >
                      {doc.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(doc)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Metadata
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReindexDoc(doc)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Re-index
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(doc)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Document Dialog (Admin only) */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        setUploadDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the knowledge base for AI indexing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Name</label>
              <Input
                placeholder="e.g., Artillery Field Manual v2"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doctrine">Doctrine</SelectItem>
                  <SelectItem value="SOP">SOP</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50 ${selectedFileName ? 'border-green-500 bg-green-500/5' : 'border-border'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFileName ? (
                  <>
                    <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {selectedFileName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop a PDF file, or click to browse
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" type="button">
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!newDocName.trim()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Index
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog (Admin only) */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setSelectedDoc(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update metadata for {selectedDoc?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Name</label>
              <Input
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doctrine">Doctrine</SelectItem>
                  <SelectItem value="SOP">SOP</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Document Dialog (Admin only) */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setSelectedDoc(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedDoc?.name}&quot;?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-destructive/10 p-4 text-sm">
              <p className="font-medium text-destructive">Warning:</p>
              <p className="text-muted-foreground mt-1">
                This will remove the document from the knowledge base. AI-generated questions referencing this document may become invalid.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-index Dialog (Admin only) */}
      <Dialog open={reindexDialogOpen} onOpenChange={(open) => {
        if (!isReindexing) {
          setReindexDialogOpen(open);
          if (!open) closeReindexDialog();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDoc ? "Re-index Document" : "Re-index All Documents"}
            </DialogTitle>
            <DialogDescription>
              {selectedDoc
                ? `Re-indexing "${selectedDoc.name}" for AI knowledge base.`
                : "Re-indexing all documents for AI knowledge base."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {isReindexing ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div>
                    <p className="font-medium">Re-indexing in progress...</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDoc
                        ? "Extracting content and updating vector embeddings"
                        : `Processing ${documents.length} documents`
                      }
                    </p>
                  </div>
                </>
              ) : reindexComplete ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-green-600">Re-indexing Complete</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDoc
                        ? "Document has been successfully re-indexed."
                        : `All ${documents.length} documents have been re-indexed.`
                      }
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={closeReindexDialog}
              disabled={isReindexing}
            >
              {reindexComplete ? "Done" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
