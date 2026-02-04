"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface MaintenanceTask {
  id: string;
  title: string;
  type: "scheduled" | "unscheduled" | "inspection" | "repair" | "modification";
  priority: "routine" | "urgent" | "aog"; // AOG = Aircraft on Ground
  status: "pending" | "in-progress" | "completed" | "deferred";
  aircraft: string;
  registration: string;
  category: "airframe" | "engine" | "avionics" | "weapons" | "hydraulics" | "electrical";
  description: string;
  estimatedHours: number;
  actualHours?: number;
  assignedTo: string[];
  startedAt?: string;
  completedAt?: string;
  partsRequired: {
    partNumber: string;
    description: string;
    quantity: number;
    status: "available" | "ordered" | "backordered";
  }[];
  signoffs: {
    role: string;
    name: string;
    date: string;
    signature: boolean;
  }[];
}

export interface AircraftDiagnostic {
  id: string;
  aircraft: string;
  registration: string;
  inspectionDate: string;
  nextInspection: string;
  totalHours: number;
  hoursToService: number;
  systems: {
    name: string;
    status: "serviceable" | "attention" | "unserviceable";
    lastCheck: string;
    notes?: string;
  }[];
  faults: {
    id: string;
    system: string;
    description: string;
    severity: "minor" | "major" | "critical";
    reportedDate: string;
    status: "open" | "deferred" | "closed";
  }[];
  overallStatus: "flyable" | "restricted" | "grounded";
}

export interface SpareInventory {
  id: string;
  partNumber: string;
  description: string;
  category: "consumable" | "rotable" | "repairable" | "life-limited";
  aircraft: string[];
  quantity: number;
  minStock: number;
  maxStock: number;
  location: string;
  unitPrice: number;
  lastOrdered?: string;
  leadTime: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "on-order";
  expiryDate?: string;
  batchNumber?: string;
}

export interface MaintenanceTraining {
  id: string;
  title: string;
  code: string;
  aircraft: string;
  category: "type-rating" | "recurrent" | "special" | "safety";
  duration: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  certification?: {
    issued: string;
    expires: string;
    number: string;
  };
}

// Mock Data
const mockTasks: MaintenanceTask[] = [
  {
    id: "t1",
    title: "50-Hour Inspection",
    type: "inspection",
    priority: "routine",
    status: "in-progress",
    aircraft: "Rudra (ALH WSI)",
    registration: "Z-3203",
    category: "airframe",
    description: "Scheduled 50-hour periodic inspection including all systems check",
    estimatedHours: 24,
    assignedTo: ["Sgt Mohan Das", "Cpl Raju Verma"],
    startedAt: "2024-12-19T08:00:00",
    partsRequired: [
      { partNumber: "ALH-FLT-001", description: "Oil Filter", quantity: 1, status: "available" },
      { partNumber: "ALH-HYD-015", description: "Hydraulic Seal Kit", quantity: 1, status: "available" },
    ],
    signoffs: [],
  },
  {
    id: "t2",
    title: "Tail Rotor Vibration Investigation",
    type: "unscheduled",
    priority: "urgent",
    status: "pending",
    aircraft: "ALH Dhruv",
    registration: "Z-3201",
    category: "airframe",
    description: "Reported vibration during high-speed flight. Requires track and balance check.",
    estimatedHours: 8,
    assignedTo: ["Sgt Mohan Das"],
    partsRequired: [],
    signoffs: [],
  },
  {
    id: "t3",
    title: "Avionics Software Update",
    type: "modification",
    priority: "routine",
    status: "completed",
    aircraft: "ALH Dhruv",
    registration: "Z-3202",
    category: "avionics",
    description: "Install latest navigation software update v2.3.1",
    estimatedHours: 4,
    actualHours: 3.5,
    assignedTo: ["LAC Sunil Kumar"],
    startedAt: "2024-12-17T10:00:00",
    completedAt: "2024-12-17T13:30:00",
    partsRequired: [],
    signoffs: [
      { role: "Technician", name: "LAC Sunil Kumar", date: "2024-12-17", signature: true },
      { role: "Inspector", name: "Sgt Mohan Das", date: "2024-12-17", signature: true },
    ],
  },
  {
    id: "t4",
    title: "Engine Oil Change",
    type: "scheduled",
    priority: "routine",
    status: "pending",
    aircraft: "Chetak",
    registration: "Z-2105",
    category: "engine",
    description: "Scheduled engine oil and filter change",
    estimatedHours: 3,
    assignedTo: ["Cpl Raju Verma"],
    partsRequired: [
      { partNumber: "CHEK-ENG-001", description: "Engine Oil (5L)", quantity: 2, status: "available" },
      { partNumber: "CHEK-ENG-002", description: "Oil Filter", quantity: 1, status: "ordered" },
    ],
    signoffs: [],
  },
];

