# Watcher Modules

All watchers self-register via `registerWatcher(name, watcher)` pattern.

## File Watchers (`watchers/files/`)

### _gitignore
- **Pattern**: `**/.gitignore`
- **Events**: Created, Modified, Deleted
- **Filter**: Root files only
- **Handler**: Regenerates gitignore manager

### next_symlink-config_json
- **Pattern**: `**/next.symlink-config.json`
- **Events**: Created, Modified, Deleted
- **Filter**: Root files only
- **Handler**: Regenerates next config, refreshes tree
- **Continuous Mode**: Auto-applies configuration

### current_symlink-config_json
- **Pattern**: `**/current.symlink-config.json`
- **Events**: Created, Modified, Deleted
- **Filter**: Root files only
- **Handler**: Refreshes tree
- **Continuous Mode**: Auto-cleans configuration

### symlink-config_json
- **Pattern**: `**/symlink-config.json`
- **Events**: Created, Modified, Deleted
- **Debounce**: 500ms
- **Handler**: Regenerates next config, refreshes tree

### symlinks
- **Pattern**: `**/*`
- **Events**: Created, Modified, Deleted
- **Filter**: Symlinks only
- **Debounce**: 500ms
- **Handler**: Regenerates current config, refreshes tree

## Settings Watchers (`watchers/settings/`)

### symlink-config_props
- **Section**: `symlink-config`
- **Properties**: All extension settings
- **Handler**: Updates managers and watchers based on settings changes

### files_exclude
- **Section**: `files`
- **Property**: `exclude`
- **Handler**: Regenerates file exclude manager

## Watcher Pattern

### Self-Registration
```typescript
export function gitignoreWatcher(): void {
  const watcher = useFileWatcher({...})
  registerWatcher(WATCHERS.GITIGNORE, watcher)
}
```

### Conditional Creation
Watchers created in `extension/make-watchers.ts` based on settings:
- Always: `symlink-config_props`
- Conditional: `files_exclude`, `_gitignore`, workspace watchers

### Name-Based Management
- `registerWatcher(name, watcher)` - Register or replace
- `disposeWatchers(...names)` - Dispose specific watchers
- `disposeWatchers()` - Dispose all watchers
