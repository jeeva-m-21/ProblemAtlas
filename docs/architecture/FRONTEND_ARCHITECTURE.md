# Frontend Architecture
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Corrected — Ready to implement              |
| **Updated**   | 2025-01                                     |

---

## 1. Technology Choices

| Technology | Purpose |
|---|---|
| Next.js 14+ (App Router) | Server Components by default; file-based routing |
| TypeScript (strict mode) | Type safety throughout — no `any` exceptions |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Radix UI primitives with Tailwind — consistent, accessible components |
| Framer Motion | Page transitions and micro-animations |
| Clerk | Pre-built sign-in components and auth hooks |

**No global state library.** Clerk owns auth state. All server state lives in the database and is re-fetched via `router.refresh()`. Local UI state is managed with `useState` / `useReducer`.

---

## 2. Rendering Strategy

### 2.1 Server Components (default)

Landing, Explore, Problem Detail, Solution Space Detail, and User Profile pages are Server Components. They:
- Import directly from `features/*/services.ts` (Drizzle queries run server-side)
- Produce complete HTML on the server — no loading spinners, excellent Core Web Vitals and SEO
- Pass fetched data as props to embedded client islands

### 2.2 Client Islands

Embedded inside Server Components only where interactivity is required.

| Component | Why Client |
|---|---|
| `ProblemFilters` | Search input + domain filter state |
| `InterestButton` | Toggle with optimistic update |
| `SolutionSpaceCreateModal` | Dialog open state + form |
| `CommentSection` | Post, reply, flag actions |
| `ArtifactAddModal` | Dialog open state + form |
| `FlagButton` | Single async action |
| `ProfileSetupForm` | Multi-step form with local state |

### 2.3 Mutation Pattern

```typescript
// 1. Optimistic update (latency-sensitive only — comments, interest toggle)
const [optimisticState, setOptimistic] = useOptimistic(serverState);

async function handleAction() {
  setOptimistic(nextState);                               // instant UI
  await fetch(`/api/...`, { method: "POST", body: ... }); // persist
  router.refresh();                                        // re-sync server
}

// 2. Simple fetch (no optimistic needed — create space, add artifact)
async function handleCreate(data: FormData) {
  setLoading(true);
  try {
    const res = await fetch("/api/solution-spaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { /* handle error */ return; }
    router.push(`/spaces/${(await res.json()).data.id}`);
  } finally {
    setLoading(false);
  }
}
```

---

## 3. Route Structure

| Route | Type | Auth Required | Notes |
|---|---|---|---|
| `/` | Server | No | Landing + featured problems |
| `/explore` | Server | No | All published problems + filters |
| `/problems/[id]` | Server + client | No (read) / Yes (write) | Detail, comments, interest |
| `/spaces/[id]` | Server + client | No (read) / Owner (write) | Space detail, artifacts |
| `/profile/me` | Server | Yes | Redirects to `/profile/[userId]` |
| `/profile/setup` | Client form | Yes (enforced at page level) | Profile completion |
| `/profile/[id]` | Server | No | Public user profile |

### `/profile/setup` Auth Guard

The page must enforce authentication at the server level — not rely on the API call failing:

```typescript
// app/profile/setup/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfileSetupPage() {
  const { userId } = await auth();
  if (!userId) redirect("/"); // Clerk modal will trigger on landing
  return <ProfileSetupForm />;
}
```

### `/profile/me` Redirect

```typescript
// app/profile/me/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/features/users/services";

export default async function ProfileMePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const user = await getUserByClerkId(userId);
  redirect(`/profile/${user.id}`);
}
```

---

## 4. Component Organization

