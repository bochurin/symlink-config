# State Module

Centralized application state management.

- `workspace.ts` - Workspace root and name
- `ui.ts` - Tree provider, output channel, silent mode
- `watchers.ts` - Watcher registry

## Rules

- Single source of truth for application state
- NO business logic - only getters/setters
- Watchers register by name for selective disposal
- Export through `index.ts` only
