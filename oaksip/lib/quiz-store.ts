"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CourseType, AssessmentType } from "@/types";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  course?: CourseType; // Maps to SoA course structure
  weaponSystem?: string; // e.g., "Dhanush", "Bofors", "K9"
}

// Topic-wise performance breakdown
export interface TopicScore {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

// Per-question time tracking - SOW Section 8.3
export interface QuestionTimeData {
  questionId: string;
  startTime: number;
  endTime: number | null;
  timeSpent: number; // seconds
}

export interface QuizAttempt {
  id: string;
  date: number;
  score: number;
  totalQuestions: number;
  timeSpent: number; // seconds
  category: string;
  difficulty: string;
  // New fields for SOW compliance
  course: CourseType;
  assessmentType: AssessmentType;
  negativeMarking: boolean;
  netScore: number; // Score after negative marking
  topicBreakdown: TopicScore[]; // Topic-wise performance
  wrongAnswers: number;
  // Per-question time analysis - SOW Section 8.3
  questionTimes: QuestionTimeData[];
  averageTimePerQuestion: number;
  fastestQuestion: { id: string; time: number } | null;
  slowestQuestion: { id: string; time: number } | null;
}

// Quiz configuration for new session
export interface QuizConfig {
  category: string;
  difficulty: string;
  count: number;
  course: CourseType;
  assessmentType: AssessmentType;
  negativeMarking: boolean;
}

export interface QuizState {
  // Question bank
  questions: QuizQuestion[];

  // Current quiz session
  currentQuiz: QuizQuestion[] | null;
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  startTime: number | null;
  isCompleted: boolean;

  // Current quiz configuration
  currentConfig: QuizConfig | null;

  // Per-question time tracking - SOW Section 8.3
  questionTimes: QuestionTimeData[];
  currentQuestionStartTime: number | null;

  // History
  attempts: QuizAttempt[];

