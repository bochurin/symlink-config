# Source Code Map - Symlink Config Extension

**Generated**: 2025-10-24T19:46:50.9090777+04:00
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

### Manager Factory Enhancement

- Added `afterpartyCallback` to manager factory for post-write lifecycle hooks
- Used in settings manager to auto-toggle `resetToDefaults` back to false
- Receives `finalContent`, `initialContent`, and custom params

### Settings Reset Feature

- Added `RESET_TO_DEFAULTS` boolean setting that resets all settings to defaults
- Implemented in `symlink-config_props` manager make callback
- Auto-turns off after reset via afterparty callback
- Iterates over all properties and sets each to default value from constants

### Settings Manager Architecture

- Settings manager uses read/write/make/afterparty callbacks
- Write callback uses shared `writeSettings()` function
- Make callback returns `Record<string, SymlinkConfigSettingsPropertyValue>`
- Read callback returns all properties when called without params
