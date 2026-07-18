# Security Decisions
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Auth Model
- **Provider:** Clerk v5 (hosted auth)
- **Session:** JWT-based, managed by Clerk middleware
- **Public routes:** All GET endpoints without write side effects
- **Protected routes:** All mutation endpoints (POST, PATCH, DELETE)
- **Admin:** Single user identified by `ADMIN_CLERK_USER_ID` env var
- **Owner enforcement:** Route handlers fetch resource, then `assertOwnership(userId, resource)`

## Auth Flow
```
Request → clerkMiddleware (public route? pass : verify JWT)
  → Route Handler
    → await auth() → get userId
    → getAuthUserId(userId) → get/create user record
    → (admin endpoint?) requireAdmin(user.clerkId) → pass/fail
    → (owner mutation?) assertOwnership(user.id, resource.owner_id) → pass/fail
```

## Data Protection
- **Soft deletes:** problems, comments, solution_spaces use `deleted_at` instead of hard delete
- **Input validation:** All user input validated with Zod BEFORE touching database
- **SQL injection prevention:** Drizzle ORM parameterized queries; raw search uses `sql` tag
- **Response envelope:** Consistent `{ data }` / `{ error }` format — no raw errors exposed
- **User IDs:** UUIDs (unguessable) — prevents enumeration attacks
- **Content IDs:** Serial integers (acceptable — content is public by design)

## Threat Model (MVP)

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| SQL injection | Low | High | Drizzle ORM + parameterized `sql` tag |
| XSS | Low | Medium | React's auto-escaping, Content-Security-Policy |
| CSRF | Low | Medium | Next.js built-in protection, Clerk handles auth tokens |
| Unauthorized writes | Medium | High | Auth guards on all mutation endpoints |
| Data exposure via enumeration | Low | Medium | UUIDs for user IDs, serial IDs for public content |
| Rate limiting abuse | Medium | Medium | Planned: Vercel Firewall or Upstash rate limit |
| Secret exposure | Low | Critical | `.env.local` gitignored, no `NEXT_PUBLIC_` secrets |

## Security Checklist (Per-Change)
- [ ] Auth guards on all mutation endpoints
- [ ] Zod validation before DB operations
- [ ] `WHERE deleted_at IS NULL` on all queries
- [ ] No string-concatenated SQL
- [ ] No secrets in client components
- [ ] No sensitive data in query parameters
- [ ] Response doesn't expose internal errors to user
- [ ] Rate limiting considered for public mutation endpoints
