"use client";

import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QueryInput } from "@/components/search/query-input";
import { QueryResult } from "@/components/search/query-result";
import { useQueryStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function SearchPage() {
  const { queries, search, isLoading, currentResult, clearCurrentResult } =
    useQueryStore();
  const [currentQuery, setCurrentQuery] = useState("");

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    await search(query);
  };

  const handleHistoryClick = async (query: string) => {
    setCurrentQuery(query);
    await search(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Knowledge Search
        </h1>
        <p className="text-muted-foreground">
          Search artillery manuals, SOPs, technical specifications, and training
          documents.
        </p>
      </div>

      {/* Search Input */}
      <QueryInput onSearch={handleSearch} isLoading={isLoading} size="large" />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Results Section */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Searching knowledge base...
                </p>
              </CardContent>
            </Card>
          ) : currentResult ? (
            <QueryResult result={currentResult} query={currentQuery} />
          ) : (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  Ready to Search
                </h3>
                <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                  Enter a query above to search through artillery documentation,
                  technical manuals, and training materials.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Sidebar */}
        <div>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Search History
              </CardTitle>
              {queries.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={clearCurrentResult}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-4 pt-0">
                  {queries.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No search history yet
                    </p>
                  ) : (
                    queries.slice(0, 20).map((query) => (
                      <button
                        key={query.id}
                        onClick={() => handleHistoryClick(query.query)}
                        className="flex w-full flex-col items-start gap-1 rounded-lg border border-transparent p-3 text-left transition-colors hover:border-border hover:bg-muted/50"
                      >
                        <p className="line-clamp-2 text-sm font-medium text-foreground">
                          {query.query}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              query.result.confidence >= 0.8
                                ? "success"
                                : "warning"
                            }
                            className="text-[10px]"
                          >
                            {Math.round(query.result.confidence * 100)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(query.timestamp)}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
