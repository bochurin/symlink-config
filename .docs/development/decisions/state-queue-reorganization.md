# State/Queue Module Reorganization

**Date**: 17.10.2025  
**Status**: Implemented  
**Version**: 0.0.61

## Context

After the state/queue/log separation in v0.0.59, state and queue remained in `extension/` folder. However, these modules are fundamental to the entire application, not just the extension lifecycle. They're used by managers, commands, watchers, and views - making them core application modules rather than extension-specific modules.

**Previous Structure**:
```
src/extension/
├── state.ts          # 75+ lines, mixed concerns
├── queue.ts          # Simple queue function
├── activate.ts
├── ini.ts
└── ...
```

**Issues**:
- State module was monolithic (workspace, UI, managers, watchers all in one file)
- State and queue conceptually belong at application level, not extension level
- `extension/` folder should contain only extension lifecycle code
- Inconsistent with other core modules at src/ level (shared/, managers/, commands/, etc.)

## Decision

1. **Move state and queue to src/ level** alongside other core modules
2. **Decompose state into modular structure** with separate files for each concern
3. **Add custom watcher types** defined in hook modules
4. **Enhance getters** to accept multiple names and return arrays
5. **Update ESLint rules** to enforce module boundaries

## Implementation

### State Module Decomposition

**Before** (single file):
```typescript
// src/extension/state.ts (75+ lines)
let workspaceRoot: string
let workspaceName: string
let sylentMode: boolean
let treeProvider: any
let outputChannel: vscode.OutputChannel
const managers = new Map<string, Manager<any, any>>()
const watchers = new Map<string, vscode.Disposable>()
// ... all functions mixed together
```

**After** (modular structure):
```
src/state/
├── types.ts          # Watcher union type
├── workspace.ts      # Workspace root and name
├── ui.ts             # Silent mode, tree provider, output channel
├── managers.ts       # Manager registry
├── watchers.ts       # Watcher registry
└── index.ts          # Public exports
```

### Custom Watcher Types

**Hook Modules**:
```typescript
// src/shared/hooks/use-file-watcher/use-file-watcher.ts
export type FileWatcher = vscode.FileSystemWatcher

// src/shared/hooks/use-settings-watcher/use-settings-watcher.ts
export type SettingsWatcher = vscode.Disposable
```

**State Types**:
```typescript
// src/state/types.ts
import { FileWatcher } from '../shared/hooks/use-file-watcher'
import { SettingsWatcher } from '../shared/hooks/use-settings-watcher'

export type Watcher = FileWatcher | SettingsWatcher
```

### Enhanced Getters

**Before**:
```typescript
export function getManager(name: string): Manager<any, any> | undefined {
  return managers.get(name)
}

export function getWatcher(name: string): vscode.Disposable | undefined {
  return watchers.get(name)
}
```

**After**:
```typescript
export function getManagers(...names: string[]): Manager<any, any>[] {
  return names.map((name) => managers.get(name)).filter((m) => m !== undefined)
}

export function getWatchers(...names: string[]): Watcher[] {
  return names.map((name) => watchers.get(name)).filter((w) => w !== undefined)
}
```

### Queue Module

**Before**:
```
src/extension/queue.ts
```

**After**:
```
src/queue/
├── queue.ts          # Queue implementation
└── index.ts          # Public exports
```

### ESLint Rules

```javascript
{
  group: ['*/state/*', '!*/state/index'],
  message: 'Import from state/index.ts only, not internal files'
},
{
  group: ['*/queue/*', '!*/queue/index'],
  message: 'Import from queue/index.ts only, not internal files'
}
```

### Import Updates

Updated 31 files:
- **Commands** (4 files): `../../extension/state` → `../../state`
- **Extension** (3 files): `./state` → `../state`, `./queue` → `../queue`
- **Managers** (9 files): `../../extension/state` → `../../state`
- **Shared** (1 file): `../extension/state` → `../state`
- **Views** (1 file): `../../extension/state` → `../../state`
- **Watchers** (7 files): `../extension/state` → `../state`, `../extension/queue` → `../queue`
- **State internal** (3 files): `../../shared/` → `../shared/`

