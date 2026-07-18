# CI/CD Configuration
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Status: NOT YET CONFIGURED

CI/CD is planned but not implemented. Reference config in `docs/architecture/DEPLOYMENT.md`.

## Planned CI Pipeline (GitHub Actions)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # - run: npm test  (once tests exist)
```

## Deployment
- **Hosting:** Vercel (automatic deploys on push to main)
- **Database:** Railway (PostgreSQL 16+)
- **Auth:** Clerk (production environment)

## Deployment Steps (Phase 6)
1. Set up Railway PostgreSQL instance (production)
2. Copy production DATABASE_URL to Vercel env vars
3. Set up Clerk production environment
4. Configure Vercel project:
   - Framework: Next.js
   - Build command: `npm run build`
   - Root directory: `.`
5. Push to main → Vercel auto-deploys
6. Run database migrations against production DB
7. Verify deployment
