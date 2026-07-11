<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ProblemAtlas — Project Instructions

## Project Overview

ProblemAtlas is a **Next.js 16** "Problem Intelligence Platform" — a curated web app for discovering real-world problems and forming collaborative solution spaces. Currently in early prototype stage (UI with mock data). We're building toward a full MVP with PostgreSQL, Clerk auth, and real API routes.

## Architecture Constraints (Never Violate)

### Module Dependency Chain
```
lib/  ← imports NOTHING from features/ or app/
features/*/services.ts  ← imports from lib/ only
app/api/ (route handlers)  ← imports from features/*/services.ts and lib/
app/*/page.tsx (Server Components)  ← imports from features/*/services.ts
Client Components  ← call API routes via fetch(), NEVER import services
```

### State Management
- **No global state library.** Period. No Zustand, Redux, Jotai, etc.
- Server state → PostgreSQL queried in Server Components
- Auth state → Clerk hooks (`useAuth`, `useUser`)
- UI state → `useState` / `useReducer`
- Optimistic updates → `useOptimistic` (for interest toggle and comments)
- Data refetch → `router.refresh()` after mutations
- Form state → controlled `useState`

### Rendering
- Server Components by default. Every page starts as a Server Component.
- Only use `"use client"` for interactive islands where absolutely necessary.
- Known client islands: ProblemFilters, InterestButton, SolutionSpaceCreateModal, CommentSection, ArtifactAddModal, FlagButton, ProfileSetupForm.
- Every new client component must be justified.

### Data Layer
- All write endpoints validate input with Zod before any DB operation
- Soft deletes on `problems`, `comments`, `solution_spaces` (via `deletedAt`)
- All queries default to `WHERE deleted_at IS NULL`
- User IDs are UUIDs; content IDs are serial integers

### Authentication
- Clerk v5 via `@clerk/nextjs`
- Public routes allow unauthenticated GET
- Write operations guard inside route handlers via `await auth()`
- Lazy user creation: `getOrCreateUser(clerkId)` on first authenticated API call
- Profile completion gate: `externalProfileUrl` + `skills` required before creating Solution Spaces
- Admin: single user via `ADMIN_CLERK_USER_ID` env var

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19, shadcn/ui (radix-nova style), Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Auth | Clerk (`@clerk/nextjs` ^7) |
| Database | PostgreSQL 16+ |
| ORM | Drizzle ORM v0.45 + drizzle-kit v0.31 |
| Validation | Zod v4 |
| DB Client | `postgres` npm package (serverless pooling) |
| Icons | Lucide React |
| Icons | `lucide-react` |
| Package Manager | npm |

## Available Agents

Invoke with `@agent-name` in any message:

| Agent | Purpose |
|---|---|
| `@architect` | System architecture decisions, trade-off analysis, design reviews. Read-only. |
| `@advisor` | Code quality, security, performance reviews. Read-only. |
| `@quality` | Writing tests, test infrastructure, coverage. |
| `@db` | Database schema, migrations, queries, seed data. |

## Available Commands

| Command | Description |
|---|---|
| `/review [scope]` | Run full code review on recent changes |
| `/typecheck` | TypeScript check + lint |
| `/seed` | Run database seed script |
| `/migrate` | Generate and apply DB migrations |

## Phase Status

See `ROADMAP.md` for the full implementation plan.

**Current phase: Phase 0 complete** — infrastructure foundation committed. Next: set up PostgreSQL and run migrations.

## Code Review Standards (Self-Check Before Committing)

1. Does the code build? (`npm run build`)
2. Does lint pass? (`npm run lint`)
3. Are there any `any` types that could be specific types?
4. Are all `fetch` calls in client components handling errors?
5. Are all API routes validating input with Zod?
6. Is the module dependency chain respected? (No `lib/` importing from `features/`)
7. Are soft deletes handled everywhere?
8. Is `"use client"` justified?
9. Are all DB queries filtering `deleted_at IS NULL`?
10. Are auth errors returned in the standard `{ error: { code, message } }` format?

## File Naming

- Components: PascalCase, co-located with usage (e.g., `components/problem/ProblemCard.tsx`)
- Data access: camelCase in `lib/data/` (e.g., `lib/data/problems.ts`)
- Services: camelCase in `features/*/services.ts`
- Validators: camelCase in `features/*/validators.ts`
- API routes: kebab-case (e.g., `app/api/solution-spaces/[id]/route.ts`)
- Test files: `*.test.ts` co-located with source
