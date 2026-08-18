# TechGraph — Engineering Knowledge Explorer

An enterprise, light-themed engineering intelligence platform & microservice dependency explorer built on **Next.js 16**, **TypeScript**, **React Flow**, **Tailwind CSS**, and **CognoDB Cloud** (openCypher dialect over the Bolt 5.4 protocol).

Inspired by modern developer platforms like **Linear**, **Vercel**, **GitHub**, **Raycast**, and **Stripe Dashboard**, TechGraph provides a calm, data-dense, light-mode visual interface to explore relationships between software engineers, technology stacks, Git repositories, business projects, and enterprise organizations.

---

## 🔗 Project Links & Deliverables

- **Hosted Demo Application**: `https://techgraph.vercel.app` *(Replace with your live Vercel URL)*
- **GitHub Repository**: `https://github.com/your-username/techgraph` *(Replace with your GitHub repository URL)*


---

## 🎯 Problem & Real-World Use Case

In modern engineering organizations, software systems consist of dozens of microservices, database clusters, open-source libraries, and distributed teams. When an incident occurs or a critical security vulnerability (e.g., Log4j / CVE) is discovered in an upstream library, answering the following questions is notoriously difficult:

1. **Blast Radius Analysis**: *"If `common-logging-sdk` fails, what downstream microservices and products break across variable depth levels?"*
2. **Multi-Hop On-Call Escalation**: *"Who are the lead maintainers of codebases 3 hops downstream from `crypto-vault-lib`?"*
3. **Talent Discovery & Skill Matching**: *"Which engineers possess expert skills in `openCypher Querying` and contribute to critical projects?"*

**TechGraph** solves these problems by modeling engineering data as a **Graph Database**. Instead of executing expensive relational SQL `JOIN` queries across multiple junction tables, TechGraph performs fast $O(k)$ openCypher graph pattern traversals.

---

## 🎨 UI/UX Design System & Architectural Highlights

TechGraph features a production-grade, light-themed visual architecture designed specifically for senior engineers, engineering managers, and technical evaluators:

- **Light Mode Only**: Primary background `#F8FAFC`, surface cards `#FFFFFF`, primary text `#0F172A`, secondary text `#475569`, muted text `#64748B`, borders `#E2E8F0`, primary accent `#2563EB`.
- **Command Palette (`⌘ K` / `Ctrl K`)**: Keyboard-driven global search modal to instantly find and inspect any developer, codebase, skill, project, or technology stack.
- **Topology Auto-Layout Engine**: Hierarchical Sugiyama-style algorithm in `src/lib/graph-utils.ts` (`Company` → `Project` → `Repository` → `Technology/Skill` → `Developer`) with barycenter horizontal ordering for edge crossing minimization.
- **Clean Relationship Edge Pills**: Subtle floating white labels (`IMPLEMENTS`, `USES_TECH`, `HAS_SKILL`, `WORKS_AT`, `CONTRIBUTES_TO`, `DEPENDS_ON`) with `#E2E8F0` border and dark text.
- **Interactive Highlighting & Dimming**: Selecting a node highlights connected paths in animated blue (`#2563EB`), dimming unrelated nodes to 45% opacity for instant visual clarity.
- **Node Inspector Drawer**: Slide-out 340px right-side panel displaying attribute key-value tables, connected entity badges, and graph traversal shortcuts.
- **Floating Controls & Minimap**: Compact canvas controls (Fit View, Reset, Top-Bottom / Left-Right direction toggle, Zoom) and light-mode minimap at bottom-right.
- **Microservice Blast Radius & Incident Escalation**: Transitive dependency impact flow breakdown (+1, +2, +3, +4 depth hops) and multi-step escalation timelines.

---

## 💡 Why a Graph Database? (Relational SQL vs. CognoDB)

*(Interview Explanation)*

> **1. Pointer Traversal vs. Exponential Table JOINs**  
> In a traditional Relational Database (RDBMS), connecting `Developers` $\leftrightarrow$ `Repositories` $\leftrightarrow$ `Dependencies` $\leftrightarrow$ `Technologies` $\leftrightarrow$ `Skills` requires creating 5+ junction tables (`developer_skills`, `repo_tech`, `repo_dependencies`, etc.).  
> Executing multi-hop queries in SQL requires nested `INNER JOIN` statements that compute massive Cartesian join products across tables.  
> In **CognoDB Cloud**, relationships are stored as direct physical memory pointers. Graph pattern traversals execute in **$O(k)$ time**, proportional only to the size of the connected subgraph, independent of total database size.

