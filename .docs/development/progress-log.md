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
- **Tree View Integration** - Visual symlink status in explorer
- **Settings Panel** - Extension configuration options
- **Workspace Detection** - Auto-detect symlink configurations
- **Batch Operations** - Multi-workspace symlink management

### ✅ Phase 1.7: Architecture Refactoring and File Watcher System (Completed - 02.10.2025)

- **Date**: 02.10.2025
- **Status**: Complete
- **Details**:
  - **Architecture Refactoring**: Converted from class-based to functional approach for better maintainability
  - **File Watcher System**: Implemented comprehensive file watching for symlink configs, next config, gitignore, and git repository changes
  - **Project Reorganization**: Restructured codebase with managers/, hooks/, and types/ directories
  - **Infinite Loop Fix**: Resolved GitignoreManager infinite loop issue with state tracking
  - **Code Simplification**: Removed unnecessary create\* wrapper functions, simplified extension entry point
  - **File Naming**: Shortened file-watcher-_ to watcher-_ for cleaner naming convention

#### Technical Implementation Details

**File Watcher System Components**:

1. **`set-watchers.ts`** - Main orchestrator for all file watchers
2. **`hooks/use-file-watcher.ts`** - Reusable file watcher utility supporting single/multiple event handlers
3. **`managers/gitignore/`** - Manages gitignore sections with Begin/End markers, includes state tracking
4. **`managers/next-config/`** - Manages next.symlink.config.json generation from distributed configs

**Watcher Patterns**:

- `**/symlink.config.json` - Distributed config files
- `next.symlink.config.json` - Root-level next config
- `**/.gitignore` - Gitignore files
- `.git` - Git repository changes

**State Tracking Solution**:

- Both NextConfigManager and GitignoreManager use `lastWrittenContent` to distinguish between their own changes and manual user changes
- Prevents infinite loops when watchers trigger their own file changes
- Uses regex-based section management for gitignore instead of line-by-line parsing

**Functional Architecture Benefits**:

- Cleaner, more composable code structure
- Better separation of concerns
- Easier testing and maintenance
- Reduced complexity with direct exports instead of factory functions

### ✅ Phase 1.12: Hook Interface Improvements and Auto-Detection (Completed - 04.10.2025)

- **Date**: 04.10.2025
- **Status**: Complete
- **Details**:
  - **Simplified Configuration Hook**: Single `onChange` handler with value/old_value payload
  - **Automatic Event Detection**: File watchers auto-detect what events to watch based on handlers
  - **Cleaner Interface**: Removed redundant watch\* configuration properties
  - **Intuitive API**: No handler provided = event ignored automatically
  - **Parameter Naming**: Consistent `payload` parameter naming for configuration changes

#### Technical Implementation Details

**Configuration Hook Simplification**:

```typescript
// Before: Separate onEnable/onDisable handlers
{
  onEnable: (data) => manager.handleEvent('inited'),
  onDisable: (data) => manager.handleEvent('disabled')
}

// After: Single onChange handler with payload
{
  onChange: (payload) => {
    manager.handleEvent(payload.value ? 'inited' : 'disabled')
  }
}
```

**Automatic File Watcher Detection**:

```typescript
// Before: Explicit watch configuration
useFileWatcher({
  pattern: '**/.gitignore',
  watchCreate: false,
  onChange: () => handler(),
  onDelete: () => handler()
})

// After: Automatic detection
useFileWatcher({
  pattern: '**/.gitignore',
  onChange: () => handler(), // Automatically watches CHANGE
  onDelete: () => handler() // Automatically watches DELETE
  // No onCreate = automatically IGNORES CREATE
})
```

**Hook Logic Enhancement**:

- **Handler presence detection**: `!config.onCreate` determines if create events should be ignored
- **Zero configuration**: Just specify handlers, watching is automatic
- **Performance optimization**: Only watches events that have handlers
- **Self-documenting**: Configuration clearly shows what events are handled

**Interface Improvements**:

- **Payload object**: `{ value: any, old_value: any }` provides full context
- **Consistent naming**: `payload` parameter name across all handlers
- **Cleaner conditionals**: Ternary operators for simple enable/disable logic
- **Reduced boilerplate**: No need to specify what not to watch

