# Abstraction Suggestions for VSCode Extension

## Critical Violations Found

### 1. VSCode API Abstractions Needed

#### **shared/vscode/document.ts**
```typescript
export async function openDocument(path: string): Promise<void>
export async function showDocument(path: string): Promise<void>
export async function copyToClipboard(text: string): Promise<void>
export async function showError(message: string): void
```

#### **shared/vscode/dialogs.ts**
```typescript
export async function showOpenDialog(options: OpenDialogOptions): Promise<string[] | undefined>
export async function showSaveDialog(options: SaveDialogOptions): Promise<string | undefined>
```

#### **shared/vscode/commands.ts**
```typescript
export async function executeCommand(command: string, ...args: any[]): Promise<any>
export function setContext(key: string, value: any): void
```

#### **shared/vscode/ui.ts**
```typescript
export function createStatusBarItem(alignment: StatusBarAlignment, priority?: number): StatusBarItem
export function getConfiguration(section: string): WorkspaceConfiguration
```

### 2. File System Abstractions Needed

#### **shared/file-ops/symlink.ts**
```typescript
export async function createSymlink(target: string, link: string, type?: 'file' | 'dir'): Promise<void>
export async function removeSymlink(path: string): Promise<void>
export async function isSymlinkExists(path: string): Promise<boolean>
```

#### **shared/file-ops/directory.ts**
```typescript
export async function createDirectory(path: string, recursive?: boolean): Promise<void>
export async function removeDirectory(path: string): Promise<void>
export async function directoryExists(path: string): Promise<boolean>
```

#### **shared/file-ops/path.ts**
```typescript
export function join(...paths: string[]): string
export function relative(from: string, to: string): string
export function dirname(path: string): string
export function resolve(...paths: string[]): string
```

### 3. Files to Refactor

#### High Priority (Direct API Usage):
1. **commands/apply-configuration/apply-config.ts**
   - Replace `vscode.window.showTextDocument` → `showDocument()`
   - Replace `vscode.env.clipboard.writeText` → `copyToClipboard()`
   - Replace `vscode.window.showErrorMessage` → `showError()`
   - Replace `path.join`, `path.basename` → shared path utilities

2. **commands/create-symlink.ts**
   - Replace `vscode.window.createStatusBarItem` → `createStatusBarItem()`
   - Replace `vscode.commands.executeCommand` → `executeCommand()`
   - Replace `fs.readFile`, `fs.stat`, `fs.writeFile` → shared file-ops
   - Replace `path.*` → shared path utilities

3. **commands/apply-configuration/direct/direct-symlink-creator.ts**
   - Replace all `fs.*` → shared file-ops abstractions
   - Replace `path.*` → shared path utilities

4. **commands/apply-configuration/direct/direct-symlink-remover.ts**
   - Replace all `fs.*` → shared file-ops abstractions

#### Medium Priority:
5. **commands/open-settings.ts** - Replace `executeCommand`
6. **commands/pick-project-root.ts** - Replace `showOpenDialog`
7. **commands/reset-settings.ts** - Replace `getConfiguration`, `showInformationMessage`
8. **All script generation files** - Replace `path.*` usage

### 4. Implementation Strategy

1. **Create new shared abstractions** in `shared/vscode/` and `shared/file-ops/`
2. **Update existing files** to use abstractions instead of direct imports
3. **Remove direct imports** of `vscode`, `path`, `fs` from non-shared modules
4. **Test thoroughly** to ensure functionality is preserved

### 5. Benefits

- **Consistency**: All VSCode API usage goes through shared abstractions
- **Testability**: Easier to mock shared functions for testing
- **Maintainability**: Changes to API usage only need updates in shared modules
- **Reusability**: Abstractions can be reused across different projects
- **Type Safety**: Better TypeScript support with proper typing

### 6. Current Compliant Modules

✅ **shared/file-ops/** - Already properly abstracts fs/path/os
✅ **shared/vscode/** - Already has some VSCode abstractions (info, warning, choice, confirm)
✅ **Most managers** - Use shared abstractions correctly
✅ **Most watchers** - Use shared abstractions correctly