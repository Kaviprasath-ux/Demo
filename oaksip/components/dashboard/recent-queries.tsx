"use client";

import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryStore, useAuthStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export function RecentQueries() {
  const { queries } = useQueryStore();
  const { user } = useAuthStore();

  // Filter queries for current user only
  const userQueries = user
    ? queries.filter((q) => q.userId === user.id)
    : [];

  const recentQueries = userQueries.slice(0, 5);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">My Recent Queries</CardTitle>
        <Link href="/search">
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentQueries.map((query) => (
            <div
              key={query.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {query.query}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(query.timestamp)}
                </div>
              </div>
              <Badge
                variant={query.result.confidence >= 0.8 ? "success" : "warning"}
                className="flex-shrink-0"
              >
                {Math.round(query.result.confidence * 100)}%
              </Badge>
            </div>
          ))}

          {recentQueries.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No queries yet. Start searching to see your history.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
