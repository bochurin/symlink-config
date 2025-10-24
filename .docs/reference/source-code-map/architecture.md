# Architecture Patterns and Rules

## Key Architectural Rules

### 1. OS Module Encapsulation

**Rule**: Only `shared/file-ops/` should use `os` and `fs` modules directly.

**Implementation**:
- Created `isWindows()` utility in `shared/file-ops/is-windows.ts`
- All OS detection uses `isWindows()` function
- Script generation receives `targetOS` parameter instead of detecting current OS

**Benefits**:
- Clear separation of concerns
- Enables cross-platform script generation
- Single source of truth for OS detection

### 2. Target OS Parameter Pattern

**Rule**: Script generation functions accept `targetOS: 'windows' | 'unix'` parameter.

**Flow**:
```typescript
// apply-config.ts - Determines target OS
const isWindows = os.platform() === 'win32'
const targetOS = isWindows ? 'windows' : 'unix'
await applyScript(operations, workspaceRoot, targetOS)

// apply-script.ts - Passes to all operations
const lines = header(workspaceRoot, message, targetOS)
lines.push(...createDirectory(targetDir, targetOS))
lines.push(...createSymlink(operation, targetOS))
const content = lines.flat().join(lineEnding(targetOS))
await writeFile(workspaceRoot, scriptName, content, filePermissions(targetOS))
```

**Benefits**:
- Can generate Windows scripts on Unix
- Can generate Unix scripts on Windows
- Respects `scriptGenerationOS` setting

### 3. File Operations vs Script Formatting

**File Operations** (`shared/file-ops/`):
- OS detection (`isWindows()`)
- File system operations (read, write, stat, etc.)
- Path resolution for file operations
- Uses `os` and `fs` modules directly

**Script Formatting** (`scripts/shared/path/`):
- Path formatting for script content (`osSpecificPath()`)
- Windows needs `\\\\` in batch file content
- Unix uses forward slashes unchanged
- Receives `targetOS` parameter

### 4. Shared Module Isolation

**Rule**: Shared modules must not import from application modules.

**Pattern**: Parameter injection
```typescript
// Shared function accepts workspaceRoot
export function fullPath(workspaceRoot: string, endPath: string): string

// Caller provides workspaceRoot from state
const root = getWorkspaceRoot()
const path = fullPath(root, 'file.txt')
```

**Benefits**:
- True module isolation
- Can extract to npm packages
- Easier testing

### 5. Type System Simplification

**SymlinkOperation Interface**:
```typescript
export interface SymlinkOperation {
  type: 'create' | 'delete'
  target: string
  source: string  // Required - even deletes have source from current config
  isDirectory: boolean
}
```

**Rationale**:
- Delete operations read from `current.symlink-config.json` which has source
- No need for optional source or fallbacks
- Cleaner code without `|| ''` or `!` assertions

## Module Organization

### Extension Lifecycle
```
src/main.ts (entry point)
  └── src/extension/
      ├── activate.ts (lifecycle)
      ├── ini.ts (initialization)
      ├── managers-init.ts (manager setup)
      ├── make-watchers.ts (watcher creation)
      └── register-commands.ts (command registration)
```

### State Management
```
src/state/ (application state)
  ├── workspace.ts (root, name)
  ├── ui.ts (silent mode, tree provider, output channel)
  ├── managers.ts (manager registry)
  └── watchers.ts (watcher registry)

src/queue/ (operation serialization)
  └── queue.ts (async operation queue)

src/shared/log.ts (logging utility)
```

### Manager Pattern
```
managers/{name}/
  ├── callbacks/
  │   ├── generate.ts (content generation)
  │   ├── make.ts (change detection + write)
  │   ├── needs-regenerate.ts (change detection)
  │   ├── read.ts (file/config reading)
  │   └── write.ts (file writing)
  ├── types.ts (type definitions)
  ├── enums.ts (enum definitions)
  ├── use-manager.ts (manager hook)
  └── index.ts (public exports)
```

### Watcher Pattern
```
watchers/{category}/{name}.ts
  - Self-registering via registerWatcher(name, watcher)
  - Uses hooks (useFileWatcher, useSettingsWatcher)
  - Queues operations via queue()
```

### Hook Pattern
```
shared/hooks/{hook-name}/
  ├── types.ts (type definitions)
  ├── enums.ts (enum definitions)
  ├── {hook-name}.ts (main implementation)
  ├── execute-handlers.ts (handler execution)
  └── index.ts (public exports)
```

## Import Patterns

### Path Aliases
```typescript
import { log } from '@shared/log'
import { getWorkspaceRoot } from '@state'
import { queue } from '@queue'
import { applyConfig } from '@commands'
```

### Module Boundaries (ESLint Enforced)
- Import through index.ts only for: managers/*, commands/*, hooks/*, shared/*, views/*, watchers/*, extension/*
- No direct file imports bypassing index.ts

### Export Patterns
```typescript
// index.ts - Standard order
export type * from './types'  // Types first
export * from './enums'       // Enums second
export * from './implementation'  // Other exports last
```

## Key Patterns

### Self-Registering Watchers
```typescript
export function gitignoreWatcher(): void {
  const watcher = useFileWatcher({...})
  registerWatcher(WATCHERS.GITIGNORE, watcher)
}
```

### Manager Factory
```typescript
const manager = useManager({
  objectNameCallback: () => 'file.json',
  readCallback: read,
  makeCallback: make,
  generateCallback: generate,
  needsRegenerateCallback: needsRegenerate,
  writeCallback: write,
})
```

### Operation Queue
```typescript
queue(() => handleGitignoreEvent())
```

### Named Parameters
```typescript
// Flexible parameter system
function make(params?: {
  initialContent?: CT
  generatedContent?: CT
  [key: string]: any  // Extensible
}): Promise<CT | undefined>
```

## Architecture Benefits

### Maintainability
- Clear module boundaries
- Consistent patterns across codebase
- Self-documenting structure

### Testability
- Isolated modules
- Parameter injection
- Pure functions where possible

### Scalability
- Modular architecture
- Easy to add new features
- Clear extension points

### Cross-Platform
- OS abstraction in file-ops
- Target OS parameter pattern
- Platform-specific script generation
