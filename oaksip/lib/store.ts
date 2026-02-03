import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Query, QueryResult } from "@/types";
import { mockUser, mockRecentQueries, searchKnowledge } from "./mock-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface QueryState {
  queries: Query[];
  isLoading: boolean;
  currentResult: QueryResult | null;
  search: (query: string) => Promise<QueryResult>;
  clearCurrentResult: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock authentication - accept any non-empty credentials
        if (username && password) {
          set({
            user: mockUser,
            isAuthenticated: true,
          });
          return true;
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

export const useQueryStore = create<QueryState>((set) => ({
  queries: mockRecentQueries,
  isLoading: false,
  currentResult: null,
  search: async (query: string) => {
    set({ isLoading: true, currentResult: null });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = searchKnowledge(query);

    const newQuery: Query = {
      id: `Q${Date.now()}`,
      query,
      result,
      timestamp: new Date(),
      userId: useAuthStore.getState().user?.id || "UNKNOWN",
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

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));
