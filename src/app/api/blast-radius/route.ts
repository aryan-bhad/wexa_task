import { NextRequest } from "next/server";
import { calculateRepositoryBlastRadius } from "@/lib/queries";
import { blastRadiusQuerySchema } from "@/lib/validations";
import { apiSuccess, handleApiError } from "@/lib/api-response";

/**
 * Blast Radius API Route (Query C: Relationally Awkward Query)
 * GET /api/blast-radius?repoId=repo-6
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawRepoId = searchParams.get("repoId") || "repo-6";

    // Zod Validation
    const { repoId } = blastRadiusQuerySchema.parse({ repoId: rawRepoId });

    // Execute Cypher Query Layer
    const blastRadius = await calculateRepositoryBlastRadius(repoId);

    return apiSuccess(blastRadius, {
      targetRepoId: repoId,
      queryType: "QUERY_C_RELATIONALLY_AWKWARD",
      pattern: "-[:DEPENDS_ON*1..6]->",
      count: blastRadius.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
