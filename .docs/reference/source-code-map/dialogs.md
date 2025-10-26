# Dialogs Module - Source Code Map

**Purpose**: Application-specific dialog abstractions with silent mode and logging support

## Module Structure

```
src/dialogs/
├── index.ts              # Public API exports
├── info.ts               # Information messages
├── warning.ts            # Warning messages  
├── error.ts              # Error messages (never silent)
├── choice.ts             # Multiple choice dialogs
├── confirm.ts            # Confirmation dialogs
└── warning-choice.ts     # Warning choice dialogs
```

## Key Functions

### Information & Warnings
- **`info(message: string, withLog = true)`** - Information messages with silent mode support
- **`warning(message: string, withLog = true)`** - Warning messages with silent mode support
- **`showError(message: string, withLog = true)`** - Error messages (always shown, never silent)

### User Choices
- **`choice(message: string, ...options: string[])`** - Multiple choice dialogs
- **`choice(message: string, withLog: boolean, ...options: string[])`** - With explicit logging control
- **`confirm(message: string, confirmText?: string, withLog = true)`** - Confirmation dialogs
- **`warningChoice(message: string, ...options: string[])`** - Warning choice dialogs

## Silent Mode Behavior

### Automatic Actions
- **Info/Warning**: Suppressed when `symlink-config.silent` is true
- **Errors**: Always shown regardless of silent mode
- **Choices**: Auto-select first option in silent mode
- **Confirmations**: Auto-confirm (return true) in silent mode

### Logging Integration
- **Default logging**: All functions log by default (`withLog = true`)
- **Log format**: `INFO: message`, `WARNING: message`, `ERROR: message`, `CHOICE: message [opt1, opt2]`
- **Silent mode logging**: Logs auto-selections: "Silent mode: auto-selecting first option: X"
- **User selections**: Logs actual user choices: "User selected: X" or "User cancelled"

## Settings Manager Integration

All functions use `useSymlinkConfigManager()` to read the `SILENT` setting:

```typescript
const settingsManager = useSymlinkConfigManager()
const silent = settingsManager.read(SETTINGS.SYMLINK_CONFIG.SILENT)
```

## Architecture Benefits

### Consistent Behavior
- **Unified silent mode**: All user interactions respect the same setting
- **Automatic logging**: Built-in audit trail for all user interactions
- **Cross-platform**: Works consistently on Windows and Unix

### Separation of Concerns
- **@shared/vscode**: Pure VSCode API wrappers (no business logic)
- **@dialogs**: Application-specific logic with silent mode and logging
- **ESLint enforcement**: Prevents importing dialog functions from @shared/vscode

## Usage Examples

### Basic Usage
```typescript
import { info, warning, choice, confirm } from '@dialogs'

// Information with automatic logging
info('Operation completed successfully')

// Choice with auto-selection in silent mode
const result = await choice('Select action:', 'Apply', 'Cancel')

// Confirmation with auto-confirm in silent mode  
const confirmed = await confirm('Continue?', 'Yes')
```

### Advanced Usage
```typescript
// Disable logging for sensitive operations
info('Debug information', false)

// Explicit logging control for choices
const result = await choice('Select:', true, 'Option1', 'Option2')
```

## Integration Points

### Used By
- **Commands**: All user-facing commands use @dialogs for consistent behavior
- **Managers**: Settings managers use dialogs for user notifications
- **Watchers**: Continuous mode operations use silent behavior automatically

### Dependencies
- **@shared/vscode**: For underlying VSCode dialog APIs
- **@managers**: For settings manager access
- **@shared/constants**: For SETTINGS constants
- **@log**: For logging functionality

## Continuous Mode Support

When `continuousMode` is enabled:
- **Automatic operation**: No user dialogs shown
- **Script generation**: Always chooses script generation over direct creation
- **Auto-open scripts**: Generated scripts automatically opened in Code editor
- **Logging**: All decisions logged for audit trail

This enables fully automated operation for file watcher scenarios while maintaining full user control in interactive mode.