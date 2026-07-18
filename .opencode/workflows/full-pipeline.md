# Full Pipeline Workflow
<!-- applied when: task is complex or requires architectural reasoning -->

## Triggers
- Architecture decisions or system redesign
- Multi-file refactoring (5+ files)
- New feature with design requirements
- Security-sensitive changes (auth model)
- Database schema evolution
- Complex multi-component debugging
- Algorithm design or optimization
- Framework migration or version upgrades
- API design for new feature families
- Performance engineering

## Pipeline
```
GOAL (User request)
  │
  ▼
ROUTER → classify task → FULL PIPELINE
  │
  ▼
PROJECT MANAGER (V4 Pro) — goal intake, scope, risks
  │
  ▼
ARCHITECT (V4 Pro) — design decisions, API design, schema
  │
  ▼
PLANNER (Zen) — task decomposition, dependency ordering
  │
  ▼
RETRIEVER (Zen) — context assembly per subtask
  │
  ▼
WORKER (Zen/V4 Pro) — implement each subtask
  │
  ├─ COMPILE → npm run build (per subtask)
  ├─ LINT → npm run lint (per subtask)
  └─ Max 3 retries → escalate to V4 Pro on 3rd
  │
  ▼
REVIEWER (Zen/V4 Pro) — full diff review
  │
  ├─ PASS → continue
  └─ FAIL (blockers) → return to Worker
  │
  ▼
TESTER (Zen) — run full test suite, fill coverage gaps
  │
  ▼
SECURITY AUDITOR (V4 Pro) — if auth/DB/API changed
  │
  ▼
PERFORMANCE AUDITOR (Zen) — regression check
  │
  ▼
GIT AGENT (Zen) — commit message, CHANGELOG, PR description
  │
  ▼
MEMORY MANAGER (Zen) — update all memory files
  │
  ▼
DOCUMENTATION AGENT (Zen) — update docs/, JSDoc
  │
  ▼
CONTEXT MANAGER (Zen) — regenerate summaries, update cache
  │
  ▼
COST OPTIMIZER (Zen) — record token/cost metrics
  │
  ▼
FINISH → Comprehensive report to user
```

## All Agents
1. Router (DeepSeek Zen) — classify
2. Project Manager (DeepSeek V4 Pro) — scope
3. Architect (DeepSeek V4 Pro) — design
4. Planner (DeepSeek Zen) — decompose
5. Retriever (DeepSeek Zen) — assemble context
6. Worker (DeepSeek Zen, escalate to V4 Pro) — implement
7. Reviewer (DeepSeek Zen, escalate to V4 Pro) — review
8. Tester (DeepSeek Zen) — test
9. Security Auditor (DeepSeek V4 Pro) — security audit
10. Performance Auditor (DeepSeek Zen) — perf check
11. Git Agent (DeepSeek Zen) — commit
12. Memory Manager (DeepSeek Zen) — update memory
13. Documentation Agent (DeepSeek Zen) — update docs
14. Context Manager (DeepSeek Zen) — update cache
15. Cost Optimizer (DeepSeek Zen) — record metrics

## Quality Gates (All)
- [ ] Build passes
- [ ] Lint passes
- [ ] Architecture rules respected
- [ ] All tests pass
- [ ] Coverage maintained
- [ ] Review pass (0 blockers)
- [ ] Security audit pass (0 criticals)
- [ ] No performance regressions
- [ ] Module dependency rules respected
- [ ] Soft deletes handled
- [ ] Auth guards present
- [ ] Zod validation present

## V4 Pro Budget
- Max 3 V4 Pro calls per full pipeline session
- V4 Pro used for: PM (scope), Architect (design), Security (audit)
- Worker V4 Pro escalation ONLY on 3rd Zen failure
- Reviewer V4 Pro escalation ONLY on complex multi-file reviews

## Expected Time: 5-15 minutes
## Expected Tokens: 20-50K
## Expected Cost: <$0.01 (2-3 V4 Pro calls)
