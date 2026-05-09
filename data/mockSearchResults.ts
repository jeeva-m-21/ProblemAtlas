import type { ImplementationScope, ProblemDomain } from "@/data/mockProblems";

export type SearchResultType =
  | "problem"
  | "space"
  | "researcher"
  | "artifact"
  | "discussion";

export type ActivityLevel = "low" | "medium" | "high";

export type CollaborationStatus = "solo" | "open" | "active";

export type SearchResultBase = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  domains: ProblemDomain[];
  updatedAt: string;
  activityLevel: ActivityLevel;
  collaboration: CollaborationStatus;
  contributors: {
    label: string;
    handle: string;
  }[];
  signals?: {
    label: string;
    value: string;
  }[];
};

export type ProblemSearchResult = SearchResultBase & {
  type: "problem";
  feasibilityScore: 1 | 2 | 3 | 4 | 5;
  implementationScope: ImplementationScope;
  activeSpaces: number;
};

export type SpaceSearchResult = SearchResultBase & {
  type: "space";
  problemId: number;
  stage: "scoping" | "prototyping" | "validation" | "shipping";
  artifactsCount: number;
  threadsActive: number;
};

export type ResearcherSearchResult = SearchResultBase & {
  type: "researcher";
  role: string;
  affiliation?: string;
  focus: string;
  contributions: {
    problems: number;
    spaces: number;
    artifacts: number;
  };
};

export type ArtifactSearchResult = SearchResultBase & {
  type: "artifact";
  artifactType:
    | "Research note"
    | "Prototype"
    | "Dataset"
    | "Architecture doc"
    | "Paper"
    | "Link";
  status: "active" | "draft" | "archived";
  spaceId: string;
};

export type DiscussionSearchResult = SearchResultBase & {
  type: "discussion";
  context: {
    spaceId?: string;
    problemId?: number;
  };
  replies: number;
  participants: number;
  lastSignal: string;
};

export type SearchResult =
  | ProblemSearchResult
  | SpaceSearchResult
  | ResearcherSearchResult
  | ArtifactSearchResult
  | DiscussionSearchResult;

export type SearchTabKey = "all" | "problems" | "spaces" | "researchers" | "artifacts" | "discussions";

export type SearchFilters = {
  domains: ProblemDomain[];
  feasibility?: "low" | "medium" | "high";
  implementationScope?: ImplementationScope;
  activityLevel?: ActivityLevel;
  collaboration?: CollaborationStatus;
};

export type SearchQuery = {
  q: string;
  tab: SearchTabKey;
  filters: SearchFilters;
};

const DEFAULT_CONTRIBUTORS: SearchResultBase["contributors"] = [
  { label: "A. Park", handle: "apark" },
  { label: "M. Chen", handle: "mchen" },
  { label: "S. Iyer", handle: "siyer" },
];