## Rationale

### Application-Level Modules

**State and queue are used by**:
- Managers (read/write operations)
- Commands (workspace root, tree provider)
- Watchers (registration, queue)
- Views (tree provider)
- Shared utilities (output channel)

They're not extension-specific - they're core application infrastructure.

### Modular State

**Benefits of decomposition**:
- **Single Responsibility**: Each file has one clear purpose
- **Easier Navigation**: Find workspace state in workspace.ts, not in 75-line file
- **Better Maintainability**: Changes to watchers don't affect workspace code
- **Clearer Dependencies**: Import only what you need

### Custom Watcher Types

**Why define in hook modules**:
- Types belong where they're created
- `FileWatcher` is what `useFileWatcher` returns
- `SettingsWatcher` is what `useSettingsWatcher` returns
- State module just creates union for storage

### Enhanced Getters

**Why accept multiple names**:
- More flexible API
- Can retrieve related items in single call
- Filters out undefined automatically
- Consistent with modern JavaScript patterns

### Consistent Structure

**src/ level modules**:
```
src/
├── state/            # Application state
├── queue/            # Operation queue
├── shared/           # Reusable utilities
├── managers/         # Business logic
├── commands/         # User commands
├── views/            # UI components
├── watchers/         # File/settings watchers
└── extension/        # Extension lifecycle only
```

## Benefits

### Architecture

- **Clear Hierarchy**: Core modules at src/ level, lifecycle in extension/
- **Logical Grouping**: State and queue alongside other core modules
- **Better Organization**: Extension folder contains only lifecycle code

### Development

- **Easier Navigation**: Find state files by concern (workspace, ui, managers, watchers)
- **Faster Development**: Smaller files easier to understand and modify
- **Better IDE Support**: Clearer module structure improves autocomplete

### Maintenance

- **Isolated Changes**: Modify workspace state without touching watcher code
- **Easier Testing**: Test individual state concerns independently
- **Clear Boundaries**: ESLint enforces proper imports

## Trade-offs

### More Files

**Before**: 2 files (state.ts, queue.ts)  
**After**: 7 files (state/5 files, queue/2 files)

- **Pro**: Better organization, clearer responsibilities
- **Pro**: Easier to find specific functionality
- **Con**: More files to navigate (minimal impact with good IDE)

### Import Path Changes

All imports from `extension/state` and `extension/queue` needed updating:
- **Pro**: Clearer that these are application-level modules
- **Pro**: Shorter import paths from most locations
- **Con**: One-time refactoring effort (completed)

## Alternatives Considered

### Keep in Extension Folder

**Rejected** because:
- State and queue are application-level, not extension-specific
- Used by all modules, not just extension lifecycle
- Inconsistent with other core modules at src/ level

### Single State File

**Rejected** because:
- 75+ lines mixing multiple concerns
- Hard to navigate and maintain
- Changes to one concern affect entire file

### Separate Folders for Each Concern

**Rejected** because:
- Overkill for current size
- Would create too many top-level folders
- Current structure (state/ with subfiles) is sufficient

## Related Decisions

- [State/Queue/Log Separation](state-queue-log-separation.md) - Foundation for this reorganization
- [Shared Module Isolation](shared-module-isolation.md) - Parameter injection pattern
- [Watcher Self-Registration Pattern](watcher-self-registration-pattern.md) - Watcher registry design

## Future Considerations

### State Persistence

Could add state persistence:
- Save workspace preferences
- Restore UI state on reload
- Cache manager results

### State Events

Could add state change events:
- Notify when workspace changes
- React to tree provider updates
- Subscribe to state changes

### Queue Enhancement

Could enhance queue module:
- Priority queuing
- Parallel execution limits
- Queue monitoring
- Cancellation support

### Manager Registry Usage

Currently managers are registered but not retrieved:
- Could use for dynamic manager access
- Could implement manager lifecycle
- Could add manager dependencies
