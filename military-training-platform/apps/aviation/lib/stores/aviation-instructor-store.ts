import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ TYPES ============

export interface PilotTrainee {
  id: string;
  name: string;
  rank: string;
  serviceNumber: string;
  unit: string;
  squadron: string;
  batch: string;
  enrollmentDate: string;
  status: "active" | "on-leave" | "graduated" | "suspended";
  flightHours: number;
  simulatorHours: number;
  casCompetency: number; // Close Air Support competency %
  navigationScore: number;
  emergencyProceduresScore: number;
  communicationScore: number;
  overallScore: number;
  helicoptersCertified: string[];
  currentPhase: "ground-school" | "basic-flight" | "advanced" | "cas-training" | "joint-ops";
  notes: string;
}

export interface FlightScenario {
  id: string;
  name: string;
  description: string;
  type: "cas-mission" | "reconnaissance" | "troop-transport" | "medevac" | "search-rescue" | "nap-of-earth" | "night-ops";
  difficulty: "basic" | "intermediate" | "advanced" | "combat-ready";
  helicopterType: string;
  duration: number; // minutes
  objectives: string[];
  weatherConditions: {
    visibility: string;
    windSpeed: string;
    ceiling: string;
    conditions: "clear" | "overcast" | "rain" | "fog" | "night";
  };
  terrainType: "plains" | "mountains" | "urban" | "desert" | "jungle" | "maritime";
  threatLevel: "none" | "low" | "medium" | "high";
  coordinationRequired: boolean; // With FOO/Artillery
  passingScore: number;
  isActive: boolean;
  createdAt: string;
}

export interface FlightSession {
  id: string;
  title: string;
  type: "ground-school" | "simulator" | "dual-flight" | "solo-flight" | "cas-exercise" | "joint-exercise";
  date: string;
  startTime: string;
  endTime: string;
  pilotIds: string[];
  scenarioId?: string;
  helicopterType: string;
  location: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  preFlightBriefing: boolean;
  postFlightDebriefing: boolean;
  weatherApproved: boolean;
  jointWithArtillery: boolean;
  artilleryInstructorId?: string;
  notes: string;
  flightPlanApproved: boolean;
}

export interface PilotAssessment {
  id: string;
  pilotId: string;
  pilotName: string;
  type: "written" | "oral" | "simulator-check" | "flight-check" | "cas-evaluation" | "final-checkride";
  date: string;
  status: "scheduled" | "in-progress" | "completed" | "failed" | "retake";
  scores: {
    preFlightProcedures?: number;
    takeoffLanding?: number;
    navigation?: number;
    emergencyProcedures?: number;
    communication?: number;
    casExecution?: number;
    crewCoordination?: number;
    decisionMaking?: number;
    overall?: number;
  };
  passingScore: number;
  passed?: boolean;
  examinerNotes: string;
  recommendations: string;
  retakeAllowed: boolean;
}

export interface FlightCurriculum {
  id: string;
  name: string;
  phase: "ground-school" | "basic-flight" | "advanced" | "cas-training" | "joint-ops";
  description: string;
  duration: {
    theoryHours: number;
    simulatorHours: number;
    flightHours: number;
    totalHours: number;
  };
  topics: {
    id: string;
    name: string;
    completed: boolean;
  }[];
  prerequisites: string[];
  helicopterTypes: string[];
  learningObjectives: string[];
  assessmentCriteria: string[];
  isActive: boolean;
}

export interface JointOperation {
  id: string;
  name: string;
  type: "cas-coordination" | "fire-support" | "tactical-insertion" | "medevac-under-fire" | "combined-arms";
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: "planning" | "approved" | "in-progress" | "completed" | "cancelled";
  pilotIds: string[];
  artilleryTraineeIds: string[];
  scenarioId?: string;
  helicopterTypes: string[];
  artilleryAssets: string[];
  objectives: string[];
  safetyOfficer: string;
  flightLeader: string;
  groundCommander: string;
  communicationPlan: string;
  weatherMinimums: string;
  results?: {
    objectivesAchieved: number;
    totalObjectives: number;
    coordinationRating: number;
    safetyIncidents: number;
    lessonsLearned: string;
  };
}

