# Failure Recovery Procedures
<!-- applied when: any failure occurs in the pipeline -->

## Failure Matrix

### Compile Failures
**Detection:** `npm run build` exits non-zero
**Recovery:**
1. Parse TypeScript error output
2. Identify file and line of error
3. Worker fixes specific issue (1 edit)
4. Re-run `npm run build`
5. Max 3 retries → escalate to V4 Pro
6. V4 Pro attempt → if still fails → escalate to human

### Lint Failures
**Detection:** `npm run lint` exits non-zero
**Recovery:**
1. If auto-fixable → run `npm run lint -- --fix`
2. If not auto-fixable → Worker reads error, fixes issue
3. Re-run lint
4. Max 3 retries → escalate to human

### Test Failures
**Detection:** Test runner reports failures
**Recovery:**
1. Parse failure output — identify failing test
2. Determine: test bug (test testing wrong thing) or source bug
3. If test bug → Tester fixes test
4. If source bug → Worker fixes source
5. Re-run tests
6. Max 3 retries → escalate to human with failure log

### Hallucinations (fake imports, APIs)
**Detection:** TypeScript build fails with "Cannot find module" or "Property does not exist"
**Recovery:**
1. Worker removes hallucinated code
2. Retriever re-resolves correct imports/symbols from codebase
3. Worker re-implements with verified references
4. Re-run build
5. Max 3 retries → escalate to Architect (V4 Pro)

### Bad Refactoring (Regression)
**Detection:** Test failures or reviewer flags architecture violations
**Recovery:**
1. `git checkout -- <changed files>` — rollback to clean state
2. Planner replans with new constraints
3. 2 maximum refactor attempts → escalate to Architect (V4 Pro)

### Context Overflow
**Detection:** Token limit error or context > 10K tokens
**Recovery:**
1. Context Manager compresses context
2. Retriever re-assembles with smaller scope
3. Retry with compressed context
4. 1 retry → split task into smaller subtasks

### Tool Failures (Read, Write, Bash, etc.)
**Detection:** Tool returns error
**Recovery:**
1. Analyze error message
2. If file not found → check path, re-index
3. If permission denied → escalate to human
4. If timeout → retry with longer timeout
5. Max 2 retries → escalate to human

### API Failures (Fireworks V4 Pro)
**Detection:** HTTP error from Fireworks API
**Recovery:**
1. Fallback to DeepSeek Zen
2. Flag for retry with exponential backoff
3. Max 2 retries → report as partial completion, escalate to human

### Merge Conflicts
**Detection:** Git reports merge conflict
**Recovery:**
1. Abort merge: `git merge --abort`
2. Regenerate changes from clean state
3. If conflict persists → escalate to human with conflict details

## General Recovery Rules
1. **Always checkpoint** before any destructive operation (git stash or commit)
2. **Maximum 3 retries** for any single failure — then escalate
3. **Preserve error context** — log what was attempted and what failed
4. **No silent failures** — every failure is reported
5. **Rollback first, retry second** — don't accumulate bad state
