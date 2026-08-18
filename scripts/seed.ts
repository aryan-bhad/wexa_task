import neo4j, { Session } from "neo4j-driver";

/**
 * TechGraph — Engineering Knowledge Explorer
 * Phase 4: CognoDB Seed Data Loader Script
 * 
 * Populates CognoDB Cloud with a realistic, highly interconnected graph dataset.
 * Uses parameterized `UNWIND` Cypher queries for optimal performance and security.
 * 
 * Run with: `npm run seed`
 */

// 1. Dataset Definitions
const companies = [
  { id: "comp-1", name: "Wexa AI", domain: "wexa.ai", industry: "AI & Knowledge Graphs" },
];

const projects = [
  { id: "proj-1", name: "TechGraph Explorer", status: "Active", criticality: "CRITICAL" },
  { id: "proj-2", name: "Neural Query Engine", status: "Active", criticality: "HIGH" },
  { id: "proj-3", name: "Identity & Access Subsystem", status: "Active", criticality: "CRITICAL" },
];

const repositories = [
  { id: "repo-1", name: "techgraph-web", language: "TypeScript", url: "https://github.com/wexa/techgraph-web", stars: 142 },
  { id: "repo-2", name: "graph-query-api", language: "TypeScript", url: "https://github.com/wexa/graph-query-api", stars: 98 },
  { id: "repo-3", name: "cognodb-driver-wrapper", language: "TypeScript", url: "https://github.com/wexa/cognodb-driver-wrapper", stars: 56 },
  { id: "repo-4", name: "auth-core-service", language: "Go", url: "https://github.com/wexa/auth-core-service", stars: 210 },
  { id: "repo-5", name: "crypto-vault-lib", language: "Go", url: "https://github.com/wexa/crypto-vault-lib", stars: 87 },
  { id: "repo-6", name: "common-logging-sdk", language: "TypeScript", url: "https://github.com/wexa/common-logging-sdk", stars: 43 },
];

const technologies = [
  { id: "tech-1", name: "CognoDB Cloud", type: "Database", ecosystem: "openCypher" },
  { id: "tech-2", name: "Next.js App Router", type: "Framework", ecosystem: "React" },
  { id: "tech-3", name: "TypeScript", type: "Language", ecosystem: "Node.js" },
  { id: "tech-4", name: "Go", type: "Language", ecosystem: "Cloud Native" },
  { id: "tech-5", name: "PostgreSQL", type: "Database", ecosystem: "Relational" },
];

const skills = [
  { id: "sk-1", name: "openCypher Querying", category: "Database", description: "Graph traversal and pattern matching" },
  { id: "sk-2", name: "React Server Components", category: "Frontend", description: "Next.js SSR and client state" },
  { id: "sk-3", name: "Distributed Systems", category: "DevOps", description: "Microservice resiliency and fault tolerance" },
  { id: "sk-4", name: "Cryptography & Security", category: "Security", description: "TLS, token auth, and key vault management" },
  { id: "sk-5", name: "Go Systems Engineering", category: "Backend", description: "High concurrency microservice development" },
  { id: "sk-6", name: "Graph Data Modeling", category: "Database", description: "Designing node-edge ontologies" },
];

const developers = [
  { id: "dev-1", name: "Sarah Chen", email: "sarah@wexa.ai", role: "Principal Graph Architect", experienceYears: 8 },
  { id: "dev-2", name: "Alex Rivera", email: "alex@wexa.ai", role: "Senior Frontend Engineer", experienceYears: 6 },
  { id: "dev-3", name: "Marcus Vance", email: "marcus@wexa.ai", role: "Staff Backend Engineer", experienceYears: 10 },
  { id: "dev-4", name: "Elena Rostova", email: "elena@wexa.ai", role: "Security & Infrastructure Lead", experienceYears: 9 },
  { id: "dev-5", name: "David Kim", email: "david@wexa.ai", role: "Full Stack Engineer", experienceYears: 4 },
];

