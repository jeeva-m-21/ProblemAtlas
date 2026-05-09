export type ProblemDomain =
	| "AI/ML"
	| "DevTools & Systems"
	| "Physics"
	| "Healthcare"
	| "Robotics";

export type ImplementationScope = "small" | "medium" | "large";

export type Problem = {
	id: number;
	title: string;
	domain: ProblemDomain;
	summary: string;
	feasibilityScore: 1 | 2 | 3 | 4 | 5;
	implementationScope: ImplementationScope;
	interestedCount: number;
	activeSolutionSpacesCount: number;
};

export const mockProblems: Problem[] = [
	{
		id: 101,
		title: "Robust RAG Evaluation for Multi-Hop Technical Queries",
		domain: "AI/ML",
		summary:
			"Design a reproducible evaluation harness that detects hallucinations and citation drift in multi-hop retrieval pipelines across changing corpora.",
		feasibilityScore: 3,
		implementationScope: "medium",
		interestedCount: 38,
		activeSolutionSpacesCount: 4,
	},
	{
		id: 102,
		title: "Deterministic Dev Environments for Polyglot Monorepos",
		domain: "DevTools & Systems",
		summary:
			"Create a developer workflow that yields identical builds across macOS/Linux/Windows for mixed Node, Python, and Rust projects—without fragile local setup.",
		feasibilityScore: 4,
		implementationScope: "medium",
		interestedCount: 27,
		activeSolutionSpacesCount: 2,
	},
	{
		id: 103,
		title: "Near-Real-Time Anomaly Detection in Wearable Sensor Streams",
		domain: "Healthcare",
		summary:
			"Detect clinically meaningful deviations from baseline in noisy heart-rate and motion data with minimal false alarms and clear interpretability for users.",
		feasibilityScore: 3,
		implementationScope: "large",
		interestedCount: 19,
		activeSolutionSpacesCount: 1,
	},
	{
		id: 104,
		title: "Sim-to-Real Transfer for Low-Cost Indoor Robot Navigation",
		domain: "Robotics",
		summary:
			"Reduce the sim-to-real gap for cheap depth sensors by learning robust mapping features and uncertainty-aware control in cluttered indoor environments.",
		feasibilityScore: 2,
		implementationScope: "large",
		interestedCount: 44,
		activeSolutionSpacesCount: 3,
	},
	{
		id: 105,
		title: "Fast, Trustworthy Approximate Search Over Large Codebases",
		domain: "DevTools & Systems",
		summary:
			"Combine symbolic and embedding-based indexing to answer architecture questions over large repos with predictable latency and transparent evidence.",
		feasibilityScore: 4,
		implementationScope: "small",
		interestedCount: 52,
		activeSolutionSpacesCount: 6,
	},
	{
		id: 106,
		title: "Inverse Problems for Sparse Observations in Fluid Dynamics",
		domain: "Physics",
		summary:
			"Reconstruct hidden flow fields from sparse, irregular sensor readings while quantifying uncertainty and preserving known physical constraints.",
		feasibilityScore: 2,
		implementationScope: "large",
		interestedCount: 13,
		activeSolutionSpacesCount: 0,
	},
	{
		id: 107,
		title: "Compact On-Device Speech Enhancement for Noisy Calls",
		domain: "AI/ML",
		summary:
			"Build a low-latency denoising model that runs on consumer hardware and improves intelligibility without introducing robotic artifacts.",
		feasibilityScore: 5,
		implementationScope: "small",
		interestedCount: 31,
		activeSolutionSpacesCount: 2,
	},
];

