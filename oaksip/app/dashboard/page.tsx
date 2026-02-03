"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name.split(" ").slice(-1)[0]}
        </h1>
        <p className="text-muted-foreground">
          Access artillery knowledge, simulator intelligence, and training resources.
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
              {[
                {
                  title: "Knowledge Search",
                  description: "Search technical manuals and SOPs",
                  href: "/search",
                },
                {
                  title: "Simulator Intelligence",
                  description: "View training analytics and performance",
                  href: "/simulator",
                },
                {
                  title: "Document Library",
                  description: "Browse indexed documents",
                  href: "/documents",
                },
              ].map((link) => (
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
    </div>
  );
}
