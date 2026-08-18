import { NextRequest } from "next/server";
import { getIncidentMaintainerEscalationChain } from "@/lib/queries";
import { incidentQuerySchema } from "@/lib/validations";
import { apiSuccess, handleApiError } from "@/lib/api-response";

/**
 * Incidents Multi-Hop Escalation API Route (Query B: 2+ Hop Traversal)
 * GET /api/incidents?targetRepoId=repo-5
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTargetRepoId = searchParams.get("targetRepoId") || "repo-5";

    // Zod Validation
    const { targetRepoId } = incidentQuerySchema.parse({ targetRepoId: rawTargetRepoId });

    // Execute Cypher Query Layer
    const escalationChain = await getIncidentMaintainerEscalationChain(targetRepoId);

    return apiSuccess(escalationChain, {
      targetRepoId,
      queryType: "QUERY_B_MULTI_HOP_TRAVERSAL",
      pattern: "(dev)-[:CONTRIBUTES_TO]->(repo)-[:DEPENDS_ON*1..3]->(target)",
      count: escalationChain.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
