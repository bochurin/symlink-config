# Source Code Map - Symlink Config Extension

**Generated**: 14.10.2025  
**Version**: 0.0.48  
**Purpose**: Complete reference of all source files, functions, types, and constants for change tracking

## Root Files

### `src/main.ts`
**Purpose:** Entry point that re-exports from extension module
**Exports:**
- `activate` (from `./extension`)
- `deactivate` (from `./extension`)

## Extension Module

### `src/extension/`
**Purpose:** Core extension lifecycle and initialization

#### `src/extension/index.ts`
**Exports:**
- `activate` (from `./activate`)
- `deactivate` (from `./activate`)

#### `src/extension/activate.ts`
**Functions:**
- `activate(context: vscode.ExtensionContext): Promise<void>`
- `deactivate(): void`

**Implementation Details:**
- Creates tree view and stores in state
- Registers all commands
- Calls initialize() and subscribes dispose function
- Watches workspace folder changes and re-initializes

**Registered Commands:**
- `symlink-config.openSettings` - Opens extension settings
- `symlink-config.toggleView` - Toggles tree view mode
- `symlink-config.selectSymlinkSource` - Selects source for symlink
- `symlink-config.selectSymlinkTarget` - Selects target folder for symlink
- `symlink-config.cancelSymlinkCreation` - Cancels symlink creation
- `symlink-config.openSymlinkConfig` - Opens symlink config file
- `symlink-config.applyConfiguration` - Applies symlink configuration
- `symlink-config.cleanConfiguration` - Cleans symlinks
- `symlink-config.collapseAll` - Collapses all tree nodes

#### `src/extension/initialize.ts`
**Functions:**
- `initialize(): Promise<(() => void) | undefined>`
- `reset(): void`

**Variables:**
- `isInitialized: boolean` (internal)

**Implementation Details:**
- Orchestrates initialization: workspace setup, manager init, watcher setup
- Creates and returns dispose function from watcher array
- Gets treeProvider from state

#### `src/extension/init-managers.ts`
**Functions:**
- `initManagers(): Promise<void>`

**Implementation Details:**
- Initializes all managers based on settings
- Conditionally initializes next-config and current-config based on WATCH_WORKSPACE setting
- Runs all initializations in parallel with Promise.all

#### `src/extension/register-commands.ts`
**Functions:**
- `registerCommands(context: vscode.ExtensionContext, treeProvider: any): void`



## Shared State Module

### `src/shared/state.ts`
**Functions:**
- `setWorkspaceRoot(path: string): void`
- `getWorkspaceRoot(): string`
- `setWorkspaceName(path: string): void`
- `getWorkspaceName(): string`
- `setNextConfig(config: string): void`
- `getNextConfig(): string`
- `setSilentMode(mode: boolean): void`
- `getSilentMode(): boolean`
- `setTreeProvider(provider: any): void`
- `getTreeProvider(): any`
- `registerWatcher(watcher: vscode.Disposable): void`
- `disposeWatchers(): void`
- `queue(fn: () => Promise<void>): Promise<void>`

**Variables:**
- `workspaceRoot: string`
- `workspaceName: string`
- `nextSymlinkConfig: string`
- `sylentMode: boolean`
- `treeProvider: any`
- `watchers: vscode.Disposable[]`
- `processingQueue: Promise<void>`

### `src/types.ts`
**Types:**
- `VSCodeUri` (re-export from vscode.Uri)

## Shared Modules

### `src/shared/constants.ts`
**Constants:**
- `FILE_NAMES` object with properties:
  - `SYMLINK_CONFIG: 'symlink-config.json'`
  - `NEXT_SYMLINK_CONFIG: 'next.symlink-config.json'`
  - `CURRENT_SYMLINK_CONFIG: 'current.symlink-config.json'`
  - `APPLY_SYMLINKS_BAT: 'apply.symlink-config.bat'`
  - `APPLY_SYMLINKS_SH: 'apply.symlink-config.sh'`
  - `CLEAR_SYMLINKS_BAT: 'clear.symlink-config.bat'`
  - `CLEAR_SYMLINKS_SH: 'clear.symlink-config.sh'`
  - `RUN_ADMIN_BAT: 'admin.symlink-config.bat'` (parameterized: accepts script name)
  - `GITIGNORE: '.gitignore'`

