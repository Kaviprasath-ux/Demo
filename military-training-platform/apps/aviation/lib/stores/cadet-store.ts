import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ TYPES ============

export interface TrainingModule {
  id: string;
  name: string;
  description: string;
  type: "theory" | "practical" | "simulator" | "field";
  category: "artillery" | "aviation" | "joint-ops" | "safety" | "communication";
  duration: number; // minutes
  progress: number; // percentage
  status: "not-started" | "in-progress" | "completed";
  topics: {
    id: string;
    name: string;
    completed: boolean;
    duration: number;
  }[];
  assessmentRequired: boolean;
  prerequisiteIds: string[];
}

export interface UpcomingSession {
  id: string;
  title: string;
  type: "classroom" | "simulator" | "field" | "live-fire" | "joint-exercise";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructorName: string;
  helicopterType?: string;
  artillerySystem?: string;
  status: "scheduled" | "confirmed" | "cancelled";
  notes: string;
}

export interface CadetAssessment {
  id: string;
  moduleId: string;
  moduleName: string;
  type: "quiz" | "practical" | "simulator" | "field-eval" | "written-exam";
  date: string;
  status: "upcoming" | "in-progress" | "completed" | "missed";
  score?: number;
  passingScore: number;
  passed?: boolean;
  feedback?: string;
  attemptsAllowed: number;
  attemptsMade: number;
  timeLimit?: number; // minutes
}

export interface TrainingDocument {
  id: string;
  title: string;
  category: "manual" | "procedure" | "reference" | "safety" | "checklist";
  type: "pdf" | "video" | "interactive";
  description: string;
  fileSize: string;
  lastUpdated: string;
  isRequired: boolean;
  isRead: boolean;
}

export interface CadetProgress {
  overallProgress: number;
  modulesCompleted: number;
  totalModules: number;
  assessmentsPassed: number;
  totalAssessments: number;
  flightHours: number;
  simulatorHours: number;
  fieldHours: number;
  currentPhase: string;
  nextMilestone: string;
  certifications: string[];
  badges: {
    id: string;
    name: string;
    description: string;
    earnedDate: string;
    icon: string;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "reminder";
  date: string;
  isRead: boolean;
  actionUrl?: string;
}

// ============ STORE ============

interface CadetState {
  modules: TrainingModule[];
  sessions: UpcomingSession[];
  assessments: CadetAssessment[];
  documents: TrainingDocument[];
  progress: CadetProgress;
  notifications: Notification[];

  // Module actions
  updateModuleProgress: (moduleId: string, progress: number) => void;
  completeModuleTopic: (moduleId: string, topicId: string) => void;
  startModule: (moduleId: string) => void;

  // Assessment actions
  startAssessment: (assessmentId: string) => void;
  submitAssessment: (assessmentId: string, score: number) => void;

  // Document actions
  markDocumentRead: (documentId: string) => void;

