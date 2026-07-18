# Design Decisions (ADR Log)
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## ADR-001: Modular Monolith over Microservices
**Date:** 2026-01
**Status:** Accepted
**Context:** Solo-developer MVP. Need fast iteration, simple deployment.
**Decision:** Single Next.js application with feature-based modules.
**Consequences:**
- One codebase, one deploy, one CI pipeline
- Feature modules provide clear boundaries without service overhead
- Any module can be extracted later without rewriting the rest

## ADR-002: No Global State Library
**Date:** 2026-01
**Status:** Accepted
**Context:** Need to manage auth, server, UI state.
**Decision:** Clerk for auth, DB for server state, useState/useReducer for UI, useOptimistic for operations.
**Consequences:**
- No Zustand, Redux, Jotai in the project
- `router.refresh()` is the cache invalidation mechanism
- Client components call API routes via `fetch()`, never import services

## ADR-003: Server Components by Default
**Date:** 2026-01
**Status:** Accepted
**Context:** Next.js 16 App Router supports RSC. Need SEO + performance.
**Decision:** Every page starts as a Server Component. Client components only for interactive islands.
**Consequences:**
- ~7 justified client islands
- Every new `"use client"` must be explicitly justified
- Server Components import services directly, client components use fetch

## ADR-004: PostgreSQL tsvector for Search
**Date:** 2026-01
**Status:** Accepted
**Context:** Need full-text search across problems. MVP scale.
**Decision:** PostgreSQL built-in tsvector/tsquery instead of Elasticsearch or Algolia.
**Consequences:**
- No extra infrastructure
- Raw SQL via parameterized `sql` template tag
- GIN index on tsv column

## ADR-005: Soft Deletes over Hard Deletes
**Date:** 2026-01
**Status:** Accepted
**Context:** Need data recovery, audit trail, no cascading deletes.
**Decision:** Soft deletes via `deleted_at` on problems, comments, solution_spaces.
**Consequences:**
- All queries must include `WHERE deleted_at IS NULL`
- Reviewer must check for this in every review
- Data can be recovered within retention window

## ADR-006: Clerk over Custom Auth
**Date:** 2026-01
**Status:** Accepted
**Context:** Need auth for MVP. Solo developer. GitHub OAuth desired.
**Decision:** Clerk v5 hosted auth.
**Consequences:**
- Zero-ops auth
- Lazy user creation in DB
- Single admin via `ADMIN_CLERK_USER_ID` env var
- No password resets, MFA, session management to build

## ADR-007: DeepSeek Zen as Primary AI Worker
**Date:** 2026-07
**Status:** Accepted
**Context:** Need autonomous coding assistance. Budget constrained. Free model available.
**Decision:** DeepSeek Zen handles 85%+ of tasks. DeepSeek V4 Pro (Fireworks) only for complex reasoning.
**Consequences:**
- Router agent classifies every task before execution
- Max 3 V4 Pro calls per session
- Cost per session typically under $0.01

## ADR-008: OpenCode Autonomous Engineering System
**Date:** 2026-07
**Status:** Accepted
**Context:** Need production-grade autonomous coding environment.
**Decision:** 15 specialized agents, persistent memory, cache-optimized context system.
**Consequences:**
- `.opencode/` directory with agents, memory, summaries, cache, telemetry
- Every task follows defined pipeline (fast/standard/full)
- Quality gates enforced before every commit
