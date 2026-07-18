# Common Patterns
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Data Access Layer Pattern
```typescript
// lib/data/entity.ts
import { db } from "@/lib/db";
import { entity } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export async function getEntities() {
  return db.query.entity.findMany({
    where: and(
      eq(entity.status, "active"),
      isNull(entity.deletedAt)
    ),
    orderBy: [desc(entity.createdAt)],
  });
}

export async function getEntityById(id: number) {
  return db.query.entity.findFirst({
    where: and(eq(entity.id, id), isNull(entity.deletedAt)),
    with: { related: true },
  });
}
```

## API Route Handler Pattern
```typescript
// app/api/entity/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/users/getOrCreateUser";
import { createEntitySchema } from "@/features/entity/validators";
import { createEntity } from "@/features/entity/services";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createEntitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten() } },
        { status: 422 }
      );
    }

    const user = await getOrCreateUser(userId);
    const result = await createEntity(user.id, parsed.data);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
```

## Client Island Mutation Pattern
```typescript
// features/entity/components/EntityAction.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EntityAction({ entityId }: { entityId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/entity/${entityId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ /* data */ }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setError(error.message ?? "Failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleAction} disabled={loading}>
      {loading ? "Saving..." : "Action"}
      {error && <span className="text-red-500">{error}</span>}
    </button>
  );
}
```

## Zod Validator Pattern
```typescript
// features/entity/validators.ts
import { z } from "zod/v4";

export const createEntitySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(5000).optional(),
  type: z.enum(["option_a", "option_b"]),
});

export const updateEntitySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(5000).optional(),
});
```

## Soft Delete Pattern
```typescript
// Always include this in WHERE clause for soft-delete tables:
import { isNull } from "drizzle-orm";
// WHERE: and(..., isNull(table.deletedAt))

// For "delete" operation, use update instead:
await db.update(table)
  .set({ deletedAt: new Date() })
  .where(eq(table.id, id));
```

## Auth Guard Pattern
```typescript
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/users/getOrCreateUser";

export async function POST(request: Request) {
  // 1. Auth check FIRST
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // 2. Lazy user creation
  const user = await getOrCreateUser(userId);

  // 3. Optional: admin check
  // if (user.clerkId !== process.env.ADMIN_CLERK_USER_ID) { ... }

  // 4. Process request
}
```
