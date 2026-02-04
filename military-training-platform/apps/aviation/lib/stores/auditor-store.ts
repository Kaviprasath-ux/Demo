import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ TYPES ============

export interface TrainingReport {
  id: string;
  title: string;
  type: "compliance" | "performance" | "incident" | "assessment" | "operational";
  period: string;
  generatedDate: string;
  generatedBy: string;
  status: "draft" | "final" | "archived";
  findings: number;
  recommendations: number;
  summary: string;
}

export interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: "compliant" | "non-compliant" | "partial" | "pending";
  lastAuditDate: string;
  nextAuditDate: string;
  assignedTo: string;
  notes: string;
  evidence: string[];
}

export interface TrainingMetric {
  id: string;
  name: string;
  category: "artillery" | "aviation" | "joint" | "safety";
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
  period: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  severity: "critical" | "major" | "minor" | "observation";
  category: string;
  description: string;
  identifiedDate: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  assignedTo: string;
  dueDate: string;
  resolution?: string;
}

export interface SystemOverview {
  totalTrainingSessions: number;
  completedSessions: number;
  activeTrainees: number;
  activeInstructors: number;
  avgComplianceRate: number;
  openFindings: number;
  pendingReports: number;
  lastAuditDate: string;
}

// ============ STORE ============

interface AuditorState {
  reports: TrainingReport[];
  complianceItems: ComplianceItem[];
  metrics: TrainingMetric[];
  findings: AuditFinding[];
  overview: SystemOverview;

  // Report actions
  generateReport: (type: TrainingReport["type"], period: string) => void;
  updateReportStatus: (id: string, status: TrainingReport["status"]) => void;

  // Finding actions
  addFinding: (finding: Omit<AuditFinding, "id">) => void;
  updateFinding: (id: string, updates: Partial<AuditFinding>) => void;

  // Helpers
  getReportsByType: (type: TrainingReport["type"]) => TrainingReport[];
  getOpenFindings: () => AuditFinding[];
  getComplianceByStatus: (status: ComplianceItem["status"]) => ComplianceItem[];
}

// ============ MOCK DATA ============

const mockReports: TrainingReport[] = [
  {
    id: "RPT-001",
    title: "Q4 2024 Artillery Training Compliance Report",
    type: "compliance",
    period: "Oct-Dec 2024",
    generatedDate: "2024-12-15",
    generatedBy: "Col M. Iyer",
    status: "final",
    findings: 3,
    recommendations: 5,
    summary: "Overall compliance rate of 94% achieved. Minor gaps in documentation practices identified.",
  },
  {
    id: "RPT-002",
    title: "Aviation Training Performance Analysis",
    type: "performance",
    period: "Nov 2024",
    generatedDate: "2024-12-01",
    generatedBy: "Col M. Iyer",
    status: "final",
    findings: 2,
    recommendations: 4,
    summary: "CAS mission success rate improved by 12% compared to previous quarter.",
  },
  {
    id: "RPT-003",
    title: "Joint Operations Assessment Review",
    type: "assessment",
    period: "Q4 2024",
    generatedDate: "2024-12-18",
    generatedBy: "Col M. Iyer",
    status: "draft",
    findings: 5,
    recommendations: 8,
    summary: "Joint fire coordination procedures need standardization across units.",
  },
  {
    id: "RPT-004",
    title: "Safety Incident Analysis Report",
    type: "incident",
    period: "2024",
    generatedDate: "2024-12-10",
    generatedBy: "Audit Team",
    status: "final",
    findings: 1,
    recommendations: 3,
    summary: "Zero safety incidents reported. Near-miss reporting improved by 25%.",
  },
  {
    id: "RPT-005",
    title: "Operational Readiness Assessment",
    type: "operational",
    period: "Dec 2024",
    generatedDate: "2024-12-20",
    generatedBy: "Col M. Iyer",
    status: "draft",
    findings: 4,
    recommendations: 6,
    summary: "85% of trainees meet operational readiness standards.",
  },
];

