import "server-only";
import { executeReadQuery } from "./neo4j";

/**
 * TechGraph — Server-Side Cypher Query Service Layer
 * 
 * Implements strict parameterized openCypher queries using official Neo4j driver.
 * Zero string concatenation is used for user inputs, guaranteeing security against Cypher injection.
 */

// Interface return contracts
export interface DeveloperProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  experienceYears: number;
  skills: string[];
  repositories: string[];
  company?: string;
}

export interface EscalationChainResult {
  developerName: string;
  email: string;
  role: string;
  dependentRepo: string;
  targetRepo: string;
  hopDistance: number;
}

export interface BlastRadiusResult {
  affectedRepoId: string;
  affectedRepoName: string;
  language: string;
  depth: number;
  leadMaintainer?: string;
  contactEmail?: string;
}

export interface TechnologyExplorationResult {
  technology: string;
  repositories: string[];
  requiredSkills: string[];
  skilledDevelopers: string[];
}

export interface ProjectTeamMatrixResult {
  projectName: string;
  repositories: string[];
  teamMembers: string[];
  techStack: string[];
}

/**
 * QUERY A: Normal Graph Query
 * Purpose: Fetches a Developer's direct profile, skills, contributed repositories, and company.
 */
export async function getDeveloperDetails(devId: string): Promise<DeveloperProfile | null> {
  const cypher = `
    MATCH (dev:Developer {id: $devId})
    OPTIONAL MATCH (dev)-[:HAS_SKILL]->(sk:Skill)
    OPTIONAL MATCH (dev)-[:CONTRIBUTES_TO]->(repo:Repository)
    OPTIONAL MATCH (dev)-[:WORKS_AT]->(comp:Company)
    RETURN 
      dev.id AS id,
      dev.name AS name,
      dev.email AS email,
      dev.role AS role,
      dev.experienceYears AS experienceYears,
      collect(DISTINCT sk.name) AS skills,
      collect(DISTINCT repo.name) AS repositories,
      comp.name AS company
  `;

  const results = await executeReadQuery<DeveloperProfile>(cypher, { devId });
  return results.length > 0 ? results[0] : null;
}

/**
 * QUERY B: Multi-Hop Traversal (2+ Hops)
 * Purpose: Traverses `Developer -> CONTRIBUTES_TO -> Repository -> DEPENDS_ON (1..3 hops) -> Target Repository`.
 * Finds maintainers of downstream codebases that depend on a target core library.
 */
export async function getIncidentMaintainerEscalationChain(
  targetRepoId: string
): Promise<EscalationChainResult[]> {
  const cypher = `
    MATCH (dev:Developer)-[c:CONTRIBUTES_TO]->(depRepo:Repository)-[d:DEPENDS_ON*1..3]->(target:Repository {id: $targetRepoId})
    RETURN DISTINCT
      dev.name AS developerName,
      dev.email AS email,
      c.role AS role,
      depRepo.name AS dependentRepo,
      target.name AS targetRepo,
      1 AS hopDistance
  `;

  return await executeReadQuery<EscalationChainResult>(cypher, { targetRepoId });
}

/**
 * QUERY C: Relationally Awkward Graph Query (Variable-Length Transitive Blast Radius)
 * Purpose: Computes variable-depth downstream impact (`-[DEPENDS_ON*1..6]->`) when a repository fails.
 * In SQL, this requires complex recursive CTEs that slow down as graph path length varies.
 */
export async function calculateRepositoryBlastRadius(
  repoId: string
): Promise<BlastRadiusResult[]> {
  const cypher = `
    MATCH path = (downstream:Repository)-[:DEPENDS_ON*1..6]->(target:Repository {id: $repoId})
    OPTIONAL MATCH (m:Developer)-[:CONTRIBUTES_TO {role: 'Lead Maintainer'}]->(downstream)
    RETURN 
      downstream.id AS affectedRepoId,
      downstream.name AS affectedRepoName,
      downstream.language AS language,
      length(path) AS depth,
      m.name AS leadMaintainer,
      m.email AS contactEmail
    ORDER BY depth ASC
  `;

  return await executeReadQuery<BlastRadiusResult>(cypher, { repoId });
}

/**
 * QUERY D: Technology Stack Exploration Query
 * Purpose: Finds repositories using a tech stack, required skills, and proficient developers.
 */
export async function exploreTechnologyEcosystem(
  techId: string
): Promise<TechnologyExplorationResult | null> {
  const cypher = `
    MATCH (tech:Technology {id: $techId})
    OPTIONAL MATCH (repo:Repository)-[:USES_TECH]->(tech)
    OPTIONAL MATCH (tech)-[:REQUIRES_SKILL]->(sk:Skill)<-[:HAS_SKILL]-(dev:Developer)
    RETURN 
      tech.name AS technology,
      collect(DISTINCT repo.name) AS repositories,
      collect(DISTINCT sk.name) AS requiredSkills,
      collect(DISTINCT dev.name) AS skilledDevelopers
  `;

  const results = await executeReadQuery<TechnologyExplorationResult>(cypher, { techId });
  return results.length > 0 ? results[0] : null;
}

/**
 * QUERY E: Developer & Project Relationship Query
 * Purpose: Maps a high-level project to implementing repositories, team members, and tech stack.
 */
export async function getProjectTeamMatrix(
  projectId: string
): Promise<ProjectTeamMatrixResult | null> {
  const cypher = `
    MATCH (proj:Project {id: $projectId})<-[:IMPLEMENTS_PROJECT]-(repo:Repository)
    OPTIONAL MATCH (dev:Developer)-[:CONTRIBUTES_TO]->(repo)
    OPTIONAL MATCH (repo)-[:USES_TECH]->(tech:Technology)
    RETURN 
      proj.name AS projectName,
      collect(DISTINCT repo.name) AS repositories,
      collect(DISTINCT dev.name) AS teamMembers,
      collect(DISTINCT tech.name) AS techStack
  `;

  const results = await executeReadQuery<ProjectTeamMatrixResult>(cypher, { projectId });
  return results.length > 0 ? results[0] : null;
}

/**
 * QUERY F: Graph Topology Query for Canvas Visualizer
 * Purpose: Fetches nodes and relationships for React Flow graph rendering.
 */
export async function getGraphTopology(
  labelFilter: string = "ALL",
  searchQuery: string = ""
) {
  const cypher = `
    MATCH (n)
    WHERE ($labelFilter = 'ALL' OR $labelFilter IN labels(n))
      AND ($searchQuery = '' OR toLower(n.name) CONTAINS toLower($searchQuery))
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN n, r, m
    LIMIT 100
  `;

  return await executeReadQuery(cypher, { labelFilter, searchQuery });
}
