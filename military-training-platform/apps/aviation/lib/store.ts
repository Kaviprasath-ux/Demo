import { create } from "zustand";
import { persist } from "zustand/middleware";

// SOW-defined roles for Joint Fire Support Platform
export type AviationRole =
  | "artillery-instructor"
  | "aviation-instructor"
  | "cadet"
  | "admin"
  | "auditor";

export interface User {
  id: string;
  name: string;
  role: AviationRole;
  rank: string;
  unit: string;
  regiment: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "aviation-auth" }
  )
);

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Mock users for demo - based on SOW roles
export const mockUsers: User[] = [
  {
    id: "ART-INS-001",
    name: "Col R.K. Sharma",
    role: "artillery-instructor",
    rank: "Colonel",
    unit: "School of Artillery",
    regiment: "Regiment of Artillery"
  },
  {
    id: "AVI-INS-001",
    name: "Wg Cdr P. Nair",
    role: "aviation-instructor",
    rank: "Wing Commander",
    unit: "Aviation Training School",
    regiment: "Army Aviation Corps"
  },
  {
    id: "CDT-001",
    name: "Lt Arun Kumar",
    role: "cadet",
    rank: "Lieutenant",
    unit: "14 Field Regiment",
    regiment: "Regiment of Artillery"
  },
  {
    id: "ADM-001",
    name: "Brig V.K. Singh",
    role: "admin",
    rank: "Brigadier",
    unit: "Joint Fire Support HQ",
    regiment: "Combined Arms"
  },
  {
    id: "AUD-001",
    name: "Col M. Iyer",
    role: "auditor",
    rank: "Colonel",
    unit: "Training Audit Wing",
    regiment: "Military Training Directorate"
  },
];

// Role-based route mapping
export const roleRoutes: Record<AviationRole, string> = {
  "artillery-instructor": "/artillery-instructor",
  "aviation-instructor": "/aviation-instructor",
  "cadet": "/cadet",
  "admin": "/admin",
  "auditor": "/auditor",
};

// Role display configuration
export const roleConfig: Record<AviationRole, { label: string; description: string; color: string }> = {
  "artillery-instructor": {
    label: "Artillery Instructor",
    description: "Train FOO personnel in fire support procedures",
    color: "bg-emerald-500"
  },
  "aviation-instructor": {
    label: "Aviation Instructor",
    description: "Train pilots in CAS and joint operations",
    color: "bg-emerald-500"
  },
  "cadet": {
    label: "Cadet/Trainee",
    description: "FOO or Pilot trainee in joint fire support",
    color: "bg-green-500"
  },
  "admin": {
    label: "Administrator",
    description: "System administration and user management",
    color: "bg-emerald-500"
  },
  "auditor": {
    label: "Auditor",
    description: "Training audit and compliance monitoring",
    color: "bg-red-500"
  },
};
