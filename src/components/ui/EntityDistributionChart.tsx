"use client";

import React from "react";
import { NodeLabel } from "@/types";

interface CategoryStat {
  label: NodeLabel;
  name: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface EntityDistributionChartProps {
  stats: Record<NodeLabel, number>;
  totalNodes: number;
}

export function EntityDistributionChart({ stats, totalNodes }: EntityDistributionChartProps) {
  const categories: CategoryStat[] = [
    { label: "Developer", name: "Developers", count: stats.Developer || 0, color: "#0284c7", bgColor: "bg-sky-500", borderColor: "border-sky-200" },
    { label: "Skill", name: "Skills", count: stats.Skill || 0, color: "#9333ea", bgColor: "bg-purple-500", borderColor: "border-purple-200" },
    { label: "Technology", name: "Technologies", count: stats.Technology || 0, color: "#059669", bgColor: "bg-emerald-500", borderColor: "border-emerald-200" },
    { label: "Project", name: "Projects", count: stats.Project || 0, color: "#d97706", bgColor: "bg-amber-500", borderColor: "border-amber-200" },
    { label: "Repository", name: "Repositories", count: stats.Repository || 0, color: "#4f46e5", bgColor: "bg-indigo-500", borderColor: "border-indigo-200" },
    { label: "Company", name: "Companies", count: stats.Company || 0, color: "#e11d48", bgColor: "bg-rose-500", borderColor: "border-rose-200" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Graph Entity Composition
          </h3>
          <p className="text-xs text-slate-600 font-mono mt-0.5">
            {totalNodes} Total CognoDB Nodes
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">
          Distribution
        </span>
      </div>

      {/* Multi-segment Segmented Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/80">
        {categories.map((cat) => {
          if (cat.count === 0 || totalNodes === 0) return null;
          const pct = ((cat.count / totalNodes) * 100).toFixed(1);
          return (
            <div
              key={cat.label}
              style={{ width: `${pct}%`, backgroundColor: cat.color }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
              title={`${cat.name}: ${cat.count} (${pct}%)`}
            />
          );
        })}
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
        {categories.map((cat) => {
          const pct = totalNodes > 0 ? Math.round((cat.count / totalNodes) * 100) : 0;
          return (
            <div
              key={cat.label}
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-2 text-xs"
            >
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${cat.bgColor}`} />
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-slate-900 text-[11px] truncate">{cat.name}</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{cat.count}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">{pct}% of graph</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