// ============ STORE ============

interface AviationInstructorState {
  // Data
  pilots: PilotTrainee[];
  scenarios: FlightScenario[];
  sessions: FlightSession[];
  assessments: PilotAssessment[];
  curriculum: FlightCurriculum[];
  jointOperations: JointOperation[];

  // Pilot CRUD
  addPilot: (pilot: Omit<PilotTrainee, "id">) => void;
  updatePilot: (id: string, updates: Partial<PilotTrainee>) => void;
  deletePilot: (id: string) => void;

  // Scenario CRUD
  addScenario: (scenario: Omit<FlightScenario, "id">) => void;
  updateScenario: (id: string, updates: Partial<FlightScenario>) => void;
  deleteScenario: (id: string) => void;

  // Session CRUD
  addSession: (session: Omit<FlightSession, "id">) => void;
  updateSession: (id: string, updates: Partial<FlightSession>) => void;
  deleteSession: (id: string) => void;

  // Assessment CRUD
  addAssessment: (assessment: Omit<PilotAssessment, "id">) => void;
  updateAssessment: (id: string, updates: Partial<PilotAssessment>) => void;
  deleteAssessment: (id: string) => void;

  // Curriculum CRUD
  addCurriculum: (curriculum: Omit<FlightCurriculum, "id">) => void;
  updateCurriculum: (id: string, updates: Partial<FlightCurriculum>) => void;
  deleteCurriculum: (id: string) => void;

  // Joint Operation CRUD
  addJointOperation: (operation: Omit<JointOperation, "id">) => void;
  updateJointOperation: (id: string, updates: Partial<JointOperation>) => void;
  deleteJointOperation: (id: string) => void;

  // Helpers
  getPilotById: (id: string) => PilotTrainee | undefined;
  getScenarioById: (id: string) => FlightScenario | undefined;
  getInstructorStats: () => {
    totalPilots: number;
    activePilots: number;
    totalScenarios: number;
    totalSessions: number;
    pendingAssessments: number;
    jointOperations: number;
    avgCASCompetency: number;
  };
}

// ============ MOCK DATA ============

const mockPilots: PilotTrainee[] = [
  {
    id: "PLT-001",
    name: "Capt Vikram Singh",
    rank: "Captain",
    serviceNumber: "IC-78234",
    unit: "Army Aviation Corps",
    squadron: "662 Squadron",
    batch: "JFSP-2024-A",
    enrollmentDate: "2024-01-15",
    status: "active",
    flightHours: 145,
    simulatorHours: 80,
    casCompetency: 78,
    navigationScore: 85,
    emergencyProceduresScore: 82,
    communicationScore: 88,
    overallScore: 83,
    helicoptersCertified: ["ALH Dhruv", "Chetak"],
    currentPhase: "cas-training",
    notes: "Strong CAS aptitude, excellent communication skills",
  },
  {
    id: "PLT-002",
    name: "Lt Priya Sharma",
    rank: "Lieutenant",
    serviceNumber: "IC-82156",
    unit: "Army Aviation Corps",
    squadron: "662 Squadron",
    batch: "JFSP-2024-A",
    enrollmentDate: "2024-01-15",
    status: "active",
    flightHours: 95,
    simulatorHours: 65,
    casCompetency: 72,
    navigationScore: 88,
    emergencyProceduresScore: 79,
    communicationScore: 85,
    overallScore: 81,
    helicoptersCertified: ["ALH Dhruv"],
    currentPhase: "advanced",
    notes: "Excellent navigation skills, needs more CAS practice",
  },
  {
    id: "PLT-003",
    name: "Maj Rajesh Kumar",
    rank: "Major",
    serviceNumber: "IC-65432",
    unit: "Army Aviation Corps",
    squadron: "661 Squadron",
    batch: "JFSP-2024-B",
    enrollmentDate: "2024-03-01",
    status: "active",
    flightHours: 320,
    simulatorHours: 120,
    casCompetency: 92,
    navigationScore: 94,
    emergencyProceduresScore: 96,
    communicationScore: 91,
    overallScore: 93,
    helicoptersCertified: ["ALH Dhruv", "Rudra", "Chetak"],
    currentPhase: "joint-ops",
    notes: "Experienced pilot, ready for instructor certification",
  },
  {
    id: "PLT-004",
    name: "Capt Ananya Reddy",
    rank: "Captain",
    serviceNumber: "IC-79845",
    unit: "Army Aviation Corps",
    squadron: "663 Squadron",
    batch: "JFSP-2024-B",
    enrollmentDate: "2024-03-01",
    status: "active",
    flightHours: 180,
    simulatorHours: 95,
    casCompetency: 85,
    navigationScore: 82,
    emergencyProceduresScore: 88,
    communicationScore: 90,
    overallScore: 86,
    helicoptersCertified: ["ALH Dhruv", "Rudra"],
    currentPhase: "cas-training",
    notes: "Strong tactical awareness, good crew coordination",
  },
];

