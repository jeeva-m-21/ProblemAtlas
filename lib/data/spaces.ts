import { db } from "@/lib/db";
import { solutionSpaces, solutionSpaceMembers, artifacts, users } from "@/lib/db/schema";
import { eq, and, isNull, like, or, desc, sql } from "drizzle-orm";
import type { ProblemDomain } from "./problems";

export type SolutionArtifact = SolutionSpaceRecord["artifacts"][number];
export type Contributor = SolutionSpaceRecord["contributors"][number];
export type TimelineEvent = SolutionSpaceRecord["timeline"][number];

export type SolutionSpaceProgressState =
  | "Exploring"
  | "Prototyping"
  | "Validating"
  | "Shipping";

export type SolutionSpaceRecord = {
  id: number;
  title: string;
  createdAt: string;
  progressState: SolutionSpaceProgressState;
  activity: {
    lastActiveAt: string;
    indicator: "Quiet" | "Active" | "High";
  };
  problemId: number;
  problemTitle: string;
  domainTags: ProblemDomain[];
  overview: {
    direction: string;
    hypothesis: string;
    strategy: string;
    goals: string[];
  };
  contributors: Array<{
    name: string;
    initials: string;
    role: string;
    interest: string;
    status: "active" | "idle";
  }>;
  artifacts: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    href?: string;
    updatedAt: string;
    status: string;
    signal?: { label: string; value: string };
  }>;
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    detail: string;
    createdAt: string;
    actor: { name: string; initials: string };
    tags?: string[];
  }>;
  sidebar: {
    collaborationStats: {
      contributors: number;
      activeToday: number;
      artifacts: number;
      milestones: number;
    };
    openTasks: Array<{ id: string; title: string; status: string }>;
    feasibilityChanges: Array<{ createdAt: string; from: number; to: number; note: string }>;
    researchConfidence: 1 | 2 | 3 | 4 | 5;
  };
};

export type SpaceFilters = {
  search?: string;
  stage?: string;
  sort?: "activity" | "contributors" | "confidence";
};

export async function getSolutionSpaces(filters: SpaceFilters = {}): Promise<SolutionSpaceRecord[]> {
  const conditions = [isNull(solutionSpaces.deletedAt)];

  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(
        like(solutionSpaces.name, term),
        like(sql`COALESCE(${solutionSpaces.description}, '')`, term)
      )!
    );
  }

  const orderBy = (() => {
    switch (filters.sort) {
      case "contributors": return [desc(sql`(SELECT count(*) FROM ${solutionSpaceMembers} WHERE ${solutionSpaceMembers.solutionSpaceId} = ${solutionSpaces.id})`)];
      case "confidence": return [desc(sql`COALESCE(${solutionSpaces.overview}->>'researchConfidence', '0')::int`)];
      default: return [desc(solutionSpaces.updatedAt)];
    }
  })();

  const rows = await db
    .select()
    .from(solutionSpaces)
    .where(and(...conditions))
    .orderBy(...orderBy);

  return Promise.all(rows.map((s) => enrichSpace(s)));
}

export async function getSpaceById(id: number): Promise<SolutionSpaceRecord | null> {
  const row = await db.query.solutionSpaces.findFirst({
    where: and(eq(solutionSpaces.id, id), isNull(solutionSpaces.deletedAt)),
    with: {
      members: { with: { user: true } },
      artifacts: { where: isNull(artifacts.deletedAt) },
    },
  });

  if (!row) return null;
  return enrichSpace(row);
}

async function enrichSpace(row: any): Promise<SolutionSpaceRecord> {
  const overview = (row.overview ?? {}) as any;

  return {
    id: row.id,
    title: row.name,
    createdAt: row.createdAt?.toISOString().split("T")[0] ?? "",
    progressState: row.progressState ?? "Exploring",
    activity: {
      lastActiveAt: row.updatedAt?.toISOString().split("T")[0] ?? "",
      indicator: "Active" as const,
    },
    problemId: row.problemId,
    problemTitle: "",
    domainTags: [],
    overview: {
      direction: overview.direction ?? "",
      hypothesis: overview.hypothesis ?? "",
      strategy: overview.strategy ?? "",
      goals: overview.goals ?? [],
    },
    contributors: (row.members ?? []).map((m: any) => ({
      name: m.user?.name ?? "Unknown",
      initials: m.user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() ?? "?",
      role: m.role ?? "member",
      interest: "",
      status: (m.status === "active" ? "active" : "idle") as "active" | "idle",
    })),
    artifacts: (row.artifacts ?? []).map((a: any) => ({
      id: String(a.id),
      type: a.type,
      title: a.title,
      description: a.description ?? "",
      href: a.url ?? undefined,
      updatedAt: a.updatedAt?.toISOString().split("T")[0] ?? "",
      status: a.status ?? "active",
    })),
    timeline: [],
    sidebar: {
      collaborationStats: {
        contributors: row.members?.length ?? 0,
        activeToday: 0,
        artifacts: row.artifacts?.length ?? 0,
        milestones: 0,
      },
      openTasks: [],
      feasibilityChanges: [],
      researchConfidence: 3,
    },
  };
}

export async function getSpacesByProblemId(problemId: number): Promise<SolutionSpaceRecord[]> {
  const rows = await db.query.solutionSpaces.findMany({
    where: and(
      eq(solutionSpaces.problemId, problemId),
      isNull(solutionSpaces.deletedAt)
    ),
    with: {
      members: { with: { user: true } },
      artifacts: { where: isNull(artifacts.deletedAt) },
    },
  });

  return Promise.all(rows.map((s) => enrichSpace(s)));
}
