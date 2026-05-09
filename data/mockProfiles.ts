import { mockProblems, type Problem, type ProblemDomain } from "@/data/mockProblems";

export type ProfileId = "me" | "mira-chen" | "arjun-patel" | "keiko-tanaka" | "sofia-ionescu";

export type ProfileMetricKey =
  | "problemsContributed"
  | "activeSolutionSpaces"
  | "researchDiscussions"
  | "artifactsPublished"
  | "collaborationScore";

export type ProfileMetrics = Record<ProfileMetricKey, number>;

export type CollaborationIndicator = "Quiet" | "Active" | "High";

export type ProfileContributionState = "active" | "watching" | "archived";

export type ProfileProblemContribution = {
  problemId: Problem["id"];
  involvement: "lead" | "contributor" | "reviewer";
  joinedSolutionSpacesCount: number;
  lastActivityAt: string;
  state: ProfileContributionState;
  note?: string;
};

export type ActivityEventType =
  | "comment"
  | "research update"
  | "artifact"
  | "space joined"
  | "discovery"
  | "decision";

export type ProfileActivityEvent = {
  id: string;
  type: ActivityEventType;
  createdAt: string;
  title: string;
  detail: string;
  tags?: string[];
  entity?:
    | { kind: "problem"; id: number; label: string }
    | { kind: "space"; id: number; label: string };
};

export type Profile = {
  id: ProfileId;
  name: string;
  initials: string;
  title: string;
  bio: string;
  domains: ProblemDomain[];
  interests: string[];
  collaboration: {
    indicator: CollaborationIndicator;
    lastActiveAt: string;
    collaborators: number;
    org?: string;
  };
  metrics: ProfileMetrics;
  contributedProblems: ProfileProblemContribution[];
  activity: ProfileActivityEvent[];
};

function mustFindProblem(id: number): Problem {
  const p = mockProblems.find((x) => x.id === id);
  if (!p) throw new Error(`Missing mock problem: ${id}`);
  return p;
}

const p101 = mustFindProblem(101);
const p102 = mustFindProblem(102);
const p104 = mustFindProblem(104);
const p105 = mustFindProblem(105);
const p107 = mustFindProblem(107);

