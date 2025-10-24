# Views Module

VSCode UI components.

- `tree-data-provider/` - Symlink configuration tree view
- `code-lens-provider/` - Script file code lens with run buttons

## Rules

- Pure UI logic only - NO business logic
- Use `getTreeProvider()` from state for tree access
- Tree items use `resourceUri` for theme icons
- Code lens uses `$(icon)` syntax for consistency
- Refresh tree via `getTreeProvider().refresh()`
- Export through `index.ts` only
