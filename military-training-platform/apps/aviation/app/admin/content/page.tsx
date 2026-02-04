"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Video,
  BookOpen,
  ClipboardList,
  File,
  Filter,
  Download,
  Archive,
  CheckCircle,
} from "lucide-react";
import { useAdminStore, ContentItem } from "@/lib/stores/admin-store";

type ModalMode = "add" | "edit" | "view" | "delete" | null;

export default function ContentPage() {
  const { content, addContent, updateContent, deleteContent } = useAdminStore();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    type: "document" as ContentItem["type"],
    category: "",
    status: "draft" as ContentItem["status"],
    version: "1.0",
    createdBy: "",
    fileSize: "",
  });

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openModal = (mode: ModalMode, item?: ContentItem) => {
    setModalMode(mode);
    if (item) {
      setSelectedContent(item);
      if (mode === "edit") {
        setFormData({
          title: item.title,
          type: item.type,
          category: item.category,
          status: item.status,
          version: item.version,
          createdBy: item.createdBy,
          fileSize: item.fileSize || "",
        });
      }
    } else {
      setSelectedContent(null);
      setFormData({
        title: "",
        type: "document",
        category: "",
        status: "draft",
        version: "1.0",
        createdBy: "",
        fileSize: "",
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedContent(null);
  };

  const handleSubmit = () => {
    if (modalMode === "add") {
      addContent({
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      });
    } else if (modalMode === "edit" && selectedContent) {
      updateContent(selectedContent.id, formData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (selectedContent) {
      deleteContent(selectedContent.id);
    }
    closeModal();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "quiz":
        return <ClipboardList className="w-5 h-5" />;
      case "module":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-emerald-500/20 text-emerald-400";
      case "video":
        return "bg-emerald-500/20 text-emerald-400";
      case "quiz":
        return "bg-emerald-500/20 text-emerald-400";
      case "module":
        return "bg-emerald-500/20 text-emerald-400";
      default:
        return "bg-emerald-500/20 text-emerald-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const stats = {
    total: content.length,
    published: content.filter((c) => c.status === "published").length,
    draft: content.filter((c) => c.status === "draft").length,
    archived: content.filter((c) => c.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-500" />
            Content Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage training materials and resources
          </p>
        </div>
        <Button
          onClick={() => openModal("add")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <File className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Items</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.published}</p>
          <p className="text-xs text-gray-500">Published</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Edit2 className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.draft}</p>
          <p className="text-xs text-gray-500">Drafts</p>
        </div>
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
          <Archive className="w-5 h-5 text-gray-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.archived}</p>
          <p className="text-xs text-gray-500">Archived</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="quiz">Quizzes</option>
              <option value="module">Modules</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(
                    item.type
                  )}`}
                >
                  {getTypeIcon(item.type)}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.category}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>v{item.version}</span>
                {item.fileSize && <span>{item.fileSize}</span>}
              </div>
            </div>
            <div className="border-t border-gray-800 p-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Updated: {item.updatedAt}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openModal("view", item)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal("edit", item)}
                  className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal("delete", item)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {modalMode === "add" && "Add New Content"}
                {modalMode === "edit" && "Edit Content"}
                {modalMode === "view" && "Content Details"}
                {modalMode === "delete" && "Delete Content"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalMode === "delete" ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to delete "{selectedContent?.title}"?
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Content
                    </Button>
                  </div>
                </div>
              ) : modalMode === "view" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center ${getTypeColor(
                        selectedContent?.type || ""
                      )}`}
                    >
                      {getTypeIcon(selectedContent?.type || "")}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedContent?.title}
                      </h3>
                      <p className="text-gray-400">{selectedContent?.category}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Type</p>
                      <p className="text-white capitalize">
                        {selectedContent?.type}
                      </p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span
                        className={`text-sm px-2 py-1 rounded ${getStatusBadge(
                          selectedContent?.status || ""
                        )}`}
                      >
                        {selectedContent?.status}
                      </span>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Version</p>
                      <p className="text-white">v{selectedContent?.version}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">File Size</p>
                      <p className="text-white">
                        {selectedContent?.fileSize || "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Created By</p>
                      <p className="text-white">{selectedContent?.createdBy}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Content ID</p>
                      <p className="text-white">{selectedContent?.id}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Created</p>
                      <p className="text-white">{selectedContent?.createdAt}</p>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="text-white">{selectedContent?.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="Enter content title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as ContentItem["type"],
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                        <option value="module">Module</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as ContentItem["status"],
                          })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g., Manual, Training, Safety"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Version
                      </label>
                      <input
                        type="text"
                        value={formData.version}
                        onChange={(e) =>
                          setFormData({ ...formData, version: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g., 1.0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Created By *
                      </label>
                      <input
                        type="text"
                        value={formData.createdBy}
                        onChange={(e) =>
                          setFormData({ ...formData, createdBy: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        File Size
                      </label>
                      <input
                        type="text"
                        value={formData.fileSize}
                        onChange={(e) =>
                          setFormData({ ...formData, fileSize: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#0a0a0f] border border-gray-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                        placeholder="e.g., 15.2 MB"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode !== "delete" && modalMode !== "view" && (
              <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {modalMode === "add" ? "Add Content" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
