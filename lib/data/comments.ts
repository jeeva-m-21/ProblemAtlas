import { db } from "@/lib/db";
import { comments, users } from "@/lib/db/schema";
import { eq, and, isNull, asc, desc, count } from "drizzle-orm";

export type DiscussionComment = {
  id: string;
  parentId?: string;
  author: {
    name: string;
    initials: string;
    role: string;
  };
  createdAt: string;
  body: string;
  tags?: string[];
};

export type DiscussionThread = {
  id: string;
  entityType: "problem" | "space";
  entityId: number;
  title: string;
  description: string;
  tags: string[];
  comments: DiscussionComment[];
};

export async function getComments(
  entityType: string,
  entityId: number
): Promise<DiscussionComment[]> {
  const rows = await db.query.comments.findMany({
    where: and(
      eq(comments.entityType, entityType),
      eq(comments.entityId, entityId),
      isNull(comments.deletedAt)
    ),
    with: { author: true },
    orderBy: asc(comments.createdAt),
  });

  return rows.map((c) => ({
    id: String(c.id),
    parentId: c.parentId ? String(c.parentId) : undefined,
    author: {
      name: c.author?.name ?? "Anonymous",
      initials:
        c.author?.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() ?? "?",
      role: "",
    },
    createdAt: c.createdAt?.toISOString().split("T")[0] ?? "",
    body: c.body,
    tags: [],
  }));
}

export async function getThreads(
  entityType: string,
  entityId: number
): Promise<DiscussionThread[]> {
  const allComments = await getComments(entityType, entityId);

  const thread: DiscussionThread = {
    id: `thread-${entityType}-${entityId}`,
    entityType: entityType as "problem" | "space",
    entityId,
    title: `Discussion on ${entityType} #${entityId}`,
    description: "",
    tags: [],
    comments: allComments,
  };

  return [thread];
}

export async function getCommentCount(entityType: string, entityId: number): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(comments)
    .where(
      and(
        eq(comments.entityType, entityType),
        eq(comments.entityId, entityId),
        isNull(comments.deletedAt)
      )
    );
  return result?.count ?? 0;
}
