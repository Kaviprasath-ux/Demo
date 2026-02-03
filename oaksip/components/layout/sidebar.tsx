"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Target,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Brain,
  Users,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Calendar,
  BookOpen,
  ScrollText,
  Sparkles,
  Tags,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUIStore, useAuthStore, type UserRole } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

// Role-specific navigation configurations per SOW document (Section 7.1)
// Admin = System Administrator (technical management only)
// Instructor = DS/Gunnery Instructors (course delivery & evaluation)
// Leadership = Course Officers/Commandant (oversight & analytics)
// Trainee = Officers/JCOs undergoing training (learning & practice)

const getNavigationForRole = (role: UserRole | undefined): NavItem[] => {
  switch (role) {
    case "admin":
      // System Administrator: Technical platform management
      // NO training features - only system management
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Documents", href: "/documents", icon: FileText },
        { name: "Audit Logs", href: "/audit", icon: Shield },
        { name: "Simulator Intel", href: "/simulator", icon: Target },
      ];

    case "instructor":
      // DS/Gunnery Instructor: Course delivery & evaluation
      // Full access to training tools + course management
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "AI Generator", href: "/instructor/ai-generator", icon: Sparkles },
        { name: "Content Tagging", href: "/instructor/content-tagging", icon: Tags },
        { name: "Knowledge Graph", href: "/instructor/knowledge-graph", icon: GitBranch },
        { name: "Question Bank", href: "/instructor/questions", icon: ClipboardList },
        { name: "Rubrics", href: "/instructor/rubrics", icon: ScrollText },
        { name: "Scheduling", href: "/instructor/scheduling", icon: Calendar },
        { name: "Answer Scripts", href: "/instructor/scripts", icon: BookOpen },
        { name: "Trainee List", href: "/instructor/trainees", icon: GraduationCap },
        { name: "Knowledge Search", href: "/search", icon: Search },
        { name: "Quiz", href: "/quiz", icon: Brain },
        { name: "3D Training", href: "/training", icon: Crosshair },
        { name: "Simulator Intel", href: "/simulator", icon: Target },
        { name: "Documents", href: "/documents", icon: FileText },
      ];

    case "leadership":
      // Course Officers/Commandant: Oversight & analytics
      // NO direct training access - only dashboards and reports
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Reports", href: "/leadership/reports", icon: BarChart3 },
        { name: "Simulator Intel", href: "/simulator", icon: Target },
        { name: "Documents", href: "/documents", icon: FileText },
        { name: "Audit Logs", href: "/audit", icon: Shield },
      ];

    case "trainee":
      // Officers/JCOs undergoing training: Learning & practice
      // Access to learning tools and personal progress
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Knowledge Search", href: "/search", icon: Search },
        { name: "Quiz", href: "/quiz", icon: Brain },
        { name: "3D Training", href: "/training", icon: Crosshair },
        { name: "Simulator Intel", href: "/simulator", icon: Target },
      ];

    default:
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ];
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  // Get role-specific navigation
  const filteredNav = getNavigationForRole(user?.role as UserRole | undefined);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {sidebarOpen && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">OAKSIP</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("h-8 w-8", !sidebarOpen && "mx-auto")}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !sidebarOpen && "justify-center px-2"
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">
              School of Artillery
              <br />
              Deolali
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
