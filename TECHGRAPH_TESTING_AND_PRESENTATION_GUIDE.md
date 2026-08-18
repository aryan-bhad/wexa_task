# TechGraph — Complete Application Testing & Company Presentation Guide

This guide contains the complete **Application Testing & Presentation Guide** for **TechGraph — Engineering Knowledge Explorer**. You can view this document, print it, or convert it directly to PDF.

---

## 📌 Quick Reference Card

| Time | Presentation Section | Feature to Show | Key Talking Point |
|---|---|---|---|
| **0:00 - 0:30** | Opening Pitch | Header & Canvas | Purpose of TechGraph & CognoDB connection |
| **0:30 - 1:00** | Graph Canvas | Nodes, Edges & Controls | Sugiyama auto-layout algorithm (`graph-utils.ts`) |
| **1:00 - 1:30** | Node Selection | Click `auth-core-service` | Active blue highlight, edge animation, 45% opacity dimming |
| **1:30 - 2:00** | Command Palette | Press `⌘K` / `Ctrl+K` | Real-time keyboard navigation modal |
| **2:00 - 2:30** | Blast Radius | Blast Radius Tab | Query C dynamic dynamic-depth Cypher traversal ($O(k)$ vs SQL $O(N^k)$) |
| **2:30 - 3:00** | Incidents & Wrap-up | Incidents Tab | Query B 3-hop maintainer escalation path & conclusion |

---

# 🧪 PART 1: Step-by-Step Application Testing Guide

Run these steps in order to verify 100% of the application functionality.

---

## Phase A: Automated Terminal Testing Commands

Run the following commands in your terminal inside `d:\wexa_task`:

### Step 1: Test CognoDB Cloud Connection
```bash
npm run test:db
```
- **What it checks**: Validates TLS Bolt connection to CognoDB Cloud.
- **Expected Result**: `Successfully connected to CognoDB Cloud!`

### Step 2: Seed Database
```bash
npm run seed
```
- **What it checks**: Populates 26 Nodes and 43 Relationships into CognoDB Cloud using parameterized `UNWIND` batches.
- **Expected Result**: Success confirmation listing created graph entities.

### Step 3: Run Cypher Query Verification
```bash
npm run test:queries
```
- **What it checks**: Executes Query A (Developer Profile), Query B (3-Hop Escalation), and Query C (Dynamic Blast Radius).
- **Expected Result**: Displays formatted JSON result payloads.

### Step 4: Verify TypeScript & ESLint Quality
```bash
npx tsc --noEmit
npm run lint
npm run build
```
- **Expected Result**: **0 TypeScript errors**, **0 ESLint warnings**, and a successful Next.js build.

---

## Phase B: Manual Browser Testing Checklist

Start the local server:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser and check all 7 items:

### 1. Sticky Header & CognoDB Status Indicator
- [x] Verify sticky 64px header displaying TechGraph logo.
- [x] Check the green **`● CognoDB Connected`** status badge on the right.
- [x] Click the **Refresh** button on the right to re-ping `/api/health`.

### 2. Command Palette Search (`⌘ K` / `Ctrl K`)
- [x] Press **`⌘ K`** (Mac) or **`Ctrl K`** (Windows) on keyboard.
- [x] Type search query `React` or `Sarah`.
- [x] Use `↑` and `↓` arrow keys to highlight results.
- [x] Press `Enter` — modal closes, canvas centers, and selected node opens in the inspector drawer.

### 3. Sidebar Category Filters
- [x] Click **`Developers (5)`** — canvas displays developer nodes.
- [x] Click **`Repositories (6)`** — canvas displays repository nodes.
- [x] Click **`All Entities (26)`** — canvas restores full topology graph.

### 4. Topology Canvas Interactions
- [x] Click any node card (e.g. `auth-core-service`).
- [x] **Node Ring**: Node receives solid blue ring (`#2563EB`).
- [x] **Edge Flow**: Connected edges animate in blue.
- [x] **Dimming**: Unrelated graph nodes dim to 45% opacity.
- [x] Canvas Toolbar:
  - Click **`Fit`** → Centers all graph nodes.
  - Click **`Reset`** → Resets zoom and clears selection.
  - Click **`TB / LR`** → Toggles vertical (Top-Bottom) vs horizontal (Left-Right) layout.

### 5. Node Inspector Drawer (Right Panel)
- [x] Click node `Sarah Chen`.
- [x] Check 340px right panel opens displaying node attribute table.
- [x] Check connected relationship badges (`HAS_SKILL`, `CONTRIBUTES_TO`, `WORKS_AT`).
- [x] Click `X` to close drawer.

### 6. Blast Radius Calculator Page
- [x] Click **`Blast Radius`** tab in header or sidebar.
- [x] Select target repository `common-logging-sdk`.
- [x] Verify depth breakdown (+1 Direct, +2..+4 Transitive Hops).
- [x] Verify affected repository names, languages, and lead maintainer contact emails.

### 7. Incident Escalation Chain Page
- [x] Click **`Incidents`** tab in header or sidebar.
- [x] Select target library `crypto-vault-lib`.
- [x] Verify 3-hop maintainer escalation timeline path (`Developer → CONTRIBUTES_TO → DependentRepo → DEPENDS_ON → Target`).

---

# 🎥 PART 2: Company Presentation Script & Live Demo Guide

---

## Step 1: The Opening Pitch (30 Seconds)

**Action**: Open browser on `http://localhost:3000`.

