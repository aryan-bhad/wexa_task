import { NextResponse } from "next/server";
import { verifyDatabaseConnection } from "@/lib/neo4j";

/**
 * CognoDB Health & Connectivity Status API Route
 * 
 * GET /api/health
 * Returns status code 200 when CognoDB Cloud is reachable over Bolt protocol,
 * or status 503 Service Unavailable when the database is offline/unreachable.
 */
export async function GET() {
  const status = await verifyDatabaseConnection();

  if (status.connected) {
    return NextResponse.json(
      {
        status: "ONLINE",
        database: "CognoDB Cloud",
        protocol: "Bolt 5.4 (openCypher)",
        details: status.message,
        serverInfo: status.serverInfo,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      status: "UNREACHABLE",
      database: "CognoDB Cloud",
      error: status.message,
      recommendation: "Check NEO4J_URI and NEO4J_PASSWORD in .env.local or environment variables.",
      timestamp: new Date().toISOString(),
    },
    { status: 503 }
  );
}
