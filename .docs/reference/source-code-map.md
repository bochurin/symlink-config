# Source Code Map - Symlink Config Extension

**Generated**: 20.10.2025  
**Version**: 0.0.71  
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
- `deactivate()` calls `disposeWatchers()` to clean up all watchers

**Implementation Details:**
- Creates output channel with `{ log: true }` option during activation
- Creates tree view and stores in state
- Registers all commands
- Calls initialize() and subscribes dispose function
- Watches workspace folder changes and re-initializes
- Logs activation, deactivation, and workspace changes

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
- `symlink-config.refreshManagers` - Manually refreshes all managers
- `symlink-config.clearLogs` - Clears output channel logs
- `symlink-config.showLogs` - Opens output panel with extension logs

#### `src/extension/ini.ts`
**Functions:**
- `init(): Promise<(() => void) | undefined>`
- `reset(): void`
- `calculateAndSetProjectRoot(): Promise<{ workspaceRoot: string; workspaceName: string }>` (internal)

**Variables:**
- `isInitialized: boolean` (internal)

**Implementation Details:**
- Orchestrates initialization: workspace setup, manager init, watcher setup
- Creates and returns dispose function from watcher array
- Implements project root calculation with workspace settings integration
- Uses `findCommonPath()` to calculate shortest common path from workspace folders
- Saves calculated project root to workspace settings with `ConfigurationTarget.Workspace`
- Workspace name logic: uses `vscode.workspace.name` for multiroot, falls back to folder name

#### `src/extension/managers-init.ts`
**Functions:**
- `managersInit(force?: boolean): Promise<void>`

**Implementation Details:**
- Logs initialization start and completion
- Accepts optional `force` parameter to bypass settings checks
- Initializes all managers based on settings (or force flag)
- Conditionally initializes gitignore when force OR gitignoreServiceFiles is enabled
- Conditionally initializes next-config and current-config when force OR watchWorkspace is enabled
- Runs all initializations in parallel with Promise.all

#### `src/extension/make-watchers.ts`
**Functions:**
- `makeWatchers(): void`

**Implementation Details:**
- Logs watcher creation start and completion
- Disposes all watchers first with `disposeWatchers()`
- Always creates symlinkSettingsWatcher
- Conditionally creates filesSettingsWatcher when hideServiceFiles OR hideSymlinkConfigs is enabled
- Conditionally creates gitignoreWatcher when gitignoreServiceFiles is enabled
- Conditionally creates workspace watchers (nextConfig, currentConfig, symlinkConfigs, symlinks) when watchWorkspace is enabled

#### `src/extension/register-commands.ts`
**Functions:**
- `registerCommands(context: vscode.ExtensionContext, treeProvider: any): void`



## State Module

### `src/state/`
**Purpose:** Application state management at src/ level

#### `src/state/index.ts`
**Exports:** All state functions and types

#### `src/state/types.ts`
**Types:**
- `Watcher` = `FileWatcher | SettingsWatcher`

#### `src/state/workspace.ts`
**Functions:**
- `setWorkspaceRoot(path: string): void`
- `getWorkspaceRoot(): string`
- `setWorkspaceName(path: string): void`
- `getWorkspaceName(): string`

**Variables:**
- `workspaceRoot: string`
- `workspaceName: string`

#### `src/state/ui.ts`
**Functions:**
- `setSilentMode(mode: boolean): void`
- `getSilentMode(): boolean`
- `setTreeProvider(provider: any): void`
- `getTreeProvider(): any`
- `setOutputChannel(channel: vscode.OutputChannel): void`
- `getOutputChannel(): vscode.OutputChannel | undefined`

#### `src/state/managers.ts`
**Functions:**
- `registerManager(name: string, manager: Manager<any, any>): void`
- `getManagers(...names: string[]): Manager<any, any>[]`

**Variables:**
- `managers: Map<string, Manager<any, any>>`

#### `src/state/watchers.ts`
**Functions:**
- `registerWatcher(name: string, watcher: Watcher): void`
- `getWatchers(...names: string[]): Watcher[]`
- `disposeWatchers(...names: string[]): void`

**Variables:**
- `watchers: Map<string, Watcher>`

**Implementation Details:**
- Watchers tracked by name in Map for selective disposal
- `registerWatcher(name, watcher)` - disposes existing watcher with same name before registering
- `disposeWatchers()` - disposes all watchers
- `disposeWatchers('name1', 'name2')` - disposes specific watchers by name
- `getWatchers(...names)` - returns array of watchers, filters out undefined

