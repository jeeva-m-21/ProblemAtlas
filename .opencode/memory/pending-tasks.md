# Pending Tasks
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Phase 1 — Seed Data & Core Queries
- [ ] 1.1 Write `lib/db/seed.ts` — seed all 10 tables from mock data
- [ ] 1.2 Run seed script: `tsx lib/db/seed.ts`
- [ ] 1.3 Create `lib/data/problems.ts` — `getProblems()`, `getProblemById()`
- [ ] 1.4 Create `lib/data/spaces.ts` — `getSolutionSpaces()`, `getSpaceById()`
- [ ] 1.5 Create `lib/data/profiles.ts` — `getProfile()`, `getProfileByClerkId()`
- [ ] 1.6 Create `lib/data/comments.ts` — `getComments()`, `getThreads()`
- [ ] 1.7 Create `lib/data/search.ts` — `searchAll()`
- [ ] 1.8 Wire `app/explore/page.tsx` → real DAL
- [ ] 1.9 Wire `app/problems/[id]/page.tsx` → real DAL
- [ ] 1.10 Wire `app/spaces/page.tsx` + `app/spaces/[id]/page.tsx` → real DAL
- [ ] 1.11 Wire `app/profile/[id]/page.tsx` → real DAL
- [ ] 1.12 Wire `app/search/page.tsx` → real DAL

## Phase 2 — Authentication & User Management
- [ ] 2.1 Add `<ClerkProvider>` wrapper to layout
- [ ] 2.2 Replace sign-in stub with `<SignIn />`
- [ ] 2.3 Replace sign-up stub with `<SignUp />`
- [ ] 2.4 Implement lazy user creation
- [ ] 2.5 Implement auth helpers
- [ ] 2.6 Implement profile guard
- [ ] 2.7 Wire onboarding page to DB
- [ ] 2.8 PATCH `/api/users/me`
- [ ] 2.9 `/profile/me` → redirect to `/profile/[id]`

## Phase 3 — API Routes
- [ ] 3.1 GET/POST `/api/problems`
- [ ] 3.2 GET `/api/problems/[id]`
- [ ] 3.3 GET/POST `/api/problems/[id]/comments`
- [ ] 3.4 POST `/api/problems/[id]/interest`
- [ ] 3.5 POST `/api/comments/[id]/flag`
- [ ] 3.6 GET/POST `/api/solution-spaces`
- [ ] 3.7 GET/PATCH `/api/solution-spaces/[id]`
- [ ] 3.8 POST `/api/solution-spaces/[id]/artifacts`
- [ ] 3.9 DELETE `/api/artifacts/[id]`
- [ ] 3.10 Wire client components to real API

## Phase 4 — Full-Text Search
- [ ] 4.1 Implement search query builder
- [ ] 4.2 GET `/api/search`
- [ ] 4.3 Wire search page to real API

## Phase 5 — Admin Curation
- [ ] 5.1 PATCH `/api/admin/problems/[id]`
- [ ] 5.2 DELETE `/api/admin/comments/[id]`
- [ ] 5.3 Admin UI on problem detail

## Phase 6 — Polish, Testing & Deploy
- [ ] 6.1 Add Vitest for unit tests
- [ ] 6.2 Add Playwright for E2E
- [ ] 6.3 Add error.tsx to all segments
- [ ] 6.4 Add toast notifications
- [ ] 6.5 Add generateMetadata to pages
- [ ] 6.6 Set up Railway PostgreSQL (prod)
- [ ] 6.7 Set up Vercel + Clerk prod
- [ ] 6.8 Run migrations and deploy
