# Coding Standards
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## File Naming
| Context | Convention | Example |
|---|---|---|
| Components | PascalCase, co-located | `components/problem/ProblemCard.tsx` |
| Data access | camelCase in `lib/data/` | `lib/data/problems.ts` |
| Services | camelCase in `features/*/` | `features/problems/services.ts` |
| Validators | camelCase in `features/*/` | `features/problems/validators.ts` |
| API routes | kebab-case | `app/api/solution-spaces/[id]/route.ts` |
| Test files | `*.test.ts` co-located | `lib/data/problems.test.ts` |
| Types | PascalCase | `ProblemCardProps`, `CommentEntity` |
| Functions | camelCase | `getProblems`, `createComment` |
| Constants | UPPER_SNAKE_CASE | `MAX_COMMENT_LENGTH` |

## TypeScript Rules
- `strict: true` in tsconfig.json — never override
- NO `any` types — use `unknown` + type guards if truly unknown
- Explicit return types on all exported functions
- Use `InferSelectModel` / `InferInsertModel` from Drizzle for DB types
- Zod v4 syntax for validation schemas

## Import Convention
- Path alias: `@/` maps to project root
- No relative imports crossing more than 2 directory levels
- Import order: React/Next → third-party → project (@/) → relative
- Named imports preferred over default imports (except React/Next defaults)

## Component Rules
- One component per file
- Props interface exported, named `{ComponentName}Props`
- Server Component by default; `"use client"` only when absolutely necessary
- No `useEffect` for data fetching
- Error boundaries (`error.tsx`) for every route segment with dynamic data

## API Route Rules
- Every write endpoint validates input with Zod before any DB operation
- Auth checks are the FIRST operation in the handler
- Response envelope: `{ data }` for success, `{ error: { code, message } }` for errors
- Validation errors: 422 with `{ error: { code: "VALIDATION_ERROR", fields: [...] } }`
- Wrap handler logic in try/catch

## Database Rules
- All queries for soft-delete tables include `WHERE deleted_at IS NULL`
- Use Drizzle's query builder (`db.query.table.findMany()`) not raw SQL unless necessary
- Raw SQL only via parameterized `sql` template tag (never string concat)
- Serverless pool: `max: 1` in production, `max: 10` in dev
- Explicit column selection, never `SELECT *`

## Auth Rules
- Public routes: unauthenticated GET
- Write operations: `getAuthUserId()` before processing
- Admin: `requireAdmin()` as first operation
- Owner: fetch resource, then `assertOwnership()`
- Profile gate: `externalProfileUrl` + `skills` required for solution space creation

## Comment Guidelines
- No comments explaining WHAT code does (code should be self-documenting)
- JSDoc on all exported functions explaining WHY and edge cases
- No commented-out code — delete it
- TODO comments allowed with format: `// TODO(username): description`

## Quality Gates (Pre-Commit)
1. `npm run build` passes
2. `npm run lint` passes
3. No `any` types
4. Module dependency rules respected
5. Soft delete filtering present
6. `"use client"` justified
7. Auth guards on write endpoints
8. Zod validation on all inputs
9. Error handling on all fetch calls
10. Response envelope format correct
