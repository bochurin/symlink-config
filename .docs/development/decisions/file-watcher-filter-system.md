# File Watcher Filter System Decision

**Date**: 12.10.2025  
**Status**: Implemented  
**Context**: Performance optimization and code organization

## Problem

The file watcher system needed enhanced filtering capabilities and better code organization:

- **Performance Issues**: File watchers could trigger cascading regenerations during script execution
- **Code Duplication**: Filter functions scattered across different modules
- **Limited Filtering**: Filters couldn't access event information for context-aware decisions
- **No Debouncing**: Rapid file changes could overwhelm the system

## Decision

Implement comprehensive filter system with debouncing support and centralized filter functions in shared utilities.

## Implementation

### Enhanced Filter Interface (Current: v0.0.56)

```typescript
// Filter receives FileEvent object
type Filter = (event: FileEvent) => Promise<boolean> | boolean

export interface WatcherConfig {
  pattern: string
  debounce?: number // milliseconds
  filters?: Filter | Filter[] // all must return true
  events: EventConfig | EventConfig[] // required
}

export interface EventConfig {
  on: FileEventType | FileEventType[]
  handlers: Handler | Handler[]
}

// Handler always receives array
type Handler = (events: FileEvent[]) => void
```

### Shared Filter Functions

Moved common filters to `src/shared/file-ops/`:

```typescript
// is-root-file.ts
export function isRootFile(uri: vscode.Uri) {
  const workspaceRoot = getWorkspaceRoot()
  if (!workspaceRoot) return false
  const root = workspaceRoot.split('\\').join('/')
  const uriDir = uri.fsPath.split('\\').slice(0, -1).join('/') + '/'
  return uriDir === root
}

// is-symlink.ts
export async function isSymlink(uri: vscode.Uri): Promise<boolean> {
  try {
    const stats = await vscode.workspace.fs.stat(uri)
    return stats.type === vscode.FileType.SymbolicLink
  } catch {
    return true // Assume deleted files might have been symlinks
  }
}
```

### Filter Pattern (Current)

Filters receive FileEvent objects for consistency:

```typescript
// Filters receive FileEvent: { uri, event }
filters: ({ uri }) => isRootFile(uri)
filters: ({ uri }) => isSymlink(uri)

// Or access event type
filters: ({ uri, event }) => {
  return event === FileEventType.Modified && isRootFile(uri)
}
```

### Debouncing Implementation (Current: v0.0.56)

Extracted to separate execute-handlers.ts file:

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
    // Apply filters
    if (filters) {
      const filterArray = Array.isArray(filters) ? filters : [filters]
      for (const filter of filterArray) {
        if (!await filter({ uri, event: eventType })) return
      }
    }
    
    // Debounce with event accumulation
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

## Benefits Achieved

### Performance Optimization

- **Debouncing**: Prevents cascading regenerations with configurable delays
- **Efficient Filtering**: Early exit when filters return false
- **Reduced Processing**: Only relevant events trigger handlers
- **Async Support**: Filters can perform async operations like file system checks

### Code Organization

- **Centralized Filters**: Common filter functions in shared utilities
- **Reusability**: Same filters used across multiple watchers
- **Clean Separation**: Filter logic separated from watcher configuration
- **Maintainability**: Single location for filter function updates

### Developer Experience

- **Flexible API**: Support for single filters or filter arrays
- **Context Awareness**: Filters receive both uri and event information
- **Backward Compatibility**: Existing filter functions work with adapter pattern
- **Type Safety**: Full TypeScript support with proper interfaces

## Usage Examples

### Basic Filtering (Current)

```typescript
const watcher = useFileWatcher({
  pattern: '**/.gitignore',
  filters: ({ uri }) => isRootFile(uri),
  events: {
    on: FileEventType.Modified,
    handlers: (events) => handleGitignoreEvent()
  }
})
```

### Multiple Filters with Debouncing (Current)

```typescript
const watcher = useFileWatcher({
  pattern: '**/*',
  debounce: 500,
  filters: [
    ({ uri }) => isSymlink(uri),
    ({ event }) => event !== FileEventType.Modified
  ],
  events: {
    on: [FileEventType.Created, FileEventType.Deleted],
    handlers: (events) => handleSymlinkChanges(events)
  }
})
```

## Technical Implementation

### Filter Processing Logic

1. **Array Normalization**: Convert single filter to array for consistent processing
2. **Sequential Evaluation**: Process filters in order, exit early on false
3. **Async Support**: Await async filters before proceeding
4. **All-Must-Pass**: All filters must return true to proceed with handlers

### Debouncing Strategy

- **Per-Watcher**: Each watcher has its own debounce timer
- **Configurable Delay**: Millisecond precision for debounce timing
- **Timer Reset**: New events reset the debounce timer
- **Handler Batching**: Multiple events within debounce window trigger handlers once

## Migration Impact

### Breaking Changes

- **Filter Signature**: Filters receive FileEvent object `{ uri, event }`
- **Handler Signature**: Handlers always receive array of FileEvent objects
- **Shared Location**: Filter functions moved from hooks to shared utilities
- **Hook Decomposition**: Hooks decomposed into folders with separate files (v0.0.56)

### Compatibility

- **Adapter Pattern**: Existing functions work with intermediate callbacks
- **Optional Features**: Debouncing and filtering are optional enhancements
- **Gradual Migration**: Can update watchers incrementally

## Validation Strategy

### Performance Testing

- **Debounce Effectiveness**: Verify debouncing prevents cascading events
- **Filter Performance**: Measure filter execution time impact
- **Memory Usage**: Monitor memory consumption with multiple watchers
- **Event Volume**: Test with high-frequency file system events

### Functionality Testing

- **Filter Accuracy**: Verify filters correctly identify target files
- **Event Context**: Confirm filters receive correct event information
- **Async Filters**: Test async filter functions work correctly
- **Multiple Filters**: Validate filter array processing logic

## Future Enhancements

### Advanced Filtering

- **Pattern-Based Filters**: Built-in filters for common file patterns
- **Conditional Logic**: Support for complex filter combinations
- **Performance Metrics**: Built-in performance monitoring for filters
- **Filter Caching**: Cache filter results for repeated evaluations

### Enhanced Debouncing

- **Per-File Debouncing**: Individual debounce timers per file
- **Adaptive Timing**: Dynamic debounce delays based on event frequency
- **Event Batching**: Collect and process multiple events together
- **Priority Queuing**: Different debounce delays for different event types

## Outcome (Updated: v0.0.56)

Successfully implemented comprehensive filter system with:
- **Event Accumulation**: Debouncing accumulates events during window
- **Handler Arrays**: Consistent array-based handler signature
- **Modular Architecture**: Decomposed into types, implementation, and execute-handlers files
- **Factory Pattern**: createExecuteHandlers maintains state in closure
- **Type Safety**: Full TypeScript support throughout

**Current Status**: Filter system complete with clean architecture and comprehensive features, ready for production use.