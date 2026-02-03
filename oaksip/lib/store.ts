import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Query, QueryResult } from "@/types";
import { mockUsers, mockRecentQueries, searchKnowledge, getQueriesByUserId } from "./mock-data";

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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = searchKnowledge(query);
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

export type UserRole = 'admin' | 'instructor' | 'trainee';

// Check if current user has required role
export function hasRole(requiredRoles: UserRole[]): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

// Check if current user can access a feature
export function canAccess(feature: string): boolean {
  const user = useAuthStore.getState().user;
  if (!user) return false;

  const permissions: Record<string, UserRole[]> = {
    dashboard: ['admin', 'instructor', 'trainee'],
    search: ['admin', 'instructor', 'trainee'],
    quiz: ['admin', 'instructor', 'trainee'],
    training: ['admin', 'instructor', 'trainee'],
    simulator: ['admin', 'instructor', 'trainee'],
    documents: ['admin', 'instructor'],
    audit: ['admin'],
    // Training modes
    'training-cadet': ['admin', 'instructor', 'trainee'],
    'training-instructor': ['admin', 'instructor'],
    'training-assessment': ['admin', 'instructor', 'trainee'],
  };

  const allowedRoles = permissions[feature];
  if (!allowedRoles) return false;
  return allowedRoles.includes(user.role);
}
