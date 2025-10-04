# Workspace Manager Architecture Decision

**Date**: 04.10.2025  
**Status**: Implemented  
**Context**: VSCode Explorer File Hiding

## Problem

Users needed the ability to hide service configuration files (like `next.symlink.config.json`) from VSCode Explorer while keeping them accessible to the extension. The files should:
- Be hidden from Explorer when `hideServiceFiles` setting is enabled
- Remain accessible to extension and other tools
- Be automatically restored if user manually removes exclusions
- Follow the same architectural patterns as other managers

## Decision

Create a dedicated workspace manager that manages VSCode's `files.exclude` setting using the same architectural patterns as the gitignore manager.

## Implementation

### Workspace Manager Architecture
Following the established manager pattern:

```typescript
// build-exclusions.ts - Generate exclusion entries
export function buildExclusions(): Record<string, boolean> {
  const exclusions: Record<string, boolean> = {}
  exclusions['next.symlink.config.json'] = true
  return exclusions
}

// make-file.ts - Update workspace settings
export function makeFile() {
  const builtExclusions = buildExclusions()
  const config = vscode.workspace.getConfiguration()
  let currentExclusions = config.get<Record<string, boolean>>('files.exclude', {})
  const newExclusions = { ...currentExclusions, ...builtExclusions }
  config.update('files.exclude', newExclusions, vscode.ConfigurationTarget.Workspace)
}

// handle-event.ts - Event-driven updates
export function handleEvent(action: 'inited' | 'modified' | 'deleted' | 'disabled') {
  // Check if exclusions need updating and regenerate if necessary
}
```

### VSCode Configuration Integration
- **Configuration Target**: Uses `vscode.ConfigurationTarget.Workspace` for proper scoping
- **Merge Strategy**: Merges built exclusions with existing user exclusions
- **Non-destructive**: Preserves user's existing files.exclude entries
- **Automatic Updates**: Responds to manual changes in `.vscode/settings.json`

### File Watching Strategy
```typescript
if (hideServiceFiles) {
  watchers.push(
    useFileWatcher({
      pattern: '**/.vscode/settings.json',
      ignoreCreateEvents: true,
      onChange: () => workspaceManager.handleEvent('modified'),
      onDelete: () => workspaceManager.handleEvent('deleted'),
    })
  )
}
```

### Configuration Hook Integration
```typescript
const configWatcher = useConfigWatcher({
  section: 'symlink-config',
  handlers: {
    hideServiceFiles: {
      onEnable: () => workspaceManager.handleEvent('inited'),
      onDisable: () => workspaceManager.handleEvent('disabled')
    }
  }
})
```

## Benefits Achieved

### User Experience
- **Clean Explorer**: Service files hidden from view when desired
- **Accessibility**: Files remain accessible via search, commands, and extension
- **Automatic Management**: No manual configuration required
- **Restoration**: Automatically restores exclusions if manually removed

### Architecture Consistency
- **Same Patterns**: Follows identical structure as gitignore manager
- **Event-Driven**: Responds to configuration and file changes via events
- **Composable**: Integrates cleanly with existing hook and watcher systems
- **Maintainable**: Clear separation of concerns across functions

### Technical Benefits
- **VSCode Native**: Uses official Configuration API for proper integration
- **Workspace Scoped**: Settings apply only to current workspace
- **Merge-Friendly**: Preserves existing user exclusions
- **Change Detection**: Only updates when necessary

## Configuration Hook Pattern

### Problem with Direct Manager Calls
Initial implementation called manager functions directly:
```typescript
onEnable: () => {
  workspaceManager.init()
  workspaceManager.makeFile()
}
```

### Solution: Event-Driven Approach
Simplified to use consistent event system:
```typescript
onEnable: () => workspaceManager.handleEvent('inited')
```

### Hook Architecture
```typescript
export interface ConfigWatcherConfig {
  section: string
  handlers: Record<string, {
    onEnable?: () => void
    onDisable?: () => void
  }>
}

export function useConfigWatcher(config: ConfigWatcherConfig): vscode.Disposable {
  // Tracks previous values and calls appropriate handlers on changes
}
```

## Event System Simplification

### Initial Approach
Added special 'enabled' event type for configuration changes:
```typescript
export function handleEvent(action: 'inited' | 'modified' | 'deleted' | 'enabled' | 'disabled')
```

### Simplified Approach
Realized 'enabled' should behave exactly like 'inited':
```typescript
export function handleEvent(action: 'inited' | 'modified' | 'deleted' | 'disabled')
// Use 'inited' for both startup and when features are enabled
```

## Validation Strategy

### Functionality Testing
- **Enable/Disable**: Verify setting changes properly hide/show files
- **Manual Changes**: Test behavior when user manually edits .vscode/settings.json
- **Merge Behavior**: Confirm existing exclusions are preserved
- **Cross-Platform**: Test on Windows, macOS, Linux

### Integration Testing
- **Configuration Hooks**: Verify hook properly detects setting changes
- **File Watchers**: Confirm watcher responds to settings.json changes
- **Manager Lifecycle**: Test initialization and disposal

### Edge Cases
- **Missing .vscode**: Behavior when workspace has no .vscode folder
- **Permission Issues**: Handling when settings.json is read-only
- **Concurrent Changes**: Multiple extensions modifying files.exclude

## Future Enhancements

### Additional File Types
- **Configurable Patterns**: Allow users to specify which files to hide
- **Pattern Matching**: Support glob patterns for file exclusions
- **Category-Based**: Group exclusions by type (build, config, temp, etc.)

### Advanced Features
- **Conditional Exclusions**: Hide files based on project type or structure
- **User Overrides**: Allow users to override specific exclusions
- **Exclusion Profiles**: Predefined sets of exclusions for different workflows

## Outcome

Successfully implemented workspace manager that provides clean Explorer experience while maintaining full file accessibility. The manager follows established architectural patterns and integrates seamlessly with the configuration hook system.

**Next Steps**: Consider additional file types for exclusion, implement user-configurable exclusion patterns.