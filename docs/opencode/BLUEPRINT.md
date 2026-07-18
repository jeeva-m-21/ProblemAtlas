# OpenCode Autonomous Engineering System — Architecture Blueprint

| Document | Value |
|---|---|
| Project | ProblemAtlas |
| System | OpenCode Autonomous Engineering Environment |
| Version | 2.0.0 |
| Status | Production Design — Ready to Implement |
| Model Budget | DeepSeek Zen (free) for 85%+ of tasks, DeepSeek V4 Pro (Fireworks) for complex reasoning only |

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
                          ┌─────────────────────────────────────┐
                          │         USER / OPENCODE CLI         │
                          └─────────────────┬───────────────────┘
                                            │
                          ┌─────────────────▼───────────────────┐
                          │           ROUTER AGENT               │
                          │  (Classifies task, selects models)   │
                          └─────────────────┬───────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
         ┌──────────▼──────────┐  ┌────────▼────────┐  ┌──────────▼──────────┐
         │   DEEPSEEK ZEN      │  │  DEEPSEEK V4 PRO │  │   HUMAN ESCALATION  │
         │   (Free Tier)       │  │  (Fireworks API) │  │   (Decision Gate)   │
         │   85%+ Workload     │  │  Complex Only    │  │   Architecture etc. │
         └──────────┬──────────┘  └────────┬─────────┘  └─────────────────────┘
                    │                       │
         ┌──────────▼───────────────────────▼─────────────────────────────┐
         │                      AGENT HIERARCHY                            │
         │                                                                 │
         │  ┌──────────────┐                                               │
         │  │PROJECT MGR   │ ← Goal intake, scope analysis, prioritization│
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │  ARCHITECT   │ ← Design decisions, API design, schema        │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │   PLANNER    │ ← Task decomposition, dependency ordering      │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │  RETRIEVER   │ ← Context: files, symbols, memory, standards  │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │   WORKER     │ ← Implementation: edit, generate, refactor    │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │  REVIEWER    │ ← Code review, quality gates, lint check      │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │   TESTER     │ ← Test generation, execution, coverage        │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │   SECURITY   │ ← Vulnerability scan, auth validation         │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │ PERFORMANCE  │ ← Bundle size, query analysis, render perf    │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │  GIT AGENT   │ ← Commit, changelog, PR description           │
         │  └──────┬───────┘                                               │
         │         │                                                       │
         │  ┌──────▼───────┐                                               │
         │  │ MEMORY MGR   │ ← Update knowledge, persist decisions         │
         │  └──────────────┘                                               │
         └─────────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────▼──────────────────────────────────────────────┐
         │                    MEMORY & CACHE LAYER                         │
         │                                                                │
         │  .opencode/memory/       ← Persistent project knowledge        │
         │  .opencode/summaries/    ← Compressed repository views         │
         │  .opencode/cache/        ← Cache fingerprints, hashes          │
         │  .opencode/knowledge/    ← Learned patterns, bugs, tech debt   │
         │  .opencode/state/        ← Session state, task progress        │
         │  .opencode/standards/    ← Coding conventions, naming rules     │
         └────────────────────────────────────────────────────────────────┘
```

---

## 2. MODEL ROUTING STRATEGY

### 2.1 DeepSeek Zen (Free — Primary Worker)

Performs 85%+ of all tasks including:

| Category | Specific Tasks |
|---|---|
| File Operations | Read files, search with glob, grep for symbols |
| Repository Indexing | Build symbol index, class index, function index, dependency graph |
| Documentation | README updates, markdown generation, code explanation, file summaries |
| Simple Edits | Import fixes, formatting, lint fixes, boilerplate, configuration edits |
| Test Execution | Run tests, parse results, identify failures |
| Git Operations | Commit message generation, status checks, diff parsing |
| Extraction | TODO extraction, changelog generation, dependency inspection |
| State Management | Update progress, mark tasks complete, record metrics |
| Cache Operations | Update summaries, refresh indexes, validate fingerprints |
| Context Assembly | Retrieve relevant files, merge summaries, prepare worker context |
| Simple Refactoring | Rename symbols, extract functions, inline variables |

### 2.2 DeepSeek V4 Pro (Fireworks — Expensive Reasoning)

Invoked ONLY when the task requires:

| Category | Trigger Conditions |
|---|---|
| Architecture | New feature design, system redesign, module boundaries |
| Difficult Debugging | Multi-component bugs, race conditions, data corruption |
| Multi-File Refactoring | Cross-cutting changes spanning 5+ files |
| Security | Auth model changes, encryption, vulnerability assessment |
| API Design | New endpoint families, versioning, response envelope design |
| Database Evolution | Schema changes, migration strategy, query optimization |
| Distributed Systems | Concurrency, caching strategies, consistency models |
| Algorithm Design | Sorting, searching, optimization algorithms |
| Framework Migration | Version upgrades with breaking changes |
| Implementation Planning | Breaking down 10+ subtask features |
| Code Review | Reviewing complex multi-file diffs for correctness |
| Design Validation | Verify architecture decisions against constraints |
| Production Decisions | Deployment strategy, rollback plans, monitoring design |
| Performance Engineering | Profiling, bottleneck analysis, caching layer design |
| Cost Optimization | Analyze token usage patterns, recommend context improvements |

### 2.3 Escalation Logic

```
Task enters Router
  │
  ├─ Is task simple? (single file, search, read, format, lint fix, etc.)
  │    └─ Yes → DeepSeek Zen ($0)
  │
  ├─ Is task moderate? (multi-step but well-defined pattern)
  │    └─ Yes → DeepSeek Zen ($0) + Planner for decomposition
  │
  ├─ Is task complex? (architecture, debugging, algorithm, security, multi-file refactor)
  │    └─ Check confidence threshold:
  │         ├─ Zen can handle at >90% confidence → Zen
  │         └─ Zen confidence <90% → DeepSeek V4 Pro
  │
  └─ All V4 Pro calls include justification in telemetry log
