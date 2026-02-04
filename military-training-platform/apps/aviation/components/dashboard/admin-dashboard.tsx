"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Shield,
  Plane,
  Clock,
  Activity,
  Database,
  Settings,
  Ban,
  Upload,
  Server,
  Cpu,
  HardDrive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from "@military/ui";
import { useAuthStore } from "@/lib/store";
import { helicopterSystems } from "@/lib/helicopter-systems";

export function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const quickLinks = [
    {
      title: "User Management",
      description: "Manage system users and roles",
      href: "/admin/users",
      icon: Users,
      count: 42,
    },
    {
      title: "Helicopter Systems",
      description: "Configure aircraft platforms",
      href: "/admin/helicopter-systems",
      icon: Plane,
      count: helicopterSystems.length,
    },
    {
      title: "ROE Management",
      description: "Rules of Engagement config",
      href: "/admin/roe-management",
      icon: Shield,
      count: 8,
    },
    {
      title: "No-Fly Zones",
      description: "Manage airspace restrictions",
      href: "/admin/nfz-management",
      icon: Ban,
      count: 12,
    },
    {
      title: "Document Ingestion",
      description: "Knowledge base management",
      href: "/admin/document-ingestion",
      icon: Upload,
      count: 156,
    },
    {
      title: "Dataset Factory",
      description: "Training data management",
      href: "/admin/dataset-factory",
      icon: Database,
      count: 24,
    },
    {
      title: "Content Management",
      description: "Manage training content",
      href: "/admin/content",
      icon: FileText,
      count: 89,
    },
    {
      title: "Audit Logs",
      description: "View system activity",
      href: "/admin/audit-logs",
      icon: Activity,
      count: 1247,
    },
  ];

  const systemHealth = {
    cpu: 45,
    memory: 62,
    storage: 38,
    uptime: "14d 6h 32m",
  };

  const recentActivity = [
    { action: "User 'Wg Cdr Mehta' logged in", time: "2 minutes ago", type: "info" },
    { action: "New document ingested: 'CAS_SOP_v2.pdf'", time: "15 minutes ago", type: "success" },
    { action: "NFZ 'Ex-127' activated", time: "1 hour ago", type: "warning" },
    { action: "System backup completed", time: "3 hours ago", type: "success" },
    { action: "ROE policy updated", time: "5 hours ago", type: "info" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Administration</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Badge variant="destructive" className="gap-1.5">
          <Shield className="h-3 w-3" />
          Administrator
        </Badge>
      </div>

      {/* System Health */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{systemHealth.cpu}%</p>
              </div>
              <Cpu className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
            <Progress value={systemHealth.cpu} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Memory</p>
                <p className="text-2xl font-bold">{systemHealth.memory}%</p>
              </div>
              <Server className="h-8 w-8 text-green-500 opacity-50" />
            </div>
            <Progress value={systemHealth.memory} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-2xl font-bold">{systemHealth.storage}%</p>
              </div>
              <HardDrive className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
            <Progress value={systemHealth.storage} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{systemHealth.uptime}</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Card
              key={link.href}
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => router.push(link.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{link.title}</h3>
                      {link.count !== undefined && (
                        <Badge variant="secondary">{link.count}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="text-sm">{item.action}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