  // Notification actions
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Helpers
  getModuleById: (id: string) => TrainingModule | undefined;
  getUnreadNotificationsCount: () => number;
}

// ============ MOCK DATA ============

const mockModules: TrainingModule[] = [
  {
    id: "MOD-001",
    name: "Fire Support Fundamentals",
    description: "Introduction to joint fire support operations and coordination principles",
    type: "theory",
    category: "joint-ops",
    duration: 180,
    progress: 100,
    status: "completed",
    topics: [
      { id: "T1", name: "Joint Fire Support Doctrine", completed: true, duration: 45 },
      { id: "T2", name: "Fire Support Coordination", completed: true, duration: 45 },
      { id: "T3", name: "Target Acquisition Basics", completed: true, duration: 45 },
      { id: "T4", name: "Call for Fire Procedures", completed: true, duration: 45 },
    ],
    assessmentRequired: true,
    prerequisiteIds: [],
  },
  {
    id: "MOD-002",
    name: "Artillery Systems Overview",
    description: "Comprehensive overview of Indian Army artillery systems and capabilities",
    type: "theory",
    category: "artillery",
    duration: 240,
    progress: 75,
    status: "in-progress",
    topics: [
      { id: "T1", name: "Dhanush 155mm Howitzer", completed: true, duration: 60 },
      { id: "T2", name: "K9 Vajra Self-Propelled", completed: true, duration: 60 },
      { id: "T3", name: "Pinaka MLRS", completed: true, duration: 60 },
      { id: "T4", name: "Mortars and Light Artillery", completed: false, duration: 60 },
    ],
    assessmentRequired: true,
    prerequisiteIds: ["MOD-001"],
  },
  {
    id: "MOD-003",
    name: "Helicopter Recognition & Capabilities",
    description: "Indian Army Aviation helicopter types, roles, and operational capabilities",
    type: "theory",
    category: "aviation",
    duration: 180,
    progress: 50,
    status: "in-progress",
    topics: [
      { id: "T1", name: "ALH Dhruv Overview", completed: true, duration: 45 },
      { id: "T2", name: "Rudra Attack Helicopter", completed: true, duration: 45 },
      { id: "T3", name: "Apache AH-64E", completed: false, duration: 45 },
      { id: "T4", name: "Helicopter Limitations", completed: false, duration: 45 },
    ],
    assessmentRequired: true,
    prerequisiteIds: ["MOD-001"],
  },
  {
    id: "MOD-004",
    name: "CAS Procedures - Simulator",
    description: "Close Air Support coordination procedures in simulator environment",
    type: "simulator",
    category: "joint-ops",
    duration: 300,
    progress: 0,
    status: "not-started",
    topics: [
      { id: "T1", name: "CAS Request Procedures", completed: false, duration: 60 },
      { id: "T2", name: "Target Marking Methods", completed: false, duration: 60 },
      { id: "T3", name: "Fire Coordination Measures", completed: false, duration: 60 },
      { id: "T4", name: "Battle Damage Assessment", completed: false, duration: 60 },
      { id: "T5", name: "Emergency Procedures", completed: false, duration: 60 },
    ],
    assessmentRequired: true,
    prerequisiteIds: ["MOD-002", "MOD-003"],
  },
  {
    id: "MOD-005",
    name: "Radio Communications",
    description: "Military radio procedures and aviation-artillery communication protocols",
    type: "practical",
    category: "communication",
    duration: 120,
    progress: 30,
    status: "in-progress",
    topics: [
      { id: "T1", name: "Radio Procedures", completed: true, duration: 30 },
      { id: "T2", name: "Call Signs & Frequencies", completed: false, duration: 30 },
      { id: "T3", name: "9-Line CAS Brief", completed: false, duration: 30 },
      { id: "T4", name: "Fire Mission Format", completed: false, duration: 30 },
    ],
    assessmentRequired: true,
    prerequisiteIds: ["MOD-001"],
  },
  {
    id: "MOD-006",
    name: "Safety Procedures",
    description: "Safety protocols for joint fire support operations",
    type: "theory",
    category: "safety",
    duration: 90,
    progress: 100,
    status: "completed",
    topics: [
      { id: "T1", name: "Range Safety", completed: true, duration: 30 },
      { id: "T2", name: "Danger Close Procedures", completed: true, duration: 30 },
      { id: "T3", name: "Emergency Actions", completed: true, duration: 30 },
    ],
    assessmentRequired: true,
    prerequisiteIds: [],
  },
];

const mockSessions: UpcomingSession[] = [
  {
    id: "SES-001",
    title: "CAS Simulator Training",
    type: "simulator",
    date: "2024-12-22",
    startTime: "09:00",
    endTime: "12:00",
    location: "Simulator Bay 2",
    instructorName: "Wg Cdr P. Nair",
    helicopterType: "ALH Dhruv",
    status: "confirmed",
    notes: "Bring headset and notepad",
  },
  {
    id: "SES-002",
    title: "Fire Mission Practical",
    type: "field",
    date: "2024-12-24",
    startTime: "06:00",
    endTime: "14:00",
    location: "Training Area Alpha",
    instructorName: "Col R.K. Sharma",
    artillerySystem: "Dhanush 155mm",
    status: "confirmed",
    notes: "Field uniform, water, rations",
  },
  {
    id: "SES-003",
    title: "Joint Exercise Briefing",
    type: "classroom",
    date: "2024-12-26",
    startTime: "14:00",
    endTime: "16:00",
    location: "Conference Room B",
    instructorName: "Brig V.K. Singh",
    status: "scheduled",
    notes: "Mandatory attendance",
  },
];

const mockAssessments: CadetAssessment[] = [
  {
    id: "ASM-001",
    moduleId: "MOD-001",
    moduleName: "Fire Support Fundamentals",
    type: "written-exam",
    date: "2024-12-15",
    status: "completed",
    score: 88,
    passingScore: 70,
    passed: true,
    feedback: "Excellent understanding of fire support doctrine",
    attemptsAllowed: 2,
    attemptsMade: 1,
    timeLimit: 60,
  },
  {
    id: "ASM-002",
    moduleId: "MOD-006",
    moduleName: "Safety Procedures",
    type: "quiz",
    date: "2024-12-16",
    status: "completed",
    score: 95,
    passingScore: 80,
    passed: true,
    feedback: "Outstanding safety awareness",
    attemptsAllowed: 3,
    attemptsMade: 1,
    timeLimit: 30,
  },
  {
    id: "ASM-003",
    moduleId: "MOD-002",
    moduleName: "Artillery Systems Overview",
    type: "written-exam",
    date: "2024-12-28",
    status: "upcoming",
    passingScore: 70,
    attemptsAllowed: 2,
    attemptsMade: 0,
    timeLimit: 90,
  },
  {
    id: "ASM-004",
    moduleId: "MOD-005",
    moduleName: "Radio Communications",
    type: "practical",
    date: "2024-12-30",
    status: "upcoming",
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsMade: 0,
  },
];

const mockDocuments: TrainingDocument[] = [
  {
    id: "DOC-001",
    title: "Joint Fire Support Manual",
    category: "manual",
    type: "pdf",
    description: "Comprehensive guide to joint fire support operations",
    fileSize: "15.2 MB",
    lastUpdated: "2024-11-01",
    isRequired: true,
    isRead: true,
  },
  {
    id: "DOC-002",
    title: "CAS Procedures Handbook",
    category: "procedure",
    type: "pdf",
    description: "Standard operating procedures for Close Air Support",
    fileSize: "8.5 MB",
    lastUpdated: "2024-10-15",
    isRequired: true,
    isRead: true,
  },
  {
    id: "DOC-003",
    title: "9-Line CAS Brief Quick Reference",
    category: "reference",
    type: "pdf",
    description: "Quick reference card for 9-line CAS brief format",
    fileSize: "0.5 MB",
    lastUpdated: "2024-09-20",
    isRequired: true,
    isRead: false,
  },
  {
    id: "DOC-004",
    title: "Range Safety Video",
    category: "safety",
    type: "video",
    description: "Mandatory safety briefing for live-fire exercises",
    fileSize: "250 MB",
    lastUpdated: "2024-08-01",
    isRequired: true,
    isRead: true,
  },
  {
    id: "DOC-005",
    title: "Pre-Flight Checklist",
    category: "checklist",
    type: "interactive",
    description: "Interactive pre-flight checklist for helicopter operations",
    fileSize: "2.1 MB",
    lastUpdated: "2024-11-10",
    isRequired: false,
    isRead: false,
  },
  {
    id: "DOC-006",
    title: "Artillery Call for Fire Format",
    category: "reference",
    type: "pdf",
    description: "Standard format for artillery fire missions",
    fileSize: "1.2 MB",
    lastUpdated: "2024-10-05",
    isRequired: true,
    isRead: false,
  },
];

const mockProgress: CadetProgress = {
  overallProgress: 58,
  modulesCompleted: 2,
  totalModules: 6,
  assessmentsPassed: 2,
  totalAssessments: 6,
  flightHours: 12,
  simulatorHours: 28,
  fieldHours: 16,
  currentPhase: "Joint Fire Support - Phase 2",
  nextMilestone: "CAS Simulator Qualification",
  certifications: ["Basic Fire Support", "Range Safety"],
  badges: [
    {
      id: "B1",
      name: "Quick Learner",
      description: "Completed first module within 24 hours",
      earnedDate: "2024-12-10",
      icon: "zap",
    },
    {
      id: "B2",
      name: "Safety First",
      description: "Scored 90%+ on Safety Procedures",
      earnedDate: "2024-12-16",
      icon: "shield",
    },
  ],
};

const mockNotifications: Notification[] = [
  {
    id: "N1",
    title: "Session Reminder",
    message: "CAS Simulator Training scheduled for tomorrow at 09:00",
    type: "reminder",
    date: "2024-12-21",
    isRead: false,
    actionUrl: "/cadet/sessions",
  },
  {
    id: "N2",
    title: "Assessment Due",
    message: "Artillery Systems Overview exam is scheduled for Dec 28",
    type: "warning",
    date: "2024-12-20",
    isRead: false,
    actionUrl: "/cadet/assessments",
  },
  {
    id: "N3",
    title: "Badge Earned!",
    message: "Congratulations! You earned the 'Safety First' badge",
    type: "success",
    date: "2024-12-16",
    isRead: true,
  },
  {
    id: "N4",
    title: "New Document Available",
    message: "Updated CAS Procedures Handbook is now available",
    type: "info",
    date: "2024-12-15",
    isRead: true,
    actionUrl: "/cadet/documents",
  },
];

// ============ STORE IMPLEMENTATION ============

export const useCadetStore = create<CadetState>()(
  persist(
    (set, get) => ({
      modules: mockModules,
      sessions: mockSessions,
      assessments: mockAssessments,
      documents: mockDocuments,
      progress: mockProgress,
      notifications: mockNotifications,

      // Module actions
      updateModuleProgress: (moduleId, progress) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  progress,
                  status: progress === 100 ? "completed" : progress > 0 ? "in-progress" : "not-started",
                }
              : m
          ),
        })),

      completeModuleTopic: (moduleId, topicId) =>
        set((state) => {
          const module = state.modules.find((m) => m.id === moduleId);
          if (!module) return state;

          const updatedTopics = module.topics.map((t) =>
            t.id === topicId ? { ...t, completed: true } : t
          );
          const completedCount = updatedTopics.filter((t) => t.completed).length;
          const progress = Math.round((completedCount / updatedTopics.length) * 100);

          return {
            modules: state.modules.map((m) =>
              m.id === moduleId
                ? {
                    ...m,
                    topics: updatedTopics,
                    progress,
                    status: progress === 100 ? "completed" : "in-progress",
                  }
                : m
            ),
          };
        }),

      startModule: (moduleId) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId && m.status === "not-started"
              ? { ...m, status: "in-progress" }
              : m
          ),
        })),

      // Assessment actions
      startAssessment: (assessmentId) =>
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === assessmentId ? { ...a, status: "in-progress" } : a
          ),
        })),

      submitAssessment: (assessmentId, score) =>
        set((state) => {
          const assessment = state.assessments.find((a) => a.id === assessmentId);
          if (!assessment) return state;

          return {
            assessments: state.assessments.map((a) =>
              a.id === assessmentId
                ? {
                    ...a,
                    status: "completed",
                    score,
                    passed: score >= a.passingScore,
                    attemptsMade: a.attemptsMade + 1,
                  }
                : a
            ),
          };
        }),

      // Document actions
      markDocumentRead: (documentId) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === documentId ? { ...d, isRead: true } : d
          ),
        })),

      // Notification actions
      markNotificationRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      // Helpers
      getModuleById: (id) => get().modules.find((m) => m.id === id),
      getUnreadNotificationsCount: () =>
        get().notifications.filter((n) => !n.isRead).length,
    }),
    { name: "cadet-store" }
  )
);
