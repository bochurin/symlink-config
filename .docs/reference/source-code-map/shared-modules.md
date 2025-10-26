# Shared Modules

## File Operations (`shared/file-ops/`)

### Core Functions
- `fullPath(workspaceRoot: string, endPath: string): string` - Resolve workspace-relative path
- `readFile(workspaceRoot: string, file: string): string` - Read file with empty fallback
- `writeFile(workspaceRoot: string, file: string, content: string, mode?: number): Promise<void>` - Write file with optional permissions
- `readDir(workspaceRoot: string, relativePath: string): fs.Dirent[]` - List directory contents
- `statFile(workspaceRoot: string, file: string): fs.Stats` - Get file stats
- `readSymlink(workspaceRoot: string, file: string): string` - Read symlink target

### Path Operations (`path-basics.ts`)
- `join(...paths: string[]): string` - Join path segments
- `dirname(filePath: string): string` - Get directory name
- `basename(pathOrUri: string | vscode.Uri): string` - Extract filename (Uri-aware)
- `relative(from: string, to: string): string` - Get relative path
- `resolve(...paths: string[]): string` - Resolve absolute path
- `extname(filePath: string): string` - Get file extension

### Platform Detection (`os.ts`)
- `Platform` enum: `Windows = 'windows'`, `Unix = 'unix'`
- `platform(): Platform` - Get current platform (Windows or Unix)
- **Note**: Mac/Linux both return `Platform.Unix` (use Unix commands)

### Directory Operations (`directory.ts`)
- `directoryExists(workspaceRoot: string, relativePath: string): boolean` - Check if directory exists (sync)
- `createDirectory(workspaceRoot: string, relativePath: string, options?: { recursive?: boolean }): Promise<void>` - Create directory (async)
- `removeDirectory(workspaceRoot: string, relativePath: string): Promise<void>` - Remove directory (async)

### Symlink Operations (`symlink.ts`)
- `createSymlink(target: string, linkPath: string): Promise<void>` - Create symlink (async)
- `removeSymlink(linkPath: string): Promise<void>` - Remove symlink (async)

### Utilities
- `isSymlink(uri: vscode.Uri): Promise<boolean>` - Check if path is symlink
- `isRootFile(workspaceRoot: string, uri: vscode.Uri): boolean` - Check if file in workspace root
- `normalizePath(pathString: string): string` - Normalize path separators
- `toFsPath(uri: vscode.Uri): string` - Convert URI to filesystem path
- `findCommonPath(paths: string[]): string` - Find common parent path

## Constants (`shared/constants/`)

### FILE_NAMES
- Service files: `GITIGNORE`, `NEXT_SYMLINK_CONFIG`, `CURRENT_SYMLINK_CONFIG`
- Scripts: `APPLY_SYMLINKS_BAT`, `APPLY_SYMLINKS_SH`, `CLEAN_SYMLINKS_BAT`, `CLEAN_SYMLINKS_SH`
- Admin: `RUN_ADMIN_BAT`, `RUN_ADMIN_SH` (cross-platform admin script support)

### SETTINGS
- Section: `SYMLINK_CONFIG.SECTION = 'symlink-config'`
- Properties: `WATCH_WORKSPACE`, `GITIGNORE_SERVICE_FILES`, `HIDE_SERVICE_FILES`, `RESET_TO_DEFAULTS`, etc.
- Defaults: Build-time imported from package.json
- **RESET_TO_DEFAULTS**: Boolean setting that triggers reset of all settings to defaults (auto-turns off after reset)

### DANGEROUS_SOURCES
- `PATTERNS: string[]` - Glob patterns for dangerous symlink sources
- Includes: `**/.vscode/**`, `**/*.code-workspace`, `**/.gitignore`
- Used by `filterDangerousSources()` to validate operations

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
- Encapsulates common manager pattern: read → generate → make → write → log → afterParty
- **afterPartyCallback**: Optional callback executed after write completes (e.g., reset settings, trigger watchers)

## Utilities

### Gitignore Operations (`shared/gitignore-ops/`)
- `parseGitignore(content: string): GitignoreRecord`
- `assembleGitignore(record: GitignoreRecord): string`

### Settings Operations (`shared/settings-ops/`)
- `readSettings<T>(parameter: string, defaultValue: T): T`
- `writeSettings<T>(parameter: string, value: T): Promise<void>`

### VSCode Abstractions (`shared/vscode/`)

#### User Interface (Pure VSCode Wrappers)
- **Note**: Dialog functions moved to `@dialogs` module for application-specific behavior
- `info(message: string): void` - Pure VSCode info message (no silent mode)
- `warning(message: string): void` - Pure VSCode warning message
- `showError(message: string): void` - Pure VSCode error message
- `choice(message: string, ...choices: string[]): Promise<string | undefined>` - Pure VSCode choice dialog
- `warningChoice(message: string, ...choices: string[]): Promise<string | undefined>` - Pure VSCode warning choice
- `confirm(message: string, confirmText?: string): Promise<boolean>` - Pure VSCode confirmation

#### Dialog Organization (`shared/vscode/dialogs/`)
- `open.ts` - File open dialogs (`showOpenDialog`)
- `info.ts` - Information messages
- `warning.ts` - Warning messages
- `choice.ts` - Choice dialogs
- **Application logic**: Use `@dialogs` module instead for silent mode and logging support

#### Document Operations
- `openTextDocument(filePath: string): Promise<vscode.TextDocument>` - Open text document
- `showTextDocument(document: vscode.TextDocument): Promise<void>` - Show document in editor
- `openDocument(filePath: string): Promise<void>` - Open and show document
- `showDocument(filePath: string): Promise<void>` - Alias for openDocument

#### Clipboard Operations
- `copyToClipboard(text: string): Promise<void>` - Copy text to clipboard
- `writeToClipboard(text: string): Promise<void>` - Alias for copyToClipboard

#### Commands
- `executeCommand(command: string, ...args: any[]): Promise<any>` - Execute VSCode command

#### Dialogs
- `showOpenDialog(options?: vscode.OpenDialogOptions): Promise<vscode.Uri[] | undefined>` - Show file open dialog

### Logging (`src/log/` - moved from shared)
- **Note**: Log module moved from shared/ to src/ (application-specific, not reusable)
- `log(message: string, level?: LogLevel): void` - Log with timestamp and optional user notification
- `LogLevel` enum: `Info`, `Error` (replaces boolean `withInfo` parameter)
- `clearLogs(): void` - Clear output channel
- `showLogs(): void` - Show output channel
- Uses @log path alias instead of @shared/log

### ESLint Architectural Enforcement
- **no-restricted-imports** rules prevent direct API usage outside shared modules
- Only `shared/file-ops/` can import `fs`, `fs/promises`, `path`, `os` directly
- Only `shared/vscode/` can import `vscode` directly (plus extension/, state/, log/, views/)
- All other modules must use shared abstractions
- **48 violations identified** for refactoring to use shared abstractions

### Other
- `adminDetection(): Promise<boolean>` - Detect admin/root privileges
- `scriptRunner(scriptPath: string): void` - Run script in terminal
