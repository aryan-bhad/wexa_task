/**
 * TechGraph — Engineering Knowledge Explorer
 * Phase 2: Domain Ontology & Graph Data Model Types
 */

// Node Labels as per Phase 2 Spec
export type NodeLabel =
  | "Developer"
  | "Skill"
  | "Technology"
  | "Project"
  | "Repository"
  | "Company";

// Relationship Types
export type RelationshipType =
  | "HAS_SKILL"
  | "CONTRIBUTES_TO"
  | "WORKS_AT"
  | "OWNED_BY"
  | "IMPLEMENTS_PROJECT"
  | "USES_TECH"
  | "REQUIRES_SKILL"
  | "DEPENDS_ON";

// 1. Developer Node
export interface DeveloperNode {
  id: string;
  name: string;
  email: string;
  role: string;
  experienceYears: number;
}

// 2. Skill Node
export interface SkillNode {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "AI/ML" | "Security";
  description: string;
}

// 3. Technology Node
export interface TechnologyNode {
  id: string;
  name: string;
  type: "Framework" | "Library" | "Database" | "Language" | "Infrastructure";
  ecosystem: string;
}

// 4. Project Node
export interface ProjectNode {
  id: string;
  name: string;
  status: "Active" | "Maintenance" | "Deprecated";
  criticality: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

// 5. Repository Node
export interface RepositoryNode {
  id: string;
  name: string;
  url: string;
  language: string;
  stars: number;
}

// 6. Company Node
export interface CompanyNode {
  id: string;
  name: string;
  domain: string;
  industry: string;
}

// Generic Node Representation for Frontend Canvas
export interface TechGraphNode {
  id: string;
  label: NodeLabel;
  name: string;
  properties: Record<string, unknown>;
}

// Generic Edge Representation for Frontend Canvas
export interface TechGraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  properties?: Record<string, unknown>;
}
