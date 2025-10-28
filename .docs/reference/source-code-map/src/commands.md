# Command Modules

## Apply Configuration (`commands/apply-configuration/`)

### Main Commands
- `applyConfig(): Promise<void>` - Apply symlink configuration
  - **Updated**: Removed silent parameter, uses @dialogs for consistent user interaction
  - **Continuous mode**: Auto-generates scripts and opens in Code when continuousMode is true
  - **Unix admin support**: Generates both Windows and Unix admin scripts
  - Uses shared abstractions (`@shared/vscode`, `@shared/file-ops`) and `@dialogs` for user interaction
- `cleanConfig(): Promise<void>` - Clean symlinks from current config
  - **Updated**: Same improvements as applyConfig - no silent parameter, continuous mode support

### Direct Operations (`direct/`)
- `createSymlinksDirectly(operations: SymlinkOperation[], workspaceRoot: string): Promise<{success: number, failed: number, errors: string[]}>`
- `removeSymlinksDirectly(): Promise<void>`
- Used when running as admin or for clean operations
- No longer handles dangerous source filtering (done upstream)

### Script Generation (`scripts/`)
- `applyScript(operations: SymlinkOperation[], workspaceRoot: string, targetOS: 'windows' | 'unix'): Promise<void>`
- `cleanScript(workspaceRoot: string, targetOS: 'windows' | 'unix'): Promise<void>`
- No longer handles dangerous source filtering (done upstream)

### Utilities (`utils/`)
- `collectOperations(): SymlinkOperation[]` - Collects operations based on scriptGenerationMode
- `filterDangerousSources(operations: SymlinkOperation[]): Promise<SymlinkOperation[]>` - Validates and filters dangerous symlinks
- `types.ts` - SymlinkOperation interface

#### Operation Collection Logic
- **Complete mode**: Delete all current symlinks, create all next symlinks
- **Incremental mode**: Compare current vs next configs, only delete/create changed entries
- Uses Map-based comparison for efficient target/source matching

#### Dangerous Source Filtering
- Filters same-path operations (source === target) automatically
- Validates against `DANGEROUS_SOURCES.PATTERNS` (`.vscode/`, `.code-workspace`, `.gitignore`)
- Checks if source and target basenames match (dangerous only if same name)
- User confirmation dialog with "Include Anyway" or "Skip Dangerous Symlinks"

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
- `openSettings(): void` - Open workspace settings filtered to symlink-config (uses `workbench.action.openWorkspaceSettings`)
- `resetSettings(): Promise<void>` - Reset all settings to defaults by setting each to undefined
- `pickWorkspaceRoot(): Promise<void>` - Pick workspace root directory

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
- `symlink-config.openSettings`
- `symlink-config.resetSettings`
- `symlink-config.pickWorkspaceRoot`
- `symlink-config.refreshManagers`
- `symlink-config.clearLogs`
- `symlink-config.expandNode`
- `symlink-config.collapseNode`
- `symlink-config.refreshTree`