- `CONFIG` two-level structure:
  - `SYMLINK_CONFIG` object:
    - `SECTION: 'symlink-config'`
    - `WATCH_WORKSPACE: 'enableFileWatchers'`
    - `GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles'`
    - `HIDE_SERVICE_FILES: 'hideServiceFiles'`
    - `HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs'`
    - `SCRIPT_GENERATION: 'scriptGeneration'`
    - `SYMLINK_PATH_MODE: 'symlinkPathMode'`
    - `DEFAULT` object:
      - `WATCH_WORKSPACE: true`
      - `GITIGNORE_SERVICE_FILES: true`
      - `HIDE_SERVICE_FILES: false`
      - `HIDE_SYMLINK_CONFIGS: false`
      - `SCRIPT_GENERATION: 'auto'`
      - `SYMLINK_PATH_MODE: 'relative'`
  - `FILES` object:
    - `SECTION: 'files'`
    - `EXCLUDE: 'exclude'`

### `src/shared/config-ops/`
**Files:**
- `index.ts` (exports all)
- `read-config.ts`
- `write-config.ts`

**Functions:**
- `readConfig<T>(parameter: string, defaultValue: T): T`
- `writeConfig<T>(parameter: string, value: T): Promise<void>`

### `src/shared/file-ops/`
**Files:**
- `index.ts` (exports all)
- `read-file.ts`
- `write-file.ts`
- `full-path.ts`
- `is-root-file.ts`
- `is-symlink.ts`
- `read-dir.ts`
- `read-symlink.ts`
- `stat-file.ts`

**Functions:**
- `readFile(file: string): string`
- `writeFile(file: string, content: string, mode?: number): Promise<void>`
- `fullPath(endPath: string): string`
- `isRootFile(uri: vscode.Uri): boolean`
- `isSymlink(uri: vscode.Uri): Promise<boolean>` (uses bitwise AND for type checking)
- `readDir(relativePath: string): fs.Dirent[]`
- `readSymlink(file: string): string`
- `statFile(file: string): fs.Stats`

**Implementation Details:**
- `isSymlink` uses `(stats.type & vscode.FileType.SymbolicLink) !== 0` to detect symlinks
- Handles both file symlinks (65 = 64|1) and directory symlinks (66 = 64|2)
- `writeFile` accepts optional `mode` parameter for Unix executable permissions (e.g., 0o755)
- `readDir` wraps `fs.readdirSync()` with `{ withFileTypes: true }`, returns empty array on error
- `readSymlink` wraps `fs.readlinkSync()` for reading symlink targets
- `statFile` wraps `fs.statSync()` for getting file/directory stats
- **Architecture Rule**: Only file-ops module uses `fs` directly; all other code uses these abstractions

### `src/shared/gitignore-ops/`
**Files:**
- `index.ts` (exports all)
- `parse-gitignore.ts`
- `assemble-gitignore.ts`

**Functions:**
- `parseGitignore(content: string): Record<string, { spacing: string; active: boolean }>`
- `assembleGitignore(records: Record<string, { spacing: string; active: boolean }>): string`

### `src/shared/vscode/`
**Files:**
- `index.ts` (exports all)
- `info.ts`
- `warning.ts`
- `confirm.ts`
- `confirm-warning.ts`

**Functions:**
- `info(message: string): void`
- `warning(message: string): void`
- `confirm(message: string, confirmText: string): Promise<boolean>` (info icon, positive actions)
- `confirmWarning(message: string, confirmText: string): Promise<boolean>` (warning icon, destructive actions)

## Manager Modules

### `src/managers/gitignore-file/`
**Files:**
- `index.ts` (exports: init, read, handle-event, make)
- `generate.ts`
- `handle-event.ts`
- `init.ts`
- `make.ts`
- `read.ts`

**Functions:**
- `generate(): Record<string, { spacing: string; active: boolean }>` (synchronous)
- `handleEvent(): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>`
- `read(): Promise<Record<string, { spacing: string; active: boolean }>>`

### `src/managers/symlink-settings/`
**Files:**
- `index.ts` (exports: read, handle-event)
- `read.ts`
- `handle-event.ts`
- `types.ts`

**Functions:**
- `read(parameter: SymlinkSettingsParameter): SymlinkSettingsValue`
- `handleEvent(section: string, parameter: string, payload: any): Promise<void>`

**Types:**
- `SymlinkSettingsParameter` (union type):
  - `CONFIG.SYMLINK_CONFIG.WATCH_WORKSPACE`
  - `CONFIG.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES`
  - `CONFIG.SYMLINK_CONFIG.HIDE_SERVICE_FILES`
  - `CONFIG.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS`
  - `CONFIG.SYMLINK_CONFIG.SCRIPT_GENERATION`
  - `CONFIG.SYMLINK_CONFIG.SYMLINK_PATH_MODE`
