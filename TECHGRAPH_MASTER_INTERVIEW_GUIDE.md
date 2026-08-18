# TechGraph — Master Project Knowledge Audit & Interview Guide

This single-file master guide covers your entire **TechGraph — Engineering Knowledge Explorer** project. Use this file as your single reference for project architecture, openCypher database queries, layout algorithms, English/Gujarati presentation scripts, and interview Q&A.

---

## 📌 STEP 1 — One-Sentence & Pitch Definitions

### 1-Word Summary:
- **Intelligence** *(or **Dependency**)*

### 1-Sentence Pitch:
> **"TechGraph is an enterprise engineering intelligence platform that uses CognoDB Cloud (openCypher) and React Flow to map connections between software developers, microservices, technology stacks, and projects for instant blast-radius calculation and on-call incident escalation."**

---

### ⏱️ Pitch Formats (English + Gujarati)

#### 🔹 30-Second Elevator Pitch
- **English**:  
  > *"TechGraph is a developer architecture explorer built with Next.js 16, React Flow, and CognoDB Cloud. It models engineering ecosystems—developers, codebases, skills, and tools—as an openCypher graph database. This allows engineering managers to instantly calculate microservice blast radius during outages and trace multi-hop on-call escalation paths in milliseconds."*
- **Gujarati**:  
  > *"TechGraph એક developer architecture explorer છે જે Next.js 16, React Flow અને CognoDB Cloud નો ઉપયોગ કરે છે. આ system આપણી આખી engineering team, Git repositories, skills અને technologies ને graph DB ની જેમ model કરે છે. આનાથી જ્યારે કોઈ microservice અથવા library માં incident થાય, ત્યારે એનો blast radius અને on-call escalation path milliseconds માં શોધી શકાય છે."*

---

#### 🔹 1-Minute Executive Pitch
- **English**:  
  > *"In modern enterprise environments, understanding how microservices and engineering teams connect is extremely difficult. In traditional SQL databases, multi-hop dependency queries require slow, complex recursive JOINs. TechGraph solves this by modeling software architecture in CognoDB Cloud using openCypher graph pattern traversals.  
  > On the frontend, TechGraph features a light-themed interactive React Flow canvas with automatic Sugiyama-style hierarchical layout, floating relationship pills, node inspection, and a Ctrl+K command palette. It empowers engineers to answer two key questions: 'What downstream services break if a library fails?' and 'Who owns the services 3 hops downstream?'"*
- **Gujarati**:  
  > *"આજના સમયમાં મોટો microservice architecture હોય ત્યારે કઈ library કઈ service સાથે જોડાયેલી છે એ જાણવું અઘરું છે. Traditional SQL માં આ માટે સંકળાયેલા tables પર ભારે `INNER JOIN` અથવા `WITH RECURSIVE` queries ચલાવવી પડે છે જે ખૂબ સ્લો હોય છે.  
  > TechGraph આ problem ને CognoDB Cloud અને openCypher graph database વડે solve કરે છે. Frontend માં Next.js 16 અને React Flow નો ઉપયોગ કરીને automatic hierarchical topology graph બતાવવામાં આવે છે. આમાં Command Palette (`⌘K`), Blast Radius Calculator અને 2+ Hop Incident Escalation જેવા features છે જે સિસ્ટમનું પૂરું નિર્દેશન આપે છે."*

---

#### 🔹 5-Minute Technical Master Pitch
- **English**:  
  > *"TechGraph is a full-stack engineering knowledge platform operating on 3 core pillars: Data Modeling, Graph Querying, and Interactive Visualization.  
  > 1. **Data Model**: Our CognoDB Cloud graph database stores 26 nodes across 6 categories—`Developer`, `Skill`, `Technology`, `Project`, `Repository`, `Company`—and 43 relationships including `DEPENDS_ON`, `USES_TECH`, `CONTRIBUTES_TO`, `HAS_SKILL`, `WORKS_AT`, `IMPLEMENTS_PROJECT`, `OWNS_PROJECT`, and `REQUIRES_SKILL`.  
  > 2. **Backend**: Our Next.js Server API routes interact with CognoDB Cloud via the official `neo4j-driver` over encrypted TLS Bolt 5.4 connections. Queries are 100% parameterized to prevent Cypher injection. We execute dynamic 1..6 hop transitive traversals to compute microservice blast radius ($O(k)$ pointer traversal time vs $O(N^k)$ SQL JOIN time).  
  > 3. **Frontend**: The UI is built with Next.js 16 App Router, Tailwind CSS, and `@xyflow/react`. It features a custom hierarchical layout algorithm in `graph-utils.ts` that computes node coordinates automatically without hardcoding, highlights connected paths in blue with flow animations, dims unrelated nodes to 45% opacity, and includes a slide-out attribute inspector and Ctrl+K search modal."*
