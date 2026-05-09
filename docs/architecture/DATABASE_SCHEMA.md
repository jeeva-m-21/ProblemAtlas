# Database Schema
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Corrected — Ready to implement              |
| **Updated**   | 2025-01                                     |

> This document is the Drizzle ORM implementation of `ENTITY_DEFINITIONS.md`. If the two conflict, `ENTITY_DEFINITIONS.md` is the authority on intent; this document is the authority on syntax.

---

## 1. Enums

| Enum name               | Values |
|-------------------------|--------|
| `validation_status`     | `draft`, `reviewed`, `published`, `solved`, `archived` |
| `implementation_scope`  | `small`, `medium`, `large` |
| `source_type`           | `paper`, `forum`, `challenge`, `other` |
| `solution_space_status` | `forming`, `active`, `paused`, `completed`, `abandoned` |
| `artifact_type`         | `repository`, `paper`, `dataset`, `prototype`, `documentation`, `other` |
| `member_role`           | `owner`, `member` |
| `external_profile_type` | `github`, `linkedin`, `website`, `other` |

---

## 2. Schema File — `lib/db/schema.ts`

```typescript
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

// ─── Enums ────────────────────────────────────────────────────────────────────

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

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  // Nullable: populated after /profile/setup, not at sign-up
  externalProfileType: externalProfileTypeEnum("external_profile_type"),
  externalProfileUrl: text("external_profile_url"),
  bio: text("bio"),
  skills: text("skills").array(),
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
    validationChecklist: jsonb("validation_checklist").notNull().default("{}"),
    curatedBy: uuid("curated_by")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    // ⚠️ tsv (tsvector) is NOT defined here.
    // It's a GENERATED column added via raw SQL migration only — see Section 4.
  },
  (table) => ({
    domainIdx: index("idx_problems_domain").on(table.domain),
    statusIdx: index("idx_problems_validation_status").on(table.validationStatus),
    domainCheck: check(
      "check_domain_valid",
      sql`${table.domain} IN ('AI/ML', 'Developer Tools & Software Systems')`
    ),
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
  description: text("description").notNull(),
  sourceReference: text("source_reference"),
});

export const approaches = pgTable("approaches", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id")
    .references(() => problems.id, { onDelete: "cascade" })
    .notNull(),
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
    problemId: integer("problem_id")
      .references(() => problems.id, { onDelete: "cascade" })
      .notNull(),
    // Nullable: SET NULL when user account is removed — comment body is preserved
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    // Self-reference: AnyPgColumn required to satisfy TypeScript circular check
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
    problemCreatedAtIdx: index("idx_comments_problem_created").on(
      table.problemId,
      table.createdAt
    ),
    parentIdx: index("idx_comments_parent_id").on(table.parentId),
  })
);

// No surrogate id — composite PK is sufficient
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
    // RESTRICT: cannot delete a user who owns a solution space
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    name: text("name").notNull(),
    description: text("description"),
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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    spaceIdx: index("idx_artifacts_solution_space_id").on(table.solutionSpaceId),
  })
);

// ─── Relations ────────────────────────────────────────────────────────────────

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

export const commentRelations = relations(comments, ({ one, many }) => ({
  problem: one(problems, { fields: [comments.problemId], references: [problems.id] }),
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
```

---

## 3. Drizzle Config — `drizzle.config.ts`

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## 4. Full-Text Search — Raw SQL Migration

`tsv` is a PostgreSQL `GENERATED ALWAYS AS ... STORED` `tsvector` column. Drizzle's table builder cannot express this natively. It must be managed via a raw migration file.

**File: `drizzle/migrations/0001_add_tsv_column.sql`**
```sql
ALTER TABLE problems ADD COLUMN IF NOT EXISTS tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english',
      coalesce(description_short, '') || ' ' || coalesce(description_full, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_problems_tsv ON problems USING GIN(tsv);
```

Apply with:
```bash
psql $DATABASE_URL -f drizzle/migrations/0001_add_tsv_column.sql
```

**Search query pattern — `lib/search.ts`:**
```typescript
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function searchProblems(input: string, domain?: string) {
  return db.execute(sql`
    SELECT
      id,
      title,
      domain,
      description_short,
      feasibility_score,
      implementation_scope,
      ts_rank(tsv, plainto_tsquery('english', ${input})) AS rank
    FROM problems
    WHERE validation_status = 'published'
      AND deleted_at IS NULL
      AND tsv @@ plainto_tsquery('english', ${input})
      AND (${domain ?? null} IS NULL OR domain = ${domain ?? null})
    ORDER BY rank DESC
    LIMIT 50
  `);
}
```

---

## 5. Database Client — `lib/db/index.ts`

> **Serverless caveat:** Vercel deploys Route Handlers as serverless functions. Each invocation may open a new PostgreSQL connection. Without `max: 1`, a traffic spike exhausts Railway's connection limit (~100) and PostgreSQL throws `FATAL: too many connections`.

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!, {
  // max: 1 is correct for serverless — each function instance handles one request at a time.
  // Increase to 10 for local dev (long-running Node process).
  max: process.env.NODE_ENV === "production" ? 1 : 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
```

**Production scaling:** If Railway's connection limit becomes a bottleneck, enable **PgBouncer** in the Railway PostgreSQL plugin settings and update `DATABASE_URL` to the PgBouncer connection string. No code change required.

---

## 6. CLI Commands

```bash
# Development: push schema directly to DB (no migration files generated)
npx drizzle-kit push

# Production: generate migration files from schema diff
npx drizzle-kit generate

# Production: apply pending migrations
npx drizzle-kit migrate

# Open Drizzle Studio (visual DB inspector)
npx drizzle-kit studio
```

> ⚠️ `drizzle-kit push:pg` is deprecated as of Drizzle Kit v0.21. Use `drizzle-kit push`.
> Never run `drizzle-kit push` against a production database.

---

## 7. Indexes & Constraints Summary

| Table                    | Constraint / Index |
|--------------------------|--------------------|
| `users`                  | UNIQUE on `clerk_id` |
| `problems`               | INDEX on `domain`; INDEX on `validation_status`; GIN on `tsv`; CHECK domain values; CHECK feasibility range |
| `sources`                | CHECK trust_score range |
| `comments`               | INDEX on `(problem_id, created_at)`; INDEX on `parent_id` |
| `interest`               | Composite PK `(problem_id, user_id)` |
| `solution_spaces`        | INDEX on `(problem_id, status)` |
| `solution_space_members` | Composite PK `(solution_space_id, user_id)` |
| `artifacts`              | INDEX on `solution_space_id` |
