import { db } from "@/lib/db";
import { problems, gaps, approaches, sources, users, comments } from "@/lib/db/schema";
import { eq, and, isNull, or, like, asc, desc, sql, inArray } from "drizzle-orm";

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

export type ProblemFilters = {
  domain?: ProblemDomain;
  search?: string;
  tab?: "all" | "needs-help";
  sort?: "signal" | "impact" | "urgency" | "feasibility";
};

export async function getProblems(filters: ProblemFilters = {}): Promise<Problem[]> {
  const conditions = [
    isNull(problems.deletedAt),
    eq(problems.validationStatus, "published"),
  ];

  if (filters.domain) {
    conditions.push(eq(problems.domain, filters.domain));
  }

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(problems.title, searchTerm),
        like(problems.descriptionShort, searchTerm)
      )!
    );
  }

  const orderBy = (() => {
    switch (filters.sort) {
      case "impact": return [desc(problems.interestedCount)];
      case "feasibility": return [desc(problems.feasibilityScore)];
      case "urgency": return [desc(sql`${problems.interestedCount} - COALESCE(${problems.activeSolutionSpacesCount}, 0)`)];
      default: return [desc(sql`${problems.interestedCount} + COALESCE(${problems.activeSolutionSpacesCount}, 0) * 10`)];
    }
  })();

  const rows = await db
    .select()
    .from(problems)
    .where(and(...conditions))
    .orderBy(...orderBy);

  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    domain: p.domain as ProblemDomain,
    summary: p.descriptionShort,
    feasibilityScore: (p.feasibilityScore ?? 3) as 1 | 2 | 3 | 4 | 5,
    implementationScope: (p.implementationScope ?? "medium") as ImplementationScope,
    interestedCount: p.interestedCount,
    activeSolutionSpacesCount: p.activeSolutionSpacesCount,
  }));
}

export type ProblemDiscussionComment = {
  id: string;
  author: { name: string; initials: string; role: string };
  createdAt: string;
  body: string;
  tags?: string[];
};

export type ProblemDetail = Problem & {
  createdAt: string;
  implementationDifficulty: 1 | 2 | 3 | 4 | 5;
  relatedDomains: ProblemDomain[];
  collaborators: Array<{ name: string; initials: string; status: "active" | "idle" }>;
  summaryDetail: {
    explanation: string[];
    gap: string[];
    failureModes: string[];
    whyItMatters: string[];
  };
  researchGaps: Array<{
    kind: string;
    title: string;
    detail: string;
  }>;
  possibleDirections: Array<{
    title: string;
    summary: string;
    opportunities: string[];
    evaluation: string[];
    risks?: string[];
  }>;
  discussionPreview: {
    totalCount: number;
    comments: Array<{
      id: string;
      author: { name: string; initials: string; role: string };
      createdAt: string;
      body: string;
      tags?: string[];
    }>;
  };
};

export async function getProblemById(id: number): Promise<ProblemDetail | null> {
  const problem = await db.query.problems.findFirst({
    where: and(eq(problems.id, id), isNull(problems.deletedAt)),
    with: {
      curator: true,
      gaps: true,
      approaches: true,
      comments: {
        where: isNull(comments.deletedAt),
        with: { author: true },
        orderBy: asc(comments.createdAt),
        limit: 10,
      },
    },
  });

  if (!problem) return null;

  const problemComments = await db.query.comments.findMany({
    where: and(
      eq(comments.entityType, "problem"),
      eq(comments.entityId, id),
      isNull(comments.deletedAt)
    ),
    with: { author: true },
  });

  return {
    id: problem.id,
    title: problem.title,
    domain: problem.domain as ProblemDomain,
    summary: problem.descriptionShort,
    feasibilityScore: (problem.feasibilityScore ?? 3) as 1 | 2 | 3 | 4 | 5,
    implementationScope: (problem.implementationScope ?? "medium") as ImplementationScope,
    interestedCount: problem.interestedCount,
    activeSolutionSpacesCount: problem.activeSolutionSpacesCount,
    createdAt: problem.createdAt?.toISOString().split("T")[0] ?? "",
    implementationDifficulty: (problem.implementationDifficulty ?? 3) as 1 | 2 | 3 | 4 | 5,
    relatedDomains: (problem.relatedDomains ?? []) as ProblemDomain[],
    collaborators: [],
    summaryDetail: {
      explanation: problem.descriptionFull?.split("\n\n") ?? [],
      gap: problem.gaps.map((g) => g.description),
      failureModes: [],
      whyItMatters: problem.importance?.split("\n\n") ?? [],
    },
    researchGaps: problem.gaps.map((g) => ({
      kind: g.kind ?? "open challenge",
      title: g.title ?? "",
      detail: g.description,
    })),
    possibleDirections: problem.approaches.map((a) => ({
      title: a.title ?? "",
      summary: a.summary ?? "",
      opportunities: (a.opportunities as string[]) ?? [],
      evaluation: (a.evaluation as string[]) ?? [],
      risks: (a.risks as string[]) ?? [],
    })),
    discussionPreview: {
      totalCount: problemComments.length,
      comments: problemComments.slice(0, 5).map((c) => ({
        id: String(c.id),
        author: {
          name: c.author?.name ?? "Anonymous",
          initials: c.author?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() ?? "?",
          role: "",
        },
        createdAt: c.createdAt?.toISOString().split("T")[0] ?? "",
        body: c.body,
        tags: [],
      })),
    },
  };
}
