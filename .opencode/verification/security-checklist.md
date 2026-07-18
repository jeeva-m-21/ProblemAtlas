# Security Verification Checklist

Run before commit when auth or data access code changes.

## Automated Checks
- [ ] No secrets in committed files
```bash
rg "sk_test_" --no-ignore # Should not find anything
rg "SECRET=" --no-ignore # Should not find anything
```
- [ ] No .env files committed (except .env.example)
```bash
git diff --cached --name-only | grep ".env" | grep -v ".env.example"
```
- [ ] No debugger statements
```bash
rg "debugger" app/ lib/ features/
```

## Manual Checks
- [ ] All mutation endpoints have auth guards
- [ ] Admin endpoints call requireAdmin() as first operation
- [ ] Owner mutations call assertOwnership()
- [ ] All write endpoints validate with Zod before DB operations
- [ ] All SQL queries use parameterized statements
- [ ] No string concatenation building SQL
- [ ] Soft delete filtering present on all relevant queries
- [ ] No sensitive data in client component code
- [ ] No NEXT_PUBLIC_ prefix on actual secrets
- [ ] Response doesn't leak internal error details

## New Dependencies
- [ ] Package is from trusted source
- [ ] Package is actively maintained
- [ ] Package doesn't introduce known vulnerabilities
