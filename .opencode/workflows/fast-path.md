# Fast Path Workflow
<!-- applied when: task is simple and single-step -->

## Triggers
- Reading files, finding symbols, searches
- Simple edits (fix import, fix typo, add comment)
- Lint fixes, formatting
- Boilerplate from existing patterns
- Config edits, README updates, code explanation

## Pipeline
```
GOAL (User request)
  │
  ▼
RETRIEVE (get target file)
  │
  ▼
WORKER (edit / generate / explain)
  │
  ├─ Run: npm run build (if code changed)
  ├─ Run: npm run lint (if code changed)
  │
  ▼
FINISH → Report to user
```

## Agents Used
- Retriever (DeepSeek Zen) — optional, only if file lookup needed
- Worker (DeepSeek Zen) — primary

## Skipped
- Project Manager, Architect, Planner, Reviewer, Tester, Security, Performance, Git, Memory, Docs, Cost, Context

## Expected Time: <30 seconds
## Expected Tokens: <3K
## Expected Cost: $0
