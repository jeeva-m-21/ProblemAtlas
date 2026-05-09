import { mockProblems, type Problem, type ProblemDomain } from "@/data/mockProblems";

export type SolutionSpaceProgressState =
  | "Exploring"
  | "Prototyping"
  | "Validating"
  | "Shipping";

export type ArtifactType =
  | "Research note"
  | "Prototype"
  | "GitHub"
  | "Architecture doc"
  | "Dataset"
  | "Paper"
  | "Link";

export type ArtifactStatus = "draft" | "active" | "archived";

export type SolutionArtifact = {
  id: string;
  type: ArtifactType;
  title: string;
  description: string;
  href?: string;
  updatedAt: string;
  status: ArtifactStatus;
  signal?: {
    label: string;
    value: string;
  };
};

export type Contributor = {
  name: string;
  initials: string;
  role: string;
  interest: string;
  status: "active" | "idle";
};

export type TimelineEventType =
  | "milestone"
  | "discovery"
  | "update"
  | "task"
  | "decision";

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  detail: string;
  createdAt: string;
  actor: {
    name: string;
    initials: string;
  };
  tags?: string[];
};

export type FeasibilityChange = {
  createdAt: string;
  from: 1 | 2 | 3 | 4 | 5;
  to: 1 | 2 | 3 | 4 | 5;
  note: string;
};

export type SpaceTask = {
  id: string;
  title: string;
  status: "open" | "in-progress" | "done";
};

export type SolutionSpace = {
  id: number;
  title: string;
  createdAt: string;
  progressState: SolutionSpaceProgressState;
  activity: {
    lastActiveAt: string;
    indicator: "Quiet" | "Active" | "High";
  };

  problemId: Problem["id"];
  problemTitle: Problem["title"];
  domainTags: ProblemDomain[];

  overview: {
    direction: string;
    hypothesis: string;
    strategy: string;
    goals: string[];
  };

  contributors: Contributor[];
  artifacts: SolutionArtifact[];
  timeline: TimelineEvent[];

  sidebar: {
    collaborationStats: {
      contributors: number;
      activeToday: number;
      artifacts: number;
      milestones: number;
    };
    openTasks: SpaceTask[];
    feasibilityChanges: FeasibilityChange[];
    researchConfidence: 1 | 2 | 3 | 4 | 5;
  };
};

function mustFindBaseProblem(id: number): Problem {
  const base = mockProblems.find((p) => p.id === id);
  if (!base) throw new Error(`Missing base mock problem: ${id}`);
  return base;
}

const p101 = mustFindBaseProblem(101);
const p105 = mustFindBaseProblem(105);
const p102 = mustFindBaseProblem(102);

