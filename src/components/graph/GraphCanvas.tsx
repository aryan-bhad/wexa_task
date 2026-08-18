import React, { useEffect, useState, useMemo, useCallback } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CustomNode } from "./CustomNode";
import { NodeDetailDrawer, SelectedNodeInfo } from "./NodeDetailDrawer";
import { transformCypherToReactFlow } from "@/lib/graph-utils";
import { NodeLabel } from "@/types";
import { RefreshCw, SearchX, AlertCircle, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, ArrowDownUp, ArrowLeftRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GraphCanvasProps {
  selectedLabel: NodeLabel | "ALL";
  searchQuery: string;
  onNavigateTab?: (tab: "graph" | "blast-radius" | "incidents") => void;
  onNodeCountsUpdate?: (counts: Record<string, number>) => void;
  externalSelectedNodeId?: string | null;
}

function GraphCanvasContent({
  selectedLabel,
  searchQuery,
  onNavigateTab,
  onNodeCountsUpdate,
  externalSelectedNodeId,
}: GraphCanvasProps) {
  const [rawNodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [rawEdges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [layoutDirection, setLayoutDirection] = useState<"TB" | "LR">("TB");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);

  // Fullscreen Presentation Mode State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedViewport, setSavedViewport] = useState<{ x: number; y: number; zoom: number } | null>(null);

  const { fitView, zoomIn, zoomOut, getViewport, setViewport } = useReactFlow();
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const [reloadKey, setReloadKey] = useState(0);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  // Toggle Presentation Mode with Viewport Preservation
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const currentVp = getViewport();
      setSavedViewport(currentVp);
      setIsFullscreen(true);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        fitView({ padding: 0.12, maxZoom: 1.0, minZoom: 0.45, duration: 300 });
      }, 50);
    } else {
      setIsFullscreen(false);
      document.body.style.overflow = "";

      if (savedViewport) {
        setTimeout(() => {
          setViewport(savedViewport, { duration: 300 });
        }, 50);
      } else {
        fitView({ padding: 0.12, maxZoom: 1.0, minZoom: 0.45, duration: 300 });
      }
    }
  }, [isFullscreen, getViewport, setViewport, fitView, savedViewport]);

  // ESC Key Listener for Exit Presentation Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  // Clean up body scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const queryParams = new URLSearchParams({
          labelFilter: selectedLabel,
          searchQuery: searchQuery,
        });

        const res = await fetch(`/api/graph?${queryParams.toString()}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          if (isMounted) setError(json.error?.message || "Failed to query graph topology from CognoDB.");
          return;
        }

        if (Array.isArray(json.data) && isMounted) {
          const { nodes: flowNodes, edges: flowEdges, counts } = transformCypherToReactFlow(json.data, layoutDirection);
          setNodes(flowNodes);
          setEdges(flowEdges);
          if (onNodeCountsUpdate) {
            onNodeCountsUpdate(counts);
          }
          // Fit graph into 75-85% of available canvas viewport with 12% padding
          setTimeout(() => {
            fitView({ padding: 0.12, maxZoom: 1.0, minZoom: 0.45, duration: 300 });
          }, 50);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (isMounted) setError(`Database/Network Error: ${msg}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedLabel, searchQuery, layoutDirection, reloadKey, setNodes, setEdges, onNodeCountsUpdate, fitView]);



  // Handle external node selection (from Command Palette)
  useEffect(() => {
    if (!externalSelectedNodeId || rawNodes.length === 0) return;
    const targetNode = rawNodes.find((n) => n.id === externalSelectedNodeId);
    if (targetNode) {
      const data = targetNode.data as unknown as SelectedNodeInfo;
      // Wrap in microtask to avoid cascading renders warning
      queueMicrotask(() => {
        setSelectedNode(data);
      });
    }
  }, [externalSelectedNodeId, rawNodes]);


  // Set of connected node IDs when a node is selected
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const set = new Set<string>();
    set.add(selectedNode.id);

    rawEdges.forEach((edge) => {
      if (edge.source === selectedNode.id) set.add(edge.target);
      if (edge.target === selectedNode.id) set.add(edge.source);
    });

    return set;
  }, [selectedNode, rawEdges]);

  // Compute processed nodes with 40% opacity dimming for unrelated nodes
  const displayNodes = useMemo(() => {
    if (!selectedNode) return rawNodes;

    return rawNodes.map((node) => {
      const isConnected = connectedNodeIds.has(node.id);
      return {
        ...node,
        data: {
          ...node.data,
          isDimmed: !isConnected,
        },
      };
    });
  }, [rawNodes, selectedNode, connectedNodeIds]);

  // Compute processed edges with blue stroke highlighting for connected paths
  const displayEdges = useMemo(() => {
    if (!selectedNode) return rawEdges;

    return rawEdges.map((edge) => {
      const isConnected =
        edge.source === selectedNode.id || edge.target === selectedNode.id;
      return {
        ...edge,
        animated: isConnected,
        style: isConnected
          ? { stroke: "#2563eb", strokeWidth: 2.5 }
          : { stroke: "#cbd5e1", strokeWidth: 1.5, opacity: 0.35 },
        labelStyle: isConnected
          ? { fill: "#2563eb", fontSize: 11, fontWeight: 700 }
          : { fill: "#64748b", fontSize: 11, fontWeight: 500 },
        labelBgStyle: isConnected
          ? { fill: "#ffffff", stroke: "#2563eb", strokeWidth: 1.5, rx: 6, ry: 6 }
          : { fill: "#ffffff", stroke: "#e2e8f0", strokeWidth: 1.25, rx: 6, ry: 6 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: isConnected ? "#2563eb" : "#94a3b8",
        },
      };
    });
  }, [rawEdges, selectedNode]);

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const data = node.data as unknown as SelectedNodeInfo;
    setSelectedNode(data);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  const handleResetLayout = () => {
    setSelectedNode(null);
    fitView({ padding: 0.12, maxZoom: 1.0, minZoom: 0.45, duration: 400 });
  };

  const toggleDirection = () => {
    setLayoutDirection((prev) => (prev === "TB" ? "LR" : "TB"));
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#f8fafc] w-screen h-screen flex flex-col p-0"
          : "flex flex-col lg:flex-row gap-5 w-full h-[calc(100vh-210px)] min-h-[620px]"
      }
    >
      {/* Canvas Container */}
      <div
        className={
          isFullscreen
            ? "flex-1 relative bg-[#f8fafc] overflow-hidden flex flex-col w-full h-full"
            : "flex-1 relative rounded-2xl border border-slate-200 bg-[#f8fafc] overflow-hidden shadow-2xs flex flex-col"
        }
      >
        {/* Floating Top Canvas Bar */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-2xs pointer-events-auto">
            {isFullscreen ? (
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                  Presentation Mode
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-800">Hierarchical Topology</span>
            )}
            <span className="text-[10px] font-mono text-slate-300">|</span>
            <span className="text-[11px] font-mono text-slate-600 font-bold">{rawNodes.length} Nodes</span>
            <span className="text-[11px] font-mono text-slate-600 font-bold">{rawEdges.length} Relationships</span>
          </div>

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-1 shadow-2xs pointer-events-auto">
            <button
              onClick={() => fitView({ padding: 0.12, maxZoom: 1.0, minZoom: 0.45, duration: 300 })}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Fit View"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Fit</span>
            </button>

            <button
              onClick={handleResetLayout}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Layout"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={toggleDirection}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title={`Switch Layout Direction (Current: ${layoutDirection})`}
            >
              {layoutDirection === "TB" ? (
                <ArrowDownUp className="h-3.5 w-3.5 text-blue-600" />
              ) : (
                <ArrowLeftRight className="h-3.5 w-3.5 text-blue-600" />
              )}
              <span className="hidden sm:inline font-mono">{layoutDirection}</span>
            </button>

            <div className="h-4 w-px bg-slate-200 my-auto" />

            <button
              onClick={() => zoomIn({ duration: 200 })}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => zoomOut({ duration: 200 })}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 my-auto" />

            {/* Presentation Mode Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className={
                isFullscreen
                  ? "flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                  : "flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              }
              title={isFullscreen ? "Exit presentation mode (Press Esc)" : "Enter presentation mode"}
              aria-label={isFullscreen ? "Exit graph presentation mode" : "Enter graph presentation mode"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden sm:inline font-mono">Exit (Esc)</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>


        {/* State 1: Loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white/90 z-20">
            <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
            <span className="text-xs font-mono text-slate-600 font-semibold">Querying CognoDB openCypher Graph...</span>
          </div>
        )}

        {/* State 2: Error */}
        {!loading && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center bg-white/95 z-20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-2xs">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-base font-bold text-slate-900">Unable to load topology graph</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
            </div>
            <Button variant="accent" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>

          </div>
        )}

        {/* State 3: Empty State */}
        {!loading && !error && rawNodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-8 text-center bg-white/95 z-20">
            <SearchX className="h-10 w-10 text-slate-400 mb-1" />
            <div className="space-y-1 max-w-sm">
              <h4 className="text-base font-bold text-slate-900">No matching graph entities</h4>
              <p className="text-xs text-slate-600">
                No entities found matching &quot;{searchQuery}&quot; with filter &quot;{selectedLabel}&quot;.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Canvas
            </Button>

          </div>
        )}

        {/* State 4: Interactive React Flow Canvas */}
        <div className="flex-1 w-full h-full pt-10">
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            fitView
            fitViewOptions={{ padding: 0.12, maxZoom: 1.0, minZoom: 0.45 }}
            minZoom={0.2}
            maxZoom={1.8}
            className="bg-[#f8fafc]"

          >
            <Background color="#cbd5e1" gap={24} size={1.25} />
            <Controls className="!bg-white !border-slate-200 !text-slate-700 rounded-xl overflow-hidden shadow-2xs" />
            <MiniMap
              nodeColor={(node) => {
                const data = node.data as unknown as SelectedNodeInfo;
                switch (data?.label) {
                  case "Developer":
                    return "#0284c7";
                  case "Skill":
                    return "#9333ea";
                  case "Technology":
                    return "#059669";
                  case "Project":
                    return "#d97706";
                  case "Repository":
                    return "#4f46e5";
                  case "Company":
                    return "#e11d48";
                  default:
                    return "#64748b";
                }
              }}
              className="!bg-white !border-slate-200 rounded-xl overflow-hidden hidden sm:block shadow-2xs"
              maskColor="rgba(248, 250, 252, 0.75)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Selected Node Detail Drawer */}
      <NodeDetailDrawer
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasContent {...props} />
    </ReactFlowProvider>
  );
}