- `SymlinkSettingsValue` (string | boolean | undefined)

### `src/managers/next-config-file/`
**Files:**
- `index.ts` (exports: init, read, handle-event, make, needs-regenerate)
- `generate.ts`
- `handle-event.ts`
- `init.ts`
- `make.ts`
- `needs-regenerate.ts`
- `read.ts`
- `types.ts`

**Functions:**
- `generate(): string` (synchronous)
- `findConfigFiles(): string[]` (internal)
- `createMasterConfig(configFiles: string[]): Config` (internal)
- `convertToAtSyntax(entry: ConfigEntry, configDir: string): ConfigEntry` (internal)
- `pathToAtSyntax(originalPath: string, configDir: string): string` (internal)
- `loadConfig(configPath: string): Config | null` (internal)
- `handleEvent(event: FileWatchEvent): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>`
- `needsRegenerate(): boolean` (synchronous)
- `read(): string`

**Types:**
- `Config` interface with directories?, files?, exclude_paths? arrays
- `ConfigEntry` interface with target, source, configPath? properties

### `src/managers/current-config/`
**Files:**
- `index.ts` (exports: init, read, handle-event, make, needs-regenerate)
- `generate.ts`
- `handle-event.ts`
- `init.ts`
- `make.ts`
- `needs-regenerate.ts`
- `read.ts`

**Functions:**
- `generate(): string` (synchronous)
- `scanWorkspaceSymlinks(): ExistingSymlink[]` (internal, synchronous)
- `handleEvent(event: string): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>`
- `needsRegenerate(): boolean` (synchronous)
- `read(): string`

**Types:**
- `ExistingSymlink` interface with target, source, type properties

### `src/managers/file-exclude-settings/`
**Files:**
- `index.ts` (exports: init, read, handle-event, make)
- `generate.ts`
- `handle-event.ts`
- `init.ts`
- `make.ts`
- `read.ts`
- `types.ts`

**Functions:**
- `generate(mode: ExclusionPart): Record<string, boolean>`
- `handleEvent(): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>`
- `read(): Record<string, boolean>`

**Types:**
- `ExclusionPart` enum with All, ServiceFiles, SymlinkConfigs values

## Hook Modules

### `src/hooks/use-file-watcher.ts`
**Functions:**
- `useFileWatcher(config: WatcherConfig): vscode.FileSystemWatcher`

**Types:**
- `FileWatchEvent` enum with Created, Modified, Deleted values
- `FileEventData` type: `{ uri: vscode.Uri; event: FileWatchEvent }`
- `Handler` type: `(events: FileEventData[]) => void` (always receives array)
- `Filter` type: `(uri: vscode.Uri, event: FileWatchEvent) => Promise<boolean> | boolean`
- `WatcherConfig` interface with pattern, debounce?, filter?, onCreate?, onChange?, onDelete?, events? properties

**Implementation Details:**
- Handlers always receive array of events for consistency
- With debouncing: accumulates all filtered events during debounce window
- Without debouncing: passes single-item array `[{uri, event}]`
- Filters work per-event before accumulation

### `src/hooks/use-config-watcher.ts`
**Functions:**
- `useConfigWatcher(config: ConfigWatcherConfig): vscode.Disposable`

**Types:**
- `Handler` type: `(section: string, parameter: string, payload: { value: any; old_value: any }) => void`
- `ConfigItem` interface with parameters (string | string[]), onChange properties
- `SectionConfig` interface with section, configs (ConfigItem | ConfigItem[]) properties
- `ConfigWatcherConfig` interface with sections property

**Implementation Details:**
- `configs` can be single ConfigItem or array of ConfigItems
- Each ConfigItem can watch single parameter or array of parameters
- All parameters in a ConfigItem share the same onChange handler

## Watcher Modules

### `src/watchers/`
**Purpose:** Self-registering file watchers that monitor workspace changes

#### `src/watchers/index.ts`
**Exports:**
- `run` (from `./run`)

#### `src/watchers/run.ts`
**Functions:**
- `run(): void`

**Implementation Details:**
- Calls all create watcher functions
- Watchers self-register via `registerWatcher()`
- No return values needed

#### `src/watchers/config-watcher.ts`
**Functions:**
- `createConfigWatcher(): void`

**Implementation Details:**
- Uses `useConfigWatcher` hook
- Watches symlink-config settings changes
- Queues operations via `queue()` from state
- Self-registers via `registerWatcher()`