  // Actions
  startQuiz: (config: QuizConfig) => void;
  selectAnswer: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => QuizAttempt;
  resetQuiz: () => void;
  getScore: () => { correct: number; total: number; percentage: number; netScore: number; wrongAnswers: number };
  getTopicBreakdown: () => TopicScore[];
  getQuestionTimeAnalysis: () => { questionTimes: QuestionTimeData[]; average: number; fastest: QuestionTimeData | null; slowest: QuestionTimeData | null };
}

// Question bank with course mappings for SoA curriculum alignment
const allQuestions: QuizQuestion[] = [
  // Easy questions - suitable for OR Cadre, JCO basics
  {
    id: "e1",
    question: "What is the caliber of the standard Indian Army field gun covered in this training?",
    options: ["105mm", "130mm", "155mm", "175mm"],
    correctIndex: 2,
    explanation: "The 155mm is the standard caliber for modern field artillery, offering an optimal balance of range, firepower, and mobility.",
    difficulty: "easy",
    category: "General",
    course: "OR_CADRE",
    weaponSystem: "Dhanush"
  },
  {
    id: "e2",
    question: "What type of breech mechanism does the 155mm gun use?",
    options: ["Horizontal sliding", "Vertical sliding", "Screw type", "Falling block"],
    correctIndex: 1,
    explanation: "The vertical sliding breech block moves vertically to open and close, allowing for rapid loading and firing.",
    difficulty: "easy",
    category: "Components",
    course: "OR_CADRE",
    weaponSystem: "Dhanush"
  },
  {
    id: "e3",
    question: "What is the primary purpose of the recoil system?",
    options: ["Increase range", "Absorb firing force", "Aim the gun", "Load ammunition"],
    correctIndex: 1,
    explanation: "The hydro-pneumatic recoil system absorbs the enormous force generated during firing, protecting the gun and crew.",
    difficulty: "easy",
    category: "Components",
    course: "JCO",
    weaponSystem: "Dhanush"
  },
  {
    id: "e4",
    question: "How many trail legs does the 155mm gun carriage have?",
    options: ["One", "Two (split trails)", "Three", "Four"],
    correctIndex: 1,
    explanation: "The split-trail design provides stability during firing and allows for a wider traverse angle.",
    difficulty: "easy",
    category: "Components",
    course: "OR_CADRE",
    weaponSystem: "Dhanush"
  },
  {
    id: "e5",
    question: "What should you do FIRST if a misfire occurs?",
    options: ["Open the breech immediately", "Announce 'MISFIRE' and wait", "Look into the muzzle", "Remove the round"],
    correctIndex: 1,
    explanation: "Always announce 'MISFIRE' and wait at least 30 seconds before taking any action. This prevents injury from delayed ignition.",
    difficulty: "easy",
    category: "Safety",
    course: "OR_CADRE",
    weaponSystem: "Dhanush"
  },
  {
    id: "e6",
    question: "What does the sighting system help determine?",
    options: ["Ammunition type", "Barrel temperature", "Target direction and elevation", "Crew positions"],
    correctIndex: 2,
    explanation: "The panoramic telescope and other sighting components help gunners determine the correct direction (deflection) and elevation for accurate fire.",
    difficulty: "easy",
    category: "Components",
    course: "JCO",
    weaponSystem: "Dhanush"
  },

  // Medium questions - JCO and YO level
  {
    id: "m1",
    question: "What is the approximate maximum range of a 155mm gun with standard HE ammunition?",
    options: ["10-15 km", "18-24 km", "30-35 km", "40-50 km"],
    correctIndex: 1,
    explanation: "Standard HE rounds typically achieve 18-24km range. Extended range ammunition like ERFB or RAP can reach 30-40km+.",
    difficulty: "medium",
    category: "Technical",
    course: "YO",
    weaponSystem: "Dhanush"
  },
  {
    id: "m2",
    question: "In the recoil system, what returns the barrel to battery position after firing?",
    options: ["Manual crank", "Spring mechanism", "Recuperator", "Electric motor"],
    correctIndex: 2,
    explanation: "The recuperator uses compressed nitrogen gas to push the barrel back to its firing (battery) position after recoil.",
    difficulty: "medium",
    category: "Components",
    course: "JCO",
    weaponSystem: "Dhanush"
  },
  {
    id: "m3",
    question: "What is the minimum waiting time after a misfire before attempting to re-fire?",
    options: ["10 seconds", "30 seconds", "1 minute", "5 minutes"],
    correctIndex: 1,
    explanation: "Wait at least 30 seconds after a misfire. If re-firing fails twice, wait 5 minutes before opening the breech.",
    difficulty: "medium",
    category: "Safety",
    course: "JCO",
    weaponSystem: "Dhanush"
  },
  {
    id: "m4",
    question: "How many mils equal a complete circle (360 degrees)?",
    options: ["3200 mils", "4800 mils", "6400 mils", "8000 mils"],
    correctIndex: 2,
    explanation: "The military uses 6400 mils per circle. This allows for more precise angular measurements than degrees.",
    difficulty: "medium",
    category: "Technical",
    course: "YO",
    weaponSystem: "Dhanush"
  },
  {
    id: "m5",
    question: "What is the purpose of the obturator in the breech block?",
    options: ["Ignite the propellant", "Seal propellant gases", "Extract spent cases", "Lock the breech"],
    correctIndex: 1,
    explanation: "The obturator creates a gas-tight seal, preventing propellant gases from escaping rearward during firing.",
    difficulty: "medium",
    category: "Components",
    course: "JCO",
    weaponSystem: "Dhanush"
  },
  {
    id: "m6",
    question: "During sustained fire, what is critical to monitor?",
    options: ["Wheel alignment", "Barrel temperature", "Paint condition", "Trail angle"],
    correctIndex: 1,
    explanation: "Barrel temperature must be monitored during sustained fire. Overheating can cause barrel wear, reduced accuracy, or catastrophic failure.",
    difficulty: "medium",
    category: "Safety",
    course: "YO",
    weaponSystem: "Dhanush"
  },
  {
    id: "m7",
    question: "What increases the range of base bleed ammunition?",
    options: ["Heavier projectile", "Reduced drag from gas emission", "Larger propellant charge", "Higher barrel pressure"],
    correctIndex: 1,
    explanation: "Base bleed rounds emit gas from the base, filling the low-pressure wake and reducing aerodynamic drag by 20-30%.",
    difficulty: "medium",
    category: "Technical",
    course: "LGSC",
    weaponSystem: "Dhanush"
  },

  // Hard questions - LGSC and advanced YO
  {
    id: "h1",
    question: "What is the correct order for the firing sequence after receiving a fire mission?",
    options: [
      "Load, Aim, Compute, Fire, Verify",
      "Compute, Set data, Load, Verify clear, Fire",
      "Aim, Load, Verify, Compute, Fire",
      "Verify, Load, Compute, Aim, Fire"
    ],
    correctIndex: 1,
    explanation: "The correct sequence: Receive mission → Compute firing data → Set elevation/deflection → Load → Verify personnel clear → Fire.",
    difficulty: "hard",
    category: "Procedures",
    course: "LGSC",
    weaponSystem: "Dhanush"
  },
  {
    id: "h2",
    question: "What happens to the breech block when the gun is fired and recoils?",
    options: [
      "It remains closed until manually opened",
      "It opens automatically due to cam action",
      "It stays locked until barrel returns to battery",
      "It partially opens for cooling"
    ],
    correctIndex: 1,
    explanation: "Semi-automatic breech: The recoil action trips a cam that opens the breech automatically, ejecting the spent case and readying for the next round.",
    difficulty: "hard",
    category: "Components",
    course: "LGSC",
    weaponSystem: "Dhanush"
  },
  {
    id: "h3",
    question: "If the recoil system fails to return the barrel to battery, what is the likely cause?",
    options: [
      "Low recuperator pressure or fluid leak",
      "Barrel overheating",
      "Incorrect ammunition",
      "Worn bore lining"
    ],
    correctIndex: 0,
    explanation: "Failure to return to battery typically indicates low nitrogen pressure in the recuperator or hydraulic fluid loss in the recoil cylinder.",
    difficulty: "hard",
    category: "Maintenance",
    course: "LGSC",
    weaponSystem: "Dhanush"
  },
  {
    id: "h4",
    question: "What is the purpose of rifling in the barrel?",
    options: [
      "Reduce barrel wear",
      "Increase muzzle velocity",
      "Impart spin for gyroscopic stability",
      "Cool the projectile"
    ],
    correctIndex: 2,
    explanation: "Rifling grooves impart spin to the projectile, creating gyroscopic stability that keeps it pointed nose-forward during flight for accuracy.",
    difficulty: "hard",
    category: "Technical",
    course: "YO",
    weaponSystem: "Dhanush"
  },
  {
    id: "h5",
    question: "During emplacement drill, what should be verified before the gun is declared ready to fire?",
    options: [
      "Barrel is clean and sights aligned",
      "Trails spread, spades dug in, platform level, sights oriented",
      "Ammunition is stacked nearby",
      "All crew members are present"
    ],
    correctIndex: 1,
    explanation: "Proper emplacement requires: trails spread at correct angle, spades firmly dug in, platform level, and sighting system oriented to the aiming point.",
    difficulty: "hard",
    category: "Procedures",
    course: "YO",
    weaponSystem: "Dhanush"
  },
  {
    id: "h6",
    question: "What differentiates Charge Super from lower propellant charges?",
    options: [
      "Different color coding only",
      "Higher velocity and range but increased barrel wear",
      "Reduced recoil",
      "Quieter firing signature"
    ],
    correctIndex: 1,
    explanation: "Charge Super provides maximum velocity and range but causes accelerated barrel wear. It's reserved for maximum range engagements.",
    difficulty: "hard",
    category: "Technical",
    course: "LGSC",
    weaponSystem: "Dhanush"
  },
  // Additional questions for STA Course
  {
    id: "sta1",
    question: "What is the primary role of STA (Surveillance and Target Acquisition) in artillery operations?",
    options: [
      "Direct fire on visible targets",
      "Locate enemy positions and adjust friendly fire",
      "Provide infantry support",
      "Maintain communication equipment"
    ],
    correctIndex: 1,
    explanation: "STA elements locate enemy positions using various sensors and methods, then provide target data to fire units and adjust fire for accuracy.",
    difficulty: "medium",
    category: "Tactics",
    course: "STA",
    weaponSystem: "Dhanush"
  },
  {
    id: "sta2",
    question: "Which of the following is a counter-battery detection method?",
    options: [
      "Visual reconnaissance only",
      "Weapon locating radar",
      "Infantry patrol reports",
      "Satellite imagery only"
    ],
    correctIndex: 1,
    explanation: "Weapon locating radars (like SWATHI) detect enemy artillery by tracking projectile trajectories and computing origin points for counter-battery fire.",
    difficulty: "hard",
    category: "Tactics",
    course: "STA",
    weaponSystem: "Dhanush"
  }
];

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: allQuestions,
      currentQuiz: null,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      startTime: null,
      isCompleted: false,
      currentConfig: null,
      questionTimes: [],
      currentQuestionStartTime: null,
      attempts: [],

