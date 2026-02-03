"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLeaderboardStore } from "@/lib/leaderboard-store";
import {
  Star,
  Flame,
  Target,
  Zap,
  Award,
  TrendingUp,
  Calendar,
  Footprints,
  Users,
  Medal,
  Crown,
} from "lucide-react";

const badgeIcons: Record<string, React.ReactNode> = {
  "first-steps": <Footprints className="h-4 w-4" />,
  "quick-learner": <Zap className="h-4 w-4" />,
  "dedicated": <Flame className="h-4 w-4" />,
  "sharpshooter": <Target className="h-4 w-4" />,
  "perfectionist": <Crown className="h-4 w-4" />,
  "veteran": <Medal className="h-4 w-4" />,
  "expert": <Award className="h-4 w-4" />,
  "rising-star": <Star className="h-4 w-4" />,
  "mentor": <Users className="h-4 w-4" />,
};

export default function ProgressPage() {
  const { userProgress, badges } = useLeaderboardStore();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          My Progress
        </h1>
        <p className="text-muted-foreground">
          Track your training progress, achievements, and badges
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-5 w-5" />
                Current Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Level */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 mb-2">
                  <span className="text-4xl font-bold text-primary-foreground">
                    {userProgress.level}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Level {userProgress.level}</p>
              </div>

              {/* XP Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">XP to next level</span>
                  <span className="font-medium">{userProgress.xpToNextLevel} XP</span>
                </div>
                <Progress value={100 - (userProgress.xpToNextLevel / 500) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">{userProgress.totalPoints}</div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-500 flex items-center justify-center gap-1">
                    <Flame className="h-6 w-6" />
                    {userProgress.currentStreak}
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-500">{userProgress.quizPoints}</div>
                  <p className="text-xs text-muted-foreground">Quiz Points</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-500">{userProgress.trainingPoints}</div>
                  <p className="text-xs text-muted-foreground">Training Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2">
                {userProgress.weeklyActivity.map((count, index) => (
                  <div key={index} className="flex-1 text-center">
                    <div
                      className={`h-20 rounded-t flex items-end justify-center ${
                        count === 0 ? "bg-muted" : "bg-primary/20"
                      }`}
                    >
                      <div
                        className="w-full bg-primary rounded-t transition-all"
                        style={{ height: `${Math.min(100, count * 25)}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">{daysOfWeek[index]}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Activities completed per day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Medal className="h-5 w-5" />
              Badges ({userProgress.earnedBadges.length}/{badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => {
                const isEarned = userProgress.earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg text-center transition-all ${
                      isEarned
                        ? "bg-primary/10 border-2 border-primary/30"
                        : "bg-muted/50 opacity-50 grayscale"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        isEarned ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {badgeIcons[badge.id] || <Star className="h-6 w-6" />}
                    </div>
                    <p className="text-sm font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    <p className="text-xs text-primary mt-2">{badge.requirement}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