const mockScenarios: FlightScenario[] = [
  {
    id: "SCN-001",
    name: "Basic CAS Run - Day",
    description: "Introductory Close Air Support mission with ground force coordination",
    type: "cas-mission",
    difficulty: "basic",
    helicopterType: "ALH Dhruv",
    duration: 45,
    objectives: [
      "Establish communication with FOO",
      "Execute controlled approach",
      "Engage designated target",
      "Execute safe egress",
    ],
    weatherConditions: {
      visibility: "10km+",
      windSpeed: "5-10 knots",
      ceiling: "3000ft AGL",
      conditions: "clear",
    },
    terrainType: "plains",
    threatLevel: "none",
    coordinationRequired: true,
    passingScore: 70,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "SCN-002",
    name: "Mountain CAS - Intermediate",
    description: "CAS mission in mountainous terrain with limited LZ options",
    type: "cas-mission",
    difficulty: "intermediate",
    helicopterType: "Rudra",
    duration: 60,
    objectives: [
      "Navigate to AO through mountain passes",
      "Coordinate with FOO for target acquisition",
      "Execute weapons delivery in confined terrain",
      "Perform tactical extraction",
    ],
    weatherConditions: {
      visibility: "5-10km",
      windSpeed: "10-15 knots",
      ceiling: "2000ft AGL",
      conditions: "overcast",
    },
    terrainType: "mountains",
    threatLevel: "low",
    coordinationRequired: true,
    passingScore: 75,
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "SCN-003",
    name: "Night Reconnaissance",
    description: "Night reconnaissance mission with NVG operations",
    type: "reconnaissance",
    difficulty: "advanced",
    helicopterType: "ALH Dhruv",
    duration: 90,
    objectives: [
      "Conduct pre-mission NVG checks",
      "Execute low-level navigation",
      "Perform surveillance of designated areas",
      "Report enemy positions to command",
    ],
    weatherConditions: {
      visibility: "3-5km",
      windSpeed: "5-10 knots",
      ceiling: "2500ft AGL",
      conditions: "night",
    },
    terrainType: "plains",
    threatLevel: "medium",
    coordinationRequired: false,
    passingScore: 80,
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "SCN-004",
    name: "MEDEVAC Under Fire",
    description: "Medical evacuation from hot LZ with suppressive fire coordination",
    type: "medevac",
    difficulty: "combat-ready",
    helicopterType: "Rudra",
    duration: 75,
    objectives: [
      "Coordinate suppressive fire with artillery",
      "Execute tactical approach to hot LZ",
      "Perform rapid patient loading",
      "Egress under fire with evasive maneuvers",
    ],
    weatherConditions: {
      visibility: "5km",
      windSpeed: "15-20 knots",
      ceiling: "1500ft AGL",
      conditions: "overcast",
    },
    terrainType: "urban",
    threatLevel: "high",
    coordinationRequired: true,
    passingScore: 85,
    isActive: true,
    createdAt: "2024-02-15",
  },
];

