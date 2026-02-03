import {
  Query,
  Document,
  SimulatorStats,
  SimulatorExercise,
  AuditLog,
  QueryResult,
  User,
  Question,
  UnitStats,
  TraineeProgress,
  Rubric,
  SubjectiveQuestion,
  ScheduledAssessment,
  AnswerScript,
  TraineeProgressHistory,
} from "@/types";

// =============================================================================
// MOCK USERS - For testing different roles
// Backend developer: Replace with API call to /api/auth/me
// =============================================================================

export const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Col. Rajesh Kumar",
    role: "admin",
    unit: "School of Artillery, Deolali",
  },
  {
    id: "USR002",
    name: "Maj. Priya Singh",
    role: "instructor",
    unit: "School of Artillery, Deolali",
  },
  {
    id: "USR003",
    name: "Brig. Suresh Nair",
    role: "leadership",
    unit: "School of Artillery, Deolali",
  },
  {
    id: "USR004",
    name: "Lt. Arjun Patel",
    role: "trainee",
    unit: "School of Artillery, Deolali",
  },
];

// Helper to get user by ID
export function getUserById(userId: string): User | undefined {
  return mockUsers.find(u => u.id === userId);
}

// =============================================================================
// KNOWLEDGE SEARCH RESPONSES
// Backend developer: Replace with API call to /api/search
// =============================================================================

export const mockResponses: Record<string, QueryResult> = {
  "range of 155mm": {
    answer: "The 155mm gun (Dhanush) has a maximum range of 36-38 km with base bleed ammunition and 24.7 km with standard HE ammunition. The sustained rate of fire is 3 rounds per minute with a maximum burst rate of 6 rounds per minute. The gun can achieve an elevation range of -3° to +70° and a traverse of 25° left and right.",
    sources: [
      { document: "Artillery_Field_Manual.pdf", page: 45 },
      { document: "Dhanush_Technical_Specs.pdf", page: 12 },
      { document: "Gunnery_Procedures.pdf", page: 78 },
    ],
    confidence: 0.95,
  },
  "fire control procedures": {
    answer: "Fire control procedures for indirect fire involve: 1) Target acquisition and designation, 2) Computation of firing data using ballistic computers or manual methods, 3) Laying of guns using aiming circles and panoramic telescopes, 4) Fire commands following standard format (Unit to fire, Ammunition, Target, Method of engagement), 5) Observation and adjustment of fire, 6) Fire for effect. All procedures must comply with ROE and target verification protocols.",
    sources: [
      { document: "Fire_Control_Manual.pdf", page: 23 },
      { document: "Gunnery_Procedures.pdf", page: 156 },
    ],
    confidence: 0.92,
  },
  "battery deployment": {
    answer: "Standard battery deployment involves: Position area selection considering cover, concealment, routes, and fields of fire. Battery layout follows diamond or linear configuration based on terrain. Gun spacing is typically 50-100m for conventional operations. Command post positioned for optimal communication with FDC and OP. Ammunition points established with 0.5 basic load immediate access. Survivability measures include alternate positions, camouflage, and counter-battery defense.",
    sources: [
      { document: "Artillery_Field_Manual.pdf", page: 89 },
      { document: "Battery_Operations_SOP.pdf", page: 34 },
    ],
    confidence: 0.88,
  },
  "ammunition types": {
    answer: "Standard ammunition types for 155mm systems include: HE (High Explosive) for personnel and light fortifications, HERA (HE Rocket Assisted) for extended range, Smoke for screening and marking, Illumination for battlefield illumination, ICM (Improved Conventional Munitions) for area targets, Precision Guided Munitions (Krasnopol, Excalibur equivalent) for point targets, and Base Bleed rounds for maximum range engagement.",
    sources: [
      { document: "Ammunition_Handbook.pdf", page: 12 },
      { document: "Technical_Specs.pdf", page: 45 },
      { document: "Gunnery_Tables.pdf", page: 3 },
    ],
    confidence: 0.94,
  },
};

// =============================================================================
// RECENT QUERIES - User-specific data
// Backend developer: Replace with API call to /api/queries?userId=<userId>
// =============================================================================

