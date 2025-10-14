# Symlink Config Extension - Development Progress

## Project Overview

**Goal**: VSCode extension for automated symlink management across project containers and workspaces  
**Approach**: Translate proven CVHere symlink system to TypeScript with VSCode integration  
**Current Phase**: Phase 1 Complete - TypeScript Implementation & Development Tools Setup

## Development Phases

### ✅ Phase 1: Extension Setup and Implementation (Completed - 01-02.10.2025)

#### 1.5 GitHub Repository Setup ✅

- **Date**: 02.10.2025
- **Status**: Complete
- **Details**:
  - Created GitHub repository: https://github.com/bochurin/symlink-config
  - Initial commit with complete CVHere TypeScript implementation
  - Documentation structure organized following CVHere approach
  - Project ready for community contributions and VSCode Marketplace publishing

#### 1.1 Extension Project Creation ✅

- **Date**: 01.10.2025
- **Status**: Complete
- **Details**:
  - Created VSCode extension using Yeoman generator
  - Name: `Symlink Config`
  - Description: `Automated symlink management for package.json files across project containers and workspaces`
  - Tech stack: TypeScript, Webpack, VSCode Extension API
  - Project structure established with proper configuration

#### 1.2 Context Migration ✅

- **Date**: 01.10.2025
- **Status**: Complete
- **Details**:
  - Documentation structure created (.docs folder)
  - AI prompt context established for consistent development
  - Core concepts documented from CVHere project
  - Collaborative workflow approach adopted
  - Progress tracking and decision documentation setup

#### 1.3 Initial Script Integration ✅

- **Date**: 01.10.2025
- **Status**: Complete (Later Replaced)
- **Details**:
  - Copied bash scripts from CVHere project
  - Adapted scripts for extension context
  - Created shared utilities directory
  - Updated extension.ts to call bash via child_process
  - Identified limitations of bash-based approach

#### 1.4 TypeScript Implementation ✅

- **Date**: 02.10.2025
- **Status**: Complete
- **Details**:
  - Complete TypeScript translation of CVHere symlink system
  - Created modular architecture with 5 core modules
  - Preserved all CVHere logic and edge cases
  - Enhanced with VSCode API integration
  - Eliminated bash dependencies for cross-platform compatibility

#### 1.6 CVHere Utilities Integration ✅

- **Date**: 02.10.2025
- **Status**: Complete
- **Details**:
  - Added structured commit workflow scripts (code-commit.sh, docs-commit.sh)
  - Integrated Amazon Q prompts menu system for AI assistance
  - Added init-jq.sh for cross-platform JSON parsing support
  - Enhanced package.json with commit workflow and Q menu scripts
  - Provides same development utilities as CVHere project

### ✅ Phase 1.24: Manager Architecture Refactoring and Import System Improvements (Completed - 10.10.2025)

- **Date**: 10.10.2025
- **Status**: Complete
- **Details**:
  - **Manager Folder Renaming**: Renamed all manager folders with descriptive suffixes for better clarity
  - **Import System Refactoring**: Replaced namespace imports with direct function imports throughout codebase
  - **Type System Improvements**: Enhanced file watcher hook with event parameter passing and flexible syntax
  - **Code Organization**: Eliminated artificial namespacing in favor of clean, direct imports
  - **Cross-Platform Compatibility**: Maintained all functionality while improving code structure

#### Technical Implementation Details

**Manager Folder Structure Improvements**:
```
// Before: Generic names
managers/gitignore/
managers/next-config/
managers/file-exclude/
managers/symlink-config/

// After: Descriptive names
managers/gitignore-file/
managers/next-config-file/
managers/file-exclude-settings/
managers/symlink-settings/
```

**Import System Refactoring**:
```typescript
// Before: Namespace imports with artificial scoping
import * as gitignoreManager from './managers/gitignore'
import * as nextConfigManager from './managers/next-config'
gitignoreManager.handleEvent()
nextConfigManager.handleEvent(event)

// After: Direct function imports
import { handleEvent as handleGitignoreEvent } from './managers/gitignore-file'
import { handleEvent as handleNextConfigEvent } from './managers/next-config-file'
handleGitignoreEvent()
handleNextConfigEvent(event)
```

