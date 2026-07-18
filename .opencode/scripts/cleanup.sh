#!/bin/bash
# Cleanup Script
# Resets session state, clears stale cache entries, and resets agent status
# Run between major sessions or when state gets corrupted.

set -e

echo "=== OpenCode State Cleanup ==="

# Reset state files
echo "[1/3] Resetting session state..."
cat > .opencode/state/current-goal.md << 'EOF'
# Current Goal
_No active goal. Ready for next task._
EOF

cat > .opencode/state/task-progress.md << 'EOF'
# Task Progress
_No active session._
EOF

cat > .opencode/state/agent-status.md << 'EOF'
# Agent Status

## Agent Status Board
All agents: idle

## Metrics
- V4 Pro calls this session: 0
- Total tokens used: 0
EOF

# Clear session-specific cache
echo "[2/3] Clearing session cache..."
# Keep file fingerprints and prompt prefixes, clear context hashes
echo '{"stable-prefix": null, "architecture-context": null, "notes": "Cleared by cleanup script."}' > .opencode/cache/context-hashes.json

# Reset planning files
echo "[3/3] Resetting planning state..."
echo "# Task Plan" > .opencode/planning/task-plan.md
echo "No active plan." >> .opencode/planning/task-plan.md

echo ""
echo "=== Cleanup Complete ==="
echo "Session state reset. Memory files preserved."
