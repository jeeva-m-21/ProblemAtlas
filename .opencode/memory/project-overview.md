# ProblemAtlas — Project Overview
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Identity
- **Name:** ProblemAtlas
- **Type:** Next.js 16 web application
- **Domain:** Problem Intelligence Platform
- **Purpose:** Curated web app for discovering real-world research/engineering problems and forming collaborative solution spaces

## Current Status
- **Phase:** Phase 0 complete (infrastructure foundation)
- **State:** Frontend-only MVP prototype with static mock data
- **Next:** Set up PostgreSQL, run migrations, seed database, wire real queries

## Architecture Style
- **Type:** Modular Monolith (single Next.js app)
- **Rationale:** Solo-developer velocity, simplified deployment, no distributed complexity at MVP scale
- **Extraction Path:** Any module can be extracted to separate service later without rewrite

## Tech Stack
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| Language | TypeScript (strict) | 5 |
| UI | React + shadcn/ui (radix-nova) + Tailwind CSS | 19 / 4 |
| Animation | Framer Motion | 12 |
| Auth | Clerk | @clerk/nextjs ^7 |
| Database | PostgreSQL | 16+ |
| ORM | Drizzle ORM + drizzle-kit | 0.45 / 0.31 |
| Validation | Zod | 4 |
| DB Client | postgres (serverless pooling) | 3 |
| Icons | Lucide React | latest |
| Hosting | Vercel (app) + Railway (DB) | — |

## Key Architecture Rules
1. `lib/` must NEVER import from `features/` or `app/`
2. No global state library (no Zustand, Redux, Jotai)
3. Server Components by default; client islands justified
4. All write endpoints validate with Zod before DB
5. Soft deletes on problems, comments, solution_spaces
6. Dark mode only

## Repository Layout
```
app/           — Next.js App Router (pages, layouts, API routes)
components/    — Shared UI components (layout, problem, space, comments, etc.)
features/      — Domain modules (services, validators, types, components)
lib/           — Shared infrastructure (db, auth, users, search, utils)
data/          — Mock data (to be replaced by PostgreSQL)
docs/          — Architecture, SRS, deployment documentation
drizzle/       — Drizzle ORM migration files
public/        — Static assets
```
