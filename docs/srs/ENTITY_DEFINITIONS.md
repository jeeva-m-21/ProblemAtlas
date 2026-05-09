# Entity Definitions
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Corrected — Frozen for MVP                  |
| **Updated**   | 2025-01                                     |

---

## 1. Purpose

Single source of truth for all domain entities. Drives:

- Database schema (PostgreSQL + Drizzle ORM)
- API response shapes
- UI component data contracts
- Validation rules

**PK Type Convention:**
> `User.id` is a `uuid` — non-sequential for identity stability and to avoid enumeration attacks.
> All content entities (`Problem`, `Comment`, `SolutionSpace`, etc.) use `serial` (auto-increment integer) for simplicity and join performance.
> **This divergence is intentional and must not be "normalized."**

---

## 2. Entity Catalog

---

### 2.1 User

A person who has authenticated via Clerk. Created lazily on first API access (see AUTH_FLOW.md §2.2). Profile fields (`external_profile_*`, `skills`) are nullable at creation and completed via `/profile/setup`.

| Attribute                | Type          | Constraints                      | Description |
|--------------------------|---------------|----------------------------------|-------------|
| `id`                     | `uuid`        | PK, DEFAULT `gen_random_uuid()`  | Internal unique identifier |
| `clerk_id`               | `text`        | UNIQUE, NOT NULL                 | Clerk user ID — used for session-to-user resolution |
| `name`                   | `text`        | NOT NULL                         | Display name (synced from Clerk at creation) |
| `email`                  | `text`        | NOT NULL                         | Email (synced from Clerk at creation) |
| `avatar_url`             | `text`        | NULLABLE                         | Profile picture URL (synced from Clerk) |
| `external_profile_type`  | `text`        | NULLABLE                         | One of: `github`, `linkedin`, `website`, `other` |
| `external_profile_url`   | `text`        | NULLABLE                         | e.g. `https://github.com/janedev` |
| `bio`                    | `text`        | NULLABLE                         | Short bio (max 300 chars — enforced at application layer) |
| `skills`                 | `text[]`      | NULLABLE                         | e.g. `['Python', 'research', 'ROS2']` |
| `created_at`             | `timestamptz` | DEFAULT `now()`, NOT NULL        | |
| `reputation_score`       | `int`         | DEFAULT 0                        | Future use — not surfaced in MVP |

**Profile Completion Rule (application layer only — not DB constraints):**
`external_profile_url` must be non-null AND `skills` must contain at least one entry before a user may create a Solution Space. Enforced in `createSolutionSpace` service via `assertProfileComplete()`.

---

### 2.2 Problem

A curated, structured description of a real-world gap. The central entity of the platform. All other entities relate to a problem.

| Attribute              | Type          | Constraints | Description |
|------------------------|---------------|-------------|-------------|
| `id`                   | `serial`      | PK | |
| `title`                | `text`        | NOT NULL | Concise problem title |
| `domain`               | `text`        | NOT NULL, CHECK (see below) | Domain tag |
| `description_short`    | `text`        | NOT NULL | One-sentence summary (max 200 chars — app layer) |
| `description_full`     | `text`        | NOT NULL | Full problem statement (Markdown) |
| `importance`           | `text`        | NOT NULL | Why this problem matters (Markdown) |
| `validation_status`    | `text`        | NOT NULL, DEFAULT `'draft'` | Lifecycle — see below |
| `feasibility_score`    | `int`         | NULLABLE, CHECK 1–5 | Solo/small-team feasibility (5 = easiest) |
| `implementation_scope` | `text`        | NULLABLE, CHECK IN (`'small'`, `'medium'`, `'large'`) | Estimated effort |
| `validation_checklist` | `jsonb`       | NOT NULL, DEFAULT `'{}'` | Curation checklist — see below |
| `curated_by`           | `uuid`        | NOT NULL, FK → `users.id` ON DELETE RESTRICT | Admin who created/vetted the problem |
| `created_at`           | `timestamptz` | DEFAULT `now()`, NOT NULL | |
| `updated_at`           | `timestamptz` | DEFAULT `now()`, NOT NULL | Updated on every mutation |
| `published_at`         | `timestamptz` | NULLABLE | Set when status transitions to `published` |
| `deleted_at`           | `timestamptz` | NULLABLE | Soft delete — all queries filter `WHERE deleted_at IS NULL` |

