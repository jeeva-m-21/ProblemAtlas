import { mockProblems, type Problem, type ProblemDomain } from "@/data/mockProblems";

export type ProblemComment = {
  id: string;
  author: {
    name: string;
    initials: string;
    role: string;
  };
  createdAt: string; // ISO-like string for display
  body: string;
  tags?: string[];
};

export type ResearchGapKind =
  | "system limitation"
  | "open challenge"
  | "bottleneck"
  | "implementation barrier";

export type ResearchGap = {
  kind: ResearchGapKind;
  title: string;
  detail: string;
};

export type PossibleDirection = {
  title: string;
  summary: string;
  opportunities: string[];
  evaluation: string[];
  risks?: string[];
};

export type ProblemDetail = Problem & {
  createdAt: string;
  implementationDifficulty: 1 | 2 | 3 | 4 | 5;
  relatedDomains: ProblemDomain[];
  collaborators: Array<{
    name: string;
    initials: string;
    status: "active" | "idle";
  }>;
  summaryDetail: {
    explanation: string[];
    gap: string[];
    failureModes: string[];
    whyItMatters: string[];
  };
  researchGaps: ResearchGap[];
  possibleDirections: PossibleDirection[];
  discussionPreview: {
    totalCount: number;
    comments: ProblemComment[];
  };
};

function mustFindBaseProblem(id: number): Problem {
  const base = mockProblems.find((p) => p.id === id);
  if (!base) {
    throw new Error(`Missing base mock problem: ${id}`);
  }
  return base;
}

