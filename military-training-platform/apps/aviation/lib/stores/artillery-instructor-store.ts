"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Artillery Instructor - Joint Fire Support Training

export interface FOOTrainee {
  id: string;
  rank: string;
  name: string;
  serviceNumber: string;
  unit: string;
  regiment: string;
  batch: string;
  enrollmentDate: string;
  status: "active" | "on-leave" | "graduated" | "failed" | "medical";
  currentPhase: string;
  completedModules: string[];
  totalHours: number;
  fieldHours: number;
  simulatorHours: number;
  progress: number;
  averageScore: number;
  fireCallsCompleted: number;
  accuracyRate: number;
  specializations: string[];
}

export interface FireMissionScenario {
  id: string;
  title: string;
  code: string;
  type: "cas" | "direct-fire" | "indirect-fire" | "suppression" | "illumination" | "smoke";
  difficulty: "basic" | "intermediate" | "advanced" | "expert";
  status: "draft" | "active" | "archived";
  terrain: string;
  weather: string;
  visibility: string;
  targetType: string;
  targetDescription: string;
  gridReference: string;
  altitude: string;
  friendlyPositions: string;
  enemyPositions: string;
  aircraftType: string;
  munitionsAllowed: string[];
  timeLimit: number;
  objectives: string[];
  evaluationCriteria: {
    criterion: string;
    weight: number;
    description: string;
  }[];
  briefingNotes: string;
  debrief: string;
  createdBy: string;
  createdAt: string;
  lastUsed?: string;
  timesUsed: number;
  averageScore: number;
}

export interface ArtilleryTrainingSession {
  id: string;
  title: string;
  type: "classroom" | "simulator" | "field" | "live-fire" | "joint-exercise";
  scenarioId?: string;
  scenarioName?: string;
  traineeIds: string[];
  traineeNames: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructorId: string;
  instructorName: string;
  aviationInstructorId?: string;
  aviationInstructorName?: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "postponed";
  objectives: string[];
  equipment: string[];
  remarks?: string;
  weatherConditions?: string;
  safetyBriefCompleted: boolean;
}

export interface FOOAssessment {
  id: string;
  traineeId: string;
  traineeName: string;
  type: "written" | "practical" | "simulator" | "field" | "final-checkride";
  phase: string;
  scenarioId?: string;
  scenarioName?: string;
  date: string;
  duration: string;
  instructorId: string;
  instructorName: string;
  status: "pending" | "passed" | "failed" | "incomplete";
  maxScore: number;
  score?: number;
  passingScore: number;
  evaluations: {
    category: string;
    criterion: string;
    maxPoints: number;
    points: number;
    remarks?: string;
  }[];
  fireCallAccuracy?: number;
  targetEngagementTime?: number;
  communicationScore?: number;
  safetyScore?: number;
  overallRemarks: string;
  recommendations: string[];
  retakeAllowed: boolean;
  retakeDate?: string;
}

export interface ArtilleryCurriculum {
  id: string;
  name: string;
  code: string;
  phase: string;
  duration: string;
  description: string;
  prerequisites: string[];
  objectives: string[];
  topics: {
    id: string;
    title: string;
    type: "theory" | "practical" | "simulator" | "field";
    duration: string;
    description: string;
    completed?: boolean;
  }[];
  assessments: string[];
  status: "active" | "draft" | "archived";
  totalHours: number;
  theoryHours: number;
  practicalHours: number;
  simulatorHours: number;
  fieldHours: number;
  enrolledTrainees: number;
  passRate: number;
}

export interface JointExercise {
  id: string;
  name: string;
  code: string;
  type: "coordination" | "live-fire" | "tactical" | "search-rescue" | "medevac";
  status: "planning" | "scheduled" | "in-progress" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  location: string;
  objectives: string[];
  artilleryInstructorId: string;
  artilleryInstructorName: string;
  aviationInstructorId: string;
  aviationInstructorName: string;
  artilleryTrainees: {
    id: string;
    name: string;
    role: string;
  }[];
  aviationTrainees: {
    id: string;
    name: string;
    role: string;
  }[];
  aircraft: {
    type: string;
    registration: string;
    crew: string[];
  }[];
  scenarios: string[];
  safetyOfficer: string;
  medicalSupport: string;
  communicationPlan: string;
  contingencyPlan: string;
  briefingSchedule: string;
  debriefSchedule: string;
  remarks?: string;
  results?: {
    objective: string;
    achieved: boolean;
    remarks: string;
  }[];
}