**File Watcher Hook Enhancements**:
```typescript
// Enhanced Handler type to pass event information
type Handler = (uri: vscode.Uri, event: FileWatchEvent) => void

// Flexible event syntax supporting both single object and array
events?: {
  on: FileWatchEvent | FileWatchEvent[]
  handler: Handler | Handler[]
} | Array<{
  on: FileWatchEvent | FileWatchEvent[]
  handler: Handler | Handler[]
}>
```

**Type System Improvements**:
- **FileEvent → FileWatchEvent**: Renamed enum for better semantic clarity
- **GenerationMode → ExclusionPart**: More descriptive type naming
- **Event Parameter Passing**: File watchers now pass the actual event type to handlers
- **Flexible Syntax**: Support for both single objects and arrays in event configuration

**Code Quality Enhancements**:
- **Eliminated Namespace Pollution**: Removed `* as managerName` imports throughout codebase
- **Direct Function Access**: Clean, explicit function imports with descriptive aliases
- **Better Tree Shaking**: Webpack can now optimize imports more effectively
- **Consistent Patterns**: Unified import style across all modules

**Cross-Manager Dependencies**:
```typescript
// Clean cross-manager imports
import { make as makeGitignore } from '../gitignore-file'
import { make as makeExclusion, ExclusionPart } from '../file-exclude-settings'
```

**Benefits**:
- **Self-Documenting Code**: Folder names clearly indicate their purpose
- **Cleaner Imports**: No artificial namespacing, direct function access
- **Better Maintainability**: Clear separation of concerns with descriptive naming
- **Improved Performance**: Better tree-shaking with explicit imports
- **Enhanced Developer Experience**: More intuitive code navigation and understanding

**Breaking Changes**:
- **Folder Structure**: All manager folders renamed with descriptive suffixes
- **Import Paths**: All imports updated to use new folder names
- **Type Names**: FileEvent → FileWatchEvent, GenerationMode → ExclusionPart
- **Import Style**: Namespace imports replaced with direct function imports

### ✅ Phase 1.23: Tree View Development and VSCode Icon Integration (Completed - 09.10.2025)

- **Date**: 09.10.2025
- **Status**: Complete
- **Details**:
  - **Tree View Implementation**: Complete symlink configuration tree view with targets/sources mode switching
  - **VSCode Icon Integration**: Proper resourceUri usage for theme-based file/folder icons with CollapsibleState dependency
  - **Code Organization**: Decomposed tree provider into modular components (tree-item, config-loader, tree-builder, tree-sorter, types)
  - **Type Safety Improvements**: Replaced 'any' types with proper TypeScript interfaces and eliminated Map<any> usage
  - **Icon System Discovery**: Documented VSCode TreeItem icon behavior dependency on CollapsibleState for directories
  - **Tooltip Management**: Implemented proper tooltip handling to prevent "undefined" tooltips

#### Technical Implementation Details

**Tree View Architecture**:
```typescript
// Main components:
// - SymlinkTreeProvider: VSCode TreeDataProvider implementation
// - tree-render.ts: Converts TreeNode structure to SymlinkTreeItem objects
// - tree-item.ts: VSCode TreeItem extension with proper icon handling
// - types.ts: Centralized type definitions
```

**VSCode Icon Integration Discovery**:
- **Files**: `resourceUri` + `CollapsibleState.None` → Theme file icon based on extension
- **Directories**: `resourceUri` + `CollapsibleState.Collapsed/Expanded` → Theme folder icon
- **Critical Finding**: Directories with `CollapsibleState.None` are treated as files by VSCode

**Type Safety Enhancements**:
```typescript
// Before: Map<any> and any parameters
const configEntries = new Map()
function createNode(isLeaf: boolean, configEntry: any): TreeNode

// After: Proper typing
const configEntries = new Map<string, SymlinkEntry & { status: SymlinkStatus }>()
function createNode(isLeaf: boolean, configEntry: SymlinkEntry & { status: SymlinkStatus }): TreeNode
```