> **2. Variable-Length Dynamic Paths**  
> Querying transitive codebase dependencies of dynamic depth (`1..6` hops) is awkward and slow in SQL. It requires complex recursive Common Table Expressions (`WITH RECURSIVE`), which degrade exponentially as depth varies.  
> In **openCypher**, variable-length paths are expressed natively:
> ```cypher
> MATCH path = (downstream:Repository)-[:DEPENDS_ON*1..6]->(target:Repository {id: $repoId})
> ```

> **3. Dynamic Schema Evolution**  
> Tech stacks and team structures evolve rapidly. Introducing new relationships like `:REQUIRES_SKILL` or `:USES_TECH` in CognoDB requires **zero `ALTER TABLE` SQL schema migrations**.

---

## 📐 Graph Data Model

### Node Explanations (6 Node Types)
1. **`Developer`** *(Sky `#0284C7`)*: Individual software engineers, maintainers, and tech leads.
2. **`Skill`** *(Purple `#9333EA`)*: Engineering proficiencies or domain competencies (e.g., *openCypher Querying*, *React Server Components*).
3. **`Technology`** *(Emerald `#059669`)*: Frameworks, languages, databases, or cloud tools (e.g., *CognoDB Cloud*, *Next.js*, *Go*, *PostgreSQL*).
4. **`Project`** *(Amber `#D97706`)*: High-level product initiatives or platform modules (e.g., *TechGraph Explorer*, *Neural Query Engine*).
5. **`Repository`** *(Indigo `#4F46E5`)*: Git codebases containing source code (e.g., `techgraph-web`, `auth-core-service`).
6. **`Company`** *(Rose `#E11D48`)*: The enterprise organization owning projects and employing engineers (*Wexa AI*).

### Relationship Explanations (8 Typed Edges)
1. **`(Developer)-[:HAS_SKILL]->(Skill)`**: Maps engineer proficiencies (`proficiency`, `yearsOfExp`).
2. **`(Developer)-[:CONTRIBUTES_TO]->(Repository)`**: Maps code authorship & maintainership (`role`, `commitsCount`).
3. **`(Developer)-[:WORKS_AT]->(Company)`**: Maps employment and organizational membership (`title`, `joinedDate`).
4. **`(Company)-[:OWNS_PROJECT]->(Project)`**: Maps company project ownership (`department`).
5. **`(Repository)-[:IMPLEMENTS_PROJECT]->(Project)`**: Connects codebases to business projects (`isPrimary`).
6. **`(Repository)-[:USES_TECH]->(Technology)`**: Maps technology stack dependencies (`version`, `environment`).
7. **`(Technology)-[:REQUIRES_SKILL]->(Skill)`**: Maps tools to required operating knowledge (`importance`).
8. **`(Repository)-[:DEPENDS_ON]->(Repository)`**: Recursive microservice/library dependency tree (`dependencyType`, `criticality`).

### Entity & Relationship Properties Schema
- **`Developer`**: `{ id, name, email, role, experienceYears }`
- **`Skill`**: `{ id, name, category, description }`
- **`Technology`**: `{ id, name, type, ecosystem }`
- **`Project`**: `{ id, name, status, criticality }`
- **`Repository`**: `{ id, name, language, url, stars }`
- **`Company`**: `{ id, name, domain, industry }`

---

## 📊 Graph Diagram (GFM Mermaid)

```mermaid
graph TD
    classDef devStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef skillStyle fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8;
    classDef techStyle fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#047857;
    classDef projStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#b45309;
    classDef repoStyle fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#3730a3;
    classDef compStyle fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#be123c;

    Dev[("Developer<br/>(id, name, role, email)")]:::devStyle
    SkillNode[("Skill<br/>(id, name, category)")]:::skillStyle
    Tech[("Technology<br/>(id, name, type, ecosystem)")]:::techStyle
    Proj[("Project<br/>(id, name, status, criticality)")]:::projStyle
    Repo1[("Repository<br/>(id, name, language, url)")]:::repoStyle
    Repo2[("Repository (Upstream)<br/>(id, name, language)")]:::repoStyle
    Comp[("Company<br/>(id, name, domain, industry)")]:::compStyle

    Dev -->|HAS_SKILL {proficiency, yearsOfExp}| SkillNode
    Dev -->|CONTRIBUTES_TO {role, commitsCount}| Repo1
    Dev -->|WORKS_AT {title, joinedDate}| Comp

    Comp -->|OWNS_PROJECT {department}| Proj
    Repo1 -->|IMPLEMENTS_PROJECT {isPrimary}| Proj
    Repo1 -->|USES_TECH {version, environment}| Tech
    Tech -->|REQUIRES_SKILL {importance}| SkillNode

    Repo1 -->|DEPENDS_ON {dependencyType, criticality}| Repo2
    Repo2 -->|CONTRIBUTES_TO| Dev
```