**English Script**:
> *"Good morning! Today I am presenting **TechGraph — Engineering Knowledge Explorer**.  
> In modern microservice architectures, when a core library or shared database crashes, figuring out which services break and who to call takes hours.  
> TechGraph models an entire engineering organization—developers, codebases, skills, and tools—in a **CognoDB Cloud openCypher Graph Database**.  
> On top of this, I built a Next.js 16 and React Flow frontend with automatic topology layout, a Command Palette search, a Blast Radius calculator, and a 3-hop Incident Escalation tool."*

**Gujarati Script**:
> *"નમસ્તે! આજે હું **TechGraph — Engineering Knowledge Explorer** બતાવી રહ્યો છું.  
> જ્યારે મોટો microservice architecture હોય અને કોઈ મહત્વની library ક્રેશ થાય, ત્યારે કઈ કઈ services બંધ થશે અને કયા engineer ને ઓન-કોલ alert કરવા એ શોધવું અઘરું છે.  
> TechGraph આ ડેટા ને **CognoDB Cloud openCypher Graph Database** માં સ્ટોર કરે છે. Frontend માં મેં Next.js 16 અને React Flow વાપરીને એક ઉત્કૃષ્ટ interactive graph dashboard બનાવ્યો છે."*

---

## Step 2: Show Interactive Graph Canvas & Auto-Layout

**Action**: Point to green `● CognoDB Connected` badge, click `TB / LR` layout direction toggle.

**Speaking Script**:
> *"Here is our topology canvas. Notice our green live status badge showing our active connection to CognoDB Cloud over encrypted Bolt protocol.  
> Nodes are automatically positioned using a custom Sugiyama hierarchical layout algorithm in `graph-utils.ts`. It categorizes entities into layers—Company, Project, Repository, Technology, Skill, Developer—and applies barycenter ordering to minimize crossing lines."*

---

## Step 3: Show Node Selection & Highlighting

**Action**: Click node `auth-core-service`.

**Speaking Script**:
> *"When I click `auth-core-service`, three things happen instantly:  
> 1. The selected node card receives an active blue highlight.  
> 2. Connected relationship edges animate in blue.  
> 3. Unrelated nodes dim to 45% opacity for clear visual focus.  
> On the right, our 340px Node Inspector drawer opens, displaying key-value properties and connected graph entities."*

---

## Step 4: Demonstrate Command Palette Search (`⌘ K` / `Ctrl K`)

**Action**: Press `Ctrl + K` (or `⌘ + K`), type `React`, press `Enter`.

**Speaking Script**:
> *"Engineers can search across all entities using our keyboard-driven Command Palette (`⌘K` / `Ctrl+K`). Typing 'React' filters matching nodes in real-time, and pressing Enter instantly focuses and selects the node on our canvas."*

---

## Step 5: Demonstrate Blast Radius Calculator (Query C)

**Action**: Click **`Blast Radius`** tab. Select `common-logging-sdk`.

**Speaking Script**:
> *"Next is our Blast Radius Calculator. Suppose `common-logging-sdk` experiences a critical outage.  
> Under the hood, this executes a dynamic variable-length Cypher query: `MATCH path = (downstream:Repository)-[:DEPENDS_ON*1..6]->(target:Repository {id: $repoId})`.  
> In traditional SQL, finding dynamic dynamic-depth dependencies requires heavy recursive `WITH RECURSIVE` CTEs that scale at $O(N^k)$. In CognoDB openCypher, memory pointers traverse in $O(k)$ time, displaying direct (+1 hop) and transitive (+2..+4 hop) impacted codebases along with lead maintainer contacts in milliseconds."*

---

## Step 6: Demonstrate On-Call Incident Escalation (Query B)

**Action**: Click **`Incidents`** tab. Select `crypto-vault-lib`.

**Speaking Script**:
> *"Finally, here is our Incident Escalation Explorer. When an incident hits a core component like `crypto-vault-lib`, this tool runs a 3-hop graph traversal (`Developer → CONTRIBUTES_TO → DependentRepo → DEPENDS_ON → TargetRepo`).  
> It instantly identifies the exact lead engineers responsible for downstream services so on-call teams can escalate incidents accurately without guesswork."*

---

## Step 7: Conclude the Presentation

**Speaking Script**:
> *"In summary, TechGraph combines the speed of CognoDB Cloud openCypher graph traversals with Next.js 16 and React Flow to turn complex engineering metadata into actionable intelligence.  
> The codebase is fully type-checked with TypeScript (`0 errors`), verified with ESLint (`0 warnings`), and compiles cleanly.  
> I would be happy to answer any questions or walk through specific code files!"*

---

# 🎯 PART 3: Evaluator Q&A Cheat Sheet

### Q1: *"Why use CognoDB Cloud openCypher over PostgreSQL?"*
- **Answer**: *"In PostgreSQL, computing variable-length dependencies between software repositories requires complex recursive CTEs (`WITH RECURSIVE`) and multi-table `INNER JOIN`s. As the dataset grows, SQL scans table indexes repeatedly. CognoDB stores relationships as physical memory pointers (Index-Free Adjacency). Graph pattern matching traverses edges in $O(k)$ time proportional to the subgraph, making blast-radius calculations instant."*

### Q2: *"How do you prevent Cypher Injection attacks?"*
- **Answer**: *"Every query in `src/lib/queries.ts` passes parameter objects to `session.executeRead()`. User inputs are never string-concatenated into Cypher statements. Additionally, API routes sanitize all incoming route parameters using Zod schemas."*

### Q3: *"How is automatic layout calculated?"*
- **Answer**: *"In `src/lib/graph-utils.ts`, `transformCypherToReactFlow` categorizes nodes into 5 topological ranks (`Company: 0` down to `Developer: 4`). Nodes in each layer are sorted based on their average neighbor position (barycenter heuristic) before computing exact $(x, y)$ canvas coordinates."*
