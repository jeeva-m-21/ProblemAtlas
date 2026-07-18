# Session Resumption Workflow
<!-- Orchestrator drives this when checkpoint.json shows an active session -->

## Resumption States

### STATE A: Clean Resume (ideal case)
```
Checkpoint: goal=active, subtask=in_progress, git matches expected_files
Action: Resume from in-progress subtask, re-load its context, continue
Risk: None — exactly where we left off
```

### STATE B: Partial Resume (git incomplete)
```
Checkpoint: goal=active, subtask=in_progress, git partially matches
Action: Verify which file changes survived. Re-apply any that were lost.
       If files exist but are incomplete → restart subtask from scratch.
Risk: Low — may redo some work
```

### STATE C: Stale Resume (codes changed externally)
```
Checkpoint: goal=active, subtask=in_progress, git has unexpected changes
Action: WARN user. Offer stash of unexpected changes.
       Resume subtask from clean base.
Risk: Medium — external changes may conflict
```

### STATE D: Corrupted (state files don't match)
```
Checkpoint: goal=active, but task-progress says nothing in_progress
Action: RECOVER mode. Diagnose, ask user.
Risk: High — state is unreliable
```

### STATE E: Abandoned (very old checkpoint)
```
Checkpoint: goal=active, but timestamp > 24 hours old
Action: Mark as stale. Ask user if they want to continue or abandon.
Risk: Low — but context may be stale
```

## Resumption Decision Matrix

| goal.md status | task-progress in_progress? | git matches checkpoint? | Action |
|---|---|---|---|
| active | yes | yes | STATE A: Clean resume |
| active | yes | partial | STATE B: Partial resume |
| active | yes | no (unexpected changes) | STATE C: Stale resume |
| active | no | any | STATE D: Corrupted → RECOVER |
| any | any (checkpoint >24h old) | any | STATE E: Abandoned → ASK |
| none | n/a | n/a | COLD START |

## Orchestrator Resumption Script

When resuming, the Orchestrator:
```
1. Announce resumption to user:
   "Resuming session #[N]. Goal: [title]. Subtask [M]/[T] '[name]'."

2. Verify git state:
   git diff --name-only → compare with checkpoint.files_modified
   If mismatch → report to user, offer options

3. Re-load context:
   Read .opencode/state/session-context.md → get cached block list
   Verify cached blocks still valid (file fingerprints match)
   Load any blocks that changed since last session

4. Re-hydrate token budget:
   Read .opencode/state/token-budget.json
   Subtract any new overhead from this session's boot

5. Restart execution:
   Invoke the agent that was in_progress OR whose output was expected
   Continue the pipeline from that point
```
