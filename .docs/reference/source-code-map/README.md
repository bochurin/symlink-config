# Source Code Map - Symlink Config Extension

**Generated**: 2025-01-15T10:30:00.0000000+00:00
**Version**: 0.0.87
**Purpose**: Complete reference of all source files, functions, types, and constants for change tracking

## Structure

This documentation is organized into separate files for better maintainability:

- **[shared-modules.md](shared-modules.md)** - Shared utilities (file-ops, constants, hooks, factories)
- **[managers.md](managers.md)** - Manager modules (gitignore, configs, settings)
- **[commands.md](commands.md)** - Command modules (apply, clean, create symlink)
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

### Dangerous Symlink Source Validation

- Added `DANGEROUS_SOURCES.PATTERNS` constant with glob patterns for risky symlinks
- Created `filterDangerousSources()` function to validate operations before execution
- Patterns include `**/.vscode/**`, `**/*.code-workspace`, `**/.gitignore`
- Validates both dangerous patterns and matching basename (source/target names)
- Filters out same-path operations (source === target) automatically
- User confirmation dialog with "Include Anyway" or "Skip Dangerous Symlinks"

### Operation Collection Refactor

- Fixed `collectOperations()` incremental mode to properly compare configs
- Complete mode: delete all current, create all next
- Incremental mode: delete/create only changed targets with different sources
- Uses Map-based comparison for efficient target/source matching

### VSCode Dialog Utilities

- Added `choice()` function for information dialogs with multiple options
- Added `warningChoice()` function for warning dialogs with choices
- Centralized dialog handling in shared/vscode module
- Removed direct vscode API usage from command modules

### Module Reorganization

- Moved log module from shared/ to src/ (application-specific, not reusable)
- Added comprehensive README.md files for all modules with rules
- Updated path aliases and imports (@log instead of @shared/log)
- Enforced "one file = one exported function" rule across codebase