## Queue Module

### `src/queue/`
**Purpose:** Operation serialization at src/ level

#### `src/queue/index.ts`
**Exports:** Queue function

#### `src/queue/queue.ts`
**Functions:**
- `queue(fn: () => Promise<void>): Promise<void>`

**Variables:**
- `processingQueue: Promise<void>`

**Implementation Details:**
- Serializes async operations to prevent race conditions
- Chains promises to ensure sequential execution

### `src/types/`
**Purpose:** TypeScript type declarations

#### `src/types/package.json.d.ts`
**Type Declarations:**
- Complete package.json structure for VSCode extensions
- Enables build-time import of package.json with full type safety
- Supports `resolveJsonModule` TypeScript configuration

## Shared Modules

### `src/shared/log.ts`
**Functions:**
- `log(message: string): void`
- `clearLogs(): void`
- `showLogs(): void`

**Variables:**
- `logCount: number`

**Implementation Details:**
- Imports `getOutputChannel()` from extension/state
- Includes timestamp `[HH:MM:SS]` and auto-rotation based on maxLogEntries setting
- Falls back to console.log if outputChannel not initialized
- `clearLogs()` resets counter and shows output panel
- `showLogs()` explicitly shows output panel

### `src/shared/constants/`
**Purpose:** Modular constants organization with cross-references

#### `src/shared/constants/index.ts`
**Exports:** All constants from files, settings, watchers, managers modules

#### `src/shared/constants/files.ts`
**Constants:**
- `FILE_NAMES` object with properties:
  - `SYMLINK_CONFIG: 'symlink-config.json'`
  - `NEXT_SYMLINK_CONFIG: 'next.symlink-config.json'`
  - `CURRENT_SYMLINK_CONFIG: 'current.symlink-config.json'`
  - `APPLY_SYMLINKS_BAT: 'apply.symlink-config.bat'`
  - `APPLY_SYMLINKS_SH: 'apply.symlink-config.sh'`
  - `CLEAR_SYMLINKS_BAT: 'clear.symlink-config.bat'`
  - `CLEAR_SYMLINKS_SH: 'clear.symlink-config.sh'`
  - `RUN_ADMIN_BAT: 'admin.symlink-config.bat'`
  - `GITIGNORE: '.gitignore'`

#### `src/shared/constants/settings.ts`
**Implementation Details:**
- **Build-time package.json import**: Reads default values from package.json at compile time
- **DRY principle**: Section and property names defined once and reused
- **Type safety**: Full TypeScript support with package.json type declarations

**Constants:**
- `SETTINGS` structure with build-time defaults:
  - `SYMLINK_CONFIG` object:
    - `SECTION: 'symlink-config'`
    - `WATCH_WORKSPACE: 'watchWorkspace'`
    - `GITIGNORE_SERVICE_FILES: 'gitignoreServiceFiles'`
    - `GITIGNORE_SYMLINKS: 'gitignoreSymlinks'`
    - `HIDE_SERVICE_FILES: 'hideServiceFiles'`
    - `HIDE_SYMLINK_CONFIGS: 'hideSymlinkConfigs'`
    - `SCRIPT_GENERATION: 'scriptGeneration'`
    - `SYMLINK_PATH_MODE: 'symlinkPathMode'`
    - `PROJECT_ROOT: 'projectRoot'`
    - `MAX_LOG_ENTRIES: 'maxLogEntries'`
    - `DEFAULT` object (populated from package.json):
      - All default values read from `packageJson.contributes.configuration.properties`
  - `FILES` object:
    - `SECTION: 'files'`
    - `EXCLUDE: 'exclude'`

#### `src/shared/constants/watchers.ts`
**Constants:**
- `WATCHERS` object using file names as identifiers:
  - `SYMLINK_CONFIG_SETTINGS: SETTINGS.SYMLINK_CONFIG.SECTION`
  - `FILES_SETTINGS: SETTINGS.FILES.SECTION`
  - `GITIGNORE: FILE_NAMES.GITIGNORE`
  - `NEXT_SYMLINK_CONFIG: FILE_NAMES.NEXT_SYMLINK_CONFIG`
  - `CURRENT_SYMLINK_CONFIG: FILE_NAMES.CURRENT_SYMLINK_CONFIG`
  - `SYMLINK_CONFIGS: FILE_NAMES.SYMLINK_CONFIG`
  - `SYMLINKS: 'handled symlinks'`

