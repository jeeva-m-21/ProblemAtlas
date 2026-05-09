# Authentication Flow
# Problem Intelligence Platform

| Document Info |                                             |
|---------------|---------------------------------------------|
| **Project**   | Problem Intelligence Platform               |
| **Version**   | 1.1.0                                       |
| **Status**    | Corrected — Ready to implement              |
| **Updated**   | 2025-01                                     |

---

## 1. Authentication Provider

**Clerk** (`@clerk/nextjs` v5+) is the hosted auth service. It handles sign-up, sign-in, session management, and token refresh. We sync a minimal user record into our own `users` table on first access.

**Why Clerk:**
- Zero-ops for a solo developer
- Native Next.js App Router support (RSC + middleware)
- GitHub OAuth built-in — important for capturing developer identity
- Pre-built `<SignInButton />`, `<UserButton />` components + `useAuth`, `useUser` hooks

> ⚠️ **Version note:** `authMiddleware` was **removed** in `@clerk/nextjs` v5. The current API is `clerkMiddleware` + `createRouteMatcher`. All code in this document targets the v5 API. `auth()` is async and must be awaited in server context.

---

## 2. User Identity Flow

### 2.1 Sign-Up / Sign-In

1. Any page triggers the Clerk modal via `<SignInButton />`.
2. Preferred method: **GitHub OAuth** — surfaces the user's GitHub handle for the external profile field.
3. After successful auth, Clerk sets a session cookie and redirects to the originally requested page (or `/explore`).
4. User record is created lazily on first authenticated API access (see §2.2).

### 2.2 Lazy User Creation

On every authenticated API route, call `getOrCreateUser(clerkUserId)` before any business logic. This avoids webhook complexity entirely.

**File: `lib/users/getOrCreateUser.ts`**
```typescript
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(clerkId: string) {
  // Fast path: user already exists
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });
  if (existing) return existing;

  // Slow path: first-ever API access — create the record
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk session valid but currentUser() returned null");

  const [created] = await db
    .insert(users)
    .values({
      clerkId,
      name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: clerkUser.imageUrl ?? null,
      // Profile fields are intentionally null at creation.
      // User completes them via /profile/setup.
      externalProfileType: null,
      externalProfileUrl: null,
      skills: null,
      bio: null,
    })
    .returning();

  return created;
}
```

### 2.3 Profile Completion Gate

After sign-up, if `external_profile_url` is null or `skills` is empty, the user is redirected to `/profile/setup`.

**What incomplete-profile users CAN do:**
- Browse all public content (problems, spaces, profiles)
- Post comments on problems

**What incomplete-profile users CANNOT do:**
- Create a Solution Space

This rule is enforced at the **service layer**, not the database level. The columns are nullable; the guard is a function call.

---

## 3. Middleware — `middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/explore",
  "/problems/(.*)",
  "/spaces/(.*)",
  "/profile/(.*)",
  // Public read-only API endpoints
  "/api/problems(.*)",
  "/api/solution-spaces(.*)",
  "/api/users/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // All non-public routes require authentication (e.g. /profile/setup, /admin)
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

**Design intent:** Public routes allow unauthenticated GET access. Write operations on those routes (POST/PATCH/DELETE) are protected **inside the route handler** by calling `await auth()` and checking `userId`. This keeps middleware lean while maintaining correct security.

---

## 4. Auth Helpers — `lib/auth/index.ts`

