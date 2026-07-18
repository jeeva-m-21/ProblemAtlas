# Architecture Constraints — NEVER VIOLATE
<!-- stable-hash: a1b2c3d4 -->

These rules are immutable within any session. They represent hard boundaries of the system.

## 1. Module Dependency Chain
```
lib/  ← imports NOTHING from features/ or app/
features/*/services.ts  ← imports from lib/ only
app/api/ (route handlers)  ← imports from features/*/services.ts and lib/
app/*/page.tsx (Server Components)  ← imports from features/*/services.ts
Client Components  ← call API routes via fetch(), NEVER import services
```

## 2. State Management
- NO global state library (Zustand, Redux, Jotai, Valtio, MobX, etc.)
- Server state → PostgreSQL
- Auth state → Clerk hooks
- UI state → useState / useReducer
- Optimistic UI → useOptimistic
- Form state → controlled useState

## 3. Rendering Strategy
- Server Components by default
- `"use client"` only for interactive islands
- Every new client component must be justified

## 4. Data Layer
- All write endpoints validate with Zod before any DB operation
- Soft deletes on: problems, comments, solution_spaces
- All queries: `WHERE deleted_at IS NULL` for soft-delete tables
- Response envelope: `{ data }` or `{ error: { code, message } }`

## 5. Authentication
- Public routes allow unauthenticated GET
- Write operations: `getAuthUserId()` first
- Admin: `requireAdmin()` as first operation
- Owner mutations: `assertOwnership()` before mutation
- Profile completion gate: solution space creation

## 6. File Naming
- Components: PascalCase → `ProblemCard.tsx`
- Data access: camelCase → `problems.ts`
- Services: camelCase → `services.ts`
- Validators: camelCase → `validators.ts`
- API routes: kebab-case → `solution-spaces/[id]/route.ts`
- Tests: `*.test.ts` co-located

## 7. Code Style
- No `any` types (use `unknown` + type guard)
- Explicit return types on exported functions
- `@/` path alias for all internal imports
- JSDoc on exported functions
- No commented-out code

## 8. Security
- No secrets in client components
- No `NEXT_PUBLIC_` prefix on actual secrets
- Parameterized SQL only (Drizzle ORM or `sql` tag)
- All user input validated before DB access
