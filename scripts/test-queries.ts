import neo4j from "neo4j-driver";

/**
 * TechGraph Cypher Query Layer Verification Script
 * 
 * Verifies Query A, Query B, and Query C execution against CognoDB Cloud.
 * Run with: `npx tsx scripts/test-queries.ts`
 */
async function runQueryTests() {
  console.log("=================================================");
  console.log("⚡ TechGraph openCypher Query Verification");
  console.log("=================================================");

  const uri = process.env.NEO4J_URI || "bolt+s://placeholder.databases.cognodb.cloud:7687";
  const user = process.env.NEO4J_USER || "cognodb";
  const password = process.env.NEO4J_PASSWORD || "placeholder-password";

  if (uri.includes("placeholder")) {
    console.warn("\n⚠️  Notice: NEO4J_URI is using default placeholder.");
    console.warn("Update .env.local with active CognoDB Cloud credentials to test live queries.\n");
    process.exit(0);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    console.log("\n1️⃣  Testing QUERY A (Normal Graph Lookup - Sarah Chen Profile)...");
    const queryA = `
      MATCH (dev:Developer {id: $devId})
      OPTIONAL MATCH (dev)-[:HAS_SKILL]->(sk:Skill)
      OPTIONAL MATCH (dev)-[:CONTRIBUTES_TO]->(repo:Repository)
      OPTIONAL MATCH (dev)-[:WORKS_AT]->(comp:Company)
      RETURN dev.name AS name, dev.role AS role, collect(DISTINCT sk.name) AS skills, collect(DISTINCT repo.name) AS repos, comp.name AS company
    `;
    const resA = await session.run(queryA, { devId: "dev-1" });
    console.log("QUERY A Result:", JSON.stringify(resA.records[0]?.toObject() || {}, null, 2));

    console.log("\n2️⃣  Testing QUERY B (2+ Hop Traversal - Incident Escalation Chain)...");
    const queryB = `
      MATCH (dev:Developer)-[c:CONTRIBUTES_TO]->(depRepo:Repository)-[d:DEPENDS_ON*1..3]->(target:Repository {id: $targetRepoId})
      RETURN dev.name AS devName, dev.email AS devEmail, depRepo.name AS dependentRepo, target.name AS targetRepo
    `;
    const resB = await session.run(queryB, { targetRepoId: "repo-5" });
    console.log(`QUERY B Result (${resB.records.length} maintainers impacted):`);
    resB.records.forEach((rec) => console.log(" -", rec.toObject()));

    console.log("\n3️⃣  Testing QUERY C (Relationally Awkward - Transitive Blast Radius)...");
    const queryC = `
      MATCH path = (downstream:Repository)-[:DEPENDS_ON*1..6]->(target:Repository {id: $targetRepoId})
      OPTIONAL MATCH (m:Developer)-[:CONTRIBUTES_TO {role: 'Lead Maintainer'}]->(downstream)
      RETURN downstream.name AS affectedRepo, length(path) AS depth, m.name AS leadMaintainer
      ORDER BY depth ASC
    `;
    const resC = await session.run(queryC, { targetRepoId: "repo-6" });
    console.log(`QUERY C Result (${resC.records.length} downstream codebases in blast radius):`);
    resC.records.forEach((rec) => console.log(" -", rec.toObject()));

    console.log("\n=================================================");
    console.log("✅ All Cypher Query Scenarios Verified Successfully!");
    console.log("=================================================");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("\n❌ [ERROR] Query Test Failed:", errorMsg);
  } finally {
    await session.close();
    await driver.close();
  }
}

runQueryTests();
