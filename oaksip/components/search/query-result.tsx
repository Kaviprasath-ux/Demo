"use client";

import { CheckCircle, AlertCircle, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceCard } from "./source-card";
import { QueryResult as QueryResultType } from "@/types";

interface QueryResultProps {
  result: QueryResultType;
  query: string;
}

export function QueryResult({ result }: QueryResultProps) {
  const confidenceLevel =
    result.confidence >= 0.9
      ? "high"
      : result.confidence >= 0.7
      ? "medium"
      : "low";

  const confidenceLabels = {
    high: { label: "High Confidence", variant: "success" as const },
    medium: { label: "Medium Confidence", variant: "warning" as const },
    low: { label: "Low Confidence", variant: "destructive" as const },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.answer);
  };

  return (
    <div className="space-y-6">
      {/* Answer Card */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {confidenceLevel === "high" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm font-medium text-muted-foreground">
                AI Response
              </span>
            </div>
            <Badge variant={confidenceLabels[confidenceLevel].variant}>
              {confidenceLabels[confidenceLevel].label} (
              {Math.round(result.confidence * 100)}%)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {result.answer}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Was this helpful?
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      {result.sources.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span>Sources</span>
            <Badge variant="outline" className="text-xs">
              {result.sources.length}
            </Badge>
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {result.sources.map((source, index) => (
              <SourceCard key={index} source={source} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
