# Log Module

Logging utilities with output channel integration.

- `log.ts` - Log messages with timestamps and auto-rotation

## Rules

- Uses output channel from state
- Auto-clears logs based on `maxLogEntries` setting
- Export through `index.ts` only
