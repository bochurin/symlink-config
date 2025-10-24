# Shared Modules

## File Operations (`shared/file-ops/`)

### Core Functions
- `fullPath(workspaceRoot: string, endPath: string): string` - Resolve workspace-relative path
- `readFile(workspaceRoot: string, file: string): string` - Read file with empty fallback
- `writeFile(workspaceRoot: string, file: string, content: string, mode?: number): Promise<void>` - Write file with optional permissions
- `readDir(workspaceRoot: string, relativePath: string): fs.Dirent[]` - List directory contents
- `statFile(workspaceRoot: string, file: string): fs.Stats` - Get file stats
- `readSymlink(workspaceRoot: string, file: string): string` - Read symlink target

### Utilities
- `isWindows(): boolean` - OS detection (only file-ops uses `os` module)
- `isSymlink(uri: vscode.Uri): Promise<boolean>` - Check if path is symlink
- `isRootFile(workspaceRoot: string, uri: vscode.Uri): boolean` - Check if file in workspace root
- `normalizePath(pathString: string): string` - Normalize path separators
- `basename(pathString: string): string` - Extract filename
- `toFsPath(uri: vscode.Uri): string` - Convert URI to filesystem path
- `findCommonPath(paths: string[]): string` - Find common parent path

## Constants (`shared/constants/`)

### FILE_NAMES
- Service files: `GITIGNORE`, `NEXT_SYMLINK_CONFIG`, `CURRENT_SYMLINK_CONFIG`
- Scripts: `APPLY_SYMLINKS_BAT`, `APPLY_SYMLINKS_SH`, `CLEAN_SYMLINKS_BAT`, `CLEAN_SYMLINKS_SH`
- Admin: `ADMIN_SYMLINKS_BAT`

### SETTINGS
- Section: `SYMLINK_CONFIG.SECTION = 'symlink-config'`
- Properties: `WATCH_WORKSPACE`, `GITIGNORE_SERVICE_FILES`, `HIDE_SERVICE_FILES`, etc.
- Defaults: Build-time imported from package.json

### WATCHERS
- File watchers: `GITIGNORE`, `NEXT_CONFIG`, `CURRENT_CONFIG`, `SYMLINK_CONFIGS`, `SYMLINKS`
- Settings watchers: `SYMLINK_SETTINGS`, `FILES_SETTINGS`

### MANAGERS
- File managers: `GITIGNORE`, `NEXT_CONFIG`, `CURRENT_CONFIG`
- Settings managers: `FILE_EXCLUDE`, `SYMLINK_SETTINGS`

## Hooks (`shared/hooks/`)

### useFileWatcher
- `useFileWatcher(config: WatcherConfig): FileWatcher`
- Supports filtering, debouncing, multiple event types
- Handler signature: `(events: FileEvent[]) => void`

### useSettingsWatcher
- `useSettingsWatcher(config: SettingsWatcherConfig): SettingsWatcher`
- Watches VSCode configuration changes
- Optional properties array (watches all if omitted)

## Factories (`shared/factories/`)

### Manager Factory
- `createManager<CT>(callbacks: ManagerCallbacks<CT>): Manager<CT>`
- `useManager<CT>(callbacks: ManagerCallbacks<CT>): ManagerSugar<CT>`
- Encapsulates common manager pattern: read → generate → make → write → log

## Utilities

### Gitignore Operations (`shared/gitignore-ops/`)
- `parseGitignore(content: string): GitignoreRecord`
- `assembleGitignore(record: GitignoreRecord): string`

### Settings Operations (`shared/settings-ops/`)
- `readSettings<T>(parameter: string, defaultValue: T): T`
- `writeSettings<T>(parameter: string, value: T): Promise<void>`

### VSCode Utilities (`shared/vscode/`)
- `info(message: string): void` - Show info message
- `warning(message: string): void` - Show warning message
- `confirm(message: string): Promise<boolean>` - Show confirmation dialog
- `confirmWarning(message: string): Promise<boolean>` - Show warning confirmation

### Logging (`shared/log/`)
- `log(message: string): void` - Log with timestamp
- `clearLogs(): void` - Clear output channel
- `showLogs(): void` - Show output channel

### Other
- `adminDetection(): Promise<boolean>` - Detect admin/root privileges
- `scriptRunner(scriptPath: string): void` - Run script in terminal