```typescript
import { auth } from "@clerk/nextjs/server";

/**
 * Returns the authenticated Clerk user ID.
 * Throws 401 if the request has no valid session.
 */
export async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new AuthError("UNAUTHORIZED", "Sign in required", 401);
  }
  return userId;
}

/**
 * Asserts the current user is the platform admin (single-user check via env var).
 * Throws 403 if the check fails.
 */
export async function requireAdmin(): Promise<string> {
  const userId = await getAuthUserId();
  if (userId !== process.env.ADMIN_CLERK_USER_ID) {
    throw new AuthError("FORBIDDEN", "Admin access required", 403);
  }
  return userId;
}

/**
 * Asserts that the authenticated user owns a resource.
 *
 * The caller is responsible for fetching the resource first and
 * passing its owner's Clerk user ID here. This keeps lib/auth/ free
 * of feature-level imports (which would invert the dependency hierarchy).
 *
 * Usage:
 *   const space = await getSolutionSpaceById(id);
 *   assertOwnership(space.creatorClerkId, await getAuthUserId());
 */
export function assertOwnership(
  resourceOwnerClerkId: string,
  requestingClerkId: string
): void {
  if (resourceOwnerClerkId !== requestingClerkId) {
    throw new AuthError("FORBIDDEN", "You do not have permission to modify this resource", 403);
  }
}

// ─── Error class ──────────────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "FORBIDDEN",
    message: string,
    public status: 401 | 403
  ) {
    super(message);
    this.name = "AuthError";
  }
}
```

---

## 5. Profile Completion Guard

**File: `lib/users/profileGuard.ts`**
```typescript
import type { users } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

export function assertProfileComplete(user: User): void {
  if (!user.externalProfileUrl || !user.skills?.length) {
    throw new ProfileIncompleteError();
  }
}

export class ProfileIncompleteError extends Error {
  public status = 422;
  public code = "PROFILE_INCOMPLETE" as const;

  constructor() {
    super("Complete your profile before creating a Solution Space.");
    this.name = "ProfileIncompleteError";
  }
}
```

**Usage in `features/solution-spaces/services.ts`:**
```typescript
import { assertProfileComplete } from "@/lib/users/profileGuard";
import { getOrCreateUser } from "@/lib/users/getOrCreateUser";

export async function createSolutionSpace(clerkId: string, data: CreateSpaceInput) {
  const user = await getOrCreateUser(clerkId);
  assertProfileComplete(user); // throws 422 if profile incomplete
  // ... creation logic continues
}
```

---

## 6. Session Handling

| Context | How to access session |
|---|---|
| Server Component | `const { userId } = await auth()` — from `@clerk/nextjs/server` |
| Route Handler | Same — `await auth()` |
| Client Component | `const { userId, isLoaded } = useAuth()` — from `@clerk/nextjs` |
| Client user data | `const { user } = useUser()` — from `@clerk/nextjs` |

API requests from client components use the same Clerk session cookie automatically — no extra headers required. Token refresh is handled entirely by Clerk.

---

## 7. Error Response Format

All auth errors return a consistent JSON envelope:

```typescript
// 401 — Not authenticated
{ "error": { "code": "UNAUTHORIZED", "message": "Sign in required" } }

// 403 — Authenticated but not authorized
{ "error": { "code": "FORBIDDEN", "message": "You do not have permission to modify this resource" } }

// 422 — Authenticated but profile incomplete
{ "error": { "code": "PROFILE_INCOMPLETE", "message": "Complete your profile before creating a Solution Space." } }
```

---

## 8. Admin Configuration

Set `ADMIN_CLERK_USER_ID` in Vercel environment variables and in `.env.local` for local dev.

To find your Clerk user ID: Clerk Dashboard → Users → click your account → copy the `user_xxx` ID.

**Future:** If multiple admins are needed, add a `role` column to `users` (`'user'` | `'admin'`) and update `requireAdmin()` to query the DB instead of comparing env vars.

---

## 9. Standard Route Handler Pattern

```typescript
// app/api/solution-spaces/route.ts
import { NextResponse } from "next/server";
import { getAuthUserId, AuthError } from "@/lib/auth";
import { createSolutionSpace } from "@/features/solution-spaces/services";
import { ProfileIncompleteError } from "@/lib/users/profileGuard";
import { createSolutionSpaceSchema } from "@/features/solution-spaces/validators";

export async function POST(request: Request) {
  try {
    const clerkUserId = await getAuthUserId();
    const body = await request.json();

    // Validate input with Zod before touching the DB
    const parsed = createSolutionSpaceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            fields: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 422 }
      );
    }

    const space = await createSolutionSpace(clerkUserId, parsed.data);
    return NextResponse.json({ data: space }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status }
      );
    }
    if (error instanceof ProfileIncompleteError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: 422 }
      );
    }
    console.error("[POST /api/solution-spaces]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
```
