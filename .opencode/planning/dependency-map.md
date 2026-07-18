# Dependency Map

_No active dependency map. The Planner agent creates dependency maps during task decomposition._

## Map Format
Each entry maps subtask → its dependencies:
```json
{
  "subtask-1": [],
  "subtask-2": ["subtask-1"],
  "subtask-3": ["subtask-1"],
  "subtask-4": ["subtask-2", "subtask-3"]
}
```
