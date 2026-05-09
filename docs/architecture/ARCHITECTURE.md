# System Architecture
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Corrected — Ready to implement              |
| **Updated**   | 2025-01                                     |

---

## 1. Architecture Style

**Modular Monolith** within a single Next.js application.

All logic runs in Next.js Route Handlers (`app/api/`) or Server Components. No separate backend service. No microservices. No message queues.

**Why a modular monolith:**
- Solo-developer velocity — one codebase, one deploy, one CI pipeline
- Simplified deployment (Vercel + Railway)
- No distributed systems complexity at MVP scale
- Feature-based modules provide clear responsibility boundaries without service overhead
- Any module that becomes a bottleneck can be extracted later without rewriting the rest

---

## 2. Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | RSC by default, file-based routing |
| UI | Tailwind CSS + shadcn/ui + Framer Motion | Rapid, polished UI without a custom component library |
| Backend API | Next.js Route Handlers | Co-located with frontend, Clerk middleware applies naturally |
| Database | PostgreSQL (Railway) | Full-text search, JSONB, strong typing, reliable |
| ORM | Drizzle ORM | Type-safe, SQL-like, lightweight |
| Auth | Clerk v5 (`@clerk/nextjs`) | Hosted auth, GitHub OAuth, zero-ops |
| Search | PostgreSQL `tsvector` / `tsquery` | No extra infrastructure at MVP scale |
| DB Client | `postgres` npm package | Correct serverless connection pooling (see DATABASE_SCHEMA.md §5) |
| Hosting | Vercel (app) + Railway (DB) | Free tiers for MVP, CI/CD built-in on Vercel |

---

## 3. Directory Structure

```
src/
├── app/
│   ├── layout.tsx                      # Root layout (ClerkProvider, theming)
│   ├── error.tsx                       # Global error boundary
│   ├── not-found.tsx                   # 404 page
│   ├── page.tsx                        # Landing page (Server Component)
│   ├── explore/
│   │   └── page.tsx                    # Problem listing (Server Component)
│   ├── problems/
│   │   └── [id]/
│   │       ├── page.tsx                # Problem detail (Server + client islands)
│   │       └── error.tsx
│   ├── spaces/
│   │   └── [id]/
│   │       ├── page.tsx                # Solution Space detail (Server + client islands)
│   │       └── error.tsx
│   ├── profile/
│   │   ├── me/
│   │   │   └── page.tsx                # Redirects to /profile/[currentUserId]
│   │   ├── setup/
│   │   │   └── page.tsx                # Post-signup profile completion (auth-gated)
│   │   └── [id]/
│   │       └── page.tsx                # Public profile (Server Component)
│   └── api/
│       ├── problems/
│       │   ├── route.ts                # GET list, POST create (admin)
│       │   └── [id]/
│       │       ├── route.ts            # GET detail
│       │       ├── comments/route.ts   # GET list, POST create
│       │       └── interest/route.ts   # POST toggle
│       ├── comments/
│       │   └── [id]/
│       │       └── flag/route.ts       # POST flag
│       ├── solution-spaces/
│       │   ├── route.ts                # GET list (by problem), POST create
│       │   └── [id]/
│       │       ├── route.ts            # GET, PATCH
│       │       └── artifacts/route.ts  # POST add artifact
│       ├── artifacts/
│       │   └── [id]/route.ts           # DELETE remove artifact
│       └── users/
│           ├── [id]/route.ts           # GET public profile
│           └── me/route.ts             # PATCH update current user profile
│
├── features/                           # Domain modules — self-contained
│   ├── problems/
│   │   ├── components/                 # ProblemCard, ProblemFilters, InterestSection, etc.
│   │   ├── services.ts                 # Business logic (curation, validation, queries)
│   │   ├── validators.ts               # Zod schemas (shared client + server)
│   │   └── types.ts
│   ├── solution-spaces/
│   │   ├── components/                 # SolutionSpaceCard, CreateModal, ArtifactList, etc.
│   │   ├── services.ts
│   │   ├── validators.ts
│   │   └── types.ts
│   ├── comments/
│   │   ├── components/                 # CommentList, CommentItem, CommentForm
│   │   ├── services.ts
│   │   └── validators.ts
│   ├── interest/
│   │   ├── services.ts
│   │   └── validators.ts
│   └── users/
│       ├── components/                 # ProfileCard, ProfileSetupForm
│       ├── services.ts
│       └── validators.ts
│
├── lib/                                # Shared infrastructure — no feature imports
│   ├── auth/
│   │   └── index.ts                    # getAuthUserId, requireAdmin, assertOwnership
│   ├── db/
│   │   ├── index.ts                    # Drizzle client (postgres package, pool config)
│   │   └── schema.ts                   # All table/enum definitions
│   ├── users/
│   │   ├── getOrCreateUser.ts          # Lazy user creation
│   │   └── profileGuard.ts             # assertProfileComplete, ProfileIncompleteError
│   ├── search.ts                       # Full-text search query builder
│   └── utils.ts                        # Shared utilities (formatting, slugs, etc.)
│
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   └── layout/                         # Navbar, Footer, Container
│
└── middleware.ts                        # clerkMiddleware route protection
```

**Module dependency rule:**
- `lib/` → no imports from `features/` (ever)
- `features/*/services.ts` → may import from `lib/` only
- Server Components → import from `features/*/services.ts` directly
- Client Components → call API routes via `fetch`, never import services
- `app/api/` route handlers → import from `features/*/services.ts` and `lib/`

---

## 4. Rendering Strategy