#### `src/shared/constants/managers.ts`
**Constants:**
- `MANAGERS` object using cross-referenced identifiers:
  - `SYMLINK_CONFIG_SETTINGS: SETTINGS.SYMLINK_CONFIG.SECTION`
  - `FILES_SETTINGS: SETTINGS.FILES.SECTION`
  - `GITIGNORE: FILE_NAMES.GITIGNORE`
  - `NEXT_SYMLINK_CONFIG: FILE_NAMES.NEXT_SYMLINK_CONFIG`
  - `CURRENT_SYMLINK_CONFIG: FILE_NAMES.CURRENT_SYMLINK_CONFIG`
  - `SYMLINK_CONFIGS: FILE_NAMES.SYMLINK_CONFIG`

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
- `basename.ts`
- `normalize-path.ts`
- `find-common-path.ts`
- `to-fs-path.ts`

**Functions:**
- `readFile(workspaceRoot: string, file: string | vscode.Uri): string`
- `writeFile(workspaceRoot: string, file: string | vscode.Uri, content: string, mode?: number): Promise<void>`
- `fullPath(workspaceRoot: string, endPath: string | vscode.Uri): string`
- `isRootFile(workspaceRoot: string, uri: string | vscode.Uri): boolean`
- `isSymlink(uri: string | vscode.Uri): Promise<boolean>` (uses bitwise AND for type checking)
- `readDir(workspaceRoot: string, relativePath: string | vscode.Uri): fs.Dirent[]`
- `readSymlink(workspaceRoot: string, file: string | vscode.Uri): string`
- `statFile(workspaceRoot: string, file: string | vscode.Uri): fs.Stats`
- `basename(uri: string | vscode.Uri): string`
- `normalizePath(path: string, addTrailingSlash?: boolean): string`
- `findCommonPath(paths: string[]): string`
- `toFsPath(pathOrUri: string | vscode.Uri): string`

**Implementation Details:**
- `isSymlink` uses `(stats.type & vscode.FileType.SymbolicLink) !== 0` to detect symlinks
- Handles both file symlinks (65 = 64|1) and directory symlinks (66 = 64|2)
- `writeFile` accepts optional `mode` parameter for Unix executable permissions (e.g., 0o755)
- `readDir` wraps `fs.readdirSync()` with `{ withFileTypes: true }`, returns empty array on error
- `readSymlink` wraps `fs.readlinkSync()` for reading symlink targets
- `statFile` wraps `fs.statSync()` for getting file/directory stats
- **Architecture Rule**: Only file-ops module uses `fs` directly; all other code uses these abstractions
- **Isolation Rule**: All functions accept `workspaceRoot` parameter instead of importing from extension/state
- **Consistency Rule**: All file-ops functions accept both `string | vscode.Uri` parameters with internal normalization via `toFsPath()`
- **Path Normalization**: `normalizePath()` ensures cross-platform compatibility with forward slashes and optional trailing slashes
- **Common Path Calculation**: `findCommonPath()` calculates shortest common path from multiple folder paths for project root determination

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
- `index.ts` (exports: types, enums, init, read, handle-event, make)
- `enums.ts`
- `generate.ts`
- `handle-event.ts`
- `init.ts`
- `make.ts`
- `needs-regenerate.ts`
- `read.ts`
- `types.ts`

**Functions:**
- `generate(mode?: GitignoringPart): Promise<Record<string, { spacing: string; active: boolean }>>` (async)
- `handleEvent(): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>` (logs when .gitignore is updated)
- `needsRegenerate(events?: FileEvent | FileEvent[]): boolean` (synchronous, logs event and result)
- `read(): Promise<Record<string, { spacing: string; active: boolean }>>`

**Enums:**
- `GitignoringPart` enum with All, ServiceFiles, Symlinks values (in enums.ts)

**Implementation Details:**
- Enhanced to handle created symlinks from current.symlink-config.json
- Reads current config and adds symlink targets to .gitignore when gitignoreSymlinks setting is enabled
- Parses JSON string from readCurrentConfig() before accessing operations

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
  - `SETTINGS.SYMLINK_CONFIG.WATCH_WORKSPACE`
  - `SETTINGS.SYMLINK_CONFIG.GITIGNORE_SERVICE_FILES`
  - `SETTINGS.SYMLINK_CONFIG.GITIGNORE_SYMLINKS`
  - `SETTINGS.SYMLINK_CONFIG.HIDE_SERVICE_FILES`
  - `SETTINGS.SYMLINK_CONFIG.HIDE_SYMLINK_CONFIGS`
  - `SETTINGS.SYMLINK_CONFIG.SCRIPT_GENERATION`
  - `SETTINGS.SYMLINK_CONFIG.SYMLINK_PATH_MODE`
  - `SETTINGS.SYMLINK_CONFIG.MAX_LOG_ENTRIES`
