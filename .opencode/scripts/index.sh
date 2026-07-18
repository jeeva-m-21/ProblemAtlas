#!/bin/bash
# Repository Indexing Script
# Rebuilds all repository indexes: file summaries, symbols, and dependency graph
# Run this after significant code changes or when indexes become stale.

set -e

echo "=== ProblemAtlas Repository Indexer ==="
echo ""

# Step 1: Scan all source files
echo "[1/3] Scanning source files..."
SOURCE_FILES=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./drizzle/migrations/*" \
  | sort)

FILE_COUNT=$(echo "$SOURCE_FILES" | wc -l)
echo "  Found $FILE_COUNT TypeScript files"

# Step 2: Generate file summaries
echo "[2/3] Generating file summaries..."
mkdir -p .opencode/summaries/files

for file in $SOURCE_FILES; do
  # Create a hash-based filename for the summary
  HASH=$(echo "$file" | sha256sum | cut -d' ' -f1)
  SUMMARY_FILE=".opencode/summaries/files/${HASH}.md"

  # Extract summary data
  EXPORTS=$(grep -n "^export " "$file" 2>/dev/null | head -20 || true)
  IMPORTS=$(grep -n "^import " "$file" 2>/dev/null | head -20 || true)
  LINES=$(wc -l < "$file" 2>/dev/null || echo "0")

  cat > "$SUMMARY_FILE" << EOF
# File: $file
Lines: $LINES

## Exports
\`\`\`
$EXPORTS
\`\`\`

## Imports
\`\`\`
$IMPORTS
\`\`\`
EOF

  echo "  Summarized: $file ($LINES lines)"
done

# Step 3: Build symbol index
echo "[3/3] Building symbol index..."
echo "{" > .opencode/summaries/symbols.json
echo '  "version": "1.0",' >> .opencode/summaries/symbols.json
echo '  "last_indexed": "'$(date -Iseconds)'",' >> .opencode/summaries/symbols.json
echo '  "symbols": {' >> .opencode/summaries/symbols.json

FIRST=true
for file in $SOURCE_FILES; do
  # Extract exports with their types
  while IFS=: read -r line_num content; do
    if [ -n "$content" ]; then
      SYMBOL=$(echo "$content" | sed -n 's/.*export .* \(function\|class\|const\|let\|var\|type\|interface\|enum\) \([a-zA-Z0-9_]*\).*/\2/p')
      if [ -n "$SYMBOL" ]; then
        if [ "$FIRST" = false ]; then
          echo "    ," >> .opencode/summaries/symbols.json
        fi
        FIRST=false
        TYPE=$(echo "$content" | sed -n 's/.*export \(function\|class\|const\|let\|var\|type\|interface\|enum\).*/\1/p')
        echo -n "    \"$SYMBOL\": {\"file\": \"$file\", \"line\": $line_num, \"type\": \"$TYPE\"}" >> .opencode/summaries/symbols.json
      fi
    fi
  done < <(grep -n "^export " "$file" 2>/dev/null)
done

echo "" >> .opencode/summaries/symbols.json
echo "  }" >> .opencode/summaries/symbols.json
echo "}" >> .opencode/summaries/symbols.json

echo ""
echo "=== Indexing Complete ==="
echo "Files: $FILE_COUNT"
echo "Summaries: .opencode/summaries/files/"
echo "Symbols: .opencode/summaries/symbols.json"