const mockDiagnostics: AircraftDiagnostic[] = [
  {
    id: "d1",
    aircraft: "ALH Dhruv",
    registration: "Z-3201",
    inspectionDate: "2024-12-10",
    nextInspection: "2024-12-25",
    totalHours: 2450,
    hoursToService: 50,
    systems: [
      { name: "Engine", status: "serviceable", lastCheck: "2024-12-10" },
      { name: "Main Rotor", status: "serviceable", lastCheck: "2024-12-10" },
      { name: "Tail Rotor", status: "attention", lastCheck: "2024-12-18", notes: "Minor vibration reported" },
      { name: "Avionics", status: "serviceable", lastCheck: "2024-12-10" },
      { name: "Hydraulics", status: "serviceable", lastCheck: "2024-12-10" },
      { name: "Electrical", status: "serviceable", lastCheck: "2024-12-10" },
    ],
    faults: [
      {
        id: "f1",
        system: "Tail Rotor",
        description: "Vibration during high-speed flight",
        severity: "minor",
        reportedDate: "2024-12-18",
        status: "open",
      },
    ],
    overallStatus: "flyable",
  },
  {
    id: "d2",
    aircraft: "Rudra (ALH WSI)",
    registration: "Z-3203",
    inspectionDate: "2024-12-05",
    nextInspection: "2024-12-20",
    totalHours: 980,
    hoursToService: 0,
    systems: [
      { name: "Engine", status: "attention", lastCheck: "2024-12-05", notes: "50-hour inspection due" },
      { name: "Main Rotor", status: "serviceable", lastCheck: "2024-12-05" },
      { name: "Tail Rotor", status: "serviceable", lastCheck: "2024-12-05" },
      { name: "Avionics", status: "serviceable", lastCheck: "2024-12-05" },
      { name: "Weapons", status: "serviceable", lastCheck: "2024-12-05" },
      { name: "Hydraulics", status: "serviceable", lastCheck: "2024-12-05" },
    ],
    faults: [],
    overallStatus: "restricted",
  },
  {
    id: "d3",
    aircraft: "ALH Dhruv",
    registration: "Z-3202",
    inspectionDate: "2024-12-15",
    nextInspection: "2024-12-30",
    totalHours: 1890,
    hoursToService: 110,
    systems: [
      { name: "Engine", status: "serviceable", lastCheck: "2024-12-15" },
      { name: "Main Rotor", status: "serviceable", lastCheck: "2024-12-15" },
      { name: "Tail Rotor", status: "serviceable", lastCheck: "2024-12-15" },
      { name: "Avionics", status: "serviceable", lastCheck: "2024-12-17", notes: "Software updated to v2.3.1" },
      { name: "Hydraulics", status: "serviceable", lastCheck: "2024-12-15" },
      { name: "Electrical", status: "serviceable", lastCheck: "2024-12-15" },
    ],
    faults: [],
    overallStatus: "flyable",
  },
];

const mockInventory: SpareInventory[] = [
  {
    id: "i1",
    partNumber: "ALH-FLT-001",
    description: "Oil Filter - Main Engine",
    category: "consumable",
    aircraft: ["ALH Dhruv", "Rudra"],
    quantity: 12,
    minStock: 5,
    maxStock: 20,
    location: "Rack A-12",
    unitPrice: 2500,
    leadTime: "7 days",
    status: "in-stock",
  },
  {
    id: "i2",
    partNumber: "ALH-HYD-015",
    description: "Hydraulic Seal Kit",
    category: "consumable",
    aircraft: ["ALH Dhruv", "Rudra"],
    quantity: 3,
    minStock: 5,
    maxStock: 15,
    location: "Rack B-05",
    unitPrice: 15000,
    leadTime: "14 days",
    status: "low-stock",
  },
  {
    id: "i3",
    partNumber: "ALH-MRB-101",
    description: "Main Rotor Blade",
    category: "rotable",
    aircraft: ["ALH Dhruv", "Rudra"],
    quantity: 2,
    minStock: 2,
    maxStock: 4,
    location: "Blade Store",
    unitPrice: 1500000,
    leadTime: "60 days",
    status: "in-stock",
  },
  {
    id: "i4",
    partNumber: "CHEK-ENG-002",
    description: "Engine Oil Filter - Chetak",
    category: "consumable",
    aircraft: ["Chetak"],
    quantity: 0,
    minStock: 3,
    maxStock: 10,
    location: "Rack A-08",
    unitPrice: 1800,
    lastOrdered: "2024-12-15",
    leadTime: "5 days",
    status: "on-order",
  },
  {
    id: "i5",
    partNumber: "ALH-AVN-050",
    description: "GPS Antenna Unit",
    category: "repairable",
    aircraft: ["ALH Dhruv", "Rudra"],
    quantity: 1,
    minStock: 2,
    maxStock: 3,
    location: "Avionics Store",
    unitPrice: 85000,
    leadTime: "30 days",
    status: "low-stock",
  },
];

