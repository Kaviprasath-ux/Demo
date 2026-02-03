export interface User {
  id: string;
  name: string;
  role: 'admin' | 'instructor' | 'trainee';
  unit: string;
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
