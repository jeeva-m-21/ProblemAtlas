---
name: nextjs
description: Use when writing Next.js 16 code with App Router. Covers Server/Client Component patterns, routing, error handling, and metadata. Use ONLY when the task involves Next.js specific patterns.
---

# Next.js 16 Patterns

## Critical: This is NOT the Next.js you know
Next.js 16 has breaking changes. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`.

## Server Components (default)
- All pages are Server Components by default
- Use `"use client"` only for interactive islands
- Server Components can be `async` and `await` data directly

## Route Handlers (app/api/)
```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ data: ... });
}

export async function POST(request: Request) {
  const body = await request.json();
  // validate, process, return
}
```

## Dynamic Metadata
```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: "...", description: "..." };
}
```

## Error Handling
- `error.tsx` per route segment (client component)
- `not-found.tsx` for 404s
- Loading states: `loading.tsx`

## Redirects
```typescript
import { redirect } from "next/navigation";
redirect("/somewhere"); // throws, wrap in if/else
```
