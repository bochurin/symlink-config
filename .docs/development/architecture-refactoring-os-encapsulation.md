# Architecture Refactoring: OS Module Encapsulation and Script Generation

**Date**: 24.10.2025  
**Version**: 0.0.86  
**Phase**: Architecture Cleanup

## Overview

Refactored script generation system to properly encapsulate OS-specific logic and pass target OS as parameter instead of detecting current OS.

## Key Changes

### 1. OS Module Encapsulation

**Problem**: Direct `os` module usage scattered throughout script generation code violated architecture rule that only `shared/file-ops` should use OS modules.

**Solution**: 
- Created `isWindows()` utility in `shared/file-ops/is-windows.ts`
- Replaced all `os.platform() === 'win32'` calls with `isWindows()` function
- Eliminated all direct `os` imports from script generation modules

### 2. Target OS Parameter Pattern

**Problem**: Script generation was based on current OS, not the target OS for which scripts are being generated. This prevented generating Windows scripts on Unix and vice versa.

**Solution**: Added `targetOS: 'windows' | 'unix'` parameter throughout script generation chain:

**Files Updated**:
- `scripts/apply-script.ts` - Accepts targetOS parameter
- `scripts/clean-script.ts` - Accepts targetOS parameter
- `scripts/shared/script-structure/header.ts` - Accepts targetOS parameter
- `scripts/shared/script-structure/footer.ts` - Accepts targetOS parameter
- `scripts/shared/script-structure/line-ending.ts` - Accepts targetOS parameter
- `scripts/shared/script-structure/file-permissions.ts` - Accepts targetOS parameter
- `scripts/shared/operations/create-directory.ts` - Accepts targetOS parameter
- `scripts/shared/operations/create-symlink.ts` - Accepts targetOS parameter
- `scripts/shared/operations/remove-symlink.ts` - Accepts targetOS parameter
- `scripts/shared/if-blocks.ts` - All functions accept targetOS parameter
- `scripts/shared/remove-file.ts` - Accepts targetOS parameter
- `scripts/shared/path/directory.ts` - Accepts targetOS parameter
- `scripts/shared/path/target.ts` - Accepts targetOS parameter
- `scripts/shared/path/source.ts` - Accepts targetOS parameter
- `scripts/shared/path/os-specific-path.ts` - Accepts targetOS parameter

**Caller Updates**:
- `apply-config.ts` - Determines targetOS from current platform, passes to applyScript
- `clean-config.ts` - Determines targetOS from current platform, passes to cleanScript

### 3. OS-Specific Path Formatting

**Problem**: `osSpecificPath()` was in `shared/file-ops` but is script-generation specific (formats paths for batch/shell script content).

**Solution**:
- Moved `osSpecificPath()` from `shared/file-ops/` to `scripts/shared/path/`
- Updated function to accept `targetOS` parameter
- Updated all callers to pass targetOS

### 4. Unnecessary OS Checks Removed

**Simplified Functions**:
- `footer()` - Removed OS check, both platforms use same `echo "Done!"` syntax

### 5. Type System Simplification

**SymlinkOperation Interface**:
- Made `source` property required (was optional)
- Rationale: Even delete operations have source information from current.symlink-config.json
- Removed unnecessary `|| ''` fallbacks and `!` assertions
- Simplified operation creation logic in `collect-operations.ts`

### 6. Workspace Root from State

**createSymlink Function**:
- Removed `workspaceRoot` parameter
- Now uses `getWorkspaceRoot()` from state
- Cleaner function signature, consistent with other operations

## Architecture Benefits

### Clear Separation of Concerns
- **File Operations** (`shared/file-ops/`) - OS detection, file system operations
- **Script Generation** (`scripts/`) - Formatting paths for script content, target OS-based logic

### Proper Abstraction Layers
- Only `shared/file-ops/` uses `os` and `fs` modules directly
- Script generation uses abstractions and receives target OS as parameter
- Application code uses both abstractions appropriately

### Cross-Platform Script Generation
- Can generate Windows scripts on Unix systems
- Can generate Unix scripts on Windows systems
- Respects `scriptGenerationOS` setting properly

## Implementation Details

### isWindows() Utility

```typescript
// shared/file-ops/is-windows.ts
import * as os from 'os'

export function isWindows(): boolean {
  return os.platform() === 'win32'
}
```

### Target OS Parameter Flow

```typescript
// apply-config.ts
const isWindows = os.platform() === 'win32'
const targetOS = isWindows ? 'windows' : 'unix'
await applyScript(operations, workspaceRoot, targetOS)

// apply-script.ts
export async function applyScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
  targetOS: 'windows' | 'unix',
) {
  const scriptName = targetOS === 'windows'
    ? FILE_NAMES.APPLY_SYMLINKS_BAT
    : FILE_NAMES.APPLY_SYMLINKS_SH
  const lines = header(workspaceRoot, 'Applying...', targetOS)
  // ... operations
  lines.push(...footer(targetOS))
  const content = lines.flat().join(lineEnding(targetOS))
  await writeFile(workspaceRoot, scriptName, content, filePermissions(targetOS))
}
```

### OS-Specific Path Formatting

```typescript
// scripts/shared/path/os-specific-path.ts
export function osSpecificPath(
  pathString: string,
  targetOS: 'windows' | 'unix',
): string {
  return targetOS === 'windows' ? pathString.replace(/\//g, '\\\\') : pathString
}
```

## Files Modified

### Shared Utilities
- `shared/file-ops/is-windows.ts` (created)
- `shared/file-ops/index.ts` (added isWindows export)

### Script Generation
- `scripts/apply-script.ts`
- `scripts/clean-script.ts`
- `scripts/shared/script-structure/header.ts`
- `scripts/shared/script-structure/footer.ts`
- `scripts/shared/script-structure/line-ending.ts`
- `scripts/shared/script-structure/file-permissions.ts`
- `scripts/shared/operations/create-directory.ts`
- `scripts/shared/operations/create-symlink.ts`
- `scripts/shared/operations/remove-symlink.ts`
- `scripts/shared/if-blocks.ts`
- `scripts/shared/remove-file.ts`
- `scripts/shared/path/directory.ts`
- `scripts/shared/path/target.ts`
- `scripts/shared/path/source.ts`
- `scripts/shared/path/os-specific-path.ts` (moved from file-ops)

### Commands
- `commands/apply-configuration/apply-config.ts`
- `commands/apply-configuration/clean-config.ts`

### Types
- `commands/apply-configuration/utils/types.ts` (made source required)
- `commands/apply-configuration/utils/collect-operations.ts` (simplified)

## Testing

Build successful: 240 KiB bundle, 148 modules compiled without errors.

## Future Considerations

- Script generation setting could support generating for specific OS regardless of current platform
- Could add validation to ensure targetOS matches generated script file extension
- Consider extracting script generation to separate module for better isolation
