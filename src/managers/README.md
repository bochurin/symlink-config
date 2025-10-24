# Managers Module

File and settings managers following factory-based architecture.

- `files/` - File managers (gitignore, configs)
- `settings/` - Settings managers (files.exclude, symlink-config properties)

All managers use callback-based factory pattern with read/write/make/generate lifecycle.

## Rules

- ALL managers must use `createManager()` factory
- Callbacks go in `callbacks/` subfolder
- Must have `objectNameCallback` for logging
- Export through `index.ts` only
- Use `useManager()` hook for on-demand creation (not registered in state)
- Folder names use `_` for `.` (e.g., `symlink-config_json`)
