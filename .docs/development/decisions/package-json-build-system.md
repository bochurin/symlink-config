# Decision: Package.json Build System with Import Tags

**Date**: 27.10.2025  
**Status**: Implemented  
**Context**: Phase 1.61 - Elegant Package.json Build System

## Problem

The package.json file was becoming large and difficult to maintain with multiple sections (scripts, devDependencies, contributes with commands, menus, views, configuration). Manual editing was error-prone and version control diffs were hard to review when multiple sections changed simultaneously.

## Decision

Implement an elegant import-based build system that decomposes package.json into maintainable parts using import tags.

### Architecture

**Import Tag System**:
- Use `"import:filename.json"` strings as placeholders in template files
- Recursive processing replaces import tags with actual file content
- Support for nested imports at any level (objects, arrays, primitives)
- Node.js-based processing for reliable JSON handling

**Directory Structure**:
```
package_json/
├── base.json                           # Main template with import tags
├── scripts.json                        # NPM scripts
├── devDependencies.json                # Development dependencies
├── contributes-configuration.json      # VSCode configuration schema
├── contributes-commands.json           # Command definitions
├── contributes-menus-*.json            # Menu contributions by context
└── contributes-views.json              # Tree view definitions
```

**Build Script**:
- `scripts/build-package.sh` - Bash wrapper with embedded Node.js
- Processes `base.json` template and generates final `package.json`
- Integrated with npm scripts using `&&` chaining
- Automatic execution before build, watch, package, test operations

## Alternatives Considered

1. **Manual package.json editing** - Rejected due to maintainability issues
2. **JSON merge tools** - Rejected due to complexity and ordering issues  
3. **Separate package files** - Rejected due to VSCode extension requirements
4. **Template engines** - Rejected due to over-engineering

## Benefits

### Maintainability
- **Modular structure**: Each section in separate, focused file
- **Clear organization**: Logical grouping of related configuration
- **Easy editing**: Smaller files are easier to navigate and modify
- **Better diffs**: Version control shows specific section changes

### Development Workflow
- **Automatic generation**: No manual package.json editing required
- **F5 debugging**: Seamless integration with VSCode debugging workflow
- **Build integration**: Works with all npm scripts (build, watch, package, test)
- **Cross-platform**: Bash script works on Windows, macOS, and Linux

### Flexibility
- **Nested imports**: Support for complex object structures like contributes.menus
- **Array handling**: Proper processing of command and menu arrays
- **Type preservation**: Maintains JSON data types correctly
- **Recursive processing**: Handles deeply nested import tags

## Implementation Details

### Base Template Structure
```json
{
  "name": "@bochurin/symlink-config",
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

### NPM Scripts Integration
- **`build-package`**: Standalone command for manual execution
- **`build`**: `npm run build-package && webpack`
- **`watch`**: `npm run build-package && webpack --watch`
- **`package`**: `npm run build-package && webpack --mode production`
- **`test`**: `npm run build-package && npm run compile-tests && npm run build && npm run lint && vscode-test`

### Processing Algorithm
```javascript
function processImports(obj, basePath) {
  if (typeof obj === 'string' && obj.startsWith('import:')) {
    const filename = obj.substring(7);
    const content = fs.readFileSync(path.join(basePath, filename), 'utf8');
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
```

## Trade-offs

### Advantages
- **Maintainable**: Easy to edit specific sections
- **Organized**: Clear separation of concerns
- **Automated**: No manual package.json editing
- **Flexible**: Supports complex nested structures
- **Integrated**: Works seamlessly with development workflow

### Disadvantages
- **Build step**: Requires running build script before operations
- **Complexity**: Additional layer of abstraction
- **Dependencies**: Requires Node.js and bash for processing

## Validation

- **Functionality**: All 81 tests pass with generated package.json
- **Build system**: Successful webpack compilation
- **F5 debugging**: Works correctly with VSCode extension host
- **Cross-platform**: Tested on Windows with bash support
- **Maintainability**: Easy to add new commands, menus, and configuration

## Future Considerations

- **Watch mode**: Could add file watching to auto-rebuild on changes
- **Validation**: Could add JSON schema validation for import files
- **IDE support**: Could add VSCode extension for import tag highlighting
- **Performance**: Current implementation is fast enough for development needs

This decision provides an elegant solution for maintaining a complex package.json while preserving all functionality and improving the development experience.