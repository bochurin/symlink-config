# Source Code Map - Symlink Config Extension

**Generated**: 24.10.2025  
**Version**: 0.0.86  
**Purpose**: Complete reference of all source files, functions, types, and constants

## Documentation Structure

The source code map has been decomposed into separate files for better maintainability.

See **[source-code-map/](source-code-map/)** folder for complete documentation:

- **[README.md](source-code-map/README.md)** - Overview and recent changes
- **[architecture.md](source-code-map/architecture.md)** - Key patterns and architecture rules
- **[scripts.md](source-code-map/scripts.md)** - Script generation modules (NEW: OS encapsulation details)
- **[shared-modules.md](source-code-map/shared-modules.md)** - Shared utilities
- **[managers.md](source-code-map/managers.md)** - Manager modules
- **[commands.md](source-code-map/commands.md)** - Command modules
- **[watchers.md](source-code-map/watchers.md)** - File and settings watchers
- **[views.md](source-code-map/views.md)** - Tree view and code lens providers
- **[extension.md](source-code-map/extension.md)** - Extension lifecycle
- **[state-queue.md](source-code-map/state-queue.md)** - State management and queue

## Quick Stats

- **Total Files**: ~72+ TypeScript files
- **Total Functions**: ~80+ exported functions
- **Total Types**: ~25+ interfaces, enums, and type aliases
- **Total Constants**: 3 major constant objects (FILE_NAMES, WATCHERS, SETTINGS)

## Recent Changes (v0.0.86)

### OS Module Encapsulation
- Created `isWindows()` utility in `shared/file-ops/is-windows.ts`
- Eliminated all direct `os` module usage from script generation
- Added `targetOS: 'windows' | 'unix'` parameter throughout script generation chain
- Moved `osSpecificPath()` from file-ops to scripts/shared/path (script-specific)
- Made `SymlinkOperation.source` required (always present)

### Architecture Improvements
- Only `shared/file-ops/` uses `os` and `fs` modules directly
- Script generation receives target OS as parameter
- Enables cross-platform script generation (Windows scripts on Unix, etc.)
- Clear separation between file operations and script formatting

See [architecture.md](source-code-map/architecture.md) for detailed patterns and rules.
