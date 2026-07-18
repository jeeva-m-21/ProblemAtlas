# Memory System

This directory contains the persistent project knowledge for ProblemAtlas. These files are loaded by agents to avoid re-reading the repository on every task.

## Files (17)

| File | Purpose | Load Frequency |
|---|---|---|
| `project-overview.md` | Project identity, tech stack, architecture style | Every session |
| `architecture.md` | Module graph, rendering strategy, state management | Every session |
| `api-surface.md` | All API endpoints, request/response shapes | API tasks |
| `database-schema.md` | Active schema snapshot, tables, enums, indexes | DB tasks |
| `coding-standards.md` | Naming, imports, patterns, quality rules | Every code change |
| `design-decisions.md` | ADR-style log of architecture decisions | Architecture changes |
| `common-patterns.md` | Approved implementation patterns with examples | Implementation tasks |
| `known-bugs.md` | Active bugs and workarounds | Debugging |
| `tech-debt.md` | Tracked technical debt items | Refactoring |
| `completed-features.md` | What's built and how | Planning |
| `pending-tasks.md` | Current outstanding work | Planning |
| `dependencies.md` | Package versions and upgrade notes | Dep changes |
| `environment.md` | Required env vars | Configuration |
| `testing-strategy.md` | Test approach, patterns, coverage targets | Testing |
| `cicd.md` | CI/CD pipeline configuration | Deployment |
| `security-decisions.md` | Auth model, permissions, threat model | Security/DB work |
| `learning-log.md` | Session insights and discovered patterns | Every session end |

## Format Convention

All memory files use stable headers and deterministic section ordering for maximum prompt cache hits:

```markdown
# Title
<!-- last-updated: YYYY-MM-DD -->
<!-- fingerprint: sha256:xxxxxxxx -->

## Section 1 (order: alphabetical)
## Section 2
...
```

## Update Process

The Memory Manager agent handles updates:
1. After session completion, review git diff
2. Identify which memory files need updating
3. Update affected files incrementally
4. Regenerate file fingerprints
5. Regenerate repository summaries for changed files
