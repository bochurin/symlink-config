# Shared Module

Reusable utilities and abstractions.

- `file-ops/` - File system abstractions (only module using fs/os directly)
- `constants/` - FILE_NAMES, SETTINGS, WATCHERS, MANAGERS
- `hooks/` - useFileWatcher, useSettingsWatcher
- `factories/` - Manager factory pattern
- `gitignore-ops/` - Gitignore parsing/assembly
- `settings-ops/` - Settings read/write
- `vscode/` - VSCode UI utilities (info, warning, confirm)

## Rules

- NO imports from outside `shared/*` - only cross-shared imports allowed
- Must be reusable across projects
- ONLY `file-ops/` can use `fs` and `os` directly
- All file operations accept `workspaceRoot` parameter
- Constants use build-time package.json imports
- Hooks return disposables for cleanup
- Export through `index.ts` only
