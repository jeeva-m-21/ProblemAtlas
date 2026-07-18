# Import Conventions
<!-- last-updated: 2026-07-11 -->

## Import Order
```typescript
// 1. React / Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";

// 2. Third-party (alphabetical)
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod/v4";

// 3. Project internal — @/ alias (alphabetical)
import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
import { getOrCreateUser } from "@/lib/users/getOrCreateUser";
import { createProblemSchema } from "@/features/problems/validators";

// 4. Relative imports (alphabetical)
import { ProblemCard } from "./ProblemCard";
import { formatDate } from "./utils";
```

## Key Rules
1. Use `@/` path alias for all internal project imports (never `../../` for >2 levels)
2. Named imports preferred over default imports (except Next.js defaults: `NextResponse`, `redirect`, etc.)
3. No barrel/index files importing from implementation files (causes circular deps)
4. Type imports use `import type` syntax: `import type { Metadata } from "next"`
5. Client component check: NEVER `import { serviceFunction } from "@/features/*/services"` in `"use client"` files

## Forbidden Import Patterns
```typescript
// ❌ NO: lib/ importing from features/
import { getProblems } from "@/features/problems/services";  // VIOLATION

// ❌ NO: Client components importing services
"use client";
import { createComment } from "@/features/comments/services";  // VIOLATION

// ❌ NO: Deep relative imports
import { db } from "../../../lib/db";  // Use @/lib/db instead

// ❌ NO: Global state library
import { create } from "zustand";  // VIOLATION

// ✅ YES: Correct patterns
import { db } from "@/lib/db";
import { problems } from "@/lib/db/schema";
```
