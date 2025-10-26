# Script Generation Modules

## Overview

Script generation modules create platform-specific batch/shell scripts for symlink operations. All functions accept `targetOS: 'windows' | 'unix'` parameter to generate scripts for target platform.

## Main Scripts

### `src/commands/apply-configuration/scripts/apply-script.ts`
**Functions:**
- `applyScript(operations: SymlinkOperation[], workspaceRoot: string, targetOS: 'windows' | 'unix'): Promise<void>`

**Implementation:**
- Generates script name based on targetOS
- Calls header, operations, footer with targetOS
- Joins lines with platform-specific line endings
- Writes script with platform-specific permissions

### `src/commands/apply-configuration/scripts/clean-script.ts`
**Functions:**
- `cleanScript(workspaceRoot: string, targetOS: 'windows' | 'unix'): Promise<void>`

**Implementation:**
- Filters delete operations from collectOperations()
- Generates clean script for target platform
- Uses removeSymlink operation with targetOS

## Script Structure

### `src/commands/apply-configuration/scripts/utils/script-structure/`

#### `header.ts`
**Functions:**
- `header(workspaceRoot: string, message: string, targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Windows: `@echo off`, `cd /d`, echo message
- Unix: `#!/bin/bash`, echo message
- Uses osSpecificPath for workspace root formatting

#### `footer.ts`
**Functions:**
- `footer(targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Returns `['', 'echo "Done!"', '']` (same for both platforms)

#### `line-ending.ts`
**Functions:**
- `lineEnding(targetOS: 'windows' | 'unix'): string`

**Returns:**
- Windows: `'\\r\\n'`
- Unix: `'\\n'`

#### `file-permissions.ts`
**Functions:**
- `filePermissions(targetOS: 'windows' | 'unix'): number | undefined`

**Returns:**
- Windows: `undefined`
- Unix: `0o755` (executable)

## Operations

### `src/commands/apply-configuration/scripts/utils/operations/`

#### `create-symlink.ts`
**Functions:**
- `createSymlink(operation: SymlinkOperation, targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Gets workspace root from state
- Resolves source path with targetOS
- Windows: `mklink /D` for directories, `mklink` for files
- Unix: `ln -sf` for all symlinks

#### `create-directory.ts`
**Functions:**
- `createDirectory(targetDir: string, targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Windows: `if not exist` + `mkdir`
- Unix: `if [ ! -d ]` + `mkdir -p`
- Uses if-blocks with targetOS

#### `remove-symlink.ts`
**Functions:**
- `removeSymlink(target: string, workspaceRoot: string, isDirectory: boolean, targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Windows: `fsutil reparsepoint query` for detection, `rmdir /q` or `del /q`
- Unix: `[ -L ]` for detection, `rm -rf`
- Skips real files/directories with echo message

## Path Formatting

### `src/commands/apply-configuration/scripts/utils/path/`

#### `os-specific-path.ts`
**Functions:**
- `osSpecificPath(pathString: string, targetOS: 'windows' | 'unix'): string`

**Implementation:**
- Windows: Replaces `/` with `\\\\` for batch script content
- Unix: Returns path unchanged
- **Note**: Script-specific, not in file-ops (formats for script content, not file operations)

#### `directory.ts`
**Functions:**
- `directoryPath(targetPath: string, targetOS: 'windows' | 'unix'): string`

**Implementation:**
- Extracts directory with `path.dirname()`
- Formats with `osSpecificPath()`

#### `target.ts`
**Functions:**
- `targetPath(targetPath: string, workspaceRoot: string, targetOS: 'windows' | 'unix'): string`

**Implementation:**
- Formats path with `osSpecificPath()`

#### `source.ts`
**Functions:**
- `sourcePath(source: string, target: string, workspaceRoot: string, targetOS: 'windows' | 'unix'): { sourcePath: string; symlinkSource: string }`

**Implementation:**
- Reads symlinkPathMode setting (absolute/relative)
- Resolves @ paths to workspace root
- Calculates relative paths if needed
- Formats both paths with `osSpecificPath()`

## Conditional Logic

### `src/commands/apply-configuration/scripts/utils/if-blocks.ts`

**Functions:**
- `ifExists(path: string, actions: string[], targetOS: 'windows' | 'unix'): string[]`
- `ifNotExists(path: string, actions: string[], targetOS: 'windows' | 'unix', elseActions?: string[]): string[]`
- `ifDirectoryNotExists(path: string, actions: string[], targetOS: 'windows' | 'unix'): string[]`
- `ifSourceExistsElseError(sourcePath: string, actions: string[], errorMessage: string, targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Windows: `if exist`, `if not exist` syntax
- Unix: `if [ -e ]`, `if [ ! -e ]`, `if [ ! -d ]` syntax
- Indents actions with 2 spaces
- Supports optional else blocks

### `src/commands/apply-configuration/scripts/utils/remove-file.ts`

**Functions:**
- `removeFile(targetPath: string, target: string, targetOS: 'windows' | 'unix'): string[]`

**Implementation:**
- Formats path with `osSpecificPath()`
- Uses `ifExists()` with targetOS
- Windows: `rmdir` with fallback to `del`
- Unix: `rm -rf`

## Architecture Notes

### Target OS Pattern
- All script generation functions accept `targetOS` parameter
- Enables generating Windows scripts on Unix and vice versa
- Respects `scriptGenerationOS` setting
- Current OS determined in apply-config.ts/clean-config.ts, passed down

### Separation of Concerns
- **File Operations** (`shared/file-ops/`) - OS detection, file system operations
- **Script Generation** (`scripts/`) - Formatting paths for script content, target OS-based logic
- Only file-ops uses `os` module directly
- Script generation uses abstractions and receives target OS as parameter

### Path Formatting
- `osSpecificPath()` is script-specific (formats for batch/shell content)
- Not in file-ops because it's not for file operations
- Windows needs `\\\\` in script content for proper batch file parsing
- Unix uses forward slashes unchanged