#### `src/watchers/gitignore-watcher.ts`
**Functions:**
- `createGitignoreWatcher(): void`

**Implementation Details:**
- Watches .gitignore files
- Queues operations via `queue()` from state
- Self-registers via `registerWatcher()`

#### `src/watchers/symlink-config-watcher.ts`
**Functions:**
- `createSymlinkConfigWatcher(): void`

**Implementation Details:**
- Watches symlink-config.json files
- Refreshes tree view on changes
- Self-registers via `registerWatcher()`

#### `src/watchers/next-config-watcher.ts`
**Functions:**
- `createNextConfigWatcher(): void`

**Implementation Details:**
- Watches next.symlink-config.json at workspace root
- Self-registers via `registerWatcher()`

#### `src/watchers/current-config-watcher.ts`
**Functions:**
- `createCurrentConfigWatcher(): void`

**Implementation Details:**
- Watches current.symlink-config.json at workspace root
- Self-registers via `registerWatcher()`

#### `src/watchers/symlinks-watcher.ts`
**Functions:**
- `createSymlinksWatcher(): void`

**Implementation Details:**
- Watches all symlinks in workspace
- 500ms debounce for batch updates
- Self-registers via `registerWatcher()`

## View Modules

### `src/views/symlink-tree/`
**Files:**
- `index.ts` (exports: SymlinkTreeProvider)
- `tree-data-provider.ts`
- `tree-item.ts`
- `tree-render.ts`
- `types.ts`
- `generate/` (subfolder)

**Functions:**
- `SymlinkTreeProvider` class with methods:
  - `constructor()`
  - `getTreeItem(element: TreeNode): vscode.TreeItem`
  - `getChildren(element?: TreeNode): Thenable<TreeNode[]>`
  - `refresh(): void`
  - `toggleViewMode(): void`

**Types:**
- `Config` interface with directories?, files? arrays
- `SymlinkType` type: 'dir' | 'file'
- `SymlinkStatus` type: 'new' | 'deleted' | 'unchanged'
- `SymlinkConfigEntry` interface with type, target, source, configPath, symlinkStatus? properties
- `TreeNodeType` type: 'root' | SymlinkType
- `treeBase` type: 'targets' | 'sources'
- `TreeNode` interface with children, isSymlinkLeaf, type, linkedPath, iconPath?, configPath?, symlinkStatus?, displayName? properties

### `src/views/symlink-tree/generate/`
**Files:**
- `index.ts` (exports all)
- `generate.ts`
- `parse-config.ts`
- `sort-tree.ts`

**Functions:**
- `generateTree(treeBase: treeBase): Record<string, TreeNode>`
- `addToTree(tree: Record<string, TreeNode>, treeBase: treeBase, configEntry: SymlinkConfigEntry): void` (internal)
- `parseConfig(configText: string): SymlinkConfigEntry[]`
- `normalizePath(inputPath: string): string` (internal)
- `sortTree(tree: Record<string, TreeNode>): Record<string, TreeNode>`

## Command Modules

### `src/commands/apply-configuration/`
**Files:**
- `index.ts` (exports: applyConfiguration, cleanConfiguration)
- `apply-config.ts`
- `clean-config.ts`
- `collect-operations.ts`
- `generate-admin-script.ts`
- `generate-apply-windows-script.ts`
- `generate-apply-unix-script.ts`
- `generate-clean-windows-script.ts`
- `generate-clean-unix-script.ts`
- `types.ts`

**Functions:**
- `applyConfiguration(): Promise<void>` (includes user interaction logic)
- `cleanConfiguration(): Promise<void>` (includes user interaction logic, renamed from clearConfiguration)
- `collectSymlinkOperations(tree: Record<string, TreeNode>): SymlinkOperation[]` (uses arrow function for traverse helper)
- `generateAdminScript(workspaceRoot: string): Promise<void>` (shared utility)
- `generateApplyWindowsScript(operations: SymlinkOperation[], workspaceRoot: string): Promise<void>` (script generation only)
- `generateApplyUnixScript(operations: SymlinkOperation[], workspaceRoot: string): Promise<void>` (script generation only)
- `generateCleanWindowsScript(workspaceRoot: string): Promise<void>` (renamed from generateClearWindowsScript)
- `generateCleanUnixScript(workspaceRoot: string): Promise<void>` (renamed from generateClearUnixScript)

**Types:**
- `SymlinkOperation` interface with type, target, source?, isDirectory properties

