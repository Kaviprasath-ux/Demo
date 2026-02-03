"use client";

import { FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Source } from "@/types";

interface SourceCardProps {
  source: Source;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  return (
    <Card className="group cursor-pointer border-border/50 p-3 transition-all hover:border-primary/50 hover:bg-muted/50">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              [{index + 1}]
            </span>
            <p className="truncate text-sm font-medium text-foreground">
              {source.document}
            </p>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Page {source.page}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Card>
  );
}
