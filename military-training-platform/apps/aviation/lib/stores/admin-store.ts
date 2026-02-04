import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ TYPES ============

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "artillery-instructor" | "aviation-instructor" | "cadet" | "admin" | "auditor";
  rank: string;
  unit: string;
  regiment: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: "success" | "failed" | "warning";
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  category: "general" | "security" | "training" | "notifications" | "integration";
  description: string;
  lastModified: string;
  modifiedBy: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: "document" | "video" | "quiz" | "module";
  category: string;
  status: "draft" | "published" | "archived";
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  fileSize?: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalTrainees: number;
  totalInstructors: number;
  totalSessions: number;
  totalAssessments: number;
  avgCompletionRate: number;
  systemUptime: string;
}

// ============ STORE ============

interface AdminState {
  users: SystemUser[];
  auditLogs: AuditLog[];
  configs: SystemConfig[];
  content: ContentItem[];
  stats: SystemStats;

  // User CRUD
  addUser: (user: Omit<SystemUser, "id">) => void;
  updateUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;

  // Config CRUD
  updateConfig: (id: string, value: string) => void;

  // Content CRUD
  addContent: (content: Omit<ContentItem, "id">) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;

  // Helpers
  getUserById: (id: string) => SystemUser | undefined;
  getStats: () => SystemStats;
}

// ============ MOCK DATA ============

const mockUsers: SystemUser[] = [
  {
    id: "USR-001",
    name: "Col R.K. Sharma",
    email: "rk.sharma@army.mil",
    role: "artillery-instructor",
    rank: "Colonel",
    unit: "School of Artillery",
    regiment: "Regiment of Artillery",
    status: "active",
    lastLogin: "2024-12-20 09:30",
    createdAt: "2024-01-15",
    permissions: ["manage_trainees", "create_sessions", "grade_assessments"],
  },
  {
    id: "USR-002",
    name: "Wg Cdr P. Nair",
    email: "p.nair@army.mil",
    role: "aviation-instructor",
    rank: "Wing Commander",
    unit: "Aviation Training School",
    regiment: "Army Aviation Corps",
    status: "active",
    lastLogin: "2024-12-20 08:45",
    createdAt: "2024-01-20",
    permissions: ["manage_pilots", "create_sessions", "grade_assessments"],
  },
  {
    id: "USR-003",
    name: "Lt Arun Kumar",
    email: "arun.kumar@army.mil",
    role: "cadet",
    rank: "Lieutenant",
    unit: "14 Field Regiment",
    regiment: "Regiment of Artillery",
    status: "active",
    lastLogin: "2024-12-20 10:15",
    createdAt: "2024-03-01",
    permissions: ["view_training", "take_assessments"],
  },
  {
    id: "USR-004",
    name: "Brig V.K. Singh",
    email: "vk.singh@army.mil",
    role: "admin",
    rank: "Brigadier",
    unit: "Joint Fire Support HQ",
    regiment: "Combined Arms",
    status: "active",
    lastLogin: "2024-12-20 07:00",
    createdAt: "2024-01-01",
    permissions: ["full_access"],
  },
  {
    id: "USR-005",
    name: "Col M. Iyer",
    email: "m.iyer@army.mil",
    role: "auditor",
    rank: "Colonel",
    unit: "Training Audit Wing",
    regiment: "Military Training Directorate",
    status: "active",
    lastLogin: "2024-12-19 14:30",
    createdAt: "2024-02-01",
    permissions: ["view_all", "generate_reports"],
  },
  {
    id: "USR-006",
    name: "Capt Priya Sharma",
    email: "priya.sharma@army.mil",
    role: "cadet",
    rank: "Captain",
    unit: "662 Squadron",
    regiment: "Army Aviation Corps",
    status: "active",
    lastLogin: "2024-12-20 11:00",
    createdAt: "2024-04-15",
    permissions: ["view_training", "take_assessments"],
  },
  {
    id: "USR-007",
    name: "Maj S. Reddy",
    email: "s.reddy@army.mil",
    role: "cadet",
    rank: "Major",
    unit: "21 Field Regiment",
    regiment: "Regiment of Artillery",
    status: "inactive",
    lastLogin: "2024-11-15 09:00",
    createdAt: "2024-02-20",
    permissions: ["view_training", "take_assessments"],
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: "2024-12-20 10:30:45",
    userId: "USR-001",
    userName: "Col R.K. Sharma",
    action: "CREATE",
    resource: "Training Session",
    details: "Created new CAS training session for Dec 22",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "LOG-002",
    timestamp: "2024-12-20 10:15:22",
    userId: "USR-003",
    userName: "Lt Arun Kumar",
    action: "LOGIN",
    resource: "System",
    details: "User logged in successfully",
    ipAddress: "192.168.1.105",
    status: "success",
  },
  {
    id: "LOG-003",
    timestamp: "2024-12-20 09:45:10",
    userId: "USR-002",
    userName: "Wg Cdr P. Nair",
    action: "UPDATE",
    resource: "Pilot Assessment",
    details: "Graded CAS evaluation for Capt Vikram Singh",
    ipAddress: "192.168.1.102",
    status: "success",
  },
  {
    id: "LOG-004",
    timestamp: "2024-12-20 09:30:00",
    userId: "USR-004",
    userName: "Brig V.K. Singh",
    action: "CONFIG_CHANGE",
    resource: "System Settings",
    details: "Updated session timeout to 30 minutes",
    ipAddress: "192.168.1.101",
    status: "success",
  },
  {
    id: "LOG-005",
    timestamp: "2024-12-20 08:00:15",
    userId: "SYSTEM",
    userName: "System",
    action: "BACKUP",
    resource: "Database",
    details: "Daily backup completed successfully",
    ipAddress: "localhost",
    status: "success",
  },
  {
    id: "LOG-006",
    timestamp: "2024-12-19 23:45:00",
    userId: "USR-008",
    userName: "Unknown",
    action: "LOGIN",
    resource: "System",
    details: "Failed login attempt - invalid credentials",
    ipAddress: "203.0.113.50",
    status: "failed",
  },
];

