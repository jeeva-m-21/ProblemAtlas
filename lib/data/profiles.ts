import { db } from "@/lib/db";
import { users, problems, comments, interest, solutionSpaceMembers } from "@/lib/db/schema";
import { eq, and, isNull, desc, count, sql } from "drizzle-orm";
import type { ProblemDomain } from "./problems";

export type Profile = {
  id: string;
  name: string;
  initials: string;
  title: string;
  bio: string;
  domains: ProblemDomain[];
  interests: string[];
  collaboration: {
    indicator: "Quiet" | "Active" | "High";
    lastActiveAt: string;
    collaborators: number;
    org?: string;
  };
  metrics: {
    problemsContributed: number;
    activeSolutionSpaces: number;
    researchDiscussions: number;
    artifactsPublished: number;
    collaborationScore: number;
  };
  contributedProblems: Array<{
    problemId: number;
    involvement: "lead" | "contributor" | "reviewer";
    joinedSolutionSpacesCount: number;
    lastActivityAt: string;
    state: string;
    note?: string;
  }>;
  activity: Array<{
    id: string;
    type: string;
    createdAt: string;
    title: string;
    detail: string;
    tags?: string[];
    entity?: { kind: string; id: number; label: string };
  }>;
};

export type ProfileProblemContribution = Profile["contributedProblems"][number];

export type ProfileActivityEvent = {
  id: string;
  type: string;
  createdAt: string;
  title: string;
  detail: string;
  tags?: string[];
  entity?: { kind: string; id: number; label: string };
};

export async function getProfile(clerkId: string): Promise<Profile | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
    with: {
      interest: {
        with: { problem: true },
      },
      memberships: {
        with: { solutionSpace: true },
      },
      comments: {
        where: isNull(comments.deletedAt),
        orderBy: desc(comments.createdAt),
        limit: 20,
      },
    },
  });

  if (!user) return null;

  const memberships = user.memberships ?? [];
  const activeSpaceCount = memberships.filter(
    (m) => m.status === "active"
  ).length;

  const interestProblems = user.interest ?? [];
  const contributedComments = user.comments ?? [];

  return {
    id: user.clerkId,
    name: user.name,
    initials: user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    title: "",
    bio: user.bio ?? "",
    domains: (user.domains ?? []) as ProblemDomain[],
    interests: user.skills ?? [],
    collaboration: {
      indicator: "Active" as const,
      lastActiveAt: user.createdAt?.toISOString().split("T")[0] ?? "",
      collaborators: memberships.length,
    },
    metrics: {
      problemsContributed: interestProblems.length,
      activeSolutionSpaces: activeSpaceCount,
      researchDiscussions: contributedComments.length,
      artifactsPublished: 0,
      collaborationScore: user.reputationScore ?? 0,
    },
    contributedProblems: interestProblems.map((i) => ({
      problemId: i.problemId,
      involvement: "contributor" as const,
      joinedSolutionSpacesCount: 0,
      lastActivityAt: i.createdAt?.toISOString().split("T")[0] ?? "",
      state: "active",
      note: i.message ?? undefined,
    })),
    activity: contributedComments.map((c) => ({
      id: `c-${c.id}`,
      type: "comment",
      createdAt: c.createdAt?.toISOString().split("T")[0] ?? "",
      title: `Comment on ${c.entityType} #${c.entityId}`,
      detail: c.body.slice(0, 200),
      entity: { kind: c.entityType, id: c.entityId, label: "" },
    })),
  };
}

export async function getProfileByClerkId(clerkId: string) {
  return getProfile(clerkId);
}