### ✅ Phase 1.11: Workspace Manager and Configuration Hooks (Completed - 04.10.2025)

- **Date**: 04.10.2025
- **Status**: Complete
- **Details**:
  - **Workspace Manager**: New manager for VSCode workspace settings management
  - **Files.exclude Management**: Automatically hides service files from Explorer when enabled
  - **Configuration Hooks**: Created `useConfigWatcher` hook for parameter-handler pairs
  - **Event-Driven Configuration**: Managers respond to configuration changes via events
  - **Simplified Event System**: Removed redundant 'enabled' event, using 'inited' instead

#### Technical Implementation Details

**Workspace Manager Architecture**:

1. **`build-exclusions.ts`** - Generates files.exclude entries for service files
2. **`make-file.ts`** - Updates VSCode workspace files.exclude setting via Configuration API
3. **`read-from-file.ts`** - Reads current workspace files.exclude configuration
4. **`handle-event.ts`** - Detects changes and regenerates exclusions when needed
5. **`init.ts`** - Initialization function that calls handleEvent('inited')

**Configuration Hook Pattern**:

```typescript
const configWatcher = useConfigWatcher({
  section: 'symlink-config',
  handlers: {
    manageGitignore: {
      onEnable: () => gitignoreManager.handleEvent('inited'),
      onDisable: () => gitignoreManager.handleEvent('disabled')
    },
    hideServiceFiles: {
      onEnable: () => workspaceManager.handleEvent('inited'),
      onDisable: () => workspaceManager.handleEvent('disabled')
    }
  }
})
```

**Enhanced Event System**:

- **`inited`** - Used for both startup and when features are enabled
- **`modified`** - When files are manually changed
- **`deleted`** - When files are deleted
- **`disabled`** - When features are disabled (shows message only)

**Workspace Settings Integration**:

- **Files.exclude Management**: Adds `"next.symlink.config.json": true` to workspace settings
- **Settings Watcher**: Monitors `.vscode/settings.json` for manual changes
- **Automatic Restoration**: Re-applies exclusions if user removes them manually
- **Configuration Target**: Uses `vscode.ConfigurationTarget.Workspace` for proper scoping

**Hook Architecture Benefits**:

- **Parameter-Handler Pairs**: Clean mapping of config parameters to enable/disable handlers
- **Automatic Change Detection**: Hook tracks previous values and detects changes
- **Minimal Set-Watchers Code**: Just declare what should happen when settings change
- **Reusable Pattern**: Can be applied to future configuration options

### ✅ Phase 1.10: Configuration Management and User Control (Completed - 04.10.2025)

- **Date**: 04.10.2025
- **Status**: Complete
- **Details**:
  - **Configuration Option**: Added `symlink-config.manageGitignore` setting (default: true)
  - **User Control**: Users can disable gitignore management in VSCode settings
  - **Conditional Initialization**: Extension respects user preference for gitignore functionality
  - **Warning Comments**: Added auto-generation warning to gitignore sections
  - **Improved Build Structure**: Enhanced build-section with lines array for better maintainability

#### Technical Implementation Details

**Configuration Schema**:

- **Setting**: `symlink-config.manageGitignore` (boolean, default: true)
- **Description**: "Automatically manage .gitignore entries for symlink configuration files"
- **Location**: VSCode Settings → Extensions → Symlink Config

**Conditional Management**:

- **Extension Startup**: Checks configuration before initializing gitignore manager
- **File Watchers**: Only sets up gitignore watchers when enabled
- **Clean Separation**: Next-config functionality remains independent

**Enhanced Gitignore Section**:

```
#Symlink.Config:{
# WARNING: This section is auto-generated. Do not modify manually.
next.symlink.config.json
#}:Symlink.Config
```

**Build Section Structure**:

```typescript
const lines = [
  '# WARNING: This section is auto-generated. Do not modify manually.',
  'next.symlink.config.json'
]
return lines.join('\n')
```

### ✅ Phase 1.9: Gitignore Manager Improvements and Shared Utilities (Completed - 03.10.2025)

