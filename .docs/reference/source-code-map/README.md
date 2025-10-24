# Source Code Map - Symlink Config Extension

**Generated**: 24.10.2025  
**Version**: 0.0.86  
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

**Total Files**: ~72+ TypeScript files  
**Total Functions**: ~80+ exported functions  
**Total Types**: ~25+ interfaces, enums, and type aliases  
**Total Constants**: 3 major constant objects (FILE_NAMES, WATCHERS, SETTINGS)

## Recent Changes (v0.0.86)

### OS Module Encapsulation
- Created `isWindows()` utility in `shared/file-ops/is-windows.ts`
- Eliminated all direct `os` module usage from script generation
- Added `targetOS: 'windows' | 'unix'` parameter throughout script generation chain
- Moved `osSpecificPath()` from file-ops to scripts/shared/path (script-specific)

### Type System Simplification
- Made `SymlinkOperation.source` required (always present even for delete operations)
- Removed unnecessary `|| ''` fallbacks and `!` assertions

### Architecture Improvements
- Only `shared/file-ops/` uses `os` and `fs` modules directly
- Script generation receives target OS as parameter (enables cross-platform generation)
- Clear separation between file operations and script formatting
