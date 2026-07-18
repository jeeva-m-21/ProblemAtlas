# Architecture State
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Module Dependency Chain (Strict)
```
lib/  ← imports NOTHING from features/ or app/
features/*/services.ts  ← imports from lib/ only
app/api/ (route handlers)  ← imports from features/*/services.ts and lib/
app/*/page.tsx (Server Components)  ← imports from features/*/services.ts
Client Components  ← call API routes via fetch(), NEVER import services
```

## Rendering Strategy
| Page | Strategy |
|---|---|
| Landing, Explore | Server Component |
| Problem Detail | Server + client islands (comments, interest) |
| Solution Space Detail | Server + client islands (add artifact) |
| Profile | Server Component (public view) |
| Profile Setup | Client form |
| Search | Client (fetch-based) |

## Client Islands (Interactive Only)
| Component | Justification |
|---|---|
| ProblemFilters | Search input + domain filter state |
| InterestButton | Toggle with optimistic update |
| SolutionSpaceCreateModal | Dialog open state + form |
| CommentSection | Post, reply, flag actions |
| ArtifactAddModal | Dialog open state + form |
| FlagButton | Single async action |
| ProfileSetupForm | Multi-step form with local state |

## State Management
| State Type | Location | Mechanism |
|---|---|---|
| Server/DB | PostgreSQL | Server Components + router.refresh() |
| Auth | Clerk | useAuth(), useUser() hooks |
| UI (modals, tabs) | Local component | useState, useReducer |
| Optimistic UI | Client component | useOptimistic |
| Form state | Form component | Controlled useState |

## Mutation Pattern
```
1. Optimistic update (useOptimistic) — instant UI
2. fetch → POST/PATCH → API route
3. API route: auth check → Zod validate → service call → DB mutation
4. router.refresh() — re-sync server state
```

## Data Flow
```
Browser Request
  → Next.js Server Component
    → features/*/services.ts
      → Drizzle query → PostgreSQL
        → Renders HTML → Browser

Browser Interaction
  → Client Component fetch → /api/...
    → Clerk auth check
      → Zod validation
        → Service call → Drizzle → PostgreSQL
          → { data } / { error } → Client
            → router.refresh()
```

## Directory Structure
```
app/           — Pages, layouts, API routes (12 routes, 0 API routes)
components/    — 52 components (layout, problem, space, comments, profile, search, auth, system, ui)
lib/           — db (schema, client), auth, users, search, utils, animation, navigation
features/      — (planned) problems, solution-spaces, comments, interest, users
data/          — 7 mock data files (to be replaced)
docs/          — architecture, SRS, deployment
```
