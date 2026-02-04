"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface FlightCrewMember {
  id: string;
  rank: string;
  name: string;
  serviceNumber: string;
  role: "pilot" | "copilot" | "gunner" | "crew-chief" | "loadmaster";
  qualification: string[];
  status: "active" | "on-leave" | "medical" | "training";
  totalHours: number;
  currentAircraft: string;
  lastFlight: string;
  medicalStatus: "valid" | "expiring" | "expired";
  checkrideStatus: "current" | "due" | "overdue";
}

export interface FlightMission {
  id: string;
  missionCode: string;
  title: string;
  type: "training" | "operational" | "medevac" | "transport" | "reconnaissance" | "combat";
  priority: "routine" | "priority" | "urgent" | "emergency";
  status: "planned" | "briefed" | "in-flight" | "completed" | "cancelled" | "aborted";
  aircraft: string;
  registration: string;
  crew: {
    role: string;
    memberId: string;
    memberName: string;
  }[];
  departure: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  objectives: string[];
  briefingNotes: string;
  weatherConditions?: string;
}

export interface FlightScheduleEvent {
  id: string;
  title: string;
  type: "flight" | "briefing" | "maintenance" | "training" | "standby" | "leave";
  date: string;
  startTime: string;
  endTime: string;
  aircraft?: string;
  crew?: string[];
  location: string;
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

export interface SquadronReport {
  id: string;
  title: string;
  type: "readiness" | "operations" | "training" | "safety" | "maintenance";
  period: string;
  generatedAt: string;
  metrics: {
    label: string;
    value: number;
    unit: string;
    trend: "up" | "down" | "stable";
  }[];
  highlights: string[];
  concerns: string[];
}

export interface Aircraft {
  id: string;
  type: string;
  registration: string;
  status: "operational" | "maintenance" | "grounded" | "deployed";
  totalHours: number;
  hoursToService: number;
  location: string;
  lastMission?: string;
  crew?: string[];
}

// Mock Data
const mockCrewMembers: FlightCrewMember[] = [
  {
    id: "c1",
    rank: "Wg Cdr",
    name: "Arjun Rao",
    serviceNumber: "AVN-15234",
    role: "pilot",
    qualification: ["ALH Dhruv", "Chetak", "NVG"],
    status: "active",
    totalHours: 1250,
    currentAircraft: "ALH Dhruv",
    lastFlight: "2024-12-18",
    medicalStatus: "valid",
    checkrideStatus: "current",
  },
  {
    id: "c2",
    rank: "Sqn Ldr",
    name: "Priya Nair",
    serviceNumber: "AVN-16789",
    role: "copilot",
    qualification: ["ALH Dhruv", "Chetak"],
    status: "active",
    totalHours: 850,
    currentAircraft: "ALH Dhruv",
    lastFlight: "2024-12-17",
    medicalStatus: "valid",
    checkrideStatus: "due",
  },
  {
    id: "c3",
    rank: "Sgt",
    name: "Mohan Das",
    serviceNumber: "AVN-23456",
    role: "crew-chief",
    qualification: ["ALH Dhruv", "Rudra"],
    status: "active",
    totalHours: 2100,
    currentAircraft: "ALH Dhruv",
    lastFlight: "2024-12-18",
    medicalStatus: "expiring",
    checkrideStatus: "current",
  },
  {
    id: "c4",
    rank: "Flt Lt",
    name: "Ravi Sharma",
    serviceNumber: "AVN-18234",
    role: "pilot",
    qualification: ["Rudra", "ALH Dhruv", "Weapons"],
    status: "training",
    totalHours: 620,
    currentAircraft: "Rudra",
    lastFlight: "2024-12-15",
    medicalStatus: "valid",
    checkrideStatus: "current",
  },
  {
    id: "c5",
    rank: "WO",
    name: "Suresh Kumar",
    serviceNumber: "AVN-12345",
    role: "gunner",
    qualification: ["Rudra Weapons", "Door Gunner"],
    status: "active",
    totalHours: 1800,
    currentAircraft: "Rudra",
    lastFlight: "2024-12-16",
    medicalStatus: "valid",
    checkrideStatus: "current",
  },
];

const mockMissions: FlightMission[] = [
  {
    id: "m1",
    missionCode: "OPS-241219-A",
    title: "Forward Area Reconnaissance",
    type: "reconnaissance",
    priority: "priority",
    status: "planned",
    aircraft: "ALH Dhruv",
    registration: "Z-3201",
    crew: [
      { role: "Pilot", memberId: "c1", memberName: "Wg Cdr Arjun Rao" },
      { role: "Co-Pilot", memberId: "c2", memberName: "Sqn Ldr Priya Nair" },
      { role: "Crew Chief", memberId: "c3", memberName: "Sgt Mohan Das" },
    ],
    departure: "VIJP",
    destination: "Forward Operating Base Alpha",
    scheduledDeparture: "2024-12-20T06:00:00",
    scheduledArrival: "2024-12-20T09:30:00",
    objectives: [
      "Conduct aerial surveillance of sector 7",
      "Photograph key terrain features",
      "Report enemy movement if any",
    ],
    briefingNotes: "Weather expected to be clear. Maintain altitude above 500ft AGL.",
  },
  {
    id: "m2",
    missionCode: "TRN-241220-B",
    title: "NVG Training Sortie",
    type: "training",
    priority: "routine",
    status: "planned",
    aircraft: "ALH Dhruv",
    registration: "Z-3202",
    crew: [
      { role: "Instructor", memberId: "c1", memberName: "Wg Cdr Arjun Rao" },
      { role: "Trainee", memberId: "c4", memberName: "Flt Lt Ravi Sharma" },
    ],
    departure: "VIJP",
    destination: "Training Area Bravo",
    scheduledDeparture: "2024-12-20T18:30:00",
    scheduledArrival: "2024-12-20T21:00:00",
    objectives: [
      "Complete NVG currency requirements",
      "Practice tactical approaches",
      "Execute brownout landing procedures",
    ],
    briefingNotes: "New moon phase - excellent NVG conditions.",
  },
  {
    id: "m3",
    missionCode: "MED-241218-A",
    title: "Medical Evacuation",
    type: "medevac",
    priority: "emergency",
    status: "completed",
    aircraft: "ALH Dhruv",
    registration: "Z-3201",
    crew: [
      { role: "Pilot", memberId: "c1", memberName: "Wg Cdr Arjun Rao" },
      { role: "Co-Pilot", memberId: "c2", memberName: "Sqn Ldr Priya Nair" },
    ],
    departure: "VIJP",
    destination: "Army Hospital",
    scheduledDeparture: "2024-12-18T14:00:00",
    scheduledArrival: "2024-12-18T15:30:00",
    actualDeparture: "2024-12-18T14:15:00",
    actualArrival: "2024-12-18T15:45:00",
    objectives: ["Evacuate injured personnel", "Deliver medical supplies"],
    briefingNotes: "Successfully evacuated 2 casualties.",
  },
];

const mockSchedule: FlightScheduleEvent[] = [
  {
    id: "e1",
    title: "Morning Briefing",
    type: "briefing",
    date: "2024-12-20",
    startTime: "05:30",
    endTime: "06:00",
    location: "Operations Room",
    status: "scheduled",
    notes: "Daily operations brief",
  },
  {
    id: "e2",
    title: "Reconnaissance Mission",
    type: "flight",
    date: "2024-12-20",
    startTime: "06:00",
    endTime: "09:30",
    aircraft: "Z-3201",
    crew: ["c1", "c2", "c3"],
    location: "VIJP",
    status: "scheduled",
  },
  {
    id: "e3",
    title: "NVG Training",
    type: "training",
    date: "2024-12-20",
    startTime: "18:30",
    endTime: "21:00",
    aircraft: "Z-3202",
    crew: ["c1", "c4"],
    location: "Training Area Bravo",
    status: "scheduled",
  },
  {
    id: "e4",
    title: "Aircraft Inspection - Z-3203",
    type: "maintenance",
    date: "2024-12-21",
    startTime: "08:00",
    endTime: "16:00",
    aircraft: "Z-3203",
    location: "Hangar",
    status: "scheduled",
    notes: "50-hour inspection",
  },
];

const mockReports: SquadronReport[] = [
  {
    id: "r1",
    title: "Monthly Readiness Report",
    type: "readiness",
    period: "December 2024",
    generatedAt: "2024-12-15",
    metrics: [
      { label: "Aircraft Availability", value: 85, unit: "%", trend: "up" },
      { label: "Crew Readiness", value: 92, unit: "%", trend: "stable" },
      { label: "Mission Success Rate", value: 98, unit: "%", trend: "up" },
      { label: "Flying Hours", value: 245, unit: "hrs", trend: "up" },
    ],
    highlights: [
      "All NVG currency requirements met",
      "Zero safety incidents this month",
      "New co-pilot qualified on ALH Dhruv",
    ],
    concerns: ["One aircraft due for major service", "Medical renewal pending for 1 crew member"],
  },
];

const mockAircraft: Aircraft[] = [
  {
    id: "a1",
    type: "ALH Dhruv",
    registration: "Z-3201",
    status: "operational",
    totalHours: 2450,
    hoursToService: 50,
    location: "Hangar A",
    lastMission: "MED-241218-A",
  },
  {
    id: "a2",
    type: "ALH Dhruv",
    registration: "Z-3202",
    status: "operational",
    totalHours: 1890,
    hoursToService: 110,
    location: "Hangar A",
  },
  {
    id: "a3",
    type: "Rudra (ALH WSI)",
    registration: "Z-3203",
    status: "maintenance",
    totalHours: 980,
    hoursToService: 0,
    location: "Maintenance Bay",
  },
  {
    id: "a4",
    type: "Chetak",
    registration: "Z-2105",
    status: "operational",
    totalHours: 4200,
    hoursToService: 25,
    location: "Hangar B",
  },
];

interface CommanderState {
  crewMembers: FlightCrewMember[];
  missions: FlightMission[];
  schedule: FlightScheduleEvent[];
  reports: SquadronReport[];
  aircraft: Aircraft[];

