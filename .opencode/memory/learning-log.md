# Learning Log
<!-- last-updated: 2026-07-11 -->
<!-- fingerprint: sha256:initial -->

## Session: 2026-07-11 — Initial Setup
**Agent(s):** Architect, Planner, Human
**What we learned:**
- ProblemAtlas is a frontend-only MVP with mock data; 0 API routes implemented
- The project uses Next.js 16 with significant breaking changes from earlier versions
- Drizzle ORM v0.45 has schema defined but not applied to any database
- Clerk middleware is set up but auth UI stubs need to be replaced
- The architecture is a modular monolith with strict dependency rules
- OpenCode autonomous system has been fully designed and needs implementation

**Impact on future decisions:**
- Any code generation must reference `node_modules/next/dist/docs/` for Next.js 16 APIs
- Database queries should follow the common-patterns.md DAL pattern
- All new client components must justify `"use client"` directive
- Soft delete filtering is mandatory on problems, comments, solution_spaces

---

_This log is appended to after each session. Record surprising discoveries, new patterns, and project-specific knowledge that would help future sessions._
