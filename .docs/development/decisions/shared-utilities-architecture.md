# Shared Utilities Architecture Decision

**Date**: 03.10.2025  
**Status**: Implemented  
**Context**: Code Reusability and Maintenance

## Problem

Managers were duplicating file operation logic and state management, leading to:

- Code duplication across managers
- Inconsistent error handling
- Complex state synchronization
- Harder maintenance and testing

## Decision

Create shared utilities for common operations and simplify state management by removing unnecessary state tracking.

## Implementation

### Shared File Operations

Created `src/shared/file-ops/` with reusable utilities:

```typescript
// read-file.ts
export function readFile(file: string): string {
  const workspaceRoot = state.getWorkspaceRoot()
  const filePath = path.join(workspaceRoot, file)
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

// write-file.ts
export function writeFile(file: string, content: string) {
  const workspaceRoot = state.getWorkspaceRoot()
  const filePath = path.join(workspaceRoot, file)
  try {
    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
```

### Simplified State Management

- **Moved state to `src/shared/state.ts`**
- **Removed gitignore-specific state tracking**
- **Direct content comparison instead of state-based detection**

### New Section Markers

Changed gitignore section markers for cleaner syntax:

- **Old**: `# Begin Symlink.Config` / `# End Symlink.Config`
- **New**: `#Symlink.Config:{` / `#}:Symlink.Config`

### Improved Event Handling

```typescript
export function handleEvent(action: 'inited' | 'modified' | 'deleted') {
  let needsRegenerate = true

  if (action !== 'deleted') {
    const builtSection = buildSection()
    const fromFileSection = readFromFile()
    needsRegenerate = fromFileSection !== builtSection
  }

  if (needsRegenerate) {
    vscode.window.showWarningMessage('.gitignore is not correct or absent. Generating ...', 'OK')
    makeFile()
  }
}
```

## Benefits Achieved

### Code Quality

- **DRY Principle**: Eliminated file operation duplication
- **Consistent Error Handling**: Unified approach across all file operations
- **Cleaner APIs**: Simple function signatures for common operations
- **Better Testing**: Shared utilities easier to unit test

### Maintenance

- **Single Source of Truth**: File operations centralized
- **Easier Updates**: Changes to file handling logic in one place
- **Reduced Complexity**: Less state to manage and synchronize
- **Clear Separation**: Business logic vs infrastructure concerns

### Performance

- **Direct Comparison**: No state synchronization overhead
- **Synchronous Operations**: Simpler execution flow
- **Reduced Memory**: Less state stored in memory
- **Faster Startup**: No complex state initialization

## Architecture Benefits

### Reusability

- **Cross-Manager Usage**: Both managers can use same utilities
- **Future Extensibility**: New managers can leverage existing utilities
- **Consistent Patterns**: Same approach for all file operations

### Maintainability

- **Centralized Logic**: File operations in dedicated module
- **Clear Interfaces**: Simple function signatures
- **Error Consistency**: Uniform error handling approach
- **Documentation**: Single place to document file operation patterns

### Testing Strategy

- **Unit Testing**: Shared utilities can be tested in isolation
- **Mock-Friendly**: Easy to mock file operations for testing
- **Integration Testing**: Consistent behavior across managers
- **Error Scenarios**: Centralized error handling testing

## Trade-offs

### Complexity

- **Additional Layer**: Extra abstraction for simple operations
- **Import Dependencies**: Managers now depend on shared utilities
- **Path Resolution**: Workspace-relative path handling

### Flexibility

- **Standardized Approach**: Less flexibility for specialized file operations
- **Error Handling**: Unified approach may not fit all use cases
- **Path Constraints**: All operations relative to workspace root

## Validation

### Functionality Testing

- **File Operations**: Verify read/write operations work correctly
- **Error Handling**: Test behavior with permission issues, missing files
- **Path Resolution**: Confirm workspace-relative paths resolve correctly
- **Cross-Platform**: Test on Windows, macOS, Linux

### Integration Testing

- **Manager Compatibility**: Ensure both managers work with shared utilities
- **State Consistency**: Verify simplified state management works correctly
- **Event Handling**: Test improved event handling logic

## Outcome

Successfully created reusable shared utilities that eliminate code duplication while simplifying state management. The new architecture provides better maintainability and consistency across managers.

**Next Steps**: Apply shared utility patterns to other common operations, comprehensive testing of simplified architecture.
