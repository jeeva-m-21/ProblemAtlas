# Quality Gates Checklist
<!-- applied before every commit -->

## Mandatory Gates (BLOCK commit if failed)

### Build
- [ ] `npm run build` exits with code 0
- [ ] No TypeScript errors
- [ ] No build warnings about page size > threshold

### Lint
- [ ] `npm run lint` exits with code 0
- [ ] No ESLint errors
- [ ] Warnings reviewed and addressed

### Architecture
- [ ] `lib/` imports nothing from `features/` or `app/`
- [ ] Client components never import from `features/*/services.ts`
- [ ] Route handlers import from `features/*/services.ts` and `lib/` only
- [ ] Feature modules don't cross-import implementation details
- [ ] Every `"use client"` is justified

### Data Layer
- [ ] All write endpoints validate with Zod BEFORE DB operations
- [ ] All soft-delete table queries include `WHERE deleted_at IS NULL`
- [ ] Response envelope: `{ data }` or `{ error: { code, message } }`
- [ ] Validation errors return 422 with field-level messages

### Auth
- [ ] All mutation endpoints have auth guards
- [ ] Admin endpoints call `requireAdmin()` first
- [ ] Owner mutations call `assertOwnership()`
- [ ] Profile gate enforced for solution space creation

### Security
- [ ] No secrets in committed files (check: `sk_test_`, `SECRET=`, `password=`)
- [ ] No `.env` files (except `.env.example`)
- [ ] No debugger statements (`debugger`, `console.log` with secrets)
- [ ] All SQL parameterized (no string concatenation)

### Naming
- [ ] Components: PascalCase
- [ ] Functions: camelCase
- [ ] API routes: kebab-case directories
- [ ] Test files: `*.test.ts`

## Warning Gates (Fix before next release)

### Code Quality
- [ ] No function exceeds 50 lines
- [ ] No file exceeds 300 lines (except predefined exceptions)
- [ ] No copy-pasted blocks >10 lines
- [ ] No commented-out code
- [ ] No unused imports
- [ ] JSDoc on exported functions

### TypeScript
- [ ] No `any` types
- [ ] Explicit return types on exported functions
- [ ] Correct Drizzle type usage (InferSelectModel / InferInsertModel)
- [ ] Zod v4 syntax correct

### Performance
- [ ] No `useEffect` for data fetching
- [ ] `next/image` with `sizes` for all images
- [ ] No large deps in client bundles
- [ ] Server Components used where possible

### Testing
- [ ] Tests pass (if test suite exists)
- [ ] Coverage maintained (if coverage configured)

## Suggestion Gates (Nice to have)

- [ ] `generateMetadata` on all content pages
- [ ] `error.tsx` on all dynamic route segments
- [ ] Loading states (`loading.tsx`) on data-dependent routes
- [ ] Accessible attributes (aria-labels, alt text)
- [ ] Toast notifications for mutation errors
