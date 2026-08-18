import { NextRequest } from "next/server";
import { getProjectTeamMatrix } from "@/lib/queries";
import { idParamSchema } from "@/lib/validations";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

/**
 * Project Team Matrix API Route
 * GET /api/projects/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawParams = await params;
    const { id } = idParamSchema.parse(rawParams);

    const projectMatrix = await getProjectTeamMatrix(id);

    if (!projectMatrix) {
      return apiError(`Project with ID '${id}' not found`, 404, "NOT_FOUND");
    }

    return apiSuccess(projectMatrix, {
      queryType: "PROJECT_TEAM_MATRIX",
      projectId: id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
