"use client";

import { KnowledgeGraph } from "@/components/instructor/knowledge-graph";

export default function KnowledgeGraphPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Knowledge Graph
        </h1>
        <p className="text-muted-foreground">
          Visualize relationships between topics, weapon systems, documents, and courses.
          Interactive graph built from ingested content.
        </p>
      </div>

      {/* Graph Component */}
      <KnowledgeGraph />
    </div>
  );
}