```
src/
├── app/
│   ├── layout.tsx                      # ClerkProvider, ThemeProvider, Navbar, Footer
│   ├── error.tsx                       # Global unhandled error fallback
│   ├── not-found.tsx
│   ├── page.tsx                        # Landing (server)
│   ├── explore/page.tsx                # Explore (server)
│   ├── problems/[id]/
│   │   ├── page.tsx                    # Problem detail (server + islands)
│   │   └── error.tsx
│   ├── spaces/[id]/
│   │   ├── page.tsx                    # Space detail (server + islands)
│   │   └── error.tsx
│   └── profile/
│       ├── me/page.tsx
│       ├── setup/page.tsx
│       └── [id]/page.tsx
│
├── features/
│   ├── problems/components/
│   │   ├── ProblemCard.tsx             # Shared card — used on landing + explore
│   │   ├── ProblemFilters.tsx          # CLIENT: search input + domain tabs
│   │   ├── ProblemDetailSections.tsx   # Server: Gaps, Approaches, Sources accordions
│   │   └── InterestSection.tsx         # CLIENT: interest button + interested user list
│   ├── solution-spaces/components/
│   │   ├── SolutionSpaceCard.tsx
│   │   ├── SolutionSpaceCreateModal.tsx # CLIENT: dialog + form
│   │   ├── ArtifactList.tsx             # Server (initial render)
│   │   └── ArtifactAddModal.tsx         # CLIENT: dialog + form
│   ├── comments/components/
│   │   ├── CommentList.tsx              # Server: renders initial list
│   │   ├── CommentItem.tsx              # CLIENT: reply + flag buttons
│   │   └── CommentForm.tsx              # CLIENT: post new comment
│   └── users/components/
│       ├── ProfileCard.tsx
│       └── ProfileSetupForm.tsx          # CLIENT: multi-step form → PATCH /api/users/me
│
├── components/
│   ├── ui/                              # shadcn/ui (Button, Input, Card, Dialog, Badge…)
│   └── layout/                          # Navbar, Footer, Container, PageWrapper
│
└── lib/
```

---

## 5. State Management

| State type | Lives in | Managed by |
|---|---|---|
| Server / DB state | PostgreSQL | Server Components + `router.refresh()` |
| Auth state | Clerk session | `useAuth()`, `useUser()` hooks |
| UI state (modals, tabs) | Local component | `useState`, `useReducer` |
| Optimistic UI | Client component | `useOptimistic` |
| Form state | Form component | Controlled `useState` |

---

## 6. Error Handling

### Page-Level Errors (unhandled exceptions)

Next.js `error.tsx` files catch unhandled errors per route segment:

```typescript
// app/problems/[id]/error.tsx
"use client";
export default function ProblemError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <p className="text-muted-foreground">Something went wrong loading this problem.</p>
      <button onClick={reset} className="...">Try again</button>
    </div>
  );
}
```

### Client Component API Errors

All `fetch` calls in client components handle errors explicitly — never swallow them:

```typescript
async function submitComment(body: string) {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`/api/problems/${problemId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      setError(error.message ?? "Failed to post comment.");
      return;
    }
    setBody("");
    router.refresh();
  } catch {
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}
```

---

## 7. Comment Display Order

Comments are displayed **oldest first (ascending `created_at`)** — the standard for linear discussion threads. This matches the "flat, chronological" model in MVP_SCOPE.md.

```typescript
// features/comments/services.ts
export async function getCommentsByProblem(problemId: number) {
  return db.query.comments.findMany({
    where: and(
      eq(comments.problemId, problemId),
      isNull(comments.deletedAt),
      eq(comments.isFlagged, false)
    ),
    orderBy: [asc(comments.createdAt)], // oldest first
    with: { author: true },
  });
}
```

---

## 8. Design System

| Layer | Approach |
|---|---|
| Design tokens | CSS variables in `globals.css` following shadcn/ui's token system (`--primary`, `--muted`, `--border`, etc.) |
| Components | shadcn/ui primitives (Button, Input, Card, Dialog, Badge, Tabs, Accordion) |
| Custom theme | `tailwind.config.ts` — brand colors, font family |
| Prose content | `@tailwindcss/typography` for Markdown-rendered problem descriptions |
| Animations | Framer Motion — page transitions, modal entry/exit, micro-interactions |
| Images | `next/image` for all avatar/image rendering with automatic optimization |

---

## 9. SEO & Performance

- Server Components produce HTML on the server — optimal FCP and LCP
- `generateMetadata` on problem detail and explore pages for `<title>` and `<meta description>`
- `next/image` for all images with `sizes` props tuned per breakpoint
- No ISR for MVP — data freshness > cache complexity at this scale
- Pages render per request; stale data is not a concern

---

## 10. Development Workflow

```bash
pnpm dev          # start dev server (localhost:3000)
pnpm build        # production build — run before pushing to catch errors
pnpm tsc --noEmit # type check without emitting files
pnpm lint         # ESLint
```

No Storybook for MVP — develop components in context with real data via the dev server.