// Mock Data
const mockFOOTrainees: FOOTrainee[] = [
  {
    id: "foo1",
    rank: "Lt",
    name: "Arun Kumar",
    serviceNumber: "IC-78234",
    unit: "14 Field Regiment",
    regiment: "Regiment of Artillery",
    batch: "FOO-2024-A",
    enrollmentDate: "2024-06-01",
    status: "active",
    currentPhase: "Phase II - Advanced Fire Control",
    completedModules: ["FOO-101", "FOO-102"],
    totalHours: 120,
    fieldHours: 40,
    simulatorHours: 60,
    progress: 65,
    averageScore: 82,
    fireCallsCompleted: 45,
    accuracyRate: 78,
    specializations: ["CAS Coordination", "Direct Fire"],
  },
  {
    id: "foo2",
    rank: "Capt",
    name: "Priya Sharma",
    serviceNumber: "IC-76890",
    unit: "22 Medium Regiment",
    regiment: "Regiment of Artillery",
    batch: "FOO-2024-A",
    enrollmentDate: "2024-06-01",
    status: "active",
    currentPhase: "Phase II - Advanced Fire Control",
    completedModules: ["FOO-101", "FOO-102", "FOO-103"],
    totalHours: 140,
    fieldHours: 50,
    simulatorHours: 70,
    progress: 75,
    averageScore: 88,
    fireCallsCompleted: 62,
    accuracyRate: 85,
    specializations: ["CAS Coordination", "Indirect Fire", "Naval Gunfire"],
  },
  {
    id: "foo3",
    rank: "Lt",
    name: "Vikram Singh",
    serviceNumber: "IC-79456",
    unit: "8 Field Regiment",
    regiment: "Regiment of Artillery",
    batch: "FOO-2024-B",
    enrollmentDate: "2024-09-01",
    status: "active",
    currentPhase: "Phase I - Basic FOO Procedures",
    completedModules: ["FOO-101"],
    totalHours: 60,
    fieldHours: 15,
    simulatorHours: 35,
    progress: 35,
    averageScore: 75,
    fireCallsCompleted: 20,
    accuracyRate: 70,
    specializations: [],
  },
  {
    id: "foo4",
    rank: "Maj",
    name: "Rajesh Menon",
    serviceNumber: "IC-72345",
    unit: "5 Rocket Regiment",
    regiment: "Regiment of Artillery",
    batch: "FOO-2023-C",
    enrollmentDate: "2023-03-01",
    status: "graduated",
    currentPhase: "Completed",
    completedModules: ["FOO-101", "FOO-102", "FOO-103", "FOO-201", "FOO-202"],
    totalHours: 280,
    fieldHours: 100,
    simulatorHours: 140,
    progress: 100,
    averageScore: 92,
    fireCallsCompleted: 150,
    accuracyRate: 91,
    specializations: ["CAS Coordination", "Indirect Fire", "Rocket Artillery"],
  },
  {
    id: "foo5",
    rank: "Lt",
    name: "Suresh Reddy",
    serviceNumber: "IC-80123",
    unit: "17 Field Regiment",
    regiment: "Regiment of Artillery",
    batch: "FOO-2024-B",
    enrollmentDate: "2024-09-01",
    status: "on-leave",
    currentPhase: "Phase I - Basic FOO Procedures",
    completedModules: [],
    totalHours: 30,
    fieldHours: 5,
    simulatorHours: 20,
    progress: 15,
    averageScore: 68,
    fireCallsCompleted: 8,
    accuracyRate: 62,
    specializations: [],
  },
];

