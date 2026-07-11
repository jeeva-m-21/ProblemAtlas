# ProblemAtlas

> A curated problem intelligence platform — discover, collaborate, and build solutions around real-world problems that matter.

**ProblemAtlas** is a "research OS" for researchers, developers, founders, and students. It shifts innovation from tool-centric coordination to **problem-centric exploration**: problems are the hub, and everything — interest, discussion, collaboration artifacts — orbits them.

**North Star:** *From problem discovery to collaborative exploration and solution building in minutes.*

---

## Status

This is an **early frontend prototype** (MVP work-in-progress). All data currently comes from static mock files — no backend, database, or authentication is wired yet. The architecture is fully planned in the [`docs/`](docs/) directory.

---

## Features (MVP Scope)

| Feature | Status |
|---|---|
| **Problem Discovery** — Browse/search a curated catalog of validated real-world problems with full-text search | ✅ UI |
| **Problem Detail Pages** — Progressive disclosure with summaries, gaps, approaches, sources, and discussion | ✅ UI |
| **"I'm Interested"** — Express interest in a problem (toggle) | ✅ UI |
| **Solution Spaces** — Lightweight collaborative workspaces around a problem with linked artifacts (repos, papers, datasets, prototypes) | ✅ UI |
| **Discussion Threads** — Flat chronological comments on problem detail pages | ✅ UI |
| **User Profiles** — Public profiles with skills, bio, and external links | ✅ UI |
| **Authentication** — Planned via Clerk (GitHub OAuth) | ⏳ Planned |
| **Admin Curation** — Single admin controls problem lifecycle (draft → reviewed → published → solved → archived) | ⏳ Planned |
| **PostgreSQL + Drizzle ORM** | ⏳ Planned |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **UI** | React 19, [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS 4 |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Auth (planned)** | Clerk |
| **ORM (planned)** | Drizzle ORM + PostgreSQL |
| **Validation (planned)** | Zod |
| **Package Manager** | npm |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
app/                    # Next.js App Router pages
├── auth/               # Sign-in / sign-up (UI-only MVP)
├── explore/            # Problem listing / browsing
├── problems/[id]/      # Problem detail pages
├── spaces/             # Solution space listing & detail
├── profile/[id]/       # User profiles
├── search/             # Global search
└── onboarding/         # Domain selection onboarding

components/             # React components
├── auth/               # Auth-related components
├── comments/           # Discussion thread components
├── layout/             # App shell, navbar, sidebar
├── problem/            # Problem card, detail header, etc.
├── profile/            # Profile header, stats, interests
├── search/             # Search bar, filters, results
├── space/              # Solution space, artifact cards
├── system/             # System UI (command bar, status bar, etc.)
└── ui/                 # shadcn/ui primitives

data/                   # Static mock data files
docs/                   # Architecture & SRS documentation
├── architecture/       # System design docs
└── srs/                # Requirements & entity definitions

lib/                    # Shared utilities
public/                 # Static assets
```

---

## Documentation

Extensive design documentation is available in the [`docs/`](docs/) directory:

- **[MVP Scope](docs/srs/MVP_SCOPE.md)** — Full MVP requirements, personas, and scope
- **[Entity Definitions](docs/srs/ENTITY_DEFINITIONS.md)** — Domain model for users, problems, solution spaces, artifacts, etc.
- **[User Flows](docs/srs/USER_FLOWS.md)** — Key user journeys
- **[Architecture](docs/architecture/ARCHITECTURE.md)** — System architecture overview
- **[Database Schema](docs/architecture/DATABASE_SCHEMA.md)** — Planned PostgreSQL schema with Drizzle ORM
- **[Auth Flow](docs/architecture/AUTH_FLOW.md)** — Clerk authentication design
- **[Frontend Architecture](docs/architecture/FRONTEND_ARCHITECTURE.md)** — Component tree, data flow, and routing
- **[Deployment](docs/architecture/DEPLOYMENT.md)** — Deployment guide

---

## License

Private / closed-source.
