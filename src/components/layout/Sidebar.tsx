"use client";

import React from "react";
import { Search, Users, Code, Cpu, FolderGit2, GitBranch, Building2, Layers, X, Network, Sparkles, ShieldAlert } from "lucide-react";
import { NodeLabel } from "@/types";

interface SidebarProps {
  selectedLabel: NodeLabel | "ALL";
  setSelectedLabel: (label: NodeLabel | "ALL") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab?: "graph" | "blast-radius" | "incidents";
  setActiveTab?: (tab: "graph" | "blast-radius" | "incidents") => void;
  nodeCounts?: Record<string, number>;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  selectedLabel,
  setSelectedLabel,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  nodeCounts = {},
  isOpen = true,
  onClose,
}: SidebarProps) {
  const totalCount = nodeCounts["ALL"] || 26;

  const entityFilters: { label: NodeLabel | "ALL"; name: string; icon: React.ReactNode; defaultCount: number }[] = [
    { label: "ALL", name: "All Entities", icon: <Layers className="h-4 w-4 text-blue-600" />, defaultCount: 26 },
    { label: "Developer", name: "Developers", icon: <Users className="h-4 w-4 text-sky-600" />, defaultCount: 5 },
    { label: "Skill", name: "Skills", icon: <Code className="h-4 w-4 text-purple-600" />, defaultCount: 6 },
    { label: "Technology", name: "Technologies", icon: <Cpu className="h-4 w-4 text-emerald-600" />, defaultCount: 5 },
    { label: "Project", name: "Projects", icon: <FolderGit2 className="h-4 w-4 text-amber-600" />, defaultCount: 3 },
    { label: "Repository", name: "Repositories", icon: <GitBranch className="h-4 w-4 text-indigo-600" />, defaultCount: 6 },
    { label: "Company", name: "Companies", icon: <Building2 className="h-4 w-4 text-rose-600" />, defaultCount: 1 },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-5 space-y-6 border-r border-slate-200 shadow-2xl transition-transform duration-200 ease-in-out lg:static lg:w-64 lg:shrink-0 lg:shadow-none lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 lg:translate-x-0 overflow-y-auto custom-scrollbar ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Knowledge Explorer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      {/* Search Input Box */}
      <div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
          SEARCH GRAPH
        </span>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technologies, developers..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
              aria-label="Clear Search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* EXPLORE SECTION */}
      {setActiveTab && (
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
            EXPLORE
          </span>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("graph")}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === "graph"
                  ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Network className={`h-4 w-4 ${activeTab === "graph" ? "text-blue-600" : "text-slate-400"}`} />
                <span>Graph Canvas</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("blast-radius")}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === "blast-radius"
                  ? "bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`h-4 w-4 ${activeTab === "blast-radius" ? "text-sky-600" : "text-slate-400"}`} />
                <span>Blast Radius</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("incidents")}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === "incidents"
                  ? "bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className={`h-4 w-4 ${activeTab === "incidents" ? "text-amber-600" : "text-slate-400"}`} />
                <span>Incident Traversal</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ENTITY TYPES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            ENTITY TYPES
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">{totalCount} Nodes</span>
        </div>

        <div className="space-y-1">
          {entityFilters.map((item) => {
            const isSelected = selectedLabel === item.label;
            const count = nodeCounts[item.label] ?? item.defaultCount;

            return (
              <button
                key={item.label}
                onClick={() => setSelectedLabel(item.label)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isSelected ? "text-blue-600" : "opacity-80"}>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold ${
                    isSelected ? "bg-blue-100/80 text-blue-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Database Connection Specs */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <span>CognoDB openCypher</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
          Graph traversal engine connected over Bolt protocol. Real-time topology sync enabled.
        </p>
      </div>
    </aside>
    </>
  );
}

