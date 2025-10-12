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

### Enhanced Filter Interface

```typescript
type Filter = (uri: vscode.Uri, event: FileWatchEvent) => Promise<boolean> | boolean

export interface WatcherConfig {
  pattern: string
  debounce?: number // milliseconds
  filter?: Filter | Filter[] // all must return true
  // ... other properties
}
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

### Intermediate Callback Pattern

Used adapter pattern to bridge filter interface with existing functions:

```typescript
// Adapter callbacks that receive (uri, event) but only pass uri to functions
filter: (uri, event) => isRootFile(uri)
filter: (uri, event) => isSymlink(uri)
```

### Debouncing Implementation

```typescript
const executeHandlers = async (handlers: Handler[], uri: vscode.Uri, event: FileWatchEvent) => {
  // Apply filters
  if (config.filter) {
    const filters = Array.isArray(config.filter) ? config.filter : [config.filter]
    for (const filter of filters) {
      const passed = await filter(uri, event)
      if (!passed) return // Skip if any filter returns false
    }
  }

  const runHandlers = () => handlers.forEach((handler) => handler(uri, event))

  if (config.debounce) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    debounceTimeout = setTimeout(runHandlers, config.debounce)
  } else {
    runHandlers()
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

### Basic Filtering

```typescript
const watcher = useFileWatcher({
  pattern: '**/.gitignore',
  filter: (uri, event) => isRootFile(uri),
  onChange: () => handleGitignoreEvent()
})
```

### Multiple Filters with Debouncing

```typescript
const watcher = useFileWatcher({
  pattern: '**/*',
  debounce: 1000,
  filter: [
    (uri, event) => isSymlink(uri),
    (uri, event) => event !== FileWatchEvent.Modified
  ],
  events: {
    on: [FileWatchEvent.Created, FileWatchEvent.Deleted],
    handler: () => handleSymlinkChanges()
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

- **Filter Signature**: Filters now receive both uri and event parameters
- **Shared Location**: Filter functions moved from hooks to shared utilities

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

## Outcome

Successfully implemented comprehensive filter system with debouncing support, providing performance optimization and better code organization while maintaining backward compatibility through adapter patterns.

**Next Steps**: Monitor performance in production environments, consider additional filter utilities based on usage patterns.