export const mockSearchResults: SearchResult[] = [
  {
    id: "problem-105",
    type: "problem",
    title: "Fast, Trustworthy Approximate Search Over Large Codebases",
    description:
      "Index repositories with hybrid symbolic + embedding retrieval to answer architecture questions with predictable latency and evidence-backed traces.",
    href: "/problems/105",
    domains: ["DevTools & Systems"],
    updatedAt: "2026-05-06",
    activityLevel: "high",
    collaboration: "active",
    contributors: [
      { label: "R. Alvarez", handle: "ralvarez" },
      { label: "M. Chen", handle: "mchen" },
      { label: "K. Singh", handle: "ksingh" },
    ],
    feasibilityScore: 4,
    implementationScope: "small",
    activeSpaces: 6,
    signals: [
      { label: "Key risk", value: "eval drift" },
      { label: "Index", value: "AST + vector" },
      { label: "SLO", value: "<120ms" },
    ],
  },
  {
    id: "space-ss-201",
    type: "space",
    title: "Space: Evidence-First Repo QA",
    description:
      "A solution space focused on source-grounded repo intelligence: citation constraints, proof traces, and latency budgets for interactive exploration.",
    href: "/spaces/201",
    domains: ["DevTools & Systems", "AI/ML"],
    updatedAt: "2026-05-08",
    activityLevel: "high",
    collaboration: "active",
    contributors: [
      { label: "M. Chen", handle: "mchen" },
      { label: "A. Park", handle: "apark" },
      { label: "N. Gupta", handle: "ngupta" },
      { label: "T. Okada", handle: "tokada" },
    ],
    problemId: 105,
    stage: "validation",
    artifactsCount: 14,
    threadsActive: 5,
    signals: [
      { label: "Milestone", value: "trace schema v2" },
      { label: "Confidence", value: "medium" },
    ],
  },
  {
    id: "researcher-me",
    type: "researcher",
    title: "You (Research Operator)",
    description:
      "AI-native systems engineer building evaluation harnesses, tooling, and research workspaces. Bias toward reproducibility and proof-carrying interfaces.",
    href: "/profile/me",
    domains: ["DevTools & Systems", "AI/ML"],
    updatedAt: "2026-05-07",
    activityLevel: "high",
    collaboration: "open",
    contributors: [],
    role: "Systems / Applied Research",
    affiliation: "Independent",
    focus: "Evidence-first tooling, eval harnesses, traceable AI UX",
    contributions: { problems: 4, spaces: 3, artifacts: 12 },
    signals: [
      { label: "Mode", value: "building" },
      { label: "Signal", value: "high" },
    ],
  },
  {
    id: "artifact-arc-01",
    type: "artifact",
    title: "RAG Trace Schema (v0.3)",
    description:
      "A compact event schema for retrieval traces: queries, hops, evidence spans, attribution confidence, and failure-mode tagging.",
    href: "/spaces/201",
    domains: ["AI/ML", "DevTools & Systems"],
    updatedAt: "2026-05-08",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "A. Park", handle: "apark" },
      { label: "M. Chen", handle: "mchen" },
    ],
    artifactType: "Architecture doc",
    status: "active",
    spaceId: "201",
    signals: [
      { label: "Format", value: "JSONL" },
      { label: "Coverage", value: "hop-level" },
    ],
  },
  {
    id: "discussion-d-11",
    type: "discussion",
    title: "Failure modes: citation drift vs. stale embeddings",
    description:
      "Thread mapping where retrieval fails when corpora shift: temporal inconsistency, embedding staleness, and evidence boundary ambiguity.",
    href: "/spaces/201",
    domains: ["AI/ML", "DevTools & Systems"],
    updatedAt: "2026-05-06",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "S. Iyer", handle: "siyer" },
      { label: "K. Singh", handle: "ksingh" },
    ],
    context: { spaceId: "201", problemId: 105 },
    replies: 18,
    participants: 6,
    lastSignal: "Proposed drift benchmarks for weekly index rebuilds",
    signals: [
      { label: "Heat", value: "medium" },
      { label: "Outcome", value: "benchmark draft" },
    ],
  },
  {
    id: "problem-101",
    type: "problem",
    title: "Robust RAG Evaluation for Multi-Hop Technical Queries",
    description:
      "Build a reproducible harness that detects hallucinations and citation drift in multi-hop retrieval pipelines across changing corpora.",
    href: "/problems/101",
    domains: ["AI/ML"],
    updatedAt: "2026-05-02",
    activityLevel: "high",
    collaboration: "open",
    contributors: DEFAULT_CONTRIBUTORS,
    feasibilityScore: 3,
    implementationScope: "medium",
    activeSpaces: 4,
    signals: [
      { label: "Metric", value: "evidence recall" },
      { label: "Need", value: "gold traces" },
    ],
  },
  {
    id: "problem-104",
    type: "problem",
    title: "Sim-to-Real Transfer for Low-Cost Indoor Robot Navigation",
    description:
      "Reduce the sim-to-real gap for cheap depth sensors via uncertainty-aware mapping and robust control in cluttered indoor spaces.",
    href: "/problems/104",
    domains: ["Robotics"],
    updatedAt: "2026-04-28",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "J. Kim", handle: "jkim" },
      { label: "L. Novik", handle: "lnovik" },
    ],
    feasibilityScore: 2,
    implementationScope: "large",
    activeSpaces: 3,
    signals: [
      { label: "Constraint", value: "sensor noise" },
      { label: "Approach", value: "uncertainty maps" },
    ],
  },
  {
    id: "space-ss-204",
    type: "space",
    title: "Space: Wearable Anomaly Lab",
    description:
      "A workspace aligning sensor baselines, interpretability, and low false-alarm pipelines for real-time wearable streams.",
    href: "/spaces/204",
    domains: ["Healthcare"],
    updatedAt: "2026-05-01",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "C. Rivera", handle: "crivera" },
      { label: "P. Watanabe", handle: "pwatanabe" },
      { label: "S. Iyer", handle: "siyer" },
    ],
    problemId: 103,
    stage: "prototyping",
    artifactsCount: 9,
    threadsActive: 2,
    signals: [
      { label: "Model", value: "CUSUM + AE" },
      { label: "Review", value: "clinician" },
    ],
  },
  {
    id: "artifact-hlth-02",
    type: "artifact",
    title: "Baseline Drift Notebook",
    description:
      "Notes on baseline estimation, seasonality, and concept drift in heart-rate + motion streams; includes synthetic anomaly generator.",
    href: "/spaces/204",
    domains: ["Healthcare"],
    updatedAt: "2026-05-03",
    activityLevel: "low",
    collaboration: "active",
    contributors: [
      { label: "C. Rivera", handle: "crivera" },
      { label: "P. Watanabe", handle: "pwatanabe" },
    ],
    artifactType: "Research note",
    status: "draft",
    spaceId: "204",
    signals: [
      { label: "Focus", value: "drift" },
      { label: "Generator", value: "synthetic" },
    ],
  },
  {
    id: "discussion-d-23",
    type: "discussion",
    title: "Interpretable alerts: explaining deviations to non-experts",
    description:
      "How to translate anomaly scores into actionable explanations without overwhelming users; discussion on counterfactuals and baselines.",
    href: "/spaces/204",
    domains: ["Healthcare", "AI/ML"],
    updatedAt: "2026-05-02",
    activityLevel: "low",
    collaboration: "open",
    contributors: [
      { label: "P. Watanabe", handle: "pwatanabe" },
      { label: "C. Rivera", handle: "crivera" },
    ],
    context: { spaceId: "204", problemId: 103 },
    replies: 7,
    participants: 3,
    lastSignal: "Drafted a short-form explanation rubric",
    signals: [
      { label: "Outcome", value: "rubric" },
      { label: "Risk", value: "false trust" },
    ],
  },
  {
    id: "researcher-helena",
    type: "researcher",
    title: "Helena Voss",
    description:
      "Builds robust evaluation tooling and retrieval systems for technical domains; cares about calibration, traceability, and systems safety.",
    href: "/profile/helena",
    domains: ["AI/ML", "DevTools & Systems"],
    updatedAt: "2026-05-05",
    activityLevel: "medium",
    collaboration: "open",
    contributors: [],
    role: "Applied Research Engineer",
    affiliation: "Independent Lab",
    focus: "RAG evaluation, calibration, evidence UI",
    contributions: { problems: 2, spaces: 1, artifacts: 6 },
    signals: [
      { label: "Collab", value: "open" },
      { label: "Strength", value: "eval" },
    ],
  },
  {
    id: "problem-102",
    type: "problem",
    title: "Deterministic Dev Environments for Polyglot Monorepos",
    description:
      "Create a workflow that yields identical builds across macOS/Linux/Windows for Node, Python, and Rust without brittle local setup.",
    href: "/problems/102",
    domains: ["DevTools & Systems"],
    updatedAt: "2026-04-25",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "N. Gupta", handle: "ngupta" },
      { label: "R. Alvarez", handle: "ralvarez" },
    ],
    feasibilityScore: 4,
    implementationScope: "medium",
    activeSpaces: 2,
    signals: [
      { label: "Goal", value: "bit-for-bit" },
      { label: "Surface", value: "toolchains" },
    ],
  },
  {
    id: "space-ss-207",
    type: "space",
    title: "Space: Reproducible Toolchains",
    description:
      "Workspace for lockfile discipline, hermetic CI, and cross-OS build parity; includes experiment logs and failure-mode catalog.",
    href: "/spaces/207",
    domains: ["DevTools & Systems"],
    updatedAt: "2026-05-04",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "R. Alvarez", handle: "ralvarez" },
      { label: "N. Gupta", handle: "ngupta" },
      { label: "A. Park", handle: "apark" },
    ],
    problemId: 102,
    stage: "shipping",
    artifactsCount: 11,
    threadsActive: 3,
    signals: [
      { label: "Status", value: "CI green" },
      { label: "Surface", value: "Nix/containers" },
    ],
  },
  {
    id: "artifact-dev-03",
    type: "artifact",
    title: "Hermetic Build Checklist",
    description:
      "A compact checklist for making builds reproducible: toolchain pinning, sandboxing, time sources, locale, and deterministic archives.",
    href: "/spaces/207",
    domains: ["DevTools & Systems"],
    updatedAt: "2026-05-04",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "N. Gupta", handle: "ngupta" },
      { label: "R. Alvarez", handle: "ralvarez" },
    ],
    artifactType: "Research note",
    status: "active",
    spaceId: "207",
    signals: [
      { label: "Version", value: "v1.1" },
      { label: "Scope", value: "cross-OS" },
    ],
  },
  {
    id: "discussion-d-41",
    type: "discussion",
    title: "Toolchain pinning: Nix vs containers vs vendoring",
    description:
      "Debate on tradeoffs: declarative environments, container layering, vendoring compilers, and how to keep DX intact while staying deterministic.",
    href: "/spaces/207",
    domains: ["DevTools & Systems"],
    updatedAt: "2026-05-04",
    activityLevel: "medium",
    collaboration: "active",
    contributors: [
      { label: "R. Alvarez", handle: "ralvarez" },
      { label: "A. Park", handle: "apark" },
    ],
    context: { spaceId: "207", problemId: 102 },
    replies: 12,
    participants: 5,
    lastSignal: "Converged on a hybrid: Nix for dev, containers for CI",
    signals: [
      { label: "Decision", value: "hybrid" },
      { label: "Risk", value: "onboarding" },
    ],
  },
  {
    id: "problem-103",
    type: "problem",
    title: "Near-Real-Time Anomaly Detection in Wearable Sensor Streams",
    description:
      "Detect clinically meaningful deviations from baseline in noisy heart-rate and motion data with minimal false alarms and interpretable feedback.",
    href: "/problems/103",
    domains: ["Healthcare"],
    updatedAt: "2026-04-19",
    activityLevel: "low",
    collaboration: "open",
    contributors: DEFAULT_CONTRIBUTORS,
    feasibilityScore: 3,
    implementationScope: "large",
    activeSpaces: 1,
    signals: [
      { label: "Constraint", value: "low false alarms" },
      { label: "Need", value: "interpretability" },
    ],
  },
  {
    id: "problem-107",
    type: "problem",
    title: "Compact On-Device Speech Enhancement for Noisy Calls",
    description:
      "Build a low-latency denoising model that runs on consumer hardware and improves intelligibility without introducing robotic artifacts.",
    href: "/problems/107",
    domains: ["AI/ML"],
    updatedAt: "2026-04-22",
    activityLevel: "medium",
    collaboration: "open",
    contributors: [
      { label: "Helena Voss", handle: "helena" },
      { label: "J. Kim", handle: "jkim" },
    ],
    feasibilityScore: 5,
    implementationScope: "small",
    activeSpaces: 2,
    signals: [
      { label: "Target", value: "on-device" },
      { label: "Metric", value: "PESQ" },
    ],
  },
];

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

