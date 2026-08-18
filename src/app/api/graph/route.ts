import { NextRequest } from "next/server";
import { getGraphTopology } from "@/lib/queries";
import { graphQuerySchema } from "@/lib/validations";
import { apiSuccess, handleApiError } from "@/lib/api-response";

/**
 * Graph Canvas Topology API Route
 * GET /api/graph?labelFilter=ALL&searchQuery=
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLabelFilter = searchParams.get("labelFilter") || "ALL";
    const rawSearchQuery = searchParams.get("searchQuery") || "";

    // Zod Validation
    const { labelFilter, searchQuery } = graphQuerySchema.parse({
      labelFilter: rawLabelFilter,
      searchQuery: rawSearchQuery,
    });

    // Execute Cypher Query Layer
    const graphRecords = await getGraphTopology(labelFilter, searchQuery);

    return apiSuccess(graphRecords, {
      labelFilter,
      searchQuery,
      recordCount: graphRecords.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