export const mockRecentQueries: Query[] = [
  // Admin queries (USR001)
  {
    id: "Q001",
    query: "What is the range of 155mm gun?",
    result: mockResponses["range of 155mm"],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    userId: "USR001",
  },
  {
    id: "Q002",
    query: "Fire control procedures for indirect fire",
    result: mockResponses["fire control procedures"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    userId: "USR001",
  },
  // Instructor queries (USR002)
  {
    id: "Q003",
    query: "Standard battery deployment patterns",
    result: mockResponses["battery deployment"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    userId: "USR002",
  },
  {
    id: "Q004",
    query: "Types of ammunition for 155mm",
    result: mockResponses["ammunition types"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    userId: "USR002",
  },
  // Instructor queries (USR003)
  {
    id: "Q005",
    query: "Fire control procedures for indirect fire",
    result: mockResponses["fire control procedures"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    userId: "USR003",
  },
  // Trainee queries (USR004)
  {
    id: "Q006",
    query: "What is the range of 155mm gun?",
    result: mockResponses["range of 155mm"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    userId: "USR004",
  },
  {
    id: "Q007",
    query: "Types of ammunition for 155mm",
    result: mockResponses["ammunition types"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    userId: "USR004",
  },
  // Trainee queries (USR005)
  {
    id: "Q008",
    query: "Standard battery deployment patterns",
    result: mockResponses["battery deployment"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    userId: "USR005",
  },
];

// Helper to get queries for a specific user
export function getQueriesByUserId(userId: string): Query[] {
  return mockRecentQueries.filter(q => q.userId === userId);
}

// =============================================================================
// DOCUMENTS - Accessible to admin & instructors
// Backend developer: Replace with API call to /api/documents
// =============================================================================

export const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Artillery Field Manual",
    type: "PDF",
    pages: 342,
    category: "Doctrine",
    uploadedAt: new Date("2024-01-15"),
    size: "24.5 MB",
  },
  {
    id: 2,
    name: "Firing Procedures SOP",
    type: "PDF",
    pages: 89,
    category: "SOP",
    uploadedAt: new Date("2024-02-20"),
    size: "8.2 MB",
  },
  {
    id: 3,
    name: "Dhanush Technical Specifications",
    type: "PDF",
    pages: 156,
    category: "Technical",
    uploadedAt: new Date("2024-01-10"),
    size: "45.8 MB",
  },
  {
    id: 4,
    name: "Gunnery Tables - 155mm",
    type: "PDF",
    pages: 78,
    category: "Reference",
    uploadedAt: new Date("2024-03-01"),
    size: "5.1 MB",
  },
  {
    id: 5,
    name: "Fire Control Manual",
    type: "PDF",
    pages: 234,
    category: "Doctrine",
    uploadedAt: new Date("2024-02-15"),
    size: "18.7 MB",
  },
  {
    id: 6,
    name: "Ammunition Handling Procedures",
    type: "PDF",
    pages: 112,
    category: "SOP",
    uploadedAt: new Date("2024-01-25"),
    size: "12.3 MB",
  },
  {
    id: 7,
    name: "Battery Operations SOP",
    type: "PDF",
    pages: 67,
    category: "SOP",
    uploadedAt: new Date("2024-03-10"),
    size: "6.8 MB",
  },
  {
    id: 8,
    name: "Counter-Battery Operations",
    type: "PDF",
    pages: 189,
    category: "Doctrine",
    uploadedAt: new Date("2024-02-28"),
    size: "22.1 MB",
  },
];

// =============================================================================
// SIMULATOR STATS - System-wide (admin/instructor view)
// Backend developer: Replace with API call to /api/simulator/stats
// =============================================================================

export const mockSimulatorStats: SimulatorStats = {
  totalExercises: 1247,
  avgAccuracy: 78.5,
  totalParticipants: 3456,
  commonErrors: [
    "Elevation miscalculation",
    "Wind correction errors",
    "Range estimation deviation",
    "Incorrect ammunition selection",
    "Fire command sequence errors",
  ],
  exercisesByMonth: [
    { month: "Aug", count: 145 },
    { month: "Sep", count: 178 },
    { month: "Oct", count: 165 },
    { month: "Nov", count: 198 },
    { month: "Dec", count: 156 },
    { month: "Jan", count: 187 },
  ],
  accuracyTrend: [
    { date: "Aug", accuracy: 72.3 },
    { date: "Sep", accuracy: 74.8 },
    { date: "Oct", accuracy: 76.1 },
    { date: "Nov", accuracy: 77.4 },
    { date: "Dec", accuracy: 78.2 },
    { date: "Jan", accuracy: 78.5 },
  ],
};

// =============================================================================
// USER-SPECIFIC STATS
// Backend developer: Replace with API call to /api/users/<userId>/stats
// =============================================================================

export interface UserStats {
  queriesThisMonth: number;
  quizzesTaken: number;
  avgQuizScore: number;
  trainingSessionsCompleted: number;
  lastActiveDate: Date;
}

export const mockUserStats: Record<string, UserStats> = {
  USR001: {
    queriesThisMonth: 45,
    quizzesTaken: 12,
    avgQuizScore: 92,
    trainingSessionsCompleted: 8,
    lastActiveDate: new Date(),
  },
  USR002: {
    queriesThisMonth: 78,
    quizzesTaken: 25,
    avgQuizScore: 88,
    trainingSessionsCompleted: 15,
    lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  USR003: {
    queriesThisMonth: 15,
    quizzesTaken: 0,
    avgQuizScore: 0,
    trainingSessionsCompleted: 0,
    lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  USR004: {
    queriesThisMonth: 56,
    quizzesTaken: 32,
    avgQuizScore: 76,
    trainingSessionsCompleted: 22,
    lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 1),
  },
};

export function getUserStats(userId: string): UserStats | undefined {
  return mockUserStats[userId];
}

// =============================================================================
// SIMULATOR EXERCISES
// Backend developer: Replace with API call to /api/simulator/exercises
// =============================================================================

export const mockSimulatorExercises: SimulatorExercise[] = [
  { id: 1, name: "Battery Fire Mission - Urban", date: new Date("2024-01-15"), participants: 24, avgAccuracy: 82.3, duration: 45 },
  { id: 2, name: "Counter-Battery Drill", date: new Date("2024-01-14"), participants: 18, avgAccuracy: 76.8, duration: 60 },
  { id: 3, name: "Defensive Fire Planning", date: new Date("2024-01-13"), participants: 32, avgAccuracy: 79.4, duration: 90 },
  { id: 4, name: "Night Fire Exercise", date: new Date("2024-01-12"), participants: 20, avgAccuracy: 71.2, duration: 75 },
  { id: 5, name: "Rapid Deployment Drill", date: new Date("2024-01-11"), participants: 28, avgAccuracy: 84.1, duration: 55 },
];

// =============================================================================
// AUDIT LOGS - Admin only
// Backend developer: Replace with API call to /api/audit
// =============================================================================

export const mockAuditLogs: AuditLog[] = [
  { id: "AUD001", userId: "USR001", userName: "Col. Rajesh Kumar", action: "QUERY", query: "Range of 155mm gun", timestamp: new Date(Date.now() - 1000 * 60 * 30), ip: "10.0.1.45" },
  { id: "AUD002", userId: "USR002", userName: "Maj. Priya Singh", action: "LOGIN", timestamp: new Date(Date.now() - 1000 * 60 * 45), ip: "10.0.1.67" },
  { id: "AUD003", userId: "USR001", userName: "Col. Rajesh Kumar", action: "DOCUMENT_VIEW", query: "Artillery Field Manual", timestamp: new Date(Date.now() - 1000 * 60 * 60), ip: "10.0.1.45" },
  { id: "AUD004", userId: "USR003", userName: "Capt. Vikram Reddy", action: "QUERY", query: "Battery deployment patterns", timestamp: new Date(Date.now() - 1000 * 60 * 90), ip: "10.0.1.89" },
  { id: "AUD005", userId: "USR002", userName: "Maj. Priya Singh", action: "SIMULATOR_ACCESS", timestamp: new Date(Date.now() - 1000 * 60 * 120), ip: "10.0.1.67" },
  { id: "AUD006", userId: "USR004", userName: "Lt. Arjun Patel", action: "QUERY", query: "Fire control procedures", timestamp: new Date(Date.now() - 1000 * 60 * 150), ip: "10.0.1.102" },
  { id: "AUD007", userId: "USR001", userName: "Col. Rajesh Kumar", action: "LOGOUT", timestamp: new Date(Date.now() - 1000 * 60 * 180), ip: "10.0.1.45" },
  { id: "AUD008", userId: "USR005", userName: "2Lt. Sneha Rao", action: "QUIZ_COMPLETE", query: "Score: 85%", timestamp: new Date(Date.now() - 1000 * 60 * 200), ip: "10.0.1.115" },
  { id: "AUD009", userId: "USR004", userName: "Lt. Arjun Patel", action: "TRAINING_START", query: "3D Training - Loading Drill", timestamp: new Date(Date.now() - 1000 * 60 * 220), ip: "10.0.1.102" },
  { id: "AUD010", userId: "USR003", userName: "Capt. Vikram Reddy", action: "DOCUMENT_UPLOAD", query: "New_SOP_v2.pdf", timestamp: new Date(Date.now() - 1000 * 60 * 250), ip: "10.0.1.89" },
];

// =============================================================================
// SYSTEM-WIDE STATS - Admin only
// Backend developer: Replace with API call to /api/admin/stats
// =============================================================================

export interface SystemStats {
  totalQueries: number;
  documentsIndexed: number;
  simulatorSessions: number;
  activeUsers: number;
  queryTrend: number; // percentage
  sessionTrend: number; // percentage
}

export const mockSystemStats: SystemStats = {
  totalQueries: 1247,
  documentsIndexed: 156,
  simulatorSessions: 89,
  activeUsers: 34,
  queryTrend: 12,
  sessionTrend: 8,
};

// =============================================================================
// SEARCH FUNCTION
// Backend developer: Replace with API call to /api/search
// =============================================================================

export function searchKnowledge(query: string): QueryResult {
  const lowerQuery = query.toLowerCase();

  for (const [key, value] of Object.entries(mockResponses)) {
    if (lowerQuery.includes(key) || key.includes(lowerQuery.split(" ").slice(0, 3).join(" "))) {
      return value;
    }
  }

  return {
    answer: `Based on the available documentation, your query about "${query}" relates to artillery operations and training. The School of Artillery maintains comprehensive documentation covering tactical procedures, equipment specifications, and training protocols. For specific technical data, please refer to the relevant field manuals and technical specifications in the document library.`,
    sources: [
      { document: "Artillery_Field_Manual.pdf", page: 1 },
      { document: "General_Reference.pdf", page: 1 },
    ],
    confidence: 0.65,
  };
}

// =============================================================================
// QUESTION BANK - For Instructor Review
// Backend developer: Replace with API call to /api/questions
// =============================================================================

export const mockQuestionBank: Question[] = [
  {
    id: "QB001",
    question: "What is the effective range of the Dhanush 155mm howitzer with base bleed ammunition?",
    options: ["24 km", "30 km", "38 km", "45 km"],
    correctIndex: 2,
    explanation: "The Dhanush 155mm howitzer can achieve a maximum range of 38 km with base bleed ammunition.",
    difficulty: "medium",
    category: "Technical",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    source: "AI Generated from Artillery_Field_Manual.pdf",
  },
  {
    id: "QB002",
    question: "What safety procedure should be followed before opening the breech after a misfire?",
    options: ["Wait 10 seconds", "Wait 30 seconds", "Wait 60 seconds", "Immediately open"],
    correctIndex: 1,
    explanation: "Standard safety procedure requires waiting at least 30 seconds before taking any action after a misfire.",
    difficulty: "easy",
    category: "Safety",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    source: "AI Generated from Safety_Procedures.pdf",
  },
  {
    id: "QB003",
    question: "In fire control, what does 'MPI' stand for?",
    options: ["Mean Point of Impact", "Maximum Point of Intersection", "Minimum Probability Index", "Multiple Position Indicator"],
    correctIndex: 0,
    explanation: "MPI (Mean Point of Impact) is the average location where rounds from a series of shots land.",
    difficulty: "easy",
    category: "Gunnery",
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    source: "AI Generated from Fire_Control_Manual.pdf",
  },
  {
    id: "QB004",
    question: "What is the correct sequence for computing firing data?",
    options: [
      "Target location → Gun location → Meteorological data → Ballistic solution",
      "Meteorological data → Target location → Gun location → Ballistic solution",
      "Gun location → Target location → Ballistic solution → Meteorological data",
      "Ballistic solution → Target location → Gun location → Meteorological data"
    ],
    correctIndex: 0,
    explanation: "The correct sequence starts with identifying target and gun locations, then applying met data to compute the ballistic solution.",
    difficulty: "hard",
    category: "Procedures",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    source: "AI Generated from Gunnery_Procedures.pdf",
  },
  {
    id: "QB005",
    question: "What type of recoil system is used in the 155mm gun?",
    options: ["Spring-based", "Pneumatic", "Hydro-pneumatic", "Electric"],
    correctIndex: 2,
    explanation: "The 155mm gun uses a hydro-pneumatic recoil system combining hydraulic oil and compressed nitrogen.",
    difficulty: "medium",
    category: "Components",
    status: "approved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    source: "AI Generated from Technical_Specs.pdf",
  },
  {
    id: "QB006",
    question: "During battery deployment, what is the standard gun spacing for conventional operations?",
    options: ["25-50m", "50-100m", "100-150m", "150-200m"],
    correctIndex: 1,
    explanation: "Standard gun spacing is typically 50-100m for conventional operations, balancing dispersion against control.",
    difficulty: "medium",
    category: "Tactics",
    status: "rejected",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    source: "AI Generated from Battery_Operations_SOP.pdf",
  },
  {
    id: "QB007",
    question: "What is the purpose of the panoramic telescope in artillery?",
    options: ["Target identification", "Range finding", "Laying for direction", "Night vision"],
    correctIndex: 2,
    explanation: "The panoramic telescope is used for laying the gun in direction (azimuth) with precision angular measurement.",
    difficulty: "easy",
    category: "Components",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    source: "AI Generated from Sighting_Systems.pdf",
  },
];

// =============================================================================
// UNIT PERFORMANCE STATS - For Leadership View
// Backend developer: Replace with API call to /api/leadership/stats
// =============================================================================

export const mockUnitStats: UnitStats[] = [
  {
    unitName: "Alpha Battery",
    totalTrainees: 24,
    completionRate: 87,
    avgScore: 78,
    activeTrainings: 8,
    passRate: 92,
  },
  {
    unitName: "Bravo Battery",
    totalTrainees: 22,
    completionRate: 92,
    avgScore: 82,
    activeTrainings: 6,
    passRate: 95,
  },
  {
    unitName: "Charlie Battery",
    totalTrainees: 18,
    completionRate: 74,
    avgScore: 71,
    activeTrainings: 10,
    passRate: 84,
  },
  {
    unitName: "Delta Battery",
    totalTrainees: 20,
    completionRate: 81,
    avgScore: 76,
    activeTrainings: 7,
    passRate: 88,
  },
];

export const mockTraineeProgress: TraineeProgress[] = [
  {
    userId: "USR004",
    userName: "Lt. Arjun Patel",
    quizzesCompleted: 32,
    avgScore: 76,
    trainingHours: 48,
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
    status: "on-track",
  },
  {
    userId: "USR005",
    userName: "2Lt. Sneha Rao",
    quizzesCompleted: 28,
    avgScore: 71,
    trainingHours: 42,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: "needs-attention",
  },
  {
    userId: "USR007",
    userName: "Lt. Rahul Verma",
    quizzesCompleted: 45,
    avgScore: 89,
    trainingHours: 65,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    status: "excelling",
  },
  {
    userId: "USR008",
    userName: "2Lt. Kavita Sharma",
    quizzesCompleted: 38,
    avgScore: 82,
    trainingHours: 52,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: "on-track",
  },
  {
    userId: "USR009",
    userName: "Lt. Deepak Singh",
    quizzesCompleted: 22,
    avgScore: 65,
    trainingHours: 28,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "needs-attention",
  },
];


// =============================================================================
// SYSTEM HEALTH STATS - For Admin Dashboard
// Backend developer: Replace with API call to /api/admin/health
// =============================================================================

export interface SystemHealth {
  uptime: string;
  storageUsed: number;
  storageTotal: number;
  cpuUsage: number;
  memoryUsage: number;
  lastBackup: Date;
  activeConnections: number;
}

export const mockSystemHealth: SystemHealth = {
  uptime: "45 days, 12 hours",
  storageUsed: 245,
  storageTotal: 500,
  cpuUsage: 34,
  memoryUsage: 62,
  lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6),
  activeConnections: 23,
};

// =============================================================================
// RUBRIC SYSTEM - SOW Section 8.2 Rubric-based evaluation
// Backend developer: Replace with API call to /api/rubrics
// =============================================================================

// Standard 5-level scoring scale for rubrics
const standardLevels = [
  { score: 5, label: "Excellent", description: "Demonstrates exceptional understanding and application" },
  { score: 4, label: "Good", description: "Shows strong understanding with minor gaps" },
  { score: 3, label: "Satisfactory", description: "Meets basic requirements with some limitations" },
  { score: 2, label: "Needs Improvement", description: "Partial understanding with significant gaps" },
  { score: 1, label: "Poor", description: "Minimal understanding or major errors" },
];

export const mockRubrics: Rubric[] = [
  {
    id: "RUB001",
    name: "Tactical Appreciation Rubric",
    description: "Evaluation rubric for tactical appreciation questions covering situation analysis, mission analysis, and course of action development",
    category: "Tactical Appreciation",
    criteria: [
      {
        id: "TAC-C1",
        name: "Situation Analysis",
        description: "Ability to analyze ground, enemy, and own forces",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "TAC-C2",
        name: "Mission Understanding",
        description: "Clarity of mission interpretation and derived tasks",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "TAC-C3",
        name: "Course of Action",
        description: "Feasibility and soundness of proposed COA",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "TAC-C4",
        name: "Fire Support Integration",
        description: "Integration of artillery support with tactical plan",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "TAC-C5",
        name: "Presentation & Clarity",
        description: "Clear and logical presentation of appreciation",
        maxScore: 5,
        levels: standardLevels,
      },
    ],
    totalMaxScore: 25,
    passingScore: 15,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    createdBy: "USR002",
    status: "active",
  },
  {
    id: "RUB002",
    name: "Fire Plan Evaluation Rubric",
    description: "Rubric for evaluating fire plan preparation including target analysis, ammunition selection, and fire coordination",
    category: "Fire Plan",
    criteria: [
      {
        id: "FP-C1",
        name: "Target Analysis",
        description: "Accuracy of target identification and prioritization",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "FP-C2",
        name: "Ammunition Selection",
        description: "Appropriate selection of ammunition types for targets",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "FP-C3",
        name: "Fire Coordination",
        description: "Coordination with supported arms and safety measures",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "FP-C4",
        name: "Timing & Sequencing",
        description: "Proper timing and sequencing of fire missions",
        maxScore: 5,
        levels: standardLevels,
      },
    ],
    totalMaxScore: 20,
    passingScore: 12,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
    createdBy: "USR002",
    status: "active",
  },
  {
    id: "RUB003",
    name: "STA Deployment Rubric",
    description: "Evaluation rubric for STA deployment scenarios including sensor placement, observation plans, and reporting procedures",
    category: "STA Deployment",
    criteria: [
      {
        id: "STA-C1",
        name: "Sensor Placement",
        description: "Optimal positioning of STA assets for coverage",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "STA-C2",
        name: "Observation Plan",
        description: "Comprehensive observation and surveillance plan",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "STA-C3",
        name: "Target Acquisition",
        description: "Effectiveness of target acquisition procedures",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "STA-C4",
        name: "Reporting & Communication",
        description: "Accuracy and timeliness of target reporting",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "STA-C5",
        name: "Survivability",
        description: "Measures for STA element protection and displacement",
        maxScore: 5,
        levels: standardLevels,
      },
    ],
    totalMaxScore: 25,
    passingScore: 15,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
    createdBy: "USR002",
    status: "active",
  },
  {
    id: "RUB004",
    name: "Gun Drill Assessment Rubric",
    description: "Rubric for evaluating crew drill performance including safety, sequence, and timing",
    category: "Gun Drill",
    criteria: [
      {
        id: "GD-C1",
        name: "Safety Compliance",
        description: "Adherence to all safety procedures throughout drill",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "GD-C2",
        name: "Sequence Accuracy",
        description: "Correct sequence of drill movements and commands",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "GD-C3",
        name: "Timing & Speed",
        description: "Completion within prescribed time standards",
        maxScore: 5,
        levels: standardLevels,
      },
      {
        id: "GD-C4",
        name: "Crew Coordination",
        description: "Effective coordination among crew members",
        maxScore: 5,
        levels: standardLevels,
      },
    ],
    totalMaxScore: 20,
    passingScore: 14,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10"),
    createdBy: "USR002",
    status: "active",
  },
];

// Helper to get rubric by ID
export function getRubricById(rubricId: string): Rubric | undefined {
  return mockRubrics.find(r => r.id === rubricId);
}

// =============================================================================
// SUBJECTIVE QUESTIONS - SOW Section 8.1
// Backend developer: Replace with API call to /api/questions/subjective
// =============================================================================

export const mockSubjectiveQuestions: SubjectiveQuestion[] = [
  {
    id: "SQ001",
    type: "subjective",
    question: "You are the Battery Commander of a Medium Regiment deployed in support of an Infantry Brigade. The brigade is tasked to capture an enemy defended locality. Prepare a tactical appreciation for the employment of your battery.",
    context: "Terrain: Semi-urban area with scattered buildings and open fields. Enemy: Approximately one battalion with prepared defenses. Friendly forces: One Infantry Brigade with tank support.",
    expectedPoints: [
      "Analysis of ground and its effect on artillery deployment",
      "Enemy dispositions and likely artillery targets",
      "Deduction of tasks from brigade mission",
      "Proposed gun positions with rationale",
      "Fire plan outline with priority targets",
      "Coordination measures with supported arms",
    ],
    sampleAnswer: "A comprehensive tactical appreciation should cover: Ground analysis showing suitable gun positions with cover and fields of fire; Enemy analysis identifying priority targets (command posts, weapons positions, reserves); Mission analysis deriving artillery-specific tasks; Proposed deployment showing main and alternate positions; Fire plan with preparatory, supporting, and consolidation phases; Coordination measures including safety lines and no-fire areas.",
    rubricId: "RUB001",
    difficulty: "hard",
    category: "Tactics",
    course: "LGSC",
    maxMarks: 25,
    timeAllocation: 45,
    status: "approved",
    createdAt: new Date("2024-01-15"),
    source: "LGSC Previous Year Paper 2023",
  },
  {
    id: "SQ002",
    type: "subjective",
    question: "Prepare a fire plan for the support of an infantry company attack on a defended village. Include target list, ammunition allocation, and timing.",
    context: "Attack to commence at 0600 hrs. H-Hour is 0630 hrs. Company has three platoons. Artillery support: One Battery (6 guns). Ammunition available: 300 rounds HE, 50 rounds Smoke, 20 rounds Illumination.",
    expectedPoints: [
      "Target list with grid references and descriptions",
      "Ammunition allocation per target",
      "Timing sequence aligned with assault phases",
      "Smoke plan for approach and flanks",
      "On-call targets for contingencies",
      "Safety measures and coordination",
    ],
    rubricId: "RUB002",
    difficulty: "medium",
    category: "Fire Plan",
    course: "YO",
    maxMarks: 20,
    timeAllocation: 30,
    status: "approved",
    createdAt: new Date("2024-01-20"),
    source: "YO Course Manual Chapter 7",
  },
  {
    id: "SQ003",
    type: "subjective",
    question: "You are the STA Platoon Commander. Plan the deployment of your STA elements for surveillance of a 10km frontage in defensive operations. Detail sensor placement and observation plan.",
    context: "Terrain: Undulating ground with scattered vegetation. One SWATHI radar, two OP parties, and one UAV available. Expected threat: Mechanized forces with artillery support.",
    expectedPoints: [
      "Radar positioning for optimal coverage",
      "OP locations with primary and alternate positions",
      "UAV employment plan",
      "Observation zones and dead ground coverage",
      "Reporting chain and communication plan",
      "Survivability and displacement plans",
    ],
    rubricId: "RUB003",
    difficulty: "hard",
    category: "Tactics",
    course: "STA",
    maxMarks: 25,
    timeAllocation: 40,
    status: "approved",
    createdAt: new Date("2024-02-01"),
    source: "STA Course Reference Material",
  },
  {
    id: "SQ004",
    type: "subjective",
    question: "Explain the complete sequence of actions for a gun crew from receipt of fire orders to engagement of the target. Include all safety checks.",
    context: "The question covers standard operating procedures for a 155mm howitzer crew during a fire mission.",
    expectedPoints: [
      "Receipt and acknowledgment of fire orders",
      "Setting of range and deflection",
      "Ammunition preparation and loading sequence",
      "Safety checks before firing",
      "Firing procedure and immediate actions",
      "Post-firing checks and reporting",
    ],
    rubricId: "RUB004",
    difficulty: "medium",
    category: "Procedures",
    course: "JCO",
    maxMarks: 20,
    timeAllocation: 25,
    status: "approved",
    createdAt: new Date("2024-02-05"),
    source: "JCO Course Handbook",
  },
  {
    id: "SQ005",
    type: "subjective",
    question: "What are the key considerations for selecting a gun position? Explain with reference to tactical, technical, and administrative factors.",
    context: "Consider a field artillery battery operating in conventional operations.",
    expectedPoints: [
      "Tactical factors: cover, concealment, fields of fire, routes",
      "Technical factors: gun platform requirements, survey considerations",
      "Administrative factors: ammunition supply, maintenance access",
      "Counter-battery protection measures",
      "Alternate and supplementary positions",
    ],
    rubricId: "RUB001",
    difficulty: "easy",
    category: "Tactics",
    course: "OR_CADRE",
    maxMarks: 15,
    timeAllocation: 20,
    status: "pending",
    createdAt: new Date("2024-02-10"),
    source: "AI Generated from Position Selection SOP",
  },
];

// =============================================================================
// SCHEDULED ASSESSMENTS - SOW Section 8.2
// Backend developer: Replace with API call to /api/assessments/scheduled
// =============================================================================

export const mockScheduledAssessments: ScheduledAssessment[] = [
  {
    id: "ASM001",
    title: "YO Mid-Course Assessment",
    description: "Comprehensive mid-course assessment covering gunnery fundamentals, fire control, and basic tactics",
    assessmentType: "summative",
    course: "YO",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    venue: "Examination Hall A",
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: true,
    questionConfig: {
      mcqCount: 30,
      subjectiveCount: 3,
      categories: ["Technical", "Procedures", "Safety", "Tactics"],
    },
    assignedBatches: ["YO-2024-A", "YO-2024-B"],
    assignedTrainees: [],
    createdBy: "USR002",
    status: "scheduled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "ASM002",
    title: "LGSC Fire Planning Exercise",
    description: "Practical assessment on fire plan preparation and execution",
    assessmentType: "summative",
    course: "LGSC",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    startTime: "10:00",
    endTime: "13:00",
    duration: 180,
    venue: "Tactical Training Room",
    totalMarks: 50,
    passingMarks: 30,
    negativeMarking: false,
    questionConfig: {
      mcqCount: 10,
      subjectiveCount: 2,
      categories: ["Fire Plan", "Tactics"],
    },
    assignedBatches: ["LGSC-2024"],
    assignedTrainees: [],
    createdBy: "USR002",
    status: "scheduled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "ASM003",
    title: "JCO Safety Qualification Test",
    description: "Mandatory safety qualification test for all JCO course participants",
    assessmentType: "requalification",
    course: "JCO",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // Tomorrow
    startTime: "14:00",
    endTime: "15:30",
    duration: 90,
    venue: "Classroom 3",
    totalMarks: 50,
    passingMarks: 40,
    negativeMarking: true,
    questionConfig: {
      mcqCount: 25,
      subjectiveCount: 1,
      categories: ["Safety", "Procedures"],
    },
    assignedBatches: ["JCO-2024-1"],
    assignedTrainees: [],
    createdBy: "USR002",
    status: "scheduled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "ASM004",
    title: "Diagnostic Assessment - OR Batch",
    description: "Pre-course diagnostic assessment to gauge baseline knowledge",
    assessmentType: "diagnostic",
    course: "OR_CADRE",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    startTime: "09:00",
    endTime: "10:30",
    duration: 90,
    venue: "Main Hall",
    totalMarks: 40,
    passingMarks: 0, // Diagnostic - no passing marks
    negativeMarking: false,
    questionConfig: {
      mcqCount: 20,
      subjectiveCount: 0,
      categories: ["General", "Components", "Safety"],
    },
    assignedBatches: ["OR-2024-Feb"],
    assignedTrainees: [],
    createdBy: "USR002",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
];

// Helper to get upcoming assessments
export function getUpcomingAssessments(course?: string): ScheduledAssessment[] {
  const now = new Date();
  return mockScheduledAssessments
    .filter(a => a.status === "scheduled" && a.scheduledDate > now)
    .filter(a => !course || a.course === course || course === "ALL")
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
}

// =============================================================================
// ANSWER SCRIPTS - SOW Section 8.2
// Backend developer: Replace with API call to /api/answer-scripts
// =============================================================================

export const mockAnswerScripts: AnswerScript[] = [
  {
    id: "ANS001",
    assessmentId: "ASM004",
    traineeId: "USR004",
    traineeName: "Lt. Arjun Patel",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "graded",
    mcqAnswers: [
      { questionId: "e1", selectedOption: 2, isCorrect: true, marksAwarded: 2 },
      { questionId: "e2", selectedOption: 1, isCorrect: true, marksAwarded: 2 },
      { questionId: "e3", selectedOption: 0, isCorrect: false, marksAwarded: 0 },
      { questionId: "e4", selectedOption: 1, isCorrect: true, marksAwarded: 2 },
      { questionId: "e5", selectedOption: 1, isCorrect: true, marksAwarded: 2 },
    ],
    subjectiveAnswers: [],
    mcqScore: 32,
    subjectiveScore: 0,
    totalScore: 32,
    percentage: 80,
    grade: "A",
    overallFeedback: "Good understanding of fundamentals. Continue with current pace.",
    gradedBy: "USR002",
    gradedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
  {
    id: "ANS002",
    assessmentId: "ASM004",
    traineeId: "USR005",
    traineeName: "2Lt. Sneha Rao",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "graded",
    mcqAnswers: [
      { questionId: "e1", selectedOption: 2, isCorrect: true, marksAwarded: 2 },
      { questionId: "e2", selectedOption: 0, isCorrect: false, marksAwarded: 0 },
      { questionId: "e3", selectedOption: 1, isCorrect: true, marksAwarded: 2 },
      { questionId: "e4", selectedOption: 2, isCorrect: false, marksAwarded: 0 },
      { questionId: "e5", selectedOption: 1, isCorrect: true, marksAwarded: 2 },
    ],
    subjectiveAnswers: [],
    mcqScore: 26,
    subjectiveScore: 0,
    totalScore: 26,
    percentage: 65,
    grade: "B",
    overallFeedback: "Needs improvement in components knowledge. Review technical sections.",
    gradedBy: "USR002",
    gradedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
  },
];

// =============================================================================
// TRAINEE PROGRESS HISTORY - SOW Section 8.3
// Backend developer: Replace with API call to /api/trainees/:id/progress
// =============================================================================

export const mockProgressHistory: TraineeProgressHistory[] = [
  {
    traineeId: "USR004",
    traineeName: "Lt. Arjun Patel",
    course: "YO",
    enrollmentDate: new Date("2024-01-01"),
    scoreHistory: [
      { date: new Date("2024-01-15"), score: 62, assessmentType: "diagnostic", assessmentId: "ASM004" },
      { date: new Date("2024-01-22"), score: 68, assessmentType: "practice", assessmentId: "P001" },
      { date: new Date("2024-01-29"), score: 72, assessmentType: "practice", assessmentId: "P002" },
      { date: new Date("2024-02-05"), score: 75, assessmentType: "summative", assessmentId: "S001" },
      { date: new Date("2024-02-12"), score: 78, assessmentType: "practice", assessmentId: "P003" },
      { date: new Date("2024-02-19"), score: 80, assessmentType: "practice", assessmentId: "P004" },
      { date: new Date("2024-02-26"), score: 82, assessmentType: "summative", assessmentId: "S002" },
    ],
    topicTrends: [
      {
        topic: "Safety",
        scores: [
          { date: new Date("2024-01-15"), score: 70 },
          { date: new Date("2024-02-01"), score: 85 },
          { date: new Date("2024-02-15"), score: 90 },
        ],
        currentLevel: 90,
        improvement: 28.6,
      },
      {
        topic: "Technical",
        scores: [
          { date: new Date("2024-01-15"), score: 55 },
          { date: new Date("2024-02-01"), score: 68 },
          { date: new Date("2024-02-15"), score: 75 },
        ],
        currentLevel: 75,
        improvement: 36.4,
      },
      {
        topic: "Procedures",
        scores: [
          { date: new Date("2024-01-15"), score: 65 },
          { date: new Date("2024-02-01"), score: 72 },
          { date: new Date("2024-02-15"), score: 80 },
        ],
        currentLevel: 80,
        improvement: 23.1,
      },
      {
        topic: "Components",
        scores: [
          { date: new Date("2024-01-15"), score: 60 },
          { date: new Date("2024-02-01"), score: 70 },
          { date: new Date("2024-02-15"), score: 78 },
        ],
        currentLevel: 78,
        improvement: 30.0,
      },
    ],
    milestones: [
      { name: "Course Started", achievedAt: new Date("2024-01-01"), description: "Enrolled in YO Course" },
      { name: "Diagnostic Complete", achievedAt: new Date("2024-01-15"), description: "Baseline assessment completed" },
      { name: "Safety Certified", achievedAt: new Date("2024-02-01"), description: "Passed safety qualification (90%)" },
      { name: "Mid-Course Cleared", achievedAt: new Date("2024-02-05"), description: "Scored 75% in mid-course exam" },
    ],
    batchAverage: 74,
    percentileRank: 78,
  },
  {
    traineeId: "USR007",
    traineeName: "Lt. Rahul Verma",
    course: "YO",
    enrollmentDate: new Date("2024-01-01"),
    scoreHistory: [
      { date: new Date("2024-01-15"), score: 78, assessmentType: "diagnostic", assessmentId: "ASM004" },
      { date: new Date("2024-01-22"), score: 82, assessmentType: "practice", assessmentId: "P001" },
      { date: new Date("2024-01-29"), score: 85, assessmentType: "practice", assessmentId: "P002" },
      { date: new Date("2024-02-05"), score: 88, assessmentType: "summative", assessmentId: "S001" },
      { date: new Date("2024-02-12"), score: 89, assessmentType: "practice", assessmentId: "P003" },
      { date: new Date("2024-02-19"), score: 91, assessmentType: "practice", assessmentId: "P004" },
      { date: new Date("2024-02-26"), score: 92, assessmentType: "summative", assessmentId: "S002" },
    ],
    topicTrends: [
      {
        topic: "Safety",
        scores: [
          { date: new Date("2024-01-15"), score: 85 },
          { date: new Date("2024-02-01"), score: 92 },
          { date: new Date("2024-02-15"), score: 95 },
        ],
        currentLevel: 95,
        improvement: 11.8,
      },
      {
        topic: "Technical",
        scores: [
          { date: new Date("2024-01-15"), score: 75 },
          { date: new Date("2024-02-01"), score: 85 },
          { date: new Date("2024-02-15"), score: 90 },
        ],
        currentLevel: 90,
        improvement: 20.0,
      },
      {
        topic: "Procedures",
        scores: [
          { date: new Date("2024-01-15"), score: 78 },
          { date: new Date("2024-02-01"), score: 88 },
          { date: new Date("2024-02-15"), score: 92 },
        ],
        currentLevel: 92,
        improvement: 17.9,
      },
      {
        topic: "Tactics",
        scores: [
          { date: new Date("2024-01-15"), score: 72 },
          { date: new Date("2024-02-01"), score: 82 },
          { date: new Date("2024-02-15"), score: 88 },
        ],
        currentLevel: 88,
        improvement: 22.2,
      },
    ],
    milestones: [
      { name: "Course Started", achievedAt: new Date("2024-01-01"), description: "Enrolled in YO Course" },
      { name: "Top Performer", achievedAt: new Date("2024-01-22"), description: "Ranked #1 in batch" },
      { name: "Safety Certified", achievedAt: new Date("2024-01-25"), description: "Passed safety qualification (95%)" },
      { name: "Excellence Award", achievedAt: new Date("2024-02-26"), description: "Achieved 90%+ overall" },
    ],
    batchAverage: 74,
    percentileRank: 95,
  },
];

// Helper to get progress history for a trainee
export function getTraineeProgressHistory(traineeId: string): TraineeProgressHistory | undefined {
  return mockProgressHistory.find(p => p.traineeId === traineeId);
}
