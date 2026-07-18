import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  serial,
  integer,
  timestamp,
  boolean,
  jsonb,
  index,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const validationStatusEnum = pgEnum("validation_status", [
  "draft",
  "reviewed",
  "published",
  "solved",
  "archived",
]);

export const implementationScopeEnum = pgEnum("implementation_scope", [
  "small",
  "medium",
  "large",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "paper",
  "forum",
  "challenge",
  "other",
]);

export const solutionSpaceStatusEnum = pgEnum("solution_space_status", [
  "forming",
  "active",
  "paused",
  "completed",
  "abandoned",
]);

export const artifactTypeEnum = pgEnum("artifact_type", [
  "repository",
  "paper",
  "dataset",
  "prototype",
  "documentation",
  "other",
]);

export const memberRoleEnum = pgEnum("member_role", ["owner", "member"]);

export const externalProfileTypeEnum = pgEnum("external_profile_type", [
  "github",
  "linkedin",
  "website",
  "other",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  externalProfileType: externalProfileTypeEnum("external_profile_type"),
  externalProfileUrl: text("external_profile_url"),
  bio: text("bio"),
  skills: text("skills").array(),
  domains: text("domains").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  reputationScore: integer("reputation_score").default(0),
});

export const problems = pgTable(
  "problems",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    domain: text("domain").notNull(),
    descriptionShort: text("description_short").notNull(),
    descriptionFull: text("description_full").notNull(),
    importance: text("importance").notNull(),
    validationStatus: validationStatusEnum("validation_status")
      .default("draft")
      .notNull(),
    feasibilityScore: integer("feasibility_score"),
    implementationScope: implementationScopeEnum("implementation_scope"),
    interestedCount: integer("interested_count").default(0).notNull(),
    activeSolutionSpacesCount: integer("active_solution_spaces_count").default(0).notNull(),
    implementationDifficulty: integer("implementation_difficulty"),
    relatedDomains: text("related_domains").array(),
    validationChecklist: jsonb("validation_checklist").notNull().default("{}"),
    curatedBy: uuid("curated_by")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    domainIdx: index("idx_problems_domain").on(table.domain),
    statusIdx: index("idx_problems_validation_status").on(table.validationStatus),
    feasibilityCheck: check(
      "check_feasibility_score",
      sql`${table.feasibilityScore} IS NULL OR (${table.feasibilityScore} >= 1 AND ${table.feasibilityScore} <= 5)`
    ),
  })
);

export const gaps = pgTable("gaps", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id")
    .references(() => problems.id, { onDelete: "cascade" })
    .notNull(),
  kind: text("kind"),
  title: text("title"),
  description: text("description").notNull(),
  sourceReference: text("source_reference"),
});

export const approaches = pgTable("approaches", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id")
    .references(() => problems.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title"),
  summary: text("summary"),
  opportunities: jsonb("opportunities"),
  evaluation: jsonb("evaluation"),
  risks: jsonb("risks"),
  description: text("description").notNull(),
  sourceReference: text("source_reference"),
});

export const sources = pgTable(
  "sources",
  {
    id: serial("id").primaryKey(),
    problemId: integer("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    type: sourceTypeEnum("type").notNull(),
    description: text("description"),
    trustScore: integer("trust_score"),
  },
  (table) => ({
    trustScoreCheck: check(
      "check_trust_score",
      sql`${table.trustScore} IS NULL OR (${table.trustScore} >= 1 AND ${table.trustScore} <= 5)`
    ),
  })
);

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    entityType: text("entity_type").notNull().default("problem"),
    entityId: integer("entity_id").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    parentId: integer("parent_id").references(
      (): AnyPgColumn => comments.id,
      { onDelete: "set null" }
    ),
    isFlagged: boolean("is_flagged").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    entityIdx: index("idx_comments_entity").on(table.entityType, table.entityId),
    parentIdx: index("idx_comments_parent_id").on(table.parentId),
  })
);

