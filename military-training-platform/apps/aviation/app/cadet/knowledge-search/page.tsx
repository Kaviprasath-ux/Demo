"use client";

import { useState } from "react";
import {
  Search,
  Send,
  BookOpen,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plane,
  Target,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@military/ui";
import { useAI } from "@/lib/ai/use-ai";
import type { KnowledgeSearchResponse } from "@/lib/ai/types";

const sampleQueries = [
  "What are CAS procedures for Rudra helicopter?",
  "How does fire adjustment work from helicopter observation?",
  "What is airspace coordination with artillery?",
  "Explain Type 1, 2, 3 terminal control",
  "What are Helina missile capabilities?",
];

const categoryFilters = [
  { id: "all", label: "All Topics", icon: BookOpen },
  { id: "cas", label: "CAS Procedures", icon: Target },
  { id: "helicopters", label: "Helicopter Systems", icon: Plane },
  { id: "coordination", label: "Air-Ground Coordination", icon: Shield },
];

export default function CadetKnowledgeSearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [searchHistory, setSearchHistory] = useState<
    { query: string; response: KnowledgeSearchResponse; timestamp: Date }[]
  >([]);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const { searchKnowledge, isLoading, error } = useAI();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await searchKnowledge({
        query: query.trim(),
        category: category !== "all" ? category : undefined,
        maxResults: 5,
      });

      setSearchHistory((prev) => [
        { query: query.trim(), response, timestamp: new Date() },
        ...prev,
      ]);
      setQuery("");
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const toggleResultExpand = (id: string) => {
    setExpandedResults((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Knowledge Search</h1>
        <p className="text-muted-foreground">
          Search doctrine, SOPs, and training materials
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted-foreground/10"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask about CAS procedures, helicopter systems, fire adjustment..."
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Sample Queries */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {sampleQueries.slice(0, 3).map((q, i) => (
            <button
              key={i}
              onClick={() => setQuery(q)}
              className="text-xs text-primary hover:underline"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="text-destructive">{error.message}</span>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {searchHistory.map((item, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Query */}
            <div className="p-4 border-b border-border bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Search className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{item.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.response.confidence === "high"
                        ? "bg-green-500/20 text-green-500"
                        : item.response.confidence === "medium"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {item.response.confidence} confidence
                  </span>
                </div>
              </div>
            </div>

            {/* Answer */}
            <div className="p-4 space-y-4">
              <div className="prose prose-sm prose-invert max-w-none">
                <p>{item.response.answer}</p>
              </div>

              {/* Citations */}
              {item.response.citations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Sources:</span>
                  {item.response.citations.map((citation, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                    >
                      {citation}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Documents */}
              {item.response.results.length > 0 && (
                <div className="border-t border-border pt-4">
                  <button
                    onClick={() => toggleResultExpand(`result-${idx}`)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="w-4 h-4" />
                    {item.response.results.length} Related Documents
                    {expandedResults.has(`result-${idx}`) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {expandedResults.has(`result-${idx}`) && (
                    <div className="mt-3 space-y-2">
                      {item.response.results.map((result) => (
                        <div
                          key={result.id}
                          className="p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{result.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(result.relevanceScore * 100)}% match
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-primary">
                              {result.citation}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {searchHistory.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Start Your Search</h3>
          <p className="text-muted-foreground">
            Search for doctrine, SOPs, and training materials related to
            aviation-artillery joint operations.
          </p>
        </div>
      )}
    </div>
  );
}
