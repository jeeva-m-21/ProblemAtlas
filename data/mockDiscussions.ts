export type DiscussionEntityType = "problem" | "space";

export type DiscussionAuthor = {
  name: string;
  initials: string;
  role: string;
};

export type DiscussionComment = {
  id: string;
  parentId?: string;
  author: DiscussionAuthor;
  createdAt: string;
  body: string;
  tags?: string[];
};

export type DiscussionThread = {
  id: string;
  entityType: DiscussionEntityType;
  entityId: number;
  title: string;
  description: string;
  tags: string[];
  comments: DiscussionComment[];
};

export const mockDiscussions: DiscussionThread[] = [
  {
    id: "thr-problem-101",
    entityType: "problem",
    entityId: 101,
    title: "Evaluation harness: what do we measure first?",
    description:
      "High-signal discussion focused on measurement primitives for drift + multi-hop grounding.",
    tags: ["metrics", "drift", "multi-hop"],
    comments: [
      {
        id: "c101-1",
        author: { name: "Mira Chen", initials: "MC", role: "Applied ML" },
        createdAt: "2026-03-02",
        tags: ["metrics"],
        body:
          "Proposal: treat *evidence quality* as a first-class signal, separate from answer fluency.\n\nMinimum viable metrics: (1) claim→citation alignment, (2) citation stability across corpus snapshots, (3) hop-level support (each intermediate claim must be entailed by retrieved passages).",
      },
      {
        id: "c101-2",
        parentId: "c101-1",
        author: { name: "Arjun Patel", initials: "AP", role: "Infra" },
        createdAt: "2026-03-04",
        tags: ["repro"],
        body:
          "+1 on separation. From an infra standpoint, snapshot replay is the unlock. Without it, you can’t attribute regressions (retrieval vs generation vs corpus).\n\nWe should define an ‘evaluation packet’: corpus hash + indexing config + model/provider version + prompt template.",
      },
      {
        id: "c101-3",
        parentId: "c101-2",
        author: { name: "Sofia Ionescu", initials: "SI", role: "Research" },
        createdAt: "2026-03-09",
        tags: ["multi-hop"],
        body:
          "One challenge: hop-level grading can be gamed unless we require structured outputs. If we do: claims[], citations[], edges[], we can validate *graph consistency* under evidence masking.\n\nAdversarial check: remove one supporting passage and see if the claim survives (it shouldn’t).",
      },
      {
        id: "c101-4",
        author: { name: "Theo Park", initials: "TP", role: "Systems" },
        createdAt: "2026-03-12",
        tags: ["failure-modes"],
        body:
          "Don’t forget silent failures: the answer can be directionally correct but cites the wrong commit / wrong doc revision. The harness should flag mismatch between *anchor* (what the user should click) vs *support* (what the model used).",
      },
      {
        id: "c101-5",
        parentId: "c101-4",
        author: { name: "Mira Chen", initials: "MC", role: "Applied ML" },
        createdAt: "2026-03-13",
        body:
          "Yes. That suggests an additional primitive: stable source IDs + canonical anchors (e.g., file@commit, doc@version). Then drift can be computed as anchor movement, not just textual diff.",
      },
      {
        id: "c101-6",
        author: { name: "Rene Alvarez", initials: "RA", role: "Developer Experience" },
        createdAt: "2026-03-18",
        tags: ["ux"],
        body:
          "UX thought: show a compact ‘evidence trace’ as the primary output. The score is secondary. People trust what they can *inspect*.\n\nIf the harness outputs a small report: (a) top claims, (b) supporting passages, (c) what changed since last snapshot — that’s actionable.",
      },
    ],
  },
  {
    id: "thr-space-7001",
    entityType: "space",
    entityId: 7001,
    title: "Drift Harness v0: milestone planning",
    description:
      "Operational thread to converge on deliverables, tasks, and evaluation gates.",
    tags: ["prototype", "planning"],
    comments: [
      {
        id: "s7001-1",
        author: { name: "Arjun Patel", initials: "AP", role: "Infra" },
        createdAt: "2026-04-01",
        tags: ["milestone"],
        body:
          "Milestone proposal:\n- Snapshot docs sources (stable IDs)\n- Replay suite v0 (40–50 queries)\n- Diff report: evidence changes + score deltas\n\nGate: detect 80% of forced regressions (mask evidence, swap reranker, etc.).",
      },
      {
        id: "s7001-2",
        parentId: "s7001-1",
        author: { name: "Mira Chen", initials: "MC", role: "Applied ML" },
        createdAt: "2026-04-02",
        tags: ["metrics"],
        body:
          "Agree on gate, but let’s define forced regressions precisely. For multi-hop: (1) remove one supporting chunk, (2) inject contradictory chunk, (3) shift chunk boundaries.\n\nWe should see: hop support drops, citation changes become visible, and the system refuses overconfident claims.",
      },
      {
        id: "s7001-3",
        author: { name: "Sofia Ionescu", initials: "SI", role: "Research" },
        createdAt: "2026-04-03",
        tags: ["risk"],
        body:
          "Implementation risk: if we rely on an NLI model for entailment, it becomes another moving part. Can we start with weaker validators (overlap + contradiction keywords) and layer stronger ones later?",
      },
      {
        id: "s7001-4",
        parentId: "s7001-3",
        author: { name: "Theo Park", initials: "TP", role: "Systems" },
        createdAt: "2026-04-04",
        body:
          "+1. Baseline validators should be deterministic and cheap. Then we can add ML validators as optional plugins, but the core replay pipeline stays stable.",
      },
      {
        id: "s7001-5",
        author: { name: "Rene Alvarez", initials: "RA", role: "DX" },
        createdAt: "2026-04-05",
        tags: ["deliverable"],
        body:
          "Deliverable suggestion: a single ‘dossier’ page per query run. The UI should show evidence diffs over time, not raw logs. If it’s readable, it becomes the team’s shared language.",
      },
    ],
  },
  {
    id: "thr-space-7002",
    entityType: "space",
    entityId: 7002,
    title: "Evidence-first search: confidence + failure cases",
    description:
      "Thread focusing on how we communicate uncertainty and avoid misleading semantic matches.",
    tags: ["evidence", "latency"],
    comments: [
      {
        id: "s7002-1",
        author: { name: "Keiko Tanaka", initials: "KT", role: "Platform" },
        createdAt: "2026-03-12",
        tags: ["evidence"],
        body:
          "We should expose *why* something ranks: symbol proximity, config adjacency, or direct mention density. A single embedding score is not inspectable.",
      },
      {
        id: "s7002-2",
        parentId: "s7002-1",
        author: { name: "Rene Alvarez", initials: "RA", role: "DX" },
        createdAt: "2026-03-13",
        tags: ["ux"],
        body:
          "Agreed. UI pattern: ‘evidence factors’ list with small weights. Also show known failure modes: “semantic match but not referenced by build graph.”",
      },
      {
        id: "s7002-3",
        author: { name: "Arjun Patel", initials: "AP", role: "Infra" },
        createdAt: "2026-03-17",
        tags: ["latency"],
        body:
          "We need bounded latency by construction. Suggest two-phase: structural prune → semantic retrieve → support rerank. Also: cache invalidation based on commit hash to keep churn sane.",
      },
    ],
  },
];

export function getMockThreadById(id: string): DiscussionThread | undefined {
  return mockDiscussions.find((t) => t.id === id);
}

export function getMockThreadsForEntity(
  entityType: DiscussionEntityType,
  entityId: number
): DiscussionThread[] {
  return mockDiscussions.filter(
    (t) => t.entityType === entityType && t.entityId === entityId
  );
}
