"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Network,
  Crosshair,
  BookOpen,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
} from "lucide-react";

// Node types for the knowledge graph
type NodeType = "topic" | "weapon-system" | "document" | "course";

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  connections: string[];
  size: number;
}

interface GraphEdge {
  source: string;
  target: string;
  strength: number;
}

// Sample knowledge graph data
const sampleNodes: GraphNode[] = [
  // Topics (central)
  { id: "t1", label: "Gunnery Theory", type: "topic", x: 400, y: 300, connections: ["w1", "w2", "w3", "d1", "d2"], size: 40 },
  { id: "t2", label: "Safety Procedures", type: "topic", x: 250, y: 200, connections: ["w1", "w2", "w3", "w4", "d3"], size: 35 },
  { id: "t3", label: "Gun Drill", type: "topic", x: 550, y: 200, connections: ["w1", "w2", "d1", "d4"], size: 35 },
  { id: "t4", label: "Fire Control", type: "topic", x: 300, y: 400, connections: ["w3", "d2", "c1", "c2"], size: 30 },
  { id: "t5", label: "Tactical Employment", type: "topic", x: 500, y: 400, connections: ["w1", "w3", "d5", "c2"], size: 30 },

  // Weapon Systems
  { id: "w1", label: "155mm Dhanush", type: "weapon-system", x: 150, y: 300, connections: ["t1", "t2", "t3", "t5", "d1"], size: 35 },
  { id: "w2", label: "155mm Bofors", type: "weapon-system", x: 100, y: 150, connections: ["t1", "t2", "t3", "d2"], size: 30 },
  { id: "w3", label: "K9 Vajra", type: "weapon-system", x: 650, y: 300, connections: ["t1", "t4", "t5", "d4"], size: 30 },
  { id: "w4", label: "Pinaka MBRL", type: "weapon-system", x: 700, y: 150, connections: ["t2", "d5"], size: 25 },

  // Documents
  { id: "d1", label: "Dhanush Manual", type: "document", x: 200, y: 450, connections: ["t1", "t3", "w1"], size: 20 },
  { id: "d2", label: "Bofors Tech Spec", type: "document", x: 350, y: 500, connections: ["t1", "t4", "w2"], size: 20 },
  { id: "d3", label: "Safety SOP", type: "document", x: 100, y: 400, connections: ["t2"], size: 20 },
  { id: "d4", label: "K9 Operations", type: "document", x: 600, y: 500, connections: ["t3", "w3"], size: 20 },
  { id: "d5", label: "Tactical Guide", type: "document", x: 550, y: 550, connections: ["t5", "w4"], size: 20 },

  // Courses
  { id: "c1", label: "YO Course", type: "course", x: 200, y: 100, connections: ["t4", "t1"], size: 25 },
  { id: "c2", label: "LGSC", type: "course", x: 400, y: 100, connections: ["t4", "t5"], size: 25 },
];

// Generate edges from node connections
function generateEdges(nodes: GraphNode[]): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const addedEdges = new Set<string>();

  nodes.forEach((node) => {
    node.connections.forEach((targetId) => {
      const edgeKey = [node.id, targetId].sort().join("-");
      if (!addedEdges.has(edgeKey)) {
        edges.push({
          source: node.id,
          target: targetId,
          strength: 0.5 + Math.random() * 0.5,
        });
        addedEdges.add(edgeKey);
      }
    });
  });

  return edges;
}

// Node color by type
const nodeColors: Record<NodeType, string> = {
  topic: "#3b82f6", // blue
  "weapon-system": "#ef4444", // red
  document: "#22c55e", // green
  course: "#a855f7", // purple
};

