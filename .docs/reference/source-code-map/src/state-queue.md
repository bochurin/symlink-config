# State Management and Queue

## State Module (`state/`)

Centralized application state management at `src/` level.

### Workspace State (`workspace.ts`)
- `setWorkspaceRoot(root: string): void`
- `getWorkspaceRoot(): string`
- `setWorkspaceName(name: string): void`
- `getWorkspaceName(): string`

### UI State (`ui.ts`)
- `setSilentMode(silent: boolean): void`
- `getSilentMode(): boolean`
- `setTreeProvider(provider: SymlinkTreeProvider): void`
- `getTreeProvider(): SymlinkTreeProvider | undefined`
- `setOutputChannel(channel: vscode.OutputChannel): void`
- `getOutputChannel(): vscode.OutputChannel | undefined`

### Manager Registry (removed)
- **Note**: Manager registry removed in recent refactor
- Managers are now stateless and created on-demand via `useManager()` hook
- No longer need centralized manager state

### Watcher Registry (`watchers.ts`)
- `registerWatcher(name: string, watcher: Watcher): void`
- `getWatchers(...names: string[]): Watcher[]`
- `disposeWatchers(...names: string[]): void`

### Types (`types.ts`)
- `Watcher = FileWatcher | SettingsWatcher`
- Custom watcher types defined in hook modules

## Queue Module (`queue/`)

Operation serialization at `src/` level.

### queue.ts
- `queue(fn: () => Promise<void>): Promise<void>`
- Serializes async operations to prevent race conditions
- Maintains promise chain for sequential execution
- Error handling with console logging

## Architecture Notes

### State Organization
- **Workspace**: Root path and name
- **UI**: Silent mode, tree provider, output channel
- **Managers**: Manager registry (currently unused, managers are stateless)
- **Watchers**: Watcher registry with name-based disposal

### Queue Usage
Only watcher event handlers use queue for serialization:
```typescript
// In watcher event handlers
queue(() => handleEvent())
```

**Note**: File operations and managers do NOT use queue directly - only watchers use it to serialize concurrent events.

### Module Location
Both state and queue at `src/` level (application-level modules), not in `shared/` (reusable utilities).