  // Crew actions
  addCrewMember: (member: Omit<FlightCrewMember, "id">) => void;
  updateCrewMember: (id: string, updates: Partial<FlightCrewMember>) => void;
  removeCrewMember: (id: string) => void;

  // Mission actions
  addMission: (mission: Omit<FlightMission, "id">) => void;
  updateMission: (id: string, updates: Partial<FlightMission>) => void;
  removeMission: (id: string) => void;

  // Schedule actions
  addEvent: (event: Omit<FlightScheduleEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<FlightScheduleEvent>) => void;
  removeEvent: (id: string) => void;

  // Aircraft actions
  updateAircraft: (id: string, updates: Partial<Aircraft>) => void;

  // Stats
  getCommanderStats: () => {
    totalCrew: number;
    activeCrew: number;
    plannedMissions: number;
    operationalAircraft: number;
    flyingHoursThisMonth: number;
  };
}

export const useCommanderStore = create<CommanderState>()(
  persist(
    (set, get) => ({
      crewMembers: mockCrewMembers,
      missions: mockMissions,
      schedule: mockSchedule,
      reports: mockReports,
      aircraft: mockAircraft,

      addCrewMember: (member) =>
        set((state) => ({
          crewMembers: [...state.crewMembers, { ...member, id: `c${Date.now()}` }],
        })),

      updateCrewMember: (id, updates) =>
        set((state) => ({
          crewMembers: state.crewMembers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeCrewMember: (id) =>
        set((state) => ({
          crewMembers: state.crewMembers.filter((c) => c.id !== id),
        })),

      addMission: (mission) =>
        set((state) => ({
          missions: [...state.missions, { ...mission, id: `m${Date.now()}` }],
        })),

      updateMission: (id, updates) =>
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      removeMission: (id) =>
        set((state) => ({
          missions: state.missions.filter((m) => m.id !== id),
        })),

      addEvent: (event) =>
        set((state) => ({
          schedule: [...state.schedule, { ...event, id: `e${Date.now()}` }],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          schedule: state.schedule.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      removeEvent: (id) =>
        set((state) => ({
          schedule: state.schedule.filter((e) => e.id !== id),
        })),

      updateAircraft: (id, updates) =>
        set((state) => ({
          aircraft: state.aircraft.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      getCommanderStats: () => {
        const state = get();
        return {
          totalCrew: state.crewMembers.length,
          activeCrew: state.crewMembers.filter((c) => c.status === "active").length,
          plannedMissions: state.missions.filter((m) => m.status === "planned").length,
          operationalAircraft: state.aircraft.filter((a) => a.status === "operational").length,
          flyingHoursThisMonth: 245,
        };
      },
    }),
    {
      name: "commander-storage",
    }
  )
);
