# Next.js 16 Knowledge Base

## Key Facts
- This project uses Next.js 16, which has breaking changes from Next.js 15 and earlier
- ALWAYS read `node_modules/next/dist/docs/` before writing Next.js code
- App Router is the routing system (not Pages Router)

## Patterns Used in This Project
- Server Components by default
- Client islands with `"use client"` directive
- Route handlers in `app/api/`
- Clerk middleware integration
- `generateMetadata` for page metadata
- `error.tsx` per route segment
- `loading.tsx` for loading states
- `not-found.tsx` for 404s

## Common Operations
```typescript
// Server Component data fetch
export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}

// Route handler
export async function GET(request: Request) {
  return NextResponse.json({ data: ... });
}

// Dynamic params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}

// Metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: "...", description: "..." };
}
```

## Things to ALWAYS verify
- Next.js 16 API changes from training data
- Server/Client component boundaries
- Import paths with `@/` alias
- Middleware matcher patterns
- Clerk v5 integration patterns