// Relationships
const worksAt = [
  { devId: "dev-1", compId: "comp-1", title: "Principal Architect", joinedDate: "2022-01-15" },
  { devId: "dev-2", compId: "comp-1", title: "Senior UI Engineer", joinedDate: "2022-06-01" },
  { devId: "dev-3", compId: "comp-1", title: "Staff Backend Engineer", joinedDate: "2021-11-10" },
  { devId: "dev-4", compId: "comp-1", title: "Security Lead", joinedDate: "2020-03-20" },
  { devId: "dev-5", compId: "comp-1", title: "Full Stack Engineer", joinedDate: "2023-02-01" },
];

const ownsProject = [
  { compId: "comp-1", projId: "proj-1", department: "Core Engineering" },
  { compId: "comp-1", projId: "proj-2", department: "AI Research" },
  { compId: "comp-1", projId: "proj-3", department: "Infrastructure & Security" },
];

const implementsProject = [
  { repoId: "repo-1", projId: "proj-1", isPrimary: true },
  { repoId: "repo-2", projId: "proj-1", isPrimary: false },
  { repoId: "repo-3", projId: "proj-2", isPrimary: true },
  { repoId: "repo-4", projId: "proj-3", isPrimary: true },
  { repoId: "repo-5", projId: "proj-3", isPrimary: false },
  { repoId: "repo-6", projId: "proj-1", isPrimary: false },
];

const contributesTo = [
  { devId: "dev-1", repoId: "repo-1", role: "Lead Maintainer", commitsCount: 340 },
  { devId: "dev-1", repoId: "repo-2", role: "Contributor", commitsCount: 120 },
  { devId: "dev-2", repoId: "repo-1", role: "Lead Maintainer", commitsCount: 280 },
  { devId: "dev-3", repoId: "repo-2", role: "Lead Maintainer", commitsCount: 450 },
  { devId: "dev-3", repoId: "repo-3", role: "Lead Maintainer", commitsCount: 190 },
  { devId: "dev-4", repoId: "repo-4", role: "Lead Maintainer", commitsCount: 510 },
  { devId: "dev-4", repoId: "repo-5", role: "Lead Maintainer", commitsCount: 230 },
  { devId: "dev-5", repoId: "repo-6", role: "Lead Maintainer", commitsCount: 110 },
  { devId: "dev-5", repoId: "repo-1", role: "Contributor", commitsCount: 45 },
];

const hasSkill = [
  { devId: "dev-1", skillId: "sk-1", proficiency: "Expert", yearsOfExp: 6 },
  { devId: "dev-1", skillId: "sk-6", proficiency: "Expert", yearsOfExp: 7 },
  { devId: "dev-2", skillId: "sk-2", proficiency: "Expert", yearsOfExp: 5 },
  { devId: "dev-3", skillId: "sk-1", proficiency: "Expert", yearsOfExp: 5 },
  { devId: "dev-3", skillId: "sk-5", proficiency: "Intermediate", yearsOfExp: 4 },
  { devId: "dev-4", skillId: "sk-4", proficiency: "Expert", yearsOfExp: 8 },
  { devId: "dev-4", skillId: "sk-5", proficiency: "Expert", yearsOfExp: 6 },
  { devId: "dev-5", skillId: "sk-2", proficiency: "Intermediate", yearsOfExp: 3 },
  { devId: "dev-5", skillId: "sk-3", proficiency: "Beginner", yearsOfExp: 1 },
];

const usesTech = [
  { repoId: "repo-1", techId: "tech-2", version: "15.0", environment: "Production" },
  { repoId: "repo-1", techId: "tech-3", version: "5.4", environment: "Production" },
  { repoId: "repo-2", techId: "tech-1", version: "Bolt 5.4", environment: "Production" },
  { repoId: "repo-2", techId: "tech-3", version: "5.4", environment: "Production" },
  { repoId: "repo-3", techId: "tech-1", version: "Bolt 5.4", environment: "Production" },
  { repoId: "repo-4", techId: "tech-4", version: "1.22", environment: "Production" },
  { repoId: "repo-4", techId: "tech-5", version: "16.1", environment: "Production" },
  { repoId: "repo-5", techId: "tech-4", version: "1.22", environment: "Production" },
];

