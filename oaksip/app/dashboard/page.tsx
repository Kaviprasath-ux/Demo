"use client";

import { useAuthStore } from "@/lib/store";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard";
import { LeadershipDashboard } from "@/components/dashboard/leadership-dashboard";
import { TraineeDashboard } from "@/components/dashboard/trainee-dashboard";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Route to role-specific dashboard
  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "leadership":
      return <LeadershipDashboard />;
    case "trainee":
      return <TraineeDashboard />;
    default:
      return <TraineeDashboard />;
  }
}