```

### 2.4 Cost Optimization Rules

1. ALWAYS attempt with DeepSeek Zen first for any task category not in V4 Pro trigger list
2. Batch multiple Zen tasks into single calls where possible (amortize overhead)
3. Pre-compute repository summaries with Zen (one-time cost, infinite reuse)
4. Store all retrieved context in cache/ for reuse across sessions
5. Compress context before sending to V4 Pro (strip irrelevant sections)
6. Every V4 Pro call logs: reason, task complexity score, expected vs actual tokens
7. Maximum V4 Pro calls per session: 3 (escalate to human after)

---

## 3. AGENT HIERARCHY — COMPLETE SPECIFICATION

### 3.1 Project Manager (`@pm`)

| Attribute | Value |
|---|---|
| Model | DeepSeek V4 Pro |
| Responsibility | Goal intake, scope definition, prioritization, risk identification |
| Inputs | User request, ROADMAP.md, current phase status, memory/state |
| Outputs | Goal spec, priority score, estimated complexity, required agents list |
| Memory | Updates .opencode/state/current-goal.md, .opencode/planning/ |
| Failure | Escalate to human for goal clarification |
| Can edit | No (read-only, produces plans) |

### 3.2 Architect (`@architect`)

| Attribute | Value |
|---|---|
| Model | DeepSeek V4 Pro |
| Responsibility | System design, module boundaries, data flow, technology choices |
| Inputs | ARCHITECTURE.md, FRONTEND_ARCHITECTURE.md, DATABASE_SCHEMA.md, AUTH_FLOW.md |
| Outputs | Design decision document, trade-off analysis, interface contracts |
| Memory | Updates .opencode/architecture/, .opencode/memory/decisions.md |
| Failure | Escalate conflicting constraints to human |
| Can edit | No (read-only advisory) |

### 3.3 Planner (`@planner`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Task decomposition, dependency ordering, step sequencing |
| Inputs | Goal spec from PM, architect decisions, existing codebase structure |
| Outputs | Ordered task list with dependencies, context requirements per task |
| Memory | Writes .opencode/planning/task-plan.md, updates state |
| Failure | Mark blocker, escalate to architect for replanning |
| Can edit | Writes plan files only, not source code |

### 3.4 Retriever (`@retriever`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Context assembly, file retrieval, symbol lookup, memory recall |
| Inputs | Task from planner, file paths, symbol names, topic |
| Outputs | Packed context block: relevant files, summaries, standards, prior art |
| Memory | Updates .opencode/summaries/, .opencode/cache/fingerprints.md |
| Failure | Report missing context, trigger re-indexing |
| Can edit | Only .opencode/summaries/ and .opencode/cache/ |

### 3.5 Worker (`@worker`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen (primary), DeepSeek V4 Pro (escalated) |
| Responsibility | Code implementation: editing files, generating code, refactoring |
| Inputs | Task spec, packed context from retriever, coding standards |
| Outputs | Modified files, generated code, implementation notes |
| Memory | Updates .opencode/state/task-progress.md |
| Failure | Report to reviewer; escalate to V4 Pro on 2nd failure |
| Can edit | Yes — all source files |

### 3.6 Reviewer (`@reviewer`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen (simple), DeepSeek V4 Pro (complex multi-file) |
| Responsibility | Code review, quality gate enforcement, convention compliance |
| Inputs | Diff of changes, project standards, architecture rules |
| Outputs | Review report: blockers, warnings, suggestions with severity |
| Memory | Updates .opencode/telemetry/reviews.md |
| Failure | Mark blocker, return to worker with specific fix instructions |
| Can edit | No (read-only, produces review report) |

### 3.7 Tester (`@tester`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Test generation, test execution, coverage analysis |
| Inputs | Changed files, test patterns from standards, existing test examples |
| Outputs | New test files, test execution report, coverage report |
| Memory | Updates .opencode/telemetry/tests.md |
| Failure | Report failing tests to reviewer |
| Can edit | Yes — test files only |

### 3.8 Security Auditor (`@security`)

| Attribute | Value |
|---|---|
| Model | DeepSeek V4 Pro |
| Responsibility | Vulnerability scanning, auth validation, secret detection |
| Inputs | Changed files, auth config, environment pattern |
| Outputs | Security audit report with CVE-style severity |
| Memory | Updates .opencode/memory/security.md |
| Failure | Blocker — immediately flag to human |
| Can edit | No |

### 3.9 Performance Auditor (`@perf`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Bundle size, query efficiency, render performance review |
| Inputs | Changed files, build output, query patterns |
| Outputs | Performance report: regressions, optimizations, measurements |
| Memory | Updates .opencode/telemetry/performance.md |
| Failure | Flag performance regression as warning |
| Can edit | No |

### 3.10 Git Agent (`@git`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Commit message generation, changelog updates, PR description |
| Inputs | Git diff, branch name, task context |
| Outputs | Commit message, updated CHANGELOG, PR template |
| Memory | Updates version info in memory |
| Can edit | CHANGELOG.md, version files |

### 3.11 Memory Manager (`@memory`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Knowledge persistence, learning from sessions, indexing updates |
| Inputs | Session results, new patterns discovered, changed files |
| Outputs | Updated memory files, new summaries, refreshed indexes |
| Memory | Updates ALL .opencode/memory/ files |
| Can edit | Only .opencode/memory/, .opencode/summaries/, .opencode/knowledge/ |

### 3.12 Documentation Agent (`@docs`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | API docs, architecture docs, README updates, inline doc generation |
| Inputs | Changed API endpoints, new features |
| Outputs | Updated docs/ files, JSDoc additions |
| Memory | N/A |
| Can edit | docs/ and JSDoc comments in source |

### 3.13 Cost Optimizer (`@cost`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Token usage analysis, context compression, cache optimization |
| Inputs | Session telemetry, token logs |
| Outputs | Cost report, compression recommendations |
| Memory | Updates .opencode/telemetry/costs.md, .opencode/cache/ |
| Can edit | Only .opencode/ files |

### 3.14 Context Manager (`@ctx`)

| Attribute | Value |
|---|---|
| Model | DeepSeek Zen |
| Responsibility | Maximize prompt cache hits, manage context lifecycle |
| Inputs | Task requirements, repository structure |
| Outputs | Optimized context block with stable prefixes |
| Memory | Maintains .opencode/cache/ fingerprints |
| Can edit | Only .opencode/cache/, .opencode/summaries/ |

---

## 4. MEMORY ARCHITECTURE

### 4.1 Memory File Map

```
.opencode/memory/
├── README.md                  # Memory system overview
├── project-overview.md        # What this project is, domain, goals
├── architecture.md            # Current architecture state, module graph
├── api-surface.md             # All API endpoints, request/response shapes
├── database-schema.md         # Active schema snapshot, indexes, relations
├── coding-standards.md        # Conventions, naming, patterns, quality rules
├── design-decisions.md        # ADR-style log of past architecture decisions
├── common-patterns.md         # Implementation patterns found in the codebase
├── known-bugs.md              # Active bugs and workarounds
├── tech-debt.md               # Tracked technical debt items
├── completed-features.md      # What's been built and how
├── pending-tasks.md           # Current outstanding work
├── dependencies.md            # Package versions, their purpose, upgrade notes
├── environment.md             # Required env vars, their purpose, defaults
├── testing-strategy.md        # Test approach, coverage targets, patterns
├── cicd.md                    # CI/CD pipeline configuration reference
├── security-decisions.md      # Auth model, permission boundaries, threat model
└── learning-log.md            # Patterns the AI has learned about this project
```

### 4.2 Memory Lifecycle

```
SESSION START
  │
  ├─ Load: project-overview.md, architecture.md, coding-standards.md (always)
  │
  ├─ If task involves API → load api-surface.md
  │   If task involves DB → load database-schema.md
  │   If task involves auth → load security-decisions.md
  │   If task is refactor → load common-patterns.md, tech-debt.md
  │   If task is new feature → load completed-features.md, pending-tasks.md
  │
  ├─ During execution: Worker writes implementation notes
  │
  └─ SESSION END
       │
       ├─ Memory Manager runs
       │   ├─ Updates any changed memory files
       │   ├─ Adds new patterns to common-patterns.md
       │   ├─ Records decisions to design-decisions.md
       │   ├─ Updates completed-features.md or pending-tasks.md
       │   └─ Appends learning-log.md with session insights
       │
       └─ Context Manager runs
           ├─ Regenerates summaries for changed files
           ├─ Updates cache fingerprints
           └─ Compresses stale context