      startQuiz: (config: QuizConfig) => {
        let filtered = allQuestions;

        // Filter by category
        if (config.category !== "all") {
          filtered = filtered.filter(q => q.category.toLowerCase() === config.category.toLowerCase());
        }
        // Filter by difficulty
        if (config.difficulty !== "all") {
          filtered = filtered.filter(q => q.difficulty === config.difficulty);
        }
        // Filter by course (new SOW requirement)
        if (config.course !== "ALL") {
          filtered = filtered.filter(q => !q.course || q.course === config.course || q.course === "ALL");
        }

        // Shuffle and take requested count
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(config.count, shuffled.length));

        const now = Date.now();
        set({
          currentQuiz: selected,
          currentQuestionIndex: 0,
          selectedAnswers: new Array(selected.length).fill(null),
          startTime: now,
          isCompleted: false,
          currentConfig: config,
          questionTimes: selected.map(q => ({
            questionId: q.id,
            startTime: 0,
            endTime: null,
            timeSpent: 0,
          })),
          currentQuestionStartTime: now,
        });
      },

      selectAnswer: (index) => {
        const { selectedAnswers, currentQuestionIndex } = get();
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = index;
        set({ selectedAnswers: newAnswers });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, currentQuiz, questionTimes, currentQuestionStartTime } = get();
        if (currentQuiz && currentQuestionIndex < currentQuiz.length - 1) {
          // Record time for current question
          const now = Date.now();
          const updatedTimes = [...questionTimes];
          if (currentQuestionStartTime) {
            const timeSpent = Math.floor((now - currentQuestionStartTime) / 1000);
            updatedTimes[currentQuestionIndex] = {
              ...updatedTimes[currentQuestionIndex],
              timeSpent: updatedTimes[currentQuestionIndex].timeSpent + timeSpent,
              endTime: now,
            };
          }
          // Start timing next question
          updatedTimes[currentQuestionIndex + 1] = {
            ...updatedTimes[currentQuestionIndex + 1],
            startTime: now,
          };
          set({
            currentQuestionIndex: currentQuestionIndex + 1,
            questionTimes: updatedTimes,
            currentQuestionStartTime: now,
          });
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex, questionTimes, currentQuestionStartTime } = get();
        if (currentQuestionIndex > 0) {
          // Record time for current question
          const now = Date.now();
          const updatedTimes = [...questionTimes];
          if (currentQuestionStartTime) {
            const timeSpent = Math.floor((now - currentQuestionStartTime) / 1000);
            updatedTimes[currentQuestionIndex] = {
              ...updatedTimes[currentQuestionIndex],
              timeSpent: updatedTimes[currentQuestionIndex].timeSpent + timeSpent,
              endTime: now,
            };
          }
          set({
            currentQuestionIndex: currentQuestionIndex - 1,
            questionTimes: updatedTimes,
            currentQuestionStartTime: now,
          });
        }
      },

      submitQuiz: () => {
        const { currentQuiz, selectedAnswers, startTime, attempts, currentConfig, questionTimes, currentQuestionStartTime, currentQuestionIndex } = get();
        if (!currentQuiz || !startTime) {
          throw new Error("No active quiz");
        }

        let correct = 0;
        let wrong = 0;
        const topicScores: Record<string, { correct: number; total: number }> = {};

        currentQuiz.forEach((q, i) => {
          // Initialize topic tracking
          if (!topicScores[q.category]) {
            topicScores[q.category] = { correct: 0, total: 0 };
          }
          topicScores[q.category].total++;

          if (selectedAnswers[i] === q.correctIndex) {
            correct++;
            topicScores[q.category].correct++;
          } else if (selectedAnswers[i] !== null) {
            wrong++;
          }
        });

        // Calculate net score with negative marking (standard -1/4 rule)
        const negativeMarking = currentConfig?.negativeMarking || false;
        const netScore = negativeMarking
          ? Math.max(0, correct - (wrong * 0.25))
          : correct;

        // Build topic breakdown array
        const topicBreakdown: TopicScore[] = Object.entries(topicScores).map(([topic, scores]) => ({
          topic,
          correct: scores.correct,
          total: scores.total,
          percentage: Math.round((scores.correct / scores.total) * 100),
        }));

        // Finalize per-question time tracking
        const now = Date.now();
        const finalTimes = [...questionTimes];
        if (currentQuestionStartTime) {
          const timeSpent = Math.floor((now - currentQuestionStartTime) / 1000);
          finalTimes[currentQuestionIndex] = {
            ...finalTimes[currentQuestionIndex],
            timeSpent: finalTimes[currentQuestionIndex].timeSpent + timeSpent,
            endTime: now,
          };
        }

        // Calculate time statistics
        const validTimes = finalTimes.filter(t => t.timeSpent > 0);
        const totalQuestionTime = validTimes.reduce((sum, t) => sum + t.timeSpent, 0);
        const averageTimePerQuestion = validTimes.length > 0 ? Math.round(totalQuestionTime / validTimes.length) : 0;

        let fastestQuestion: { id: string; time: number } | null = null;
        let slowestQuestion: { id: string; time: number } | null = null;

        if (validTimes.length > 0) {
          const sorted = [...validTimes].sort((a, b) => a.timeSpent - b.timeSpent);
          fastestQuestion = { id: sorted[0].questionId, time: sorted[0].timeSpent };
          slowestQuestion = { id: sorted[sorted.length - 1].questionId, time: sorted[sorted.length - 1].timeSpent };
        }

        const attempt: QuizAttempt = {
          id: `attempt-${Date.now()}`,
          date: Date.now(),
          score: correct,
          totalQuestions: currentQuiz.length,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          category: currentQuiz[0]?.category || "Mixed",
          difficulty: currentQuiz[0]?.difficulty || "mixed",
          // New SOW-compliant fields
          course: currentConfig?.course || "ALL",
          assessmentType: currentConfig?.assessmentType || "practice",
          negativeMarking,
          netScore,
          topicBreakdown,
          wrongAnswers: wrong,
          // Per-question time analysis - SOW Section 8.3
          questionTimes: finalTimes,
          averageTimePerQuestion,
          fastestQuestion,
          slowestQuestion,
        };

        set({
          isCompleted: true,
          attempts: [attempt, ...attempts].slice(0, 50), // Keep last 50 for better analytics
        });

        return attempt;
      },

      resetQuiz: () => {
        set({
          currentQuiz: null,
          currentQuestionIndex: 0,
          selectedAnswers: [],
          startTime: null,
          isCompleted: false,
          questionTimes: [],
          currentQuestionStartTime: null,
        });
      },

      getScore: () => {
        const { currentQuiz, selectedAnswers, currentConfig } = get();
        if (!currentQuiz) return { correct: 0, total: 0, percentage: 0, netScore: 0, wrongAnswers: 0 };

        let correct = 0;
        let wrongAnswers = 0;
        currentQuiz.forEach((q, i) => {
          if (selectedAnswers[i] === q.correctIndex) {
            correct++;
          } else if (selectedAnswers[i] !== null) {
            wrongAnswers++;
          }
        });

        const negativeMarking = currentConfig?.negativeMarking || false;
        const netScore = negativeMarking
          ? Math.max(0, correct - (wrongAnswers * 0.25))
          : correct;

        return {
          correct,
          total: currentQuiz.length,
          percentage: Math.round((correct / currentQuiz.length) * 100),
          netScore,
          wrongAnswers,
        };
      },

      getTopicBreakdown: () => {
        const { currentQuiz, selectedAnswers } = get();
        if (!currentQuiz) return [];

        const topicScores: Record<string, { correct: number; total: number }> = {};

        currentQuiz.forEach((q, i) => {
          if (!topicScores[q.category]) {
            topicScores[q.category] = { correct: 0, total: 0 };
          }
          topicScores[q.category].total++;

          if (selectedAnswers[i] === q.correctIndex) {
            topicScores[q.category].correct++;
          }
        });

        return Object.entries(topicScores).map(([topic, scores]) => ({
          topic,
          correct: scores.correct,
          total: scores.total,
          percentage: Math.round((scores.correct / scores.total) * 100),
        }));
      },

      getQuestionTimeAnalysis: () => {
        const { questionTimes } = get();
        const validTimes = questionTimes.filter(t => t.timeSpent > 0);

        if (validTimes.length === 0) {
          return { questionTimes: [], average: 0, fastest: null, slowest: null };
        }

        const totalTime = validTimes.reduce((sum, t) => sum + t.timeSpent, 0);
        const average = Math.round(totalTime / validTimes.length);

        const sorted = [...validTimes].sort((a, b) => a.timeSpent - b.timeSpent);
        const fastest = sorted[0];
        const slowest = sorted[sorted.length - 1];

        return { questionTimes: validTimes, average, fastest, slowest };
      },
    }),
    {
      name: "oaksip-quiz",
      partialize: (state) => ({ attempts: state.attempts }),
    }
  )
);
