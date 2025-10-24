# Shared Module Isolation

**Date**: 16.10.2025  
**Status**: Implemented  
**Version**: 0.0.60

## Context

After separating state/queue/log in v0.0.59, some `shared/` modules still imported from `extension/state` to access `workspaceRoot`. This violated the architectural principle that shared modules should be self-contained, reusable utilities with no application-specific dependencies.

**Problem Files**:
- `shared/file-ops/full-path.ts` - imported `getWorkspaceRoot()`
- `shared/file-ops/is-root-file.ts` - imported `getWorkspaceRoot()`
- `shared/file-ops/read-dir.ts` - imported `getWorkspaceRoot()`

These imports created a dependency from shared utilities back to application logic, preventing true reusability.

## Decision

Remove all imports from `extension/` in `shared/` modules by using **parameter injection pattern**: functions that need `workspaceRoot` receive it as a parameter instead of importing it.

## Implementation

### Function Signature Changes

**Before** (with import):
```typescript
import { getWorkspaceRoot } from '../../extension/state'

export function fullPath(endPath: string): string {
  const workspaceRoot = getWorkspaceRoot()
  return path.join(workspaceRoot, endPath)
}
```

**After** (parameter injection):
```typescript
export function fullPath(workspaceRoot: string, endPath: string): string {
  return path.join(workspaceRoot, endPath)
}
```

### Affected Functions

All file-ops functions updated to accept `workspaceRoot` as first parameter:

1. **`fullPath(workspaceRoot, endPath)`**
   - Joins workspace root with relative path
   - Used internally by other file-ops functions

2. **`isRootFile(workspaceRoot, uri)`**
   - Checks if file is in workspace root directory
   - Used by watchers for filtering

3. **`readDir(workspaceRoot, relativePath)`**
   - Reads directory contents relative to workspace root
   - Used by managers for scanning

4. **`readFile(workspaceRoot, file)`**
   - Reads file relative to workspace root
   - Uses `fullPath()` internally

5. **`writeFile(workspaceRoot, file, content, mode?)`**
   - Writes file relative to workspace root
   - Uses `fullPath()` internally

6. **`readSymlink(workspaceRoot, file)`**
   - Reads symlink target relative to workspace root
   - Uses `fullPath()` internally

7. **`statFile(workspaceRoot, file)`**
   - Gets file stats relative to workspace root
   - Uses `fullPath()` internally

### Caller Updates

**Managers** (6 files):
```typescript
// Import getWorkspaceRoot from extension/state
import { getWorkspaceRoot } from '../../extension/state'

// Pass to file-ops functions
export function read(): string {
  const content = readFile(getWorkspaceRoot(), FILE_NAMES.NEXT_SYMLINK_CONFIG)
  return content
}
```

**Commands** (4 files):
```typescript
// Receive workspaceRoot from caller
export async function generateApplyUnixScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  // Pass to file-ops functions
  await writeFile(workspaceRoot, relativePath, content, 0o755)
}
```

**Watchers** (3 files):
```typescript
// Import getWorkspaceRoot from extension/state
import { getWorkspaceRoot } from '../extension/state'

// Pass to filter functions
export function gitignoreWatcher() {
  const workspaceRoot = getWorkspaceRoot()
  const watcher = useFileWatcher({
    filters: (event) => isRootFile(workspaceRoot, event.uri),
    // ...
  })
}
```

## Rationale

### True Isolation

**Before**: Shared modules imported from application modules
- Created circular dependency potential
- Tied utilities to specific application structure
- Prevented extraction to npm packages

**After**: Shared modules are truly self-contained
- No dependencies on application modules
- Can be tested independently
- Ready for extraction to npm packages

### Explicit Data Flow

Parameter injection makes data flow explicit:
```typescript
// Clear: workspaceRoot comes from caller
readFile(workspaceRoot, 'config.json')

// Hidden: workspaceRoot comes from global state
readFile('config.json')  // Where does workspaceRoot come from?
```

### Testability

Functions can be tested with any `workspaceRoot` value:
```typescript
// Easy to test with different roots
expect(fullPath('/test/root', 'file.txt')).toBe('/test/root/file.txt')
expect(fullPath('/other/root', 'file.txt')).toBe('/other/root/file.txt')

// Hard to test with global state
// Would need to mock getWorkspaceRoot() for each test
```

### Reusability

File-ops module can now be extracted to npm package:
```typescript
// No application-specific dependencies
import { readFile, writeFile, fullPath } from '@bochurin/vscode-file-ops'

// Works in any VSCode extension
const content = readFile(workspaceRoot, 'config.json')
```

## Benefits

### Architecture

- **Clean Separation**: Application logic in `extension/`, utilities in `shared/`
- **No Circular Dependencies**: One-way dependency flow (extension → shared)
- **Clear Boundaries**: Module responsibilities are explicit

### Development

- **Easier Testing**: Functions can be unit tested without mocking global state
- **Better Debugging**: Explicit parameters show data flow
- **Simpler Reasoning**: No hidden dependencies to track

### Maintenance

- **Easier Refactoring**: Shared modules can be changed without affecting application
- **Package Extraction**: Utilities ready for npm package extraction
- **Code Reuse**: Same utilities can be used in other projects

## Trade-offs

### More Parameters

Functions now require `workspaceRoot` parameter:
- **Pro**: Explicit data flow
- **Pro**: No hidden dependencies
- **Con**: More verbose function calls
- **Mitigation**: Callers typically have workspaceRoot readily available

### Caller Responsibility

Callers must provide `workspaceRoot`:
- **Pro**: Clear ownership of data
- **Pro**: Easier to test callers
- **Con**: Callers must import `getWorkspaceRoot()`
- **Mitigation**: Most callers already import from state module

## Alternatives Considered

### Keep Imports in Shared

**Rejected** because:
- Violates separation of concerns
- Prevents true reusability
- Creates hidden dependencies
- Makes testing harder

### Create Shared State Module

**Rejected** because:
- State is application-specific, not reusable
- Would still create dependency on application structure
- Doesn't solve the fundamental issue

### Use Dependency Injection Container

**Rejected** because:
- Overkill for simple parameter passing
- Adds complexity without clear benefit
- Makes code harder to understand

## Related Decisions

- [State/Queue/Log Separation](state-queue-log-separation.md) - Foundation for this change
- [Shared Utilities Architecture](shared-utilities-architecture.md) - Original shared module design
- [File System Abstraction](file-system-abstraction.md) - File-ops module creation

## Future Considerations

### NPM Package Extraction

File-ops module ready for extraction:
- Package name: `@bochurin/vscode-file-ops`
- Zero dependencies on application code
- Reusable across VSCode extensions

### Other Shared Modules

Apply same pattern to other shared modules if needed:
- `shared/hooks/` - Already isolated
- `shared/factories/` - Already isolated
- `shared/config-ops/` - Uses VSCode API directly (acceptable)
- `shared/gitignore-ops/` - Pure functions (already isolated)

### Testing Strategy

Shared modules can now have comprehensive unit tests:
- Test with various `workspaceRoot` values
- No mocking required
- Fast, isolated tests