---

## 🏗️ Architecture Overview

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

### Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, `@xyflow/react` (React Flow 12), Lucide React, Framer Motion
- **Backend**: Next.js Server API Routes, TypeScript, Zod parameter validation
- **Database**: CognoDB Cloud (openCypher dialect over Bolt 5.4 protocol)
- **Database Driver**: Official `neo4j-driver` (Node.js)

---

## ⚡ CognoDB Cloud Setup

1. **Sign Up**: Register a free account at [https://console.cognodb.com/signup](https://console.cognodb.com/signup) (No credit card required).
2. **Create Instance**: Provision a free (`c0`) database instance. It provisions in under 60 seconds.
3. **Copy Credentials**: Save your Bolt URI (`bolt+s://<instance-id>.databases.cognodb.cloud:7687`) and generated password for user `cognodb`.

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# CognoDB Cloud Environment Credentials (NEVER commit this file to Git)
NEO4J_URI=bolt+s://<instance-id>.databases.cognodb.cloud:7687
NEO4J_USER=cognodb
NEO4J_PASSWORD=<your-generated-cognodb-password>
```

---

## 📥 Installation & Running Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Database Connection
Test your CognoDB Cloud connection from the terminal:
```bash
npm run test:db
```

### 3. Seed CognoDB Cloud Database
Populate your database with the TechGraph dataset (26 Nodes, 43 Relationships):
```bash
npm run seed
```

### 4. Run Cypher Query Test Suite
Verify openCypher query executions:
```bash
npm run test:queries
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 Main Cypher Queries & Explanations

### 🔹 Query A: Normal Graph Query (Developer Profile)
* **Purpose**: Fetches a specific developer node along with direct 1-hop connections (skills, contributed repositories, company).
* **Cypher**:
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
* **Parameters**: `{ devId: "dev-1" }`

---

### 🔹 Query B: Multi-Hop Traversal (2+ Hops Incident Escalation)
* **Explicit Identification**: **REQUIRED 2+ HOP TRAVERSAL**
* **Purpose**: Performs a 3-hop traversal (`Developer -> CONTRIBUTES_TO -> DependentRepo -> DEPENDS_ON*1..3 -> TargetRepo`) to identify maintainers of codebases affected by an upstream core library failure.
* **Cypher**:
  ```cypher
  MATCH (dev:Developer)-[c:CONTRIBUTES_TO]->(depRepo:Repository)-[d:DEPENDS_ON*1..3]->(target:Repository {id: $targetRepoId})
  RETURN DISTINCT
    dev.name AS developerName,
    dev.email AS email,
    c.role AS role,
    depRepo.name AS dependentRepo,
    target.name AS targetRepo
  ```
* **Parameters**: `{ targetRepoId: "repo-5" }` (`crypto-vault-lib`)

---

### 🔹 Query C: Relationally Awkward Graph Query (Variable-Length Transitive Blast Radius)
* **Explicit Identification**: **RELATIONALLY AWKWARD QUERY**
* **Purpose**: Calculates complete downstream transitive blast radius across dynamic variable depths (`1..6` hops) when a core repository experiences an outage.
* **Cypher**:
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
* **Parameters**: `{ repoId: "repo-6" }` (`common-logging-sdk`)
* **Why Relational SQL Struggles With This**:
  In SQL, finding variable-length paths where depth is not known in advance requires writing complex recursive Common Table Expressions (`WITH RECURSIVE`). As the dependency graph grows deep, recursive SQL joins re-scan tables repeatedly, degrading exponentially ($O(N^k)$). In openCypher, graph pointer traversal operates via index-free adjacency in $O(k)$ time.

---

## 🔒 Explanation of Parameterized Queries

Every query in TechGraph uses explicit parameter maps:
```typescript
// 100% Parameterized execution — zero string concatenation
export async function calculateRepositoryBlastRadius(repoId: string) {
  const cypher = `
    MATCH path = (downstream:Repository)-[:DEPENDS_ON*1..6]->(target:Repository {id: $repoId})
    ...
  `;
  return await executeReadQuery(cypher, { repoId });
}
```
- **Security**: Completely eliminates Cypher Injection attacks by separating query logic from user input.
- **Performance**: Enables CognoDB to cache openCypher execution plans across repeated calls.

---

## 📁 Project Structure

```text
wexa_task/
├── .env.example                   # Environment variable template
├── .env.local                     # Local environment secrets (Git-ignored)
├── README.md                      # Comprehensive project documentation
├── package.json                   # Dependencies and npm scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── next.config.ts                 # Next.js configuration
├── scripts/
│   ├── seed.ts                    # Reproducible CognoDB seed loader script
│   ├── test-db-connection.ts      # Terminal connection diagnostic script
│   └── test-queries.ts            # CLI Cypher query verification runner
└── src/
    ├── app/
    │   ├── api/                   # Server-side API Controllers (Zod Validated)
    │   │   ├── blast-radius/      # Query C: Blast radius endpoint
    │   │   ├── developers/[id]/   # Query A: Developer profile endpoint
    │   │   ├── graph/             # Graph visualizer topology endpoint
    │   │   ├── health/            # CognoDB connection heartbeat endpoint
    │   │   ├── incidents/         # Query B: 2+ Hop escalation endpoint
    │   │   ├── projects/[id]/     # Project team matrix endpoint
    │   │   └── technologies/[id]/ # Technology ecosystem endpoint
    │   ├── globals.css            # Light design system CSS & graph grid tokens
    │   ├── layout.tsx             # Root HTML layout wrapper
    │   └── page.tsx               # Main interactive explorer dashboard
    ├── components/
    │   ├── graph/
    │   │   ├── CustomNode.tsx     # Custom light-mode React Flow node card
    │   │   ├── GraphCanvas.tsx    # React Flow canvas wrapper & auto-layout controls
    │   │   └── NodeDetailDrawer.tsx # Slide-out node attribute inspector
    │   ├── layout/
    │   │   ├── AppShell.tsx       # Motion-wrapped layout shell
    │   │   ├── Header.tsx         # Sticky 64px header, search trigger & health badge
    │   │   └── Sidebar.tsx        # Explorer sidebar & category counts
    │   ├── search/
    │   │   └── CommandPalette.tsx # Global Cmd+K / Ctrl+K search modal
    │   └── ui/
    │       ├── Badge.tsx          # Entity & health status badges
    │       ├── Button.tsx         # Accessible UI buttons
    │       ├── Card.tsx           # Clean surface card component
    │       ├── DatabaseErrorBanner.tsx # Offline warning banner
    │       ├── EntityDistributionChart.tsx # Graph entity breakdown chart
    │       ├── ErrorBoundary.tsx  # React UI error boundary
    │       └── Skeleton.tsx       # Loading pulse skeleton
    ├── lib/
    │   ├── api-response.ts        # Standardized API response helpers
    │   ├── graph-utils.ts         # Sugiyama hierarchical layout transformer
    │   ├── neo4j.ts               # Server-side Neo4j Driver singleton
    │   ├── queries.ts             # Parameterized Cypher query layer
    │   ├── utils.ts               # Tailwind class merger (`cn`)
    │   └── validations.ts         # Zod API validation schemas
    └── types/
        └── index.ts               # Domain TypeScript interfaces
```

---

## 🧪 Code Quality & Verification Status

```text
✅ TypeScript Typecheck (`npx tsc --noEmit`): 0 Errors
✅ ESLint Code Quality (`npm run lint`): 0 Errors, 0 Warnings
✅ Next.js Production Build (`npm run build`): Static & Dynamic Routes Compiled
```

---

## 📸 Screenshots & UI States

*(Place your application screenshots in `public/screenshots/`)*

1. **Interactive React Flow Graph Canvas**: Renders nodes, edges, floating relationship pills, toolbar, sidebar, and node detail drawer.
2. **Command Palette Search Modal**: Keyboard-driven quick search (`⌘ K` / `Ctrl K`) to find any developer, codebase, skill, or technology.
3. **Blast Radius Calculator**: Shows depth-ordered transitive dependency list (+1, +2, +3, +4) for selected codebase.
4. **Incident Escalation Explorer**: Displays 3-hop maintainer escalation chains for on-call engineers.

---

## 🔧 Troubleshooting & Common Issues

### 1. `CognoDB Unreachable` / Connection Timeout
- **Cause**: Invalid URI, password, or local firewall blocking port `7687`.
- **Solution**: Check `.env.local` parameters against your CognoDB Cloud console. Run `npm run test:db` to inspect detailed diagnostic logs.

### 2. Node Seed Script Notices `NEO4J_URI is using default placeholder`
- **Cause**: `.env.local` contains default placeholder values.
- **Solution**: Replace placeholders in `.env.local` with active CognoDB Cloud credentials and re-run `npm run seed`.

### 3. Blank Graph Canvas
- **Cause**: Search query or node filter excludes all graph nodes.
- **Solution**: Click "All Entities" in the left sidebar or clear the search input box.
