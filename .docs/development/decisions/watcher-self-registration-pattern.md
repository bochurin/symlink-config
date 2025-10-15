# Decision: Watcher Self-Registration Pattern

**Date**: 14.10.2025  
**Status**: Implemented  
**Context**: Phase 1.36 - Watcher Architecture Refactoring

## Problem

The previous watcher architecture had several issues:

1. **Monolithic Structure**: All watchers defined in single `set-watchers.ts` file (150+ lines)
2. **Return and Collect Pattern**: Each watcher returned disposable, caller collected into array
3. **Parameter Passing**: TreeProvider passed through initialization chain
4. **Queue Duplication**: Processing queue defined locally in set-watchers
5. **Tight Coupling**: Watchers tightly coupled to initialization logic

## Decision

Implement self-registering watcher pattern with centralized state management:

### 1. Decompose into Separate Files

Create `src/watchers/` folder with individual watcher files:
- `symlink-settings-watcher.ts` - Symlink-config section settings changes
- `files-settings-watcher.ts` - Files section settings changes (conditional)
- `gitignore-watcher.ts` - .gitignore file changes
- `symlink-config-watcher.ts` - symlink-config.json changes
- `next-config-watcher.ts` - next.symlink-config.json changes
- `current-config-watcher.ts` - current.symlink-config.json changes
- `symlinks-watcher.ts` - Symlink file changes with 500ms debounce
- `index.ts` - Public API exports

### 2. Self-Registration Pattern

Each watcher registers itself in centralized state:

```typescript
// Before: Return and collect
export function setWatchers(): vscode.Disposable[] {
  const watchers: vscode.Disposable[] = []
  
  const configWatcher = useSettingsWatcher(...)
  watchers.push(configWatcher)
  
  return watchers
}

// After: Self-registration (v0.0.49+)
export function symlinkSettingsWatcher(): void {
  const watcher = useSettingsWatcher(...)
  registerWatcher(WATCHERS.SYMLINK_SETTINGS, watcher)
}

// Current: Name-based registration (v0.0.49+)
registerWatcher(name: string, watcher: vscode.Disposable)
```

### 3. Centralized State Management (Updated: v0.0.49)

Move watchers Map and queue to `shared/state.ts`:

```typescript
// State module - name-based registration
const watchers = new Map<string, vscode.Disposable>()
let processingQueue: Promise<void> = Promise.resolve()

export function registerWatcher(name: string, watcher: vscode.Disposable): void {
  // Dispose existing watcher with same name
  if (watchers.has(name)) {
    watchers.get(name)?.dispose()
  }
  watchers.set(name, watcher)
}

export function disposeWatchers(...names: string[]): void {
  if (names.length === 0) {
    // Dispose all
    watchers.forEach((w) => w.dispose())
    watchers.clear()
  } else {
    // Dispose specific watchers
    names.forEach((name) => {
      watchers.get(name)?.dispose()
      watchers.delete(name)
    })
  }
}

export function queue(fn: () => Promise<void>): Promise<void> {
  processingQueue = processingQueue.then(fn).catch(console.error)
  return processingQueue
}
```

### 4. Simplified Initialization

```typescript
// Before: Return and collect
const watchers = setWatchers()
const dispose = () => watchers.forEach((w) => w.dispose())

// After: Self-registration with makeWatchers (v0.0.49+)
makeWatchers()  // Conditionally creates watchers based on settings
const dispose = disposeWatchers  // From state
```

## Implementation

### Watcher Structure

Each watcher file follows pattern:

```typescript
import { useFileWatcher, FileEventType } from '../hooks/use-file-watcher'
import { registerWatcher, queue } from '../shared/state'
import { WATCHERS } from '../shared/constants'

export function gitignoreWatcher(): void {
  const watcher = useFileWatcher({
    pattern: '**/.gitignore',
    filters: ({ uri }) => isRootFile(uri),
    events: {
      on: [FileEventType.Created, FileEventType.Modified, FileEventType.Deleted],
      handlers: (events) => {
        queue(() => handleGitignoreEvent())
      },
    },
  })
  
  registerWatcher(WATCHERS.GITIGNORE, watcher)
}
```

### Orchestration