const mockConfigs: SystemConfig[] = [
  {
    id: "CFG-001",
    key: "session_timeout",
    value: "30",
    category: "security",
    description: "Session timeout in minutes",
    lastModified: "2024-12-20",
    modifiedBy: "Brig V.K. Singh",
  },
  {
    id: "CFG-002",
    key: "max_login_attempts",
    value: "5",
    category: "security",
    description: "Maximum failed login attempts before lockout",
    lastModified: "2024-12-15",
    modifiedBy: "Brig V.K. Singh",
  },
  {
    id: "CFG-003",
    key: "assessment_passing_score",
    value: "70",
    category: "training",
    description: "Default passing score for assessments (%)",
    lastModified: "2024-12-01",
    modifiedBy: "Col R.K. Sharma",
  },
  {
    id: "CFG-004",
    key: "notification_email",
    value: "enabled",
    category: "notifications",
    description: "Enable email notifications",
    lastModified: "2024-11-20",
    modifiedBy: "Brig V.K. Singh",
  },
  {
    id: "CFG-005",
    key: "system_name",
    value: "JFSP Training Platform",
    category: "general",
    description: "System display name",
    lastModified: "2024-01-01",
    modifiedBy: "System",
  },
  {
    id: "CFG-006",
    key: "backup_frequency",
    value: "daily",
    category: "general",
    description: "Database backup frequency",
    lastModified: "2024-12-10",
    modifiedBy: "Brig V.K. Singh",
  },
];

const mockContent: ContentItem[] = [
  {
    id: "CNT-001",
    title: "Joint Fire Support Manual",
    type: "document",
    category: "Manual",
    status: "published",
    version: "2.1",
    createdAt: "2024-01-15",
    updatedAt: "2024-11-01",
    createdBy: "Col R.K. Sharma",
    fileSize: "15.2 MB",
  },
  {
    id: "CNT-002",
    title: "CAS Procedures Handbook",
    type: "document",
    category: "Procedure",
    status: "published",
    version: "1.5",
    createdAt: "2024-02-20",
    updatedAt: "2024-10-15",
    createdBy: "Wg Cdr P. Nair",
    fileSize: "8.5 MB",
  },
  {
    id: "CNT-003",
    title: "Fire Support Fundamentals",
    type: "module",
    category: "Training",
    status: "published",
    version: "1.0",
    createdAt: "2024-03-01",
    updatedAt: "2024-09-15",
    createdBy: "Col R.K. Sharma",
  },
  {
    id: "CNT-004",
    title: "Range Safety Video",
    type: "video",
    category: "Safety",
    status: "published",
    version: "1.2",
    createdAt: "2024-04-01",
    updatedAt: "2024-08-01",
    createdBy: "Training Command",
    fileSize: "250 MB",
  },
  {
    id: "CNT-005",
    title: "Artillery Systems Quiz",
    type: "quiz",
    category: "Assessment",
    status: "published",
    version: "1.1",
    createdAt: "2024-05-01",
    updatedAt: "2024-10-01",
    createdBy: "Col R.K. Sharma",
  },
  {
    id: "CNT-006",
    title: "Advanced CAS Training",
    type: "module",
    category: "Training",
    status: "draft",
    version: "0.8",
    createdAt: "2024-11-01",
    updatedAt: "2024-12-15",
    createdBy: "Wg Cdr P. Nair",
  },
];

const mockStats: SystemStats = {
  totalUsers: 7,
  activeUsers: 6,
  totalTrainees: 3,
  totalInstructors: 2,
  totalSessions: 45,
  totalAssessments: 128,
  avgCompletionRate: 78,
  systemUptime: "99.9%",
};

// ============ STORE IMPLEMENTATION ============

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      auditLogs: mockAuditLogs,
      configs: mockConfigs,
      content: mockContent,
      stats: mockStats,

      // User CRUD
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: `USR-${Date.now()}` }],
        })),
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      // Config CRUD
      updateConfig: (id, value) =>
        set((state) => ({
          configs: state.configs.map((c) =>
            c.id === id
              ? { ...c, value, lastModified: new Date().toISOString().split("T")[0] }
              : c
          ),
        })),

      // Content CRUD
      addContent: (content) =>
        set((state) => ({
          content: [...state.content, { ...content, id: `CNT-${Date.now()}` }],
        })),
      updateContent: (id, updates) =>
        set((state) => ({
          content: state.content.map((c) =>
            c.id === id
              ? { ...c, ...updates, updatedAt: new Date().toISOString().split("T")[0] }
              : c
          ),
        })),
      deleteContent: (id) =>
        set((state) => ({
          content: state.content.filter((c) => c.id !== id),
        })),

      // Helpers
      getUserById: (id) => get().users.find((u) => u.id === id),
      getStats: () => {
        const state = get();
        return {
          ...state.stats,
          totalUsers: state.users.length,
          activeUsers: state.users.filter((u) => u.status === "active").length,
          totalTrainees: state.users.filter((u) => u.role === "cadet").length,
          totalInstructors: state.users.filter(
            (u) => u.role === "artillery-instructor" || u.role === "aviation-instructor"
          ).length,
        };
      },
    }),
    { name: "admin-store" }
  )
);