- `SymlinkSettingsValue` (string | boolean | number | undefined)

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
- `handleEvent(events: FileEvent[]): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>` (logs when next.symlink-config.json is updated)
- `needsRegenerate(events?: FileEvent[]): boolean` (synchronous, logs event and result)
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
- `handleEvent(events: FileEvent[]): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>` (logs when current.symlink-config.json is updated)
- `needsRegenerate(): boolean` (synchronous, logs result and errors)
- `read(): string`

**Types:**
- `ExistingSymlink` interface with target, source, type properties

### `src/managers/file-exclude-settings/`
**Files:**
- `index.ts` (exports: types, enums, init, read, handle-event, make)
- `enums.ts`
- `generate.ts`
- `handle-event.ts`
- `init.ts`
- `make.ts`
- `needs-regenerate.ts`
- `read.ts`
- `types.ts`

**Functions:**
- `generate(mode: ExclusionPart): Record<string, boolean>` (synchronous)
- `handleEvent(): Promise<void>`
- `init(): Promise<void>`
- `make(): Promise<void>` (logs when files.exclude settings are updated)
- `needsRegenerate(event?: SettingsEvent): boolean` (synchronous, logs event and result)
- `read(): Record<string, boolean>`

**Enums:**
- `ExclusionPart` enum with All, ServiceFiles, SymlinkConfigs values (in enums.ts)

## Path Aliases

**TypeScript Configuration**: `tsconfig.json`
```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./*"],
    "@src/*": ["./src/*"],
    "@extension": ["./src/extension"],
    "@extension/*": ["./src/extension/*"],
    "@state": ["./src/state"],
    "@queue": ["./src/queue"],
    "@commands": ["./src/commands"],
    "@watchers": ["./src/watchers"],
    "@managers/*": ["./src/managers/*"],
    "@commands/*": ["./src/commands/*"],
    "@watchers/*": ["./src/watchers/*"],
    "@views/*": ["./src/views/*"],
    "@shared/*": ["./src/shared/*"]
  }
}
```