export const interest = pgTable(
  "interest",
  {
    problemId: integer("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.problemId, table.userId] }),
  })
);

export const solutionSpaces = pgTable(
  "solution_spaces",
  {
    id: serial("id").primaryKey(),
    problemId: integer("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    name: text("name").notNull(),
    description: text("description"),
    overview: jsonb("overview"),
    progressState: text("progress_state").default("Exploring"),
    status: solutionSpaceStatusEnum("status").default("forming").notNull(),
    statusChangedAt: timestamp("status_changed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    problemStatusIdx: index("idx_solution_spaces_problem_status").on(
      table.problemId,
      table.status
    ),
  })
);

export const solutionSpaceMembers = pgTable(
  "solution_space_members",
  {
    solutionSpaceId: integer("solution_space_id")
      .references(() => solutionSpaces.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: memberRoleEnum("role").notNull(),
    status: text("status").default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.solutionSpaceId, table.userId] }),
  })
);

export const artifacts = pgTable(
  "artifacts",
  {
    id: serial("id").primaryKey(),
    solutionSpaceId: integer("solution_space_id")
      .references(() => solutionSpaces.id, { onDelete: "cascade" })
      .notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    type: artifactTypeEnum("type").notNull(),
    description: text("description"),
    status: text("status").default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    spaceIdx: index("idx_artifacts_solution_space_id").on(table.solutionSpaceId),
  })
);

export const problemRelations = relations(problems, ({ many, one }) => ({
  curator: one(users, { fields: [problems.curatedBy], references: [users.id] }),
  gaps: many(gaps),
  approaches: many(approaches),
  sources: many(sources),
  comments: many(comments),
  interest: many(interest),
  solutionSpaces: many(solutionSpaces),
}));

export const userRelations = relations(users, ({ many }) => ({
  curatedProblems: many(problems),
  comments: many(comments),
  interest: many(interest),
  solutionSpaces: many(solutionSpaces),
  memberships: many(solutionSpaceMembers),
}));

export const gapRelations = relations(gaps, ({ one }) => ({
  problem: one(problems, { fields: [gaps.problemId], references: [problems.id] }),
}));

export const approachRelations = relations(approaches, ({ one }) => ({
  problem: one(problems, { fields: [approaches.problemId], references: [problems.id] }),
}));

export const sourceRelations = relations(sources, ({ one }) => ({
  problem: one(problems, { fields: [sources.problemId], references: [problems.id] }),
}));

export const commentRelations = relations(comments, ({ one, many }) => ({
  problem: one(problems, { fields: [comments.entityId], references: [problems.id] }),
  author: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "commentReplies",
  }),
  replies: many(comments, { relationName: "commentReplies" }),
}));

export const interestRelations = relations(interest, ({ one }) => ({
  problem: one(problems, { fields: [interest.problemId], references: [problems.id] }),
  user: one(users, { fields: [interest.userId], references: [users.id] }),
}));

export const solutionSpaceRelations = relations(solutionSpaces, ({ one, many }) => ({
  problem: one(problems, { fields: [solutionSpaces.problemId], references: [problems.id] }),
  creator: one(users, { fields: [solutionSpaces.creatorId], references: [users.id] }),
  members: many(solutionSpaceMembers),
  artifacts: many(artifacts),
}));

export const solutionSpaceMemberRelations = relations(solutionSpaceMembers, ({ one }) => ({
  solutionSpace: one(solutionSpaces, {
    fields: [solutionSpaceMembers.solutionSpaceId],
    references: [solutionSpaces.id],
  }),
  user: one(users, { fields: [solutionSpaceMembers.userId], references: [users.id] }),
}));

export const artifactRelations = relations(artifacts, ({ one }) => ({
  solutionSpace: one(solutionSpaces, {
    fields: [artifacts.solutionSpaceId],
    references: [solutionSpaces.id],
  }),
}));