export const mockSolutionSpaces: SolutionSpace[] = [
  {
    id: 7001,
    title: "RAG Drift Harness v0",
    createdAt: "2026-03-11",
    progressState: "Prototyping",
    activity: {
      lastActiveAt: "2026-04-06",
      indicator: "High",
    },
    problemId: p101.id,
    problemTitle: p101.title,
    domainTags: ["AI/ML", "DevTools & Systems"],
    overview: {
      direction:
        "Build a snapshot-replay evaluation harness that detects evidence drift and multi-hop grounding failures.",
      hypothesis:
        "If we grade hop-level support (claim → citation) and replay across corpus snapshots, we can catch regressions early and reduce false confidence.",
      strategy:
        "Start with docs-only snapshotting, add structured hop schema, then validate with adversarial evidence masking. Keep the interface evidence-first.",
      goals: [
        "Versioned corpus snapshots with stable source IDs",
        "Multi-hop structured output schema + validators",
        "Drift alerts with explanation (what changed + why)",
        "Small query suite with repeatable scoring and thresholds",
      ],
    },
    contributors: [
      {
        name: "Mira Chen",
        initials: "MC",
        role: "Applied ML",
        interest: "metrics + drift",
        status: "active",
      },
      {
        name: "Arjun Patel",
        initials: "AP",
        role: "Infra",
        interest: "snapshotting",
        status: "active",
      },
      {
        name: "Sofia Ionescu",
        initials: "SI",
        role: "Research",
        interest: "multi-hop grading",
        status: "idle",
      },
    ],
    artifacts: [
      {
        id: "a-7001-1",
        type: "Architecture doc",
        title: "Harness architecture sketch",
        description:
          "Thin evaluator core + adapters for corpora, retrieval configs, and model providers. Evidence-first scoring pipeline.",
        href: "https://example.com/architecture",
        updatedAt: "2026-04-02",
        status: "active",
        signal: { label: "Scope", value: "docs-only" },
      },
      {
        id: "a-7001-2",
        type: "Prototype",
        title: "Snapshot replay CLI",
        description:
          "Prototype CLI to snapshot, index, and replay a fixed query suite across corpus versions with diff outputs.",
        updatedAt: "2026-04-06",
        status: "draft",
        signal: { label: "Runs", value: "local" },
      },
      {
        id: "a-7001-3",
        type: "Research note",
        title: "Hop-level scoring notes",
        description:
          "Proposed schema: claims, citations, and dependency edges. Validators: entailment checks + contradiction scans.",
        updatedAt: "2026-03-28",
        status: "active",
        signal: { label: "Metric", value: "support" },
      },
      {
        id: "a-7001-4",
        type: "GitHub",
        title: "Repo: drift-harness",
        description:
          "Monorepo scaffold for the harness with adapters and baseline datasets.",
        href: "https://github.com/example/drift-harness",
        updatedAt: "2026-04-01",
        status: "draft",
      },
      {
        id: "a-7001-5",
        type: "Dataset",
        title: "Query suite v0",
        description:
          "Seed set of multi-hop technical queries + expected evidence anchors (weak labels).",
        updatedAt: "2026-03-20",
        status: "active",
        signal: { label: "Size", value: "42" },
      },
    ],
    timeline: [
      {
        id: "t-7001-1",
        type: "milestone",
        title: "Defined evaluation primitives",
        detail:
          "Locked on schema: query → claims → citations. Scoring emphasizes evidence alignment over textual similarity.",
        createdAt: "2026-03-12",
        actor: { name: "Mira Chen", initials: "MC" },
        tags: ["schema", "metrics"],
      },
      {
        id: "t-7001-2",
        type: "decision",
        title: "Start with docs snapshotting",
        detail:
          "Avoid repo churn complexity initially; validate replay + drift alarms on docs sources first.",
        createdAt: "2026-03-15",
        actor: { name: "Arjun Patel", initials: "AP" },
        tags: ["infra"],
      },
      {
        id: "t-7001-3",
        type: "discovery",
        title: "Drift is mostly citation-level",
        detail:
          "Observed stable answers with unstable citations; drift detection must grade citation support explicitly.",
        createdAt: "2026-03-29",
        actor: { name: "Sofia Ionescu", initials: "SI" },
        tags: ["drift"],
      },
      {
        id: "t-7001-4",
        type: "update",
        title: "Replay CLI prototype",
        detail:
          "CLI produces diffs: evidence changes, retrieval deltas, and hop-support scores across snapshots.",
        createdAt: "2026-04-06",
        actor: { name: "Arjun Patel", initials: "AP" },
        tags: ["prototype"],
      },
    ],
    sidebar: {
      collaborationStats: {
        contributors: 3,
        activeToday: 2,
        artifacts: 5,
        milestones: 2,
      },
      openTasks: [
        {
          id: "task-7001-1",
          title: "Define evidence masking tests",
          status: "in-progress",
        },
        {
          id: "task-7001-2",
          title: "Add citation support validator",
          status: "open",
        },
        {
          id: "task-7001-3",
          title: "Create drift budget thresholds",
          status: "open",
        },
      ],
      feasibilityChanges: [
        {
          createdAt: "2026-03-18",
          from: 3,
          to: 4,
          note: "Snapshot replay makes regressions attributable; scope feels more tractable.",
        },
        {
          createdAt: "2026-04-05",
          from: 4,
          to: 3,
          note: "Multi-hop grading adds complexity; need a simpler validator baseline.",
        },
      ],
      researchConfidence: 3,
    },
  },
  {
    id: 7002,
    title: "Evidence-first codebase search",
    createdAt: "2026-02-23",
    progressState: "Validating",
    activity: {
      lastActiveAt: "2026-04-02",
      indicator: "Active",
    },
    problemId: p105.id,
    problemTitle: p105.title,
    domainTags: ["DevTools & Systems", "AI/ML"],
    overview: {
      direction:
        "Dual index (structural + embedding) that returns a ranked evidence trace with bounded latency.",
      hypothesis:
        "If structural constraints prune the search space before embedding retrieval, we can keep latency predictable without losing semantic coverage.",
      strategy:
        "Start with import graph + config surface area. Rerank by ‘support strength’ and expose confidence with minimal UI.",
      goals: [
        "Index call/import graph incrementally",
        "Evidence trace UX (files + snippets + rationale)",
        "Latency p95 budget dashboard",
      ],
    },
    contributors: [
      {
        name: "Keiko Tanaka",
        initials: "KT",
        role: "Platform",
        interest: "evidence UX",
        status: "active",
      },
      {
        name: "Rene Alvarez",
        initials: "RA",
        role: "DX",
        interest: "latency budgets",
        status: "idle",
      },
    ],
    artifacts: [
      {
        id: "a-7002-1",
        type: "Prototype",
        title: "Indexer spike",
        description:
          "Incremental indexer prototype over TypeScript repos; emits import graph + embeddings store.",
        updatedAt: "2026-03-17",
        status: "active",
        signal: { label: "p95", value: "180ms" },
      },
      {
        id: "a-7002-2",
        type: "Research note",
        title: "Support scoring heuristics",
        description:
          "Heuristics for evidence support: symbol proximity, config adjacency, and mention density.",
        updatedAt: "2026-03-09",
        status: "active",
      },
      {
        id: "a-7002-3",
        type: "Link",
        title: "Comparable systems",
        description:
          "Notes on Sourcegraph, Cody, and internal tools — strengths and failure modes.",
        href: "https://example.com/notes",
        updatedAt: "2026-02-28",
        status: "draft",
      },
    ],
    timeline: [
      {
        id: "t-7002-1",
        type: "milestone",
        title: "Latency budget defined",
        detail: "Set p95 target and failure modes. Added test corpus and load harness.",
        createdAt: "2026-02-26",
        actor: { name: "Keiko Tanaka", initials: "KT" },
        tags: ["latency"],
      },
      {
        id: "t-7002-2",
        type: "update",
        title: "Evidence trace UX draft",
        detail:
          "Drafted minimal trace UI: top files, support snippets, and confidence factors.",
        createdAt: "2026-03-12",
        actor: { name: "Rene Alvarez", initials: "RA" },
        tags: ["ux"],
      },
    ],
    sidebar: {
      collaborationStats: {
        contributors: 2,
        activeToday: 1,
        artifacts: 3,
        milestones: 1,
      },
      openTasks: [
        { id: "task-7002-1", title: "Rerank by support strength", status: "open" },
        { id: "task-7002-2", title: "Add repo churn test suite", status: "in-progress" },
      ],
      feasibilityChanges: [
        {
          createdAt: "2026-03-01",
          from: 4,
          to: 4,
          note: "Approach holds; primary risk is index maintenance under churn.",
        },
      ],
      researchConfidence: 4,
    },
  },
  {
    id: 7003,
    title: "Monorepo determinism blueprint",
    createdAt: "2026-02-08",
    progressState: "Exploring",
    activity: {
      lastActiveAt: "2026-03-02",
      indicator: "Quiet",
    },
    problemId: p102.id,
    problemTitle: p102.title,
    domainTags: ["DevTools & Systems"],
    overview: {
      direction:
        "A unified workspace manifest that pins toolchains and verifies environment health before builds.",
      hypothesis:
        "If bootstrap and verification are automatic and repeatable, deterministic builds become the default rather than an aspiration.",
      strategy:
        "Map implicit dependencies, define manifests, then validate across OS with fresh-machine simulations.",
      goals: [
        "Manifest spec for toolchains + system deps",
        "Verifier that produces actionable diffs",
        "CI/local parity from a single config source",
      ],
    },
    contributors: [
      {
        name: "Rene Alvarez",
        initials: "RA",
        role: "DX",
        interest: "onboarding",
        status: "idle",
      },
      {
        name: "Keiko Tanaka",
        initials: "KT",
        role: "Platform",
        interest: "toolchains",
        status: "idle",
      },
    ],
    artifacts: [
      {
        id: "a-7003-1",
        type: "Architecture doc",
        title: "Manifest spec v0",
        description:
          "Sketch for a manifest capturing toolchains, platform deltas, and cached installers.",
        updatedAt: "2026-02-21",
        status: "draft",
      },
      {
        id: "a-7003-2",
        type: "Paper",
        title: "Reproducible builds references",
        description:
          "Curated references: Nix, Bazel, hermetic toolchains, and SLSA provenance.",
        updatedAt: "2026-02-18",
        status: "active",
      },
    ],
    timeline: [
      {
        id: "t-7003-1",
        type: "update",
        title: "Dependency map started",
        detail:
          "Collected implicit deps across Node/Python/Rust. Identified OpenSSL and Python headers as frequent failure points.",
        createdAt: "2026-02-10",
        actor: { name: "Rene Alvarez", initials: "RA" },
        tags: ["deps"],
      },
    ],
    sidebar: {
      collaborationStats: {
        contributors: 2,
        activeToday: 0,
        artifacts: 2,
        milestones: 0,
      },
      openTasks: [
        { id: "task-7003-1", title: "Define Windows-first bootstrap", status: "open" },
        { id: "task-7003-2", title: "Prototype verifier output", status: "open" },
      ],
      feasibilityChanges: [
        {
          createdAt: "2026-02-22",
          from: 4,
          to: 3,
          note: "Cross-platform parity is harder than expected; scope needs tightening.",
        },
      ],
      researchConfidence: 2,
    },
  },
];

export function getMockSolutionSpace(id: number): SolutionSpace | undefined {
  return mockSolutionSpaces.find((s) => s.id === id);
}