const mockScenarios: FireMissionScenario[] = [
  {
    id: "scn1",
    title: "Hilltop Enemy Position Engagement",
    code: "SCN-CAS-001",
    type: "cas",
    difficulty: "intermediate",
    status: "active",
    terrain: "Mountainous",
    weather: "Clear",
    visibility: "Good (10km+)",
    targetType: "Enemy Bunker Complex",
    targetDescription: "Fortified position with MG nests and mortar positions",
    gridReference: "43R MQ 1234 5678",
    altitude: "2400m MSL",
    friendlyPositions: "1km South, in defilade",
    enemyPositions: "Hilltop, 360° fields of fire",
    aircraftType: "ALH Rudra / Mi-17",
    munitionsAllowed: ["70mm Rockets", "Cannon", "ATGMs"],
    timeLimit: 15,
    objectives: [
      "Establish communication with aircraft",
      "Provide accurate target description",
      "Execute safe fire mission",
      "Conduct BDA",
    ],
    evaluationCriteria: [
      { criterion: "Target Identification", weight: 20, description: "Correct grid, description, marking" },
      { criterion: "Communication Protocol", weight: 25, description: "Proper brevity codes, clear transmissions" },
      { criterion: "Safety Procedures", weight: 25, description: "Friendly position awareness, abort procedures" },
      { criterion: "Mission Effectiveness", weight: 20, description: "Target neutralization, time efficiency" },
      { criterion: "BDA Accuracy", weight: 10, description: "Damage assessment accuracy" },
    ],
    briefingNotes: "Enemy has limited air defense. Weather expected to remain clear.",
    debrief: "Focus on initial target acquisition and communication clarity.",
    createdBy: "Col Sharma",
    createdAt: "2024-01-15",
    lastUsed: "2024-12-15",
    timesUsed: 45,
    averageScore: 78,
  },
  {
    id: "scn2",
    title: "Urban Area Fire Support",
    code: "SCN-CAS-002",
    type: "cas",
    difficulty: "advanced",
    status: "active",
    terrain: "Urban",
    weather: "Partly Cloudy",
    visibility: "Moderate (5km)",
    targetType: "Enemy Strongpoint",
    targetDescription: "Building complex with snipers and RPG teams",
    gridReference: "43R MQ 4567 8901",
    altitude: "850m MSL",
    friendlyPositions: "200m East, multiple squads",
    enemyPositions: "3-story building, roof and windows",
    aircraftType: "ALH Rudra",
    munitionsAllowed: ["Cannon", "ATGMs"],
    timeLimit: 20,
    objectives: [
      "Coordinate with ground forces",
      "Minimize collateral damage",
      "Precision engagement",
      "Support ground assault",
    ],
    evaluationCriteria: [
      { criterion: "Collateral Damage Avoidance", weight: 30, description: "No civilian/friendly casualties" },
      { criterion: "Precision", weight: 25, description: "Accuracy of target designation" },
      { criterion: "Coordination", weight: 25, description: "Ground-air coordination effectiveness" },
      { criterion: "Mission Timing", weight: 20, description: "Synchronization with ground assault" },
    ],
    briefingNotes: "Civilian population evacuated. ROE requires positive ID before engagement.",
    debrief: "Urban CAS requires exceptional precision and coordination.",
    createdBy: "Col Sharma",
    createdAt: "2024-03-10",
    lastUsed: "2024-12-10",
    timesUsed: 28,
    averageScore: 72,
  },
  {
    id: "scn3",
    title: "Suppression Fire for Helicopter Insertion",
    code: "SCN-SUP-001",
    type: "suppression",
    difficulty: "intermediate",
    status: "active",
    terrain: "Forest Clearing",
    weather: "Clear",
    visibility: "Good",
    targetType: "Enemy defensive positions",
    targetDescription: "Perimeter defenses around LZ",
    gridReference: "43R MQ 7890 1234",
    altitude: "1200m MSL",
    friendlyPositions: "Inbound helicopter 5km out",
    enemyPositions: "Tree line around clearing",
    aircraftType: "Mi-17 / ALH Dhruv",
    munitionsAllowed: ["Artillery - 155mm", "Mortars - 81mm", "Smoke"],
    timeLimit: 10,
    objectives: [
      "Coordinate suppression timing",
      "Adjust fire as aircraft approach",
      "Lift fire on call",
      "Maintain comms with both artillery and aircraft",
    ],
    evaluationCriteria: [
      { criterion: "Timing Coordination", weight: 30, description: "Suppression lift timing accuracy" },
      { criterion: "Fire Control", weight: 25, description: "Adjustment accuracy and speed" },
      { criterion: "Communication", weight: 25, description: "Multi-channel coordination" },
      { criterion: "Safety", weight: 20, description: "No friendly fire incidents" },
    ],
    briefingNotes: "Critical insertion operation. Timing is paramount.",
    debrief: "Suppression timing directly impacts insertion success.",
    createdBy: "Maj Kumar",
    createdAt: "2024-05-20",
    lastUsed: "2024-12-18",
    timesUsed: 35,
    averageScore: 80,
  },
  {
    id: "scn4",
    title: "Night Illumination Mission",
    code: "SCN-ILL-001",
    type: "illumination",
    difficulty: "basic",
    status: "active",
    terrain: "Open Terrain",
    weather: "Clear, No Moon",
    visibility: "Poor (<500m)",
    targetType: "Suspected enemy movement",
    targetDescription: "Vehicle convoy movement reported",
    gridReference: "43R MQ 2345 6789",
    altitude: "900m MSL",
    friendlyPositions: "2km North",
    enemyPositions: "Moving South on Route Alpha",
    aircraftType: "Any",
    munitionsAllowed: ["Illumination rounds - 155mm", "Star shells"],
    timeLimit: 25,
    objectives: [
      "Request illumination support",
      "Adjust for wind drift",
      "Maintain continuous illumination",
      "Transition to engagement if confirmed",
    ],
    evaluationCriteria: [
      { criterion: "Illumination Placement", weight: 30, description: "Optimal positioning for visibility" },
      { criterion: "Adjustment Speed", weight: 25, description: "Wind correction accuracy" },
      { criterion: "Continuous Coverage", weight: 25, description: "No gaps in illumination" },
      { criterion: "Target Confirmation", weight: 20, description: "Accurate reporting" },
    ],
    briefingNotes: "Wind from NW at 15 knots. Expect significant drift.",
    debrief: "Night illumination requires understanding of atmospheric effects.",
    createdBy: "Maj Kumar",
    createdAt: "2024-02-28",
    timesUsed: 52,
    averageScore: 85,
  },
];

