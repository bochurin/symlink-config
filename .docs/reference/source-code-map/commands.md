# Command Modules

## Apply Configuration (`commands/apply-configuration/`)

### Main Commands
- `applyConfig(silent?: boolean): Promise<void>` - Apply symlink configuration
- `cleanConfig(silent?: boolean): Promise<void>` - Clean symlinks from current config

### Direct Operations (`direct/`)
- `createSymlinksDirectly(operations: SymlinkOperation[]): Promise<void>`
- `removeSymlinksDirectly(): Promise<void>`
- Used when running as admin or for clean operations

### Script Generation (`scripts/`)
- `applyScript(operations: SymlinkOperation[], workspaceRoot: string, targetOS: 'windows' | 'unix'): Promise<void>`
- `cleanScript(workspaceRoot: string, targetOS: 'windows' | 'unix'): Promise<void>`

### Utilities (`utils/`)
- `collectOperations(workspaceRoot: string): SymlinkOperation[]`
- `types.ts` - SymlinkOperation interface

## Other Commands

### Tree Operations
- `expandNode(node: TreeNode): void`
- `collapseNode(node: TreeNode): void`
- `refreshTree(): void`

### Symlink Creation
- `selectSymlinkSource(uri: vscode.Uri): Promise<void>` - Step 1: Select source
- `selectSymlinkTarget(uri: vscode.Uri): Promise<void>` - Step 2: Select target
- `cancelSymlinkSelection(): void` - Cancel selection

### Configuration
- `openSymlinkConfig(uri: vscode.Uri): Promise<void>` - Open config file for tree item
- `pickProjectRoot(): Promise<void>` - Pick project root directory

### Utility
- `refreshManagers(): Promise<void>` - Manually refresh all managers
- `clearLogs(): void` - Clear output channel
- `runScript(scriptPath: string): void` - Run script in terminal

## Command Registration

All commands registered in `extension/register-commands.ts`:
- `symlink-config.applyConfiguration`
- `symlink-config.cleanConfiguration`
- `symlink-config.selectSymlinkSource`
- `symlink-config.selectSymlinkTarget`
- `symlink-config.cancelSymlinkSelection`
- `symlink-config.openSymlinkConfig`
- `symlink-config.pickProjectRoot`
- `symlink-config.refreshManagers`
- `symlink-config.clearLogs`
- `symlink-config.expandNode`
- `symlink-config.collapseNode`
- `symlink-config.refreshTree`
