# Orchestrator Commands

Available commands managed by the Orchestrator.

## Session Control

| Command | Action |
|---|---|
| `/resume` | Force resume from last checkpoint |
| `/status` | Show current goal, subtask progress, token budget |
| `/budget` | Show detailed token ledger and cost breakdown |
| `/checkpoint` | Force a checkpoint write immediately |
| `/abort` | Halt current goal, save state, mark as paused |
| `/retry [N]` | Retry subtask N from scratch (reset its state) |
| `/skip [N]` | Skip subtask N (mark as skipped, continue pipeline) |

## Agent Override

| Command | Action |
|---|---|
| `/force-v4` | Override routing — use V4 Pro for next agent call |
| `/force-zen` | Override routing — use Zen even for complex task |
| `/escalate` | Immediately escalate current subtask to V4 Pro |

## Diagnostics

| Command | Action |
|---|---|
| `/logs` | Show recent agent invocation logs |
| `/perf` | Show productivity score and trends |
| `/cache` | Show cache hit rate and loaded context blocks |
| `/errors` | Show recent errors and retries |
| `/health` | Validate all state files, memory files, and indexes |

## Usage Examples
```
/resume                    → Continue from checkpoint
/status                    → What are we doing and where are we?
/budget                    → How many tokens left?
/checkpoint                → Save progress now
/abort                     → Pause, save, I'll come back later
/retry 3                   → Subtask 3 failed, try again
/force-v4                  → This next step needs the big model
/perf                      → How productive are we being?
```
