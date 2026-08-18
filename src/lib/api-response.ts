import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standardized API Response Helper
 * 
 * Ensures uniform JSON payload structure across all TechGraph backend controllers.
 * Protects database credentials and internal stack traces from leaking to client callers.
 */

export function apiSuccess<T>(data: T, metadata: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

export function apiError(
  message: string,
  status = 500,
  code = "INTERNAL_ERROR",
  details: unknown = null
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details: details || undefined,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Global Error Handler for API Controllers
 * Gracefully converts Zod validation errors and Database exceptions into clean JSON errors.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      "Invalid request parameters",
      400,
      "VALIDATION_ERROR",
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("[API Error Handler Caught Exception]:", errorMessage);

  // Return safe error message to client without exposing passwords or internal driver stack traces
  return apiError("An error occurred while processing the graph database request.", 500, "DATABASE_ERROR");
}
