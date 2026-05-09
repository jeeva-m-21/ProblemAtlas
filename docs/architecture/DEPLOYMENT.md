# Deployment
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Corrected — Ready to implement              |
| **Updated**   | 2025-01                                     |

---

## 1. Hosting Overview

| Service | Purpose | Plan |
|---|---|---|
| Vercel | Next.js app + Route Handlers | Hobby (free) |
| Railway | PostgreSQL — production | Starter (~$5/mo) |
| Railway | PostgreSQL — staging | Separate instance, same or separate project |
| Clerk | Authentication | Free for MVP scale |

---

## 2. Environment Variables

All variables are set in Vercel Dashboard → Settings → Environment Variables with separate values per environment (Production / Preview).

| Variable | Scope | Description |
|---|---|---|
| `DATABASE_URL` | Server | Railway PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public | Clerk publishable key |
| `CLERK_SECRET_KEY` | Server | Clerk secret key |
| `ADMIN_CLERK_USER_ID` | Server | Your Clerk user ID for admin operations |
| `NEXT_PUBLIC_APP_URL` | Public | Production URL (for Clerk redirect callbacks) |

**Local development:** Copy `.env.example` to `.env.local` and fill in values. Use a development Clerk instance and point `DATABASE_URL` at your Railway staging DB (or a local PostgreSQL instance).

```bash
# .env.example
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ADMIN_CLERK_USER_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Database Setup

### 3.1 Initial Setup (first time)

```bash
# 1. Create a Railway project, add a PostgreSQL database, copy the connection string
# 2. Add it to .env.local as DATABASE_URL

# 3. Push the Drizzle schema (development / staging only — never on production)
npx drizzle-kit push

# 4. Apply the full-text search migration manually
psql $DATABASE_URL -f drizzle/migrations/0001_add_tsv_column.sql

# 5. Verify the tsv column and GIN index exist
psql $DATABASE_URL -c "\d problems"
```

### 3.2 Production Migration Workflow

> ⚠️ **Never run `drizzle-kit push` against the production database.** It applies changes without a review step.

```bash
# 1. Make schema changes in lib/db/schema.ts

# 2. Generate a migration file from the diff
npx drizzle-kit generate
# → creates drizzle/migrations/XXXX_<name>.sql

# 3. Review the generated SQL carefully

# 4. Test against the staging database first
DATABASE_URL=<staging_url> npx drizzle-kit migrate

# 5. Deploy app to Vercel (or run migrate in CI before deploying)
npx drizzle-kit migrate   # run with production DATABASE_URL
```

**Pre-migration checklist:**
- [ ] Migration SQL reviewed manually
- [ ] Tested against staging DB first
- [ ] Backup snapshot taken (Railway dashboard or `pg_dump`)
- [ ] Rollback plan documented for destructive changes

### 3.3 Connection Pooling

Vercel serverless functions can open concurrent PostgreSQL connections. Configure `max: 1` per serverless instance:

```typescript
// lib/db/index.ts — see DATABASE_SCHEMA.md §5 for full implementation
const client = postgres(process.env.DATABASE_URL!, {
  max: process.env.NODE_ENV === "production" ? 1 : 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
```

**Production scaling:** Enable **PgBouncer** in Railway PostgreSQL settings → update `DATABASE_URL` to the PgBouncer connection string. No application code changes required.

---

## 4. Vercel Deployment

### 4.1 Initial Project Setup

1. Connect GitHub repository to Vercel (Import Project)
2. Framework preset: **Next.js** (auto-detected)
3. Build command: `pnpm build`
4. Install command: `pnpm install`
5. Root directory: `./`
6. Add all environment variables from §2

### 4.2 Environment Strategy

**Decision:** Preview deployments use a dedicated Railway **staging** database — never the production database. This prevents test data, schema experiments, and broken migrations from reaching production.

| Branch / Deploy target | Vercel Environment | Database |
|---|---|---|
| `main` | Production | Railway production DB |
| All other branches | Preview | Railway staging DB |

**How to configure in Vercel:**
- Dashboard → Settings → Environment Variables
- For `DATABASE_URL`: add a **Production** value (prod Railway URL) and a **Preview** value (staging Railway URL)
- All other variables can be shared across environments unless they differ

### 4.3 CI/CD

Every push triggers a Vercel preview build automatically. Add a GitHub Actions workflow for type-checking and linting on PRs:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
  pull_request:

jobs:
  typecheck-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Type check
        run: pnpm tsc --noEmit
      - name: Lint
        run: pnpm lint
```

---

## 5. Clerk Configuration

| Environment | Clerk Instance | Key Prefix |
|---|---|---|
| Local dev | Development instance | `pk_test_` |
| Staging / Preview | Development instance (same is fine) | `pk_test_` |
| Production | **Production instance** | `pk_live_` |

**Production checklist:**
- [ ] Switch `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to production instance values in Vercel
- [ ] Add production domain to Clerk's allowed origins (Clerk Dashboard → Domains)
- [ ] Set Clerk redirect URLs to production domain
- [ ] GitHub OAuth app updated with production callback URL if using a custom domain

---

## 6. Custom Domain

Configure in Vercel → Project → Settings → Domains. For MVP, the default `*.vercel.app` subdomain is fine. Update `NEXT_PUBLIC_APP_URL` when adding a custom domain.

---

## 7. Monitoring & Logging

| Tool | What it covers |
|---|---|
| Vercel Runtime Logs | Request logs, error traces, function duration — Vercel Dashboard → Logs |
| Vercel Web Analytics | Page views, web vitals — enable in Vercel Project Settings |
| Vercel Speed Insights | Real-user performance data — enable in Vercel Project Settings |
| Railway Logs | PostgreSQL query logs, slow query detection |
| Sentry (post-MVP) | Error tracking with stack traces and source maps |

---

## 8. Backup & Recovery

- Railway Starter plan: automated daily backups. Verify your plan's retention period in Railway Dashboard.
- Supplement with a weekly manual dump:

```bash
# Manual backup
pg_dump $DATABASE_URL -Fc -f backup_$(date +%Y%m%d).dump

# Restore (if needed)
pg_restore -d $DATABASE_URL backup_YYYYMMDD.dump
```

Soft deletes on `problems`, `comments`, and `solution_spaces` reduce the blast radius of accidental deletes — data is recoverable via `UPDATE ... SET deleted_at = NULL`.

---

## 9. Pre-Launch Checklist

**Infrastructure**
- [ ] All Vercel environment variables set for production
- [ ] Clerk switched to Production mode with production keys
- [ ] Production DB migrations applied and verified (`\d problems` shows `tsv` column + GIN index)
- [ ] Staging DB tested with all flows end-to-end

**Application**
- [ ] At least 20 curated problems published
- [ ] Admin routes verified: create problem, publish, moderate comments
- [ ] Full-text search tested with real queries
- [ ] Interest toggle, comment post, and solution space creation all work in production

**Security & Performance**
- [ ] Rate limiting configured on write endpoints (Vercel Firewall or Upstash)
- [ ] Clerk redirect URLs configured for production domain
- [ ] Landing page Lighthouse score: LCP < 2.5s on mobile
- [ ] WCAG 2.1 AA spot-check on problem detail page

**Operational**
- [ ] Vercel Web Analytics enabled
- [ ] Railway automated backups verified
- [ ] Error logs reviewed after first day of traffic
