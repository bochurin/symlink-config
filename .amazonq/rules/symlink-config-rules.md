# Symlink Config VSCode Extension - Development Rules

## Project Overview

VSCode extension for automated symlink management across project containers and workspaces. Built on proven CVHere symlink system with complete TypeScript translation.

**Complete Documentation**: `.docs/` folder contains comprehensive project documentation including architecture, decisions, and development progress.

## Critical Patterns (Always Enforce)

### Import Style
- **Direct imports with aliases**: `import { handleEvent as handleGitignoreEvent } from './managers/gitignore-file'`
- **NEVER namespace imports**: Avoid `import * as manager from './module'` (except vscode API)
- **VSCode API exception**: `import * as vscode from 'vscode'` is allowed

### Async/Await
- **Always async/await**: Never callbacks or raw promises
- **fs/promises only**: Never use synchronous fs methods (fs.readFileSync, fs.writeFileSync)
- **Parallel operations**: Use `Promise.all()` for independent operations

### Variable Declarations
- **const by default**: 99% of cases
- **let when needed**: Only for reassignment
- **NEVER var**: Eliminated throughout codebase

### Manager Pattern
All managers follow identical structure:
```
manager/
├── generate.ts        // Pure content generation
├── read.ts            // File/config reading
├── needs-regenerate.ts // Change detection (optional)
├── make.ts            // File writing/updating
├── handle-event.ts    // Event processing
├── init.ts            // Initialization
└── index.ts           // Public API exports
```

### Naming Conventions
- **Files/Folders**: kebab-case (`use-file-watcher.ts`, `gitignore-file/`)
- **Functions**: camelCase (`initializeExtension`, `createSymlink`)
- **Classes**: PascalCase (`TreeProvider`, `SymlinkTreeProvider`)
- **Constants**: SCREAMING_SNAKE_CASE (`FILE_NAMES`, `CONFIG_PARAMETERS`)
- **Types/Interfaces**: PascalCase (`WatcherConfig`, `TreeNode`)

### Cross-Platform
- **Path handling**: Always use Node.js `path` module
- **Line endings**: `\r\n` for Windows batch, `\n` for Unix shell
- **Script permissions**: 0o755 for Unix executable scripts
- **Platform detection**: `os.platform() === 'win32'` for Windows

## Key References

### Architecture & Decisions
- **Manager Architecture**: `.docs/development/decisions/manager-architecture-refactoring.md`
- **Hook System**: `.docs/development/decisions/hook-interface-improvements.md`
- **File Watchers**: `.docs/development/decisions/file-watcher-filter-system.md`
- **All Decisions**: `.docs/development/decisions/decisions.md`

### System Documentation
- **CVHere System**: `.docs/reference/cvhere-symlink-system.md` - Original proven system
- **Migration Context**: `.docs/project/migration-from-cvhere.md`
- **Source Code Map**: `.docs/reference/source-code-map.md` - Complete function inventory

### Development Process
- **Progress Log**: `.docs/development/progress-log.md` - Current status and phases
- **Chat History**: `.docs/reference/chat-backup/chat-history.md` - Development conversations

## Before Making Changes

1. **Check source map**: `.docs/reference/source-code-map.md` for existing functions/types
2. **Review decisions**: Check relevant decision docs for architectural patterns
3. **Follow manager pattern**: Use established generate/read/make/handle-event structure
4. **Test cross-platform**: Verify Windows and Unix compatibility

## After Significant Changes

1. **Update progress log**: Add entry to `.docs/development/progress-log.md`
2. **Document decisions**: Create decision doc in `.docs/development/decisions/` if architectural
3. **Update source map**: Reflect new functions/types in source-code-map.md

## Common Patterns

### Hook Pattern
```typescript
export function useFileWatcher(config: WatcherConfig): vscode.FileSystemWatcher {
  // Auto-detect events based on handler presence
  const watcher = vscode.workspace.createFileSystemWatcher(
    config.pattern,
    !config.onCreate,
    !config.onChange,
    !config.onDelete,
  )
  return watcher
}
```

### Array Normalization
```typescript
const handlers = Array.isArray(config.onChange) ? config.onChange : [config.onChange]
```

### Filter with Adapter Pattern
```typescript
filter: (uri, event) => isRootFile(uri)  // Adapter for signature compatibility
```

### Script Generation
```typescript
const lines = ['#!/bin/bash', 'echo "Starting..."', '']
for (const op of operations) {
  lines.push(`echo "Processing ${op.target}"`)
}
const content = lines.join('\n')
```

## Forbidden Patterns

- ❌ Namespace imports (except vscode API)
- ❌ Synchronous fs methods
- ❌ var keyword
- ❌ Callbacks or raw promises
- ❌ Modifying .gitignore outside SymLinks blocks
- ❌ Hardcoded paths without path module