| Page | Strategy | Why |
|---|---|---|
| Landing, Explore | Server Component | SEO-critical; no interactivity; DB access directly |
| Problem Detail | Server + client islands | Main content server-rendered; comments, interest button, CTA are interactive |
| Solution Space Detail | Server + client islands | Artifact list server-rendered; add-artifact form is a client modal |
| Public Profile | Server Component | Read-only, no interactivity needed |
| Profile Setup | Client form | Multi-step form with local state and file/URL validation |

### Client Island Mutation Pattern

```typescript
// Standard mutation flow in any client island:
async function handleAction() {
  setOptimistic(newState);                                    // 1. instant UI feedback
  await fetch("/api/...", { method: "POST", body: ... });    // 2. persist to DB
  router.refresh();                                           // 3. re-sync server state
}
```

For latency-sensitive interactions (interest toggle, comment post), use `useOptimistic` for step 1 so the UI feels instant regardless of network speed.

---

## 5. API Design

### Endpoint Table

| Endpoint | Methods | Auth |
|---|---|---|
| `GET /api/problems` | GET | Public |
| `POST /api/problems` | POST | Admin only |
| `GET /api/problems/[id]` | GET | Public |
| `GET /api/problems/[id]/comments` | GET | Public |
| `POST /api/problems/[id]/comments` | POST | Authenticated |
| `POST /api/comments/[id]/flag` | POST | Authenticated |
| `POST /api/problems/[id]/interest` | POST | Authenticated |
| `GET /api/solution-spaces?problemId=` | GET | Public |
| `POST /api/solution-spaces` | POST | Auth + profile complete |
| `GET /api/solution-spaces/[id]` | GET | Public |
| `PATCH /api/solution-spaces/[id]` | PATCH | Owner only |
| `POST /api/solution-spaces/[id]/artifacts` | POST | Owner only |
| `DELETE /api/artifacts/[id]` | DELETE | Owner only |
| `GET /api/users/[id]` | GET | Public |
| `PATCH /api/users/me` | PATCH | Authenticated |

### Response Envelope

```typescript
// 200 / 201 — Success
{ "data": { ... } }

// 422 — Validation error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": [{ "field": "name", "message": "Required" }]
  }
}

// 401 / 403 / 500
{ "error": { "code": "UNAUTHORIZED" | "FORBIDDEN" | "INTERNAL_ERROR", "message": "..." } }
```

### Validation

All request bodies are validated with **Zod** before any DB operation:
- Schemas defined in `features/*/validators.ts`
- Validation errors return `422` with a `fields` array
- Zod schemas are shared between client-side form validation and server-side route validation

---

## 6. Full-Text Search

Triggered by `GET /api/problems?q={query}&domain={domain}`.

See DATABASE_SCHEMA.md §4 for the `tsv` column migration SQL and the search query pattern. The query is a raw SQL call using the `sql` template tag (parameterised — not vulnerable to injection).

```
GET /api/problems?q=robotics+mapping&domain=AI%2FML
→ WHERE tsv @@ plainto_tsquery('english', 'robotics mapping')
  AND domain = 'AI/ML'
  AND validation_status = 'published'
  AND deleted_at IS NULL
ORDER BY ts_rank(tsv, query) DESC
```

---

## 7. Admin Authorization

A single `ADMIN_CLERK_USER_ID` environment variable identifies the platform curator. `requireAdmin()` (see AUTH_FLOW.md §4) is the first call in every admin route handler. No DB role column needed for a single-curator MVP.

---

## 8. Rate Limiting

> **Important:** Vercel's DDoS protection operates at the network layer only. It does not protect against an authenticated user spamming write endpoints in a loop.

**MVP approach — pre-launch hardening step:**

Option A (simpler): Vercel Firewall rules (in Vercel Dashboard → Firewall)
Option B (per-user): `@upstash/ratelimit` with Upstash Redis

Recommended limits:
| Endpoint | Limit |
|---|---|
| `POST /api/problems/[id]/comments` | 10 requests / min / user |
| `POST /api/solution-spaces` | 5 requests / hour / user |
| `POST /api/problems/[id]/interest` | 20 requests / min / user |

---

## 9. Security Checklist

| Concern | Mitigation |
|---|---|
| SQL injection | Drizzle ORM parameterised queries throughout; raw search uses `sql` tag (parameterised) |
| Input validation | Zod schemas on all write endpoints before any DB access |
| CORS | Not applicable — API and frontend share the same Vercel domain |
| Soft deletes | `deleted_at` on `problems`, `comments`, `solution_spaces`; all queries default to `WHERE deleted_at IS NULL` |
| Owner enforcement | Route handlers fetch the resource then call `assertOwnership()` before mutation |
| Admin enforcement | All admin routes call `requireAdmin()` as the first operation |
| Sequential ID enumeration | `User.id` is UUID; content IDs are serial integers (acceptable — content is public) |

---

## 10. System Diagram

```
Browser
  │
  ├── GET /problems/[id] ────────► Next.js Server Component
  │                                    └── features/problems/services.ts
  │                                    └── Drizzle query → PostgreSQL (Railway)
  │                                    └── Renders HTML ──────────────────────► Browser
  │
  ├── POST /api/comments ────────► Next.js Route Handler (app/api/problems/[id]/comments/route.ts)
  │                                    └── await auth() → Clerk session check
  │                                    └── Zod validate body
  │                                    └── getOrCreateUser(clerkId)
  │                                    └── features/comments/services.ts
  │                                    └── Drizzle insert → PostgreSQL
  │                                    └── { data: comment } ──────────────────► Browser
  │
  └── Client Component (CommentSection.tsx)
         └── fetch('/api/problems/[id]/comments', { method: 'POST', ... })
         └── useOptimistic → instant UI update
         └── On success: router.refresh() → re-renders parent Server Component
```