**`domain` CHECK constraint (exact stored values):**
```sql
CHECK (domain IN ('AI/ML', 'Developer Tools & Software Systems'))
```

**`validation_status` lifecycle:**
```
draft → reviewed → published → solved → archived
```
- `draft` — only visible to curator
- `reviewed` — passed checklist, awaiting final publication
- `published` — visible on platform, no complete solution yet
- `solved` — a credible solution exists (set manually by curator)
- `archived` — no longer relevant or superseded

**`validation_checklist` JSON shape:**
```json
{
  "real_world_origin": true,
  "min_two_trusted_sources": true,
  "clear_actionable_gap": true,
  "solo_feasible": true,
  "no_existing_solution": true,
  "curator_reviewed": true
}
```

**`tsv` (full-text search vector):**
Not a Drizzle column — managed entirely via raw SQL migration. See DATABASE_SCHEMA.md §4.
```sql
ALTER TABLE problems ADD COLUMN tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english',
      coalesce(description_short, '') || ' ' || coalesce(description_full, '')), 'B')
  ) STORED;
CREATE INDEX idx_problems_tsv ON problems USING GIN(tsv);
```

---

### 2.3 Gap

A specific identified gap within a problem. Multiple gaps can exist per problem.

| Attribute          | Type     | Constraints | Description |
|--------------------|----------|-------------|-------------|
| `id`               | `serial` | PK | |
| `problem_id`       | `int`    | NOT NULL, FK → `problems.id` ON DELETE CASCADE | |
| `description`      | `text`   | NOT NULL | Description of the gap |
| `source_reference` | `text`   | NULLABLE | Where the gap is documented |

---

### 2.4 Approach

A suggested solution approach for a problem. Multiple approaches can exist per problem.

| Attribute          | Type     | Constraints | Description |
|--------------------|----------|-------------|-------------|
| `id`               | `serial` | PK | |
| `problem_id`       | `int`    | NOT NULL, FK → `problems.id` ON DELETE CASCADE | |
| `description`      | `text`   | NOT NULL | Suggested approach |
| `source_reference` | `text`   | NULLABLE | Inspired by / sourced from |

---

### 2.5 Source

A reference document or link backing a problem.

| Attribute     | Type     | Constraints | Description |
|---------------|----------|-------------|-------------|
| `id`          | `serial` | PK | |
| `problem_id`  | `int`    | NOT NULL, FK → `problems.id` ON DELETE CASCADE | |
| `url`         | `text`   | NOT NULL | Full URL |
| `title`       | `text`   | NOT NULL | Human-readable title |
| `type`        | `text`   | NOT NULL, CHECK IN (`'paper'`, `'forum'`, `'challenge'`, `'other'`) | Category |
| `description` | `text`   | NULLABLE | Why this source is relevant |
| `trust_score` | `int`    | NULLABLE, CHECK 1–5 | Curator credibility rating (5 = highest) |

---

### 2.6 Comment

A user comment on a problem. Preserved when the author's account is deleted.

| Attribute    | Type          | Constraints | Description |
|--------------|---------------|-------------|-------------|
| `id`         | `serial`      | PK | |
| `problem_id` | `int`         | NOT NULL, FK → `problems.id` ON DELETE CASCADE | Parent problem |
| `user_id`    | `uuid`        | **NULLABLE**, FK → `users.id` ON DELETE **SET NULL** | Author — null when user account is removed |
| `body`       | `text`        | NOT NULL | Comment text |
| `parent_id`  | `int`         | NULLABLE, FK → `comments.id` ON DELETE SET NULL | For future threading; null = top-level comment |
| `is_flagged` | `boolean`     | DEFAULT FALSE, NOT NULL | Flagged for moderation review |
| `created_at` | `timestamptz` | DEFAULT `now()`, NOT NULL | |
| `updated_at` | `timestamptz` | DEFAULT `now()`, NOT NULL | |
| `deleted_at` | `timestamptz` | NULLABLE | Soft delete |

