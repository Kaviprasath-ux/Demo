import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Query, QueryResult } from "@/types";
import { mockUsers, mockRecentQueries, getQueriesByUserId } from "./mock-data";

// =============================================================================
// AUTH STORE
// Backend developer: Replace with API calls to /api/auth/*
// =============================================================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // For demo: login with user selection
  loginAsUser: (userId: string) => Promise<boolean>;
  // For production: login with credentials
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Demo login - select a test user by ID
      loginAsUser: async (userId: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          set({
            user,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      // Production login - authenticate with credentials
      // Backend developer: Replace with API call to /api/auth/login
      login: async (username: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock authentication - in production, verify against backend
        if (username && password) {
          // For demo: map common usernames to test users
          let user: User | undefined;

          if (username.toLowerCase() === "admin") {
            user = mockUsers.find(u => u.role === "admin");
          } else if (username.toLowerCase() === "instructor") {
            user = mockUsers.find(u => u.role === "instructor");
          } else if (username.toLowerCase() === "leadership") {
            user = mockUsers.find(u => u.role === "leadership");
          } else if (username.toLowerCase() === "trainee") {
            user = mockUsers.find(u => u.role === "trainee");
          } else {
            // Default to first user for any other credentials
            user = mockUsers[0];
          }

          if (user) {
            set({
              user,
              isAuthenticated: true,
            });
            return true;
          }
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "oaksip-auth",
    }
  )
);

// =============================================================================
// QUERY STORE
// Backend developer: Replace with API calls to /api/queries/*
// =============================================================================

interface QueryState {
  queries: Query[];
  isLoading: boolean;
  currentResult: QueryResult | null;

  // Get queries filtered for current user
  getUserQueries: () => Query[];

  // Perform a search
  search: (query: string) => Promise<QueryResult>;

  clearCurrentResult: () => void;

  // Initialize queries for a user (called on login)
  initializeForUser: (userId: string) => void;
}

export const useQueryStore = create<QueryState>((set, get) => ({
  queries: mockRecentQueries,
  isLoading: false,
  currentResult: null,

  // Filter queries for current user only
  getUserQueries: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().queries.filter(q => q.userId === user.id);
  },

  // Initialize queries when user logs in
  initializeForUser: (userId: string) => {
    const userQueries = getQueriesByUserId(userId);
    set({ queries: userQueries });
  },

  search: async (query: string) => {
    set({ isLoading: true, currentResult: null });

    try {
      // Use AI API for knowledge search
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      // Map AI response sources to QueryResult source format
      const sources = (data.sources || []).map((s: { title?: string; relevance?: number }) => ({
        document: s.title || "Unknown Source",
        page: Math.floor((s.relevance || 0.5) * 100), // Use relevance as pseudo-page for display
      }));

      const result: QueryResult = {
        answer: data.answer || "No answer found for your query.",
        confidence: data.confidence || 0.5,
        sources,
      };

      const user = useAuthStore.getState().user;

      const newQuery: Query = {
        id: `Q${Date.now()}`,
        query,
        result,
        timestamp: new Date(),
        userId: user?.id || "UNKNOWN",
      };

      set((state) => ({
        queries: [newQuery, ...state.queries],
        isLoading: false,
        currentResult: result,
      }));

      return result;
    } catch (error) {
      console.error("Search failed:", error);

      // Fallback result on error
      const fallbackResult: QueryResult = {
        answer: "Unable to process your query at this time. Please try again.",
        confidence: 0,
        sources: [],
      };

      set({ isLoading: false, currentResult: fallbackResult });
      return fallbackResult;
    }
  },

  clearCurrentResult: () => set({ currentResult: null }),
}));

// =============================================================================
// UI STORE
// =============================================================================

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));

// =============================================================================
// ROLE-BASED ACCESS HELPERS
// =============================================================================

export type UserRole = 'admin' | 'instructor' | 'leadership' | 'trainee';

// Check if current user has required role
export function hasRole(requiredRoles: UserRole[]): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;
  return requiredRoles.includes(user.role as UserRole);
}

// Check if current user can access a feature
export function canAccess(feature: string): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;

  // Role-based permissions per SOW document (Section 7.1 - Key Actors)
  // Admin = System Administrator (technical management only)
  // Instructor = DS/Gunnery Instructors (course delivery & evaluation)
  // Leadership = Course Officers/Commandant (oversight & analytics)
  // Trainee = Officers/JCOs undergoing training (learning & practice)

  const permissions: Record<string, UserRole[]> = {
    // Dashboard - All roles (each gets different view)
    dashboard: ['admin', 'instructor', 'leadership', 'trainee'],

    // System Administrator features (Admin only)
    'user-management': ['admin'],
    'system-health': ['admin'],

    // Documents - Admin (manage), Instructor & Leadership (view)
    documents: ['admin', 'instructor', 'leadership'],
    'documents-manage': ['admin'],

    // Audit Logs - Admin (full system), Leadership (oversight view)
    audit: ['admin', 'leadership'],

    // Instructor-only features (Course delivery & evaluation)
    'question-bank': ['instructor'],
    'trainee-list': ['instructor'],

    // Leadership features (Oversight & analytics)
    reports: ['leadership'],

    // Knowledge Search - Instructor (for content) and Trainee (for study)
    search: ['instructor', 'trainee'],

    // Quiz/Assessment - Instructor (configure/demo) and Trainee (take)
    quiz: ['instructor', 'trainee'],

    // 3D Training - Instructor (supervise/demo) and Trainee (practice drills)
    training: ['instructor', 'trainee'],

    // Simulator Intel - All roles (different views per role)
    simulator: ['admin', 'instructor', 'leadership', 'trainee'],
    'simulator-system': ['admin'],
    'simulator-unit': ['leadership'],
    'simulator-trainee': ['instructor'],
    'simulator-personal': ['trainee'],

    // Training modes (per SOW - crew drills, scenarios)
    'training-cadet': ['instructor', 'trainee'],
    'training-instructor': ['instructor'],
    'training-assessment': ['instructor', 'trainee'],
  };

  const allowedRoles = permissions[feature];
  if (!allowedRoles) return false;
  return allowedRoles.includes(user.role as UserRole);
}