const requiresSkill = [
  { techId: "tech-1", skillId: "sk-1", importance: "Core" },
  { techId: "tech-1", skillId: "sk-6", importance: "Core" },
  { techId: "tech-2", skillId: "sk-2", importance: "Core" },
  { techId: "tech-4", skillId: "sk-5", importance: "Core" },
  { techId: "tech-5", skillId: "sk-3", importance: "Optional" },
];

// Transitive Repository Dependencies Chain (Recursive DEPENDS_ON)
// techgraph-web -> graph-query-api -> cognodb-driver-wrapper -> common-logging-sdk
// techgraph-web -> graph-query-api -> auth-core-service -> crypto-vault-lib -> common-logging-sdk
const repositoryDependencies = [
  { sourceId: "repo-1", targetId: "repo-2", dependencyType: "Runtime", criticality: "CRITICAL" },
  { sourceId: "repo-2", targetId: "repo-3", dependencyType: "Runtime", criticality: "HIGH" },
  { sourceId: "repo-2", targetId: "repo-4", dependencyType: "Runtime", criticality: "CRITICAL" },
  { sourceId: "repo-4", targetId: "repo-5", dependencyType: "Runtime", criticality: "CRITICAL" },
  { sourceId: "repo-5", targetId: "repo-6", dependencyType: "Build", criticality: "MEDIUM" },
  { sourceId: "repo-3", targetId: "repo-6", dependencyType: "Build", criticality: "MEDIUM" },
];