export const mockProfiles: Profile[] = [
  {
    id: "me",
    name: "Research Operator",
    initials: "RO",
    title: "Product Engineer · Applied Research",
    bio:
      "Builds evidence-first tooling for technical decision-making. Optimizes for reproducibility, evaluation, and human inspection over vibes.",
    domains: ["DevTools & Systems", "AI/ML"],
    interests: [
      "distributed systems",
      "evaluation harnesses",
      "retrieval + evidence",
      "developer experience",
      "reproducible builds",
    ],
    collaboration: {
      indicator: "High",
      lastActiveAt: "2026-05-07",
      collaborators: 14,
      org: "ProblemAtlas",
    },
    metrics: {
      problemsContributed: 6,
      activeSolutionSpaces: 2,
      researchDiscussions: 18,
      artifactsPublished: 9,
      collaborationScore: 78,
    },
    contributedProblems: [
      {
        problemId: p105.id,
        involvement: "lead",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-04-21",
        state: "active",
        note: "Driving evidence-trace UX + bounded latency evaluation.",
      },
      {
        problemId: p101.id,
        involvement: "contributor",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-04-06",
        state: "watching",
        note: "Helping define drift primitives and corpus replay packets.",
      },
      {
        problemId: p102.id,
        involvement: "reviewer",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-03-02",
        state: "watching",
      },
    ],
    activity: [
      {
        id: "me-a1",
        type: "research update",
        createdAt: "2026-05-07",
        title: "Defined evidence factors list",
        detail:
          "Drafted an evidence-factor vocabulary (symbol proximity, config adjacency, mention density) to keep confidence inspectable.",
        tags: ["evidence", "ux"],
        entity: { kind: "space", id: 7002, label: "Evidence-first codebase search" },
      },
      {
        id: "me-a2",
        type: "comment",
        createdAt: "2026-04-21",
        title: "Latency is part of trust",
        detail:
          "Argued for bounded p95 by construction: structural prune → semantic retrieve → support rerank. Avoid hidden slow paths.",
        tags: ["latency"],
        entity: { kind: "problem", id: p105.id, label: p105.title },
      },
      {
        id: "me-a3",
        type: "artifact",
        createdAt: "2026-04-02",
        title: "Published architecture sketch",
        detail:
          "Shared a minimal architecture doc: evaluator core, adapters, versioned packets, and report surfaces.",
        tags: ["architecture"],
        entity: { kind: "space", id: 7001, label: "RAG Drift Harness v0" },
      },
    ],
  },
  {
    id: "mira-chen",
    name: "Mira Chen",
    initials: "MC",
    title: "Applied ML Researcher",
    bio:
      "Works on evaluation, robustness, and evidence alignment for RAG and agentic systems. Prefers metrics that explain failure modes.",
    domains: ["AI/ML"],
    interests: [
      "multi-hop grounding",
      "calibration",
      "adversarial evaluation",
      "retrieval drift",
    ],
    collaboration: {
      indicator: "Active",
      lastActiveAt: "2026-04-12",
      collaborators: 9,
      org: "Independent",
    },
    metrics: {
      problemsContributed: 4,
      activeSolutionSpaces: 1,
      researchDiscussions: 11,
      artifactsPublished: 5,
      collaborationScore: 71,
    },
    contributedProblems: [
      {
        problemId: p101.id,
        involvement: "lead",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-04-02",
        state: "active",
        note: "Pushing hop-aware grading + evidence masking tests.",
      },
      {
        problemId: p107.id,
        involvement: "reviewer",
        joinedSolutionSpacesCount: 0,
        lastActivityAt: "2026-03-06",
        state: "watching",
      },
    ],
    activity: [
      {
        id: "mc-a1",
        type: "decision",
        createdAt: "2026-04-02",
        title: "Defined forced regression suite",
        detail:
          "Outlined deterministic regressions: evidence masking, contradiction injection, and chunk boundary shifts for multi-hop queries.",
        tags: ["metrics", "multi-hop"],
        entity: { kind: "space", id: 7001, label: "RAG Drift Harness v0" },
      },
      {
        id: "mc-a2",
        type: "comment",
        createdAt: "2026-03-13",
        title: "Stable anchors reduce drift ambiguity",
        detail:
          "Suggested canonical anchors (file@commit, doc@version) so drift is measured as anchor movement rather than prose diffs.",
        tags: ["drift"],
        entity: { kind: "problem", id: p101.id, label: p101.title },
      },
    ],
  },
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    initials: "AP",
    title: "Infra Engineer",
    bio:
      "Builds reproducible pipelines and platform layers. Invests in deterministic tooling to reduce iteration cost and regressions.",
    domains: ["DevTools & Systems"],
    interests: [
      "snapshotting",
      "indexing systems",
      "artifact provenance",
      "build determinism",
    ],
    collaboration: {
      indicator: "High",
      lastActiveAt: "2026-04-06",
      collaborators: 12,
      org: "Platform",
    },
    metrics: {
      problemsContributed: 5,
      activeSolutionSpaces: 2,
      researchDiscussions: 10,
      artifactsPublished: 6,
      collaborationScore: 74,
    },
    contributedProblems: [
      {
        problemId: p101.id,
        involvement: "contributor",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-04-06",
        state: "active",
        note: "Snapshot replay pipeline + evaluation packets.",
      },
      {
        problemId: p105.id,
        involvement: "reviewer",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-03-17",
        state: "watching",
      },
      {
        problemId: p102.id,
        involvement: "lead",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-02-22",
        state: "watching",
      },
    ],
    activity: [
      {
        id: "ap-a1",
        type: "research update",
        createdAt: "2026-04-06",
        title: "Replay CLI prototype ready",
        detail:
          "Delivered a CLI that snapshots docs sources and replays a fixed query suite with evidence diffs and score deltas.",
        tags: ["prototype", "repro"],
        entity: { kind: "space", id: 7001, label: "RAG Drift Harness v0" },
      },
      {
        id: "ap-a2",
        type: "comment",
        createdAt: "2026-03-04",
        title: "Evaluation packets for attribution",
        detail:
          "Proposed a single packet format: corpus hash, indexing config, model/provider version, prompt template — to isolate variance.",
        tags: ["repro"],
        entity: { kind: "problem", id: p101.id, label: p101.title },
      },
    ],
  },
  {
    id: "keiko-tanaka",
    name: "Keiko Tanaka",
    initials: "KT",
    title: "Platform Engineer",
    bio:
      "Designs systems that trade latency for trust in principled ways. Focused on evidence surfaces, not just retrieval scores.",
    domains: ["DevTools & Systems", "AI/ML"],
    interests: [
      "evidence UX",
      "index maintenance",
      "structural analysis",
      "bounded latency",
    ],
    collaboration: {
      indicator: "Active",
      lastActiveAt: "2026-03-17",
      collaborators: 7,
      org: "Platform",
    },
    metrics: {
      problemsContributed: 3,
      activeSolutionSpaces: 1,
      researchDiscussions: 6,
      artifactsPublished: 4,
      collaborationScore: 63,
    },
    contributedProblems: [
      {
        problemId: p105.id,
        involvement: "lead",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-03-17",
        state: "active",
        note: "Leads evidence-first search direction and support scoring.",
      },
      {
        problemId: p104.id,
        involvement: "reviewer",
        joinedSolutionSpacesCount: 0,
        lastActivityAt: "2026-02-10",
        state: "archived",
      },
    ],
    activity: [
      {
        id: "kt-a1",
        type: "comment",
        createdAt: "2026-03-12",
        title: "Explainable ranking factors",
        detail:
          "Recommended ranking transparency: symbol proximity, config adjacency, and mention density. Avoid a single opaque similarity score.",
        tags: ["evidence"],
        entity: { kind: "problem", id: p105.id, label: p105.title },
      },
    ],
  },
  {
    id: "sofia-ionescu",
    name: "Sofia Ionescu",
    initials: "SI",
    title: "Research Scientist",
    bio:
      "Interested in structured evaluation and uncertainty. Tends to ask: what breaks, under what distribution shift, and how we know.",
    domains: ["AI/ML", "Physics"],
    interests: [
      "structured outputs",
      "uncertainty",
      "adversarial tests",
      "physics priors",
    ],
    collaboration: {
      indicator: "Quiet",
      lastActiveAt: "2026-03-29",
      collaborators: 5,
      org: "Research",
    },
    metrics: {
      problemsContributed: 3,
      activeSolutionSpaces: 1,
      researchDiscussions: 7,
      artifactsPublished: 3,
      collaborationScore: 58,
    },
    contributedProblems: [
      {
        problemId: p101.id,
        involvement: "contributor",
        joinedSolutionSpacesCount: 1,
        lastActivityAt: "2026-03-29",
        state: "watching",
        note: "Proposed adversarial masking tests for multi-hop stability.",
      },
      {
        problemId: 106,
        involvement: "lead",
        joinedSolutionSpacesCount: 0,
        lastActivityAt: "2026-01-22",
        state: "watching",
      },
    ],
    activity: [
      {
        id: "si-a1",
        type: "discovery",
        createdAt: "2026-03-29",
        title: "Citation drift is mostly anchor-level",
        detail:
          "Noted that answers can remain stable while citations shift; drift needs anchor tracking and support validation.",
        tags: ["drift"],
        entity: { kind: "problem", id: p101.id, label: p101.title },
      },
    ],
  },
];

export function getMockProfile(id: string): Profile | undefined {
  if (id === "me") return mockProfiles.find((p) => p.id === "me");
  return mockProfiles.find((p) => p.id === id);
}

export function getMockProblemById(id: number): Problem | undefined {
  return mockProblems.find((p) => p.id === id);
}
