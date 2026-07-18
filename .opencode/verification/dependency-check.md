# Dependency Check Verification

Run before every code review. Check for architecture violations.

## Check 1: lib/ layer isolation
```bash
# Ensure lib/ never imports from features/ or app/
rg "from ['\"]@/features/" lib/ && echo "VIOLATION: lib imports features" || echo "OK"
rg "from ['\"]@/app/" lib/ && echo "VIOLATION: lib imports app" || echo "OK"
```

## Check 2: Client component service isolation
```bash
# Ensure client components never import from features/*/services.ts
rg "'use client'" -l | xargs rg "from ['\"]@/features/.*/services" && echo "VIOLATION: client imports services" || echo "OK"
```

## Check 3: Global state library
```bash
# Ensure no global state library imports
rg "from ['\"]zustand" -l && echo "VIOLATION: zustand found" || echo "OK"
rg "from ['\"]jotai" -l && echo "VIOLATION: jotai found" || echo "OK"
rg "from ['\"]@reduxjs" -l && echo "VIOLATION: redux found" || echo "OK"
```

## Check 4: Soft delete coverage
```bash
# Check that all queries on soft-delete tables include deleted_at filter
# (Manual review recommended — complex to grep for all patterns)
echo "Manual check required: verify WHERE deleted_at IS NULL on problems, comments, solution_spaces queries"
```

## Check 5: Auth guard coverage
```bash
# Check that all POST/PATCH/DELETE route handlers have auth checks
rg "from ['\"]@clerk/nextjs/server" app/api/ -l | sort
```