- **Gujarati**:  
  > *"TechGraph એક સંપૂર્ણ full-stack engineering knowledge platform છે જે 3 મુખ્ય ભાગ પર કામ કરે છે:  
  > 1. **Data Model**: CognoDB Cloud Graph DB માં 6 પ્રકારના 26 Nodes પથરાયેલા છે—`Developer`, `Skill`, `Technology`, `Project`, `Repository`, `Company`—અને તેમની વચ્ચે 43 Relationships છે જેવી કે `DEPENDS_ON`, `USES_TECH`, `CONTRIBUTES_TO` વગેરે.  
  > 2. **Backend & Security**: Next.js Server API routes `neo4j-driver` દ્વારા encrypted Bolt 5.4 protocol વડે CognoDB સાથે connect થાય છે. Cypher Injection અટકાવવા માટે બધી queries 100% parameterized છે. Relational SQL ના બહુવિધ JOINs કરતાં અહીં Graph Pointer Traversal થી $O(k)$ સમયમાં જવાબ મળે છે.  
  > 3. **Frontend UI**: Frontend ને Next.js 16 અને React Flow વડે તૈયાર કરાયું છે. `graph-utils.ts` માં એક custom automatic layout algorithm લખ્યો છે જે nodes ના સ્થાન નક્કી કરે છે. Node પર ક્લિક કરવાથી સંકળાયેલા edges animated blue થાય છે અને બાકીના દ્રશ્યો 45% opacity પર જતાં રહે છે."*

---

## 📌 STEP 2 — How to Start Presentation Script

When the evaluator says **"Tell me about your project"**, speak this script:

### 🗣️ English Script:
> *"Thank you! I built **TechGraph — Engineering Knowledge Explorer**.  
> The core goal of TechGraph is to make software architecture, team skills, and microservice dependencies queryable in real-time using a Graph Database.  
> In many software organizations, when a core shared library or database crashes, engineers struggle to figure out which downstream services break and who needs to be alerted.  
> With TechGraph, we model engineering entities—like developers, codebases, skills, and tools—in CognoDB Cloud using openCypher. On top of this, I built a Next.js 16 and React Flow frontend that renders an interactive graph layout with a Blast Radius calculator and a multi-hop incident escalation tool.  
> Would you like me to demonstrate the live graph canvas or walk you through the architecture?"*

### 🗣️ Gujarati Script:
> *"Thank you! મેં **TechGraph — Engineering Knowledge Explorer** બનાવ્યું છે.  
> આ project નો મુખ્ય હેતુ એ છે કે આપણી કંપનીના microservices, developers, skills અને repositories ની વચ્ચેના સંબંધોને Graph Database ની મદદથી રિયલ-ટાઇમમાં જોઈ શકાય.  
> જ્યારે કોઈ મહત્વની library ક્રેશ થાય, ત્યારે કઈ કઈ સેવાઓ બંધ થશે અને કયા એન્જિનિયરને alert કરવા તે શોધવું અઘરું બને છે.  
> TechGraph માં અમે CognoDB Cloud અને openCypher નો ઉપયોગ કરીને આ ડેટા સ્ટોર કર્યો છે. Frontend માં મેં Next.js 16 અને React Flow વાપરીને interactive graph બનાવ્યો છે જેમાં Blast Radius Calculator અને On-Call Escalation જેવા Features છે.  
> શું હું આપને આનું Live Demo બતાવું કે પહેલાં Architecture સમજાવું?"*

---

