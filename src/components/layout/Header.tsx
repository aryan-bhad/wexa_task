"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Network, Database, ShieldAlert, Sparkles, RefreshCw, Search, Menu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  activeTab: "graph" | "blast-radius" | "incidents";
  setActiveTab: (tab: "graph" | "blast-radius" | "incidents") => void;
  toggleSidebar?: () => void;
  onOpenSearch?: () => void;
}

export function Header({ activeTab, setActiveTab, toggleSidebar, onOpenSearch }: HeaderProps) {
  const [dbStatus, setDbStatus] = useState<"checking" | "online" | "unreachable">("checking");

  const checkHealth = useCallback(async () => {
    setDbStatus("checking");
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        setDbStatus("online");
      } else {
        setDbStatus("unreachable");
      }
    } catch {
      setDbStatus("unreachable");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/health")
      .then((res) => {
        if (isMounted) {
          setDbStatus(res.ok ? "online" : "unreachable");
        }
      })
      .catch(() => {
        if (isMounted) {
          setDbStatus("unreachable");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 bg-white shadow-2xs">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6">

        {/* LEFT: Brand & Identity */}
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Sidebar"
              title="Toggle Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Network className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  TechGraph
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600 border border-slate-200">
                  openCypher
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-tight mt-0.5">
                Engineering Knowledge Explorer
              </p>
            </div>
          </div>
        </div>

        {/* CENTER: Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200/90 bg-slate-100/70 p-1">
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "graph"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-blue-600" />
            Graph Canvas
          </button>

          <button
            onClick={() => setActiveTab("blast-radius")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "blast-radius"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            Blast Radius
          </button>

          <button
            onClick={() => setActiveTab("incidents")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "incidents"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            Incidents
          </button>
        </nav>

        {/* RIGHT: Database Status, Command Search, Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Shortcut Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-900 transition-all shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium">Search...</span>
              <kbd className="hidden sm:inline rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Database Health Pill */}
          {dbStatus === "online" && (
            <Badge variant="healthy" className="hidden lg:inline-flex">
              <Database className="h-3 w-3" />
              CognoDB Connected
            </Badge>
          )}

          {dbStatus === "unreachable" && (
            <Badge variant="outage" className="hidden lg:inline-flex">
              <ShieldAlert className="h-3 w-3" />
              CognoDB Offline
            </Badge>
          )}

          {dbStatus === "checking" && (
            <Badge variant="info" className="hidden lg:inline-flex">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Checking...
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => checkHealth()}
            title="Refresh database connection status"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}