const mockSessions: FlightSession[] = [
  {
    id: "SES-001",
    title: "Basic CAS Procedures",
    type: "simulator",
    date: "2024-12-20",
    startTime: "09:00",
    endTime: "12:00",
    pilotIds: ["PLT-001", "PLT-002"],
    scenarioId: "SCN-001",
    helicopterType: "ALH Dhruv",
    location: "Simulator Bay 1",
    status: "completed",
    preFlightBriefing: true,
    postFlightDebriefing: true,
    weatherApproved: true,
    jointWithArtillery: true,
    artilleryInstructorId: "ART-INS-001",
    notes: "Good performance from both pilots",
    flightPlanApproved: true,
  },
  {
    id: "SES-002",
    title: "Mountain Flying Techniques",
    type: "dual-flight",
    date: "2024-12-22",
    startTime: "06:00",
    endTime: "09:00",
    pilotIds: ["PLT-004"],
    helicopterType: "Rudra",
    location: "Training Area Alpha",
    status: "scheduled",
    preFlightBriefing: false,
    postFlightDebriefing: false,
    weatherApproved: true,
    jointWithArtillery: false,
    notes: "Focus on power management in high altitude",
    flightPlanApproved: true,
  },
  {
    id: "SES-003",
    title: "Joint Fire Support Exercise",
    type: "joint-exercise",
    date: "2024-12-25",
    startTime: "08:00",
    endTime: "14:00",
    pilotIds: ["PLT-001", "PLT-003", "PLT-004"],
    scenarioId: "SCN-002",
    helicopterType: "Rudra",
    location: "Combined Arms Range",
    status: "scheduled",
    preFlightBriefing: false,
    postFlightDebriefing: false,
    weatherApproved: false,
    jointWithArtillery: true,
    artilleryInstructorId: "ART-INS-001",
    notes: "Full joint exercise with artillery coordination",
    flightPlanApproved: false,
  },
];

const mockAssessments: PilotAssessment[] = [
  {
    id: "ASM-001",
    pilotId: "PLT-001",
    pilotName: "Capt Vikram Singh",
    type: "cas-evaluation",
    date: "2024-12-18",
    status: "completed",
    scores: {
      preFlightProcedures: 88,
      takeoffLanding: 85,
      navigation: 82,
      emergencyProcedures: 80,
      communication: 90,
      casExecution: 78,
      crewCoordination: 85,
      decisionMaking: 82,
      overall: 84,
    },
    passingScore: 75,
    passed: true,
    examinerNotes: "Solid performance overall. CAS execution needs minor improvement.",
    recommendations: "Additional practice on weapons delivery timing",
    retakeAllowed: true,
  },
  {
    id: "ASM-002",
    pilotId: "PLT-002",
    pilotName: "Lt Priya Sharma",
    type: "flight-check",
    date: "2024-12-28",
    status: "scheduled",
    scores: {},
    passingScore: 70,
    examinerNotes: "",
    recommendations: "",
    retakeAllowed: true,
  },
];

