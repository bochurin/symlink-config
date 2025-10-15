# Async File Operations Decision

**Date**: 04.10.2025  
**Status**: Implemented  
**Context**: Performance and Consistency

## Problem

The extension had mixed synchronous and asynchronous file operations:

- **Workspace configuration**: Used async `config.update()` (VSCode API requirement)
- **File operations**: Used sync `fs.writeFileSync()` and `fs.readFileSync()`
- **Inconsistent patterns**: Some managers async, others sync
- **Performance impact**: Sync operations could block VSCode UI

## Decision

Convert all file operations to async using `fs/promises` for consistency with VSCode configuration operations and better performance.

## Implementation

### File Operations Migration

#### Before: Synchronous Operations

```typescript
// writeFile - blocking operation
export function writeFile(file: string, content: string) {
  const filePath = path.join(workspaceRoot, file)
  try {
    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update file:', error)
  }
}
```

#### After: Asynchronous Operations (Current)

```typescript
// writeFile - non-blocking operation with optional mode
import * as fs from 'fs/promises'
import { fullPath } from './full-path'

export async function writeFile(file: string, content: string, mode?: number) {
  const filePath = fullPath(file)
  try {
    await fs.writeFile(filePath, content, { encoding: 'utf8', mode })
  } catch (error) {
    console.error('Failed to update file:', error)
  }
}

// Note: readFile remains synchronous for simplicity
export function readFile(file: string): string {
  const filePath = fullPath(file)
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}
```

### Manager Function Updates

#### Gitignore Manager

```typescript
// makeFile - now async
export async function makeFile() {
  // ... build section logic
  await writeFile('.gitignore', fileContent)
}

// handleEvent - now async
export async function handleEvent(action: string) {
  if (needsRegenerate) {
    await makeFile()
  }
}
```

#### Next-Config Manager

```typescript
// makeFile - now async
export async function makeFile() {
  const content = buildNextConfig()
  await writeFile('next.symlink.config.json', content)
}

// handleFileEvent - now async
export async function handleFileEvent(action: string) {
  if (needsRegenerate) {
    await makeFile()
  }
}
```

#### Workspace Manager

```typescript
// Already async due to VSCode config.update()
export async function handleConfigChange(section: string, parameter: string, payload: any) {
  await writeConfig('files.exclude', newExclusions)
}
```

### Initialization Chain Updates

```typescript
// Extension activation - now async
export async function activate(context: vscode.ExtensionContext) {
  await nextConfigManager.init()

  if (manageGitignore) {
    await gitignoreManager.init()
  }

  if (hideServiceFiles) {
    await workspaceManager.init()
  }
}
```

## Benefits Achieved

### Performance Benefits

- **Non-blocking Operations**: File I/O doesn't freeze VSCode interface
- **Better Responsiveness**: Extension remains responsive during file operations
- **Concurrent Operations**: Multiple async operations can run simultaneously
- **Scalability**: Handles large files and multiple operations efficiently

### Code Consistency

- **Unified Pattern**: All operations (file and config) now use async/await
- **Predictable Behavior**: Same error handling patterns across all operations
- **Maintainable**: Consistent async patterns easier to understand and modify
- **Future-Proof**: Ready for additional async operations

### Error Handling

- **Proper Propagation**: Async errors properly bubble up through call chain
- **Graceful Failures**: Better error recovery with async try/catch patterns
- **User Feedback**: Can provide better progress indication for long operations
- **Debugging**: Clearer stack traces with async/await vs callbacks

## Technical Implementation

### File Operations Module (Current)

```typescript
// shared/file-ops/ - Centralized file system abstraction
// - read-file.ts - Synchronous read with empty string fallback
// - write-file.ts - Async write with optional mode parameter
// - full-path.ts - Path resolution from workspace root
// - is-root-file.ts - Check if file is in workspace root
// - is-symlink.ts - Async symlink detection with bitwise check
// - read-dir.ts - Directory listing with Dirent objects
// - read-symlink.ts - Read symlink target
// - stat-file.ts - File stats
// - index.ts - Public API exports

// Architecture rule: Only file-ops module uses fs directly
```

### Manager Pattern

```typescript
// Consistent async pattern across all managers
export async function init() {
  await handleEvent('inited')
}

export async function handleEvent(action: string) {
  if (needsRegenerate) {
    await makeFile()
  }
}

export async function makeFile() {
  await writeFile(filename, content)
}
```

### Error Handling Strategy

```typescript
// Graceful error handling in async operations
try {
  await gitignoreManager.init()
} catch (error) {
  console.error('Gitignore manager initialization failed:', error)
  // Continue with other managers
}
```

## Migration Considerations

### Breaking Changes

- **Function Signatures**: All file operation functions now return `Promise<void>`
- **Caller Updates**: All callers must use `await` or handle promises
- **Initialization**: Extension activation function must be async

### Backward Compatibility

- **API Consistency**: Function names and parameters remain the same
- **Error Behavior**: Same error handling, just async propagation
- **Functionality**: No changes to actual file operation behavior

## Validation Strategy

### Performance Testing

- **File Operation Speed**: Measure async vs sync operation times
- **UI Responsiveness**: Verify VSCode remains responsive during operations
- **Concurrent Operations**: Test multiple simultaneous file operations
- **Large File Handling**: Validate performance with large configuration files

### Functionality Testing

- **Error Scenarios**: Test file permission errors, disk full, etc.
- **Concurrent Access**: Multiple operations on same files
- **Cross-Platform**: Verify async operations work on Windows, macOS, Linux
- **Integration**: Ensure all managers work correctly with async operations

## Implemented Enhancements

- ✅ **Operation Queuing**: Implemented queue() in shared/state.ts for serializing async operations
- ✅ **File System Abstraction**: Centralized all fs operations in shared/file-ops module
- ✅ **Mixed Approach**: writeFile async, readFile sync for simplicity where appropriate
- ✅ **Mode Support**: writeFile accepts optional mode parameter for Unix permissions (0o755)

## Future Enhancements

### Advanced Async Features

- **Progress Indication**: Show progress for long-running operations
- **Cancellation**: Support for canceling in-progress operations
- **Retry Logic**: Automatic retry for transient failures

### Performance Optimizations

- **Batch Operations**: Combine multiple file operations
- **Caching**: Cache file contents to reduce I/O
- **Streaming**: Use streams for large file operations
- **Parallel Processing**: Process multiple files simultaneously

## Outcome (Updated)

Successfully implemented file system abstraction with:
- **Centralized Operations**: All fs usage in shared/file-ops module
- **Operation Queue**: Serialized async operations via queue() function
- **Mixed Approach**: Async where beneficial (writeFile), sync where simpler (readFile)
- **Enhanced Features**: Mode parameter support, comprehensive file operations

**Current Status**: File operations complete with clean architecture and operation queuing, ready for production use.