const mockSessions: ArtilleryTrainingSession[] = [
  {
    id: "ses1",
    title: "CAS Communication Protocols",
    type: "classroom",
    traineeIds: ["foo1", "foo2", "foo3"],
    traineeNames: ["Lt Arun Kumar", "Capt Priya Sharma", "Lt Vikram Singh"],
    date: "2024-12-20",
    startTime: "09:00",
    endTime: "12:00",
    location: "Classroom A - Fire Control Wing",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    status: "scheduled",
    objectives: [
      "Master CAS brevity codes",
      "Practice 9-line brief format",
      "Understand ROE requirements",
    ],
    equipment: ["Radio simulator", "Projector", "Training manuals"],
    safetyBriefCompleted: false,
  },
  {
    id: "ses2",
    title: "Simulator: Hilltop Engagement",
    type: "simulator",
    scenarioId: "scn1",
    scenarioName: "Hilltop Enemy Position Engagement",
    traineeIds: ["foo1", "foo2"],
    traineeNames: ["Lt Arun Kumar", "Capt Priya Sharma"],
    date: "2024-12-20",
    startTime: "14:00",
    endTime: "17:00",
    location: "Fire Support Simulator Bay",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    aviationInstructorId: "avi1",
    aviationInstructorName: "Wg Cdr P. Nair",
    status: "scheduled",
    objectives: [
      "Execute CAS mission in simulator",
      "Practice aircraft coordination",
      "Conduct battle damage assessment",
    ],
    equipment: ["Simulator stations", "Headsets", "Mission data"],
    safetyBriefCompleted: false,
  },
  {
    id: "ses3",
    title: "Field Exercise: Fire Adjustment",
    type: "field",
    traineeIds: ["foo1", "foo2", "foo3"],
    traineeNames: ["Lt Arun Kumar", "Capt Priya Sharma", "Lt Vikram Singh"],
    date: "2024-12-18",
    startTime: "06:00",
    endTime: "18:00",
    location: "Field Firing Range Bravo",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    status: "completed",
    objectives: [
      "Live fire adjustment procedures",
      "Grid reference accuracy",
      "Communication under field conditions",
    ],
    equipment: ["Radios", "Binoculars", "GPS", "Fire control equipment"],
    weatherConditions: "Clear, Wind 10 knots NE",
    remarks: "All trainees performed well. Focus needed on faster adjustments.",
    safetyBriefCompleted: true,
  },
  {
    id: "ses4",
    title: "Joint Exercise Preparation Brief",
    type: "classroom",
    traineeIds: ["foo1", "foo2"],
    traineeNames: ["Lt Arun Kumar", "Capt Priya Sharma"],
    date: "2024-12-22",
    startTime: "10:00",
    endTime: "12:00",
    location: "Joint Operations Room",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    aviationInstructorId: "avi1",
    aviationInstructorName: "Wg Cdr P. Nair",
    status: "scheduled",
    objectives: [
      "Review joint exercise objectives",
      "Assign roles and responsibilities",
      "Communication plan walkthrough",
    ],
    equipment: ["Maps", "Communication plan", "Safety protocols"],
    safetyBriefCompleted: false,
  },
];