const mockCurriculum: FlightCurriculum[] = [
  {
    id: "CUR-001",
    name: "Ground School - Aviation Fundamentals",
    phase: "ground-school",
    description: "Comprehensive ground training covering aviation theory, regulations, and procedures",
    duration: {
      theoryHours: 80,
      simulatorHours: 20,
      flightHours: 0,
      totalHours: 100,
    },
    topics: [
      { id: "T1", name: "Principles of Flight", completed: true },
      { id: "T2", name: "Aviation Meteorology", completed: true },
      { id: "T3", name: "Navigation Fundamentals", completed: true },
      { id: "T4", name: "Aircraft Systems - ALH Dhruv", completed: false },
      { id: "T5", name: "Aviation Regulations", completed: false },
      { id: "T6", name: "Human Factors", completed: false },
    ],
    prerequisites: [],
    helicopterTypes: ["ALH Dhruv"],
    learningObjectives: [
      "Understand principles of rotary wing flight",
      "Interpret weather conditions for flight planning",
      "Navigate using various methods",
      "Explain helicopter systems and limitations",
    ],
    assessmentCriteria: ["Written examination - 70% pass", "Systems knowledge oral exam"],
    isActive: true,
  },
  {
    id: "CUR-002",
    name: "Basic Flight Training",
    phase: "basic-flight",
    description: "Initial flight training covering basic maneuvers and procedures",
    duration: {
      theoryHours: 20,
      simulatorHours: 40,
      flightHours: 60,
      totalHours: 120,
    },
    topics: [
      { id: "T1", name: "Pre-flight Procedures", completed: true },
      { id: "T2", name: "Hover Operations", completed: true },
      { id: "T3", name: "Traffic Pattern Operations", completed: false },
      { id: "T4", name: "Basic Autorotations", completed: false },
      { id: "T5", name: "Emergency Procedures", completed: false },
    ],
    prerequisites: ["CUR-001"],
    helicopterTypes: ["ALH Dhruv", "Chetak"],
    learningObjectives: [
      "Execute stable hover",
      "Perform standard traffic patterns",
      "Demonstrate emergency procedures",
      "Complete solo flight",
    ],
    assessmentCriteria: ["Flight check - 75% pass", "Emergency procedures demonstration"],
    isActive: true,
  },
  {
    id: "CUR-003",
    name: "Close Air Support Training",
    phase: "cas-training",
    description: "Specialized training for CAS missions and artillery coordination",
    duration: {
      theoryHours: 30,
      simulatorHours: 50,
      flightHours: 40,
      totalHours: 120,
    },
    topics: [
      { id: "T1", name: "CAS Doctrine & Procedures", completed: false },
      { id: "T2", name: "Target Acquisition & Designation", completed: false },
      { id: "T3", name: "Artillery-Aviation Coordination", completed: false },
      { id: "T4", name: "Weapons Delivery Profiles", completed: false },
      { id: "T5", name: "Combat Communications", completed: false },
      { id: "T6", name: "Threat Assessment & Evasion", completed: false },
    ],
    prerequisites: ["CUR-001", "CUR-002"],
    helicopterTypes: ["Rudra", "ALH Dhruv"],
    learningObjectives: [
      "Coordinate with Forward Observation Officers",
      "Execute various CAS attack profiles",
      "Integrate with artillery fire support",
      "Operate in threat environments",
    ],
    assessmentCriteria: ["CAS evaluation - 80% pass", "Joint exercise completion"],
    isActive: true,
  },
];

const mockJointOperations: JointOperation[] = [
  {
    id: "JOP-001",
    name: "Exercise Steel Thunder",
    type: "cas-coordination",
    description: "Joint CAS exercise with integrated artillery fire support",
    date: "2024-12-28",
    startTime: "06:00",
    endTime: "14:00",
    location: "Combined Arms Training Center",
    status: "approved",
    pilotIds: ["PLT-001", "PLT-003"],
    artilleryTraineeIds: ["FOO-001", "FOO-002"],
    scenarioId: "SCN-002",
    helicopterTypes: ["Rudra"],
    artilleryAssets: ["155mm Howitzer", "120mm Mortar"],
    objectives: [
      "Establish air-ground communication",
      "Execute coordinated fire missions",
      "Practice danger close procedures",
      "Conduct battle damage assessment",
    ],
    safetyOfficer: "Maj P.K. Verma",
    flightLeader: "Maj Rajesh Kumar",
    groundCommander: "Col R.K. Sharma",
    communicationPlan: "Primary: TAC1 123.45, Secondary: TAC2 125.67, Emergency: Guard 121.5",
    weatherMinimums: "VFR conditions, ceiling >1500ft AGL, visibility >5km",
  },
  {
    id: "JOP-002",
    name: "Exercise Iron Hawk",
    type: "fire-support",
    description: "Integrated fire support exercise with multiple asset coordination",
    date: "2025-01-05",
    startTime: "08:00",
    endTime: "16:00",
    location: "Field Training Area Bravo",
    status: "planning",
    pilotIds: ["PLT-001", "PLT-002", "PLT-004"],
    artilleryTraineeIds: ["FOO-001", "FOO-003", "FOO-004"],
    helicopterTypes: ["Rudra", "ALH Dhruv"],
    artilleryAssets: ["Dhanush 155mm", "Pinaka MLRS"],
    objectives: [
      "Multi-aircraft coordination",
      "Sequential fire support",
      "Real-time target adjustment",
      "MEDEVAC under fire",
    ],
    safetyOfficer: "Lt Col S.N. Rao",
    flightLeader: "Capt Vikram Singh",
    groundCommander: "Col R.K. Sharma",
    communicationPlan: "TBD during planning phase",
    weatherMinimums: "MVFR minimum, ceiling >1000ft AGL, visibility >3km",
  },
];

