# Pre-Commit Quality Checklist

Run before every git commit.

## Automated Gates
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] No TypeScript errors

## Review Gates
- [ ] Architecture rules respected (see dependency-check.md)
- [ ] Module dependency chain intact
- [ ] No `"use client"` without justification
- [ ] Response envelope format correct
- [ ] Auth guards on write endpoints

## Code Quality
- [ ] No `any` types (except justified)
- [ ] Explicit return types on exported functions
- [ ] JSDoc on exported functions
- [ ] No commented-out code
- [ ] No unused imports

## Data Layer
- [ ] Zod validation on all write inputs
- [ ] Soft delete filtering present
- [ ] Parameterized SQL for all queries

## Testing
- [ ] New tests added for new code
- [ ] All existing tests still pass
- [ ] Coverage maintained

## Git Hygiene
- [ ] No secrets in diff
- [ ] No node_modules in diff
- [ ] No .env files in diff
- [ ] No debug logs or console.log with data
- [ ] Conventional commit message ready