const mockComplianceItems: ComplianceItem[] = [
  {
    id: "CMP-001",
    category: "Training Documentation",
    requirement: "All training sessions must be documented within 24 hours",
    status: "compliant",
    lastAuditDate: "2024-12-15",
    nextAuditDate: "2025-01-15",
    assignedTo: "Training Admin",
    notes: "Documentation compliance at 98%",
    evidence: ["Training logs", "Session reports"],
  },
  {
    id: "CMP-002",
    category: "Safety Protocols",
    requirement: "Safety briefings mandatory before live-fire exercises",
    status: "compliant",
    lastAuditDate: "2024-12-10",
    nextAuditDate: "2025-01-10",
    assignedTo: "Safety Officer",
    notes: "100% compliance on safety briefings",
    evidence: ["Briefing records", "Attendance sheets"],
  },
  {
    id: "CMP-003",
    category: "Equipment Certification",
    requirement: "All simulators must be certified annually",
    status: "partial",
    lastAuditDate: "2024-11-20",
    nextAuditDate: "2024-12-20",
    assignedTo: "Equipment Manager",
    notes: "2 simulators pending re-certification",
    evidence: ["Certification records"],
  },
  {
    id: "CMP-004",
    category: "Instructor Qualification",
    requirement: "Instructors must complete refresher training annually",
    status: "compliant",
    lastAuditDate: "2024-12-01",
    nextAuditDate: "2025-01-01",
    assignedTo: "HR Department",
    notes: "All instructors current on qualifications",
    evidence: ["Training certificates", "Qualification records"],
  },
  {
    id: "CMP-005",
    category: "Data Security",
    requirement: "Training data must be backed up daily",
    status: "compliant",
    lastAuditDate: "2024-12-18",
    nextAuditDate: "2025-01-18",
    assignedTo: "IT Department",
    notes: "Automated daily backups operational",
    evidence: ["Backup logs", "Recovery test results"],
  },
  {
    id: "CMP-006",
    category: "Assessment Standards",
    requirement: "All assessments must follow standardized rubrics",
    status: "non-compliant",
    lastAuditDate: "2024-12-12",
    nextAuditDate: "2024-12-26",
    assignedTo: "Quality Assurance",
    notes: "Aviation assessments need rubric updates",
    evidence: [],
  },
];

const mockMetrics: TrainingMetric[] = [
  {
    id: "MET-001",
    name: "Training Completion Rate",
    category: "artillery",
    currentValue: 87,
    targetValue: 90,
    unit: "%",
    trend: "up",
    period: "Dec 2024",
  },
  {
    id: "MET-002",
    name: "CAS Mission Success Rate",
    category: "aviation",
    currentValue: 92,
    targetValue: 95,
    unit: "%",
    trend: "up",
    period: "Dec 2024",
  },
  {
    id: "MET-003",
    name: "Joint Operation Coordination",
    category: "joint",
    currentValue: 78,
    targetValue: 85,
    unit: "%",
    trend: "stable",
    period: "Dec 2024",
  },
  {
    id: "MET-004",
    name: "Safety Compliance Rate",
    category: "safety",
    currentValue: 100,
    targetValue: 100,
    unit: "%",
    trend: "stable",
    period: "Dec 2024",
  },
  {
    id: "MET-005",
    name: "Average Assessment Score",
    category: "artillery",
    currentValue: 76,
    targetValue: 75,
    unit: "%",
    trend: "up",
    period: "Dec 2024",
  },
  {
    id: "MET-006",
    name: "Simulator Utilization",
    category: "aviation",
    currentValue: 68,
    targetValue: 80,
    unit: "%",
    trend: "down",
    period: "Dec 2024",
  },
  {
    id: "MET-007",
    name: "Field Exercise Completion",
    category: "joint",
    currentValue: 94,
    targetValue: 90,
    unit: "%",
    trend: "up",
    period: "Dec 2024",
  },
  {
    id: "MET-008",
    name: "Near-Miss Reporting Rate",
    category: "safety",
    currentValue: 85,
    targetValue: 80,
    unit: "%",
    trend: "up",
    period: "Dec 2024",
  },
];

