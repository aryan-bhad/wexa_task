import neo4j from "neo4j-driver";

/**
 * Standalone CognoDB Connection Verification Script
 * 
 * Run with: `npx tsx scripts/test-db-connection.ts`
 */
async function runDiagnostic() {
  console.log("=================================================");
  console.log("🔍 CognoDB Cloud Connection Diagnostic");
  console.log("=================================================");

  const uri = process.env.NEO4J_URI || "bolt+s://placeholder.databases.cognodb.cloud:7687";
  const user = process.env.NEO4J_USER || "cognodb";
  const password = process.env.NEO4J_PASSWORD || "placeholder-password";

  console.log(`Connecting to: ${uri}`);
  console.log(`User: ${user}`);
  console.log(`Password: ${password ? "******** (Loaded)" : "MISSING"}`);

  if (uri.includes("placeholder")) {
    console.warn("\n⚠️  Notice: Using placeholder environment variables.");
    console.warn("Please update .env.local with your live CognoDB Cloud credentials to test against active database.\n");
    process.exit(0);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    const start = Date.now();
    const result = await session.run("RETURN 1 AS status, 'CognoDB Online' AS msg, timestamp() AS ts");
    const duration = Date.now() - start;

    const record = result.records[0];
    console.log("\n✅ [SUCCESS] Connection established successfully!");
    console.log(`Message: ${record.get("msg")}`);
    console.log(`Latency: ${duration}ms`);
    console.log(`Timestamp: ${new Date(record.get("ts").toNumber()).toISOString()}`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("\n❌ [ERROR] Could not connect to CognoDB Cloud:");
    console.error(errorMsg);
  } finally {
    await session.close();
    await driver.close();
    console.log("=================================================");
  }
}

runDiagnostic();
