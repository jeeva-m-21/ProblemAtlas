# Standard Path Workflow
<!-- applied when: task is moderate and well-defined -->

## Triggers
- Adding a single API endpoint
- Creating a new component following existing patterns
- Adding validation to existing endpoint
- Simple single-module refactoring
- Writing tests for existing code
- Adding error boundaries or loading states
- Implementing a single route handler
- Adding auth to existing route
- Simple DB queries or seed data

## Pipeline
```
GOAL (User request)
  │
  ▼
PLANNER (decompose into subtasks)
  │
  ▼
RETRIEVER (assemble context per subtask)
  │
  ▼
WORKER (implement each subtask)
  │
  ├─ COMPILE → npm run build
  ├─ LINT → npm run lint
  │
  ▼
REVIEWER (review diff against quality gates)
  │
  ├─ PASS → continue
  └─ FAIL (blockers) → return to Worker
  │
  ▼
TESTER (run/generate tests)
  │
  ├─ PASS → continue
  └─ FAIL → fix or report
  │
  ▼
GIT AGENT (generate commit message, show for approval)
  │
  ▼
MEMORY MANAGER (update memory files, regenerate indexes)
  │
  ▼
FINISH → Report to user
```

## Agents Used
- Planner (DeepSeek Zen)
- Retriever (DeepSeek Zen)
- Worker (DeepSeek Zen)
- Reviewer (DeepSeek Zen)
- Tester (DeepSeek Zen) — if tests exist or should be added
- Git Agent (DeepSeek Zen)
- Memory Manager (DeepSeek Zen)

## Quality Gates
- [ ] Build passes
- [ ] Lint passes
- [ ] Architecture rules respected
- [ ] Coding standards followed
- [ ] Tests pass (or no pre-existing tests)
- [ ] Review pass (0 blockers)

## Expected Time: 2-5 minutes
## Expected Tokens: 10-20K
## Expected Cost: $0 (all Zen)