const mockAssessments: FOOAssessment[] = [
  {
    id: "asmt1",
    traineeId: "foo1",
    traineeName: "Lt Arun Kumar",
    type: "simulator",
    phase: "Phase II",
    scenarioId: "scn1",
    scenarioName: "Hilltop Enemy Position Engagement",
    date: "2024-12-15",
    duration: "2h",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    status: "passed",
    maxScore: 100,
    score: 82,
    passingScore: 70,
    evaluations: [
      { category: "Technical", criterion: "Target Identification", maxPoints: 20, points: 17, remarks: "Good accuracy" },
      { category: "Technical", criterion: "Communication Protocol", maxPoints: 25, points: 22 },
      { category: "Safety", criterion: "Safety Procedures", maxPoints: 25, points: 20, remarks: "Minor delay in abort call" },
      { category: "Effectiveness", criterion: "Mission Effectiveness", maxPoints: 20, points: 16 },
      { category: "Effectiveness", criterion: "BDA Accuracy", maxPoints: 10, points: 7 },
    ],
    fireCallAccuracy: 85,
    targetEngagementTime: 8.5,
    communicationScore: 88,
    safetyScore: 80,
    overallRemarks: "Good performance. Needs improvement in abort procedure timing.",
    recommendations: ["Practice abort procedures", "Continue to Phase II advanced scenarios"],
    retakeAllowed: false,
  },
  {
    id: "asmt2",
    traineeId: "foo2",
    traineeName: "Capt Priya Sharma",
    type: "simulator",
    phase: "Phase II",
    scenarioId: "scn2",
    scenarioName: "Urban Area Fire Support",
    date: "2024-12-12",
    duration: "2.5h",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    status: "passed",
    maxScore: 100,
    score: 91,
    passingScore: 75,
    evaluations: [
      { category: "Safety", criterion: "Collateral Damage Avoidance", maxPoints: 30, points: 28 },
      { category: "Technical", criterion: "Precision", maxPoints: 25, points: 24 },
      { category: "Coordination", criterion: "Coordination", maxPoints: 25, points: 22 },
      { category: "Effectiveness", criterion: "Mission Timing", maxPoints: 20, points: 17 },
    ],
    fireCallAccuracy: 92,
    targetEngagementTime: 6.2,
    communicationScore: 94,
    safetyScore: 93,
    overallRemarks: "Excellent performance. Ready for advanced scenarios.",
    recommendations: ["Proceed to expert level scenarios", "Consider as assistant instructor"],
    retakeAllowed: false,
  },
  {
    id: "asmt3",
    traineeId: "foo3",
    traineeName: "Lt Vikram Singh",
    type: "written",
    phase: "Phase I",
    date: "2024-12-10",
    duration: "1.5h",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    status: "passed",
    maxScore: 100,
    score: 75,
    passingScore: 60,
    evaluations: [
      { category: "Theory", criterion: "FOO Procedures", maxPoints: 30, points: 24 },
      { category: "Theory", criterion: "Communication Codes", maxPoints: 25, points: 20 },
      { category: "Theory", criterion: "Safety Regulations", maxPoints: 25, points: 18 },
      { category: "Theory", criterion: "Fire Control Theory", maxPoints: 20, points: 13 },
    ],
    overallRemarks: "Passed with adequate score. More study needed on safety regulations.",
    recommendations: ["Review safety regulations chapter", "Additional tutoring recommended"],
    retakeAllowed: false,
  },
  {
    id: "asmt4",
    traineeId: "foo3",
    traineeName: "Lt Vikram Singh",
    type: "practical",
    phase: "Phase I",
    date: "2024-12-22",
    duration: "3h",
    instructorId: "ins1",
    instructorName: "Col R.K. Sharma",
    status: "pending",
    maxScore: 100,
    passingScore: 70,
    evaluations: [],
    overallRemarks: "",
    recommendations: [],
    retakeAllowed: true,
  },
];