// 2. Database Seeding Execution Function
async function seedDatabase() {
  console.log("=================================================");
  console.log("🌱 TechGraph CognoDB Seeding Pipeline");
  console.log("=================================================");

  const uri = process.env.NEO4J_URI || "bolt+s://placeholder.databases.cognodb.cloud:7687";
  const user = process.env.NEO4J_USER || "cognodb";
  const password = process.env.NEO4J_PASSWORD || "placeholder-password";

  if (uri.includes("placeholder")) {
    console.warn("\n⚠️  Notice: NEO4J_URI is using default placeholder.");
    console.warn("To seed your live CognoDB Cloud instance, set real credentials in .env.local\n");
    process.exit(0);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session: Session = driver.session();

  try {
    console.log("1️⃣  Clearing existing graph data safely...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("2️⃣  Creating Database Constraints & Indexes...");
    const constraints = [
      "CREATE CONSTRAINT dev_id_unique IF NOT EXISTS FOR (d:Developer) REQUIRE d.id IS UNIQUE",
      "CREATE CONSTRAINT comp_id_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE",
      "CREATE CONSTRAINT proj_id_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE",
      "CREATE CONSTRAINT repo_id_unique IF NOT EXISTS FOR (r:Repository) REQUIRE r.id IS UNIQUE",
      "CREATE CONSTRAINT tech_id_unique IF NOT EXISTS FOR (t:Technology) REQUIRE t.id IS UNIQUE",
      "CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE",
    ];    for (const cypherConstraint of constraints) {
      try {
        await session.run(cypherConstraint);
      } catch {
        // CognoDB / openCypher gracefully ignores if constraints are already present
      }
    }
    console.log("3️⃣  Seeding Nodes via Parameterized UNWIND Batches...");

    // Seed Companies
    await session.run(
      `UNWIND $batch AS row CREATE (:Company {id: row.id, name: row.name, domain: row.domain, industry: row.industry})`,
      { batch: companies }
    );

    // Seed Projects
    await session.run(
      `UNWIND $batch AS row CREATE (:Project {id: row.id, name: row.name, status: row.status, criticality: row.criticality})`,
      { batch: projects }
    );

    // Seed Repositories
    await session.run(
      `UNWIND $batch AS row CREATE (:Repository {id: row.id, name: row.name, language: row.language, url: row.url, stars: row.stars})`,
      { batch: repositories }
    );

    // Seed Technologies
    await session.run(
      `UNWIND $batch AS row CREATE (:Technology {id: row.id, name: row.name, type: row.type, ecosystem: row.ecosystem})`,
      { batch: technologies }
    );

    // Seed Skills
    await session.run(
      `UNWIND $batch AS row CREATE (:Skill {id: row.id, name: row.name, category: row.category, description: row.description})`,
      { batch: skills }
    );

    // Seed Developers
    await session.run(
      `UNWIND $batch AS row CREATE (:Developer {id: row.id, name: row.name, email: row.email, role: row.role, experienceYears: row.experienceYears})`,
      { batch: developers }
    );

    console.log("4️⃣  Seeding Typed Relationships via Parameterized UNWIND...");

    // Developer WORKS_AT Company
    await session.run(
      `UNWIND $batch AS row MATCH (dev:Developer {id: row.devId}), (comp:Company {id: row.compId}) CREATE (dev)-[:WORKS_AT {title: row.title, joinedDate: row.joinedDate}]->(comp)`,
      { batch: worksAt }
    );

    // Company OWNS_PROJECT Project
    await session.run(
      `UNWIND $batch AS row MATCH (comp:Company {id: row.compId}), (proj:Project {id: row.projId}) CREATE (comp)-[:OWNS_PROJECT {department: row.department}]->(proj)`,
      { batch: ownsProject }
    );

    // Repository IMPLEMENTS_PROJECT Project
    await session.run(
      `UNWIND $batch AS row MATCH (repo:Repository {id: row.repoId}), (proj:Project {id: row.projId}) CREATE (repo)-[:IMPLEMENTS_PROJECT {isPrimary: row.isPrimary}]->(proj)`,
      { batch: implementsProject }
    );

    // Developer CONTRIBUTES_TO Repository
    await session.run(
      `UNWIND $batch AS row MATCH (dev:Developer {id: row.devId}), (repo:Repository {id: row.repoId}) CREATE (dev)-[:CONTRIBUTES_TO {role: row.role, commitsCount: row.commitsCount}]->(repo)`,
      { batch: contributesTo }
    );

    // Developer HAS_SKILL Skill
    await session.run(
      `UNWIND $batch AS row MATCH (dev:Developer {id: row.devId}), (sk:Skill {id: row.skillId}) CREATE (dev)-[:HAS_SKILL {proficiency: row.proficiency, yearsOfExp: row.yearsOfExp}]->(sk)`,
      { batch: hasSkill }
    );

    // Repository USES_TECH Technology
    await session.run(
      `UNWIND $batch AS row MATCH (repo:Repository {id: row.repoId}), (tech:Technology {id: row.techId}) CREATE (repo)-[:USES_TECH {version: row.version, environment: row.environment}]->(tech)`,
      { batch: usesTech }
    );

    // Technology REQUIRES_SKILL Skill
    await session.run(
      `UNWIND $batch AS row MATCH (tech:Technology {id: row.techId}), (sk:Skill {id: row.skillId}) CREATE (tech)-[:REQUIRES_SKILL {importance: row.importance}]->(sk)`,
      { batch: requiresSkill }
    );

    // Repository DEPENDS_ON Repository (Recursive Codebase Dependencies)
    await session.run(
      `UNWIND $batch AS row MATCH (source:Repository {id: row.sourceId}), (target:Repository {id: row.targetId}) CREATE (source)-[:DEPENDS_ON {dependencyType: row.dependencyType, criticality: row.criticality}]->(target)`,
      { batch: repositoryDependencies }
    );

    console.log("5️⃣  Verifying Graph Node & Edge Counts...");
    const nodeCountRes = await session.run("MATCH (n) RETURN count(n) AS nodeCount");
    const edgeCountRes = await session.run("MATCH ()-[r]->() RETURN count(r) AS edgeCount");

    const totalNodes = nodeCountRes.records[0].get("nodeCount").toNumber();
    const totalEdges = edgeCountRes.records[0].get("edgeCount").toNumber();

    console.log("\n=================================================");
    console.log("🎉 Seed Operation Completed Successfully!");
    console.log(`📊 Total Nodes Created: ${totalNodes}`);
    console.log(`🔗 Total Relationships Created: ${totalEdges}`);
    console.log("=================================================");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("\n❌ [ERROR] Seed Script Failed:", errorMsg);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
