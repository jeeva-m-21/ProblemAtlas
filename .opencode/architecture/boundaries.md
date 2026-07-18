# Module Boundaries
<!-- last-updated: 2026-07-11 -->

## Boundary Map

```
┌─────────────────────────────────────────────────────────────┐
│                        app/                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ pages    │  │ layouts  │  │ errors   │  │ api/       │ │
│  │ (server  │  │ (server  │  │ (client  │  │ (route     │ │
│  │  comps)  │  │  comps)  │  │  comps)  │  │  handlers) │ │
│  └────┬─────┘  └──────────┘  └──────────┘  └─────┬──────┘ │
│       │                                          │         │
└───────┼──────────────────────────────────────────┼─────────┘
        │ imports                                  │ imports
        ▼                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     features/                               │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐             │
│  │ problems │  │ solution-    │  │ comments │  ...more    │
│  │          │  │    spaces    │  │          │             │
│  │ services │  │  services    │  │ services │             │
│  │ comps    │  │  comps       │  │ comps    │             │
│  │ validat. │  │  validators  │  │ validat. │             │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘             │
│       │               │               │                    │
└───────┼───────────────┼───────────────┼────────────────────┘
        │ imports       │ imports       │ imports
        ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                         lib/                                 │
│  ┌──────┐  ┌──────┐  ┌─────────┐  ┌───────┐  ┌──────────┐ │
│  │  db  │  │ auth │  │  users  │  │search │  │  utils   │ │
│  └──────┘  └──────┘  └─────────┘  └───────┘  └──────────┘ │
│                                                             │
│  NEVER imports from features/ or app/                       │
└─────────────────────────────────────────────────────────────┘
```

## Boundary Rules

### Can cross boundaries:
- `app/api/` → `features/*/services.ts` (mutation)
- `app/*/page.tsx` → `features/*/services.ts` (data fetch)
- `features/*/services.ts` → `lib/` (infrastructure)
- `features/*/components.tsx` → `features/*/validators.ts` (validation)

### CANNOT cross boundaries:
- `lib/` → `features/` (EVER)
- `lib/` → `app/` (EVER)
- Client Component → `features/*/services.ts` (use fetch to /api/)
- `features/problem/` → `features/comments/` implementation detail (use shared types only)
- `features/*/services.ts` → `app/` (EVER)

### Feature-to-feature rules:
- Features communicate through API routes OR shared lib/types
- Features do NOT import each other's services
- Shared types go in `lib/types.ts` or `features/*/types.ts` (exported)