**`user_id` nullability:** When a user account is removed, comments are preserved with `user_id = NULL`. The UI renders these as "[deleted user]". This protects discussion thread integrity for all other participants.

**Display order:** `ORDER BY created_at ASC` (oldest first — chronological).

---

### 2.7 Interest

A user expressing interest in a problem. The composite PK naturally enforces uniqueness — no surrogate needed.

| Attribute    | Type          | Constraints | Description |
|--------------|---------------|-------------|-------------|
| `problem_id` | `int`         | PK (composite), FK → `problems.id` ON DELETE CASCADE | |
| `user_id`    | `uuid`        | PK (composite), FK → `users.id` ON DELETE CASCADE | |
| `message`    | `text`        | NULLABLE | Optional note visible on the problem page |
| `created_at` | `timestamptz` | DEFAULT `now()`, NOT NULL | |

**Withdraw interest = hard delete** of the row.

---

### 2.8 SolutionSpace

A collaborative container created to actively work on solving a specific problem. Tangible outputs are captured as Artifacts.

| Attribute           | Type          | Constraints | Description |
|---------------------|---------------|-------------|-------------|
| `id`                | `serial`      | PK | |
| `problem_id`        | `int`         | NOT NULL, FK → `problems.id` ON DELETE CASCADE | The problem this space addresses |
| `creator_id`        | `uuid`        | NOT NULL, FK → `users.id` ON DELETE RESTRICT | Cannot delete a user who owns a space |
| `name`              | `text`        | NOT NULL | Short descriptive name |
| `description`       | `text`        | NULLABLE | Optional approach summary (Markdown) |
| `status`            | `text`        | NOT NULL, DEFAULT `'forming'` | Lifecycle — see below |
| `status_changed_at` | `timestamptz` | NULLABLE | Timestamp of most recent status transition |
| `created_at`        | `timestamptz` | DEFAULT `now()`, NOT NULL | |
| `updated_at`        | `timestamptz` | DEFAULT `now()`, NOT NULL | |
| `deleted_at`        | `timestamptz` | NULLABLE | Soft delete |

**`status` CHECK constraint:**
```sql
CHECK (status IN ('forming', 'active', 'paused', 'completed', 'abandoned'))
```

**Lifecycle transitions (enforced in `solution-spaces` service layer):**

| From | To | Trigger |
|---|---|---|
| `forming` | `active` | First artifact added (automatic) |
| `active` | `paused` | Owner action |
| `paused` | `active` | Owner action (resume) |
| `active` or `paused` | `completed` | Owner action |
| `active` or `paused` | `abandoned` | Owner action |

All transitions set `status_changed_at = now()`.

**`creator_id` ON DELETE RESTRICT:** Prevents removing a user account that owns active solution spaces. Operator must transfer or archive the space first.

---

### 2.9 SolutionSpaceMember

Join table linking users to solution spaces. Composite PK enforces one membership per user per space.

| Attribute           | Type          | Constraints | Description |
|---------------------|---------------|-------------|-------------|
| `solution_space_id` | `int`         | PK (composite), FK → `solution_spaces.id` ON DELETE CASCADE | |
| `user_id`           | `uuid`        | PK (composite), FK → `users.id` ON DELETE CASCADE | |
| `role`              | `text`        | NOT NULL, CHECK IN (`'owner'`, `'member'`) | `owner` auto-assigned to creator |
| `created_at`        | `timestamptz` | DEFAULT `now()`, NOT NULL | When the member joined — audit trail for post-MVP invitation system |

