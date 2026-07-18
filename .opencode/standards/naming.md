# Naming Conventions
<!-- last-updated: 2026-07-11 -->

## File Naming
| Context | Convention | Examples |
|---|---|---|
| React Components | PascalCase | `ProblemCard.tsx`, `CommentSection.tsx` |
| Pages (App Router) | page.tsx, layout.tsx (always) | `app/explore/page.tsx` |
| Layouts | layout.tsx | `app/layout.tsx` |
| Error boundaries | error.tsx | `app/problems/[id]/error.tsx` |
| Loading states | loading.tsx | `app/explore/loading.tsx` |
| Not found | not-found.tsx | `app/not-found.tsx` |
| API routes | route.ts (always, kebab-case dir) | `app/api/problems/[id]/route.ts` |
| Data access | camelCase | `lib/data/problems.ts` |
| Services | services.ts, camelCase dir | `features/problems/services.ts` |
| Validators | validators.ts, camelCase dir | `features/problems/validators.ts` |
| Types | types.ts, camelCase dir | `features/problems/types.ts` |
| Test files | `*.test.ts` co-located | `lib/data/problems.test.ts` |
| E2E tests | `*.spec.ts` in e2e/ | `e2e/guest-flow.spec.ts` |
| Config files | kebab-case or standard names | `next.config.ts`, `drizzle.config.ts` |

## Code Naming
| Construct | Convention | Examples |
|---|---|---|
| Components | PascalCase | `ProblemCard`, `InterestButton` |
| Props interfaces | `{ComponentName}Props` | `ProblemCardProps` |
| Functions/methods | camelCase | `getProblems`, `handleSubmit` |
| Variables | camelCase | `problemList`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_COMMENT_LENGTH` |
| Types/interfaces | PascalCase | `Problem`, `CommentEntity` |
| Enums | PascalCase, singular | `ValidationStatus` |
| Database tables | snake_case (plural) | `problems`, `solution_spaces` |
| Database columns | snake_case | `validation_status`, `created_at` |
| Zod schemas | camelCase + "Schema" | `createProblemSchema` |
| Route params | kebab-case | `solution-spaces/[id]` |
| URL query params | camelCase | `?domainFilter=AI/ML&sortBy=newest` |

## Import Aliases
| Alias | Maps To | Usage |
|---|---|---|
| `@/` | Project root | `import { db } from "@/lib/db"` |

## Forbidden Names
- No single-letter variables (except loop indices: `i`, `j`)
- No abbreviation-only names: use `getUser`, not `getUsr`
- No Hungarian notation: use `userName`, not `strUserName`
- No type prefixes: use `name`, not `sName`
- No `data`, `info`, `item` for nontrivial types
