# Watchers Module

File and settings watchers with self-registration pattern.

- `files/` - File system watchers (gitignore, configs, symlinks)
- `settings/` - VSCode settings watchers

All watchers register themselves via `registerWatcher()` and use `queue()` for serialization.

## Rules

- Use `useFileWatcher()` or `useSettingsWatcher()` hooks
- Self-register via `registerWatcher(name, watcher)`
- ALL handlers must use `queue()` for async operations
- Use constants from `WATCHERS` for names
- Conditional watchers check settings before registration
- Export through `index.ts` only
