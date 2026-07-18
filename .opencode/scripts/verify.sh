#!/bin/bash
# Quality Verification Script
# Runs all automated quality gates against the current state
# Exits non-zero if any gate fails.

set -e

echo "=== ProblemAtlas Quality Verification ==="
echo ""

HAS_ERROR=0

# Gate 1: Build
echo "[1/4] Running build..."
if npm run build > /dev/null 2>&1; then
  echo "  PASS: Build succeeded"
else
  echo "  FAIL: Build failed"
  HAS_ERROR=1
fi

# Gate 2: Lint
echo "[2/4] Running lint..."
if npm run lint > /dev/null 2>&1; then
  echo "  PASS: Lint succeeded"
else
  echo "  FAIL: Lint failed"
  HAS_ERROR=1
fi

# Gate 3: Architecture — lib/ isolation
echo "[3/4] Checking architecture rules..."
if grep -r "from ['\"].*features/" lib/ --include="*.ts" --include="*.tsx" -q 2>/dev/null; then
  echo "  FAIL: lib/ imports from features/"
  grep -rn "from ['\"].*features/" lib/ --include="*.ts" --include="*.tsx" 2>/dev/null
  HAS_ERROR=1
else
  echo "  PASS: lib/ does not import from features/"
fi

# Check for global state libraries
if grep -r "from ['\"]zustand" --include="*.ts" --include="*.tsx" -q 2>/dev/null; then
  echo "  FAIL: zustand import found"
  HAS_ERROR=1
fi
if grep -r "from ['\"]@reduxjs" --include="*.ts" --include="*.tsx" -q 2>/dev/null; then
  echo "  FAIL: Redux import found"
  HAS_ERROR=1
fi

# Gate 4: Check for .env files in git staged
echo "[4/4] Checking staged files..."
if git diff --cached --name-only 2>/dev/null | grep -E "^\.env$|\.env.local$" -q; then
  echo "  FAIL: .env files staged for commit"
  HAS_ERROR=1
else
  echo "  PASS: No .env files staged"
fi

echo ""
if [ $HAS_ERROR -eq 0 ]; then
  echo "=== All Gates Passed ==="
else
  echo "=== Some Gates Failed ==="
  exit 1
fi
