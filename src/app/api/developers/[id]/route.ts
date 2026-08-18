import { NextRequest } from "next/server";
import { getDeveloperDetails } from "@/lib/queries";
import { idParamSchema } from "@/lib/validations";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

/**
 * Developer Profile API Route (Query A: Normal Graph Query)
 * GET /api/developers/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawParams = await params;
    const { id } = idParamSchema.parse(rawParams);

    const developer = await getDeveloperDetails(id);

    if (!developer) {
      return apiError(`Developer with ID '${id}' not found`, 404, "NOT_FOUND");
    }

    return apiSuccess(developer, {
      queryType: "QUERY_A_NORMAL_LOOKUP",
      devId: id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
