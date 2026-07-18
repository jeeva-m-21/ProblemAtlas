# Clerk Auth Knowledge Base

## Version: @clerk/nextjs v7 (Clerk v5)

## Key Facts
- Clerk v5 has breaking changes from Clerk v4/v6
- `auth()` is used in server contexts (Route Handlers, Server Components)
- `useAuth()`, `useUser()` are used in client components
- Middleware handles route protection

## Patterns Used in This Project
```typescript
// Server-side auth check (Route Handler)
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }
}

// Client-side auth hook
"use client";
import { useAuth, useUser } from "@clerk/nextjs";

function MyComponent() {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
}

// Middleware (middleware.ts)
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## User Model
- Clerk manages auth (JWT, sessions, OAuth)
- App DB stores user profile data (skills, external profile)
- Lazy user creation: getOrCreateUser(clerkId) on first API call
- Admin: single user identified by ADMIN_CLERK_USER_ID env var

## Auth Flow
```
1. clerkMiddleware validates JWT on protected routes
2. Route handler calls auth() to get userId
3. getAuthUserId(userId) → get or create user record
4. (optional) requireAdmin() or assertOwnership() for authorization
5. Process request with validated user context
```
