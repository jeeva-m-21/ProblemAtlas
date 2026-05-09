# User Flows
# Problem Intelligence Platform

| Document Info |                                 |
|---------------|---------------------------------|
| **Project**   | Problem Intelligence Platform   |
| **Version**   | 1.1.0                           |
| **Status**    | Corrected — Frozen for MVP      |
| **Updated**   | 2025-01                         |

---

## 1. Purpose

Maps the core user journeys for the MVP. All flows respect the platform's external-execution model: **no in-app messaging, no real-time collaboration, no file uploads in V1**. Collaboration happens through linked external artifacts and external profiles.

---

## 2. Core Flows

---

### Flow 1 — Guest Discovery → Sign-Up

**Step 1: Landing page (`/`)**
- Hero: *"Find problems that matter. Build solutions with others."*
- Domain filter buttons: `AI/ML` | `Developer Tools & Software Systems`
- Free-text search bar
- "Featured Problems" grid (curated selection of published problems, set by admin)

**Step 2: Explore (`/explore`)**
- Domain filter + search → list of Problem Cards
- Each card shows: title, domain badge, feasibility score (1–5), implementation scope, interested user count, active solution space count
- Click any card → `/problems/[id]`

**Step 3: Problem Detail (as guest)**
- Summary view: title, short description, domain badge, feasibility score, "Why It Matters"
- Primary CTA "Start a Solution Space" → shows Clerk sign-in modal on click
- "I'm interested" button → same sign-in gate
- Expandable accordions: full statement, gaps, approaches, sources, validation badge
- Comments section: readable as guest; "Sign in to join the discussion" link at bottom
- Solution Spaces section: lists existing spaces (name, status, artifact count) — all readable as guest

**Step 4: Authentication**
- Clerk modal opens → sign up with GitHub (preferred) or email
- On success: Clerk sets session cookie, redirects back to the page the user was on
- System creates `User` row lazily on first API call — populated with Clerk data only (name, email, avatar)

**Step 5: Profile completion check**
- If `external_profile_url` is null or `skills` is empty → redirect to `/profile/setup?returnTo=/problems/[id]`
- Otherwise → user lands back on the problem page, now authenticated

**Step 6: Profile setup (`/profile/setup`)** — auth-gated at page level
- Fields: external profile type (dropdown), URL, skill tags (minimum 1), optional bio
- Submit → `PATCH /api/users/me` → redirect to `returnTo` URL (or `/explore` if absent)

---

### Flow 2 — Express Interest & Connect

**Expressing interest:**
1. On Problem Detail (authenticated), "I'm interested" button is active
2. Click → optional message field ("What draws you to this problem?") + "Submit"
3. Interest row inserted; button state flips to "Withdraw interest" (click = hard-delete of the row)
4. Optimistic UI — button state updates instantly; server confirms asynchronously

**Interest list (visible to all):**
- "People interested" section: avatar, name, optional message, external profile link (↗ opens in new tab)
- External profile is the **only contact mechanism** — no in-app messaging in V1

**Discussion:**
1. Authenticated user posts a top-level comment → `POST /api/problems/[id]/comments`
2. "Reply" button under a comment opens a reply box; stored with `parent_id`; displayed flat with `@username` prefix in V1
3. Comments displayed **oldest first (ascending `created_at`)**
4. Flag icon on any comment → `is_flagged = true` → comment hidden from public responses; admin review queue

---

### Flow 3 — Create Solution Space (Primary Activation)

**Step 1: Trigger**
- "Start a Solution Space" button on Problem Detail
- Guard (service layer): if profile incomplete → redirect to `/profile/setup?returnTo=/problems/[id]`

**Step 2: Creation dialog**
- Fields: Name (required), Description (optional Markdown)
- Submit → `POST /api/solution-spaces`
- Service creates:
  - `SolutionSpace` row with `status = 'forming'`
  - `SolutionSpaceMember` row with `role = 'owner'` for the creator

**Step 3: Solution Space page (`/spaces/[id]`)**

Initial state (just created):
```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 forming            [Space Name]                          │
│ ↩ Back to [Problem Name]                                    │
│                                                             │
│ Members: [Creator Avatar]                                   │
│                                                             │
│ Artifacts                                                   │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ No artifacts yet.                                   │    │
│ │ [+ Add Artifact]                                    │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ ℹ️ Share this space with collaborators, then connect       │
│    via their external profiles.                             │
└─────────────────────────────────────────────────────────────┘
```

