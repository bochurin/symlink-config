# Source Code Map - Symlink Config Extension

**Generated**: 13.10.2025  
**Version**: 0.0.39  
**Purpose**: Complete reference of all source files, functions, types, and constants for change tracking

## Root Files

### `src/extension.ts`
**Functions:**
- `initializeExtension(treeProvider?: any): Promise<(() => void) | undefined>`
- `activate(context: vscode.ExtensionContext): Promise<void>`
- `deactivate(): void`

**Variables:**
- `isInitialized: boolean`

### `src/set-watchers.ts`
**Functions:**
- `setWatchers(treeProvider?: any): () => void`
- `isRootFile(uri: vscode.Uri, filename: string): boolean` (internal)
- `queue(fn: () => Promise<void>): Promise<void>` (internal)

### `src/state.ts`
**Functions:**
- `setWorkspaceRoot(path: string): void`
- `getWorkspaceRoot(): string`
- `setWorkspaceName(path: string): void`
- `getWorkspaceName(): string`
- `setNextConfig(config: string): void`
- `getNextConfig(): string`
- `setSilentMode(mode: boolean): void`
- `getSilentMode(): boolean`

**Variables:**
- `workspaceRoot: string`
- `workspaceName: string`
- `nextSymlinkConfig: string`
- `sylentMode: boolean`

### `src/types.ts`
**Types:**
- `VSCodeUri` (re-export from vscode.Uri)

## Shared Modules

### `src/shared/constants.ts`
**Constants:**
- `FILE_NAMES` object with properties:
  - `SYMLINK_CONFIG: 'symlink.config.json'`
  - `NEXT_SYMLINK_CONFIG: 'next.symlink.config.json'`
  - `CURRENT_SYMLINK_CONFIG: 'current.symlink.config.json'`
  - `APPLY_SYMLINKS_BAT: 'apply.symlinks.config.bat'`
  - `APPLY_SYMLINKS_SH: 'apply.symlinks.config.sh'`
  - `CLEAR_SYMLINKS_BAT: 'clear.symlinks.config.bat'`
  - `CLEAR_SYMLINKS_SH: 'clear.symlinks.config.sh'`
  - `RUN_ADMIN_BAT: 'admin.symlink.config.bat'` (parameterized: accepts script name)
  - `GITIGNORE: '.gitignore'`

- `CONFIG_SECTIONS` object with properties:
  - `SYMLINK_CONFIG: 'symlink-config'`
  - `FILES: 'files'`

- `CONFIG_PARAMETERS` object with properties:
  - `GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles'`
  - `HIDE_SERVICE_FILES: 'hideServiceFiles'`
  - `HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs'`
  - `SCRIPT_GENERATION: 'scriptGeneration'`
  - `SYMLINK_PATH_MODE: 'symlinkPathMode'`
  - `EXCLUDE: 'exclude'`

- `SYMLINK_SETTINGS_DEFAULTS` object with properties:
  - `scriptGeneration: 'auto'`
  - `symlinkPathMode: 'relative'`
  - `gitignoreServiceFiles: true`
  - `hideServiceFiles: false`
  - `hideSymlinkConfigs: false`

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
- `SymlinkSettingsParameter` (union of CONFIG_PARAMETERS values)
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
- `ParameterConfig` interface with parameter, onChange properties
- `SectionConfig` interface with section, parameters properties
- `ConfigWatcherConfig` interface with sections property

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
- `index.ts` (exports: applyConfiguration, clearConfiguration)
- `apply-configuration.ts`
- `clear-configuration.ts`
- `collect-operations.ts`
- `generate-admin-script.ts`
- `generate-apply-windows-script.ts`
- `generate-apply-unix-script.ts`
- `generate-clear-windows-script.ts`
- `generate-clear-unix-script.ts`
- `types.ts`

**Functions:**
- `applyConfiguration(): Promise<void>` (includes user interaction logic)
- `clearConfiguration(): Promise<void>` (includes user interaction logic)
- `collectSymlinkOperations(tree: Record<string, TreeNode>): SymlinkOperation[]`
- `generateAdminScript(workspaceRoot: string): Promise<void>` (shared utility)
- `generateApplyWindowsScript(operations: SymlinkOperation[], workspaceRoot: string): Promise<void>` (script generation only)
- `generateApplyUnixScript(operations: SymlinkOperation[], workspaceRoot: string): Promise<void>` (script generation only)
- `generateClearWindowsScript(workspaceRoot: string): Promise<void>`
- `generateClearUnixScript(workspaceRoot: string): Promise<void>`

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
- `clear-configuration.ts`

**Functions:**
- `createSymlink(): Promise<void>`
- `selectSymlinkTarget(): Promise<void>`
- `cancelSymlinkCreation(): void`
- `openSymlinkConfig(treeItem: any): Promise<void>`
- `collapseAll(): void`
- `clearConfiguration(): Promise<void>`

## Summary

**Total Files**: ~60+ TypeScript files
**Total Functions**: ~80+ exported functions
**Total Types**: ~25+ interfaces, enums, and type aliases
**Total Constants**: 3 major constant objects with ~15 properties

**Key Patterns:**
- Manager modules follow consistent structure: generate, handle-event, init, make, read
- All generate functions are synchronous for consistency
- Shared modules provide reusable utilities for config, file, gitignore, and vscode operations
- Hook modules provide reusable patterns for file watching and configuration watching with filtering and debouncing
- Filter functions work per-event: `(uri, event) => boolean` before accumulation
- Handler functions always receive arrays: `(events: FileEventData[]) => void`
- Admin script is parameterized: `admin.symlink.config.bat [script-name]` for both apply and clear operations
- User interaction logic in main command functions, not in generate functions
- Type definitions are distributed across modules with clear interfaces
- Constants are centralized in shared/constants.ts for maintainability
- **File System Abstraction**: Only `shared/file-ops/` uses `fs` module directly; all other code uses abstraction functions

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