**Architecture:**
- Generate functions only create scripts (no user interaction)
- Main command functions handle dialogs, clipboard, terminal execution
- Shared admin script generation utility for both apply and clear

### `src/commands/`
**Files:**
- `create-symlink.ts`
- `open-symlink-config.ts`
- `tree-operations.ts`

**Functions:**
- `selectSymlinkSource(uri: vscode.Uri): Promise<void>` (validates not symlink)
- `selectSymlinkTarget(uri: vscode.Uri): Promise<void>` (validates not symlink)
- `cancelSymlinkCreation(): void`
- `createSymlinkConfig(source: vscode.Uri, targetFolder: vscode.Uri): Promise<void>` (internal)
- `updateContext(): void` (internal)

**Implementation Details:**
- Both selection functions validate that selected item is not a symlink using `isSymlink()`
- Shows warning message if symlink is selected: "Cannot select a symlink as source/target"
- Prevents circular symlink references and invalid configurations
- `openSymlinkConfig(treeItem: any): Promise<void>`
- `collapseAll(): void`

## Summary

**Total Files**: ~72+ TypeScript files
**Total Functions**: ~80+ exported functions
**Total Types**: ~25+ interfaces, enums, and type aliases
**Total Constants**: 2 major constant objects (FILE_NAMES, CONFIG) with ~20 properties

**Key Patterns:**
- **Extension Structure**: Entry point (`main.ts`) → Extension module (`extension/`) with separate activate, initialize, register-commands, and init-managers files
- **Watcher Structure**: Separate watcher files in `watchers/` folder, each with create function that self-registers
- Manager modules follow consistent structure: generate, handle-event, init, make, read
- All generate functions are synchronous for consistency
- Shared modules provide reusable utilities for config, file, gitignore, vscode, and state operations
- Hook modules provide reusable patterns for file watching and configuration watching with filtering and debouncing
- Filter functions work per-event: `(uri, event) => boolean` before accumulation
- Handler functions always receive arrays: `(events: FileEventData[]) => void`
- Admin script is parameterized: `admin.symlink-config.bat [script-name]` for both apply and clear operations
- User interaction logic in main command functions, not in generate functions
- Type definitions are distributed across modules with clear interfaces
- Constants are centralized in shared/constants.ts with two-level CONFIG structure
- CONFIG structure combines sections, parameters, and defaults in unified hierarchy
- **Config Watcher Pattern**: Multiple parameters can share same handler via `configs` with `parameters` array
- **File System Abstraction**: Only `shared/file-ops/` uses `fs` module directly; all other code uses abstraction functions
- **State Management**: Centralized in `shared/state.ts` for workspace root, name, configuration, tree provider, watchers array, and processing queue
- **Self-Registering Watchers**: Watchers register themselves via `registerWatcher()`, eliminating need to return and collect watcher arrays
- **Queue Pattern**: Processing queue centralized in state module, accessible via `queue()` function to serialize async operations

**Change Tracking Notes:**
- Function signatures include parameter types and return types
- Internal/private functions are marked as (internal)
- Optional properties are marked with ?
- Union types and enums are documented with their possible values
- File structure shows clear module boundaries and dependencies
- Filter functions in shared/file-ops for reusability across modules
- File watcher enhanced with event accumulation during debounce windows
- Handler signature changed to always receive array for consistency
- Symlink detection uses bitwise AND to handle combined file types
- **Constants Refactoring**: CONFIG_SECTIONS, CONFIG_PARAMETERS, and SYMLINK_SETTINGS_DEFAULTS merged into single CONFIG object
- **Extension Decomposition**: Separated extension.ts into extension/ folder with activate.ts, initialize.ts, init-managers.ts, register-commands.ts, set-watchers.ts
- **Entry Point**: main.ts serves as webpack entry point, re-exports from extension module
- **State Module**: Moved from src/state.ts to src/shared/state.ts for better organization
- **TreeProvider State Management**: TreeProvider stored in centralized state, eliminating parameter passing through initialization chain
- **Config Watcher Enhancement**: Renamed `parameters` to `configs`, each config can watch multiple parameters with shared handler
- **Manager Initialization**: Extracted manager initialization into separate init-managers module
- **Function Naming**: Simplified initialize/reset function names (removed Extension/Initialization suffixes)
- **Watcher Refactoring**: Decomposed set-watchers.ts into separate watcher files (config-watcher, gitignore-watcher, symlink-config-watcher, next-config-watcher, current-config-watcher, symlinks-watcher)
- **Queue in State**: Moved processing queue from set-watchers to shared/state.ts for global access
