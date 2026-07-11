---
name: state-management
description: Use when designing or implementing state management patterns. Covers the project's no-global-state-library approach with Server Components, Clerk auth, useOptimistic, and local state.
---

# State Management Architecture

## Principle: No Global State Library
ProblemAtlas deliberately avoids Redux, Zustand, Jotai, or any global state library. State is managed through four distinct mechanisms:

| State Type | Location | Mechanism |
|---|---|---|
| Server / DB | PostgreSQL | Server Components query directly, `router.refresh()` to re-sync |
| Auth | Clerk | `useAuth()`, `useUser()` hooks, `auth()` in server context |
| UI (modals, tabs) | Local component | `useState`, `useReducer` |
| Optimistic UI | Client component | `useOptimistic` |
| Form state | Form component | Controlled `useState` |

## Data Flow Pattern

```
Browser Request
    │
    ▼
Server Component
    │  imports → features/*/services.ts
    │  queries → Drizzle → PostgreSQL
    │  renders HTML with data props
    │
    ├── Client Island (interactive)
    │      │
    │      ├── User clicks → optimistic update (useOptimistic)
    │      ├── fetch → POST /api/... → Route Handler
    │      │      ├── auth check → Clerk
    │      │      ├── Zod validation → return 422 on error
    │      │      ├── service call → Drizzle mutation
    │      │      └── response → client
    │      └── router.refresh() → re-renders parent Server Component
    │
    └── Static content (no interactivity needed)
```

## When to Add State
Before adding ANY state (useState, context, etc.), ask:
1. Can this be computed from existing DB data? → compute server-side
2. Is this auth-related? → use Clerk hooks
3. Is this transient UI state (modal open, tab active)? → `useState`
4. Is this a latency-sensitive toggle? → `useOptimistic`
5. Is this form input? → controlled `useState`

If the answer is none of the above, re-think whether the state is needed.

## Why No Global State
- Clerk already handles auth state globally
- All server data should come from DB queries, not a client cache
- `router.refresh()` is the built-in "cache invalidation" mechanism
- Adding a global store would add complexity without solving any real problem at MVP scale
- Server Components make client-side caching largely unnecessary
