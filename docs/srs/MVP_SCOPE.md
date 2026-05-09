# Minimum Viable Product Scope
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Approved — Frozen for MVP                   |
| **Updated**   | 2025-01                                     |

---

## 1. Executive Summary

**Problem Intelligence** is a curated, closed-source web platform that helps researchers, developers, founders, and students to:

- **Discover** deeply validated, real-world problems worth solving
- **Connect** with capable collaborators across disciplines
- **Form lightweight solution spaces** and collaboratively build or explore answers through linked artifacts (repositories, papers, datasets, prototypes, etc.)

The platform shifts innovation from *tool-centric coordination* to **problem-centric exploration**. Problems are the hub. Everything — interest, collaboration, artifacts — orbits them.

---

## 2. Target Audience & Personas

### Primary Personas

| Persona | Motivation |
|---|---|
| Independent Developer / Engineer | Seeks meaningful, scoped challenges and capable collaborators |
| Interdisciplinary Researcher | Finds real-world gaps to apply methods, produce papers/datasets, and find co-authors |
| Technical Founder / Systems Designer | Validates problems to build startups or open-source projects around |
| Student / Early-Career Professional | Pursues a thesis or portfolio project with real-world impact |

### Explicitly Out of Scope (V1)
- Large organisations posting formal RFPs
- Non-technical casual "citizen science" challenges
- Users who cannot engage through external linked artifacts (no in-platform file editing)

---

## 3. Core Vision & Guiding Principles

**North Star:** *"From problem discovery to collaborative exploration and solution building in minutes."*

Every V1 feature must answer yes to:
> Does this directly increase a user's ability to go from **reading a problem** to **creating a solution space with linked artifacts**?

**Design Principles**

| Principle | What it means in practice |
|---|---|
| Problem-centric, not tool-centric | The problem is the hub; spaces and artifacts orbit it |
| Curated, not algorithmic | Human vetting ensures quality; no feed ranking |
| Action-oriented, not passive | Every view drives towards forming a solution space |
| External execution | We accelerate the path to external tools, not replace them |
| Minimal but polished | Small, flawless feature set > large, rough one |

---

## 4. MVP Feature Set

### 4.1 Problem Discovery

**Two-domain focus (V1):**
- `AI/ML`
- `Developer Tools & Software Systems`

> ⚠️ These are the **exact stored strings** used in DB `CHECK` constraints, API filters, and UI labels. Do not abbreviate or rename them.

**Browsing:**
- Domain tag filter buttons
- Free-text search (PostgreSQL `tsvector` full-text)
- Problem Cards: title, domain badge, feasibility score (1–5), implementation scope, interested user count, active solution space count

**Landing Page:** "Featured Problems" grid — curated manually by admin.

---

### 4.2 Problem Detail Page

Progressive disclosure (summary → expanded details):

**Summary view (always visible):**
- Title, one-sentence description, domain badge, feasibility score
- "Why It Matters" section
- Primary CTA: "Start a Solution Space"

**Expandable accordion sections:**
1. Full Problem Statement (Markdown rendered)
2. Existing Gaps (each with optional source reference)
3. Suggested Approaches (each with optional source reference)
4. Sources (linked, trust score 1–5, type: `paper` / `forum` / `challenge`)
5. Validation Badge (curation checklist passed — displayed as a trust signal)

**"I'm Interested" Button:**
- Toggles interest; shows user avatar + name in the interested list
- Optional short message
- No in-app messaging — contact via the user's displayed external profile link

**Solution Space Section:**
- Lists all solution spaces for this problem (creator, status badge, artifact count)
- "Start a Solution Space" CTA repeated here

---

### 4.3 Solution Space Layer

**Creation:**
- Any authenticated user with a complete profile can create a Solution Space from a problem page
- Required: name. Optional: description
- Initial status: `forming`

**Solution Space Page:**
- Problem name + back-link
- Status badge: `forming` | `active` | `paused` | `completed` | `abandoned`
- Members list (avatars + names, linked to their external profiles)
- Linked Artifacts list (external URL, title, type badge)
- "Add Artifact" button (owner only)
- "How to collaborate" info box explaining the external-first model

