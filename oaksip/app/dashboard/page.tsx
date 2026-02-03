"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentQueries } from "@/components/dashboard/recent-queries";
import { QueryInput } from "@/components/search/query-input";
import { useQueryStore, useAuthStore } from "@/lib/store";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { search, isLoading } = useQueryStore();

  const handleQuickSearch = async (query: string) => {
    await search(query);
    router.push("/search");
  };

  // Role-specific quick links
  const getQuickLinks = () => {
    const baseLinks = [
      {
        title: "Knowledge Search",
        description: "Search technical manuals and SOPs",
        href: "/search",
      },
      {
        title: "Quiz Mode",
        description: "Test your artillery knowledge",
        href: "/quiz",
      },
      {
        title: "3D Training",
        description: "Interactive gun training model",
        href: "/training",
      },
      {
        title: "Simulator Intelligence",
        description: "View training analytics and performance",
        href: "/simulator",
      },
    ];

    // Add role-specific links
    if (user?.role === "admin" || user?.role === "instructor") {
      baseLinks.push({
        title: "Document Library",
        description: "Browse and manage indexed documents",
        href: "/documents",
      });
    }

    if (user?.role === "admin") {
      baseLinks.push({
        title: "Audit Logs",
        description: "View system activity logs",
        href: "/audit",
      });
    }

    return baseLinks;
  };

  const quickLinks = getQuickLinks();

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    switch (user?.role) {
      case "admin":
        return "System administration dashboard - full access to all features.";
      case "instructor":
        return "Instructor dashboard - train cadets and manage content.";
      case "trainee":
        return "Access artillery knowledge, training modules, and quizzes.";
      default:
        return "Access artillery knowledge, simulator intelligence, and training resources.";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name.split(" ").slice(-1)[0]}
          </h1>
          {user?.role === "admin" && (
            <Badge variant="destructive" className="gap-1">
              <Shield className="h-3 w-3" />
              Admin
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {getWelcomeMessage()}
        </p>
      </div>

      {/* Quick Search */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Knowledge Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QueryInput
            onSearch={handleQuickSearch}
            isLoading={isLoading}
            size="large"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {[
              "Range of 155mm gun",
              "Fire control procedures",
              "Battery deployment",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleQuickSearch(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <StatsCards />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Queries */}
        <RecentQueries />

        {/* Quick Links */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickLinks.slice(0, 4).map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{link.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-only Section */}
      {user?.role === "admin" && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-destructive" />
              Admin Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => router.push("/documents")}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-foreground">Document Library</p>
                  <p className="text-sm text-muted-foreground">
                    Manage indexed documents
                  </p>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => router.push("/audit")}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 text-left transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-foreground">Audit Logs</p>
                  <p className="text-sm text-muted-foreground">
                    View all system activity
                  </p>
                </div>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