- **Date**: 03.10.2025
- **Status**: Complete
- **Details**:
  - **New Section Markers**: Changed from `# Begin/End Symlink.Config` to `#Symlink.Config:{` and `#}:Symlink.Config` for cleaner syntax
  - **Shared File Operations**: Created reusable `readFile()` and `writeFile()` utilities in `src/shared/file-ops/`
  - **Simplified Make Function**: Gitignore make-file now uses shared utilities for cleaner code
  - **Improved Handle Event**: Renamed to `handleEvent()` with better logic comparing built vs file sections
  - **State Consolidation**: Moved state management to `src/shared/state.ts` removing gitignore-specific state
  - **Synchronous Operations**: Converted next-config manager to fully synchronous operations
  - **Build Section Cleanup**: Simplified build-section to return plain content without newlines

#### Technical Implementation Details

**Shared File Operations**:

- **`readFile(file)`** - Reads file relative to workspace root, returns empty string on error
- **`writeFile(file, content)`** - Writes file relative to workspace root with error handling
- **Workspace-relative paths** - All file operations use workspace root as base

**New Section Markers**:

- **Start**: `#Symlink.Config:{` (more compact, brace-style)
- **End**: `#}:Symlink.Config` (matching closing brace)
- **Regex Pattern**: `(#Symlink.Config:{\n)[\s\S]*?(\n#}:Symlink.Config)`

**Improved Event Handling**:

- **Content Comparison**: Compares `buildSection()` output with `readFromFile()` content
- **Smart Regeneration**: Only regenerates when built content differs from file content
- **Unified Actions**: Handles 'inited', 'modified', 'deleted' events consistently

**State Management Simplification**:

- **Removed gitignore state** - No longer tracks gitignore section in global state
- **Direct comparison** - Compares file content with expected content on-demand
- **Cleaner architecture** - Less state to manage and synchronize

### ✅ Phase 1.8: Gitignore Manager Implementation and Architecture Consistency (Completed - 03.10.2025)

- **Date**: 03.10.2025
- **Status**: Complete
- **Details**:
  - **Gitignore Manager Rewrite**: Complete rewrite of gitignore manager following next-config manager patterns
  - **Build/Make Separation**: Extracted building logic to separate build-\* functions for consistency
  - **State-Based Change Detection**: Implemented proper state tracking to prevent infinite loops instead of content comparison
  - **Manual Change Handling**: Added handleFileEvent functions for both managers to detect and handle manual file edits
  - **Architecture Consistency**: Both managers now follow identical patterns (build → make → handle → memo)
  - **Index.ts Cleanup**: Removed unused exports, keeping only external interface functions
  - **Init Functions**: Added init() functions that call memo() for cleaner extension startup
  - **Regex-Based Section Management**: Gitignore section extraction and replacement using proper regex patterns

#### Technical Implementation Details

**Gitignore Manager Architecture**:

1. **`build-section.ts`** - Pure function returning section content (currently hardcoded "next.symlink.config.json")
2. **`make-file.ts`** - Builds section, reads current .gitignore, replaces/appends section, writes file
3. **`handle-file-event.ts`** - Detects manual changes by comparing file content with stored state
4. **`read-from-file.ts`** - Extracts section content between Begin/End markers using regex
5. **`memo.ts`** - Stores current section content in global state for change detection
6. **`init.ts`** - Initialization function that calls memo()

**Next-Config Manager Refactoring**:

- Extracted building logic from `make-file.ts` to `build-next-config.ts`
- Simplified `make-file.ts` to only handle file I/O and state management
- Consistent architecture with gitignore manager

**State Management Pattern**:

- Write file → Store content in state → Compare on file change → Detect manual edits
- Eliminates infinite loops through proper state tracking
- Enables intelligent regeneration only when needed

**File Watcher Sequential Execution**:

- Confirmed handlers execute sequentially (one-by-one) not simultaneously
- Prevents race conditions in file operations
- Ensures predictable order of operations

