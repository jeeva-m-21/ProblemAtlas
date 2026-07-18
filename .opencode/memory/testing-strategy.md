# Testing Strategy
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Status: NO TESTS WRITTEN YET

Test infrastructure needs to be set up. Strategy defined, not yet implemented.

## Test Stack (To Install)
```bash
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npx playwright install
```

## Coverage Targets
| Layer | Target | Priority |
|---|---|---|
| Data access layer (`lib/data/`) | 90%+ | Phase 1 (when DAL is built) |
| Route handlers (`app/api/`) | 80%+ | Phase 2-3 (when APIs exist) |
| Validators (`features/*/validators.ts`) | 90%+ | Phase 2-3 |
| Services (`features/*/services.ts`) | 80%+ | Phase 2-3 |
| Search queries (`lib/search.ts`) | 80%+ | Phase 4 |
| E2E flows | 3 critical paths | Phase 6 |
| **Total project** | **70%+** | Before merge to main |

## Critical E2E Flows (Phase 6)
1. Guest discovers problem → signs up → completes profile
2. Authenticated user creates a solution space
3. Admin curates problem lifecycle

## Test Patterns
- Unit tests: `*.test.ts` co-located with source
- Integration tests: `*.test.ts` in `__tests__/integration/`
- E2E tests: `*.spec.ts` in `e2e/`

## DAL Test Pattern
```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("getProblems", () => {
  it("returns only published, non-deleted problems", async () => {
    const problems = await getProblems();
    expect(problems.every(p => p.validationStatus === "published")).toBe(true);
  });
});
```

## Route Handler Test Pattern
```typescript
import { describe, it, expect } from "vitest";

describe("POST /api/problems/[id]/interest", () => {
  it("returns 401 without auth", async () => {
    const res = await fetch("http://localhost:3000/api/problems/1/interest", {
      method: "POST",
    });
    expect(res.status).toBe(401);
  });
});
```
