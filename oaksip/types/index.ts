export type UserRole = 'admin' | 'instructor' | 'leadership' | 'trainee';

// Course types as per SOW - SoA course structures
export type CourseType = 'YO' | 'LGSC' | 'JCO' | 'OR_CADRE' | 'STA' | 'ALL';

// Assessment types as per SOW Section 8.2
export type AssessmentType = 'diagnostic' | 'practice' | 'summative' | 'requalification';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  unit: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  source?: string;
}

export interface UnitStats {
  unitName: string;
  totalTrainees: number;
  completionRate: number;
  avgScore: number;
  activeTrainings: number;
  passRate: number;
}

export interface TraineeProgress {
  userId: string;
  userName: string;
  quizzesCompleted: number;
  avgScore: number;
  trainingHours: number;
  lastActive: Date;
  status: 'on-track' | 'needs-attention' | 'excelling';
}

export interface Source {
  document: string;
  page: number;
}

export interface QueryResult {
  answer: string;
  sources: Source[];
  confidence: number;
}

export interface Query {
  id: string;
  query: string;
  result: QueryResult;
  timestamp: Date;
  userId: string;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  pages: number;
  category: string;
  uploadedAt: Date;
  size: string;
}

export interface SimulatorExercise {
  id: number;
  name: string;
  date: Date;
  participants: number;
  avgAccuracy: number;
  duration: number;
}

export interface SimulatorStats {
  totalExercises: number;
  avgAccuracy: number;
  totalParticipants: number;
  commonErrors: string[];
  exercisesByMonth: { month: string; count: number }[];
  accuracyTrend: { date: string; accuracy: number }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  query?: string;
  timestamp: Date;
  ip: string;
}

// =============================================================================
// RUBRIC SYSTEM - SOW Section 8.2 Rubric-based evaluation
// =============================================================================

// Individual rubric criterion with scoring levels
export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  levels: RubricLevel[];
}

// Scoring level within a criterion (e.g., 1-5 scale)
export interface RubricLevel {
  score: number;
  label: string; // e.g., "Excellent", "Good", "Satisfactory", "Needs Improvement", "Poor"
  description: string; // What performance looks like at this level
}

// Complete rubric template
export interface Rubric {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., "Tactical Appreciation", "Fire Plan", "STA Deployment"
  criteria: RubricCriterion[];
  totalMaxScore: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: 'active' | 'draft' | 'archived';
}

// =============================================================================
// SUBJECTIVE QUESTIONS - SOW Section 8.1
// =============================================================================

export type QuestionType = 'mcq' | 'subjective' | 'numerical' | 'matching';

export interface SubjectiveQuestion {
  id: string;
  type: 'subjective';
  question: string;
  context?: string; // Scenario or background information
  expectedPoints: string[]; // Key points expected in the answer
  sampleAnswer?: string; // Model answer for reference
  rubricId: string; // Link to rubric for evaluation
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  course: CourseType;
  maxMarks: number;
  timeAllocation: number; // Minutes suggested for this question
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  source?: string;
}

// =============================================================================
// ASSESSMENT SCHEDULING - SOW Section 8.2
// =============================================================================

export interface ScheduledAssessment {
  id: string;
  title: string;
  description: string;
  assessmentType: AssessmentType;
  course: CourseType;
  scheduledDate: Date;
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  duration: number; // Minutes
  venue?: string;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  questionConfig: {
    mcqCount: number;
    subjectiveCount: number;
    categories: string[];
  };
  assignedBatches: string[];
  assignedTrainees: string[];
  createdBy: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

// =============================================================================
// ANSWER SCRIPTS - SOW Section 8.2
// =============================================================================

export interface AnswerScript {
  id: string;
  assessmentId: string;
  traineeId: string;
  traineeName: string;
  submittedAt: Date;
  status: 'submitted' | 'under-review' | 'graded' | 'returned';

  // MCQ Answers
  mcqAnswers: {
    questionId: string;
    selectedOption: number | null;
    isCorrect: boolean;
    marksAwarded: number;
  }[];

  // Subjective Answers
  subjectiveAnswers: {
    questionId: string;
    answer: string;
    wordCount: number;
    rubricScores?: {
      criterionId: string;
      score: number;
      feedback: string;
    }[];
    totalMarks?: number;
    feedback?: string;
    gradedBy?: string;
    gradedAt?: Date;
  }[];

  // Totals
  mcqScore: number;
  subjectiveScore: number;
  totalScore: number;
  percentage: number;
  grade: string;

  // Instructor feedback
  overallFeedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

// =============================================================================
// TRAINEE PROGRESS TRACKING - SOW Section 8.3
// =============================================================================

export interface ProgressDataPoint {
  date: Date;
  score: number;
  assessmentType: AssessmentType;
  assessmentId: string;
}

export interface TraineeProgressHistory {
  traineeId: string;
  traineeName: string;
  course: CourseType;
  enrollmentDate: Date;

  // Score progression
  scoreHistory: ProgressDataPoint[];

  // Topic-wise trends
  topicTrends: {
    topic: string;
    scores: { date: Date; score: number }[];
    currentLevel: number;
    improvement: number; // Percentage improvement from first to last
  }[];

  // Milestones
  milestones: {
    name: string;
    achievedAt: Date;
    description: string;
  }[];

  // Comparison metrics
  batchAverage: number;
  percentileRank: number;
}

// =============================================================================
// UNIT PERFORMANCE - For Leadership Reports
// =============================================================================

export interface UnitPerformance {
  unitName: string;
  completionRate: number;
  averageScore: number;
  passRate: number;
  totalTrainees?: number;
  activeTrainings?: number;
}
