# Data Flow
<!-- last-updated: 2026-07-11 -->

## Read Flow (Server Components)
```
Browser
  │ GET /problems/101
  ▼
Next.js App Router
  │ matches app/problems/[id]/page.tsx
  ▼
Server Component (async function)
  │ import { getProblemById } from "@/features/problems/services"
  │ const problem = await getProblemById(101)
  ▼
features/problems/services.ts
  │ import { db } from "@/lib/db"
  │ import { problems } from "@/lib/db/schema"
  │ db.query.problems.findFirst({ where: ..., with: { ... } })
  ▼
lib/db/index.ts
  │ postgres client pool
  │ SELECT ... FROM problems WHERE ...
  ▼
PostgreSQL (Railway)
  │ Returns row data
  ▼
Server Component
  │ Renders HTML with data
  ▼
Browser (Fully rendered page, 0 client-side JS for this path)
```

## Write Flow (Client Islands)
```
Browser (client component)
  │ User clicks "I'm Interested"
  │ ClientComponent handles onClick:
  │   1. useOptimistic → instant UI toggle
  │   2. fetch("/api/problems/101/interest", { method: "POST" })
  ▼
Next.js Route Handler
  │ app/api/problems/[id]/interest/route.ts
  │   1. const { userId } = await auth() ← Clerk session check
  │   2. if (!userId) → 401 { error: { code: "UNAUTHORIZED" } }
  │   3. const user = await getOrCreateUser(userId)
  │   4. const result = await toggleInterest(user.id, problemId)
  ▼
features/interest/services.ts
  │ toggleInterest(userId, problemId)
  │   → Check if interest exists
  │   → If yes: DELETE
  │   → If no: INSERT
  │   → Return new state
  ▼
lib/db/index.ts → PostgreSQL
  │ INSERT/DELETE
  ▼
Route Handler returns:
  │ { data: { interested: true/false } }
  ▼
Client Component:
  │ if (!res.ok) → show error
  │ router.refresh() → re-renders parent Server Component
  ▼
Browser: Updated UI (optimistic was instant, server state confirmed)
```

## Auth Flow
```
Request
  ▼
clerkMiddleware (middleware.ts)
  │ Public route? → pass through
  │ Protected route? → verify Clerk JWT → attach to request
  ▼
Route Handler (server-side)
  │ const { userId } = await auth() ← from Clerk
  │ if (!userId) → return 401
  │ const dbUser = await getOrCreateUser(userId) ← lazy create
  │ (admin?) requireAdmin(dbUser.clerkId) ← check env var
  │ (owner?) assertOwnership(dbUser.id, resource.creatorId)
  ▼
Process request with authenticated user context
```