// ============ STORE IMPLEMENTATION ============

export const useAviationInstructorStore = create<AviationInstructorState>()(
  persist(
    (set, get) => ({
      pilots: mockPilots,
      scenarios: mockScenarios,
      sessions: mockSessions,
      assessments: mockAssessments,
      curriculum: mockCurriculum,
      jointOperations: mockJointOperations,

      // Pilot CRUD
      addPilot: (pilot) =>
        set((state) => ({
          pilots: [...state.pilots, { ...pilot, id: `PLT-${Date.now()}` }],
        })),
      updatePilot: (id, updates) =>
        set((state) => ({
          pilots: state.pilots.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePilot: (id) =>
        set((state) => ({
          pilots: state.pilots.filter((p) => p.id !== id),
        })),

      // Scenario CRUD
      addScenario: (scenario) =>
        set((state) => ({
          scenarios: [...state.scenarios, { ...scenario, id: `SCN-${Date.now()}` }],
        })),
      updateScenario: (id, updates) =>
        set((state) => ({
          scenarios: state.scenarios.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteScenario: (id) =>
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== id),
        })),

      // Session CRUD
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: `SES-${Date.now()}` }],
        })),
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      // Assessment CRUD
      addAssessment: (assessment) =>
        set((state) => ({
          assessments: [...state.assessments, { ...assessment, id: `ASM-${Date.now()}` }],
        })),
      updateAssessment: (id, updates) =>
        set((state) => ({
          assessments: state.assessments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
      deleteAssessment: (id) =>
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        })),

      // Curriculum CRUD
      addCurriculum: (curriculum) =>
        set((state) => ({
          curriculum: [...state.curriculum, { ...curriculum, id: `CUR-${Date.now()}` }],
        })),
      updateCurriculum: (id, updates) =>
        set((state) => ({
          curriculum: state.curriculum.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCurriculum: (id) =>
        set((state) => ({
          curriculum: state.curriculum.filter((c) => c.id !== id),
        })),

      // Joint Operation CRUD
      addJointOperation: (operation) =>
        set((state) => ({
          jointOperations: [...state.jointOperations, { ...operation, id: `JOP-${Date.now()}` }],
        })),
      updateJointOperation: (id, updates) =>
        set((state) => ({
          jointOperations: state.jointOperations.map((j) =>
            j.id === id ? { ...j, ...updates } : j
          ),
        })),
      deleteJointOperation: (id) =>
        set((state) => ({
          jointOperations: state.jointOperations.filter((j) => j.id !== id),
        })),

      // Helpers
      getPilotById: (id) => get().pilots.find((p) => p.id === id),
      getScenarioById: (id) => get().scenarios.find((s) => s.id === id),
      getInstructorStats: () => {
        const state = get();
        const activePilots = state.pilots.filter((p) => p.status === "active");
        return {
          totalPilots: state.pilots.length,
          activePilots: activePilots.length,
          totalScenarios: state.scenarios.filter((s) => s.isActive).length,
          totalSessions: state.sessions.length,
          pendingAssessments: state.assessments.filter((a) => a.status === "scheduled").length,
          jointOperations: state.jointOperations.length,
          avgCASCompetency:
            activePilots.length > 0
              ? Math.round(
                  activePilots.reduce((sum, p) => sum + p.casCompetency, 0) / activePilots.length
                )
              : 0,
        };
      },
    }),
    { name: "aviation-instructor-store" }
  )
);
