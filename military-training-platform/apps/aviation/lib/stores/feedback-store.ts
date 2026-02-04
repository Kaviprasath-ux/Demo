import { create } from "zustand";
import { persist } from "zustand/middleware";

// Feedback Types
export interface InstructorFeedback {
  id: string;
  instructorId: string;
  instructorName: string;
  targetType: "ai_response" | "question" | "scenario" | "mission_plan" | "safety_review";
  targetId: string;
  targetContent: string;
  rating: 1 | 2 | 3 | 4 | 5;
  accuracy: "accurate" | "partially_accurate" | "inaccurate";
  relevance: "highly_relevant" | "relevant" | "partially_relevant" | "not_relevant";
  comments: string;
  suggestedCorrection?: string;
  tags: string[];
  status: "pending" | "reviewed" | "applied" | "rejected";
  reviewedBy?: string;
  reviewedAt?: Date;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  pendingReview: number;
  appliedCorrections: number;
  byTargetType: Record<string, number>;
  byAccuracy: Record<string, number>;
}

interface FeedbackState {
  feedback: InstructorFeedback[];

  // CRUD Operations
  addFeedback: (feedback: Omit<InstructorFeedback, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateFeedback: (id: string, updates: Partial<InstructorFeedback>) => void;
  deleteFeedback: (id: string) => void;

  // Status Operations
  markAsReviewed: (id: string, reviewerId: string) => void;
  applyCorrection: (id: string) => void;
  rejectFeedback: (id: string, reviewerId: string) => void;

  // Query Operations
  getFeedbackByTarget: (targetType: string, targetId?: string) => InstructorFeedback[];
  getFeedbackByInstructor: (instructorId: string) => InstructorFeedback[];
  getPendingFeedback: () => InstructorFeedback[];
  getStats: () => FeedbackStats;
}

// Mock feedback data
const mockFeedback: InstructorFeedback[] = [
  {
    id: "fb-1",
    instructorId: "inst-1",
    instructorName: "Maj. Singh",
    targetType: "ai_response",
    targetId: "resp-001",
    targetContent: "CAS procedures for Rudra helicopter...",
    rating: 4,
    accuracy: "accurate",
    relevance: "highly_relevant",
    comments: "Good explanation of basic CAS procedures. Could include more detail on Type 2 control.",
    suggestedCorrection: "Add section on Type 2 terminal control procedures specific to Indian Army doctrine.",
    tags: ["CAS", "Rudra", "Enhancement"],
    status: "pending",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "fb-2",
    instructorId: "inst-2",
    instructorName: "Lt. Col. Verma",
    targetType: "mission_plan",
    targetId: "plan-001",
    targetContent: "Joint fire plan for sector Alpha...",
    rating: 5,
    accuracy: "accurate",
    relevance: "highly_relevant",
    comments: "Excellent mission plan. All coordination measures properly documented.",
    tags: ["Fire Plan", "Approved"],
    status: "applied",
    reviewedBy: "Admin-1",
    reviewedAt: new Date("2024-01-16"),
    appliedAt: new Date("2024-01-16"),
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "fb-3",
    instructorId: "inst-1",
    instructorName: "Maj. Singh",
    targetType: "safety_review",
    targetId: "safety-001",
    targetContent: "Safety review for mountain operation...",
    rating: 3,
    accuracy: "partially_accurate",
    relevance: "relevant",
    comments: "Altitude considerations need more detail for high-altitude operations.",
    suggestedCorrection: "Include specific service ceiling limitations for each helicopter type in mountain terrain.",
    tags: ["Safety", "High Altitude", "Correction Needed"],
    status: "reviewed",
    reviewedBy: "Admin-2",
    reviewedAt: new Date("2024-01-17"),
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "fb-4",
    instructorId: "inst-3",
    instructorName: "Capt. Kumar",
    targetType: "question",
    targetId: "q-001",
    targetContent: "What is the effective range of Helina missile?",
    rating: 2,
    accuracy: "inaccurate",
    relevance: "relevant",
    comments: "The range stated is incorrect. Should be 7km, not 5km.",
    suggestedCorrection: "Update Helina range to 7km as per current specifications.",
    tags: ["Weapons", "Correction"],
    status: "pending",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
];

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedback: mockFeedback,

      addFeedback: (newFeedback) =>
        set((state) => ({
          feedback: [
            ...state.feedback,
            {
              ...newFeedback,
              id: `fb-${Date.now()}`,
              status: "pending",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateFeedback: (id, updates) =>
        set((state) => ({
          feedback: state.feedback.map((fb) =>
            fb.id === id ? { ...fb, ...updates, updatedAt: new Date() } : fb
          ),
        })),

      deleteFeedback: (id) =>
        set((state) => ({
          feedback: state.feedback.filter((fb) => fb.id !== id),
        })),

      markAsReviewed: (id, reviewerId) =>
        set((state) => ({
          feedback: state.feedback.map((fb) =>
            fb.id === id
              ? {
                  ...fb,
                  status: "reviewed",
                  reviewedBy: reviewerId,
                  reviewedAt: new Date(),
                  updatedAt: new Date(),
                }
              : fb
          ),
        })),

      applyCorrection: (id) =>
        set((state) => ({
          feedback: state.feedback.map((fb) =>
            fb.id === id
              ? {
                  ...fb,
                  status: "applied",
                  appliedAt: new Date(),
                  updatedAt: new Date(),
                }
              : fb
          ),
        })),

      rejectFeedback: (id, reviewerId) =>
        set((state) => ({
          feedback: state.feedback.map((fb) =>
            fb.id === id
              ? {
                  ...fb,
                  status: "rejected",
                  reviewedBy: reviewerId,
                  reviewedAt: new Date(),
                  updatedAt: new Date(),
                }
              : fb
          ),
        })),

      getFeedbackByTarget: (targetType, targetId) =>
        get().feedback.filter(
          (fb) => fb.targetType === targetType && (!targetId || fb.targetId === targetId)
        ),

      getFeedbackByInstructor: (instructorId) =>
        get().feedback.filter((fb) => fb.instructorId === instructorId),

      getPendingFeedback: () =>
        get().feedback.filter((fb) => fb.status === "pending"),

      getStats: () => {
        const feedback = get().feedback;
        const byTargetType: Record<string, number> = {};
        const byAccuracy: Record<string, number> = {};

        feedback.forEach((fb) => {
          byTargetType[fb.targetType] = (byTargetType[fb.targetType] || 0) + 1;
          byAccuracy[fb.accuracy] = (byAccuracy[fb.accuracy] || 0) + 1;
        });

        return {
          totalFeedback: feedback.length,
          averageRating:
            feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length || 0,
          pendingReview: feedback.filter((fb) => fb.status === "pending").length,
          appliedCorrections: feedback.filter((fb) => fb.status === "applied").length,
          byTargetType,
          byAccuracy,
        };
      },
    }),
    {
      name: "aviation-feedback-store",
    }
  )
);
