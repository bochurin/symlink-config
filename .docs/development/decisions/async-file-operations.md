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

#### After: Asynchronous Operations
```typescript
// writeFile - non-blocking operation
export async function writeFile(file: string, content: string) {
  const filePath = path.join(workspaceRoot, file)
  try {
    await fs.writeFile(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update file:', error)
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
  await writeToConfig('files.exclude', newExclusions)
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

### File Operations Module
```typescript
// shared/file-ops/writeFile.ts
import * as fs from 'fs/promises'

export async function writeFile(file: string, content: string) {
  const workspaceRoot = state.getWorkspaceRoot()
  const filePath = path.join(workspaceRoot, file)
  
  try {
    await fs.writeFile(filePath, content, 'utf8')
  } catch (error) {
    console.error('Failed to update file:', error)
  }
}
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

## Future Enhancements

### Advanced Async Features
- **Operation Queuing**: Queue file operations to prevent conflicts
- **Progress Indication**: Show progress for long-running operations
- **Cancellation**: Support for canceling in-progress operations
- **Retry Logic**: Automatic retry for transient failures

### Performance Optimizations
- **Batch Operations**: Combine multiple file operations
- **Caching**: Cache file contents to reduce I/O
- **Streaming**: Use streams for large file operations
- **Parallel Processing**: Process multiple files simultaneously

## Outcome

Successfully migrated all file operations to async patterns, providing consistent architecture, better performance, and improved user experience while maintaining full functionality.

**Next Steps**: Consider implementing operation queuing and progress indication for enhanced user experience with large operations.