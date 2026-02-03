import { Query, Document, SimulatorStats, SimulatorExercise, AuditLog, QueryResult, User } from "@/types";

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
    name: "Capt. Vikram Reddy",
    role: "instructor",
    unit: "School of Artillery, Deolali",
  },
  {
    id: "USR004",
    name: "Lt. Arjun Patel",
    role: "trainee",
    unit: "School of Artillery, Deolali",
  },
  {
    id: "USR005",
    name: "2Lt. Sneha Rao",
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
    queriesThisMonth: 34,
    quizzesTaken: 18,
    avgQuizScore: 85,
    trainingSessionsCompleted: 12,
    lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  USR004: {
    queriesThisMonth: 56,
    quizzesTaken: 32,
    avgQuizScore: 76,
    trainingSessionsCompleted: 22,
    lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 1),
  },
  USR005: {
    queriesThisMonth: 42,
    quizzesTaken: 28,
    avgQuizScore: 71,
    trainingSessionsCompleted: 18,
    lastActiveDate: new Date(Date.now() - 1000 * 60 * 60 * 8),
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
