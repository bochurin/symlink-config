# Extension Lifecycle

## Entry Point (`main.ts`)

Re-exports `activate` and `deactivate` from `extension/` module.

## Extension Module (`extension/`)

### activate.ts
- `activate(context: vscode.ExtensionContext): Promise<void>`
- Creates output channel
- Initializes extension via `ini()`
- Registers workspace folder change listener
- Returns deactivate function

- `deactivate(): void`
- Disposes all watchers
- Cleans up resources

### ini.ts
- `ini(): Promise<void>`
- Sets workspace root and name
- Initializes managers via `managersInit()`
- Creates watchers via `makeWatchers()`
- Registers commands via `registerCommands()`
- Creates tree view

### managers-init.ts
- `managersInit(force?: boolean): Promise<void>`
- Initializes all managers based on settings
- Conditional initialization:
  - Always: next config, symlink settings
  - Conditional: gitignore, file exclude (based on settings)

### make-watchers.ts
- `makeWatchers(): void`
- Creates file and settings watchers
- Conditional creation based on settings:
  - Always: symlink settings watcher
  - Conditional: files settings, gitignore, workspace watchers

### register-commands.ts
- `registerCommands(context: vscode.ExtensionContext): void`
- Registers all extension commands
- Adds disposables to context.subscriptions

### helpers/workspace.ts
- `isWorkspaceRootValid(workspaceRoot: string): boolean` - Validates workspace root path
- `rebase(): string` - Calculates workspace root from workspace folders
- `getWorkspaceName(): string` - Gets workspace name with priority-based resolution
  - Priority: workspace file name → workspace root directory name → 'unknown workspace'
  - Uses settings manager to read workspace root property
  - Integrates with `basename()` from shared file-ops

## Initialization Flow

1. **activate()** - Extension activation
2. **ini()** - Core initialization
3. **managersInit()** - Initialize managers
4. **makeWatchers()** - Create watchers
5. **registerCommands()** - Register commands
6. **Create tree view** - Setup UI

## Workspace Change Handling

When workspace folders change:
1. Dispose all watchers
2. Re-run `ini()` to reinitialize everything
