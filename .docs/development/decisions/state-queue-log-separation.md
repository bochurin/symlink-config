# State/Queue/Log Separation

**Date**: 15.10.2025  
**Status**: Implemented  
**Version**: 0.0.59

## Context

The `shared/state.ts` module contained three distinct concerns:
1. **Application State** - Workspace root, name, config, tree provider, watcher registry
2. **Operation Queue** - Serialization of async operations
3. **Logging Utility** - Output channel logging with rotation

This mixing of application-level logic with reusable utilities violated separation of concerns and made the architecture unclear.

## Decision

Separate the three concerns into distinct modules based on their scope:

1. **`extension/state.ts`** - Application-level state management
2. **`extension/queue.ts`** - Application-level operation serialization
3. **`shared/log.ts`** - Reusable logging utility

## Rationale

### Application-Level vs Reusable

**Application-Level Modules** (`extension/`):
- Specific to this extension's needs
- Manage application lifecycle and state
- Not intended for reuse in other projects
- Examples: workspace state, watcher registry, processing queue

**Reusable Utilities** (`shared/`):
- Generic, reusable functionality
- No application-specific dependencies
- Could be extracted to npm packages
- Examples: file operations, logging, hooks, factories

### State Module

**Belongs in `extension/`** because:
- Manages extension-specific state (workspace root, tree provider)
- Maintains watcher registry for this extension
- Application lifecycle management
- Not reusable in other contexts

### Queue Module

**Belongs in `extension/`** because:
- Serializes operations for this extension
- Application-level coordination
- Specific to extension's async operation needs
- Not a generic utility

### Log Module

**Belongs in `shared/`** because:
- Generic logging functionality
- Reusable across any VSCode extension
- No application-specific logic
- Could be extracted to npm package
- Only dependency: `getOutputChannel()` from state

## Implementation

### Module Structure

```
src/extension/
├── state.ts          # Application state and watcher registry
└── queue.ts          # Operation serialization

src/shared/
└── log.ts            # Logging utility
```

### State Module (`extension/state.ts`)

**Responsibilities**:
- Workspace root, name, config management
- Tree provider reference
- Output channel reference
- Watcher registry with name-based disposal

**Functions**:
- `setWorkspaceRoot()`, `getWorkspaceRoot()`
- `setWorkspaceName()`, `getWorkspaceName()`
- `setNextConfig()`, `getNextConfig()`
- `setSilentMode()`, `getSilentMode()`
- `setTreeProvider()`, `getTreeProvider()`
- `setOutputChannel()`, `getOutputChannel()`
- `registerWatcher()`, `disposeWatchers()`

### Queue Module (`extension/queue.ts`)

**Responsibilities**:
- Serialize async operations
- Prevent race conditions
- Chain promises sequentially

**Functions**:
- `queue(fn: () => Promise<void>): Promise<void>`

**Implementation**:
```typescript
let processingQueue: Promise<void> = Promise.resolve()

export function queue(fn: () => Promise<void>): Promise<void> {
  processingQueue = processingQueue.then(fn).catch((error) => {
    console.error('Queue processing error:', error)
  })
  return processingQueue
}
```

### Log Module (`shared/log.ts`)

**Responsibilities**:
- Output channel logging
- Timestamp formatting
- Log rotation based on settings
- Show/clear logs

**Functions**:
- `log(message: string): void`
- `clearLogs(): void`
- `showLogs(): void`

**Implementation**:
```typescript
import * as vscode from 'vscode'
import { getOutputChannel } from '../extension/state'
import { readConfig } from './config-ops'
import { SETTINGS } from './constants'

let logCount = 0

export function log(message: string): void {
  const outputChannel = getOutputChannel()
  if (!outputChannel) {
    console.log(message)
    return
  }

  const maxLogEntries = readConfig(
    `${SETTINGS.SYMLINK_CONFIG.SECTION}.${SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES}`,
    SETTINGS.SYMLINK_CONFIG.DEFAULT.MAX_LOG_ENTRIES,
  )

  if (logCount >= maxLogEntries) {
    outputChannel.clear()
    logCount = 0
  }

  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
  outputChannel.appendLine(`[${timestamp}] ${message}`)
  logCount++
}

export function clearLogs(): void {
  const outputChannel = getOutputChannel()
  if (outputChannel) {
    outputChannel.clear()
    logCount = 0
    outputChannel.show()
  }
}

export function showLogs(): void {
  const outputChannel = getOutputChannel()
  if (outputChannel) {
    outputChannel.show()
  }
}
```

## Import Updates

Updated 31 files across the codebase:

**Watchers** (7 files):
- Import `queue` from `extension/queue`
- Import `log` from `shared/log`
- Import state getters from `extension/state`

**Commands** (4 files):
- Import `queue` from `extension/queue`
- Import `log` from `shared/log`
- Import state getters from `extension/state`

**Managers** (3 files):
- Import `log` from `shared/log`

**Extension** (4 files):
- Import from `extension/state` and `extension/queue`

**Views** (1 file):
- Import state getters from `extension/state`

**Shared** (1 file):
- Import `getOutputChannel` from `extension/state`

## Benefits

### Clear Architecture

- **Application Logic**: `extension/` contains extension-specific modules
- **Reusable Utilities**: `shared/` contains generic, reusable functionality
- **Explicit Dependencies**: Clear import paths show module relationships

### Better Organization

- **State Management**: Centralized in `extension/state.ts`
- **Operation Coordination**: Isolated in `extension/queue.ts`
- **Logging Utility**: Standalone in `shared/log.ts`

### Improved Maintainability

- **Single Responsibility**: Each module has one clear purpose
- **Easier Testing**: Smaller, focused modules easier to test
- **Better Understanding**: Clear separation makes codebase easier to navigate

### Future Extensibility

- **Log Module**: Could be extracted to npm package for other extensions
- **State Module**: Clear application state management
- **Queue Module**: Reusable pattern for operation serialization

## Trade-offs

### Additional Import

Log module must import `getOutputChannel()` from `extension/state`:
- **Pro**: Log remains reusable utility
- **Pro**: No circular dependencies
- **Con**: One cross-boundary import (acceptable for output channel access)

### Module Count

Three modules instead of one:
- **Pro**: Clear separation of concerns
- **Pro**: Better organization
- **Con**: More files to navigate (minimal impact)

## Alternatives Considered

### Keep Everything in State

**Rejected** because:
- Violates single responsibility principle
- Mixes application logic with utilities
- Makes architecture unclear
- Harder to extract reusable components

### Move Log to Extension

**Rejected** because:
- Log is generic utility, not application-specific
- Could be reused in other extensions
- Belongs with other shared utilities

### Create Separate Utilities Folder

**Rejected** because:
- `shared/` already serves this purpose
- No need for additional folder structure
- Current organization is clear

## Related Decisions

- [Shared Utilities Architecture](shared-utilities-architecture.md) - Foundation for shared modules
- [Watcher Self-Registration Pattern](watcher-self-registration-pattern.md) - Uses state and queue modules
- [Manager Factory Pattern](manager-factory-pattern.md) - Uses log module

## Future Considerations

### NPM Package Extraction

Log module could be extracted to standalone npm package:
- Generic VSCode output channel logging
- Timestamp formatting
- Log rotation
- Show/clear functionality

### Queue Enhancement

Queue module could be enhanced with:
- Priority queuing
- Parallel execution limits
- Queue status monitoring
- Cancellation support

### State Management

State module could be enhanced with:
- State change events
- State persistence
- State validation
- State snapshots