const mockTraining: MaintenanceTraining[] = [
  {
    id: "mt1",
    title: "ALH Dhruv Type Rating",
    code: "ALH-MNT-100",
    aircraft: "ALH Dhruv",
    category: "type-rating",
    duration: "4 weeks",
    description: "Complete maintenance type rating for ALH Dhruv helicopter",
    status: "completed",
    progress: 100,
    certification: {
      issued: "2023-06-15",
      expires: "2025-06-15",
      number: "MNT-ALH-2023-045",
    },
  },
  {
    id: "mt2",
    title: "Rudra Weapons Systems Maintenance",
    code: "RUD-WPN-200",
    aircraft: "Rudra (ALH WSI)",
    category: "special",
    duration: "2 weeks",
    description: "Specialized training for Rudra weapons system maintenance",
    status: "in-progress",
    progress: 60,
  },
  {
    id: "mt3",
    title: "Annual Safety Recurrent",
    code: "SAF-REC-001",
    aircraft: "All",
    category: "recurrent",
    duration: "2 days",
    description: "Annual safety and hazmat recurrent training",
    status: "not-started",
    progress: 0,
  },
];

interface GroundCrewState {
  tasks: MaintenanceTask[];
  diagnostics: AircraftDiagnostic[];
  inventory: SpareInventory[];
  training: MaintenanceTraining[];

  // Task actions
  addTask: (task: Omit<MaintenanceTask, "id">) => void;
  updateTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  removeTask: (id: string) => void;

  // Diagnostic actions
  updateDiagnostic: (id: string, updates: Partial<AircraftDiagnostic>) => void;
  addFault: (diagnosticId: string, fault: Omit<AircraftDiagnostic["faults"][0], "id">) => void;
  closeFault: (diagnosticId: string, faultId: string) => void;

  // Inventory actions
  updateInventory: (id: string, updates: Partial<SpareInventory>) => void;
  adjustStock: (id: string, quantity: number, type: "add" | "remove") => void;

  // Training actions
  updateTrainingProgress: (id: string, progress: number) => void;

  // Stats
  getGroundCrewStats: () => {
    pendingTasks: number;
    urgentTasks: number;
    aircraftServiceable: number;
    lowStockItems: number;
    openFaults: number;
  };
}

export const useGroundCrewStore = create<GroundCrewState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      diagnostics: mockDiagnostics,
      inventory: mockInventory,
      training: mockTraining,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: `t${Date.now()}` }],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      updateDiagnostic: (id, updates) =>
        set((state) => ({
          diagnostics: state.diagnostics.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      addFault: (diagnosticId, fault) =>
        set((state) => ({
          diagnostics: state.diagnostics.map((d) =>
            d.id === diagnosticId
              ? {
                  ...d,
                  faults: [...d.faults, { ...fault, id: `f${Date.now()}` }],
                }
              : d
          ),
        })),

      closeFault: (diagnosticId, faultId) =>
        set((state) => ({
          diagnostics: state.diagnostics.map((d) =>
            d.id === diagnosticId
              ? {
                  ...d,
                  faults: d.faults.map((f) =>
                    f.id === faultId ? { ...f, status: "closed" } : f
                  ),
                }
              : d
          ),
        })),

      updateInventory: (id, updates) =>
        set((state) => ({
          inventory: state.inventory.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),

      adjustStock: (id, quantity, type) =>
        set((state) => ({
          inventory: state.inventory.map((i) => {
            if (i.id !== id) return i;
            const newQty = type === "add" ? i.quantity + quantity : i.quantity - quantity;
            let status: SpareInventory["status"] = "in-stock";
            if (newQty <= 0) status = "out-of-stock";
            else if (newQty <= i.minStock) status = "low-stock";
            return { ...i, quantity: Math.max(0, newQty), status };
          }),
        })),

      updateTrainingProgress: (id, progress) =>
        set((state) => ({
          training: state.training.map((t) =>
            t.id === id
              ? {
                  ...t,
                  progress,
                  status: progress >= 100 ? "completed" : progress > 0 ? "in-progress" : "not-started",
                }
              : t
          ),
        })),

      getGroundCrewStats: () => {
        const state = get();
        return {
          pendingTasks: state.tasks.filter((t) => t.status === "pending" || t.status === "in-progress").length,
          urgentTasks: state.tasks.filter((t) => t.priority === "urgent" || t.priority === "aog").length,
          aircraftServiceable: state.diagnostics.filter((d) => d.overallStatus === "flyable").length,
          lowStockItems: state.inventory.filter((i) => i.status === "low-stock" || i.status === "out-of-stock").length,
          openFaults: state.diagnostics.reduce((sum, d) => sum + d.faults.filter((f) => f.status === "open").length, 0),
        };
      },
    }),
    {
      name: "groundcrew-storage",
    }
  )
);
