import { Node, Edge, MarkerType } from "@xyflow/react";
import { NodeLabel } from "@/types";

/**
 * Graph Topology Data Transformer & Hierarchical Visual Layout Engine
 * 
 * Takes raw CognoDB openCypher API records and maps them directly to React Flow nodes and edges.
 * NEVER alters, invents, renames, or drops any nodes, labels, properties, edge types, or relationship directions.
 * Applies a visual topological layering algorithm (Company -> Project -> Repository -> Technology/Skill -> Developer)
 * with barycenter horizontal ordering to minimize edge crossings.
 */

export interface RawCypherRecord {
  n?: {
    elementId?: string;
    identity?: { low: number; high: number };
    labels?: string[];
    properties?: Record<string, unknown>;
  };
  r?: {
    elementId?: string;
    type?: string;
    properties?: Record<string, unknown>;
    startNodeElementId?: string;
    endNodeElementId?: string;
  };
  m?: {
    elementId?: string;
    identity?: { low: number; high: number };
    labels?: string[];
    properties?: Record<string, unknown>;
  };
}

export function transformCypherToReactFlow(
  records: RawCypherRecord[],
  direction: "TB" | "LR" = "TB"
): {
  nodes: Node[];
  edges: Edge[];
  counts: Record<string, number>;
} {
  const nodeMap = new Map<string, { id: string; label: NodeLabel; name: string; props: Record<string, unknown> }>();
  const edgeMap = new Map<string, Edge>();
  const counts: Record<string, number> = { ALL: 0 };

  // Helper to extract and register unique node definitions from CognoDB openCypher output
  const registerNode = (nodeData: RawCypherRecord["n"]) => {
    if (!nodeData || !nodeData.properties) return null;

    const props = nodeData.properties;
    const nodeId = (props.id as string) || (props.name as string) || String(nodeData.elementId || Math.random());
    const label = (nodeData.labels && nodeData.labels[0]) as NodeLabel || "Developer";
    const name = (props.name as string) || nodeId;

    if (!nodeMap.has(nodeId)) {
      nodeMap.set(nodeId, { id: nodeId, label, name, props });
      counts[label] = (counts[label] || 0) + 1;
      counts["ALL"] = (counts["ALL"] || 0) + 1;
    }
    return nodeId;
  };

  // Process raw Cypher records and preserve exact relationship types and directions
  records.forEach((record) => {
    const sourceId = registerNode(record.n);
    const targetId = registerNode(record.m);

    if (sourceId && targetId && record.r && record.r.type) {
      const edgeId = `${sourceId}-${record.r.type}-${targetId}`;
      if (!edgeMap.has(edgeId)) {
        const flowEdge: Edge = {
          id: edgeId,
          source: sourceId,
          target: targetId,
          label: record.r.type,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#94a3b8", strokeWidth: 1.5 },
          labelStyle: { fill: "#334155", fontSize: 11, fontWeight: 600, fontFamily: "Inter, var(--font-geist-sans), system-ui, sans-serif" },
          labelBgStyle: { fill: "#ffffff", stroke: "#cbd5e1", strokeWidth: 1.5, rx: 6, ry: 6 },
          labelBgPadding: [7, 4],
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: "#94a3b8",
          },
        };
        edgeMap.set(edgeId, flowEdge);
      }
    }
  });

  // Assign Ranks for Hierarchical Layer Layout
  const rankMap: Record<NodeLabel, number> = {
    Company: 0,
    Project: 1,
    Repository: 2,
    Technology: 3,
    Skill: 3,
    Developer: 4,
  };

  const layers: Map<number, { id: string; label: NodeLabel; name: string; props: Record<string, unknown> }[]> = new Map();

  nodeMap.forEach((node) => {
    const rank = rankMap[node.label] ?? 2;
    if (!layers.has(rank)) {
      layers.set(rank, []);
    }
    layers.get(rank)!.push(node);
  });

  // Calculate connections for barycenter crossing minimization
  const adjMap = new Map<string, string[]>();
  edgeMap.forEach((edge) => {
    if (!adjMap.has(edge.source)) adjMap.set(edge.source, []);
    if (!adjMap.has(edge.target)) adjMap.set(edge.target, []);
    adjMap.get(edge.source)!.push(edge.target);
    adjMap.get(edge.target)!.push(edge.source);
  });

  // Order nodes within each rank using average neighbor positions
  const sortedLayers = Array.from(layers.keys()).sort((a, b) => a - b);
  const nodePositionMap = new Map<string, number>();

  sortedLayers.forEach((rank) => {
    const rankNodes = layers.get(rank)!;

    // Calculate barycenter score for each node in this rank based on connected neighbors
    const scoredNodes = rankNodes.map((node, defaultIdx) => {
      const neighbors = adjMap.get(node.id) || [];
      const placedNeighbors = neighbors.filter((nId) => nodePositionMap.has(nId));

      let score = defaultIdx;
      if (placedNeighbors.length > 0) {
        const sum = placedNeighbors.reduce((acc, nId) => acc + nodePositionMap.get(nId)!, 0);
        score = sum / placedNeighbors.length;
      }
      return { node, score };
    });

    // Sort by barycenter score
    scoredNodes.sort((a, b) => a.score - b.score);

    // Assign final horizontal index in rank
    scoredNodes.forEach((item, index) => {
      nodePositionMap.set(item.node.id, index);
      layers.set(
        rank,
        scoredNodes.map((s) => s.node)
      );
    });
  });

  // Generate React Flow Nodes with exact coordinates
  const flowNodes: Node[] = [];
  const X_PITCH = 275; // Generous horizontal node separation (node width 220px + 55px gap)
  const Y_PITCH = 175; // Generous vertical rank separation


  sortedLayers.forEach((rank, layerIdx) => {
    const nodesInRank = layers.get(rank)!;
    const count = nodesInRank.length;
    if (count === 0) return;

    const rowWidth = count * X_PITCH;
    const startX = -(rowWidth / 2) + X_PITCH / 2;

    nodesInRank.forEach((node, index) => {
      const offsetX = startX + index * X_PITCH;
      const offsetY = layerIdx * Y_PITCH;

      const x = direction === "TB" ? offsetX : offsetY * 1.5;
      const y = direction === "TB" ? offsetY : offsetX;

      flowNodes.push({
        id: node.id,
        type: "customNode",
        position: { x, y },
        data: {
          id: node.id,
          label: node.label,
          name: node.name,
          properties: node.props,
        },
      });
    });
  });

  return {
    nodes: flowNodes,
    edges: Array.from(edgeMap.values()),
    counts,
  };
}

