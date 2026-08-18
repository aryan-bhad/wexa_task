import { z } from "zod";

/**
 * TechGraph API Input Validation Schemas (Zod)
 * 
 * Enforces strict validation of all incoming query string and path parameters
 * before passing values to server-side Cypher query functions.
 */

// Graph Visualizer Query Validation Schema
export const graphQuerySchema = z.object({
  labelFilter: z
    .enum(["ALL", "Developer", "Skill", "Technology", "Project", "Repository", "Company"])
    .optional()
    .default("ALL"),
  searchQuery: z.string().max(100, "Search query max length 100 chars").optional().default(""),
});

// Blast Radius Calculation Query Schema
export const blastRadiusQuerySchema = z.object({
  repoId: z
    .string({ message: "repoId must be a string" })
    .min(1, "repoId parameter is required")
    .max(50, "repoId parameter too long")
    .default("repo-6"),
});

// Incident Escalation Chain Query Schema
export const incidentQuerySchema = z.object({
  targetRepoId: z
    .string({ message: "targetRepoId must be a string" })
    .min(1, "targetRepoId parameter is required")
    .max(50, "targetRepoId parameter too long")
    .default("repo-5"),
});

// Generic Entity ID Path Parameter Schema
export const idParamSchema = z.object({
  id: z
    .string({ message: "ID parameter must be a string" })
    .min(1, "Entity ID is required")
    .max(50, "Entity ID too long"),
});
