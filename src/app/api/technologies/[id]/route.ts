import { NextRequest } from "next/server";
import { exploreTechnologyEcosystem } from "@/lib/queries";
import { idParamSchema } from "@/lib/validations";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

/**
 * Technology Ecosystem API Route
 * GET /api/technologies/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawParams = await params;
    const { id } = idParamSchema.parse(rawParams);

    const techEcosystem = await exploreTechnologyEcosystem(id);

    if (!techEcosystem) {
      return apiError(`Technology with ID '${id}' not found`, 404, "NOT_FOUND");
    }

    return apiSuccess(techEcosystem, {
      queryType: "TECHNOLOGY_EXPLORATION",
      techId: id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