export const COLLABORATION_STATUSES: {
  label: string;
  value: CollaborationStatus;
}[] = [
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

export function feasibilityBucket(score: 1 | 2 | 3 | 4 | 5): NonNullable<SearchFilters["feasibility"]> {
  if (score >= 4) return "high";
  if (score === 3) return "medium";
  return "low";
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensForQuery(query: string) {
  const normalized = normalize(query);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

function searchableText(result: SearchResult) {
  const signalText = (result.signals ?? [])
    .map((s) => `${s.label} ${s.value}`)
    .join(" ");
  const contributorText = result.contributors
    .map((c) => `${c.label} ${c.handle}`)
    .join(" ");

  return normalize(
    [
      result.title,
      result.description,
      result.type,
      result.domains.join(" "),
      contributorText,
      signalText,
    ].join(" ")
  );
}

function baseScore(result: SearchResult) {
  let score = 0;
  if (result.activityLevel === "high") score += 3;
  if (result.activityLevel === "medium") score += 2;
  if (result.collaboration === "active") score += 2;
  if (result.collaboration === "open") score += 1;
  score += Math.min(2, result.contributors.length / 2);
  return score;
}

function queryScore(result: SearchResult, queryTokens: string[]) {
  if (queryTokens.length === 0) return 0;
  const text = searchableText(result);
  let score = 0;
  for (const token of queryTokens) {
    if (!token) continue;
    if (text.includes(token)) score += 3;
  }
  return score;
}

function tabMatches(tab: SearchTabKey, type: SearchResultType) {
  switch (tab) {
    case "all":
      return true;
    case "problems":
      return type === "problem";
    case "spaces":
      return type === "space";
    case "researchers":
      return type === "researcher";
    case "artifacts":
      return type === "artifact";
    case "discussions":
      return type === "discussion";
    default:
      return true;
  }
}

function domainMatches(result: SearchResult, domains: ProblemDomain[]) {
  if (domains.length === 0) return true;
  return domains.some((d) => result.domains.includes(d));
}

function feasibilityMatches(result: SearchResult, feasibility?: SearchFilters["feasibility"]) {
  if (!feasibility) return true;
  if (result.type !== "problem") return true;
  return feasibilityBucket(result.feasibilityScore) === feasibility;
}

function implementationMatches(result: SearchResult, scope?: SearchFilters["implementationScope"]) {
  if (!scope) return true;
  if (result.type !== "problem") return true;
  return result.implementationScope === scope;
}

export function filterSearchResults(all: SearchResult[], query: SearchQuery) {
  const queryTokens = tokensForQuery(query.q);

  const filtered = all.filter((result) => {
    if (!tabMatches(query.tab, result.type)) return false;
    if (!domainMatches(result, query.filters.domains)) return false;
    if (query.filters.activityLevel && result.activityLevel !== query.filters.activityLevel) {
      return false;
    }
    if (query.filters.collaboration && result.collaboration !== query.filters.collaboration) {
      return false;
    }
    if (!feasibilityMatches(result, query.filters.feasibility)) return false;
    if (!implementationMatches(result, query.filters.implementationScope)) return false;

    if (queryTokens.length === 0) return true;

    const haystack = searchableText(result);
    return queryTokens.every((token) => haystack.includes(token));
  });

  return filtered
    .map((result) => ({
      result,
      score: baseScore(result) + queryScore(result, queryTokens),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.result);
}
