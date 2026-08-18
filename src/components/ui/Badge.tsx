import React from "react";
import { cn } from "@/lib/utils";
import { NodeLabel } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "healthy" | "degraded" | "outage" | "info" | "neutral" | NodeLabel;
  showDot?: boolean;
}

export function Badge({ className, variant = "neutral", showDot = true, children, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    healthy: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    degraded: "bg-amber-50 text-amber-700 border-amber-200/80",
    outage: "bg-rose-50 text-rose-700 border-rose-200/80",
    info: "bg-sky-50 text-sky-700 border-sky-200/80",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    // Entity Node Label Light-mode Colors
    Developer: "bg-sky-50 text-sky-700 border-sky-200",
    Skill: "bg-purple-50 text-purple-700 border-purple-200",
    Technology: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Project: "bg-amber-50 text-amber-700 border-amber-200",
    Repository: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Company: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const dotColors: Record<string, string> = {
    healthy: "bg-emerald-600 animate-pulse",
    degraded: "bg-amber-600 animate-pulse",
    outage: "bg-rose-600 animate-pulse",
    info: "bg-sky-600",
    neutral: "bg-slate-400",
    Developer: "bg-sky-500",
    Skill: "bg-purple-500",
    Technology: "bg-emerald-500",
    Project: "bg-amber-500",
    Repository: "bg-indigo-500",
    Company: "bg-rose-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-tight transition-colors select-none",
        variants[variant] || variants.neutral,
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant] || dotColors.neutral)} />
      )}
      {children}
    </span>
  );
}

