# React 19 Knowledge Base

## Key Facts
- React 19 is stable and used in this project
- Server Components are the default paradigm (via Next.js 16)
- Some React 18 patterns are deprecated or changed

## Patterns Used in This Project
```typescript
// Server Component (default)
async function ServerComponent() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}

// Client Component (explicit)
"use client";
import { useState, useOptimistic, useRouter } from "react";

function ClientComponent() {
  const [state, setState] = useState(initial);
  const router = useRouter();

  // Optimistic update pattern
  const [optimistic, setOptimistic] = useOptimistic(serverData);

  async function handleAction() {
    setOptimistic(newValue);
    await fetch("/api/...", { method: "POST" });
    router.refresh();
  }
}
```

## Never Do
- No useEffect for data fetching (use Server Components or event handler fetch)
- No global state library
- No class components
- No React.createElement (use JSX)

## Hooks Used
- useState: local UI state
- useReducer: complex UI state
- useOptimistic: optimistic UI updates
- useRouter: navigation + refresh
- useAuth/useUser: Clerk auth hooks
- useRef: DOM references and mutable values
