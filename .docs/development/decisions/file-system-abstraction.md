# File System Abstraction Decision

**Date**: 13.10.2025  
**Status**: Implemented  
**Context**: Code Organization and Maintainability

## Problem

Direct usage of Node.js `fs` module was scattered throughout the codebase:

- **Inconsistent Patterns**: Different files using `fs` and `fs/promises` directly
- **Code Duplication**: Similar file operations repeated across modules
- **Hard to Test**: Direct fs usage makes unit testing difficult
- **No Central Control**: No single place to handle file operation errors or logging

## Decision

Create a centralized file system abstraction layer in `shared/file-ops/` where all file system operations are wrapped in reusable functions. Only this module should use `fs` directly.

## Implementation

### New Abstraction Functions

#### `readDir(relativePath: string): fs.Dirent[]`
```typescript
export function readDir(relativePath: string): fs.Dirent[] {
  try {
    const workspaceRoot = getWorkspaceRoot()
    const fullPath = path.join(workspaceRoot, relativePath)
    return fs.readdirSync(fullPath, { withFileTypes: true })
  } catch {
    return []
  }
}
```

#### `readSymlink(file: string): string`
```typescript
export function readSymlink(file: string): string {
  return fs.readlinkSync(fullPath(file))
}
```

#### `statFile(file: string): fs.Stats`
```typescript
export function statFile(file: string): fs.Stats {
  return fs.statSync(fullPath(file))
}
```

#### Enhanced `writeFile(file: string, content: string, mode?: number)`
```typescript
export async function writeFile(file: string, content: string, mode?: number) {
  const filePath = fullPath(file)
  try {
    await fs.writeFile(filePath, content, { encoding: 'utf8', mode })
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
```

### Files Updated

- **Managers**:
  - `current-config/generate.ts`: Uses `readDir`, `readSymlink`, `statFile`
  - `next-config-file/generate.ts`: Uses `readDir`, `readFile`

- **Commands**:
  - `generate-apply-windows-script.ts`: Uses `writeFile`
  - `generate-apply-unix-script.ts`: Uses `writeFile` with mode 0o755
  - `generate-clear-windows-script.ts`: Uses `writeFile`
  - `generate-clear-unix-script.ts`: Uses `writeFile` with mode 0o755

## Benefits Achieved

### Code Organization

- **Single Responsibility**: Only `shared/file-ops/` handles file system operations
- **Centralized Logic**: All file operations in one place
- **Consistent Error Handling**: Uniform approach to file operation failures
- **Easy to Locate**: All fs-related code in dedicated module

### Maintainability

- **DRY Principle**: No duplication of file operation logic
- **Easy Updates**: Changes to file handling affect all usage points
- **Clear Interfaces**: Simple, well-defined function signatures
- **Better Documentation**: Single place to document file operation patterns

### Testing Benefits

- **Mockable**: Easy to mock file operations for unit tests
- **Isolated Testing**: Can test file operations independently
- **Predictable Behavior**: Consistent error handling across all operations
- **Test Coverage**: Single module to achieve full file operation coverage

### Developer Experience

- **Simple API**: Clear, intuitive function names and signatures
- **Type Safety**: Full TypeScript support with proper return types
- **Reusable**: Same functions work across all modules
- **Self-Documenting**: Function names clearly indicate their purpose

## Architecture Rule

**Critical**: Only `shared/file-ops/` module should use `fs` or `fs/promises` directly. All other code must use the abstraction functions.

This rule ensures:
- Consistent file operation patterns
- Centralized error handling
- Easy testing and mocking
- Single source of truth for file operations

## Implementation Details

### Path Handling

- **Workspace-Relative**: All functions accept workspace-relative paths
- **fullPath Helper**: Converts relative paths to absolute paths
- **Cross-Platform**: Uses Node.js `path` module for proper path handling

### Error Handling Strategy

- **Graceful Degradation**: Functions return empty/default values on error
- **Error Logging**: Errors logged to console for debugging
- **No Exceptions**: Functions don't throw, making them safe to use
- **Consistent Behavior**: Same error handling pattern across all functions

### Mode Parameter

- **Unix Permissions**: `writeFile` accepts optional mode parameter
- **Executable Scripts**: Use `0o755` for shell scripts
- **Windows Compatible**: Mode parameter ignored on Windows
- **Backward Compatible**: Mode is optional, existing code works unchanged

## Validation Strategy

### Functionality Testing

- **File Operations**: Verify all file operations work correctly
- **Error Scenarios**: Test behavior with missing files, permission issues
- **Cross-Platform**: Test on Windows, macOS, Linux
- **Mode Setting**: Verify Unix executable permissions work correctly

### Integration Testing

- **Manager Compatibility**: Ensure all managers work with abstractions
- **Command Execution**: Test script generation with new writeFile
- **Error Handling**: Validate graceful failure in all scenarios

## Future Enhancements

### Advanced Features

- **Operation Logging**: Detailed logging of all file operations
- **Performance Metrics**: Track file operation performance
- **Caching**: Cache frequently read files
- **Batch Operations**: Combine multiple file operations efficiently

### Error Recovery

- **Retry Logic**: Automatic retry for transient failures
- **Backup/Restore**: Backup files before modification
- **Rollback Support**: Undo file operations on failure
- **User Notifications**: Enhanced feedback for file operation errors

## Outcome

Successfully centralized all file system operations in `shared/file-ops/` module, providing consistent, maintainable, and testable file operation patterns throughout the codebase.

**Next Steps**: Consider adding operation logging and performance metrics for enhanced debugging and monitoring capabilities.
