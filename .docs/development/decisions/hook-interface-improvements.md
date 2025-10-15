# Hook Interface Improvements Decision

**Date**: 04.10.2025  
**Status**: Implemented  
**Context**: API Simplification and Developer Experience

## Problem

The hook interfaces had unnecessary complexity and configuration overhead:

- Configuration hook required separate `onEnable`/`onDisable` handlers
- File watcher required explicit `watch*` properties to control event watching
- Redundant configuration where handler presence already indicated intent
- Inconsistent parameter naming across different hooks

## Decision

Simplify hook interfaces by using automatic detection and single handlers with rich context.

## Implementation

### Configuration Hook Simplification

#### Before: Separate Enable/Disable Handlers

```typescript
export interface ConfigWatcherConfig {
  section: string
  handlers: Record<string, {
    onEnable?: (data: { value: any; old_value: any }) => void
    onDisable?: (data: { value: any; old_value: any }) => void
  }>
}

// Usage
{
  manageGitignore: {
    onEnable: (data) => gitignoreManager.handleEvent('inited'),
    onDisable: (data) => gitignoreManager.handleEvent('disabled')
  }
}
```

#### After: Single onChange Handler

```typescript
export interface ConfigWatcherConfig {
  section: string
  handlers: Record<
    string,
    {
      onChange: (payload: { value: any; old_value: any }) => void
    }
  >
}

// Usage
{
  manageGitignore: {
    onChange: (payload) => {
      gitignoreManager.handleEvent(payload.value ? 'inited' : 'disabled')
    }
  }
}
```

### File Watcher Auto-Detection

#### Before: Explicit Watch Configuration

```typescript
export interface WatcherConfig {
  pattern: string
  watchCreate?: boolean
  watchChange?: boolean
  watchDelete?: boolean
  onCreate?: (() => void) | (() => void)[]
  onChange?: (() => void) | (() => void)[]
  onDelete?: (() => void) | (() => void)[]
}

// Usage
useFileWatcher({
  pattern: '**/.gitignore',
  watchCreate: false, // Explicit configuration
  onChange: () => handler(),
  onDelete: () => handler()
})
```

#### After: Event-Based Configuration (Current)

```typescript
export interface WatcherConfig {
  pattern: string
  debounce?: number
  filters?: Filter | Filter[]
  events: EventConfig | EventConfig[]
}

export interface EventConfig {
  on: FileEventType | FileEventType[]
  handlers: Handler | Handler[]
}

export type Handler = (events: FileEvent[]) => void

// Implementation
const createHandlers: Handler[] = []
const changeHandlers: Handler[] = []
const deleteHandlers: Handler[] = []

// Collect handlers by event type
for (const eventConfig of eventConfigs) {
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

// Usage
useFileWatcher({
  pattern: '**/.gitignore',
  events: {
    on: [FileEventType.Modified, FileEventType.Deleted],
    handlers: (events) => handler(events)
  }
})
```

## Benefits Achieved

### Developer Experience

- **Intuitive API**: Handler presence indicates intent, no explicit configuration needed
- **Less Boilerplate**: Removed redundant watch\* properties
- **Self-Documenting**: Configuration clearly shows what events are handled
- **Consistent Patterns**: Same approach across all hooks

### Performance Optimization

- **Automatic Optimization**: Only watches events that have handlers
- **Reduced Overhead**: VSCode doesn't monitor unused events
- **Efficient Resource Usage**: No unnecessary event processing

### Code Quality

- **Cleaner Configuration**: Removed duplicate information
- **Single Responsibility**: Each handler has one clear purpose
- **Better Maintainability**: Less configuration to maintain and update

### API Design Principles

- **Convention over Configuration**: Smart defaults based on usage patterns
- **Principle of Least Surprise**: Behavior matches developer expectations
- **Zero Configuration**: Works correctly without explicit setup

## Implementation Details

### Configuration Hook Logic

```typescript
if (newValue !== oldValue) {
  const payload = { value: newValue, old_value: oldValue }
  handler.onChange(payload)
  previousValues[key] = newValue
}
```

### File Watcher Logic (Current)

```typescript
// Decomposed into separate files
// use-file-watcher/types.ts - Type definitions
// use-file-watcher/use-file-watcher.ts - Main implementation
// use-file-watcher/execute-handlers.ts - Handler execution with filtering/debouncing
// use-file-watcher/index.ts - Public API exports

// Handler execution factory pattern
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
    // Filter and debounce logic
  }
}
```

### Parameter Naming Consistency

- **`payload`**: Used consistently across configuration handlers
- **Rich Context**: Always includes both current and previous values
- **Descriptive Names**: Clear indication of what data is provided

## Validation Strategy

### API Usability Testing

- **Developer Feedback**: Test with different usage patterns
- **Documentation Review**: Ensure examples are clear and correct
- **Migration Path**: Verify existing code can be easily updated

### Functionality Testing

- **Event Detection**: Verify automatic detection works correctly
- **Performance Impact**: Measure resource usage with/without handlers
- **Edge Cases**: Test with various handler combinations

### Integration Testing

- **Hook Interactions**: Ensure hooks work together correctly
- **Manager Integration**: Verify managers receive correct events
- **Configuration Changes**: Test dynamic configuration updates

## Migration Impact

### Breaking Changes

- **Configuration Hook Interface**: Changed from onEnable/onDisable to onChange
- **File Watcher Interface**: Removed watch\* properties
- **Parameter Names**: Changed from `data` to `payload`

### Migration Strategy

- **Clear Documentation**: Provide before/after examples
- **Gradual Migration**: Update one hook at a time
- **Backward Compatibility**: Consider deprecation warnings for future versions

## Recent Enhancements (v0.0.56)

### Hook Decomposition

- **Folder Structure**: Decomposed hooks into organized folders with separate files
- **Handler Extraction**: Extracted executeHandlers logic to separate files
- **Factory Pattern**: use-file-watcher uses createExecuteHandlers factory for closure-based state
- **Simple Utility**: use-settings-watcher uses executeHandlers utility for normalization
- **Module Boundaries**: ESLint enforces index.ts-only imports for hook subfolders

### Enhanced Features

- **Filtering**: Filter functions receive FileEvent objects for consistency
- **Debouncing**: Accumulates events during debounce window
- **Event Arrays**: Handlers always receive arrays for uniform processing
- **Type Safety**: Proper TypeScript types throughout hook system

## Outcome

Successfully evolved hook interfaces from simple auto-detection to event-based configuration with filtering, debouncing, and modular architecture. The current design provides:

- **Flexible Configuration**: Event-based syntax supports complex scenarios
- **Performance Optimization**: Filtering and debouncing reduce unnecessary processing
- **Clean Architecture**: Decomposed into focused, testable modules
- **Type Safety**: Strong TypeScript typing throughout
- **Maintainability**: Separate files for types, implementation, and execution logic

**Current Status**: Hook system complete with comprehensive features and clean architecture, ready for production use.