export const mockProblemDetails: ProblemDetail[] = [
  {
    ...mustFindBaseProblem(101),
    createdAt: "2026-02-12",
    implementationDifficulty: 4,
    relatedDomains: ["AI/ML", "DevTools & Systems"],
    collaborators: [
      { name: "Mira Chen", initials: "MC", status: "active" },
      { name: "Arjun Patel", initials: "AP", status: "active" },
      { name: "Sofia Ionescu", initials: "SI", status: "idle" },
      { name: "Theo Park", initials: "TP", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Modern RAG systems look credible while failing silently: retrieval changes over time, citations drift, and multi-hop reasoning amplifies small grounding errors.",
        "This problem targets evaluation — not just accuracy — with emphasis on repeatability under changing corpora and evolving pipelines.",
      ],
      gap: [
        "Teams ship RAG features with ad‑hoc spot checks. There is no standard harness that can (a) replay queries across corpus snapshots, (b) score evidence alignment, and (c) identify when the model’s chain depends on missing or misattributed sources.",
        "Multi-hop technical queries (architecture, APIs, incidents) are the stress case: one incorrect hop can make the entire answer unusable.",
      ],
      failureModes: [
        "Citation drift: links are correct-looking but no longer support the claim due to repo churn or doc edits.",
        "Evidence misalignment: retrieved passages are tangential; the model composes a plausible answer anyway.",
        "Evaluation leakage: benchmarks are overly templated; models learn artifacts instead of robustness.",
      ],
      whyItMatters: [
        "Evaluation is a safety and product reliability problem: if you can’t detect drift, you can’t trust improvements or regressions.",
        "A strong harness becomes infrastructure: it enables model/provider swaps, retrieval refactors, and corpus updates without guessing.",
      ],
    },
    researchGaps: [
      {
        kind: "system limitation",
        title: "No stable notion of evidence under corpus churn",
        detail:
          "Most systems score answers against a moving target. Without corpus versioning + replay, you can’t attribute regressions to retrieval vs generation vs data.",
      },
      {
        kind: "open challenge",
        title: "Scoring multi-hop alignment, not just final text",
        detail:
          "We need metrics that validate intermediate claims and dependency structure (which passages support which hop), not only end output similarity.",
      },
      {
        kind: "bottleneck",
        title: "Gold data is expensive and quickly stale",
        detail:
          "Human-labeled multi-hop traces are slow to produce. A harness should bootstrap from weak signals: retrieval overlap, entailment checks, and contradiction detection.",
      },
      {
        kind: "implementation barrier",
        title: "Reproducibility across infra + providers",
        detail:
          "Small changes (rerankers, chunking, embeddings, model versions) change behavior. The harness must standardize config capture and isolate variance.",
      },
    ],
    possibleDirections: [
      {
        title: "Corpus snapshot replay + drift alarms",
        summary:
          "Treat the corpus as a versioned dataset and replay a fixed query suite across snapshots to quantify evidence drift.",
        opportunities: [
          "Build a snapshotting layer for doc + repo sources with stable IDs.",
          "Add attribution diffing: highlight which citations changed and why.",
          "Design “drift budgets” per domain (docs vs code vs tickets).",
        ],
        evaluation: [
          "Drift rate over time per query.",
          "Claim‑to‑evidence alignment score.",
          "Regression detection latency (how fast you detect a break).",
        ],
        risks: [
          "Storage/ingestion cost for snapshots.",
          "False positives if sources are semantically equivalent but text-shifted.",
        ],
      },
      {
        title: "Hop-aware grading with structured outputs",
        summary:
          "Require models to output a minimal dependency graph (claims → sources) and grade the graph, not prose.",
        opportunities: [
          "Introduce a constrained schema for steps/hops.",
          "Use NLI/entailment to validate hop-level claims.",
          "Auto-generate counterfactual tests by masking evidence.",
        ],
        evaluation: [
          "Graph consistency under evidence masking.",
          "Fraction of hops directly supported by retrieved passages.",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 18,
      comments: [
        {
          id: "c-101-1",
          author: { name: "Mira Chen", initials: "MC", role: "Applied ML" },
          createdAt: "2026-03-02",
          body:
            "We should separate *answer quality* from *evidence quality*. A harness that can explain ‘why this is wrong’ is more valuable than a single scalar score.",
          tags: ["metrics", "evaluation"],
        },
        {
          id: "c-101-2",
          author: { name: "Arjun Patel", initials: "AP", role: "Infra" },
          createdAt: "2026-03-04",
          body:
            "Corpus snapshotting is non-negotiable. Otherwise every improvement is confounded by indexing changes. We can start with docs-only snapshots.",
          tags: ["repro"],
        },
        {
          id: "c-101-3",
          author: { name: "Sofia Ionescu", initials: "SI", role: "Research" },
          createdAt: "2026-03-09",
          body:
            "For multi-hop, we may need *adversarial* queries: hide one supporting passage and see if the model still asserts the claim.",
          tags: ["multi-hop"],
        },
      ],
    },
  },
  {
    ...mustFindBaseProblem(102),
    createdAt: "2026-01-27",
    implementationDifficulty: 3,
    relatedDomains: ["DevTools & Systems"],
    collaborators: [
      { name: "Rene Alvarez", initials: "RA", status: "active" },
      { name: "Keiko Tanaka", initials: "KT", status: "idle" },
      { name: "Arjun Patel", initials: "AP", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Polyglot monorepos collapse under “works on my machine” variance: OS differences, toolchain drift, and implicit dependencies.",
        "The goal is deterministic, low-friction environments: identical builds and tests across macOS/Linux/Windows with a predictable developer loop.",
      ],
      gap: [
        "Containers help but can be heavy or leaky. Nix helps but can be steep. Devcontainers help but aren’t always reproducible. Teams mix approaches and suffer silent inconsistency.",
      ],
      failureModes: [
        "Undeclared system dependencies (OpenSSL, Python headers, libc quirks).",
        "Lockfiles that don’t pin the full toolchain (Node, Rust, Python).",
        "CI passes while local differs due to env or caches.",
      ],
      whyItMatters: [
        "Determinism is engineering throughput: fewer flaky tests, fewer onboarding days, fewer production surprises.",
        "A deterministic environment is also a security story: you can reproduce artifacts and audits.",
      ],
    },
    researchGaps: [
      {
        kind: "system limitation",
        title: "Toolchain pinning is incomplete",
        detail:
          "Most stacks pin package versions but not compilers, system libs, or platform-specific behavior.",
      },
      {
        kind: "bottleneck",
        title: "Developer loop vs hermeticity tradeoff",
        detail:
          "Perfect hermetic builds often slow iteration. We need a middle layer that preserves determinism without killing speed.",
      },
      {
        kind: "implementation barrier",
        title: "Cross-platform parity",
        detail:
          "Windows support is frequently bolted on. The system must treat Windows as first-class rather than best-effort.",
      },
    ],
    possibleDirections: [
      {
        title: "Workspace manifests + verified bootstrap",
        summary:
          "Define a single manifest that pins toolchains and validates local state before running builds.",
        opportunities: [
          "Auto-detect missing system deps and provide deterministic installers.",
          "Cache compiled toolchains per manifest hash.",
          "Generate CI + local configs from the same source.",
        ],
        evaluation: [
          "Reproducibility rate across OS + fresh machines.",
          "Cold-start bootstrap time.",
          "Flake rate for tests/builds.",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 9,
      comments: [
        {
          id: "c-102-1",
          author: { name: "Rene Alvarez", initials: "RA", role: "Developer Experience" },
          createdAt: "2026-02-02",
          body:
            "We should measure determinism like SLOs: % identical builds across 50 fresh machines. Make it visible.",
          tags: ["dx"],
        },
        {
          id: "c-102-2",
          author: { name: "Keiko Tanaka", initials: "KT", role: "Platform" },
          createdAt: "2026-02-06",
          body:
            "If we can unify ‘bootstrap’ and ‘verify’ steps, devs won’t have to remember magic setup docs.",
        },
      ],
    },
  },
  {
    ...mustFindBaseProblem(103),
    createdAt: "2025-12-19",
    implementationDifficulty: 5,
    relatedDomains: ["Healthcare", "AI/ML"],
    collaborators: [
      { name: "Nadia Rossi", initials: "NR", status: "active" },
      { name: "Sofia Ionescu", initials: "SI", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Wearables generate continuous streams — messy, biased, and context-dependent. “Anomaly detection” is easy to demo and hard to trust.",
        "We want near-real-time detection of meaningful deviation from personal baseline, with interpretable reasons and low false alarms.",
      ],
      gap: [
        "Current systems either over-alert (eroding trust) or smooth away the signals that matter. Clinical relevance is rarely aligned with model metrics.",
      ],
      failureModes: [
        "Distribution shift: device placement, firmware changes, lifestyle changes.",
        "Label scarcity: most events are unobserved or ambiguous.",
        "User trust: black-box alerts are ignored.",
      ],
      whyItMatters: [
        "False alarms are a product failure and a safety risk.",
        "If done well, these systems can detect early deterioration and reduce burden on care systems.",
      ],
    },
    researchGaps: [
      {
        kind: "open challenge",
        title: "Clinically meaningful ground truth",
        detail:
          "We need robust definitions of ‘meaningful deviation’ that map to clinical outcomes, not just statistical anomalies.",
      },
      {
        kind: "bottleneck",
        title: "Personalized baselines",
        detail:
          "Population models miss individual variance. Baselines need to adapt while resisting drift from noise.",
      },
      {
        kind: "implementation barrier",
        title: "On-device constraints + privacy",
        detail:
          "Latency, battery, and privacy constraints force careful model design and on-device interpretability.",
      },
    ],
    possibleDirections: [
      {
        title: "Hybrid rules + learned residual",
        summary:
          "Use physiologic heuristics as guardrails, with a learned model capturing residual patterns.",
        opportunities: [
          "Reduce false positives with context features (sleep, steps).",
          "Expose interpretable factors in alerts.",
        ],
        evaluation: [
          "Alert precision under user-reported outcomes.",
          "Time-to-detection for known events.",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 6,
      comments: [
        {
          id: "c-103-1",
          author: { name: "Nadia Rossi", initials: "NR", role: "Health ML" },
          createdAt: "2026-01-05",
          body:
            "We should treat this as an *interpretability-first* problem. The alert must answer: what changed, vs baseline, and why we trust it.",
          tags: ["trust"],
        },
      ],
    },
  },
  {
    ...mustFindBaseProblem(104),
    createdAt: "2026-03-21",
    implementationDifficulty: 5,
    relatedDomains: ["Robotics", "AI/ML"],
    collaborators: [
      { name: "Theo Park", initials: "TP", status: "active" },
      { name: "Mira Chen", initials: "MC", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Cheap depth sensors and noisy odometry create brittle maps. Policies that work in sim degrade in real indoor spaces.",
        "The objective is robust navigation with uncertainty-aware control and sim-to-real transfer that survives clutter and sensor artifacts.",
      ],
      gap: [
        "Most sim environments are too clean, and most learned policies overfit to simulator physics. Reality introduces glare, missing depth, people, and unmodeled dynamics.",
      ],
      failureModes: [
        "Depth dropouts and reflective surfaces.",
        "Dynamic obstacles not represented in sim.",
        "Compounding error from odometry drift.",
      ],
      whyItMatters: [
        "Lower-cost indoor robots become viable only if they can safely operate in real homes/offices.",
      ],
    },
    researchGaps: [
      {
        kind: "open challenge",
        title: "Uncertainty modeling that drives control",
        detail:
          "We need uncertainty estimates that are actionable: they must influence exploration vs caution.",
      },
      {
        kind: "bottleneck",
        title: "Data collection in diverse indoor spaces",
        detail:
          "Broad coverage is expensive. The system should learn from small amounts of real data via domain adaptation.",
      },
      {
        kind: "implementation barrier",
        title: "Safety constraints in learning loop",
        detail:
          "Deploying policies requires guardrails, fallbacks, and monitoring that are often absent in research prototypes.",
      },
    ],
    possibleDirections: [
      {
        title: "Feature learning with synthetic corruption",
        summary:
          "Train mapping features under heavy sensor corruption to approximate real-world noise.",
        opportunities: [
          "Simulate structured missing depth + glare.",
          "Use uncertainty-aware fusion between depth + IMU.",
        ],
        evaluation: [
          "Collision rate under new environments.",
          "Localization stability (drift per meter).",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 11,
      comments: [
        {
          id: "c-104-1",
          author: { name: "Theo Park", initials: "TP", role: "Robotics" },
          createdAt: "2026-04-01",
          body:
            "We should log *uncertainty maps* over trajectories. They’re the missing interface between perception and control.",
        },
      ],
    },
  },
  {
    ...mustFindBaseProblem(105),
    createdAt: "2026-02-03",
    implementationDifficulty: 3,
    relatedDomains: ["DevTools & Systems", "AI/ML"],
    collaborators: [
      { name: "Keiko Tanaka", initials: "KT", status: "active" },
      { name: "Rene Alvarez", initials: "RA", status: "idle" },
      { name: "Arjun Patel", initials: "AP", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Architecture questions need predictable latency and trustworthy evidence. Embeddings alone can be fast but opaque; symbolic analysis alone can be brittle.",
        "The goal is approximate search over large repos that stays transparent: answers must cite code + config and explain uncertainty.",
      ],
      gap: [
        "Most code search tools trade trust for speed or vice versa. Teams need a system that makes evidence first-class while keeping latency bounded.",
      ],
      failureModes: [
        "Semantic matches without compile-level correctness.",
        "Over-reliance on README/docs that don’t match code.",
        "Latency spikes with repo size.",
      ],
      whyItMatters: [
        "This becomes the substrate for “repo-native intelligence” — onboarding, incident response, refactors.",
      ],
    },
    researchGaps: [
      {
        kind: "system limitation",
        title: "Evidence selection is unprincipled",
        detail:
          "Retrieval often optimizes similarity, not support. We need retrieval that targets *supporting* artifacts.",
      },
      {
        kind: "bottleneck",
        title: "Index maintenance under churn",
        detail:
          "Large repos churn constantly; indexes degrade unless incrementally updated and validated.",
      },
      {
        kind: "implementation barrier",
        title: "Transparent scoring",
        detail:
          "Users need to understand confidence, provenance, and failure cases. That implies interpretable scoring and UI.",
      },
    ],
    possibleDirections: [
      {
        title: "Dual index: structural + embedding",
        summary:
          "Combine symbol graph (imports, callgraph) with embedding retrieval to propose candidates, then rerank by support.",
        opportunities: [
          "Use structural constraints to prune irrelevant files.",
          "Expose “evidence trace” with minimal UI.",
        ],
        evaluation: [
          "Latency p95 on large repos.",
          "Correct evidence rate (human-judged).",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 14,
      comments: [
        {
          id: "c-105-1",
          author: { name: "Keiko Tanaka", initials: "KT", role: "Platform" },
          createdAt: "2026-02-18",
          body:
            "If we treat evidence as a product primitive, the model choice becomes a detail. UI should bias toward artifacts first.",
          tags: ["evidence"],
        },
        {
          id: "c-105-2",
          author: { name: "Rene Alvarez", initials: "RA", role: "DX" },
          createdAt: "2026-02-21",
          body:
            "Predictable latency is part of trust. If p95 swings, users stop using it.",
        },
      ],
    },
  },
  {
    ...mustFindBaseProblem(106),
    createdAt: "2026-01-09",
    implementationDifficulty: 5,
    relatedDomains: ["Physics", "AI/ML"],
    collaborators: [
      { name: "Sofia Ionescu", initials: "SI", status: "active" },
      { name: "Mira Chen", initials: "MC", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Inverse problems in fluid dynamics demand reconstructions that respect physics, not just fit data.",
        "Sparse and irregular sensors make the problem ill-posed; uncertainty must be quantified and communicated.",
      ],
      gap: [
        "Many methods optimize reconstruction error but ignore constraints or uncertainty. In practice you need *credible intervals* and constraint adherence.",
      ],
      failureModes: [
        "Overfitting sparse measurements.",
        "Violation of physical priors (mass conservation, boundary conditions).",
        "Uncertainty that is miscalibrated.",
      ],
      whyItMatters: [
        "Better reconstructions improve control and forecasting in energy, climate, and industrial systems.",
      ],
    },
    researchGaps: [
      {
        kind: "open challenge",
        title: "Physics-constrained uncertainty",
        detail:
          "Uncertainty estimates must respect constraints; otherwise you get confident-but-incorrect fields.",
      },
      {
        kind: "bottleneck",
        title: "Sparse sensor placement",
        detail:
          "Sensor layout dominates identifiability. Methods should incorporate sensor selection as part of the problem.",
      },
    ],
    possibleDirections: [
      {
        title: "Constraint-first reconstruction",
        summary:
          "Use differentiable physics priors with probabilistic inference to produce calibrated uncertainty.",
        opportunities: [
          "Enforce constraints via penalty or projection methods.",
          "Assess calibration on synthetic regimes.",
        ],
        evaluation: [
          "Constraint violation rate.",
          "Calibration error (reliability diagrams).",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 4,
      comments: [
        {
          id: "c-106-1",
          author: { name: "Sofia Ionescu", initials: "SI", role: "Research" },
          createdAt: "2026-01-22",
          body:
            "We should treat sensor placement as a co-design problem with the inference model. Otherwise we optimize the wrong thing.",
        },
      ],
    },
  },
  {
    ...mustFindBaseProblem(107),
    createdAt: "2026-02-25",
    implementationDifficulty: 2,
    relatedDomains: ["AI/ML"],
    collaborators: [
      { name: "Mira Chen", initials: "MC", status: "active" },
      { name: "Nadia Rossi", initials: "NR", status: "idle" },
    ],
    summaryDetail: {
      explanation: [
        "Speech enhancement on-device is a constraints problem: latency, compute, and perceptual quality.",
        "The target is intelligibility improvement without the robotic artifacts that destroy user trust.",
      ],
      gap: [
        "Many models look good on benchmark metrics but fail in real calls: double-talk, reverb, non-stationary noise, and device variance.",
      ],
      failureModes: [
        "Musical noise / warbling artifacts.",
        "Latency increases that break turn-taking.",
        "Suppression of quiet phonemes.",
      ],
      whyItMatters: [
        "Call quality is a daily UX surface. Good enhancement can reduce fatigue and improve accessibility.",
      ],
    },
    researchGaps: [
      {
        kind: "bottleneck",
        title: "Perceptual metrics that predict user preference",
        detail:
          "Objective metrics correlate weakly with “sounds natural.” We need evaluation that matches human preference under constraints.",
      },
      {
        kind: "implementation barrier",
        title: "On-device deployment variability",
        detail:
          "Different chips, mic arrays, and OS audio paths can destabilize performance; the model must be robust to device variance.",
      },
    ],
    possibleDirections: [
      {
        title: "Artifact-aware training objective",
        summary:
          "Add losses or discriminators that penalize warble/robotic artifacts explicitly, not just SNR.",
        opportunities: [
          "Build a small artifact classifier as an auxiliary head.",
          "Use preference data from listening tests.",
        ],
        evaluation: [
          "Mean opinion score (MOS) under real call conditions.",
          "Latency and CPU budget adherence.",
        ],
      },
    ],
    discussionPreview: {
      totalCount: 7,
      comments: [
        {
          id: "c-107-1",
          author: { name: "Nadia Rossi", initials: "NR", role: "Audio ML" },
          createdAt: "2026-03-06",
          body:
            "Intelligibility is necessary but not sufficient — users will reject enhancement if it changes their voice identity.",
          tags: ["perception"],
        },
      ],
    },
  },
];

export function getMockProblemDetail(id: number): ProblemDetail | undefined {
  return mockProblemDetails.find((p) => p.id === id);
}
