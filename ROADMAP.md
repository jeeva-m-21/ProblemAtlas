# ProblemAtlas — Implementation Roadmap

**Current status:** Frontend-only MVP prototype with static mock data.
**Target:** Fully functional MVP with PostgreSQL, Clerk auth, real API routes, and full-text search.

---

## Phase 0 — Foundation & Infrastructure

**Goal:** Set up database schema, Drizzle ORM, and Clerk middleware.

| Step | File(s) | Description |
|---|---|---|
| 0.1 | `.env.local`, `drizzle.config.ts` | Environment variables and Drizzle Kit config |
| 0.2 | `lib/db/schema.ts` | All 10 tables, 7 enums, relations, indexes (from DATABASE_SCHEMA.md) |
| 0.3 | `lib/db/index.ts` | Database client with serverless connection pooling |
| 0.4 | — | Run `drizzle-kit push` against dev PostgreSQL |
| 0.5 | `drizzle/migrations/0001_add_tsv_column.sql` | Full-text search raw SQL migration |
| 0.6 | `middleware.ts` | Clerk middleware with public/protected route matchers |

---

## Phase 1 — Seed Data & Core Queries

**Goal:** Replace mock data with real database queries, one route at a time.

| Step | File(s) | Description |
|---|---|---|
| 1.1 | `lib/db/seed.ts` | Seed script populating all tables from existing mock data |
| 1.2 | — | Run seed: `tsx lib/db/seed.ts` |
| 1.3 | `lib/data/problems.ts` | Data access layer — `getProblems()`, `getProblemById()` |
| 1.4 | `lib/data/spaces.ts` | Data access layer — `getSolutionSpaces()`, `getSpaceById()` |
| 1.5 | `lib/data/profiles.ts` | Data access layer — `getProfile()`, `getProfileByClerkId()` |
| 1.6 | `lib/data/comments.ts` | Data access layer — `getComments()`, `getThreads()` |
| 1.7 | `lib/data/search.ts` | Data access layer — `searchAll()` |
| 1.8 | `app/explore/page.tsx` | Swap mock imports → real DAL call |
| 1.9 | `app/problems/[id]/page.tsx` | Swap mock imports → real DAL call |
| 1.10 | `app/spaces/page.tsx` + `app/spaces/[id]/page.tsx` | Swap mock imports → real DAL call |
| 1.11 | `app/profile/[id]/page.tsx` | Swap mock imports → real DAL call |
| 1.12 | `app/search/page.tsx` | Swap mock imports → real DAL call |

---

## Phase 2 — Authentication & User Management

**Goal:** Wire Clerk auth, lazy user creation, and profile completion gate.

| Step | File(s) | Description |
|---|---|---|
| 2.1 | `app/layout.tsx` | Add `<ClerkProvider>` wrapper |
| 2.2 | `app/auth/sign-in/page.tsx` | Replace stub with Clerk `<SignIn />` component |
| 2.3 | `app/auth/sign-up/page.tsx` | Replace stub with Clerk `<SignUp />` component |
| 2.4 | `lib/users/getOrCreateUser.ts` | Lazy user creation from Clerk session |
| 2.5 | `lib/auth/index.ts` | Auth helpers: `getAuthUserId()`, `requireAdmin()`, `assertOwnership()` |
| 2.6 | `lib/users/profileGuard.ts` | Profile completion guard for solution space creation |
| 2.7 | `app/onboarding/page.tsx` | Wire to save domain interests and skills to DB |
| 2.8 | `app/api/users/me/route.ts` | PATCH endpoint for updating current user profile |
| 2.9 | `app/users/me/page.tsx` | New route: redirect `/profile/me` → `/profile/[clerkUserId]` |

---

## Phase 3 — API Routes (Mutations)

**Goal:** Replace client-side mock mutations with real API endpoints.

| Step | Route Handler | Description |
|---|---|---|
| 3.1 | `app/api/problems/route.ts` | GET list (with search/domain filter), POST create (admin) |
| 3.2 | `app/api/problems/[id]/route.ts` | GET detail |
| 3.3 | `app/api/problems/[id]/comments/route.ts` | GET list, POST create |
| 3.4 | `app/api/problems/[id]/interest/route.ts` | POST toggle interest |
| 3.5 | `app/api/comments/[id]/flag/route.ts` | POST flag comment |
| 3.6 | `app/api/solution-spaces/route.ts` | GET list (by problem), POST create |
| 3.7 | `app/api/solution-spaces/[id]/route.ts` | GET, PATCH (owner only) |
| 3.8 | `app/api/solution-spaces/[id]/artifacts/route.ts` | POST add artifact |
| 3.9 | `app/api/artifacts/[id]/route.ts` | DELETE remove artifact |
| 3.10 | Client component wiring | Wire "I'm Interested", DiscussionComposer, CreateSpace dialog, artifact forms to real API |

---

## Phase 4 — Full-Text Search

**Goal:** Replace client-side mock search with PostgreSQL tsvector.

| Step | File(s) | Description |
|---|---|---|
| 4.1 | `lib/search.ts` | Search query builder using `ts_rank` and `plainto_tsquery` |
| 4.2 | `app/api/search/route.ts` | Unified search endpoint (problems, spaces, users, artifacts) |
| 4.3 | `app/search/page.tsx` | Swap client-side mock search → real API call |

---

## Phase 5 — Admin Curation

**Goal:** Admin-only problem lifecycle and comment moderation.

| Step | Route Handler | Description |
|---|---|---|
| 5.1 | `app/api/admin/problems/[id]/route.ts` | PATCH to transition validation_status |
| 5.2 | `app/api/admin/comments/[id]/route.ts` | DELETE to soft-delete flagged comments |
| 5.3 | Admin UI | Inline admin controls on problem detail page (visible only when `userId === ADMIN_CLERK_USER_ID`) |

---

## Phase 6 — Polish, Testing & Deploy

**Goal:** Tests, error handling, and production deployment.

| Step | Description |
|---|---|
| 6.1 | Add Vitest for data access layer unit tests |
| 6.2 | Add Playwright for 2-3 core E2E flows |
| 6.3 | Add `error.tsx` to all route segments |
| 6.4 | Add toast notifications for mutation failures |
| 6.5 | Add `generateMetadata` to all Server Component pages |
| 6.6 | Set up Railway PostgreSQL (production) |
| 6.7 | Set up Vercel project + Clerk prod environment |
| 6.8 | Run migrations and deploy |

---

## Architecture Rules

- `lib/` must never import from `features/` or `app/`
- Server Components import from `features/*/services.ts` directly
- Client Components call API routes via `fetch`, never import services
- Route handlers import from `features/*/services.ts` and `lib/`
- All write endpoints validate with Zod before any DB operation
- Soft deletes (`deleted_at`) on `problems`, `comments`, `solution_spaces`
- Dark mode only (`<html class="dark">`)
