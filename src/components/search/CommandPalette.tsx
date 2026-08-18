"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Users, Code, Cpu, FolderGit2, GitBranch, Building2, CornerDownLeft } from "lucide-react";
import { NodeLabel } from "@/types";

export interface SearchResultItem {
  id: string;
  name: string;
  label: NodeLabel;
  subtitle: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (entityId: string, label: NodeLabel) => void;
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

export function CommandPalette({ isOpen, onClose, onSelectEntity }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard listeners for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch search items when palette is open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function executeSearch() {
      try {
        const res = await fetch(`/api/graph?labelFilter=ALL&searchQuery=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          const mapped: SearchResultItem[] = [];
          const seen = new Set<string>();

          json.data.forEach((rec: { n?: { properties?: Record<string, unknown>; labels?: string[] } }) => {
            if (rec.n && rec.n.properties) {
              const props = rec.n.properties;
              const id = (props.id as string) || String(rec.n.properties.name);
              if (!seen.has(id)) {
                seen.add(id);
                const label = (rec.n.labels && rec.n.labels[0] as NodeLabel) || "Developer";
                const name = (props.name as string) || id;
                const subtitle =
                  (props.role as string) ||
                  (props.language as string) ||
                  (props.category as string) ||
                  (props.type as string) ||
                  (props.domain as string) ||
                  "Entity Node";

                mapped.push({ id, name, label, subtitle });
              }
            }
          });

          setItems(mapped);
          setSelectedIndex(0);
        }
      } catch {
        // empty catch
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    executeSearch();

    return () => {
      isMounted = false;
    };
  }, [isOpen, query]);


  if (!isOpen) return null;

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === "Enter" && items[selectedIndex]) {
      e.preventDefault();
      onSelectEntity(items[selectedIndex].id, items[selectedIndex].label);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs -z-10"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            placeholder="Search developers, technologies, projects, repositories..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
          {loading && (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              Searching CognoDB topology graph...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching entities found for &quot;{query}&quot;
            </div>
          )}

          {!loading &&
            items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectEntity(item.id, item.label);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 cursor-pointer transition-all ${
                    isSelected ? "bg-blue-50/80 border border-blue-200/60" : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-xs shrink-0">
                      {labelIcons[item.label]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider border ${
                            labelBadgeColors[item.label]
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                    {isSelected && (
                      <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                        <span>Select</span>
                        <CornerDownLeft className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-sans shadow-2xs">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-sans shadow-2xs">↵</kbd> select
            </span>
          </div>
          <span>TechGraph Command Palette</span>
        </div>
      </div>
    </div>
  );
}
