"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Button } from "@military/ui";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  UserCheck,
  UserX,
  Shield,
  Filter,
} from "lucide-react";
import { useAdminStore, SystemUser } from "@/lib/stores/admin-store";

type ModalMode = "add" | "edit" | "view" | "delete" | null;

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useAdminStore();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cadet" as SystemUser["role"],
    rank: "",
    unit: "",
    regiment: "",
    status: "active" as SystemUser["status"],
    permissions: [] as string[],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openModal = (mode: ModalMode, user?: SystemUser) => {
    setModalMode(mode);
    if (user) {
      setSelectedUser(user);
      if (mode === "edit") {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          rank: user.rank,
          unit: user.unit,
          regiment: user.regiment,
          status: user.status,
          permissions: user.permissions,
        });
      }
    } else {
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        role: "cadet",
        rank: "",
        unit: "",
        regiment: "",
        status: "active",
        permissions: [],
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const handleSubmit = () => {
    if (modalMode === "add") {
      addUser({
        ...formData,
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      });
    } else if (modalMode === "edit" && selectedUser) {
      updateUser(selectedUser.id, formData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
    }
    closeModal();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/20 text-primary";
      case "artillery-instructor":
        return "bg-primary/20 text-primary";
      case "aviation-instructor":
        return "bg-primary/20 text-primary";
      case "cadet":
        return "bg-primary/20 text-primary";
      case "auditor":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/20 text-primary";
      case "inactive":
        return "bg-gray-500/20 text-muted-foreground";
      case "suspended":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-muted-foreground";
    }
  };

  const permissionOptions = [
    "full_access",
    "manage_trainees",
    "manage_pilots",
    "create_sessions",
    "grade_assessments",
    "view_training",
    "take_assessments",
    "view_all",
    "generate_reports",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and permissions
          </p>
        </div>
        <Button
          onClick={() => openModal("add")}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="artillery-instructor">Artillery Instructor</option>
              <option value="aviation-instructor">Aviation Instructor</option>
              <option value="cadet">Cadet</option>
              <option value="auditor">Auditor</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Role
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Unit
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Last Login
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-foreground font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role.replace("-", " ")}
                  </span>
                </td>
                <td className="p-4">
                  <p className="text-foreground">{user.unit}</p>
                  <p className="text-sm text-muted-foreground">{user.rank}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{user.lastLogin}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal("view", user)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("edit", user)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("delete", user)}
                      className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {modalMode === "add" && "Add New User"}
                {modalMode === "edit" && "Edit User"}
                {modalMode === "view" && "User Details"}
                {modalMode === "delete" && "Delete User"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Are you sure you want to delete user "{selectedUser?.name}"?
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
                      Delete User
                    </Button>
                  </div>
                </div>
              ) : modalMode === "view" ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-foreground">
                      {selectedUser?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {selectedUser?.name}
                      </h3>
                      <p className="text-muted-foreground">{selectedUser?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Role</p>
                      <p className="text-foreground">
                        {selectedUser?.role.replace("-", " ")}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span
                        className={`text-sm px-2 py-1 rounded ${getStatusBadgeColor(
                          selectedUser?.status || ""
                        )}`}
                      >
                        {selectedUser?.status}
                      </span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Rank</p>
                      <p className="text-foreground">{selectedUser?.rank}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Unit</p>
                      <p className="text-foreground">{selectedUser?.unit}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Regiment</p>
                      <p className="text-foreground">{selectedUser?.regiment}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Last Login</p>
                      <p className="text-foreground">{selectedUser?.lastLogin}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Created</p>
                      <p className="text-foreground">{selectedUser?.createdAt}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">User ID</p>
                      <p className="text-foreground">{selectedUser?.id}</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser?.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="text-xs px-2 py-1 bg-primary/20 text-primary rounded"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        placeholder="user@army.mil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as SystemUser["role"],
                          })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="artillery-instructor">
                          Artillery Instructor
                        </option>
                        <option value="aviation-instructor">
                          Aviation Instructor
                        </option>
                        <option value="cadet">Cadet</option>
                        <option value="auditor">Auditor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as SystemUser["status"],
                          })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Rank *
                      </label>
                      <input
                        type="text"
                        value={formData.rank}
                        onChange={(e) =>
                          setFormData({ ...formData, rank: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        placeholder="e.g., Colonel, Major"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Unit *
                      </label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        placeholder="e.g., School of Artillery"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-muted-foreground mb-1">
                        Regiment
                      </label>
                      <input
                        type="text"
                        value={formData.regiment}
                        onChange={(e) =>
                          setFormData({ ...formData, regiment: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        placeholder="e.g., Regiment of Artillery"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Permissions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {permissionOptions.map((perm) => (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => {
                            const newPerms = formData.permissions.includes(perm)
                              ? formData.permissions.filter((p) => p !== perm)
                              : [...formData.permissions, perm];
                            setFormData({ ...formData, permissions: newPerms });
                          }}
                          className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                            formData.permissions.includes(perm)
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-muted/50 border-border text-muted-foreground hover:border-border"
                          }`}
                        >
                          {perm}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode !== "delete" && modalMode !== "view" && (
              <div className="p-4 border-t border-border flex justify-end gap-3">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  {modalMode === "add" ? "Add User" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
