"use client";

import { ContentTagger } from "@/components/instructor/content-tagger";

export default function ContentTaggingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Content Tagging & Ingestion
        </h1>
        <p className="text-muted-foreground">
          Upload and tag doctrinal content for AI-powered search and question generation.
          Per SOW Section 8.5 - Content & Curriculum Alignment.
        </p>
      </div>

      {/* Tagger Component */}
      <ContentTagger />
    </div>
  );
}
