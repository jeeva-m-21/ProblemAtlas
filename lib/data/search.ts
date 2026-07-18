import { db } from "@/lib/db";
import { problems, solutionSpaces, users, comments } from "@/lib/db/schema";
import { eq, and, isNull, like, or, desc, sql } from "drizzle-orm";
import type { ProblemDomain } from "./problems";
import type { ImplementationScope } from "./problems";

export type SearchTabKey = "all" | "problems" | "spaces" | "researchers" | "artifacts" | "discussions";

export type SearchResultType =
  | "problem"
  | "space"
  | "researcher"
  | "artifact"
  | "discussion";

export type ActivityLevel = "low" | "medium" | "high";
export type CollaborationStatus = "solo" | "open" | "active";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  domains: ProblemDomain[];
  updatedAt: string;
  activityLevel: ActivityLevel;
  collaboration: CollaborationStatus;
  contributors: Array<{ label: string; handle: string }>;
  signals?: Array<{ label: string; value: string }>;
  feasibilityScore?: number;
  implementationScope?: ImplementationScope;
  activeSpaces?: number;
  stage?: "scoping" | "prototyping" | "validation" | "shipping";
  artifactsCount?: number;
  threadsActive?: number;
  role?: string;
  affiliation?: string;
  focus?: string;
  contributions?: { problems: number; spaces: number; artifacts: number };
  artifactType?: string;
  status?: string;
  spaceId?: string;
  context?: { spaceId?: string; problemId?: number };
  replies?: number;
  participants?: number;
  lastSignal?: string;
};

export type SearchFilters = {
  q: string;
  tab: string;
  domains: ProblemDomain[];
  activityLevel?: ActivityLevel;
  collaboration?: CollaborationStatus;
  feasibility?: "low" | "medium" | "high";
  implementationScope?: ImplementationScope;
};

export type SearchFiltersInput = Pick<SearchFilters, "domains" | "feasibility" | "activityLevel" | "collaboration" | "implementationScope">;

export const SEARCH_TABS: { key: SearchTabKey; label: string; type?: SearchResultType }[] = [
  { key: "all", label: "All" },
  { key: "problems", label: "Problems", type: "problem" },
  { key: "spaces", label: "Solution Spaces", type: "space" },
  { key: "researchers", label: "Researchers", type: "researcher" },
  { key: "artifacts", label: "Artifacts", type: "artifact" },
  { key: "discussions", label: "Discussions", type: "discussion" },
];

export const SEARCH_DOMAINS: { label: string; value: ProblemDomain }[] = [
  { label: "AI/ML", value: "AI/ML" },
  { label: "DevTools & Systems", value: "DevTools & Systems" },
  { label: "Physics", value: "Physics" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Robotics", value: "Robotics" },
];

export const ACTIVITY_LEVELS: { label: string; value: ActivityLevel }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const COLLABORATION_STATUSES: { label: string; value: CollaborationStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Open", value: "open" },
  { label: "Solo", value: "solo" },
];

export const FEASIBILITY_LEVELS: { label: string; value: NonNullable<SearchFilters["feasibility"]> }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const IMPLEMENTATION_SCOPES: { label: string; value: ImplementationScope }[] = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

export type DomainKey =
  | "ai-ml"
  | "distributed-systems"
  | "robotics"
  | "physics"
  | "healthcare"
  | "climate"
  | "security"
  | "developer-tools";

export type Domain = {
  key: DomainKey;
  label: string;
  description: string;
  signals: { label: string; value: string }[];
};

export const mockDomains: Domain[] = [
  {
    key: "ai-ml",
    label: "AI/ML",
    description: "Evaluation harnesses, retrieval systems, model reliability, and traceable interfaces.",
    signals: [{ label: "focus", value: "eval + evidence" }, { label: "surface", value: "RAG, tooling" }],
  },
  {
    key: "distributed-systems",
    label: "Distributed Systems",
    description: "Consistency, observability, queueing, fault tolerance, and reliability design.",
    signals: [{ label: "signal", value: "latency budgets" }, { label: "mode", value: "failure analysis" }],
  },
  {
    key: "robotics",
    label: "Robotics",
    description: "Mapping, control, sim-to-real, sensor fusion, and uncertainty-aware autonomy.",
    signals: [{ label: "constraint", value: "real-world noise" }, { label: "surface", value: "navigation" }],
  },
  {
    key: "physics",
    label: "Physics",
    description: "Inverse problems, uncertainty quantification, sparse sensing, and model constraints.",
    signals: [{ label: "method", value: "priors + constraints" }, { label: "signal", value: "UQ" }],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    description: "Wearables, clinical interpretability, safety envelopes, and trustworthy alerts.",
    signals: [{ label: "risk", value: "false trust" }, { label: "need", value: "interpretability" }],
  },
  {
    key: "climate",
    label: "Climate",
    description: "Forecasting, measurement pipelines, adaptation systems, and optimization under uncertainty.",
    signals: [{ label: "surface", value: "sensing + models" }, { label: "mode", value: "mitigation" }],
  },
  {
    key: "security",
    label: "Security",
    description: "Threat modeling, verification, supply-chain integrity, and safe-by-design tooling.",
    signals: [{ label: "surface", value: "supply chain" }, { label: "mode", value: "verification" }],
  },
  {
    key: "developer-tools",
    label: "Developer Tools",
    description: "Code intelligence, deterministic environments, and system-level DX improvements.",
    signals: [{ label: "goal", value: "reproducible" }, { label: "surface", value: "repo-scale" }],
  },
];

export const DEFAULT_DOMAIN_KEYS: DomainKey[] = ["ai-ml", "developer-tools"];

export async function searchAll(filters: SearchFilters): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  if (filters.tab === "all" || filters.tab === "problems") {
    const problemResults = await searchProblems(filters);
    results.push(...problemResults);
  }

  if (filters.tab === "all" || filters.tab === "spaces") {
    const spaceResults = await searchSpaces(filters);
    results.push(...spaceResults);
  }

  if (filters.tab === "all" || filters.tab === "researchers") {
    const researcherResults = await searchResearchers(filters);
    results.push(...researcherResults);
  }

  return results;
}

