"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface QuizAttempt {
  id: string;
  date: number;
  score: number;
  totalQuestions: number;
  timeSpent: number; // seconds
  category: string;
  difficulty: string;
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

  // History
  attempts: QuizAttempt[];

  // Actions
  startQuiz: (category: string, difficulty: string, count: number) => void;
  selectAnswer: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => QuizAttempt;
  resetQuiz: () => void;
  getScore: () => { correct: number; total: number; percentage: number };
}

// Question bank
const allQuestions: QuizQuestion[] = [
  // Easy questions
  {
    id: "e1",
    question: "What is the caliber of the standard Indian Army field gun covered in this training?",
    options: ["105mm", "130mm", "155mm", "175mm"],
    correctIndex: 2,
    explanation: "The 155mm is the standard caliber for modern field artillery, offering an optimal balance of range, firepower, and mobility.",
    difficulty: "easy",
    category: "General"
  },
  {
    id: "e2",
    question: "What type of breech mechanism does the 155mm gun use?",
    options: ["Horizontal sliding", "Vertical sliding", "Screw type", "Falling block"],
    correctIndex: 1,
    explanation: "The vertical sliding breech block moves vertically to open and close, allowing for rapid loading and firing.",
    difficulty: "easy",
    category: "Components"
  },
  {
    id: "e3",
    question: "What is the primary purpose of the recoil system?",
    options: ["Increase range", "Absorb firing force", "Aim the gun", "Load ammunition"],
    correctIndex: 1,
    explanation: "The hydro-pneumatic recoil system absorbs the enormous force generated during firing, protecting the gun and crew.",
    difficulty: "easy",
    category: "Components"
  },
  {
    id: "e4",
    question: "How many trail legs does the 155mm gun carriage have?",
    options: ["One", "Two (split trails)", "Three", "Four"],
    correctIndex: 1,
    explanation: "The split-trail design provides stability during firing and allows for a wider traverse angle.",
    difficulty: "easy",
    category: "Components"
  },
  {
    id: "e5",
    question: "What should you do FIRST if a misfire occurs?",
    options: ["Open the breech immediately", "Announce 'MISFIRE' and wait", "Look into the muzzle", "Remove the round"],
    correctIndex: 1,
    explanation: "Always announce 'MISFIRE' and wait at least 30 seconds before taking any action. This prevents injury from delayed ignition.",
    difficulty: "easy",
    category: "Safety"
  },
  {
    id: "e6",
    question: "What does the sighting system help determine?",
    options: ["Ammunition type", "Barrel temperature", "Target direction and elevation", "Crew positions"],
    correctIndex: 2,
    explanation: "The panoramic telescope and other sighting components help gunners determine the correct direction (deflection) and elevation for accurate fire.",
    difficulty: "easy",
    category: "Components"
  },

  // Medium questions
  {
    id: "m1",
    question: "What is the approximate maximum range of a 155mm gun with standard HE ammunition?",
    options: ["10-15 km", "18-24 km", "30-35 km", "40-50 km"],
    correctIndex: 1,
    explanation: "Standard HE rounds typically achieve 18-24km range. Extended range ammunition like ERFB or RAP can reach 30-40km+.",
    difficulty: "medium",
    category: "Technical"
  },
  {
    id: "m2",
    question: "In the recoil system, what returns the barrel to battery position after firing?",
    options: ["Manual crank", "Spring mechanism", "Recuperator", "Electric motor"],
    correctIndex: 2,
    explanation: "The recuperator uses compressed nitrogen gas to push the barrel back to its firing (battery) position after recoil.",
    difficulty: "medium",
    category: "Components"
  },
  {
    id: "m3",
    question: "What is the minimum waiting time after a misfire before attempting to re-fire?",
    options: ["10 seconds", "30 seconds", "1 minute", "5 minutes"],
    correctIndex: 1,
    explanation: "Wait at least 30 seconds after a misfire. If re-firing fails twice, wait 5 minutes before opening the breech.",
    difficulty: "medium",
    category: "Safety"
  },
  {
    id: "m4",
    question: "How many mils equal a complete circle (360 degrees)?",
    options: ["3200 mils", "4800 mils", "6400 mils", "8000 mils"],
    correctIndex: 2,
    explanation: "The military uses 6400 mils per circle. This allows for more precise angular measurements than degrees.",
    difficulty: "medium",
    category: "Technical"
  },
  {
    id: "m5",
    question: "What is the purpose of the obturator in the breech block?",
    options: ["Ignite the propellant", "Seal propellant gases", "Extract spent cases", "Lock the breech"],
    correctIndex: 1,
    explanation: "The obturator creates a gas-tight seal, preventing propellant gases from escaping rearward during firing.",
    difficulty: "medium",
    category: "Components"
  },
  {
    id: "m6",
    question: "During sustained fire, what is critical to monitor?",
    options: ["Wheel alignment", "Barrel temperature", "Paint condition", "Trail angle"],
    correctIndex: 1,
    explanation: "Barrel temperature must be monitored during sustained fire. Overheating can cause barrel wear, reduced accuracy, or catastrophic failure.",
    difficulty: "medium",
    category: "Safety"
  },
  {
    id: "m7",
    question: "What increases the range of base bleed ammunition?",
    options: ["Heavier projectile", "Reduced drag from gas emission", "Larger propellant charge", "Higher barrel pressure"],
    correctIndex: 1,
    explanation: "Base bleed rounds emit gas from the base, filling the low-pressure wake and reducing aerodynamic drag by 20-30%.",
    difficulty: "medium",
    category: "Technical"
  },

  // Hard questions
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
    category: "Procedures"
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
    category: "Components"
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
    category: "Maintenance"
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
    category: "Technical"
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
    category: "Procedures"
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
    category: "Technical"
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
      attempts: [],

      startQuiz: (category, difficulty, count) => {
        let filtered = allQuestions;

        if (category !== "all") {
          filtered = filtered.filter(q => q.category.toLowerCase() === category.toLowerCase());
        }
        if (difficulty !== "all") {
          filtered = filtered.filter(q => q.difficulty === difficulty);
        }

        // Shuffle and take requested count
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));

        set({
          currentQuiz: selected,
          currentQuestionIndex: 0,
          selectedAnswers: new Array(selected.length).fill(null),
          startTime: Date.now(),
          isCompleted: false,
        });
      },

      selectAnswer: (index) => {
        const { selectedAnswers, currentQuestionIndex } = get();
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = index;
        set({ selectedAnswers: newAnswers });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, currentQuiz } = get();
        if (currentQuiz && currentQuestionIndex < currentQuiz.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      submitQuiz: () => {
        const { currentQuiz, selectedAnswers, startTime, attempts } = get();
        if (!currentQuiz || !startTime) {
          throw new Error("No active quiz");
        }

        let correct = 0;
        currentQuiz.forEach((q, i) => {
          if (selectedAnswers[i] === q.correctIndex) {
            correct++;
          }
        });

        const attempt: QuizAttempt = {
          id: `attempt-${Date.now()}`,
          date: Date.now(),
          score: correct,
          totalQuestions: currentQuiz.length,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          category: currentQuiz[0]?.category || "Mixed",
          difficulty: currentQuiz[0]?.difficulty || "mixed",
        };

        set({
          isCompleted: true,
          attempts: [attempt, ...attempts].slice(0, 20), // Keep last 20
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
        });
      },

      getScore: () => {
        const { currentQuiz, selectedAnswers } = get();
        if (!currentQuiz) return { correct: 0, total: 0, percentage: 0 };

        let correct = 0;
        currentQuiz.forEach((q, i) => {
          if (selectedAnswers[i] === q.correctIndex) {
            correct++;
          }
        });

        return {
          correct,
          total: currentQuiz.length,
          percentage: Math.round((correct / currentQuiz.length) * 100),
        };
      },
    }),
    {
      name: "oaksip-quiz",
      partialize: (state) => ({ attempts: state.attempts }),
    }
  )
);
