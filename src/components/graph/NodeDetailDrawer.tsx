"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShieldAlert, ArrowRight, Database, Users, Code, Cpu, FolderGit2, GitBranch, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NodeLabel } from "@/types";


export interface SelectedNodeInfo {
  id: string;
  label: NodeLabel;
  name: string;
  properties: Record<string, unknown>;
}

interface NodeDetailDrawerProps {
  selectedNode: SelectedNodeInfo | null;
  onClose: () => void;
  onNavigateTab?: (tab: "graph" | "blast-radius" | "incidents") => void;
}

const labelIcons: Record<NodeLabel, React.ReactNode> = {
  Developer: <Users className="h-4 w-4 text-sky-600" />,
  Skill: <Code className="h-4 w-4 text-purple-600" />,
  Technology: <Cpu className="h-4 w-4 text-emerald-600" />,
  Project: <FolderGit2 className="h-4 w-4 text-amber-600" />,
  Repository: <GitBranch className="h-4 w-4 text-indigo-600" />,
  Company: <Building2 className="h-4 w-4 text-rose-600" />,
};

export function NodeDetailDrawer({
  selectedNode,
  onClose,
  onNavigateTab,
}: NodeDetailDrawerProps) {
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!selectedNode) return;

    let isMounted = true;
    const fetchEntityDetails = async () => {
      try {
        let endpoint = "";
        if (selectedNode.label === "Developer") {
          endpoint = `/api/developers/${selectedNode.id}`;
        } else if (selectedNode.label === "Technology") {
          endpoint = `/api/technologies/${selectedNode.id}`;
        } else if (selectedNode.label === "Project") {
          endpoint = `/api/projects/${selectedNode.id}`;
        }

        if (endpoint) {
          const res = await fetch(endpoint);
          const json = await res.json();
          if (json.success && isMounted) {
            setDetails(json.data);
          }
        } else if (isMounted) {
          setDetails(null);
        }
      } catch {
        if (isMounted) {
          setDetails(null);
        }
      }
    };

    fetchEntityDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedNode]);

  if (!selectedNode) return null;

  const { id, label, name, properties } = selectedNode;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.15 }}
        className="w-full lg:w-84 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg space-y-5 flex flex-col max-h-[640px] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 border border-slate-200">
              {labelIcons[label]}
            </div>
            <Badge variant={label}>{label}</Badge>
            <span className="font-mono text-xs text-slate-400 font-semibold">{id}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close Inspector Panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Node Title & Identity */}
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">{name}</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
            <Database className="h-3 w-3 text-slate-400" />
            CognoDB Entity Node
          </p>
        </div>

        {/* Properties Key-Value Table */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            PROPERTIES
          </span>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2 text-xs">
            {Object.entries(properties).map(([key, val]) => (
              <div key={key} className="flex justify-between items-baseline gap-2 border-b border-slate-200/60 pb-1.5 last:border-b-0 last:pb-0">
                <span className="text-slate-500 font-mono text-[11px]">{key}:</span>
                <span className="text-slate-900 font-semibold truncate max-w-[160px]">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Graph Relationships */}
        {details && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              GRAPH RELATIONSHIPS
            </span>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3 text-xs">
              {Array.isArray(details.skills) && details.skills.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-purple-700 block mb-1">Has Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {(details.skills as string[]).map((sk) => (
                      <Badge key={sk} variant="Skill" showDot={false}>{sk}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(details.repositories) && details.repositories.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 block mb-1">Repositories:</span>
                  <div className="flex flex-wrap gap-1">
                    {(details.repositories as string[]).map((repo) => (
                      <Badge key={repo} variant="Repository" showDot={false}>{repo}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(details.teamMembers) && details.teamMembers.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-sky-700 block mb-1">Team Contributors:</span>
                  <div className="flex flex-wrap gap-1">
                    {(details.teamMembers as string[]).map((dev) => (
                      <Badge key={dev} variant="Developer" showDot={false}>{dev}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions & Traversal Shortcuts */}
        <div className="space-y-2 pt-1 mt-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            ACTIONS & TRAVERSAL
          </span>

          {label === "Repository" && onNavigateTab && (
            <Button
              variant="accent"
              size="sm"
              className="w-full justify-between"
              onClick={() => onNavigateTab("blast-radius")}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Calculate Blast Radius
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}

          {onNavigateTab && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => onNavigateTab("incidents")}
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                Inspect Escalation Chain
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

