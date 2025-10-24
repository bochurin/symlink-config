# Extension Module

VSCode extension lifecycle and initialization.

- `activate.ts` - Extension activation and deactivation
- `initialize.ts` - Extension initialization logic
- `register-commands.ts` - Command registration
- `managers-init.ts` - Manager initialization

## Rules

- Only this module interacts with VSCode extension API lifecycle
- All commands must be registered in `register-commands.ts`
- Initialization order: state → managers → watchers → commands
- Use `queue()` for all async operations
- Export through `index.ts` only