**Modular Tree Architecture**:
- **tree-data-provider.ts**: Main VSCode integration and tree root management
- **tree-render.ts**: Pure function for converting tree structure to display items
- **tree-item.ts**: VSCode TreeItem wrapper with icon and tooltip handling
- **generate/**: Tree building logic (generate.ts, sort-tree.ts, parse-config.ts)

**Icon System Implementation**:
```typescript
// Proper resourceUri usage for theme icons
if (props.iconPath) {
  this.resourceUri = vscode.Uri.file(`${props.iconPath}`)
}

// CollapsibleState determines icon type
const collapsibleState = hasChildren
  ? vscode.TreeItemCollapsibleState.Expanded
  : treeNode.type === 'dir'
    ? vscode.TreeItemCollapsibleState.Collapsed  // Required for folder icons
    : vscode.TreeItemCollapsibleState.None
```

**Tooltip Management**:
- **Conditional Assignment**: Only set tooltips when meaningful content exists
- **Fallback Prevention**: Avoid setting tooltip to undefined to prevent "undefined" display
- **Status-Based Content**: Different tooltips for new/deleted/unchanged symlinks

**Code Quality Improvements**:
- **Function Extraction**: Moved `treeToItems` to separate `tree-render.ts` module
- **Type Consistency**: Unified `SymlinkEntry` vs `SymlinkConfigEntry` naming
- **Import Organization**: Clean module boundaries and dependencies
- **Error Handling**: Proper handling of undefined values in tree generation

**Breaking Changes**:
- **Tree Provider**: Refactored from monolithic class to modular architecture
- **Icon Handling**: Changed from emoji-based to VSCode theme icon system
- **Type System**: Stricter typing throughout tree components

**Benefits**:
- **Native VSCode Experience**: Icons match user's current theme and file associations
- **Maintainable Code**: Modular architecture with single-responsibility components
- **Type Safety**: Eliminated any types and improved compile-time error detection
- **Performance**: Efficient tree rendering with proper VSCode integration
- **User Experience**: Consistent visual experience with VSCode's native file explorer

## Technical Implementation

### Core Modules Created

1. **`types.ts`** - TypeScript interfaces matching CVHere system
   - SymlinkConfig, SymlinkEntry, SymlinkMode, SymlinkType
   - ProcessResult for structured operation responses

2. **`utils.ts`** - Path resolution and cross-platform utilities
   - @-syntax path resolution (CVHere convention)
   - Windows detection and path normalization
   - Exclude pattern filtering

3. **`gitignore.ts`** - SymLinks block management
   - Append entries to .gitignore with block support
   - Extract existing symlinks from SymLinks blocks
   - Non-destructive .gitignore processing

4. **`creator.ts`** - Cross-platform symlink creation
   - Unix native symlink creation (fs.symlinkSync)
   - Windows batch file generation for Administrator execution
   - Dry run mode support

5. **`manager.ts`** - Main processing logic from CVHere process-path.sh
   - Recursive directory processing
   - Configuration loading and validation
   - Order of operations: Clean → Process → Recurse → Windows batch

6. **`extension.ts`** - VSCode integration
   - Command registration (Create All, Clean All, Dry Run)
   - Status bar integration
   - Output channel for detailed logging
   - Proper error handling and user notifications

### CVHere Logic Preservation

#### Distributed Architecture ✅

- Local `symlink.config.json` files per directory
- Recursive processing with exclude pattern support
- Autonomous directory-level symlink management

#### Cross-Platform Support ✅

- Windows batch file generation with timestamps
- Unix direct symlink creation
- Proper path normalization per platform

#### .gitignore Management ✅

- SymLinks block format: `# SymLinks` ... `# End SymLinks`
- Non-destructive reading of existing entries
- Automated local .gitignore handling

#### Path Resolution ✅

- @-syntax for project root relative paths
- Regular paths relative to config directory
- Cross-platform path handling

#### Processing Order ✅

1. Clean old symlinks from .gitignore SymLinks blocks
2. Process new symlinks from configuration
3. Recurse into subdirectories with exclude filtering
4. Generate Windows batch file if needed

### VSCode Integration Features

#### Commands ✅

- **`symlink-config.createAll`** - Create all symlinks (full mode)
- **`symlink-config.cleanAll`** - Remove old symlinks (clean mode)
- **`symlink-config.dryRun`** - Preview changes (dry mode)

#### User Interface ✅

- **Status Bar Item** - Quick access with symlink icon
- **Command Palette** - Professional command registration
- **Output Channel** - Detailed operation logging
- **Notifications** - Success/error feedback
- **Tree View** - Visual symlink configuration display with targets/sources modes

#### Error Handling ✅

- Structured ProcessResult responses
- Graceful failure handling
- User-friendly error messages
- Detailed logging for debugging

## Configuration Support

### Symlink Configuration Format

```json
{
  "directories": [{ "target": "sl-shared", "source": "@shared" }],
  "files": [{ "target": "sl-package.json", "source": "@containers/backend/package.json" }],
  "exclude_paths": ["node_modules", ".git"]
}
```

### Path Resolution Examples

- `@shared/types` → Project root relative path
- `../shared/config` → Config directory relative path
- Cross-platform path normalization

### .gitignore Integration

```
# SymLinks
sl-shared
sl-package.json
# End SymLinks
```

## Phase 2: Testing and Refinement (Next)

### Planned Activities

- **Functionality Testing** - Validate all symlink operations
- **Cross-Platform Testing** - Windows, macOS, Linux compatibility
- **Error Scenario Testing** - Permission issues, invalid configs
- **Performance Testing** - Large project handling
- **User Experience Testing** - Command usability, feedback clarity

### Enhancement Opportunities

- **Configuration Validation** - JSON schema validation
- **Settings Panel** - Extension configuration options
- **Workspace Detection** - Auto-detect symlink configurations
- **Batch Operations** - Multi-workspace symlink management
- **NPM Package** - Extract file watcher hooks (`useFileWatcher`, `useConfigWatcher`) into standalone npm package for VSCode extension developers

### ✅ Phase 1.25: Windows Batch Script Optimization (Completed - 10.10.2025)

- **Date**: 10.10.2025
- **Status**: Complete
- **Details**:
  - **Batch Script Generation**: Fixed Windows batch script line ending issues by using raw text output
  - **Command Visibility**: Added @echo off with proper echo statements for command visibility
  - **Script Structure**: Improved generation using array of lines instead of string concatenation
  - **Path Handling**: Fixed file path handling to prevent embedded newlines in batch commands
  - **Error Checking**: Enhanced error checking and directory creation in batch scripts
  - **Cross-Platform**: Maintained Unix direct execution while optimizing Windows batch approach

### ✅ Phase 1.26: Unix Script Generation and Modular Architecture (Completed - 12.10.2025)

- **Date**: 12.10.2025
- **Status**: Complete
- **Details**:
  - **Unix Script Generation**: Added shell script generation with executable permissions for cross-platform consistency
  - **Modular Architecture**: Decomposed apply-configuration into focused modules (types, collect-operations, generate-windows-script, generate-unix-script)
  - **Script Generation Setting**: Added VSCode configuration option with "windows-only", "unix-only", "both", "auto" modes
  - **Platform-Aware Execution**: Only offer run options for current OS, always allow "Open in Code"
  - **Type-Safe Manager**: Enhanced symlink-settings manager with union types and centralized defaults
  - **Consistent Workflow**: Same script generation approach across Windows, macOS, and Linux

### ✅ Phase 1.27: Symlink Path Mode Implementation and Documentation Fixes (Completed - 12.10.2025)

- **Date**: 12.10.2025
- **Status**: Complete
- **Details**:
  - **Symlink Path Mode Setting**: Added `symlinkPathMode` configuration with "relative" and "absolute" options
  - **Current-Config Consistency**: Fixed current-config generator to always use @-paths from workspace root
  - **Apply-Configuration Enhancement**: Updated script generators to respect path mode setting for actual symlink creation
  - **Symlink Status Detection**: Fixed tree view to properly show unchanged/new/deleted status instead of all "new"
  - **Type Safety Improvements**: Removed CONFIG_PARAMETERS.EXCLUDE from SymlinkSettingsParameter type
  - **Documentation Actualization**: Fixed function name inconsistencies across all documentation files
  - **Manager Architecture Updates**: Corrected outdated file names and function references in decision documents

### ✅ Phase 1.28: File Watcher Enhancement and Filter System (Completed - 12.10.2025)

- **Date**: 12.10.2025
- **Status**: Complete
- **Details**:
  - **Filter System Enhancement**: Updated file watcher hook to pass both uri and event parameters to filter functions
  - **Shared Filter Functions**: Moved isSymlink and isRootFile to shared/file-ops for reusability across modules
  - **Intermediate Callbacks**: Implemented adapter pattern `(uri, event) => isRootFile(uri)` for signature compatibility
  - **Debouncing Support**: Enhanced file watcher with configurable debouncing to prevent cascading regenerations
  - **Performance Optimization**: Added filtering capabilities to reduce unnecessary event processing during script execution
  - **Code Organization**: Centralized filter functions in shared utilities for better maintainability

### ✅ Phase 1.29: Clear Configuration Feature (Completed - 12.10.2025)

- **Date**: 12.10.2025
- **Status**: Complete
- **Details**:
  - **Clear Command**: Added clearConfiguration command to remove symlinks based on current.symlink.config.json
  - **Clear Scripts**: Implemented generateClearWindowsScript and generateClearUnixScript for cross-platform support
  - **UI Integration**: Added trash icon button to tree view title bar next to apply button
  - **Confirmation Dialogs**: Added modal confirmation dialogs for both apply and clear operations
  - **Shared Utilities**: Created confirm() and confirmWarning() functions in shared/vscode for reusable dialogs
  - **File Management**: Updated gitignore and file-exclude managers to handle clear script files
  - **Parameterized Admin Script**: Single admin.symlinks.bat script accepts script name as parameter for both apply and clear operations
  - **Script Generation**: Admin launcher generated automatically with apply scripts
  - **Execution Options**: Modal dialogs with "Open in Code" and "Run as Admin/Now" options
  - **Clipboard Integration**: Script names copied to clipboard on Windows for easy access

### ✅ Phase 1.30: File Watcher Event Accumulation and Symlink Detection Fix (Completed - 13.10.2025)

- **Date**: 13.10.2025
- **Status**: Complete
- **Details**:
  - **Symlink Detection Fix**: Fixed isSymlink to use bitwise AND for type checking (handles 66 = SymbolicLink|Directory)
  - **Event Accumulation**: Enhanced file watcher to accumulate events during debounce window
  - **Handler Signature**: Changed handler signature to always receive array of events for consistency
  - **Admin Script Utility**: Extracted admin script generation into shared utility function
  - **Architecture Improvement**: Moved user interaction logic from generate functions to main command functions
  - **Script Optimization**: Removed redundant config copying from apply scripts (extension watches real symlinks)
  - **Clear Script Fix**: Fixed Windows clear script to properly remove symlinks
  - **Future Planning**: Added npm package plan for file watcher hooks to future enhancements

### ✅ Phase 1.31: File System Abstraction (Completed - 13.10.2025)

- **Date**: 13.10.2025
- **Status**: Complete
- **Details**:
  - **Centralized File Operations**: Created abstraction layer in shared/file-ops for all file system operations
  - **New Functions**: Added readDir, readSymlink, statFile functions wrapping fs operations
  - **Enhanced writeFile**: Added optional mode parameter for Unix executable permissions (0o755)
  - **Architecture Rule**: Only shared/file-ops module uses fs directly; all other code uses abstractions
  - **Code Organization**: Removed all direct fs usage from managers and commands
  - **Consistent Error Handling**: Unified approach to file operation failures across codebase
  - **Better Testability**: Centralized file operations enable easier mocking and unit testing

#### Technical Implementation Details

**Symlink Detection Fix**:
```typescript
// Before: Exact equality check
return stats.type === vscode.FileType.SymbolicLink

// After: Bitwise AND check
return (stats.type & vscode.FileType.SymbolicLink) !== 0
// Handles: 65 (64|1) = file symlink, 66 (64|2) = directory symlink
```

**Event Accumulation**:
```typescript
// Handler signature changed
type Handler = (events: FileEventData[]) => void

// With debouncing: accumulates all filtered events
accumulatedEvents.push({ uri, event })
handlers.forEach((handler) => handler(events))

// Without debouncing: single-item array
handlers.forEach((handler) => handler([{ uri, event }]))
```

**Architecture Improvements**:
- **Generate functions**: Only create scripts (no user interaction)
- **Command functions**: Handle dialogs, clipboard, terminal execution
- **Shared utilities**: `generateAdminScript()` used by both apply and clear

**Benefits**:
- **Reliable Symlink Detection**: Correctly identifies both file and directory symlinks
- **Event Processing**: Can process all accumulated events if needed
- **Consistent API**: Handlers always receive arrays for uniform processing
- **Better Organization**: Clear separation between script generation and user interaction
- **Code Reusability**: Shared admin script generation eliminates duplication

### ✅ Phase 1.32: Command Organization and Naming Improvements (Completed - 14.10.2025)

- **Date**: 14.10.2025
- **Status**: Complete
- **Details**:
  - **Legacy Command Removal**: Removed unused commands (createAll, cleanAll, dryRun) from package.json
  - **Command Palette Organization**: Added proper entries for applyConfiguration and cleanConfiguration
  - **Command Renaming**: Renamed createSymlink to selectSymlinkSource for clarity
  - **UI Command Hiding**: Hidden UI-only commands from Command Palette with "when": "false"
  - **Clean Command Palette**: Only 2 commands visible: Apply Configuration and Clean Configuration
  - **Context Menu Access**: All other commands accessible through context menus and tree view buttons

#### Technical Implementation Details

**Command Palette Visibility Control**:
```json
// Visible commands
{
  "command": "symlink-config.applyConfiguration",
  "when": "workspaceFolderCount > 0"
}

// Hidden commands
{
  "command": "symlink-config.openSettings",
  "when": "false"
}
```

**Command Renamings**:
- `createSymlink` → `selectSymlinkSource` (function and command ID)
- Legacy commands removed: `createAll`, `cleanAll`, `dryRun`

**Benefits**:
- **Cleaner UX**: Users see only essential commands in Command Palette
- **Better Organization**: Commands grouped by access method (palette vs context menu)
- **Consistent Naming**: Command names clearly describe their purpose
- **Reduced Confusion**: No legacy/unused commands cluttering the interface

### ✅ Phase 1.33: Symlink Selection Validation (Completed - 14.10.2025)

- **Date**: 14.10.2025
- **Status**: Complete
- **Details**:
  - **Context Menu Filtering**: Added `!resourceIsSymlink` condition to prevent symlink selection
  - **Runtime Validation**: Added `isSymlink()` checks in command handlers
  - **User Warnings**: Clear warning messages when attempting to select symlinks
  - **Async Updates**: Changed `selectSymlinkTarget` to async for validation support
  - **Circular Reference Prevention**: Prevents invalid symlink configurations

#### Technical Implementation Details

**Context Menu Conditions**:
```json
{
  "command": "symlink-config.selectSymlinkSource",
  "when": "... && !resourceIsSymlink && ..."
}
```

**Runtime Validation**:
```typescript
export async function selectSymlinkSource(uri: vscode.Uri) {
  if (await isSymlink(uri)) {
    vscode.window.showWarningMessage('Cannot select a symlink as source.')
    return
  }
  // ... rest of logic
}
```

**Benefits**:
- **Prevents Invalid Configs**: Users cannot create circular symlink references
- **Clear Feedback**: Warning messages explain why selection is blocked
- **Dual Protection**: Both UI filtering and runtime validation
- **Better UX**: Commands don't appear on symlinks in context menu

## Current Status

**Phase**: Phase 1.33 Complete - Symlink Selection Validation  
**Branch**: `main`  
**Version**: 0.0.42  
**Latest**: Prevented symlink selection as source/target with validation  
**Extension Status**: Core development complete, ready for comprehensive testing  
**Next**: Cross-platform testing and validation (Phase 2)

## Extension Completion Summary

**Development Complete**: All core functionality implemented and integrated
- ✅ Complete CVHere symlink system translation to TypeScript
- ✅ Cross-platform symlink creation (Windows batch files, Unix direct execution)
- ✅ VSCode native integration (commands, tree view, status bar, settings)
- ✅ File watcher system with filtering and debouncing
- ✅ Configuration management with user preferences
- ✅ Interactive symlink creation workflow
- ✅ Script generation for both Windows and Unix platforms (apply and clear)
- ✅ Confirmation dialogs for destructive operations
- ✅ Comprehensive documentation and decision tracking

**Ready for Phase 2**: Comprehensive testing, performance validation, and marketplace preparation

**Technical Foundation**:

- ✅ All CVHere symlink logic preserved and enhanced
- ✅ Pure TypeScript implementation (no bash dependencies)
- ✅ Cross-platform compatibility maintained
- ✅ VSCode native integration complete
- ✅ Professional extension structure established
- ✅ Tree view with theme icon integration

**Ready for**: Comprehensive testing and user experience refinement

_Based on proven symlink management system from CVHere project with 100% functionality preservation and enhanced VSCode integration._