"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Users, Code, Cpu, FolderGit2, GitBranch, Building2 } from "lucide-react";
import { NodeLabel } from "@/types";
import { cn } from "@/lib/utils";

interface CustomNodeData {
  id: string;
  label: NodeLabel;
  name: string;
  properties: Record<string, unknown>;
  isDimmed?: boolean;
}

const labelIcons: Record<NodeLabel, React.ReactNode> = {
  Developer: <Users className="h-4 w-4 text-sky-600" />,
  Skill: <Code className="h-4 w-4 text-purple-600" />,
  Technology: <Cpu className="h-4 w-4 text-emerald-600" />,
  Project: <FolderGit2 className="h-4 w-4 text-amber-600" />,
  Repository: <GitBranch className="h-4 w-4 text-indigo-600" />,
  Company: <Building2 className="h-4 w-4 text-rose-600" />,
};

const labelBadgeColors: Record<NodeLabel, string> = {
  Developer: "bg-sky-50 text-sky-700 border-sky-200",
  Skill: "bg-purple-50 text-purple-700 border-purple-200",
  Technology: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Project: "bg-amber-50 text-amber-700 border-amber-200",
  Repository: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Company: "bg-rose-50 text-rose-700 border-rose-200",
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const { label, name, properties, isDimmed } = nodeData;

  const subtitle =
    (properties?.role as string) ||
    (properties?.language as string) ||
    (properties?.category as string) ||
    (properties?.type as string) ||
    (properties?.criticality as string) ||
    (properties?.domain as string) ||
    "Entity Node";

  return (
    <div
      className={cn(
        "group relative w-[220px] min-h-[92px] rounded-xl border bg-white p-3.5 shadow-2xs transition-all duration-150 cursor-pointer flex flex-col justify-between select-none",
        "hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5",
        selected
          ? "border-2 border-blue-600 ring-4 ring-blue-500/20 shadow-md z-30 scale-[1.02]"
          : "border-slate-200/90",
        // Dimming rule: 40% opacity for unrelated nodes when a node is selected
        isDimmed && !selected && "opacity-40 grayscale-[10%] hover:opacity-100 hover:grayscale-0"
      )}
    >
      {/* Target & Source Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-400 group-hover:!bg-blue-600 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-400 group-hover:!bg-blue-600 transition-colors"
      />

      {/* Header Badge & Entity ID */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md bg-slate-50 border border-slate-200/80">
            {labelIcons[label]}
          </div>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border truncate max-w-[105px]",
              labelBadgeColors[label] || "bg-slate-100 text-slate-700 border-slate-200"
            )}
          >
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 shrink-0 font-semibold">{nodeData.id}</span>
      </div>

      {/* Entity Title & Subtitle */}
      <div className="mt-2">
        <h4 className="text-[15px] font-bold text-slate-900 truncate tracking-tight leading-snug">
          {name}
        </h4>
        <p className="text-[12px] text-slate-500 truncate font-medium leading-tight mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
});


CustomNode.displayName = "CustomNode";

