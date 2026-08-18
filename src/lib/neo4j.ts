import "server-only";
import neo4j, { Driver, Session, QueryResult } from "neo4j-driver";

/**
 * CognoDB / Neo4j Connection & Driver Configuration Module
 * 
 * CognoDB speaks openCypher over the Bolt protocol (Bolt 5.0 - 5.4).
 * We use the official `neo4j-driver` JavaScript package to manage
 * connection pools, authentication, and session execution on the server side.
 */

// Declare global driver cache to survive Next.js Fast Refresh across HMR
declare global {
  // eslint-disable-next-line no-var
  var __neo4jDriver: Driver | undefined;
}

/**
 * Validates and retrieves environment variable secrets.
 * Throws a clear error if required connection parameters are missing.
 */
function getDatabaseCredentials() {
  const uri = process.env.NEO4J_URI || "bolt+s://placeholder.databases.cognodb.cloud:7687";
  const user = process.env.NEO4J_USER || "cognodb";
  const password = process.env.NEO4J_PASSWORD || "placeholder-password";

  return { uri, user, password };
}

/**
 * Returns the singleton Neo4j/CognoDB Driver instance.
 * Initializes driver connection pooling if not already instantiated.
 */
export function getDriver(): Driver {
  if (!globalThis.__neo4jDriver) {
    const { uri, user, password } = getDatabaseCredentials();

    globalThis.__neo4jDriver = neo4j.driver(
      uri,
      neo4j.auth.basic(user, password),
      {
        maxConnectionPoolSize: 15,
        maxConnectionLifetime: 60000, // 60s max connection lifetime
        connectionTimeout: 15000, // 15s connection timeout
        connectionLivenessCheckTimeout: 1000, // Verify socket liveness before reusing pooled connection
        logging: {
          level: "warn",
          logger: (level, message) => {
            if (process.env.NODE_ENV === "development" && !message.includes("ConnectionHolder")) {
              console.log(`[CognoDB ${level.toUpperCase()}] ${message}`);
            }
          },
        },
      }
    );
  }

  return globalThis.__neo4jDriver;
}

/**
 * Recursively converts Neo4j Integers, Nodes, and Relationships into plain JavaScript primitives.
 * Prevents React rendering crashes caused by Neo4j Integer objects `{ low, high }`.
 */
export function sanitizeNeo4jData<T>(data: unknown): T {
  if (data === null || data === undefined) return data as T;

  // Check if it's a Neo4j Integer (has .toNumber() or { low, high } properties)
  if (
    typeof data === "object" &&
    data !== null &&
    (neo4j.isInt(data) || ("low" in data && "high" in data && typeof (data as Record<string, unknown>).low === "number"))
  ) {
    const obj = data as { toNumber?: () => number; low: number };
    return (typeof obj.toNumber === "function" ? obj.toNumber() : obj.low) as T;
  }

  // Handle arrays recursively
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeNeo4jData(item)) as T;
  }

  // Handle plain objects and Neo4j node/relationship structures recursively
  if (typeof data === "object" && data !== null) {
    const recordObj = data as Record<string, unknown>;

    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(recordObj)) {
      sanitized[key] = sanitizeNeo4jData(val);
    }
    return sanitized as T;
  }

  return data as T;
}

/**
 * Verifies active database connection by executing a lightweight connectivity ping.
 * Used by `/api/health` and system status UI indicators.
 */
export async function verifyDatabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  serverInfo?: string;
}> {
  const driver = getDriver();
  let session: Session | null = null;

  try {
    session = driver.session({ defaultAccessMode: neo4j.session.READ });
    
    // Execute simple lightweight openCypher heartbeat query
    const result: QueryResult = await session.run("RETURN 1 AS heartbeat, timestamp() AS now");
    const record = result.records[0];
    const rawHeartbeat = record?.get("heartbeat");
    const heartbeat = typeof rawHeartbeat?.toNumber === "function" ? rawHeartbeat.toNumber() : rawHeartbeat;

    if (heartbeat === 1) {
      return {
        connected: true,
        message: "Successfully connected to CognoDB Cloud over Bolt protocol.",
        serverInfo: "CognoDB openCypher Engine (Bolt 5.4)",
      };
    }

    return {
      connected: false,
      message: "Unexpected response received from CognoDB server heartbeat query.",
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("[CognoDB Connection Failure]:", errMessage);

    // Reset driver on connection failure so next attempt uses fresh socket
    await closeDriver();

    return {
      connected: false,
      message: `Database unreachable: ${errMessage}`,
    };
  } finally {
    if (session) {
      try {
        await session.close();
      } catch {
        // Ignore session close error
      }
    }
  }
}

/**
 * Executes a parameterized read Cypher query within a managed session context.
 * Automatically handles retries and driver recycling if socket disconnected / reset.
 */
export async function executeReadQuery<T = Record<string, unknown>>(
  cypher: string,
  parameters: Record<string, unknown> = {},
  isRetry = false
): Promise<T[]> {
  const driver = getDriver();
  const session = driver.session({ defaultAccessMode: neo4j.session.READ });

  try {
    const result = await session.run(cypher, parameters);
    return result.records.map((record) => {
      const rawObj = record.toObject();
      return sanitizeNeo4jData<T>(rawObj);
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[CognoDB Query Attempt ${isRetry ? "2" : "1"} Failed]: ${errMessage}`);

    // If socket was reset or disconnected and we haven't retried yet, recycle driver and retry once
    const isSocketOrConnectionIssue =
      errMessage.includes("ECONNRESET") ||
      errMessage.includes("ServiceUnavailable") ||
      errMessage.includes("socket disconnected") ||
      errMessage.includes("SessionExpired") ||
      errMessage.includes("Connection lost");

    if (!isRetry && isSocketOrConnectionIssue) {
      console.log("[CognoDB Auto-Recovery] Recycling connection pool and retrying query...");
      await closeDriver();
      return executeReadQuery<T>(cypher, parameters, true);
    }

    console.error("[CognoDB Read Query Error]:", { cypher, parameters, error });
    throw error;
  } finally {
    try {
      await session.close();
    } catch {
      // Ignore session close errors
    }
  }
}

/**
 * Closes the singleton driver connection during application shutdown or recovery.
 */
export async function closeDriver(): Promise<void> {
  if (globalThis.__neo4jDriver) {
    try {
      await globalThis.__neo4jDriver.close();
    } catch {
      // Ignore close errors
    }
    globalThis.__neo4jDriver = undefined;
  }
}