const mockCurriculum: ArtilleryCurriculum[] = [
  {
    id: "cur1",
    name: "Phase I - Basic FOO Procedures",
    code: "FOO-101",
    phase: "Phase I",
    duration: "8 weeks",
    description: "Foundation course for Forward Observation Officer procedures including communication, target identification, and basic fire control",
    prerequisites: [],
    objectives: [
      "Master military communication protocols",
      "Learn target identification procedures",
      "Understand basic fire control principles",
      "Complete basic simulator training",
    ],
    topics: [
      { id: "t1", title: "Introduction to FOO Role", type: "theory", duration: "4h", description: "Overview of FOO responsibilities and importance" },
      { id: "t2", title: "Military Radio Procedures", type: "theory", duration: "8h", description: "Radio protocols, brevity codes, authentication" },
      { id: "t3", title: "Target Identification Basics", type: "theory", duration: "6h", description: "Visual identification, grid references, descriptions" },
      { id: "t4", title: "Radio Simulator Practice", type: "simulator", duration: "10h", description: "Practical radio communication exercises" },
      { id: "t5", title: "Fire Control Fundamentals", type: "theory", duration: "8h", description: "Artillery and CAS fire control basics" },
      { id: "t6", title: "Basic Fire Missions (Sim)", type: "simulator", duration: "20h", description: "Simulator exercises for basic fire missions" },
      { id: "t7", title: "Field Communication Exercise", type: "field", duration: "8h", description: "Field exercise for communication under conditions" },
    ],
    assessments: ["FOO-101-Written", "FOO-101-Practical"],
    status: "active",
    totalHours: 64,
    theoryHours: 26,
    practicalHours: 0,
    simulatorHours: 30,
    fieldHours: 8,
    enrolledTrainees: 3,
    passRate: 85,
  },
  {
    id: "cur2",
    name: "Phase II - Advanced Fire Control",
    code: "FOO-201",
    phase: "Phase II",
    duration: "10 weeks",
    description: "Advanced fire control techniques including CAS coordination, joint operations, and complex fire missions",
    prerequisites: ["FOO-101"],
    objectives: [
      "Master Close Air Support coordination",
      "Execute complex multi-asset fire missions",
      "Coordinate with aviation assets",
      "Handle degraded communication scenarios",
    ],
    topics: [
      { id: "t8", title: "CAS Fundamentals", type: "theory", duration: "12h", description: "Close Air Support principles and procedures" },
      { id: "t9", title: "9-Line Brief Mastery", type: "theory", duration: "8h", description: "Complete 9-line brief training" },
      { id: "t10", title: "Joint Terminal Attack Controller Basics", type: "theory", duration: "10h", description: "JTAC role and coordination" },
      { id: "t11", title: "CAS Simulator Exercises", type: "simulator", duration: "40h", description: "Complex CAS missions in simulator" },
      { id: "t12", title: "Multi-Asset Coordination", type: "simulator", duration: "20h", description: "Coordinating artillery and air assets" },
      { id: "t13", title: "Field Joint Exercise", type: "field", duration: "24h", description: "Joint exercise with aviation assets" },
    ],
    assessments: ["FOO-201-Simulator", "FOO-201-Field"],
    status: "active",
    totalHours: 114,
    theoryHours: 30,
    practicalHours: 0,
    simulatorHours: 60,
    fieldHours: 24,
    enrolledTrainees: 2,
    passRate: 78,
  },
  {
    id: "cur3",
    name: "Phase III - Expert Certification",
    code: "FOO-301",
    phase: "Phase III",
    duration: "6 weeks",
    description: "Expert level certification including night operations, urban warfare support, and instructor qualification",
    prerequisites: ["FOO-101", "FOO-201"],
    objectives: [
      "Qualify for night CAS operations",
      "Master urban fire support procedures",
      "Complete instructor certification",
      "Pass final checkride",
    ],
    topics: [
      { id: "t14", title: "Night Operations Theory", type: "theory", duration: "8h", description: "NVG operations and night fire control" },
      { id: "t15", title: "Urban Fire Support", type: "theory", duration: "10h", description: "Urban warfare fire support procedures" },
      { id: "t16", title: "Night Simulator Exercises", type: "simulator", duration: "20h", description: "Night CAS and fire control" },
      { id: "t17", title: "Urban Scenario Simulator", type: "simulator", duration: "20h", description: "Urban fire support scenarios" },
      { id: "t18", title: "Final Field Exercise", type: "field", duration: "48h", description: "Comprehensive field evaluation" },
    ],
    assessments: ["FOO-301-Night", "FOO-301-Urban", "FOO-301-Final"],
    status: "active",
    totalHours: 106,
    theoryHours: 18,
    practicalHours: 0,
    simulatorHours: 40,
    fieldHours: 48,
    enrolledTrainees: 0,
    passRate: 72,
  },
];