// Node icons by type
const nodeIcons: Record<NodeType, React.ReactNode> = {
  topic: <BookOpen className="h-4 w-4" />,
  "weapon-system": <Crosshair className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  course: <Network className="h-4 w-4" />,
};

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<GraphNode[]>(sampleNodes);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filter, setFilter] = useState<NodeType | "all">("all");
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize edges
  useEffect(() => {
    setEdges(generateEdges(nodes));
  }, [nodes]);

  // Apply force-directed layout simulation (simplified)
  const applyForceLayout = useCallback(() => {
    setNodes((prevNodes) => {
      const newNodes = prevNodes.map((node) => ({ ...node }));

      // Simple force simulation
      for (let iteration = 0; iteration < 50; iteration++) {
        // Repulsion between all nodes
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const dx = newNodes[j].x - newNodes[i].x;
            const dy = newNodes[j].y - newNodes[i].y;
            const dist = Math.max(50, Math.sqrt(dx * dx + dy * dy));
            const force = 500 / (dist * dist);

            newNodes[i].x -= (dx / dist) * force;
            newNodes[i].y -= (dy / dist) * force;
            newNodes[j].x += (dx / dist) * force;
            newNodes[j].y += (dy / dist) * force;
          }
        }

        // Attraction along edges
        edges.forEach((edge) => {
          const source = newNodes.find((n) => n.id === edge.source);
          const target = newNodes.find((n) => n.id === edge.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = dist * 0.01;

            source.x += (dx / dist) * force;
            source.y += (dy / dist) * force;
            target.x -= (dx / dist) * force;
            target.y -= (dy / dist) * force;
          }
        });

        // Keep nodes in bounds
        newNodes.forEach((node) => {
          node.x = Math.max(50, Math.min(750, node.x));
          node.y = Math.max(50, Math.min(550, node.y));
        });
      }

      return newNodes;
    });
  }, [edges]);

  // Filter nodes
  const filteredNodes = filter === "all" ? nodes : nodes.filter((n) => n.type === filter);
  const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));

  // Filter edges to only show connections between visible nodes
  const filteredEdges = edges.filter(
    (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  );

  // Get connected nodes for highlighting
  const connectedNodes = selectedNode
    ? new Set([selectedNode.id, ...selectedNode.connections])
    : null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(v) => setFilter(v as NodeType | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="topic">Topics</SelectItem>
              <SelectItem value="weapon-system">Weapon Systems</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={applyForceLayout}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reorganize
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setZoom(1)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {Object.entries(nodeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {type.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Graph Container */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <svg
            width="100%"
            height="600"
            viewBox={`0 0 ${800 / zoom} ${600 / zoom}`}
            className="bg-muted/20"
          >
            {/* Edges */}
            {filteredEdges.map((edge, index) => {
              const source = nodes.find((n) => n.id === edge.source);
              const target = nodes.find((n) => n.id === edge.target);
              if (!source || !target) return null;

              const isHighlighted =
                connectedNodes?.has(source.id) && connectedNodes?.has(target.id);
              const isHovered =
                hoveredNode === source.id || hoveredNode === target.id;

              return (
                <line
                  key={index}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted || isHovered ? "#3b82f6" : "#6b7280"}
                  strokeWidth={isHighlighted || isHovered ? 2 : 1}
                  strokeOpacity={
                    selectedNode && !isHighlighted ? 0.2 : isHovered ? 1 : 0.4
                  }
                />
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isConnected = connectedNodes?.has(node.id);
              const isHovered = hoveredNode === node.id;
              const opacity =
                selectedNode && !isConnected && !isSelected ? 0.3 : 1;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: "pointer", opacity }}
                  onClick={() =>
                    setSelectedNode(isSelected ? null : node)
                  }
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node circle */}
                  <circle
                    r={node.size / 2}
                    fill={nodeColors[node.type]}
                    stroke={isSelected || isHovered ? "#fff" : "transparent"}
                    strokeWidth={2}
                    className="transition-all"
                  />
                  {/* Node label */}
                  <text
                    y={node.size / 2 + 12}
                    textAnchor="middle"
                    className="text-[10px] fill-foreground pointer-events-none"
                    style={{ fontWeight: isSelected ? "bold" : "normal" }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <div
                className="p-1.5 rounded"
                style={{ backgroundColor: nodeColors[selectedNode.type] + "20" }}
              >
                {nodeIcons[selectedNode.type]}
              </div>
              {selectedNode.label}
              <Badge variant="outline" className="ml-auto capitalize">
                {selectedNode.type.replace("-", " ")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Connected to:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.connections.map((connId) => {
                    const connNode = nodes.find((n) => n.id === connId);
                    if (!connNode) return null;
                    return (
                      <Badge
                        key={connId}
                        variant="secondary"
                        className="cursor-pointer"
                        style={{
                          borderColor: nodeColors[connNode.type],
                          borderWidth: 1,
                        }}
                        onClick={() => setSelectedNode(connNode)}
                      >
                        {connNode.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedNode.connections.length} connections
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {nodes.filter((n) => n.type === "topic").length}
            </p>
            <p className="text-xs text-muted-foreground">Topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500">
              {nodes.filter((n) => n.type === "weapon-system").length}
            </p>
            <p className="text-xs text-muted-foreground">Weapon Systems</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {nodes.filter((n) => n.type === "document").length}
            </p>
            <p className="text-xs text-muted-foreground">Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">
              {nodes.filter((n) => n.type === "course").length}
            </p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
