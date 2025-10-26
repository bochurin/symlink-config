# Source Code Map - Symlink Config Extension

**Generated**: 2025-10-26T16:45:00.0000000+00:00
**Version**: 0.0.87
**Purpose**: Complete reference of all source files, functions, types, and constants for change tracking

## Structure

This documentation is organized into separate files for better maintainability:

- **[shared-modules.md](shared-modules.md)** - Shared utilities (file-ops, constants, hooks, factories)
- **[managers.md](managers.md)** - Manager modules (gitignore, configs, settings)
- **[commands.md](commands.md)** - Command modules (apply, clean, create symlink)
- **[dialogs.md](dialogs.md)** - Dialog abstractions with silent mode and logging
- **[scripts.md](scripts.md)** - Script generation modules (apply, clean, operations, path formatting)
- **[watchers.md](watchers.md)** - File and settings watchers
- **[views.md](views.md)** - Tree view and code lens providers
- **[extension.md](extension.md)** - Extension lifecycle and initialization
- **[state-queue.md](state-queue.md)** - State management and operation queue
- **[architecture.md](architecture.md)** - Key patterns and architecture rules

## Quick Reference

**Total Files**: ~75+ TypeScript files
**Total Functions**: ~85+ exported functions
**Total Types**: ~25+ interfaces, enums, and type aliases
**Total Constants**: 3 major constant objects (FILE_NAMES, WATCHERS, SETTINGS)

## Recent Changes (v0.0.87)

### Dialog System & Continuous Mode (Latest - 26.10.2025)

- **New @dialogs module** - Complete dialog abstraction system with silent mode support
  - `info()`, `warning()`, `showError()`, `choice()`, `confirm()`, `warningChoice()` functions
  - Automatic logging with `withLog = true` parameter (configurable)
  - Silent mode integration using settings manager
  - Auto-selection/confirmation in silent mode
  - Errors always shown (never silent)

- **Continuous mode support** - Full automation for file watcher scenarios
  - Automatic dangerous source filtering without user dialogs
  - Auto-script generation instead of direct creation
  - Auto-open generated scripts in Code editor
  - Used by current/next config watchers for seamless operation

- **Unix admin script support** - Cross-platform elevated privilege execution
  - Added `RUN_ADMIN_SH` constant for Unix admin scripts
  - `admin.symlink-config.sh` generation using `sudo`
  - Both Windows (.bat) and Unix (.sh) admin scripts generated

- **Silent parameter removal** - Eliminated silent parameter dependency
  - Removed from `applyConfig()` and `cleanConfig()` functions
  - All dialog behavior now controlled by settings manager
  - Consistent user interaction patterns

- **Log function simplification** - Removed LogLevel parameter
  - Pure logging function: `log(message: string)`
  - Replaced `log(message, LogLevel.Info)` with `info(message)` from @dialogs
  - Settings manager integration for maxLogEntries

- **ESLint enforcement** - Dialog import restrictions
  - Prevents importing dialog functions from `@shared/vscode` outside dialogs module
  - Forces use of `@dialogs` for consistent silent mode behavior
  - 302 lint warnings fixed (import order, equality operators, curly braces)

- **Shared/vscode/dialogs organization** - Proper module structure
  - Moved dialog functions to `src/shared/vscode/dialogs/` subfolder
  - Renamed `dialogs.ts` to `open.ts` for clarity
  - Maintained export compatibility through index files

### Previous Changes

#### Shared Abstractions Architecture

- **Complete shared abstraction system** - Created comprehensive `@shared/vscode` and `@shared/file-ops` modules
- **Architectural boundary enforcement** - ESLint rules prevent direct API imports outside designated modules
- **Manager logging callbacks** - All managers now use `logCallback` parameter for pure factory pattern
- **Path and fs abstraction** - Added `pathExists`, `isDirectory`, `ConfigurationTarget`, `Uri` type exports

### Previous Changes

#### Dangerous Symlink Source Validation
- Added `DANGEROUS_SOURCES.PATTERNS` constant with glob patterns for risky symlinks
- Created `filterDangerousSources()` function to validate operations before execution
- User confirmation dialog with "Include Anyway" or "Skip Dangerous Symlinks"

#### Module Reorganization
- Moved log module from shared/ to src/ (application-specific, not reusable)
- Added comprehensive README.md files for all modules with rules
- Updated path aliases and imports (@log instead of @shared/log)
- Enforced "one file = one exported function" rule across codebase