### ✅ Phase 1.14: Type System Improvements and Configuration Fixes (Completed - 05.10.2025)
- **Date**: 05.10.2025
- **Status**: Complete
- **Details**:
  - **ExclusionMode Type System**: Replaced string literal unions with const object and type extraction for better IntelliSense
  - **Package.json Configuration Fix**: Added missing `symlink-config.` prefixes to configuration properties
  - **ESLint/Prettier Conflict Resolution**: Removed conflicting `semi` rule from ESLint to allow Prettier control
  - **File Naming Correction**: Fixed typo in `make-exlude-in-config.ts` → `make-exclude-in-config.ts`
  - **Consistent Type Usage**: Updated all workspace manager functions to use typed constants instead of string literals

#### Technical Implementation Details

**Type System Enhancement**:
```typescript
// Before: String literal union
export type ExclusionMode = 'all' | 'serviceFiles' | 'symlinkConfigs'

// After: Const object with type extraction
export const ExclusionMode = {
  All: 'all',
  ServiceFiles: 'serviceFiles', 
  SymlinkConfigs: 'symlinkConfigs',
} as const

export type ExclusionMode = typeof ExclusionMode[keyof typeof ExclusionMode]
```

**Configuration Property Fixes**:
- **Fixed**: `gitignoreServiceFiles` → `symlink-config.gitignoreServiceFiles`
- **Fixed**: `hideServiceFiles` → `symlink-config.hideServiceFiles`
- **Fixed**: `hideSymlinkConfigs` → `symlink-config.hideSymlinkConfigs`

**ESLint/Prettier Integration**:
- **Removed**: `semi: "warn"` rule from ESLint configuration
- **Result**: Prettier now has full control over semicolon usage (`"semi": false`)
- **Impact**: Mass reformatting of all files to consistent style

**Type Safety Benefits**:
- **IntelliSense**: Autocomplete for `ExclusionMode.All`, `ExclusionMode.ServiceFiles`
- **Refactoring Support**: IDE can safely rename and find all usages
- **Compile-time Safety**: No typos possible in mode parameters
- **Consistent Usage**: All functions use typed constants instead of magic strings

### ✅ Phase 1.13: Shared Configuration Operations and Async File Operations (Completed - 04.10.2025)

- **Date**: 04.10.2025
- **Status**: Complete
- **Details**:
  - **Shared Configuration Operations**: Created `shared/config-ops/` with `readFromConfig()` and `writeToConfig()` functions
  - **Async File Operations**: Converted all file operations to async using `fs/promises`
  - **Workspace Configuration Management**: Enhanced workspace manager to handle multiple configuration sections
  - **Files.exclude Monitoring**: Added automatic detection and restoration of manually removed service file exclusions
  - **Centralized Configuration Handling**: All configuration changes now go through workspace manager
  - **Consistent Async Pattern**: All managers now use async/await for file and configuration operations

#### Technical Implementation Details

**Shared Configuration Operations**:

- **`readFromConfig<T>(parameter, defaultValue)`** - Generic workspace configuration reader with type safety
- **`writeToConfig<T>(parameter, value)`** - Generic workspace configuration writer using `ConfigurationTarget.Workspace`
- **Centralized Usage**: All managers use shared config operations for consistency

**Async File Operations Migration**:

- **`writeFile()`** - Converted from `fs.writeFileSync()` to `fs.promises.writeFile()`
- **Manager Updates**: All `makeFile()` functions now async and await file operations
- **Event Handlers**: Updated `handleEvent()` and `handleFileEvent()` functions to be async
- **Initialization**: All `init()` functions now async to properly await file operations

**Enhanced Workspace Manager**:

- **Multi-Section Watching**: Monitors both `symlink-config` and `files` configuration sections
- **Files.exclude Protection**: Detects manual removal of service file exclusions and restores them
- **Centralized Handler**: `handleConfigChange()` processes all configuration parameter changes
- **Direct Configuration Usage**: Eliminated `makeFile()` wrapper, using `writeToConfig()` directly

**Configuration Architecture**:

