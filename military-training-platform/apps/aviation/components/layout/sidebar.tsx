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
  Users,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Calendar,
  BookOpen,
  Sparkles,
  Activity,
  Plane,
  Navigation,
  MessageSquare,
  Award,
  Settings,
  Ban,
  Upload,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ScrollArea } from "@military/ui";
import { useUIStore, useAuthStore, type AviationRole } from "@/lib/store";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Role-specific navigation configurations
const getNavigationForRole = (role: AviationRole | undefined): NavItem[] => {
  switch (role) {
    case "admin":
      // System Administrator: Technical platform management
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Helicopter Systems", href: "/admin/helicopter-systems", icon: Plane },
        { name: "ROE Management", href: "/admin/roe-management", icon: Shield },
        { name: "No-Fly Zones", href: "/admin/nfz-management", icon: Ban },
        { name: "Document Ingestion", href: "/admin/document-ingestion", icon: Upload },
        { name: "Dataset Factory", href: "/admin/dataset-factory", icon: Database },
        { name: "Content Management", href: "/admin/content", icon: FileText },
        { name: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
        { name: "Configuration", href: "/admin/configuration", icon: Settings },
      ];

    case "aviation-instructor":
      // Aviation Instructor: Pilot training & CAS procedures
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "AI Mission Generator", href: "/aviation-instructor/ai-generator", icon: Sparkles },
        { name: "Training Analytics", href: "/aviation-instructor/analytics", icon: BarChart3 },
        { name: "Pilot Trainees", href: "/aviation-instructor/pilots", icon: Users },
        { name: "Flight Scenarios", href: "/aviation-instructor/scenarios", icon: Crosshair },
        { name: "Flight Sessions", href: "/aviation-instructor/sessions", icon: Calendar },
        { name: "Assessments", href: "/aviation-instructor/assessments", icon: ClipboardList },
        { name: "Curriculum", href: "/aviation-instructor/curriculum", icon: BookOpen },
        { name: "Joint Operations", href: "/aviation-instructor/joint-operations", icon: Target },
        { name: "3D Simulator", href: "/training", icon: Navigation },
        { name: "Knowledge Search", href: "/search", icon: Search },
      ];

    case "artillery-instructor":
      // Artillery Instructor: FOO training & fire support
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Trainee List", href: "/artillery-instructor/trainees", icon: GraduationCap },
        { name: "Training Scenarios", href: "/artillery-instructor/scenarios", icon: Crosshair },
        { name: "Sessions", href: "/artillery-instructor/sessions", icon: Calendar },
        { name: "Assessments", href: "/artillery-instructor/assessments", icon: ClipboardList },
        { name: "Joint Exercises", href: "/artillery-instructor/joint-exercises", icon: Target },
        { name: "3D Simulator", href: "/training", icon: Navigation },
        { name: "Knowledge Search", href: "/search", icon: Search },
      ];

    case "cadet":
      // Cadet/Trainee: Learning & practice
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "3D Flight Training", href: "/training", icon: Navigation },
        { name: "AI Assistant", href: "/cadet/ai-assistant", icon: MessageSquare },
        { name: "Training Modules", href: "/cadet/training", icon: BookOpen },
        { name: "My Sessions", href: "/cadet/sessions", icon: Calendar },
        { name: "Assessments", href: "/cadet/assessments", icon: ClipboardList },
        { name: "Documents", href: "/cadet/documents", icon: FileText },
        { name: "My Progress", href: "/cadet/progress", icon: Award },
      ];

    case "auditor":
      // Auditor: Training audit & compliance
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Audit Reports", href: "/auditor/reports", icon: BarChart3 },
        { name: "Compliance", href: "/auditor/compliance", icon: Shield },
        { name: "Metrics", href: "/auditor/metrics", icon: Activity },
        { name: "Findings", href: "/auditor/findings", icon: ClipboardList },
        { name: "Documents", href: "/documents", icon: FileText },
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
  const filteredNav = getNavigationForRole(user?.role as AviationRole | undefined);

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
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">AVATS</span>
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
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
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
              Army Aviation Training
              <br />
              <span className="text-primary">Joint Fire Support Platform</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
