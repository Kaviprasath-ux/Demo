"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface UserProgress {
  totalPoints: number;
  quizPoints: number;
  trainingPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  completedDrills: string[];
  earnedBadges: string[];
  weeklyActivity: number[];
  level: number;
  xpToNextLevel: number;
}

interface ProgressState {
  badges: Badge[];
  userProgress: UserProgress;

  // Actions
  addPoints: (type: "quiz" | "training", points: number) => void;
  completeDrill: (drillId: string) => void;
  updateStreak: () => void;
  checkBadges: () => string[];
}

const allBadges: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first training drill",
    icon: "footprints",
    requirement: "1 drill completed"
  },
  {
    id: "quick-learner",
    name: "Quick Learner",
    description: "Score 80%+ on first quiz attempt",
    icon: "zap",
    requirement: "80%+ first quiz"
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Maintain a 7-day streak",
    icon: "flame",
    requirement: "7-day streak"
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "Score 90%+ on any quiz",
    icon: "target",
    requirement: "90%+ quiz score"
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Get 100% on any quiz",
    icon: "crown",
    requirement: "100% quiz score"
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Complete 50+ training drills",
    icon: "medal",
    requirement: "50 drills"
  },
  {
    id: "expert",
    name: "Artillery Expert",
    description: "Earn 5000+ total points",
    icon: "award",
    requirement: "5000 points"
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Reach Level 5",
    icon: "star",
    requirement: "Level 5"
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Complete 10 quizzes",
    icon: "book",
    requirement: "10 quizzes"
  },
];

function calculateLevel(points: number): { level: number; xpToNext: number } {
  const levels = [0, 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700, 14000];
  let level = 1;
  for (let i = 1; i < levels.length; i++) {
    if (points >= levels[i]) {
      level = i + 1;
    } else {
      return { level, xpToNext: levels[i] - points };
    }
  }
  return { level: 10, xpToNext: 0 };
}

export const useLeaderboardStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      badges: allBadges,
      userProgress: {
        totalPoints: 0,
        quizPoints: 0,
        trainingPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: "",
        completedDrills: [],
        earnedBadges: [],
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        level: 1,
        xpToNextLevel: 500,
      },

      addPoints: (type, points) => {
        set((state) => {
          const newProgress = { ...state.userProgress };
          if (type === "quiz") {
            newProgress.quizPoints += points;
          } else {
            newProgress.trainingPoints += points;
          }
          newProgress.totalPoints = newProgress.quizPoints + newProgress.trainingPoints;

          const { level, xpToNext } = calculateLevel(newProgress.totalPoints);
          newProgress.level = level;
          newProgress.xpToNextLevel = xpToNext;

          // Update weekly activity
          const today = new Date().getDay();
          newProgress.weeklyActivity[today] += 1;

          // Update last activity date
          newProgress.lastActivityDate = new Date().toISOString().split('T')[0];

          return { userProgress: newProgress };
        });

        // Check for new badges
        get().checkBadges();
      },

      completeDrill: (drillId) => {
        set((state) => {
          if (state.userProgress.completedDrills.includes(drillId)) {
            return state;
          }
          const newProgress = {
            ...state.userProgress,
            completedDrills: [...state.userProgress.completedDrills, drillId],
          };
          return { userProgress: newProgress };
        });

        // Check for new badges
        get().checkBadges();
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastDate = state.userProgress.lastActivityDate;

          if (lastDate === today) {
            return state; // Already updated today
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = state.userProgress.currentStreak;
          if (lastDate === yesterdayStr) {
            newStreak += 1;
          } else if (lastDate !== today) {
            newStreak = 1; // Reset streak
          }

          return {
            userProgress: {
              ...state.userProgress,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.userProgress.longestStreak),
              lastActivityDate: today,
            }
          };
        });
      },

      checkBadges: () => {
        const { userProgress } = get();
        const newBadges: string[] = [];

        // Check each badge condition
        if (userProgress.completedDrills.length >= 1 && !userProgress.earnedBadges.includes("first-steps")) {
          newBadges.push("first-steps");
        }
        if (userProgress.currentStreak >= 7 && !userProgress.earnedBadges.includes("dedicated")) {
          newBadges.push("dedicated");
        }
        if (userProgress.totalPoints >= 5000 && !userProgress.earnedBadges.includes("expert")) {
          newBadges.push("expert");
        }
        if (userProgress.level >= 5 && !userProgress.earnedBadges.includes("rising-star")) {
          newBadges.push("rising-star");
        }

        if (newBadges.length > 0) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              earnedBadges: [...state.userProgress.earnedBadges, ...newBadges],
            }
          }));
        }

        return newBadges;
      },
    }),
    {
      name: "oaksip-progress",
      partialize: (state) => ({ userProgress: state.userProgress }),
    }
  )
);