```typescript
// Multi-section configuration watching
const configWatcher = useConfigWatcher({
  sections: [
    {
      section: 'symlink-config',
      parameters: [
        { parameter: 'manageGitignore', onChange: workspaceManager.handleConfigChange },
        { parameter: 'hideServiceFiles', onChange: workspaceManager.handleConfigChange }
      ]
    },
    {
      section: 'files',
      parameters: { parameter: 'exclude', onChange: workspaceManager.handleConfigChange }
    }
  ]
})
```

**Files.exclude Auto-Restoration**:

- **Detection**: Monitors `files.exclude` changes to detect manual removal of service file exclusions
- **Validation**: Checks if required service files are still excluded when `hideServiceFiles` is enabled
- **Restoration**: Automatically re-adds missing exclusions with user notification
- **User Feedback**: Shows warning message when exclusions are restored

## Current Status

**Phase**: Phase 1.14 Complete - Type System Improvements & Configuration Fixes  
**Branch**: `main`  
**Latest**: Enhanced type safety with const objects, fixed configuration properties, and resolved ESLint/Prettier conflicts  
**Next**: Testing and refinement (Phase 2)

**Technical Foundation**:

- ✅ All CVHere symlink logic preserved and enhanced
- ✅ Pure TypeScript implementation (no bash dependencies)
- ✅ Cross-platform compatibility maintained
- ✅ VSCode native integration complete
- ✅ Professional extension structure established

**Ready for**: Comprehensive testing and user experience refinement

_Based on proven symlink management system from CVHere project with 100% functionality preservation._

## Current Implementation Status

### Implemented Features

- **Complete CVHere Logic** - Full TypeScript translation of proven bash system
- **Distributed .gitignore Tracking** - SymLinks block management
- **Cross-Platform Support** - Windows batch file generation, Unix symlinks
- **@-Syntax Path Resolution** - Project root relative paths
- **Recursive Processing** - With exclude pattern filtering
- **Non-Destructive Operations** - Preserves existing .gitignore entries

### Core Components

1. **SymlinkManager** (`src/symlink/manager.ts`)
   - Main processing logic from CVHere process-path.sh
   - Handles full workflow: clean → process → recurse → Windows batch

2. **SymlinkCreator** (`src/symlink/creator.ts`)
   - Cross-platform symlink creation with Windows batch support
   - Timestamp-based batch file generation

3. **GitignoreManager** (`src/symlink/gitignore.ts`)
   - SymLinks block append/extract/clear functionality
   - Windows line ending compatibility

4. **Utils & Types** (`src/symlink/utils.ts`, `src/symlink/types.ts`)
   - Path resolution, Windows detection, exclude filtering
   - Type definitions matching CVHere system

### Available Commands

- `Symlinks: Create All` - Create all symlinks defined in config files
- `Symlinks: Clean All` - Remove orphaned symlinks
- `Symlinks: Dry Run` - Preview changes without applying them

### Development Utilities

#### Commit Management

- **`npm run git:code:commit`** - Interactive code commit (excludes docs)
- **`npm run git:code:commit:auto`** - Auto-commit code with message from file
- **`npm run git:docs:commit`** - Interactive documentation commit
- **`npm run git:docs:commit:auto`** - Auto-commit docs with message from file

#### Amazon Q Integration

- **`npm run q:menu`** - Interactive prompts menu with arrow navigation
- **`npm run q:prompts`** - Open Amazon Q prompts directory

#### JSON Processing

- **`scripts/shared/init-jq.sh`** - Cross-platform jq initialization utility

### Testing Status

- CVHere logic fully translated and tested
- Dry run operations working correctly
- .gitignore SymLinks block processing verified
- Cross-platform path resolution confirmed

### Usage Example

Create a `symlink.config.json` file in your project:

```json
{
  "directories": [
    {
      "target": "container1/shared",
      "source": "@shared"
    }
  ],
  "files": [
    {
      "target": "container2/package.json",
      "source": "@shared/package.json"
    }
  ],
  "exclude_paths": ["node_modules", ".git"]
}
```

Use Command Palette (`Ctrl+Shift+P`) and run:

- `Symlinks: Dry Run` to preview changes
- `Symlinks: Create All` to create symlinks
- `Symlinks: Clean All` to remove orphaned symlinks