**Lifecycle (service layer enforced):**

```
forming → active     [auto: when first artifact is added]
active  → paused     [owner action]
paused  → active     [owner action: resume]
active | paused → completed   [owner action]
active | paused → abandoned   [owner action]
```

---

### 4.4 Community & Discussion

- Flat comments on problem detail page
- **Ordered chronologically (oldest first)** — consistent with a linear discussion model
- "Reply" creates a new comment; `parent_id` stored for future threading; UI displays flat with `@username` prefix
- Flagging: flag icon → `is_flagged = true` → comment hidden from public; admin review queue
- Deleted-user comments preserved with "[deleted user]" shown in place of author name

---

### 4.5 User Profiles

**Public profile page:**
- Avatar, name, bio, skill tags, primary external link, join date

**Profile sections:**
- "Problems I'm interested in"
- "Solution spaces I'm part of"

**Profile completion (required to create a Solution Space):**
- External link type (`github`, `linkedin`, `website`, `other`) + URL
- At least one skill tag
- Optional bio

**Convenience route:** `/profile/me` → server-side redirect to `/profile/[userId]`

---

### 4.6 Authentication & Authorization

| Actor | Access level |
|---|---|
| Guest (unauthenticated) | Read-only: browse problems, spaces, profiles, comments |
| Authenticated + incomplete profile | Read + comment. Cannot create solution spaces |
| Authenticated + complete profile | Full write access (interest, comment, create spaces, add artifacts) |
| Admin (`ADMIN_CLERK_USER_ID`) | Create/publish/moderate problems; moderate comments |

Auth provider: **Clerk v5** (`@clerk/nextjs`). GitHub OAuth is the preferred sign-up method.

---

## 5. Explicitly Out of Scope for V1

| Feature | Reason |
|---|---|
| AI-powered extraction / summarisation | Quality risk; human curation first |
| Automated artifact creation (e.g. creating GitHub repos via API) | Security + scope |
| In-app messaging or real-time collaboration | External contact via profiles |
| Notifications (email, push) | Infrastructure overhead |
| Nested / threaded comment UI | DB ready (`parent_id`), UI flat for now |
| Voting / reputation system | Schema field present (`reputation_score`), not surfaced |
| Organisation accounts | Focus on individuals |
| Community problem submission | Full editorial control in V1 |
| Advanced analytics | Post-MVP |
| Solution Space invitations | Post-MVP; member joining is self-organised externally |

---

## 6. Content Quality Assurance

**Curation Checklist** (all must pass before `published`):

| # | Check |
|---|---|
| 1 | Real-world origin (verifiable source) |
| 2 | At least 2 high-quality sources (trust score ≥ 3) |
| 3 | Clear, actionable gap identified |
| 4 | Feasible for a small team or individual |
| 5 | No existing turnkey solution |
| 6 | Curator has reviewed and approved |

Stored as JSONB in `validation_checklist` (see ENTITY_DEFINITIONS.md §2.2).

---

## 7. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page load | < 2s (server-rendered, no heavy client bundle) |
| Accessibility | WCAG 2.1 AA |
| Responsiveness | Mobile-first, no native apps |
| Type safety | TypeScript strict mode throughout |
| Validation | All write operations validated with Zod before DB access |
| Deployment | Vercel (app) + Railway (PostgreSQL) |

---

## 8. Success Metrics

- Problem page view → Solution Space creation **conversion rate**
- Solution spaces with at least one linked artifact **(activation rate)**
- Artifact type distribution (reveals what kinds of solutions people build)
- Return user rate: **7-day** and **30-day**

---

## 9. Future Considerations (Post-MVP Backlog)

- Invitation system for Solution Spaces (SolutionSpaceMember `pending` state)
- Community curation & reputation activation (`reputation_score` already in schema)
- AI-assisted curation (always assistive, never autonomous)
- Broader artifact type support (`notebook`, `demo`, `video`)
- Problem submission by community members with curator review flow
- Email notifications for new solution spaces on a watched problem
