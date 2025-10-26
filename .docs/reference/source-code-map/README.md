# Source Code Map - Symlink Config Extension

**Generated**: 2025-10-26T12:00:00.0000000+00:00
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

### Shared Abstractions Architecture (Latest)

- **Complete shared abstraction system** - Created comprehensive `@shared/vscode` and `@shared/file-ops` modules
- **Architectural boundary enforcement** - ESLint rules prevent direct API imports outside designated modules
- **Manager logging callbacks** - All managers now use `logCallback` parameter for pure factory pattern
- **Path and fs abstraction** - Added `pathExists`, `isDirectory`, `ConfigurationTarget`, `Uri` type exports
- **ESLint configuration** - Fixed rules to properly exclude `@shared/vscode` from vscode restrictions

### Factory Pattern Enhancement

- **Pure factory functions** - Removed external dependencies from `createManager()` factory
- **Optional logging callback** - Added `logCallback?: (message: string) => void` to `ManagerCallbacks`
- **Logging integration** - All managers pass `log` function as callback for consistent logging
- **Architectural purity** - Factories remain pure utilities with no external module dependencies

### Import Restrictions Fixed

- **Direct API elimination** - Replaced all direct `vscode`, `fs`, `path`, `os` imports with shared abstractions
- **Script generation fixes** - Temporarily disabled broken path functions with TODO comments
- **TypeScript compilation** - Fixed all build errors and type issues
- **ESLint compliance** - Zero linting errors with proper architectural enforcement

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
