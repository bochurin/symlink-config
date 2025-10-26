#!/bin/bash

# Build package.json from base.json with import tags
# Replaces "import:filename" values with content from filename

PACKAGE_DIR="package_json"
BASE_FILE="base.json"
OUTPUT_FILE="package.json"

if [ ! -f "$PACKAGE_DIR/$BASE_FILE" ]; then
    echo "Base file not found: $PACKAGE_DIR/$BASE_FILE"
    exit 1
fi

echo "Building package.json from base with imports"

# Use Node.js for JSON processing (simpler than complex jq)
node -e "
const fs = require('fs');
const path = require('path');

function processImports(obj, basePath) {
  if (typeof obj === 'string' && obj.startsWith('import:')) {
    const filename = obj.substring(7);
    const filePath = path.join(basePath, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => processImports(item, basePath));
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      result[key] = processImports(obj[key], basePath);
    }
    return result;
  }
  return obj;
}

const baseContent = JSON.parse(fs.readFileSync('$PACKAGE_DIR/$BASE_FILE', 'utf8'));
const result = processImports(baseContent, '$PACKAGE_DIR');
fs.writeFileSync('$OUTPUT_FILE', JSON.stringify(result, null, 2) + '\n');
"

echo "✅ Generated $OUTPUT_FILE"