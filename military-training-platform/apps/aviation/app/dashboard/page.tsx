"use client";

import Link from "next/link";
import {
  Plane,
  Target,
  Search,
  Navigation,
  MessageSquare,
  BarChart3,
  Shield,
  Users,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@military/ui";
import { useAuthStore, roleConfig, type AviationRole } from "@/lib/store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const currentRole = user?.role as AviationRole;
  const roleInfo = currentRole ? roleConfig[currentRole] : null;

  // Role-specific quick actions
  const getQuickActions = () => {
    switch (currentRole) {
      case "cadet":
        return [
          { href: "/training", icon: Navigation, label: "3D Flight Training", desc: "Digital twin simulation", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/cadet/ai-assistant", icon: MessageSquare, label: "AI Assistant", desc: "Ask training questions", color: "bg-green-500/10 text-green-500" },
          { href: "/search", icon: Search, label: "Knowledge Search", desc: "Search doctrine & SOPs", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/cadet/progress", icon: Award, label: "My Progress", desc: "Track your training", color: "bg-emerald-500/10 text-emerald-500" },
        ];
      case "aviation-instructor":
        return [
          { href: "/aviation-instructor/ai-generator", icon: Target, label: "AI Mission Generator", desc: "Generate fire plans", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/aviation-instructor/analytics", icon: BarChart3, label: "Training Analytics", desc: "Performance metrics", color: "bg-green-500/10 text-green-500" },
          { href: "/training", icon: Navigation, label: "3D Simulator", desc: "Flight training", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/aviation-instructor/pilots", icon: Users, label: "Pilot Trainees", desc: "Manage trainees", color: "bg-emerald-500/10 text-emerald-500" },
        ];
      case "artillery-instructor":
        return [
          { href: "/training", icon: Navigation, label: "3D Simulator", desc: "Fire support training", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/artillery-instructor/trainees", icon: Users, label: "Trainee List", desc: "Manage FOO trainees", color: "bg-green-500/10 text-green-500" },
          { href: "/search", icon: Search, label: "Knowledge Search", desc: "Search doctrine", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/artillery-instructor/scenarios", icon: Target, label: "Scenarios", desc: "Training scenarios", color: "bg-emerald-500/10 text-emerald-500" },
        ];
      case "admin":
        return [
          { href: "/admin/helicopter-systems", icon: Plane, label: "Helicopter Systems", desc: "Platform database", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/admin/roe-management", icon: Shield, label: "ROE Management", desc: "Rules of engagement", color: "bg-green-500/10 text-green-500" },
          { href: "/admin/document-ingestion", icon: Search, label: "Document Ingestion", desc: "Knowledge base", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/admin/users", icon: Users, label: "User Management", desc: "Manage users", color: "bg-emerald-500/10 text-emerald-500" },
        ];
      case "auditor":
        return [
          { href: "/auditor/reports", icon: BarChart3, label: "Audit Reports", desc: "View reports", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/auditor/compliance", icon: Shield, label: "Compliance", desc: "Check compliance", color: "bg-green-500/10 text-green-500" },
          { href: "/auditor/metrics", icon: TrendingUp, label: "Metrics", desc: "Training metrics", color: "bg-emerald-500/10 text-emerald-500" },
          { href: "/auditor/findings", icon: CheckCircle, label: "Findings", desc: "Audit findings", color: "bg-emerald-500/10 text-emerald-500" },
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">{user?.rank} • {user?.unit}</p>
        </div>
        {roleInfo && (
          <Badge className={`${roleInfo.color} text-white`}>
            {roleInfo.label}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Training Hours</p>
                <p className="text-2xl font-bold">42.5</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certifications</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="cursor-pointer hover:border-primary/50 transition-all h-full">
                <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground">{action.desc}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Completed CAS Procedures Module", time: "2 hours ago", icon: CheckCircle, color: "text-green-500" },
              { action: "Started 3D Flight Training Session", time: "Yesterday", icon: Navigation, color: "text-emerald-500" },
              { action: "Passed Fire Adjustment Assessment", time: "2 days ago", icon: Award, color: "text-yellow-500" },
              { action: "Searched: 'Helina missile specs'", time: "3 days ago", icon: Search, color: "text-emerald-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