const mockJointExercises: JointExercise[] = [
  {
    id: "jex1",
    name: "Operation Thunder Strike",
    code: "JEX-2024-12",
    type: "live-fire",
    status: "scheduled",
    startDate: "2024-12-28",
    endDate: "2024-12-30",
    location: "Combined Arms Training Range",
    objectives: [
      "Execute coordinated air-ground fire mission",
      "Validate FOO-Pilot communication procedures",
      "Test new fire control protocols",
      "Evaluate trainee performance under realistic conditions",
    ],
    artilleryInstructorId: "ins1",
    artilleryInstructorName: "Col R.K. Sharma",
    aviationInstructorId: "avi1",
    aviationInstructorName: "Wg Cdr P. Nair",
    artilleryTrainees: [
      { id: "foo1", name: "Lt Arun Kumar", role: "Primary FOO" },
      { id: "foo2", name: "Capt Priya Sharma", role: "Backup FOO" },
    ],
    aviationTrainees: [
      { id: "plt1", name: "Fg Off Rahul Verma", role: "Pilot" },
      { id: "plt2", name: "Fg Off Anjali Sharma", role: "Co-Pilot" },
    ],
    aircraft: [
      { type: "ALH Rudra", registration: "Z-3203", crew: ["Fg Off Rahul Verma", "Fg Off Anjali Sharma"] },
    ],
    scenarios: ["scn1", "scn3"],
    safetyOfficer: "Lt Col M. Iyer",
    medicalSupport: "Medical Team Alpha on standby",
    communicationPlan: "Primary: HF 245.0, Secondary: VHF 121.5, Emergency: Guard 243.0",
    contingencyPlan: "Abort procedures in Annex B. Rally point at Grid MQ 1111 2222",
    briefingSchedule: "2024-12-28 0500hrs at Ops Room",
    debriefSchedule: "2024-12-30 1800hrs at Ops Room",
  },
  {
    id: "jex2",
    name: "Operation Sky Shield",
    code: "JEX-2024-11",
    type: "coordination",
    status: "completed",
    startDate: "2024-12-10",
    endDate: "2024-12-12",
    location: "Fire Support Simulator Complex",
    objectives: [
      "Test new joint communication protocols",
      "Validate simulator-based joint training",
      "Develop standard operating procedures",
    ],
    artilleryInstructorId: "ins1",
    artilleryInstructorName: "Col R.K. Sharma",
    aviationInstructorId: "avi1",
    aviationInstructorName: "Wg Cdr P. Nair",
    artilleryTrainees: [
      { id: "foo1", name: "Lt Arun Kumar", role: "FOO" },
      { id: "foo2", name: "Capt Priya Sharma", role: "FOO" },
    ],
    aviationTrainees: [
      { id: "plt1", name: "Fg Off Rahul Verma", role: "Pilot" },
    ],
    aircraft: [],
    scenarios: ["scn1", "scn2"],
    safetyOfficer: "Maj P. Singh",
    medicalSupport: "N/A - Simulator Exercise",
    communicationPlan: "Simulator intercom system",
    contingencyPlan: "N/A",
    briefingSchedule: "2024-12-10 0800hrs",
    debriefSchedule: "2024-12-12 1600hrs",
    results: [
      { objective: "Test new joint communication protocols", achieved: true, remarks: "Protocols validated successfully" },
      { objective: "Validate simulator-based joint training", achieved: true, remarks: "Simulator effective for initial training" },
      { objective: "Develop standard operating procedures", achieved: true, remarks: "SOP v1.0 drafted and approved" },
    ],
  },
];

// Store Interface
interface ArtilleryInstructorState {
  trainees: FOOTrainee[];
  scenarios: FireMissionScenario[];
  sessions: ArtilleryTrainingSession[];
  assessments: FOOAssessment[];
  curriculum: ArtilleryCurriculum[];
  jointExercises: JointExercise[];

  // Trainee CRUD
  addTrainee: (trainee: Omit<FOOTrainee, "id">) => void;
  updateTrainee: (id: string, updates: Partial<FOOTrainee>) => void;
  removeTrainee: (id: string) => void;

  // Scenario CRUD
  addScenario: (scenario: Omit<FireMissionScenario, "id">) => void;
  updateScenario: (id: string, updates: Partial<FireMissionScenario>) => void;
  removeScenario: (id: string) => void;

  // Session CRUD
  addSession: (session: Omit<ArtilleryTrainingSession, "id">) => void;
  updateSession: (id: string, updates: Partial<ArtilleryTrainingSession>) => void;
  removeSession: (id: string) => void;

  // Assessment CRUD
  addAssessment: (assessment: Omit<FOOAssessment, "id">) => void;
  updateAssessment: (id: string, updates: Partial<FOOAssessment>) => void;
  removeAssessment: (id: string) => void;

