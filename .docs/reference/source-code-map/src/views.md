# View Modules

## Symlink Tree View (`views/symlink-tree/`)

### Tree Data Provider
- `SymlinkTreeProvider` - Implements `vscode.TreeDataProvider<TreeNode>`
- **Methods**:
  - `getTreeItem(element: TreeNode): vscode.TreeItem`
  - `getChildren(element?: TreeNode): TreeNode[]`
  - `refresh(): void`
  - `setTreeBase(base: 'targets' | 'sources'): void`

### Tree Generation (`generate/`)
- `generate(treeBase: 'targets' | 'sources'): TreeNode` - Build tree structure
- `parseConfig(config: Config): Map<string, SymlinkEntry & { status: SymlinkStatus }>` - Parse config entries
- `sortTree(node: TreeNode): void` - Sort tree nodes

### Tree Rendering
- `treeToItems(node: TreeNode): SymlinkTreeItem[]` - Convert tree to VSCode items
- `SymlinkTreeItem` - Extends `vscode.TreeItem` with proper icon handling

### Types
- `TreeNode` - Tree structure with children
- `SymlinkStatus` - 'new' | 'deleted' | 'unchanged'
- `ElementType` - 'root' | 'dir' | 'file'

### Icon System
- Uses `resourceUri` for theme-based icons
- `CollapsibleState.Collapsed/Expanded` for directories
- `CollapsibleState.None` for files
- **Critical**: Directories need Collapsed/Expanded for folder icons

## Script Code Lens (`views/script-code-lens.ts`)

### ScriptCodeLensProvider
- Implements `vscode.CodeLensProvider`
- Provides "Run Script" code lens for `.bat` and `.sh` files
- **Methods**:
  - `provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[]`
  - `resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens`

## View Registration

Registered in `extension/activate.ts`:
- Tree view: `vscode.window.createTreeView('symlink-config-tree', { treeDataProvider })`
- Code lens: `vscode.languages.registerCodeLensProvider({ pattern: '**/*.{bat,sh}' }, provider)`
