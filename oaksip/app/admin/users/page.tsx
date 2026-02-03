"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  GraduationCap,
  Award,
  BookOpen,
  Search,
  MoreVertical,
  Eye,
  Clock,
  Target,
  Brain,
  Plus,
  Pencil,
  Trash2,
  UserCog,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { mockUsers, getUserStats } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { UserRole, User } from "@/types";

const roleConfig: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }>; variant: "destructive" | "default" | "secondary" | "outline" }> = {
  admin: { label: "Admin", icon: Shield, variant: "destructive" },
  instructor: { label: "Instructor", icon: GraduationCap, variant: "default" },
  leadership: { label: "Leadership", icon: Award, variant: "secondary" },
  trainee: { label: "Trainee", icon: BookOpen, variant: "outline" },
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("trainee");
  const [newUserUnit, setNewUserUnit] = useState("School of Artillery, Deolali");

  // Reset form to default values
  const resetForm = () => {
    setNewUserName("");
    setNewUserRole("trainee");
    setNewUserUnit("School of Artillery, Deolali");
  };

  // Generate unique user ID
  const generateUserId = () => {
    const existingIds = users.map(u => parseInt(u.id.replace("USR", "")));
    const maxId = Math.max(...existingIds, 0);
    return `USR${String(maxId + 1).padStart(3, '0')}`;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const usersByRole = {
    admin: users.filter((u) => u.role === "admin").length,
    instructor: users.filter((u) => u.role === "instructor").length,
    leadership: users.filter((u) => u.role === "leadership").length,
    trainee: users.filter((u) => u.role === "trainee").length,
  };

  // Action handlers
  const handleAddUser = () => {
    if (!newUserName.trim()) return;

    const newUser: User = {
      id: generateUserId(),
      name: newUserName,
      role: newUserRole,
      unit: newUserUnit,
    };

    setUsers([...users, newUser]);
    resetForm();
    setAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!selectedUser || !newUserName.trim()) return;

    setUsers(users.map(u =>
      u.id === selectedUser.id
        ? { ...u, name: newUserName, role: newUserRole, unit: newUserUnit }
        : u
    ));
    setEditDialogOpen(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(users.filter(u => u.id !== selectedUser.id));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    resetForm();
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setNewUserName(user.name);
    setNewUserRole(user.role);
    setNewUserUnit(user.unit);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const openChangeRoleDialog = (user: User) => {
    setSelectedUser(user);
    setNewUserRole(user.role);
    setChangeRoleDialogOpen(true);
  };

  const handleChangeRole = () => {
    if (!selectedUser) return;

    setUsers(users.map(u =>
      u.id === selectedUser.id
        ? { ...u, role: newUserRole }
        : u
    ));
    setChangeRoleDialogOpen(false);
    setSelectedUser(null);
    resetForm();
  };

  const openResetPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleResetPassword = () => {
    // In a real app, this would trigger a password reset
    // For demo, we just show success and close
    setResetPasswordDialogOpen(false);
    setSelectedUser(null);
  };

  const openViewDetailsDialog = (user: User) => {
    setSelectedUser(user);
    setViewDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage system users and their roles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(usersByRole).map(([role, count]) => {
          const config = roleConfig[role as UserRole];
          return (
            <Card key={role} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {config.label}s
                    </p>
                    <p className="text-3xl font-bold text-foreground">{count}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <config.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRole === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("all")}
              >
                All
              </Button>
              {Object.entries(roleConfig).map(([role, config]) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                  className="gap-1"
                >
                  <config.icon className="h-4 w-4" />
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Queries</TableHead>
                <TableHead>Quiz Score</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const stats = getUserStats(user.id);
                const config = roleConfig[user.role];
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="gap-1">
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.unit}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{stats?.queriesThisMonth || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4 text-muted-foreground" />
                        <span>{stats?.avgQuizScore || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {stats?.lastActiveDate ? formatDate(stats.lastActiveDate) : "Never"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewDetailsDialog(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openChangeRoleDialog(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openResetPasswordDialog(user)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => {
        setAddDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="e.g., Lt. John Doe"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (System Administrator)</SelectItem>
                  <SelectItem value="instructor">Instructor (DS)</SelectItem>
                  <SelectItem value="leadership">Leadership (Command)</SelectItem>
                  <SelectItem value="trainee">Trainee (Officer/JCO)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <Input
                placeholder="School of Artillery, Deolali"
                value={newUserUnit}
                onChange={(e) => setNewUserUnit(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setSelectedUser(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (System Administrator)</SelectItem>
                  <SelectItem value="instructor">Instructor (DS)</SelectItem>
                  <SelectItem value="leadership">Leadership (Command)</SelectItem>
                  <SelectItem value="trainee">Trainee (Officer/JCO)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <Input
                value={newUserUnit}
                onChange={(e) => setNewUserUnit(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              <Pencil className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-destructive/10 p-4 text-sm">
              <p className="font-medium text-destructive">Warning:</p>
              <p className="text-muted-foreground mt-1">
                Deleting this user will remove all their data, quiz history, and training records.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={changeRoleDialogOpen} onOpenChange={setChangeRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {selectedUser?.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-xs text-muted-foreground">Current: {selectedUser?.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (System Administrator)</SelectItem>
                  <SelectItem value="instructor">Instructor (DS)</SelectItem>
                  <SelectItem value="leadership">Leadership (Command)</SelectItem>
                  <SelectItem value="trainee">Trainee (Officer/JCO)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole}>
              <UserCog className="mr-2 h-4 w-4" />
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {selectedUser?.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser?.id}</p>
              </div>
            </div>
            <div className="rounded-lg bg-amber-500/10 p-4 text-sm">
              <p className="font-medium text-amber-600">Note:</p>
              <p className="text-muted-foreground mt-1">
                A temporary password will be generated and the user will be required to change it on next login.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialogOpen} onOpenChange={(open) => {
        setViewDetailsDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-lg font-semibold">{selectedUser.name}</p>
                  <Badge variant={roleConfig[selectedUser.role].variant} className="gap-1 mt-1">
                    {(() => {
                      const config = roleConfig[selectedUser.role];
                      return (
                        <>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </>
                      );
                    })()}
                  </Badge>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-medium">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-medium text-right max-w-[200px]">{selectedUser.unit}</span>
                </div>
                {(() => {
                  const stats = getUserStats(selectedUser.id);
                  return stats ? (
                    <>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Queries This Month</span>
                        <span className="font-medium">{stats.queriesThisMonth}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Quizzes Taken</span>
                        <span className="font-medium">{stats.quizzesTaken}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Avg Quiz Score</span>
                        <span className="font-medium">{stats.avgQuizScore}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Training Sessions</span>
                        <span className="font-medium">{stats.trainingSessionsCompleted}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Last Active</span>
                        <span className="font-medium">{formatDate(stats.lastActiveDate)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 text-center text-muted-foreground">
                      No activity stats available
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDetailsDialogOpen(false);
              if (selectedUser) openEditDialog(selectedUser);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
