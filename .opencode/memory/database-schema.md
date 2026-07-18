# Database Schema
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->
<!-- source: lib/db/schema.ts, docs/architecture/DATABASE_SCHEMA.md -->

## Schema Status: DEFINED, NOT YET APPLIED

Schema is defined in `lib/db/schema.ts` (340 lines, Drizzle ORM). No migrations have been run against a real database yet.

## Tables (10)

### users
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK, defaultRandom) | |
| clerk_id | text (UNIQUE, NOT NULL) | |
| display_name | text | |
| skills | text[] | |
| external_profile_url | text | |
| external_profile_type | external_profile_type enum | |
| created_at | timestamp (NOT NULL, defaultNow) | |
| updated_at | timestamp (NOT NULL, defaultNow) | |

### problems
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| title | text (NOT NULL) | |
| slug | text (UNIQUE, NOT NULL) | |
| domain | text (NOT NULL) | |
| description_short | text (NOT NULL) | |
| description_long | text | |
| implementation_scope | implementation_scope enum | |
| validation_status | validation_status enum (NOT NULL) | default: draft |
| curated_by | uuid (FK → users.id) | |
| created_at | timestamp (NOT NULL, defaultNow) | |
| updated_at | timestamp (NOT NULL, defaultNow) | |
| deleted_at | timestamp | Soft delete |
| tsv | tsvector | Full-text search column |

### gaps
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| problem_id | integer (FK → problems.id, NOT NULL) | |
| title | text (NOT NULL) | |
| description | text (NOT NULL) | |
| created_at | timestamp (NOT NULL, defaultNow) | |

### approaches
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| problem_id | integer (FK → problems.id, NOT NULL) | |
| title | text (NOT NULL) | |
| description | text (NOT NULL) | |
| created_at | timestamp (NOT NULL, defaultNow) | |

### sources
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| problem_id | integer (FK → problems.id, NOT NULL) | |
| title | text (NOT NULL) | |
| url | text | |
| source_type | source_type enum | |
| created_at | timestamp (NOT NULL, defaultNow) | |

### comments
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| user_id | uuid (FK → users.id, NOT NULL) | |
| entity_type | text (NOT NULL) | Polymorphic: 'problem', 'solution_space' |
| entity_id | integer (NOT NULL) | |
| body | text (NOT NULL) | |
| is_flagged | boolean (NOT NULL, default=false) | |
| created_at | timestamp (NOT NULL, defaultNow) | |
| updated_at | timestamp (NOT NULL, defaultNow) | |
| deleted_at | timestamp | Soft delete |

### interest
| Column | Type | Notes |
|---|---|---|
| problem_id | integer (FK → problems.id, NOT NULL) | Composite PK |
| user_id | uuid (FK → users.id, NOT NULL) | Composite PK |
| created_at | timestamp (NOT NULL, defaultNow) | |

### solution_spaces
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| problem_id | integer (FK → problems.id, NOT NULL) | |
| creator_id | uuid (FK → users.id, NOT NULL) | |
| name | text (NOT NULL) | |
| description | text | |
| status | solution_space_status enum (NOT NULL) | default: forming |
| created_at | timestamp (NOT NULL, defaultNow) | |
| updated_at | timestamp (NOT NULL, defaultNow) | |
| deleted_at | timestamp | Soft delete |

### solution_space_members
| Column | Type | Notes |
|---|---|---|
| solution_space_id | integer (FK → solution_spaces.id, NOT NULL) | Composite PK |
| user_id | uuid (FK → users.id, NOT NULL) | Composite PK |
| role | member_role enum (NOT NULL) | default: member |
| created_at | timestamp (NOT NULL, defaultNow) | |

### artifacts
| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| solution_space_id | integer (FK → solution_spaces.id, NOT NULL) | |
| type | artifact_type enum (NOT NULL) | |
| title | text (NOT NULL) | |
| url | text | |
| description | text | |
| created_at | timestamp (NOT NULL, defaultNow) | |

## Enums (7)
- `validation_status`: draft, reviewed, published, solved, archived
- `implementation_scope`: small, medium, large
- `source_type`: paper, forum, challenge, other
- `solution_space_status`: forming, active, paused, completed, abandoned
- `artifact_type`: repository, paper, dataset, prototype, documentation, other
- `member_role`: owner, member
- `external_profile_type`: github, linkedin, website, other

## Soft Delete Tables
- problems (deleted_at)
- comments (deleted_at)
- solution_spaces (deleted_at)
- All queries for these tables MUST include `WHERE deleted_at IS NULL`

## Full-Text Search
- problems.tsv column (tsvector generated from title, description_short, description_long)
- GIN index on tsv column
- Search via: `tsv @@ plainto_tsquery('english', $query)`
- Ordered by `ts_rank(tsv, query) DESC`

## Key Constraints
- User IDs are UUIDs (generated via `defaultRandom()`)
- Content IDs (problems, comments, spaces, artifacts) are serial integers
- FK indexes added for all foreign key columns
- Composite primary keys on: interest (problem_id, user_id), solution_space_members (solution_space_id, user_id)
