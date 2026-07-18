# Productivity Metrics
<!-- Tracked across all sessions by the Orchestrator -->

## Session History
| Session | Goal | Subtasks | Tokens (Zen/V4) | Cost | Retries | Duration | Score |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |

## Cumulative Metrics
- **Total sessions:** 0
- **Total goals completed:** 0
- **Average completion time:** —
- **Total tokens used:** 0 (0% V4 Pro)
- **Total cost:** $0.00
- **Average retries per subtask:** 0
- **Average cache hit rate:** 0%
- **Average context size:** 0 tokens

## Productivity Score Formula
```
productivity_score = (
  subtasks_completed * 10 +
  (lines_added + lines_deleted) * 0.05 -
  retries * 5 -
  compilation_failures * 8 -
  v4_pro_escalations * 3 -
  context_overflows * 10 -
  hallucination_count * 15
) / (session_duration_seconds / 60)

# Target: >50 (fast, correct, cheap)
# Acceptable: 20-50
# Poor: <20 (too many retries, escalations, or too slow)
```

## Optimization Insights
_Orchestrator populates this after each session with what it learned._

_No insights yet._
