# Commands Module

VSCode command implementations.

- `apply-configuration/` - Apply and clean symlink operations
- Tree commands (expand, collapse, refresh)
- Symlink creation workflow (select source/target)
- Settings commands (open, reset, pick project root)
- Utility commands (refresh managers, clear logs, run scripts)

## Rules

- Each command in separate file
- Export through `index.ts` only
- Register in `extension/register-commands.ts`
- Use `queue()` for async operations
- User interaction (dialogs, confirmations) in command, not in utilities
- Use `info()`, `warning()`, `confirm()` from `shared/vscode`