## 📌 STEP 3 — Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js App Router (UI)                         │
│   Graph Canvas  │  Command Palette  │  Blast Radius  │  Incidents View  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST API (Zod Validation)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Server-Side API Layer (/api/*)                      │
│   /api/health   │   /api/graph   │   /api/blast-radius   │   /api/...  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized openCypher Queries
┌───────────────────────────────────▼────────────────────────────────────┐
│                     Neo4j Driver (src/lib/neo4j.ts)                    │
│                 ('server-only' Credentials Protection)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Bolt Protocol (bolt+s:// over TLS)
┌───────────────────────────────────▼────────────────────────────────────┐
│                             CognoDB Cloud                              │
│                    Managed openCypher Graph Engine                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📌 STEP 4 — Why Graph Database? (SQL vs. CognoDB / openCypher)

```text
  Developer (Sarah Chen)
     │
     │ CONTRIBUTES_TO { role: 'Lead Maintainer' }
     ▼
  Repository (auth-core-service)
     │
     │ DEPENDS_ON { dependencyType: 'Direct' }
     ▼
  Repository (crypto-vault-lib)
     │
     │ USES_TECH { version: '2.4.0' }
     ▼
  Technology (PostgreSQL)
```

### Relational SQL vs. CognoDB openCypher:

- **Relational SQL**: Querying variable-length paths requires recursive CTEs (`WITH RECURSIVE`) and multiple junction table `INNER JOIN`s, causing exponential $O(N^k)$ performance degradation.
- **CognoDB openCypher**: Relationships are physical memory pointers (**Index-Free Adjacency**). Graph traversals execute in $O(k)$ time, proportional only to local subgraph size.

---

## 📌 STEP 5 — Technology Stack Table

| Technology | Version | Purpose in TechGraph | Location in Codebase | Why Used? |
|---|---|---|---|---|
| **Next.js** | `16.3.1` | App Router web framework & server API routes | `src/app/` | React Server Rendering, API routing, server credentials security |
| **React** | `19.2.8` | UI library & state management | `src/app/`, `src/components/` | Concurrent UI rendering, hooks (`useState`, `useEffect`, `useMemo`) |
| **TypeScript** | `^5.0.0` | Strict static typing | Throughout `src/` & `scripts/` | Prevents runtime bugs, enforces API & graph types |
| **Tailwind CSS** | `^4.0.0` | Utility-first styling engine | `src/app/globals.css`, UI files | Rapid light-themed developer UI styling |
| **CognoDB Cloud** | *Managed Cloud* | openCypher graph database server | Remote Cloud Service | Native graph pattern traversal engine over Bolt |
| **neo4j-driver** | `^6.2.0` | Official Bolt protocol database client driver | `src/lib/neo4j.ts` | Server-side connection pooling & parameterized execution |
| **@xyflow/react** | `^12.11.3` | Interactive graph canvas (React Flow 12) | `src/components/graph/` | Hardware-accelerated canvas panning, zooming, minimap, handles |
| **Lucide React** | `^1.31.0` | Icon set for developer tools | `src/components/` | Consistent 16-20px iconography |
| **Zod** | `^4.4.3` | Runtime API parameter validation | `src/lib/validations.ts` | Validates API inputs on server before Cypher query execution |
| **Framer Motion** | `^13.1.0` | Micro-animations & tab transitions | `src/components/layout/` | Smooth 150ms UI state transitions |
| **clsx & tailwind-merge** | `^2.1.1` / `^3.6.0` | Dynamic class construction (`cn`) | `src/lib/utils.ts` | Safely merges Tailwind class overrides |
| **tsx** | `^4.23.12` | TypeScript CLI execution | `package.json` scripts | Runs CLI scripts (`seed.ts`, `test-db.ts`) directly |

---

## 📌 STEP 6 — Graph Data Model & ASCII Diagram

```text
            ┌────────────────────────┐
            │   Company (Wexa AI)    │
            └───────────┬────────────┘
                        │ OWNS_PROJECT
                        ▼
            ┌────────────────────────┐
            │  Project (TechGraph)   │
            └───────────▲────────────┘
                        │ IMPLEMENTS_PROJECT
                        │
            ┌───────────┴────────────┐
            │ Repository (web-app)   │
            └───────┬────────────┬───┘
   CONTRIBUTES_TO   │            │ USES_TECH
         ┌──────────┘            └──────────┐
         ▼                                  ▼
┌─────────────────┐               ┌───────────────────┐
│Developer (Sarah)│               │Technology (React) │
└────────┬────────┘               └─────────┬─────────┘
         │ HAS_SKILL                        │ REQUIRES_SKILL
         ▼                                  ▼
┌─────────────────────────────────────────────────────┐
│             Skill (openCypher Querying)             │
└─────────────────────────────────────────────────────┘
```

### Complete Entity Node Catalog (26 Nodes Total)
- **`Developer` (5 Nodes)**: `dev-1` (Sarah Chen), `dev-2` (Marcus Vance), `dev-3` (Elena Rostova), `dev-4` (Amara Okafor), `dev-5` (Liam Patel).
- **`Skill` (6 Nodes)**: `skill-1` (openCypher Querying), `skill-2` (Graph Data Modeling), `skill-3` (Distributed Systems), `skill-4` (Rust Microservices), `skill-5` (React Server Components), `skill-6` (Kubernetes Ops).
- **`Technology` (5 Nodes)**: `tech-1` (CognoDB Cloud), `tech-2` (Next.js 16), `tech-3` (Go Language), `tech-4` (PostgreSQL), `tech-5` (Redis Cache).
- **`Project` (3 Nodes)**: `proj-1` (TechGraph Explorer), `proj-2` (Neural Query Engine), `proj-3` (Enterprise Auth Suite).
- **`Repository` (6 Nodes)**: `repo-1` (techgraph-web), `repo-2` (neural-query-service), `repo-3` (identity-provider-service), `repo-4` (auth-core-service), `repo-5` (crypto-vault-lib), `repo-6` (common-logging-sdk).
- **`Company` (1 Node)**: `comp-1` (Wexa AI).

---

## 📌 STEP 7 — Key openCypher Queries Explained

### 🔹 Query A: Developer Profile (Normal 1-Hop Query)
```cypher
MATCH (dev:Developer {id: $devId})
OPTIONAL MATCH (dev)-[:HAS_SKILL]->(sk:Skill)
OPTIONAL MATCH (dev)-[:CONTRIBUTES_TO]->(repo:Repository)
OPTIONAL MATCH (dev)-[:WORKS_AT]->(comp:Company)
RETURN 
  dev.id AS id,
  dev.name AS name,
  dev.role AS role,
  collect(DISTINCT sk.name) AS skills,
  collect(DISTINCT repo.name) AS repositories,
  comp.name AS company
```

### 🔹 Query B: 2+ Hop Traversal (Incident Escalation)
```cypher
MATCH (dev:Developer)-[c:CONTRIBUTES_TO]->(depRepo:Repository)-[d:DEPENDS_ON*1..3]->(target:Repository {id: $targetRepoId})
RETURN DISTINCT
  dev.name AS developerName,
  dev.email AS email,
  c.role AS role,
  depRepo.name AS dependentRepo,
  target.name AS targetRepo
```

### 🔹 Query C: Variable-Length Transitive Blast Radius (Relationally Awkward Query)
```cypher
MATCH path = (downstream:Repository)-[:DEPENDS_ON*1..6]->(target:Repository {id: $repoId})
OPTIONAL MATCH (m:Developer)-[:CONTRIBUTES_TO {role: 'Lead Maintainer'}]->(downstream)
RETURN 
  downstream.id AS affectedRepoId,
  downstream.name AS affectedRepoName,
  downstream.language AS language,
  length(path) AS depth,
  m.name AS leadMaintainer,
  m.email AS contactEmail
ORDER BY depth ASC
```

---

## 📌 STEP 8 — Automatic Graph Layout Engine (`graph-utils.ts`)

In [`src/lib/graph-utils.ts`](file:///d:/wexa_task/src/lib/graph-utils.ts), we implement a Sugiyama-style automatic layout algorithm:

1. **Topological Rank Mapping**:
   - `Company` = Layer 0 (Top)
   - `Project` = Layer 1
   - `Repository` = Layer 2
   - `Technology` / `Skill` = Layer 3
   - `Developer` = Layer 4 (Bottom)
2. **Barycenter Crossing Minimization**:
   - For each layer, nodes are sorted horizontally based on the average X coordinates of connected neighbor nodes in adjacent layers (`barycenter score`).
3. **Coordinate Calculation**:
   - Positions each node card at `x = startX + index * 245` and `y = layer * 160`. Supports switching layout direction (`TB` vs `LR`) dynamically.

---

## 📌 STEP 9 — Complete Frontend User Journey

```text
User Opens App
  │
  ├── 1. Header pings /api/health → Displays "● CognoDB Connected" badge
  ├── 2. GraphCanvas requests /api/graph?labelFilter=ALL
  ├── 3. transformCypherToReactFlow processes raw records into Nodes & Edges
  ├── 4. Sugiyama layout assigns X/Y coordinates automatically
  ├── 5. React Flow renders 26 light-mode node cards and floating relationship pills
  │
User Interaction Options:
  ├── Press ⌘K → Opens CommandPalette modal → Selects entity → Centers canvas & selects node
  ├── Click Category (e.g. Developers) → Sidebar updates filter → Canvas re-renders sub-graph
  ├── Click Node (e.g. auth-core-service) → Selected node gets blue ring, edges animate blue, unrelated nodes dim to 45% opacity → NodeDetailDrawer opens on right
  ├── Click "Calculate Blast Radius" → Navigates to Blast Radius view → Displays depth breakdown (+1..+4)
  └── Click "Incidents" → Navigates to Incident Escalation view → Displays 3-hop maintainer chain
```

---

## 📌 STEP 10 — File-by-File Viva Table

| File Path | Primary Purpose | Key Export / Function | Interviewer Question | Ideal Answer |
|---|---|---|---|---|
| [`src/lib/neo4j.ts`](file:///d:/wexa_task/src/lib/neo4j.ts) | Server database driver singleton | `getDriver()`, `executeReadQuery()` | *"Why is `import 'server-only'` at the top?"* | Prevents database credentials from being bundled into client browser JavaScript. |
| [`src/lib/queries.ts`](file:///d:/wexa_task/src/lib/queries.ts) | Parameterized openCypher query layer | `calculateRepositoryBlastRadius()` | *"Explain the blast radius query syntax."* | Uses `-[:DEPENDS_ON*1..6]->` to match dynamic transitive dependency paths. |
| [`src/lib/graph-utils.ts`](file:///d:/wexa_task/src/lib/graph-utils.ts) | Sugiyama automatic layout algorithm | `transformCypherToReactFlow()` | *"How do you calculate node coordinates?"* | Assigns topological layer ranks and barycenter horizontal indices. |
| [`src/app/api/graph/route.ts`](file:///d:/wexa_task/src/app/api/graph/route.ts) | Graph visualizer topology controller | `GET(request)` | *"How does searching filter the graph?"* | Pass `labelFilter` and `searchQuery` parameters to the openCypher read query. |
| [`src/components/graph/GraphCanvas.tsx`](file:///d:/wexa_task/src/components/graph/GraphCanvas.tsx) | React Flow canvas visualizer | `GraphCanvas` | *"How does node selection dim unrelated nodes?"* | Computes `connectedNodeIds` set and sets `isDimmed: true` (45% opacity) on unrelated nodes. |
| [`src/components/search/CommandPalette.tsx`](file:///d:/wexa_task/src/components/search/CommandPalette.tsx) | Global search modal (`⌘K`) | `CommandPalette` | *"How is Ctrl+K keyboard shortcut handled?"* | A global `keydown` event listener toggles modal open state when `metaKey/ctrlKey + k` is pressed. |
| [`scripts/seed.ts`](file:///d:/wexa_task/scripts/seed.ts) | Database population script | `seedDatabase()` | *"Why do you use `UNWIND` in seed queries?"* | Batches array objects into a single transaction round-trip and uses `MERGE` for idempotency. |

---

## 📌 STEP 11 — Top Interview Q&A (English & Gujarati)

### Q1: *"Walk me through the architecture of TechGraph."*
- **English**:  
  > *"TechGraph uses a 3-tier architecture. On the frontend, React Flow 12 renders an interactive graph canvas with dynamic node highlighting and drawer inspection. In the middleware layer, Next.js Server API routes validate parameters with Zod and execute parameterized openCypher queries via the official `neo4j-driver`. On the database layer, CognoDB Cloud stores nodes and relationships with index-free adjacency pointers for fast $O(k)$ traversals."*
- **Gujarati**:  
  > *"TechGraph 3-tier architecture પર કામ કરે છે. Frontend માં Next.js 16 અને React Flow છે, Middleware માં Zod થી validate થતા Next.js Server API Routes છે જે `neo4j-driver` વડે જ્ઞાનાત્મક queries ચલાવે છે, અને Database તરીકે CognoDB Cloud છે જે openCypher dialect સપોર્ટ કરે છે."*

---

### Q2: *"Why did you use a Graph Database instead of PostgreSQL?"*
- **English**:  
  > *"In PostgreSQL, computing variable-length dependencies between software repositories requires complex recursive CTEs (`WITH RECURSIVE`) and multi-table `INNER JOIN`s. As the dataset grows, SQL scans table indexes repeatedly. CognoDB stores relationships as physical memory pointers. Graph pattern matching traverses edges in $O(k)$ time proportional to the subgraph, making blast-radius calculations instant."*
- **Gujarati**:  
  > *"PostgreSQL માં બહુ-સ્તરીય સબંધો શોધવા માટે ભારે recursive `JOIN`s અને CTEs વાપરવા પડે છે જે ડેટા વધતાં સ્લો થઈ જાય છે. CognoDB Graph DB માં દરેક સંબંધી ડેટા સીધો સેવ હોય છે, જેથી $O(k)$ સમયમાં ઝડપી પરિણામ મળે છે."*

---

### Q3: *"How do you prevent Cypher Injection attacks?"*
- **English**:  
  > *"Every query in `src/lib/queries.ts` passes parameter objects to `session.executeRead()`. User inputs are never string-concatenated into Cypher statements. Additionally, API routes sanitize all incoming route parameters using Zod schemas."*
- **Gujarati**:  
  > *"અમે Cypher Injection રોકવા માટે બધી queries ને 100% parameterized રાખી છે અને user input ને ડાયરેક્ટ string માં concatenate નથી કરતા. સાથે server સાઇડ Zod validation પણ મૂકેલું છે."*

---

## 📌 STEP 12 — 3-Minute Live Demo Sequence Script

1. **Step 1 — Overview & Header**:
   - *"Here is TechGraph running on Next.js 16 and CognoDB Cloud. Notice our sticky header with the live `● CognoDB Connected` health badge."*
2. **Step 2 — Interactive Graph Canvas**:
   - *"The visual centerpiece is an interactive openCypher topology graph. Nodes are automatically arranged in hierarchical layers using our Sugiyama layout algorithm."*
3. **Step 3 — Node Selection & Inspection**:
   - *"When I click `auth-core-service`, its connected edges animate blue, unrelated nodes dim to 45% opacity, and the right-side inspector drawer slides out with node attributes."*
4. **Step 4 — Command Palette Search (`⌘K`)**:
   - *"Pressing Ctrl+K opens our search modal. Typing 'CognoDB' filters matching entities and centers the graph upon selection."*
5. **Step 5 — Blast Radius Calculation**:
   - *"Clicking 'Blast Radius' executes Cypher Query C (`-[DEPENDS_ON*1..6]->`) to show downstream impacted repositories ordered by depth (+1, +2, +3, +4)."*
6. **Step 6 — On-Call Incident Escalation**:
   - *"Clicking 'Incidents' executes a 3-hop traversal to identify lead maintainers for immediate incident response."*

---

## 🏁 Quality & Verification Status

```text
✅ TypeScript Typecheck (`npx tsc --noEmit`): 0 Errors
✅ ESLint Code Quality (`npm run lint`): 0 Errors, 0 Warnings
✅ Next.js Production Build (`npm run build`): Static & Dynamic Routes Compiled
```
