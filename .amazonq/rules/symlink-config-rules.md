# Symlink Config VSCode Extension - Development Rules

## Project Overview

VSCode extension for automated symlink management across project containers and workspaces. Built on proven CVHere symlink system with complete TypeScript translation.

**Complete Documentation**: See pinned README.md for documentation structure.

## User Interaction Rules (CRITICAL)

- **NEVER proceed with code changes without explicit user approval**
- **NEVER make assumptions about what user wants**
- **ALWAYS ask for confirmation before modifying code**
- **ONLY modify documentation when using @doc or @map prompts**
- **ONLY explain problems when using @discover prompt, do not fix**

## Critical Patterns (Always Enforce)

### Import Style
- **Direct imports with aliases**: `import { handleEvent as handleGitignoreEvent } from './managers/gitignore-file'`
- **NEVER namespace imports**: Avoid `import * as manager from './module'` (except vscode API)
- **VSCode API exception**: `import * as vscode from 'vscode'` is allowed

### Async/Await
- **Always async/await**: Never callbacks or raw promises
- **Use file-ops abstractions**: Import from `shared/file-ops/` (readFile, writeFile, etc.) instead of using `fs` directly
- **Parallel operations**: Use `Promise.all()` for independent operations
- **Static imports only**: No dynamic `await import()` or `require()`

### Variable Declarations
- **const by default**: 99% of cases
- **let when needed**: Only for reassignment
- **NEVER var**: Eliminated throughout codebase

### Manager Pattern
All managers follow identical structure:
```
manager/
├── generate.ts        // Pure content generation (synchronous)
├── read.ts            // File/config reading
├── needs-regenerate.ts // Change detection (required, logs events/results)
├── make.ts            // File writing/updating (logs when updated)
├── handle-event.ts    // Event processing
├── init.ts            // Initialization
└── index.ts           // Public API exports
```

### Hook Pattern
All hooks follow folder structure:
```
hook/
├── types.ts           // Type definitions
├── hook-name.ts       // Main implementation
├── execute-handlers.ts // Handler execution logic (if needed)
└── index.ts           // Public API exports
```