  // Curriculum CRUD
  addCurriculum: (curriculum: Omit<ArtilleryCurriculum, "id">) => void;
  updateCurriculum: (id: string, updates: Partial<ArtilleryCurriculum>) => void;
  removeCurriculum: (id: string) => void;
  completeTopicInCurriculum: (curriculumId: string, topicId: string) => void;

  // Joint Exercise CRUD
  addJointExercise: (exercise: Omit<JointExercise, "id">) => void;
  updateJointExercise: (id: string, updates: Partial<JointExercise>) => void;
  removeJointExercise: (id: string) => void;

  // Stats
  getInstructorStats: () => {
    totalTrainees: number;
    activeTrainees: number;
    scheduledSessions: number;
    pendingAssessments: number;
    activeScenarios: number;
    upcomingExercises: number;
    averageTraineeScore: number;
  };
}

export const useArtilleryInstructorStore = create<ArtilleryInstructorState>()(
  persist(
    (set, get) => ({
      trainees: mockFOOTrainees,
      scenarios: mockScenarios,
      sessions: mockSessions,
      assessments: mockAssessments,
      curriculum: mockCurriculum,
      jointExercises: mockJointExercises,

      // Trainee CRUD
      addTrainee: (trainee) =>
        set((state) => ({
          trainees: [...state.trainees, { ...trainee, id: `foo${Date.now()}` }],
        })),

      updateTrainee: (id, updates) =>
        set((state) => ({
          trainees: state.trainees.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeTrainee: (id) =>
        set((state) => ({
          trainees: state.trainees.filter((t) => t.id !== id),
        })),

      // Scenario CRUD
      addScenario: (scenario) =>
        set((state) => ({
          scenarios: [...state.scenarios, { ...scenario, id: `scn${Date.now()}` }],
        })),

      updateScenario: (id, updates) =>
        set((state) => ({
          scenarios: state.scenarios.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      removeScenario: (id) =>
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== id),
        })),

      // Session CRUD
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: `ses${Date.now()}` }],
        })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      // Assessment CRUD
      addAssessment: (assessment) =>
        set((state) => ({
          assessments: [...state.assessments, { ...assessment, id: `asmt${Date.now()}` }],
        })),

      updateAssessment: (id, updates) =>
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      removeAssessment: (id) =>
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        })),

      // Curriculum CRUD
      addCurriculum: (curriculum) =>
        set((state) => ({
          curriculum: [...state.curriculum, { ...curriculum, id: `cur${Date.now()}` }],
        })),

      updateCurriculum: (id, updates) =>
        set((state) => ({
          curriculum: state.curriculum.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeCurriculum: (id) =>
        set((state) => ({
          curriculum: state.curriculum.filter((c) => c.id !== id),
        })),

      completeTopicInCurriculum: (curriculumId, topicId) =>
        set((state) => ({
          curriculum: state.curriculum.map((c) =>
            c.id === curriculumId
              ? {
                  ...c,
                  topics: c.topics.map((t) =>
                    t.id === topicId ? { ...t, completed: true } : t
                  ),
                }
              : c
          ),
        })),

      // Joint Exercise CRUD
      addJointExercise: (exercise) =>
        set((state) => ({
          jointExercises: [...state.jointExercises, { ...exercise, id: `jex${Date.now()}` }],
        })),

      updateJointExercise: (id, updates) =>
        set((state) => ({
          jointExercises: state.jointExercises.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      removeJointExercise: (id) =>
        set((state) => ({
          jointExercises: state.jointExercises.filter((e) => e.id !== id),
        })),

      // Stats
      getInstructorStats: () => {
        const state = get();
        const activeTrainees = state.trainees.filter((t) => t.status === "active");
        return {
          totalTrainees: state.trainees.length,
          activeTrainees: activeTrainees.length,
          scheduledSessions: state.sessions.filter((s) => s.status === "scheduled").length,
          pendingAssessments: state.assessments.filter((a) => a.status === "pending").length,
          activeScenarios: state.scenarios.filter((s) => s.status === "active").length,
          upcomingExercises: state.jointExercises.filter((e) => e.status === "scheduled" || e.status === "planning").length,
          averageTraineeScore: activeTrainees.length > 0
            ? Math.round(activeTrainees.reduce((sum, t) => sum + t.averageScore, 0) / activeTrainees.length)
            : 0,
        };
      },
    }),
    {
      name: "artillery-instructor-storage",
    }
  )
);