**Webpack Configuration**: `webpack.config.js`
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname),
    '@src': path.resolve(__dirname, 'src'),
    '@extension': path.resolve(__dirname, 'src/extension'),
    '@state': path.resolve(__dirname, 'src/state'),
    '@queue': path.resolve(__dirname, 'src/queue'),
    '@commands': path.resolve(__dirname, 'src/commands'),
    '@watchers': path.resolve(__dirname, 'src/watchers'),
    '@managers': path.resolve(__dirname, 'src/managers'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@shared': path.resolve(__dirname, 'src/shared')
  }
}
```

**Benefits**:
- **Clean Imports**: `@shared/log` instead of `../../shared/log`
- **Consistent Paths**: Same aliases work in TypeScript and webpack
- **Better Refactoring**: Moving files doesn't break import paths
- **Improved Readability**: Clear module relationships

## Module Index Files

### `src/commands/index.ts`
**Exports**: All command functions for `@commands` imports

### `src/watchers/index.ts`
**Exports**: All watcher functions for `@watchers` imports

### `src/extension/index.ts`
**Exports**: activate, deactivate, makeWatchers, managersInit

## Shared Modules (continued)

### `src/shared/factories/manager/`
**Purpose:** Manager factory for creating managers with common patterns

**Files:**
- `index.ts` (exports: Manager, ManagerCallbacks, ManagerSugar, createManager, useManager)
- `types.ts`
- `create-manager.ts`
- `use-manager.ts`

**Functions:**
- `createManager<CT>(callbacks: ManagerCallbacks<CT>): Manager<CT>` (synchronous return)
- `useManager<CT>(callbacks: ManagerCallbacks<CT>): ManagerSugar<CT>` (manager hook)

**Internal Functions (in create-manager.ts):**
- `read(params?: { [key: string]: any }): CT | undefined` (base level)
- `write(params?: { [key: string]: any }): Promise<void>` (base level)
- `generate(params?: { [key: string]: any }): CT | undefined` (level 2, depends on read)
- `needsRegenerate(params?: { [key: string]: any }): boolean` (level 2, depends on read)
- `make(params?: { [key: string]: any }): Promise<void>` (level 3, depends on read, generate, write)
- `handleEvent(params?: { [key: string]: any }): Promise<void>` (entry point, depends on needsRegenerate, make)
- `init(): Promise<void>` (entry point, depends on needsRegenerate, make)

**Types:**
- `ManagerCallbacks<CT>` interface:
  - `objectNameCallback: (params?: { [key: string]: any }) => string`
  - `makeCallback: (params?: { [key: string]: any }) => Promise<CT | undefined>`
  - `needsRegenerateCallback?: (params?: { [key: string]: any }) => boolean`
  - `generateCallback?: (params?: { content?: CT; [key: string]: any }) => CT`
  - `readCallback?: (params?: { [key: string]: any }) => CT`
  - `writeCallback?: (params?: { [key: string]: any }) => Promise<void>`
- `Manager<CT>` interface:
  - `objectName: (params?: { [key: string]: any }) => string`
  - `init: () => Promise<void>`
  - `handleEvent: (params?: { [key: string]: any }) => Promise<void>`
  - `read: (params?: { [key: string]: any }) => CT | undefined`

**Implementation Details:**
- **Consolidated Architecture**: Single create-manager.ts file with internal functions organized by call stack dependency
- **Named Parameters Pattern**: All callbacks use named object parameters with `{ [key: string]: any }` index signature for flexibility
- **Call Stack Organization**: Functions organized by dependency levels (base → level 2 → level 3 → entry points)
- **Callback-Based Object Names**: objectNameCallback provides dynamic object naming instead of static string parameter
- **Simplified Generics**: Removed ET (event type) parameter, only CT (content type) needed
- **Optional Callbacks**: All callbacks except objectNameCallback and makeCallback are optional
- **Flexible Types**: Content type (CT) can be union types like `SettingsPropertyValue | Record<string, SettingsPropertyValue>`
- **Parameter Spreading**: Functions spread additional parameters from input to callback invocations
- **Error Handling**: Read function returns undefined when readCallback not provided
- **Logging Integration**: make() function logs when objects are updated using objectName() callback

### `src/shared/hooks/use-file-watcher/`
**Files:**
- `index.ts` (exports all)
- `enums.ts`
- `types.ts`
- `use-file-watcher.ts`
- `execute-handlers.ts`

**Functions:**
- `useFileWatcher(config: WatcherConfig): vscode.FileSystemWatcher`
- `createExecuteHandlers(filters: Filter | Filter[] | undefined, debounce: number | undefined): (handlers: Handler[], uri: vscode.Uri, eventType: FileEventType) => Promise<void>`

**Enums:**
- `FileEventType` enum with Created, Modified, Deleted values (in enums.ts)

**Types:**
- `FileEvent` type: `{ uri: vscode.Uri; event: FileEventType }`
- `Handler` type: `(events: FileEvent[]) => void` (always receives array)
- `Filter` type: `(event: FileEvent) => Promise<boolean> | boolean`
- `EventConfig` interface with on (FileEventType | FileEventType[]), handlers (Handler | Handler[]) properties
- `WatcherConfig` interface with pattern, debounce?, filters?, events (EventConfig | EventConfig[]) properties

**Implementation Details:**
- Decomposed into folder structure with separate files for types, implementation, and handler execution
- `createExecuteHandlers` factory function encapsulates filtering and debouncing logic with closure for state
- Removed legacy onCreate/onChange/onDelete syntax
- events property is now required (not optional)
- filters accepts Filter | Filter[] (all filters must pass)
- handlers accepts Handler | Handler[]
- Handlers always receive array of events for consistency
- With debouncing: accumulates all filtered events during debounce window
- Without debouncing: passes single-item array `[{uri, event}]`
- Filters work per-event before accumulation, all must return true
- Filter receives FileEvent object for consistency with Handler signature

### `src/shared/hooks/use-settings-watcher/`
**Files:**
- `index.ts` (exports all)
- `types.ts`
- `use-settings-watcher.ts`
- `execute-handlers.ts`

**Functions:**
- `useSettingsWatcher(config: SettingsWatcherConfig): vscode.Disposable`
- `executeHandlers(handlers: Handler | Handler[], event: SettingsEvent): void`

**Types:**
- `SettingsEvent` type: `{ section: string; parameter: string; value: any; oldValue: any }`
- `Handler` type: `(event: SettingsEvent) => void`
- `HandleConfig` interface with properties (string | string[]), onChange (Handler | Handler[]) properties
- `SectionConfig` interface with section, handlers (HandleConfig | HandleConfig[]) properties
- `SettingsWatcherConfig` interface with sections property

**Implementation Details:**
- Decomposed into folder structure with separate files for types, implementation, and handler execution
- `executeHandlers` utility function normalizes handlers to array and executes each with event
- Renamed from use-config-watcher.ts
- `handlers` can be single HandleConfig or array of HandleConfigs
- Each HandleConfig can watch single property or array of properties (renamed from parameters)
- All properties in a HandleConfig share the same onChange handler

## Watcher Modules

### `src/watchers/`
**Purpose:** Self-registering file watchers that monitor workspace changes

#### `src/watchers/index.ts`
**Exports:**
- `symlinkSettingsWatcher` (from `./symlink-settings-watcher`)
- `filesSettingsWatcher` (from `./files-settings-watcher`)
- `gitignoreWatcher` (from `./gitignore-watcher`)
- `nextConfigWatcher` (from `./next-config-watcher`)
- `currentConfigWatcher` (from `./current-config-watcher`)
- `symlinkConfigsWatcher` (from `./symlink-config-watcher`)
- `symlinksWatcher` (from `./symlinks-watcher`)

#### `src/watchers/symlink-settings-watcher.ts`
**Functions:**
- `symlinkSettingsWatcher(): void`

**Implementation Details:**
- Logs watcher registration and setting changes
- Uses `useSettingsWatcher` hook
- Watches symlink-config section settings changes
- Queues operations via `queue()` from state
- Registers with name `WATCHERS.SYMLINK_SETTINGS`
- Always runs (not conditional)

#### `src/watchers/files-settings-watcher.ts`
**Functions:**
- `filesSettingsWatcher(): void`

**Implementation Details:**
- Logs watcher registration and setting changes
- Uses `useSettingsWatcher` hook
- Watches files section settings changes (files.exclude)
- Queues operations via `queue()` from state
- Registers with name `WATCHERS.FILES_SETTINGS`
- Conditionally created only when hideServiceFiles OR hideSymlinkConfigs is enabled

#### `src/watchers/gitignore-watcher.ts`
**Functions:**
- `gitignoreWatcher(): void`

**Implementation Details:**
- Logs watcher registration and file changes
- Watches .gitignore files
- Queues operations via `queue()` from state
- Registers with name `WATCHERS.GITIGNORE`

#### `src/watchers/symlink-config-watcher.ts`
**Functions:**
- `symlinkConfigsWatcher(): void`

**Implementation Details:**
- Logs watcher registration and file changes with event count
- Watches symlink-config.json files
- Refreshes tree view on changes
- Registers with name `WATCHERS.SYMLINK_CONFIGS`

#### `src/watchers/next-config-watcher.ts`
**Functions:**
- `nextConfigWatcher(): void`

**Implementation Details:**
- Logs watcher registration and file changes
- Watches next.symlink-config.json at workspace root
- Registers with name `WATCHERS.NEXT_CONFIG`

#### `src/watchers/current-config-watcher.ts`
**Functions:**
- `currentConfigWatcher(): void`

**Implementation Details:**
- Logs watcher registration and file changes
- Watches current.symlink-config.json at workspace root
- Triggers both current-config and gitignore-file managers on changes
- Registers with name `WATCHERS.CURRENT_CONFIG`

#### `src/watchers/symlinks-watcher.ts`
**Functions:**
- `symlinksWatcher(): void`

**Implementation Details:**
- Logs watcher registration and symlink changes with event count
- Watches all symlinks in workspace
- 500ms debounce for batch updates
- Registers with name `WATCHERS.SYMLINKS`

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
- `applyConfiguration(): Promise<void>` (includes user interaction logic, logs all steps and errors)
- `cleanConfiguration(): Promise<void>` (includes user interaction logic, renamed from clearConfiguration, logs all steps and errors)
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
- `index.ts` (exports all commands)
- `apply-configuration/` (subfolder with index.ts)
- `create-symlink.ts`
- `open-symlink-config.ts`
- `tree-operations.ts`
- `refresh-managers.ts`
- `clear-logs.ts`
- `show-logs.ts`

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
- `refreshManagers(): Promise<void>`
- `clearLogsCommand(): void`
- `showLogsCommand(): void`

## Summary

**Total Files**: ~72+ TypeScript files
**Total Functions**: ~80+ exported functions
**Total Types**: ~25+ interfaces, enums, and type aliases
**Total Constants**: 3 major constant objects (FILE_NAMES, WATCHERS, SETTINGS) with ~20 properties

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
- Constants are centralized in shared/constants.ts with two-level SETTINGS structure
- SETTINGS structure combines sections, parameters, and defaults in unified hierarchy
- **Config Watcher Pattern**: Multiple parameters can share same handler via `configs` with `parameters` array
- **File System Abstraction**: Only `shared/file-ops/` uses `fs` module directly; all other code uses abstraction functions
- **State Management**: Application state in `state/` (workspace, ui, managers, watchers), queue in `queue/`, logging in `shared/log.ts`
- **Self-Registering Watchers**: Watchers register themselves via `registerWatcher()`, eliminating need to return and collect watcher arrays
- **Queue Pattern**: Processing queue in `queue/`, accessible via `queue()` function to serialize async operations
- **Logging Utility**: Reusable logging functions in `shared/log.ts`, imports outputChannel from state
- **Watcher Types**: Custom `FileWatcher` and `SettingsWatcher` types defined in hook modules, `Watcher` union in state/types

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
- **Constants Refactoring**: CONFIG_SECTIONS, CONFIG_PARAMETERS, and SYMLINK_SETTINGS_DEFAULTS merged into single SETTINGS object (renamed from CONFIG)
- **Constants Decomposition**: Split constants.ts into modular folder structure (files, settings, watchers, managers)
- **Build-time Package.json Import**: Settings defaults read from package.json at compile time with full type safety
- **DRY Constants**: Section and property names defined once and reused throughout structure
- **Manager Factory Fix**: Fixed return type from Promise<Manager> to Manager for synchronous operation
- **Terminology Alignment**: Renamed "parameters" to "properties" in settings watcher to match VSCode API terminology
- **Path Aliases Implementation**: Added comprehensive path aliases for cleaner imports (@shared, @state, @commands, etc.)
- **Module Index Files**: Created index.ts files for commands and watchers modules to enable direct imports
- **Webpack Alias Configuration**: Synchronized webpack aliases with TypeScript paths for consistent module resolution
- **Import Cleanup**: Replaced relative paths with clean alias-based imports throughout codebase
- **Manager Factory Consolidation**: Consolidated decomposed factory back into single create-manager.ts file with internal functions
- **Named Parameters Pattern**: Converted all callbacks to use named object parameters with flexible extensions
- **Settings Manager Restructuring**: Moved symlink settings to managers/settings/symlink-config/ with flexible read function
- **Type Derivation**: SettingsPropertyValue now derived from actual default values for automatic type safety
- **Union Content Types**: Manager factory supports union types like SettingsPropertyValue | Record<string, SettingsPropertyValue>
- **Flexible Parameter System**: Added `[key: string]: any` index signature for extensible named parameters like `payload`, `spec`
- **Call Stack Organization**: Functions organized by dependency order with clear comments marking each level
- **Factory Simplification**: Removed over-engineered decomposition, consolidated to clean single-file implementation with flexible named parameters
- **Manager Hook Pattern**: Added useManager hook for simplified manager usage without global state
- **Settings Watcher Enhancement**: Modified useSettingsWatcher to watch all properties when properties array is omitted
- **Extension Decomposition**: Separated extension.ts into extension/ folder with activate.ts, ini.ts, managers-init.ts, register-commands.ts, make-watchers.ts
- **Entry Point**: main.ts serves as webpack entry point, re-exports from extension module
- **State Module**: Moved from src/state.ts to src/shared/state.ts (Phase 1.35), then to src/extension/state.ts (Phase 1.41), then decomposed to src/state/ (Phase 1.43)
- **TreeProvider State Management**: TreeProvider stored in centralized state, eliminating parameter passing through initialization chain
- **Config Watcher Enhancement**: Renamed `parameters` to `configs`, each config can watch multiple parameters with shared handler
- **Manager Initialization**: Extracted manager initialization into separate init-managers module
- **Function Naming**: Simplified initialize/reset function names (removed Extension/Initialization suffixes)
- **Watcher Refactoring**: Decomposed set-watchers.ts into separate watcher files (config-watcher, gitignore-watcher, symlink-config-watcher, next-config-watcher, current-config-watcher, symlinks-watcher)
- **Queue in State**: Moved processing queue from set-watchers to shared/state.ts for global access
- **Name-Based Watcher Registration**: Watchers registered by name using WATCHERS constants for selective disposal
- **Selective Watcher Disposal**: disposeWatchers() can dispose all or specific watchers by name
- **Constants Rename**: CONFIG renamed to SETTINGS for clarity
- **Hook Rename**: use-config-watcher.ts renamed to use-settings-watcher.ts
- **Watcher Rename**: config-watcher.ts renamed to settings-watcher.ts
- **Hook Simplification**: Removed legacy onCreate/onChange/onDelete syntax from use-file-watcher
- **Property Names**: filters (Filter | Filter[]), handlers (Handler | Handler[]) in use-file-watcher
- **Settings Watcher Split**: Split settings-watcher into symlink-settings-watcher and files-settings-watcher for independent management
- **Conditional Watchers**: filesSettingsWatcher only runs when hide options are enabled to save resources
- **Type Rename**: FileWatchEvent renamed to FileEventType, FileEventData renamed to FileEvent
- **Filter Signature**: Filter now receives FileEvent object instead of separate uri and event parameters for consistency
- **Logging System**: Added comprehensive logging throughout extension with output channel, auto-rotation, and timestamp formatting
- **Log Management**: Added maxLogEntries setting (default 1000), clearLogs and showLogs commands
- **Event Data Logging**: Watchers log detailed event data (file paths, event types, old/new values)
- **Manager Logging**: needsRegenerate functions log events and results for debugging
- **Manager Consistency**: All managers now have consistent structure with needs-regenerate.ts files
- **ESLint Module Boundaries**: Added no-restricted-imports rule to enforce index.ts-only imports for managers, commands, shared, views, watchers, extension
- **Commands Index**: Created commands/index.ts for centralized command exports
- **Import Consolidation**: register-commands.ts now imports all commands from single index
- **Hook Decomposition**: Decomposed hooks into separate folders (use-file-watcher/, use-settings-watcher/) with types.ts, implementation, and index.ts
- **Handler Extraction**: Extracted executeHandlers logic to separate files in both hooks for cleaner separation of concerns
- **Factory Pattern**: use-file-watcher uses createExecuteHandlers factory to maintain debounce state in closure
- **Hooks to Shared**: Moved hooks/ folder to shared/hooks/ for better organization
- **Factory to Shared**: Moved managers/manager/ factory to shared/factories/manager/ for better organization
- **Init Managers Rename**: Renamed init-managers.ts to managers-init.ts for consistency
- **State/Queue/Log Separation**: Moved state.ts and queue.ts to extension/ (application-level), extracted log.ts to shared/ (reusable utility)
- **Shared Module Isolation**: Changed file-ops functions to accept workspaceRoot parameter instead of importing from extension/state
- **State/Queue Reorganization**: Moved state and queue from extension/ to src/ level with modular structure
- **Gitignore Symlinks Feature**: Added gitignoreSymlinks setting (default: true) to automatically add created symlinks to .gitignore
- **Gitignore Manager Enhancement**: Enhanced to read current.symlink-config.json and add symlink targets to .gitignore based on setting
- **Current Config Watcher Integration**: Current config watcher now triggers gitignore manager updates when symlinks change
- **Basename Utility**: Added basename() function to file-ops for extracting filenames from VSCode URIs
- **GitignoringPart Enum**: Added Symlinks value to GitignoringPart enum for selective gitignore generation
- **Settings Constant Rename**: GITIGNORE_CREATED_SYMLINKS renamed to GITIGNORE_SYMLINKS for consistency
- **Settings Watcher Fix**: Fixed configuration structure in symlink-settings-watcher to properly detect setting changes
- **Gitignore Generation Fix**: Fixed to properly handle current config structure with directories and files sections
- **Parameter Constants**: Updated all managers to use SETTINGS constants instead of string literals for parameter names
- **Optional Parameters**: Made generate function parameters optional with default values for better maintainability
- **Symlink Settings Handler**: Added proper logging for WATCH_WORKSPACE setting changes and fixed parameter handling
- **Project Root Management**: Implemented automatic project root calculation from workspace folders with workspace settings integration
- **File-ops Standardization**: Updated all file-ops functions to accept both string and VSCode URI parameters consistently
- **Path Utilities**: Added normalize-path, find-common-path, and to-fs-path utilities for centralized path handling
- **Settings Scope Restriction**: All symlink-config settings restricted to workspace/folder scope with `"scope": "resource"`
- **Enum Extraction**: Extracted all enums from types.ts files to separate enums.ts files for better organization
- **Export Order Standardization**: Standardized index.ts export order: types first, then enums, then other exports
- **Type/Value Separation**: Clear separation between type-only exports (`export type *`) and value exports (`export *`)
- **Enum Organization**: FileEventType, ExclusionPart, GitignoringPart enums now in dedicated enums.ts files