### Module Boundaries (ESLint Enforced)
- **Import through index.ts only**: managers/*, commands/*, hooks/*, shared/*, views/*, watchers/*, extension/*
- **No direct file imports**: Use `from './managers/gitignore-file'` not `from './managers/gitignore-file/generate'`
- **Subfolders included**: hooks/use-file-watcher/* must import through hooks/use-file-watcher/index

### Naming Conventions
- **Files/Folders**: kebab-case (`use-file-watcher/`, `gitignore-file/`)
- **Functions**: camelCase (`initializeExtension`, `createSymlink`)
- **Classes**: PascalCase (`TreeProvider`, `SymlinkTreeProvider`)
- **Constants**: SCREAMING_SNAKE_CASE (`FILE_NAMES`, `SETTINGS`)
- **Types/Interfaces**: PascalCase (`WatcherConfig`, `TreeNode`)

### Cross-Platform
- **Path handling**: Always use Node.js `path` module
- **Line endings**: `\r\n` for Windows batch, `\n` for Unix shell
- **Script permissions**: 0o755 for Unix executable scripts
- **Platform detection**: `os.platform() === 'win32'` for Windows

## Key References

See pinned README.md for complete documentation references.

## Before Making Changes

1. **Check source map** for existing functions/types
2. **Review decisions** for architectural patterns
3. **Follow manager pattern**: Use established generate/read/make/handle-event structure
4. **Test cross-platform**: Verify Windows and Unix compatibility

## Common Patterns

### Hook Pattern (Current)
```typescript
// use-file-watcher/use-file-watcher.ts
export function useFileWatcher(config: WatcherConfig): vscode.FileSystemWatcher {
  const createHandlers: Handler[] = []
  const changeHandlers: Handler[] = []
  const deleteHandlers: Handler[] = []
  
  // Collect handlers by event type
  const eventConfigs = Array.isArray(config.events) ? config.events : [config.events]
  for (const eventConfig of eventConfigs) {
    const events = Array.isArray(eventConfig.on) ? eventConfig.on : [eventConfig.on]
    const handlers = Array.isArray(eventConfig.handlers) ? eventConfig.handlers : [eventConfig.handlers]
    for (const event of events) {
      if (event === FileEventType.Created) createHandlers.push(...handlers)
      if (event === FileEventType.Modified) changeHandlers.push(...handlers)
      if (event === FileEventType.Deleted) deleteHandlers.push(...handlers)
    }
  }
  
  const watcher = vscode.workspace.createFileSystemWatcher(
    config.pattern,
    createHandlers.length === 0,
    changeHandlers.length === 0,
    deleteHandlers.length === 0,
  )
  
  const executeHandlers = createExecuteHandlers(config.filters, config.debounce)
  // ... register handlers
  return watcher
}
```

### Array Normalization
```typescript
const handlers = Array.isArray(config.onChange) ? config.onChange : [config.onChange]
```

### Handler Execution Factory
```typescript
// use-file-watcher/execute-handlers.ts
export function createExecuteHandlers(
  filters: Filter | Filter[] | undefined,
  debounce: number | undefined,
) {
  let debounceTimeout: NodeJS.Timeout | undefined
  let accumulatedEvents: FileEvent[] = []
  
  return async function executeHandlers(
    handlers: Handler[],
    uri: vscode.Uri,
    eventType: FileEventType,
  ) {
    // Filter logic
    if (filters) {
      const filterArray = Array.isArray(filters) ? filters : [filters]
      for (const filter of filterArray) {
        if (!await filter({ uri, event: eventType })) return
      }
    }
    
    // Debounce or immediate execution
    if (debounce) {
      accumulatedEvents.push({ uri, event: eventType })
      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        const events = [...accumulatedEvents]
        accumulatedEvents = []
        handlers.forEach((handler) => handler(events))
      }, debounce)
    } else {
      handlers.forEach((handler) => handler([{ uri, event: eventType }]))
    }
  }
}
```

### Simple Handler Execution
```typescript
// use-settings-watcher/execute-handlers.ts
export function executeHandlers(
  handlers: Handler | Handler[],
  event: SettingsEvent,
): void {
  const handlerArray = Array.isArray(handlers) ? handlers : [handlers]
  handlerArray.forEach((handler) => handler(event))
}
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
- ❌ Direct fs usage (use shared/file-ops abstractions)
- ❌ Direct vscode imports outside shared/vscode, extension, state, log, views
- ❌ Direct path imports outside shared/file-ops
- ❌ Direct os imports outside shared/file-ops
- ❌ var keyword (use const/let)
- ❌ Callbacks or raw promises (use async/await)
- ❌ Direct file imports bypassing index.ts (ESLint enforced)
- ❌ Dynamic imports (await import() or require())
- ❌ Hardcoded paths without path module

## AI Assistant Rules (CRITICAL)

### Import Restrictions
- **NEVER import vscode directly** in commands/, managers/, watchers/, shared/ (except shared/vscode/)
- **NEVER import path directly** outside of shared/file-ops/
- **NEVER import fs/fs/promises directly** outside of shared/file-ops/
- **NEVER import os directly** outside of shared/file-ops/
- **ALWAYS use shared abstractions** from @shared/vscode and @shared/file-ops

### When Adding New Functionality
1. **Check if shared abstraction exists** before importing APIs directly
2. **Create new shared abstraction** if needed before using in commands/managers
3. **Use existing patterns** - follow manager/hook/watcher folder structures
4. **Follow ESLint rules** - run lint to verify compliance

### Code Modification Rules
1. **Replace direct API usage** with shared abstractions when found
2. **Create missing abstractions** in shared/ before using in other modules
3. **Maintain architectural boundaries** - only shared/ can import core APIs
4. **Test after changes** - ensure functionality is preserved

### Abstraction Usage Examples
```typescript
// ❌ WRONG - Direct vscode import in commands
import * as vscode from 'vscode'
vscode.window.showInformationMessage('Hello')

// ✅ CORRECT - Use shared abstraction
import { log } from '@log'
log('Hello', true) // withInfo = true shows user message

// ❌ WRONG - Direct path import
import * as path from 'path'
path.join(a, b)

// ✅ CORRECT - Use shared file-ops
import { fullPath } from '@shared/file-ops'
fullPath(workspaceRoot, relativePath)

// ❌ WRONG - Direct fs import
import * as fs from 'fs'
fs.readFileSync(path)

// ✅ CORRECT - Use shared file-ops
import { readFile } from '@shared/file-ops'
readFile(workspaceRoot, fileName)
```

## Current Architecture Notes

### Logging System
- Centralized in `shared/state.ts` with `log()`, `clearLogs()`, `showLogs()`
- Auto-rotation based on `maxLogEntries` setting (default 1000)
- Timestamp format: `[HH:MM:SS]`
- Watchers log detailed event data (paths, types, old→new values)
- Managers log when files are actually updated
- needsRegenerate functions log events and results

### State Management
- Centralized in `shared/state.ts`
- Workspace root, name, config, tree provider
- Output channel with logging functions
- Watcher registry with name-based disposal
- Processing queue for serializing async operations

### Watcher System
- Self-registering via `registerWatcher(name, watcher)`
- Name-based disposal: `disposeWatchers()` or `disposeWatchers('name1', 'name2')`
- Conditional creation based on settings
- All use `queue()` for operation serialization
