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

#### After: Automatic Detection

```typescript
export interface WatcherConfig {
  pattern: string
  onCreate?: (() => void) | (() => void)[]
  onChange?: (() => void) | (() => void)[]
  onDelete?: (() => void) | (() => void)[]
}

// Implementation
const watcher = vscode.workspace.createFileSystemWatcher(
  config.pattern,
  !config.onCreate, // ignore create if no onCreate handler
  !config.onChange, // ignore change if no onChange handler
  !config.onDelete // ignore delete if no onDelete handler
)

// Usage
useFileWatcher({
  pattern: '**/.gitignore',
  onChange: () => handler(), // Automatically watches CHANGE
  onDelete: () => handler() // Automatically watches DELETE
  // No onCreate = automatically IGNORES CREATE
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

### File Watcher Logic

```typescript
const watcher = vscode.workspace.createFileSystemWatcher(
  config.pattern,
  !config.onCreate, // Convert handler presence to ignore flag
  !config.onChange,
  !config.onDelete
)
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

## Future Enhancements

### Advanced Auto-Detection

- **Pattern-Based Detection**: Auto-detect patterns based on handler names
- **Conditional Watching**: Enable/disable watching based on runtime conditions
- **Smart Defaults**: Learn from usage patterns to optimize defaults

### Enhanced Context

- **Event Metadata**: Include additional context about what triggered the change
- **Change Reasons**: Distinguish between user changes and programmatic changes
- **Batch Operations**: Handle multiple related changes efficiently

## Outcome

Successfully simplified hook interfaces while maintaining full functionality. The new design is more intuitive, requires less configuration, and automatically optimizes performance based on usage patterns.

**Next Steps**: Monitor usage patterns to identify additional simplification opportunities, consider applying similar patterns to other extension APIs.