async function searchProblems(filters: SearchFilters): Promise<SearchResult[]> {
  const conditions = [
    isNull(problems.deletedAt),
    eq(problems.validationStatus, "published"),
  ];

  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(like(problems.title, term), like(problems.descriptionShort, term))!
    );
  }

  const rows = await db
    .select()
    .from(problems)
    .where(and(...conditions))
    .orderBy(desc(problems.interestedCount))
    .limit(20);

  return rows.map((p) => ({
    id: `problem-${p.id}`,
    type: "problem" as const,
    title: p.title,
    description: p.descriptionShort,
    href: `/problems/${p.id}`,
    domains: [p.domain as ProblemDomain],
    updatedAt: p.updatedAt?.toISOString() ?? "",
    activityLevel: (p.interestedCount >= 30 ? "high" : p.interestedCount >= 15 ? "medium" : "low") as ActivityLevel,
    collaboration: (p.activeSolutionSpacesCount >= 3 ? "active" : "open") as CollaborationStatus,
    contributors: [],
    feasibilityScore: p.feasibilityScore ?? 3,
    implementationScope: p.implementationScope as ImplementationScope,
    activeSpaces: p.activeSolutionSpacesCount,
  }));
}

async function searchSpaces(filters: SearchFilters): Promise<SearchResult[]> {
  const conditions = [isNull(solutionSpaces.deletedAt)];

  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(
        like(solutionSpaces.name, term),
        like(sql`COALESCE(${solutionSpaces.description}, '')`, term)
      )!
    );
  }

  const rows = await db
    .select()
    .from(solutionSpaces)
    .where(and(...conditions))
    .orderBy(desc(solutionSpaces.updatedAt))
    .limit(20);

  return rows.map((s) => ({
    id: `space-${s.id}`,
    type: "space" as const,
    title: s.name,
    description: s.description ?? "",
    href: `/spaces/${s.id}`,
    domains: [],
    updatedAt: s.updatedAt?.toISOString() ?? "",
    activityLevel: "medium" as ActivityLevel,
    collaboration: "open" as CollaborationStatus,
    contributors: [],
    artifactsCount: 0,
    threadsActive: 0,
  }));
}

async function searchResearchers(filters: SearchFilters): Promise<SearchResult[]> {
  const conditions: any[] = [];

  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(like(users.name, term), like(sql`COALESCE(${users.bio}, '')`, term))!
    );
  }

  const rows = await db
    .select()
    .from(users)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(20);

  return rows.map((u) => ({
    id: `researcher-${u.clerkId}`,
    type: "researcher" as const,
    title: u.name,
    description: u.bio ?? "",
    href: `/profile/${u.clerkId}`,
    domains: (u.domains ?? []) as ProblemDomain[],
    updatedAt: u.createdAt?.toISOString() ?? "",
    activityLevel: "medium" as ActivityLevel,
    collaboration: "open" as CollaborationStatus,
    contributors: [],
    signals: u.skills?.map((s) => ({ label: "Skill", value: s })),
    contributions: {
      problems: 0,
      spaces: 0,
      artifacts: 0,
    },
  }));
}
