# Required Shared Abstractions

## 1. VSCode Document Operations (`shared/vscode/document.ts`)

```typescript
export async function openDocument(filePath: string): Promise<void>
export async function showDocument(filePath: string): Promise<void>
export async function openTextDocument(filePath: string): Promise<vscode.TextDocument>
```

**Used by:**
- `commands/apply-configuration/apply-config.ts`
- `commands/open-symlink-config.ts`
- `commands/create-symlink.ts`

## 2. VSCode Clipboard Operations (`shared/vscode/clipboard.ts`)

```typescript
export async function copyToClipboard(text: string): Promise<void>
```

**Used by:**
- `commands/apply-configuration/apply-config.ts`

## 3. VSCode Error Messages (`shared/vscode/error.ts`)

```typescript
export function showError(message: string): void
```

**Used by:**
- `commands/apply-configuration/apply-config.ts`
- `commands/create-symlink.ts`

## 4. VSCode Dialogs (`shared/vscode/dialogs.ts`)

```typescript
export async function showOpenDialog(options?: vscode.OpenDialogOptions): Promise<vscode.Uri[] | undefined>
```

**Used by:**
- `commands/pick-project-root.ts`

## 5. VSCode Commands (`shared/vscode/commands.ts`)

```typescript
export async function executeCommand(command: string, ...args: any[]): Promise<any>
export function setContext(key: string, value: any): void
```

**Used by:**
- `commands/open-settings.ts`
- `commands/create-symlink.ts`

## 6. VSCode Configuration (`shared/vscode/configuration.ts`)

```typescript
export function getConfiguration(section?: string): vscode.WorkspaceConfiguration
```

**Used by:**
- `commands/reset-settings.ts`
- `managers/settings/symlink-config_props/callbacks/make.ts`

## 7. VSCode UI Components (`shared/vscode/ui.ts`)

```typescript
export function createStatusBarItem(alignment: vscode.StatusBarAlignment, priority?: number): vscode.StatusBarItem
```

**Used by:**
- `commands/create-symlink.ts`

## 8. File System - Path Operations (`shared/file-ops/path.ts`)

```typescript
export function join(...paths: string[]): string
export function relative(from: string, to: string): string
export function dirname(path: string): string
export function resolve(...paths: string[]): string
export function extname(path: string): string
```

**Used by:** 22+ files currently importing `path` directly

## 9. File System - Symlink Operations (`shared/file-ops/symlink.ts`)

```typescript
export async function createSymlink(target: string, link: string, type?: 'file' | 'dir'): Promise<void>
export async function removeSymlink(path: string): Promise<void>
export async function symlinkExists(path: string): Promise<boolean>
export async function readSymlinkTarget(path: string): Promise<string>
```

**Used by:**
- `commands/apply-configuration/direct/direct-symlink-creator.ts`
- `commands/apply-configuration/direct/direct-symlink-remover.ts`

## 10. File System - Directory Operations (`shared/file-ops/directory.ts`)

```typescript
export async function createDirectory(path: string, options?: { recursive?: boolean }): Promise<void>
export async function removeDirectory(path: string): Promise<void>
export async function directoryExists(path: string): Promise<boolean>
```

**Used by:**
- `commands/apply-configuration/direct/direct-symlink-creator.ts`

## 11. File System - File Stats (`shared/file-ops/stats.ts`)

```typescript
export async function getStats(path: string): Promise<fs.Stats>
export async function getLinkStats(path: string): Promise<fs.Stats>
export async function fileExists(path: string): Promise<boolean>
```

**Used by:**
- `commands/apply-configuration/direct/direct-symlink-creator.ts`
- `commands/apply-configuration/direct/direct-symlink-remover.ts`
- `commands/create-symlink.ts`
- `managers/settings/symlink-config_props/callbacks/make.ts`

## 12. File System - Async File Operations (`shared/file-ops/async-file.ts`)

```typescript
export async function readFileAsync(path: string, encoding?: BufferEncoding): Promise<string>
export async function writeFileAsync(path: string, content: string, encoding?: BufferEncoding): Promise<void>
export async function statAsync(path: string): Promise<fs.Stats>
```

**Used by:**
- `commands/create-symlink.ts`

## 13. OS Operations (`shared/file-ops/os.ts`)

```typescript
export function platform(): NodeJS.Platform
export function isWindows(): boolean
export function isUnix(): boolean
```

**Used by:**
- `commands/apply-configuration/apply-config.ts`
- `commands/apply-configuration/clean-config.ts`
- `shared/admin-detection.ts`
- `shared/script-runner.ts`

## Implementation Priority

### **High Priority (Critical Violations)**
1. **VSCode abstractions** - 16 command files need these
2. **Path operations** - 22 files need these
3. **File system operations** - 4 files need these

### **Medium Priority**
4. **OS operations** - 4 files need these
5. **Additional VSCode utilities** - Less frequently used

## Files That Need Refactoring (48 ESLint Errors)

### **Commands (16 files)**
- `apply-config.ts` - vscode, os, path
- `clean-config.ts` - vscode, os, path  
- `create-symlink.ts` - vscode, path, fs/promises
- `open-settings.ts` - vscode
- `open-symlink-config.ts` - vscode, path
- `pick-project-root.ts` - vscode
- `reset-settings.ts` - vscode
- `tree-operations.ts` - vscode
- `run-script.ts` - path
- All script generation files - path

### **Direct Operations (2 files)**
- `direct-symlink-creator.ts` - fs, path
- `direct-symlink-remover.ts` - fs, path

### **Shared Modules (6 files)**
- `admin-detection.ts` - os
- `script-runner.ts` - vscode, path, os
- `settings-ops/*.ts` - vscode (2 files)
- `hooks/use-*-watcher/*.ts` - vscode (2 files)

### **Other (4 files)**
- `managers/settings/symlink-config_props/callbacks/make.ts` - vscode, fs
- `shared/index.ts` - vscode export
- `test/extension.test.ts` - vscode
- Various script generation files - path

## Benefits After Implementation

1. **Architectural Compliance** - All modules follow shared abstraction pattern
2. **ESLint Clean** - 48 errors resolved
3. **Maintainability** - Centralized API usage
4. **Testability** - Easier to mock shared functions
5. **Consistency** - Uniform patterns across codebase