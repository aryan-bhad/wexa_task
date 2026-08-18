"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "@/components/search/CommandPalette";
import { NodeLabel } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface AppShellProps {
  children: (props: {
    activeTab: "graph" | "blast-radius" | "incidents";
    setActiveTab: (tab: "graph" | "blast-radius" | "incidents") => void;
    selectedLabel: NodeLabel | "ALL";
    setSelectedLabel: (label: NodeLabel | "ALL") => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    nodeCounts: Record<string, number>;
    setNodeCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    externalSelectedNodeId: string | null;
  }) => React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "blast-radius" | "incidents">("graph");
  const [selectedLabel, setSelectedLabel] = useState<NodeLabel | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [nodeCounts, setNodeCounts] = useState<Record<string, number>>({});
  const [externalSelectedNodeId, setExternalSelectedNodeId] = useState<string | null>(null);

  const handleSelectFromSearch = (entityId: string) => {
    setActiveTab("graph");
    setSelectedLabel("ALL");
    setExternalSelectedNodeId(entityId);
    setCommandPaletteOpen(false);
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
      />

      {/* Main Layout Workspace Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-64px)]">
        <Sidebar
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          nodeCounts={nodeCounts}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace with Framer Motion transitions */}
        <main className="flex-1 min-w-0 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 flex flex-col">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex-1"
            >
              {children({
                activeTab,
                setActiveTab,
                selectedLabel,
                setSelectedLabel,
                searchQuery,
                setSearchQuery,
                nodeCounts,
                setNodeCounts,
                externalSelectedNodeId,
              })}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectEntity={handleSelectFromSearch}
      />
    </div>
  );
}

