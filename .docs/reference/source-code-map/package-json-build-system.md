# Package.json Build System

## Overview

Elegant import-based package.json build system that decomposes the package.json into maintainable parts using import tags.

## Architecture

### Import Tag System
- **Format**: `"import:filename.json"` strings in template files
- **Processing**: Recursive replacement with actual file content
- **Scope**: Works at any nesting level (objects, arrays, primitives)
- **Execution**: Node.js-based processing within bash script wrapper

### Directory Structure
```
package/
├── base.json                           # Main template with import tags
├── scripts.json                        # NPM scripts
├── devDependencies.json                # Development dependencies
├── contributes-configuration.json      # VSCode configuration schema
├── contributes-commands.json           # Command definitions
├── contributes-menus-commandPalette.json
├── contributes-menus-explorerContext.json
├── contributes-menus-viewTitle.json
├── contributes-menus-viewItemContext.json
└── contributes-views.json              # Tree view definitions
```

## Build System

### Webpack Plugin Integration
**File**: `scripts/webpack/package-json-builder.plugin.js`
**Purpose**: Webpack plugin that automatically builds package.json before compilation

**Implementation**:
```bash
#!/bin/bash
echo "Building package.json from base with imports"

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

const baseContent = JSON.parse(fs.readFileSync('package_json/base.json', 'utf8'));
const result = processImports(baseContent, 'package_json');
fs.writeFileSync('package.json', JSON.stringify(result, null, 2) + '\n');
"

echo "✅ Generated package.json"
```

## Integration

### NPM Scripts Integration
- **`build`**: `webpack` (plugin handles package.json automatically)
- **`watch`**: `webpack --watch` (plugin handles package.json automatically)
- **`package`**: `webpack --mode production` (plugin handles package.json automatically)
- **`test`**: `npm run compile-tests && npm run build && npm run lint && vscode-test`
- **`build:package`**: `node scripts/webpack/package-json-builder.plugin.js` (manual execution)

### Development Workflow
1. **F5 Debugging**: Automatically builds package.json via watch script
2. **Manual Build**: `npm run build-package` for standalone execution
3. **Production**: Integrated with package script for extension publishing
4. **Testing**: Ensures package.json is current before test execution

## Template Structure

### Base Template (`base.json`)
```json
{
  "name": "@bochurin/symlink-config",
  "displayName": "symlink-config",
  "description": "Automated symlink management...",
  "version": "0.0.87",
  "engines": { "vscode": "^1.104.0" },
  "categories": ["Other"],
  "activationEvents": ["onStartupFinished"],
  "main": "./dist/extension.js",
  "scripts": "import:scripts.json",
  "devDependencies": "import:devDependencies.json",
  "contributes": {
    "configuration": "import:contributes-configuration.json",
    "commands": "import:contributes-commands.json",
    "menus": {
      "commandPalette": "import:contributes-menus-commandPalette.json",
      "explorer/context": "import:contributes-menus-explorerContext.json",
      "view/title": "import:contributes-menus-viewTitle.json",
      "view/item/context": "import:contributes-menus-viewItemContext.json"
    },
    "views": "import:contributes-views.json"
  }
}
```

### Import Files
Each import file contains only the content for that section:

**`scripts.json`**:
```json
{
  "vscode:prepublish": "npm run package",
  "build-package": "bash scripts/build-package.sh",
  "build": "npm run build-package && webpack",
  "watch": "npm run build-package && webpack --watch",
  ...
}
```

**`contributes-commands.json`**:
```json
[
  {
    "command": "symlink-config.applyConfiguration",
    "title": "Apply configuration",
    "category": "symlink-config",
    "icon": "$(play)"
  },
  ...
]
```

## Benefits

### Maintainability
- **Modular structure**: Each section in separate file
- **Clear organization**: Logical grouping of related configuration
- **Easy editing**: Smaller files are easier to navigate and modify
- **Version control**: Better diff tracking for specific sections

### Build Integration
- **Automatic generation**: No manual package.json editing required
- **Development workflow**: Seamless integration with F5 debugging
- **Production ready**: Integrated with publishing pipeline
- **Cross-platform**: Bash script works on Windows, macOS, and Linux

### Flexibility
- **Nested imports**: Support for complex object structures
- **Array handling**: Proper concatenation and processing
- **Type preservation**: Maintains JSON data types correctly
- **Recursive processing**: Handles deeply nested import tags

## Usage Examples

### Adding New Command
1. Edit `contributes-commands.json` to add command definition
2. Edit appropriate menu file to add menu entries
3. Run `npm run build-package` or any build command
4. Generated package.json includes new command automatically

### Modifying Scripts
1. Edit `scripts.json` with new npm scripts
2. Build system automatically includes changes
3. No need to manually edit main package.json

### Development Workflow
```bash
# Manual build
npm run build-package

# Development with auto-rebuild
npm run watch  # Builds package.json first

# Testing with current package.json
npm test  # Builds package.json first

# Production build
npm run package  # Builds package.json first
```

This system provides elegant maintainability while ensuring the package.json is always current and consistent across all development and production workflows.