**For MVP:** Only the creator is added automatically as `owner`. Invitations and member management are post-MVP.

---

### 2.10 Artifact

A linked external resource constituting tangible output or a reference for a Solution Space. All artifacts are external links — no in-platform file storage.

| Attribute           | Type          | Constraints | Description |
|---------------------|---------------|-------------|-------------|
| `id`                | `serial`      | PK | |
| `solution_space_id` | `int`         | NOT NULL, FK → `solution_spaces.id` ON DELETE CASCADE | |
| `url`               | `text`        | NOT NULL | External link (GitHub, PDF, dataset, demo, etc.) |
| `title`             | `text`        | NOT NULL | Human label (e.g. "Main repository") |
| `type`              | `text`        | NOT NULL, CHECK (see below) | Category |
| `created_at`        | `timestamptz` | DEFAULT `now()`, NOT NULL | |
| `updated_at`        | `timestamptz` | DEFAULT `now()`, NOT NULL | |

**`type` CHECK constraint:**
```sql
CHECK (type IN ('repository', 'paper', 'dataset', 'prototype', 'documentation', 'other'))
```

---

## 3. Entity Relationship Summary

```
User ──1:N──► Comment           (user_id nullable; SET NULL on user delete)
User ──1:N──► Interest
User ──1:N──► SolutionSpace     (as creator; RESTRICT on user delete)
User ──N:M──► SolutionSpace     (via SolutionSpaceMember)

Problem ──1:N──► Gap
Problem ──1:N──► Approach
Problem ──1:N──► Source
Problem ──1:N──► Comment
Problem ──1:N──► Interest
Problem ──1:N──► SolutionSpace

SolutionSpace ──1:N──► Artifact
SolutionSpace ──1:N──► SolutionSpaceMember
SolutionSpaceMember ──N:1──► User
```

---

## 4. Database Constraints & Indexes

| Table                    | Constraint / Index |
|--------------------------|--------------------|
| `users`                  | UNIQUE on `clerk_id` |
| `problems`               | INDEX on `domain`; INDEX on `validation_status`; GIN on `tsv`; CHECK on `domain` values; CHECK on `feasibility_score` range |
| `sources`                | CHECK on `trust_score` range |
| `comments`               | INDEX on `(problem_id, created_at)`; INDEX on `parent_id` |
| `interest`               | Composite PK `(problem_id, user_id)` |
| `solution_spaces`        | INDEX on `(problem_id, status)` |
| `solution_space_members` | Composite PK `(solution_space_id, user_id)` |
| `artifacts`              | INDEX on `solution_space_id` |

---

## 5. Data Integrity Rules

| Rule | How enforced |
|---|---|
| Cascade content deletion when problem deleted | `ON DELETE CASCADE` on Gap, Approach, Source, Comment (problem FK), Interest, SolutionSpace |
| Preserve comments when user leaves | `Comment.user_id` FK uses `ON DELETE SET NULL` |
| Preserve comment children when parent deleted | `Comment.parent_id` FK uses `ON DELETE SET NULL` |
| Prevent orphaned solution spaces | `SolutionSpace.creator_id` FK uses `ON DELETE RESTRICT` |
| Prevent deleting admin with problems | `Problem.curated_by` FK uses `ON DELETE RESTRICT` |
| Exclude soft-deleted rows | All queries on `problems`, `comments`, `solution_spaces` must include `WHERE deleted_at IS NULL` |

---

## 6. Future-Proofing Notes

- `reputation_score` exists in schema but is not surfaced in MVP UI.
- `Artifact.type` enum is extensible — `notebook`, `demo`, `video` are natural additions.
- `SolutionSpaceMember.role` can grow to include `reviewer`, `contributor`.
- `Comment.is_flagged` can evolve to a `moderation_status` enum with `pending_review`, `cleared`, `removed`.
- Invitation system will use `SolutionSpaceMember` with an additional `pending` status and `invited_by` FK.