```typescript
// src/extension/make-watchers.ts (v0.0.49+)
import { symlinkSettingsWatcher, filesSettingsWatcher, gitignoreWatcher } from '../watchers'
import { readSymlinkSettings } from '../managers/symlink-settings'
import { SETTINGS, WATCHERS } from '../shared/constants'

export function makeWatchers(): void {
  const watchWorkspace = readSymlinkSettings(SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE)
  const gitignoreServiceFiles = readSymlinkSettings(SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES)
  const hideServiceFiles = readSymlinkSettings(SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES)
  const hideSymlinkConfigs = readSymlinkSettings(SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS)
  
  // Always create
  symlinkSettingsWatcher()
  
  // Conditional creation
  if (hideServiceFiles || hideSymlinkConfigs) {
    filesSettingsWatcher()
  }
  
  if (gitignoreServiceFiles) {
    gitignoreWatcher()
  }
  
  if (watchWorkspace) {
    nextConfigWatcher()
    currentConfigWatcher()
    symlinkConfigsWatcher()
    symlinksWatcher()
  } else {
    disposeWatchers(WATCHERS.NEXT_CONFIG, WATCHERS.CURRENT_CONFIG, WATCHERS.SYMLINK_CONFIGS, WATCHERS.SYMLINKS)
  }
}
```

## Benefits

### Code Organization
- **Modular Structure**: Each watcher in separate file with single responsibility
- **Clear Boundaries**: Explicit module boundaries and dependencies
- **Better Navigation**: Easy to find and modify specific watcher logic

### Reduced Coupling
- **No Return Values**: Watchers don't need to return disposables
- **No Parameter Passing**: TreeProvider accessed from state, not passed through chain
- **Independent Modules**: Each watcher can be developed/tested independently

### Centralized State
- **Global Queue**: Processing queue accessible from any watcher
- **Unified Disposal**: Single disposeWatchers() function handles all cleanup
- **State Management**: All extension state in shared/state.ts

### Maintainability
- **Easy to Add**: New watchers just create function and call in run()
- **Easy to Remove**: Delete file and remove from run()
- **Easy to Test**: Each watcher can be unit tested independently

## Trade-offs

### Advantages
- ✅ Cleaner code organization with focused modules
- ✅ Reduced coupling between components
- ✅ Easier to add/remove watchers
- ✅ Better testability with isolated modules
- ✅ Centralized state management

### Disadvantages
- ⚠️ More files to manage (7 watcher files vs 1)
- ⚠️ Implicit registration vs explicit return
- ⚠️ Global state dependency

## Alternatives Considered

### 1. Keep Monolithic Structure
- **Rejected**: File too large, hard to navigate
- **Issue**: All watchers coupled in single file

### 2. Return and Collect Pattern
- **Previous approach**: Each watcher returns disposable
- **Issue**: Requires collecting and managing array
- **Issue**: TreeProvider passed through initialization chain

### 3. Factory Pattern
- **Considered**: Factory function creates all watchers
- **Rejected**: Still requires collecting disposables
- **Issue**: Doesn't solve parameter passing problem

## Migration Path

### Phase 1: Create Watcher Files
1. Create `src/watchers/` folder
2. Extract each watcher to separate file
3. Implement self-registration in each

### Phase 2: Update State Module
1. Add `watchers` array to state
2. Add `registerWatcher()` function
3. Add `disposeWatchers()` function
4. Move `queue()` from set-watchers to state

### Phase 3: Update Initialization
1. Replace `setWatchers()` call with `run()`
2. Use `disposeWatchers` from state
3. Remove old set-watchers.ts file

## Related Decisions

- **Manager Architecture**: Similar decomposition pattern applied to managers
- **State Management**: Centralized state in shared/state.ts
- **Hook System**: Watchers use useFileWatcher and useConfigWatcher hooks

## Implemented Enhancements (v0.0.49+)

- ✅ **Name-Based Registration**: Watchers registered with string names from WATCHERS constant
- ✅ **Selective Disposal**: disposeWatchers() can dispose all or specific watchers by name
- ✅ **Conditional Watchers**: makeWatchers() conditionally creates/disposes based on settings
- ✅ **Automatic Cleanup**: Registering same name disposes old watcher automatically

## Future Considerations

- **Watcher Groups**: Could group related watchers for batch operations
- **Lazy Registration**: Could defer watcher creation until needed
- **Plugin System**: Self-registration pattern enables plugin-like architecture

## Conclusion

Self-registering watcher pattern provides cleaner architecture with better separation of concerns. Each watcher is independent, self-contained module that registers itself in centralized state. This eliminates parameter passing, reduces coupling, and improves maintainability.

The pattern aligns with extension's overall architecture of modular, focused components with clear responsibilities.