const mockFindings: AuditFinding[] = [
  {
    id: "FND-001",
    title: "Assessment Rubric Inconsistency",
    severity: "major",
    category: "Assessment Standards",
    description: "Aviation assessment rubrics differ from artillery standards, causing grading inconsistencies.",
    identifiedDate: "2024-12-12",
    status: "in-progress",
    assignedTo: "Quality Assurance Team",
    dueDate: "2024-12-30",
  },
  {
    id: "FND-002",
    title: "Simulator Certification Gap",
    severity: "minor",
    category: "Equipment",
    description: "Two flight simulators pending annual certification renewal.",
    identifiedDate: "2024-11-20",
    status: "open",
    assignedTo: "Equipment Manager",
    dueDate: "2024-12-25",
  },
  {
    id: "FND-003",
    title: "Documentation Delay Pattern",
    severity: "observation",
    category: "Training Documentation",
    description: "8% of training sessions documented after 24-hour window.",
    identifiedDate: "2024-12-15",
    status: "open",
    assignedTo: "Training Admin",
    dueDate: "2025-01-15",
  },
  {
    id: "FND-004",
    title: "Joint Operation Communication Gap",
    severity: "major",
    category: "Operations",
    description: "Communication protocols between artillery and aviation units need standardization.",
    identifiedDate: "2024-12-18",
    status: "open",
    assignedTo: "Operations Team",
    dueDate: "2025-01-10",
  },
  {
    id: "FND-005",
    title: "Outdated Training Material",
    severity: "minor",
    category: "Content",
    description: "Three training modules reference outdated procedures.",
    identifiedDate: "2024-12-10",
    status: "resolved",
    assignedTo: "Content Team",
    dueDate: "2024-12-20",
    resolution: "Training materials updated and reviewed.",
  },
];

const mockOverview: SystemOverview = {
  totalTrainingSessions: 245,
  completedSessions: 218,
  activeTrainees: 42,
  activeInstructors: 8,
  avgComplianceRate: 94,
  openFindings: 4,
  pendingReports: 2,
  lastAuditDate: "2024-12-18",
};

// ============ STORE IMPLEMENTATION ============

export const useAuditorStore = create<AuditorState>()(
  persist(
    (set, get) => ({
      reports: mockReports,
      complianceItems: mockComplianceItems,
      metrics: mockMetrics,
      findings: mockFindings,
      overview: mockOverview,

      // Report actions
      generateReport: (type, period) =>
        set((state) => ({
          reports: [
            ...state.reports,
            {
              id: `RPT-${Date.now()}`,
              title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${period}`,
              type,
              period,
              generatedDate: new Date().toISOString().split("T")[0],
              generatedBy: "System",
              status: "draft",
              findings: 0,
              recommendations: 0,
              summary: "Report generated. Pending review.",
            },
          ],
        })),
      updateReportStatus: (id, status) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      // Finding actions
      addFinding: (finding) =>
        set((state) => ({
          findings: [
            ...state.findings,
            { ...finding, id: `FND-${Date.now()}` },
          ],
        })),
      updateFinding: (id, updates) =>
        set((state) => ({
          findings: state.findings.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      // Helpers
      getReportsByType: (type) =>
        get().reports.filter((r) => r.type === type),
      getOpenFindings: () =>
        get().findings.filter(
          (f) => f.status === "open" || f.status === "in-progress"
        ),
      getComplianceByStatus: (status) =>
        get().complianceItems.filter((c) => c.status === status),
    }),
    { name: "auditor-store" }
  )
);