**Step 4: Add first artifact**
- Owner clicks "+ Add Artifact" → modal
- Fields: URL (required), Title (required), Type (dropdown: repository / paper / dataset / prototype / documentation / other)
- Submit → `POST /api/solution-spaces/[id]/artifacts`
- **Service layer auto-transitions:** checks artifact count after insert — if count becomes 1, update `status = 'active'`, set `status_changed_at = now()`
- Status badge updates to `🟢 active` after page refresh

**Step 5: Subsequent owner actions**
- Add more artifacts (no limit in V1)
- Edit space name / description → `PATCH /api/solution-spaces/[id]`
- Change status: pause → resume → complete / abandon
- Delete an artifact → `DELETE /api/artifacts/[id]`
- Space URL is shareable; other users can view all content (read-only in V1)

---

### Flow 4 — Quality & Moderation Loops

**Problem curation (admin only):**
1. Admin creates problem with status `draft` via admin routes or direct DB insert
2. Fills all fields: title, domain, descriptions, importance, feasibility, scope
3. Adds sources (URL, title, type, trust score), gaps, and approaches
4. Manually verifies curation checklist in `validation_checklist` JSONB field
5. Transitions: `draft` → `reviewed` → `published` (sets `published_at = now()`)
6. Problem appears on Explore page and is searchable

**Comment moderation:**
1. Flagged comments (`is_flagged = true`) are excluded from all public comment queries
2. Admin views flagged comments at `/admin/comments`
3. Actions: "Dismiss" (`is_flagged = false`) or "Delete" (`deleted_at = now()`)
4. Deleted comments are soft-deleted; comment body is gone, author shown as "[deleted]"

**Problem lifecycle updates:**
- If a Solution Space reaches `completed` and the admin verifies the linked artifact resolves the problem → set `problem.validation_status = 'solved'`
- If a problem is superseded by another or no longer relevant → set `validation_status = 'archived'`

---

### Flow 5 — Returning User & Profile Management

**Accessing own profile:**
- Navbar link → `/profile/me` → server-side redirect to `/profile/[userId]`
- Profile shows: avatar, name, bio, external link (↗), skill tags, joined date
- Sections below: "Problems I'm interested in" and "Solution Spaces I'm part of"

**Solution space management (owner):**
- Edit controls appear on the space page for the owner only
- Status changes use the lifecycle rules in ENTITY_DEFINITIONS.md §2.8
- Artifact add (`POST /api/solution-spaces/[id]/artifacts`) and remove (`DELETE /api/artifacts/[id]`) are owner-only
- No member management in V1 — membership is self-organised externally

**Problem discoverability:**
- Problem detail → Solution Spaces tab lists all spaces for that problem (status, artifact count, creator)
- Explore page shows aggregate `interested_count` and `active_space_count` per problem card

---

## 3. UI/UX Notes

| Pattern | Implementation |
|---|---|
| Progressive disclosure | Problem detail: summary view first, details in accordions — reduces cognitive load |
| CTA placement | "Start a Solution Space" appears at top, after description, and at bottom of problem page |
| Empty states | "Be the first to express interest" / "No solution spaces yet — start one!" |
| External links | All external URLs (artifact links, profile links) show ↗ icon and open in new tab |
| Deleted user comments | "[deleted user]" in place of author name; comment body preserved |
| Permission gates | Only "is authenticated" and "is owner" checks. No RBAC in V1 |
| Sign-in gate | Clicking any write action as a guest opens the Clerk modal in context — user returns to where they were after signing in |

---

## 4. Service-Layer Responsibilities Summary

| User action | Where enforced |
|---|---|
| Profile completion check | `assertProfileComplete()` in solution-spaces service |
| `forming` → `active` transition | `createArtifact` service: checks count post-insert; if count === 1, updates status |
| Comment visibility (exclude flagged + deleted) | Comment query: `WHERE is_flagged = false AND deleted_at IS NULL` |
| Interest uniqueness | Composite PK `(problem_id, user_id)` — DB-enforced |
| Owner-only mutations | `assertOwnership(space.creatorClerkId, requestingClerkId)` in route handler |
| Admin-only operations | `requireAdmin()` in route handler — first call |
| Soft delete filtering | All queries on `problems`, `comments`, `solution_spaces` include `WHERE deleted_at IS NULL` |
