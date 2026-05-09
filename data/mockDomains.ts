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
  signals: {
    label: string;
    value: string;
  }[];
};

export const mockDomains: Domain[] = [
  {
    key: "ai-ml",
    label: "AI/ML",
    description:
      "Evaluation harnesses, retrieval systems, model reliability, and traceable interfaces.",
    signals: [
      { label: "focus", value: "eval + evidence" },
      { label: "surface", value: "RAG, tooling" },
    ],
  },
  {
    key: "distributed-systems",
    label: "Distributed Systems",
    description:
      "Consistency, observability, queueing, fault tolerance, and reliability design.",
    signals: [
      { label: "signal", value: "latency budgets" },
      { label: "mode", value: "failure analysis" },
    ],
  },
  {
    key: "robotics",
    label: "Robotics",
    description:
      "Mapping, control, sim-to-real, sensor fusion, and uncertainty-aware autonomy.",
    signals: [
      { label: "constraint", value: "real-world noise" },
      { label: "surface", value: "navigation" },
    ],
  },
  {
    key: "physics",
    label: "Physics",
    description:
      "Inverse problems, uncertainty quantification, sparse sensing, and model constraints.",
    signals: [
      { label: "method", value: "priors + constraints" },
      { label: "signal", value: "UQ" },
    ],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    description:
      "Wearables, clinical interpretability, safety envelopes, and trustworthy alerts.",
    signals: [
      { label: "risk", value: "false trust" },
      { label: "need", value: "interpretability" },
    ],
  },
  {
    key: "climate",
    label: "Climate",
    description:
      "Forecasting, measurement pipelines, adaptation systems, and optimization under uncertainty.",
    signals: [
      { label: "surface", value: "sensing + models" },
      { label: "mode", value: "mitigation" },
    ],
  },
  {
    key: "security",
    label: "Security",
    description:
      "Threat modeling, verification, supply-chain integrity, and safe-by-design tooling.",
    signals: [
      { label: "surface", value: "supply chain" },
      { label: "mode", value: "verification" },
    ],
  },
  {
    key: "developer-tools",
    label: "Developer Tools",
    description:
      "Code intelligence, deterministic environments, and system-level DX improvements.",
    signals: [
      { label: "goal", value: "reproducible" },
      { label: "surface", value: "repo-scale" },
    ],
  },
];

export const DEFAULT_DOMAIN_KEYS: DomainKey[] = ["ai-ml", "developer-tools"];