```

### 4.3 Memory Compression

Memory files use stable headers and deterministic ordering for maximum cache hits:

```markdown
## [Section Name]
<!-- stable-hash: a1b2c3 -->  ← Stable anchor for prompt cache

Content remains stable across sessions. Only updated when actual changes occur.
```

---

## 5. CONTEXT SYSTEM & CACHE OPTIMIZATION

### 5.1 Stable Prompt Architecture

```
┌──────────────────────────────────────────────┐
│ PREFIX (Immutable, cached forever)            │
│   System prompt                               │
│   Agent role definition                       │
│   Project identity                            │
│   Architecture constraints (never change)     │
├──────────────────────────────────────────────┤
│ STATIC REFERENCES (Infrequently changed)      │
│   README summary (hash-stable)                │
│   ARCHITECTURE summary                        │
│   CODING STANDARDS                            │
│   Skill documents                             │
│   Static configuration                        │
├──────────────────────────────────────────────┤
│ DYNAMIC CONTEXT (Task-specific, minimal)      │
│   Relevant file contents (only what's needed) │
│   Diff of changes                             │
│   Session state                               │
│   User instructions                           │
└──────────────────────────────────────────────┘
```

### 5.2 Cache Hit Strategy

1. **Stable System Prompts**: Agent definition files have static frontmatter + stable body text
2. **Immutable Architecture Prompt**: ARCHITECTURE.md constraints never change in session scope
3. **Deterministic Section Ordering**: All memory files use fixed section ordering
4. **Content Fingerprints**: Each summary file has `<!-- sha256: abc123... -->` for invalidation
5. **Incremental Context Updates**: Only changed paragraphs are re-sent, not entire files
6. **Prefixed Memory Blocks**: Each loaded section has a stable 3-line prefix header
7. **Chunk Reuse**: Common imports patterns, error handling blocks are standardized
8. **Token Deduplication**: Shared utility functions referenced by hash, not included inline
9. **Prompt Normalization**: All agent prompts use consistent formatting (same indentation, same header styles)
10. **File-Level Hashing**: Changed files trigger re-summary only; unchanged files reuse cached summary

### 5.3 Expected Cache Hit Rates

| Block Type | Expected Hit Rate | Justification |
|---|---|---|
| System prompt | 100% | Never changes |
| Architecture rules | 100% | Never changes within session |
| Coding standards | 100% | Only changes when conventions change |
| Skill docs | 100% | Static reference material |
| File summaries | 90%+ | Only changes when files change |
| Memory files | 85%+ | Updated only at session end |
| Task context | 20-40% | Task-specific, inherently unique |

Overall target: **70%+ total cache hit rate** across the session.

---

## 6. REPOSITORY INDEXING PIPELINE

### 6.1 Index Hierarchy

```
Level 1: Repository Summary    (.opencode/summaries/repo-overview.md)
  │    Total files, LOC, tech stack, top-level structure
  │
Level 2: Directory Summaries   (.opencode/summaries/dirs/{dirname}.md)
  │    Purpose of each directory, files within, key symbols
  │
Level 3: File Summaries        (.opencode/summaries/files/{path-hash}.md)
  │    Exports, key functions, classes, types, dependencies
  │
Level 4: Symbol Index          (.opencode/summaries/symbols.json)
  │    Every exported function/class/type/interface → file:line
  │
Level 5: Dependency Graph      (.opencode/summaries/deps.json)
  │    Import graph between modules
  │
Level 6: Graph Representations  (.opencode/summaries/graphs/)
       call-graph.json, module-graph.json, endpoint-graph.json,
       database-graph.json, test-graph.json, config-graph.json
```

### 6.2 Indexing Process

```
1. Index Runner (DeepSeek Zen)
   │
   ├─ Scan: glob all .ts, .tsx, .json, .css, .md files → file manifest
   │
   ├─ Summarize: For each file, extract:
   │   - Exports (named, default, type)
   │   - Function signatures with parameter types
   │   - Class/interface/type definitions
   │   - Import list with source modules
   │   - File purpose (1-2 sentences)
   │   - LOC count
   │
   ├─ Build Symbol Index:
   │   - Map every export to file:line
   │   - Categorize by type (function, class, type, component, hook, util, etc.)
   │
   ├─ Build Dependency Graph:
   │   - Parse all imports
   │   - Construct directed graph module → module
   │   - Detect cycles (flag as tech debt)
   │
   └─ Write all indexes to .opencode/summaries/
```

### 6.3 Incremental Update

On file change:
1. Hash the file content
2. Compare with cached hash in `.opencode/cache/file-fingerprints.json`
3. If changed: re-summarize that file only, update symbol index entries for that file
4. If unchanged: skip

---

## 7. RETRIEVAL PIPELINE

### 7.1 Context Assembly Flow

```
1. PLANNER produces: [task-description, file-paths, symbols-needed, topic-tags]

2. RETRIEVER lookup:
   │
   ├─ Lookup file-paths → file summaries from .opencode/summaries/files/
   │   If summary missing → read file, generate summary
   │
   ├─ Lookup symbols-needed → find in symbol index → resolve to files
   │
   ├─ Lookup topic-tags → search memory files for relevant decisions/patterns
   │
   ├─ Check dependency graph → include transitive dependencies up to depth 1
   │
   └─ Assemble context block:
        {prefix: standards, files: [...], symbols: [...], memory: [...], prior_art: [...]}

3. RETRIEVER validates:
   ├─ Are ALL required symbols resolved?
   ├─ Is context size < 10K tokens? (If not, compress)
   └─ Are all include paths resolvable?

4. Delivery → WORKER receives packed context
```

### 7.2 Context Compression

When context exceeds 10K tokens:
1. Strip whitespace and comments from included source files
2. Replace function bodies with `{ /* implementation */ }` for unrelated functions
3. Use symbol signatures only (not full implementations) for dependencies
4. Merge adjacent memory entries into reference notes
5. Remove sections not directly referenced by the task

---

## 8. AUTONOMOUS CODING LOOP

### 8.1 Complete Workflow

```
GOAL (User input)
  │
  ▼
[1] GATE: Goal Classification (Router)
  │   - Simple? → Fast path (Worker only)
  │   - Moderate? → Standard path (Planner + Worker)
  │   - Complex? → Full pipeline
  │
  ▼
[2] UNDERSTAND (Project Manager)
  │   - Parse intent
  │   - Check ROADMAP.md for context
  │   - Load project-overview.md
  │   - Identify affected modules
  │
  ▼
[3] SEARCH REPOSITORY (Retriever)
  │   - Find similar implementations (grep for patterns)
  │   - Identify files to modify
  │   - Check dependency graph for blast radius
  │
  ▼
[4] RETRIEVE MEMORY (Memory Manager)
  │   - Load relevant design decisions
  │   - Load common patterns for the feature domain
  │   - Load known bugs in target area
  │   - Load coding standards
  │
  ▼
[5] DESIGN (Architect) — complex tasks only
  │   - Validate against architecture constraints
  │   - Design API surface if new endpoints
  │   - Design data flow
  │   - Review module boundaries
  │
  ▼
[6] PLAN (Planner)
  │   - Decompose into ordered subtasks
  │   - Assign dependencies
  │   - Estimate complexity per subtask
  │   - Output task plan to .opencode/planning/
  │
  ▼
[7] VALIDATE PLAN (Reviewer, lightweight)
  │   - Sanity check: does the plan make architectural sense?
  │   - Are all constraints respected?
  │   - Is the blast radius acceptable?
  │
  ▼
[8] EXECUTE (Worker, one subtask at a time)
  │
  │   FOR EACH SUBTASK:
  │   │
  │   ├─ RETRIEVE: Get specific context for this subtask
  │   │
  │   ├─ IMPLEMENT: Write/edit code
  │   │
  │   ├─ COMPILE: npm run build or tsc --noEmit
  │   │   ├─ PASS → continue
  │   │   └─ FAIL → FIX (max 3 retries) → escalate to V4 Pro on failure
  │   │
  │   ├─ LINT: npm run lint
  │   │   ├─ PASS → continue
  │   │   └─ FAIL → Auto-fix fixable issues → re-lint
  │   │
  │   ├─ TEST: Run affected tests
  │   │   ├─ PASS → continue
  │   │   └─ FAIL → FIX (max 3 retries) → escalate
  │   │
  │   └─ CHECKPOINT: git diff → save state
  │
  ▼
[9] REVIEW (Reviewer)
  │   - Full diff review
  │   - Check against ALL quality gates
  │   - Verify architecture constraints
  │   - Check naming conventions
  │   - Flag issues with severity
  │
  ▼
[10] GATE: Review Pass?
  │   ├─ YES → continue
  │   └─ NO → Return to Worker with fix instructions → loop [8]
  │
  ▼
[11] TEST SUITE (Tester)
  │   - Run full test suite
  │   - Generate missing tests if coverage drops
  │   - Verify coverage thresholds
  │
  ▼
[12] SECURITY SCAN (Security Auditor) — if auth/authZ/db changed
  │   - Check for vulnerabilities
  │   - Validate auth patterns
  │   - Scan for secrets
  │
  ▼
[13] PERFORMANCE REVIEW (Performance Auditor)
  │   - Check for regressions
  │   - Review new queries
  │   - Check bundle size
  │
  ▼
[14] GENERATE DIFF (Git Agent)
  │   - Summarize all changes
  │   - Generate commit message
  │   - Update CHANGELOG.md
  │   - Generate PR description if applicable
  │
  ▼
[15] COMMIT (Git Agent)
  │   - Stage files
  │   - Commit with generated message
  │
  ▼
[16] UPDATE MEMORY (Memory Manager)
  │   - Update completed-features.md or pending-tasks.md
  │   - Record design decisions
  │   - Add new patterns
  │   - Update learning log
  │
  ▼
[17] UPDATE DOCUMENTATION (Documentation Agent)
  │   - Update API docs if endpoints changed
  │   - Update architecture docs if structure changed
  │   - Update README if features changed
  │
  ▼
[18] UPDATE INDEXES (Context Manager)
  │   - Re-summarize changed files
  │   - Update symbol index
  │   - Update dependency graph
  │   - Update cache fingerprints
  │
  ▼
[19] TELEMETRY (Cost Optimizer)
  │   - Record token usage
  │   - Update cost metrics
  │   - Calculate cache hit rate
  │   - Record completion time
  │
  ▼
FINISH → Report summary to user
```

### 8.2 Fast Path (Simple tasks)

For tasks like "fix this import" or "add a comment":

```
GOAL → RETRIEVE (get file) → WORKER (edit file) → LINT → FINISH
```

Skipping: PM, Architect, Planner, Reviewer (manual review optional), Tester, Security, Performance, Memory, Docs.

### 8.3 Standard Path (Moderate tasks)

For tasks like "add a new API endpoint" or "create a component":

```
GOAL → PLANNER → RETRIEVE → WORKER → COMPILE → LINT → REVIEWER → TEST → FINISH
```

---

## 9. CODE QUALITY GATES

Every change must pass these gates before commit:

| Gate | Tool | Must Pass? | Fix Strategy |
|---|---|---|---|
| Formatting | Prettier (if configured) | Yes | Auto-fix |
| Linting | ESLint | Yes | Auto-fix identifiable, manual for rest |
| Type Check | `tsc --noEmit` | Yes | Fix type errors |
| Build | `npm run build` | Yes | Fix compile errors |
| Unit Tests | Vitest | Yes | Fix or add tests |
| Module Dependency | Manual check | Yes | Refactor imports |
| Architecture Rules | Manual review | Yes | Redesign |
| Security Scan | Manual review | Conditional | Fix or justify |
| Naming Convention | Manual review | Yes | Rename |
| Soft Delete Pattern | Manual check | Yes | Add WHERE clause |
| Auth Guards | Manual check | Conditional | Add guards |
| Zod Validation | Manual check | Conditional | Add validation |
| Coverage Threshold | Vitest | Warning | Add tests |

---

## 10. ARCHITECTURE ENFORCEMENT

### 10.1 Automatic Checks (via Reviewer)

1. `lib/` must NEVER import from `features/` or `app/` — grep for violations
2. Client components must never import from `features/*/services.ts` — grep for pattern
3. No global state library imports — grep for `zustand`, `redux`, `jotai`, `valtio`
4. `use client` directive only where justified — grep for `"use client"` count
5. All DB queries include `WHERE deleted_at IS NULL` — grep queries
6. All API route handlers validate input — check for Zod import
7. Response format follows `{ data }` / `{ error }` envelope — read route files

### 10.2 Design Rule Enforcement

| Rule | Enforcement |
|---|---|
| SOLID | Single-responsibility: files <300 LOC, functions <50 LOC |
| DRY | Detect copy-pasted blocks >10 lines |
| KISS | Flag abstractions with <2 usages |
| YAGNI | Flag unused exports, dead code |
| Layer Boundaries | Dependency arrow check |
| Domain Separation | Features don't cross-import implementation details |
| Consistent Naming | kebab-case routes, PascalCase components, camelCase services |

---

## 11. FAILURE RECOVERY

### 11.1 Failure Matrix

| Failure | Detection | Recovery | Max Retries |
|---|---|---|---|
| Hallucination (fake API/import) | TypeScript build fails | Remove bad code, re-implement with real docs | 3 |
| Compile error | `npm run build` fails | Parse error, fix specific issue | 3 |
| Test failure | Test runner reports | Analyze failure, fix code | 3 |
| Merge conflict | Git reports conflict | Regenerate from clean state | 2 |
| Bad refactor (regression) | Tests fail | `git reset --hard HEAD` → replan | 2 |
| Incorrect assumption | Reviewer flags | Reload docs, replan | 1 |
| Context overflow | Token limit reached | Compress context, retry | 1 |
| Tool failure | Tool returns error | Retry with different approach | 2 |
| API failure (Fireworks) | HTTP error | Fallback to Zen, flag for retry | 2 |
| Network failure | Connection error | Wait + retry with exponential backoff | 5 |

### 11.2 Rollback Mechanism

```
Every Worker subtask creates a checkpoint:
  1. git add <changed files> → staged but not committed
  2. If subtask fails verification (compile/lint/test):
     └─ git checkout -- <changed files> → rollback to clean state
  3. If all subtasks in batch pass:
     └─ All remain staged for final review + commit
```

---

## 12. OPENCODE DIRECTORY LAYOUT

```
.opencode/
├── agents/                       # Agent definition files (.md)
│   ├── router.md                 # Task classification + model routing
│   ├── project-manager.md        # Goal intake, scoping, prioritization
│   ├── architect.md              # System design, trade-off analysis
│   ├── planner.md                # Task decomposition, dependency ordering
│   ├── retriever.md              # Context assembly, file lookup
│   ├── worker.md                 # Code implementation, editing
│   ├── reviewer.md               # Code review, quality gates
│   ├── tester.md                 # Test generation, execution, coverage
│   ├── security.md               # Vulnerability scanning, auth audit
│   ├── performance.md            # Bundle/query/render performance
│   ├── git.md                    # Commit, changelog, PR management
│   ├── memory.md                 # Knowledge persistence, indexing
│   ├── docs.md                   # Documentation generation
│   ├── cost-optimizer.md         # Token tracking, cost analysis
│   └── context.md                # Cache optimization, context lifecycle
│
├── workflows/                    # Execution workflow definitions
│   ├── fast-path.md              # Simple task workflow
│   ├── standard-path.md          # Moderate task workflow
│   ├── full-pipeline.md          # Complex task workflow
│   ├── quality-gates.md          # Gate definitions and checklists
│   └── failure-recovery.md       # Recovery procedures
│
├── memory/                       # Persistent project knowledge
│   ├── README.md
│   ├── project-overview.md
│   ├── architecture.md
│   ├── api-surface.md
│   ├── database-schema.md
│   ├── coding-standards.md
│   ├── design-decisions.md
│   ├── common-patterns.md
│   ├── known-bugs.md
│   ├── tech-debt.md
│   ├── completed-features.md
│   ├── pending-tasks.md
│   ├── dependencies.md
│   ├── environment.md
│   ├── testing-strategy.md
│   ├── cicd.md
│   ├── security-decisions.md
│   └── learning-log.md
│
├── summaries/                    # Compressed repository views
│   ├── repo-overview.md
│   ├── dirs/                     # One summary per directory
│   │   ├── app.md
│   │   ├── components.md
│   │   ├── lib.md
│   │   ├── features.md
│   │   └── data.md
│   ├── files/                    # One summary per file (by content-hash filename)
│   ├── symbols.json              # All exported symbols → file:line
│   ├── deps.json                 # Module dependency graph
│   └── graphs/                   # Domain-specific graphs
│       ├── call-graph.json
│       ├── module-graph.json
│       ├── endpoint-graph.json
│       ├── database-graph.json
│       ├── test-graph.json
│       └── config-graph.json
│
├── architecture/                 # Architecture decision records
│   ├── constraints.md            # Hard constraints (never violate)
│   ├── boundaries.md             # Module boundaries and rules
│   ├── data-flow.md              # How data moves through the system
│   └── evolution-log.md          # Architecture changes over time
│
├── standards/                    # Code standards and conventions
│   ├── naming.md                 # Naming conventions
│   ├── patterns.md               # Approved implementation patterns
│   ├── formatting.md             # Formatting rules
│   └── imports.md                # Import ordering and conventions
│
├── verification/                 # Verification scripts and rules
│   ├── dependency-check.md       # Module dependency verification rules
│   ├── security-checklist.md     # Security verification checklist
│   └── quality-checklist.md      # Pre-commit quality checklist
│
├── planning/                     # Active planning state
│   ├── current-goal.md           # What we're working on now
│   ├── task-plan.md              # Decomposed task list
│   └── dependency-map.md         # Inter-task dependencies
│
├── knowledge/                    # Domain knowledge and learned patterns
│   ├── nextjs.md                 # Next.js 16 specific knowledge
│   ├── drizzle.md                # Drizzle ORM patterns
│   ├── clerk.md                  # Clerk auth patterns
│   ├── tailwind.md               # Tailwind CSS patterns
│   └── react.md                  # React 19 patterns
│
├── state/                        # Session state
│   ├── current-goal.md           # Active goal definition
│   ├── task-progress.md          # Per-subtask status (pending/in_progress/done)
│   ├── session-context.md        # Loaded context for current session
│   └── agent-status.md           # Which agents are active/stalled
│
├── cache/                        # Cache optimization data
│   ├── file-fingerprints.json    # {filepath: sha256} for invalidation
│   ├── context-hashes.json       # Stable hashes for context blocks
│   ├── prompt-prefixes.json      # Cached prompt prefixes
│   └── compression-log.md        # Context compression history
│
├── telemetry/                    # Metrics and monitoring
│   ├── costs.md                  # Token usage and cost per session
│   ├── reviews.md                # Review pass/fail history
│   ├── tests.md                  # Test pass/fail history
│   ├── performance.md            # Performance metrics over time
│   ├── cache-hits.md             # Cache hit rates per session
│   └── routing-logs.md           # Model routing decisions
│
├── scripts/                      # Automation scripts
│   ├── index.sh                  # Rebuild all indexes
│   ├── verify.sh                 # Run all quality gates
│   └── cleanup.sh                # Clean cached state
│
├── skills/                       # Technology-specific skills (existing)
│   ├── nextjs/SKILL.md
│   ├── drizzle/SKILL.md
│   └── state-management/SKILL.md
│
├── command/                      # Custom commands (existing + new)
│
├── agent/                        # Legacy agent dir (deprecated, migrate to agents/)
│   ├── architect.md
│   ├── advisor.md
│   ├── quality.md
│   └── db.md
└── ...
```

---

## 13. PROMPT ARCHITECTURE

### 13.1 Prompt Structure for All Agents

Each agent prompt uses a fixed structure for maximum caching:

```
1. AGENT IDENTITY (stable, <200 tokens)
   - Role, responsibility, model assignment
   - This block NEVER changes

2. PROJECT CONTEXT (stable, <500 tokens)
   - What this project is
   - Tech stack summary
   - Key architecture rules
   - This block changes only on major project evolution

3. MANDATORY KNOWLEDGE (stable per session, <1000 tokens)
   - Coding standards (from memory)
   - Architecture constraints
   - Current conventions
   - Loaded once, cached for session

4. TASK-SPECIFIC CONTEXT (variable)
   - Files relevant to this task
   - Symbols needed
   - Prior art examples
   - Minimized to essentials

5. INSTRUCTIONS (variable)
   - Specific task instructions
   - Expected output format
```

### 13.2 Prompt Caching Strategy

```
STABLE PREFIX (always loaded)
  ├─ Agent identity prompt (from agents/*.md)
  ├─ Project overview (from memory/project-overview.md)
  ├─ Architecture constraints (from architecture/constraints.md)
  └─ Coding standards (from memory/coding-standards.md)
  → Cache key: hash of these 4 blocks combined
  → Expected cache TTL: entire session

EXTENDED CONTEXT (loaded per task domain)
  ├─ API surface (if API task)
  ├─ DB schema (if DB task)
  ├─ Common patterns (if implementation task)
  └─ Skill files (if matching technology)
  → Cache key: hash of stable prefix + task domain
  → Expected cache TTL: per task batch

DYNAMIC CONTEXT (loaded per subtask)
  ├─ File contents (specific to subtask)
  ├─ Symbol references
  └─ Prior art
  → Minimal caching expected — optimize for small size
```

---

## 14. COST OPTIMIZATION STRATEGY

### 14.1 Token Budget per Session

| Category | Budget | Model |
|---|---|---|
| Context loading | 5K tokens | Any (cached) |
| Planning | 2K tokens | Zen |
| Retrieval | 3K tokens | Zen |
| Implementation (per subtask) | 5K tokens | Zen |
| Review | 2K tokens | Zen |
| V4 Pro (if escalated) | 8K tokens | V4 Pro |
| Memory update | 2K tokens | Zen |
| Documentation | 2K tokens | Zen |
| **Total typical session** | **~30K tokens** | **90%+ Zen** |

### 14.2 Cost Thresholds

| Metric | Threshold | Action on Exceed |
|---|---|---|
| V4 Pro per session | 3 calls | Halt, escalate to human |
| V4 Pro tokens per call | 12K | Compress context, retry |
| Zen tokens per session | 50K | Review for inefficiency |
| Total tokens per hour | 200K | Rate limit, batch tasks |

### 14.3 Batching Strategy

```
Instead of:                            Use:
Worker → edit file A                   Worker → edit files A, B, C
Worker → edit file B                   (single call with combined context)
Worker → edit file C

Instead of:                            Use:
Tester → run tests for file A          Tester → run ALL affected tests
Tester → run tests for file B          (single test run)
Tester → run tests for file C
```

---

## 15. METRICS & TELEMETRY

### 15.1 Measured Metrics

| Metric | Target | How Measured |
|---|---|---|
| Cache hit rate | >70% | cache-hits / total-context-loads |
| Average context size | <8K tokens | tokens per agent invocation |
| Tokens per task | <30K total | sum of all agent tokens |
| Cost per task | <$0.01 | V4 Pro tokens * rate (Fireworks) |
| Completion time | <5 min / simple task | wall clock |
| Retry count | <1 per subtask | compile/lint/test retry loop |
| Hallucination rate | <5% | compile failures / code generations |
| Test pass rate | >95% | passed tests / total tests |
| Review pass rate | >80% | reviews passed / total reviews |
| Bug rate | <2 per feature | bugs found post-commit |
| Architecture violations | 0 | reviewer detections |
| Duplicate code | <5% | grep for code clones |
| Tech debt items | <10 tracked | memory/tech-debt.md size |
| Context reuse | >60% | blocks reused / blocks loaded |
| Routing efficiency | >85% routable to Zen | Zen tasks / total tasks |

### 15.2 Dashboard (telemetry/)

All telemetry files are organized chronologically:

```
.opencode/telemetry/
├── costs.md              ← Cumulative + per-session breakdown
├── reviews.md            ← Pass/fail per review
├── tests.md              ← Test runs per session
├── performance.md        ← Regressions tracked
├── cache-hits.md         ← Per-session cache analysis
└── routing-logs.md       ← Every model routing decision + justification
```

---

## 16. PRODUCTION ENGINEERING CHECKLIST

### 16.1 Pre-Session
- [ ] Git status clean (or documented)
- [ ] Memory files loaded and valid
- [ ] Repository indexes current
- [ ] Cache fingerprints validated
- [ ] Agent definitions loaded without errors
- [ ] Environment variables present

### 16.2 Per-Task
- [ ] Router classified task correctly
- [ ] All required context retrieved
- [ ] Architecture constraints loaded in context
- [ ] No stale memory references
- [ ] Cache hit rate tracked

### 16.3 Pre-Commit
- [ ] All quality gates passed
- [ ] Tests passing
- [ ] Build succeeding
- [ ] Lint clean
- [ ] No architecture violations
- [ ] No secrets committed
- [ ] Memory updated
- [ ] Documentation updated
- [ ] Indexes regenerated

### 16.4 Post-Session
- [ ] Telemetry recorded
- [ ] Learning log updated
- [ ] Cache optimized
- [ ] State files cleaned
- [ ] Cost report generated

---

## 17. IMPLEMENTATION ROADMAP

### Phase 1: Core Infrastructure (now)
- [x] Directory structure
- [ ] opencode.json redesign
- [ ] Router agent definition
- [ ] Memory file bootstrap

### Phase 2: Agent Definitions (now)
- [ ] All 14 agent .md files
- [ ] Workflow definitions
- [ ] Context manager implementation

### Phase 3: Memory System (now)
- [ ] Bootstrap all 17 memory files
- [ ] Repository indexing pipeline
- [ ] Summary generator

### Phase 4: Quality System (next)
- [ ] Quality gate definitions
- [ ] Verification checklists
- [ ] Failure recovery procedures

### Phase 5: Optimization (ongoing)
- [ ] Cache optimization rules
- [ ] Cost tracking
- [ ] Telemetry dashboard
- [ ] Continuous improvement

---

## 18. FUTURE IMPROVEMENTS

1. **Self-Healing Indexes**: Automatically detect stale summaries and regenerate
2. **Predictive Retrieval**: Pre-load context based on common task patterns
3. **Multi-Agent Parallelism**: Run Worker + Tester + Reviewer concurrently
4. **Session Fusion**: Merge learning across multiple sessions
5. **Embedding-Based Retrieval**: Vector similarity for finding related code
6. **Automated Refactoring Pipeline**: Detect tech debt patterns → propose → execute
7. **Integration with CI/CD**: Trigger OpenCode on PR, run autonomous review
8. **Cost Budget Enforcer**: Hard limit on daily V4 Pro spend
9. **Personality Profiles**: Adapt agent behavior per user's coding style
10. **Cross-Project Learning**: Share patterns across multiple repositories

---

## 19. RISKS AND MITIGATION

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| V4 Pro spending spikes | High | Medium | Hard limit of 3 calls/session; cost alert |
| Zen produces low-quality code | Medium | Medium | Reviewer gate catches issues before commit |
| Context overflow on large files | Medium | High | File summaries instead of full files; chunked reads |
| Cache invalidation misses | Low | Medium | Content hashing for fingerprint comparison |
| Hallucinated imports/APIs | High | Medium | TypeScript compiler catches; reviewer second check |
| Stale memory causing wrong decisions | Medium | Low | Timestamp on all memory entries; freshness validation |
| Agent loop (infinite retry) | High | Low | Max 3 retries per subtask; escalate to human |
| Architecture drift over time | Medium | Medium | Architecture constraints enforced by reviewer; drift log |
| Token budget exhaustion | Medium | Low | Per-session budget; cost optimizer alerts |
| Tool rate limiting | Low | Medium | Exponential backoff; batch operations |

---

## 20. EXAMPLE EXECUTION: "Add comment editing feature"

```
GOAL: "Add the ability for users to edit their own comments"

[1] ROUTER (Zen)
    → Classifies as "Moderate" (API route + client component + DB)
    → Standard path triggered

[2] PROJECT MANAGER (V4 Pro)
    → Analyzes: involves API route (PATCH /api/comments/[id]),
      client island (edit button), Zod validation, soft deletes
    → Loads: ROADMAP.md, api-surface.md, auth flow
    → Output: Goal spec with 4 affected modules

[3] RETRIEVER (Zen)
    → Gathers: existing comment API routes, CommentItem.tsx,
      comments/validators.ts, auth helpers, coding standards
    → Output: 8 files packed, 3.2K tokens

[4] ARCHITECT (V4 Pro)
    → Validates: PATCH /api/comments/[id] fits REST convention
    → Checks: owner-only enforcement, Zod schema for body.content
    → Design: edit action in client island with optimistic update
    → Output: 1-page design spec

[5] PLANNER (Zen)
    → Subtask 1: Add PATCH /api/comments/[id]/route.ts (API route)
    → Subtask 2: Add Zod validator for comment edit body
    → Subtask 3: Add edit mode to CommentItem.tsx (client island)
    → Subtask 4: Wire optimistic update
    → Dependency: 1→2→4, 3 can run after 2

[6] VALIDATE PLAN (Zen Reviewer)
    → Checks: no architecture violations, right module boundaries, auth gates
    → PASS

[7] EXECUTE SUBTASK 1 (Zen Worker)
    → Creates: app/api/comments/[id]/route.ts
    → Implements: PATCH handler with auth(), Zod validate, update, return
    → Compile: PASS
    → Lint: PASS

[8] EXECUTE SUBTASK 2 (Zen Worker)
    → Creates: features/comments/validators.ts edit body schema
    → Compile: PASS
    → Lint: PASS

[9] EXECUTE SUBTASK 3 (Zen Worker)
    → Edits: CommentItem.tsx — adds edit state, EditForm, save handler
    → Compile: PASS
    → Lint: PASS

[10] EXECUTE SUBTASK 4 (Zen Worker)
    → Adds: useOptimistic for edit, router.refresh on save
    → Compile: PASS
    → Lint: PASS

[11] REVIEWER (Zen)
    → Full diff review
    → Checks: auth guard present, Zod validation, soft delete respected,
      module boundaries, naming conventions, client island justified
    → 1 Warning: inline styles in EditForm → should use Tailwind classes
    → PASS (warning is low severity)

[12] TESTER (Zen)
    → Generates: PATCH /api/comments/[id] test (auth fail, owner mismatch, success)
    → Runs full test suite: ALL PASS
    → Coverage: +2% on comments module

[13] PERFORMANCE (Zen)
    → No regressions detected
    → Bundle size unchanged

[14] GIT AGENT (Zen)
    → Commit message: "feat(comments): add comment editing with optimistic updates"
    → Updates CHANGELOG: Added comment editing feature

[15] COMMIT
    → Staged and committed

[16] MEMORY MANAGER (Zen)
    → Updates: api-surface.md (new PATCH endpoint)
    → Updates: completed-features.md
    → Adds to learning-log.md: comment edit pattern

[17] DOCUMENTATION (Zen)
    → Updates: ARCHITECTURE.md API endpoint table
    → Updates: FRONTEND_ARCHITECTURE.md client island list

[18] CONTEXT MANAGER (Zen)
    → Re-summarizes: app/api/comments/[id]/route.ts, CommentItem.tsx
    → Updates: symbol index, dependency graph
    → Updates: cache fingerprints

[19] TELEMETRY (Zen)
    → Token usage: 24K Zen ($0), 8K V4 Pro ($0.003)
    → Cache hit rate: 78%
    → Time: 3.2 minutes
    → V4 Pro calls: 2 (PM + Architect) — under budget

FINISH: "Comment editing implemented. Users can now edit their own comments with optimistic UI feedback."
```

---

*End of Blueprint*
