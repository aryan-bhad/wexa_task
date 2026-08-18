"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { EntityDistributionChart } from "@/components/ui/EntityDistributionChart";
import { 
  Sparkles, 
  ShieldAlert, 
  Users, 
  GitBranch, 
  Code, 
  FolderGit2, 
  Building2, 
  AlertTriangle,
  ArrowRight,
  Layers,
  Cpu
} from "lucide-react";
import { BlastRadiusResult, EscalationChainResult } from "@/lib/queries";
import { NodeLabel } from "@/types";

export default function Home() {
  const [selectedBlastRepo, setSelectedBlastRepo] = useState("repo-6");
  const [blastData, setBlastData] = useState<BlastRadiusResult[]>([]);
  const [blastLoading, setBlastLoading] = useState(true);

  const [selectedIncidentRepo, setSelectedIncidentRepo] = useState("repo-5");
  const [incidentData, setIncidentData] = useState<EscalationChainResult[]>([]);
  const [incidentLoading, setIncidentLoading] = useState(true);

  // Fetch Blast Radius data
  useEffect(() => {
    let isMounted = true;
    async function loadBlast() {
      try {
        const res = await fetch(`/api/blast-radius?repoId=${selectedBlastRepo}`);
        const json = await res.json();
        if (isMounted && json.success) {
          setBlastData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setBlastLoading(false);
      }
    }
    loadBlast();

    return () => {
      isMounted = false;
    };
  }, [selectedBlastRepo]);

  // Fetch Incident Escalation Chain data
  useEffect(() => {
    let isMounted = true;
    async function loadIncident() {
      try {
        const res = await fetch(`/api/incidents?targetRepoId=${selectedIncidentRepo}`);
        const json = await res.json();
        if (isMounted && json.success) {
          setIncidentData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIncidentLoading(false);
      }
    }
    loadIncident();

    return () => {
      isMounted = false;
    };
  }, [selectedIncidentRepo]);


  return (
    <AppShell>
      {({
        activeTab,
        setActiveTab,
        selectedLabel,
        setSelectedLabel,
        searchQuery,
        nodeCounts,


        setNodeCounts,
        externalSelectedNodeId,
      }) => (
        <div className="space-y-6">
          {/* MAIN DASHBOARD OVERVIEW HEADER */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-md">
                    ENGINEERING KNOWLEDGE GRAPH
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    CognoDB openCypher Engine
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                  Understand how your engineering ecosystem connects.
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore relationships between developers, technologies, projects, repositories and companies through an interactive graph.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <Button
                  variant={activeTab === "graph" ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => setActiveTab("graph")}
                >
                  <Layers className="h-4 w-4" />
                  Explore Graph
                </Button>
                <Button
                  variant={activeTab === "blast-radius" ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("blast-radius")}
                >
                  <Sparkles className="h-4 w-4 text-sky-600" />
                  Calculate Blast Radius
                </Button>
              </div>
            </div>

            {/* METRIC CARDS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {/* Developers Card */}
              <Card
                onClick={() => setSelectedLabel("Developer")}
                className={`p-3.5 border transition-all cursor-pointer ${
                  selectedLabel === "Developer"
                    ? "border-sky-500 bg-sky-50/40 ring-1 ring-sky-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Developers
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 border border-sky-200 text-sky-600">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {nodeCounts.Developer || 5}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">Contributors</span>
                </div>
              </Card>

              {/* Skills Card */}
              <Card
                onClick={() => setSelectedLabel("Skill")}
                className={`p-3.5 border transition-all cursor-pointer ${
                  selectedLabel === "Skill"
                    ? "border-purple-500 bg-purple-50/40 ring-1 ring-purple-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Skills
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 border border-purple-200 text-purple-600">
                    <Code className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {nodeCounts.Skill || 6}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">Capabilities</span>
                </div>
              </Card>

              {/* Technologies Card */}
              <Card
                onClick={() => setSelectedLabel("Technology")}
                className={`p-3.5 border transition-all cursor-pointer ${
                  selectedLabel === "Technology"
                    ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Technologies
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600">
                    <Cpu className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {nodeCounts.Technology || 5}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">Languages & DBs</span>
                </div>
              </Card>

              {/* Projects Card */}
              <Card
                onClick={() => setSelectedLabel("Project")}
                className={`p-3.5 border transition-all cursor-pointer ${
                  selectedLabel === "Project"
                    ? "border-amber-500 bg-amber-50/40 ring-1 ring-amber-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Projects
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 border border-amber-200 text-amber-600">
                    <FolderGit2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {nodeCounts.Project || 3}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">Products</span>
                </div>
              </Card>

              {/* Repositories Card */}
              <Card
                onClick={() => setSelectedLabel("Repository")}
                className={`p-3.5 border transition-all cursor-pointer ${
                  selectedLabel === "Repository"
                    ? "border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Repositories
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600">
                    <GitBranch className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {nodeCounts.Repository || 6}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">Codebases</span>
                </div>
              </Card>

              {/* Companies Card */}
              <Card
                onClick={() => setSelectedLabel("Company")}
                className={`p-3.5 border transition-all cursor-pointer ${
                  selectedLabel === "Company"
                    ? "border-rose-500 bg-rose-50/40 ring-1 ring-rose-400/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Companies
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 border border-rose-200 text-rose-600">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {nodeCounts.Company || 1}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">Organization</span>
                </div>
              </Card>
            </div>
          </div>

          {/* TAB 1: INTERACTIVE REACT FLOW GRAPH CANVAS */}
          {activeTab === "graph" && (
            <div className="space-y-6">
              <GraphCanvas
                selectedLabel={selectedLabel}
                searchQuery={searchQuery}
                onNavigateTab={setActiveTab}
                onNodeCountsUpdate={(counts) => setNodeCounts(counts)}
                externalSelectedNodeId={externalSelectedNodeId}
              />

              {/* Real Graph Composition Breakdown Chart */}
              <EntityDistributionChart
                stats={nodeCounts as Record<NodeLabel, number>}
                totalNodes={nodeCounts.ALL || 26}
              />
            </div>
          )}

          {/* TAB 2: BLAST RADIUS CALCULATOR */}
          {activeTab === "blast-radius" && (
            <Card className="p-6 border-slate-200 space-y-6 bg-white shadow-2xs">
              {/* Header & Target Selector */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Microservice Blast Radius Calculator
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Executes Cypher Query C (<code className="text-sky-700 font-mono bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">-[DEPENDS_ON*1..6]-&gt;</code>) to trace transitive dependency impact.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 shrink-0">Target Codebase:</span>
                  <select
                    value={selectedBlastRepo}
                    onChange={(e) => setSelectedBlastRepo(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-mono font-semibold focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                  >
                    <option value="repo-6">common-logging-sdk (Depth 4)</option>
                    <option value="repo-5">crypto-vault-lib (Depth 3)</option>
                    <option value="repo-4">auth-core-service (Depth 2)</option>
                  </select>
                </div>
              </div>

              {/* Dependency Flow Visualization */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  TRANSITIVE IMPACT FLOW
                </span>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-900 text-white px-3 py-1.5 shadow-2xs">
                    <GitBranch className="h-4 w-4 text-sky-400" />
                    <span>TARGET: {selectedBlastRepo}</span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div className="flex items-center gap-2 rounded-lg bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1.5">
                    <span className="font-mono font-bold">Direct Impact</span>
                    <Badge variant="info" showDot={false}>{blastData.filter((b) => b.depth === 1).length} Repos</Badge>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5">
                    <span className="font-mono font-bold">Indirect Transitive</span>
                    <Badge variant="degraded" showDot={false}>{blastData.filter((b) => b.depth > 1).length} Repos</Badge>
                  </div>
                </div>
              </div>

              {/* Impact Card List */}
              {blastLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                    <span>Downstream Impacted Repositories ({blastData.length})</span>
                    <span>Ordered by Traversal Depth</span>
                  </div>

                  {blastData.map((item, idx) => (
                    <div
                      key={`${item.affectedRepoId}-${item.depth}-${idx}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono font-bold">
                          +{item.depth}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-slate-900">{item.affectedRepoName}</span>
                            <Badge variant="neutral">{item.language}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Maintainer: <span className="text-slate-900 font-semibold">{item.leadMaintainer || "Unassigned"}</span> ({item.contactEmail})
                          </p>
                        </div>
                      </div>

                      <Badge variant={item.depth === 1 ? "outage" : item.depth === 2 ? "degraded" : "info"}>
                        {item.depth === 1 ? "Immediate Downstream" : `${item.depth} Hops Transitive`}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* TAB 3: INCIDENT ESCALATION EXPLORER */}
          {activeTab === "incidents" && (
            <Card className="p-6 border-slate-200 space-y-6 bg-white shadow-2xs">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Incident Escalation Chain (2+ Hop Traversal)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Traverses <code className="text-amber-800 font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Developer -&gt; ContributesTo -&gt; DependentRepo -&gt; DependsOn -&gt; Target</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 shrink-0">Target Library:</span>
                  <select
                    value={selectedIncidentRepo}
                    onChange={(e) => setSelectedIncidentRepo(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-mono font-semibold focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                  >
                    <option value="repo-5">crypto-vault-lib</option>
                    <option value="repo-6">common-logging-sdk</option>
                  </select>
                </div>
              </div>

              {/* Escalation Path Chain Display */}
              {incidentLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {incidentData.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4.5 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{item.developerName}</span>
                            <span className="text-xs text-slate-500 ml-1 font-medium">({item.role})</span>
                          </div>
                        </div>
                        <Badge variant="info" showDot={false}>{item.email}</Badge>
                      </div>

                      {/* Timeline Escalation Representation */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-white p-3 rounded-lg border border-amber-200/60 shadow-2xs">
                        <div className="flex items-center gap-1 text-sky-700 font-bold">
                          <Users className="h-3.5 w-3.5 text-sky-600" />
                          <span>{item.developerName}</span>
                        </div>
                        <span className="text-slate-400">&rarr;</span>
                        <div className="flex items-center gap-1 text-indigo-700 font-bold">
                          <GitBranch className="h-3.5 w-3.5 text-indigo-600" />
                          <span>{item.dependentRepo}</span>
                        </div>
                        <span className="text-slate-400">&rarr;</span>
                        <div className="flex items-center gap-1 text-amber-800 font-bold">
                          <GitBranch className="h-3.5 w-3.5 text-amber-600" />
                          <span>{item.targetRepo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </AppShell>
  );
}

