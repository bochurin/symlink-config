# Source Code Map - Symlink Config Extension

**Generated**: 2024-12-19T22:30:00.0000000+00:00
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
- **[test-suite.md](test-suite.md)** - Jest test suite with comprehensive coverage
- **[architecture.md](architecture.md)** - Key patterns and architecture rules

## Quick Reference

**Total Files**: ~85+ TypeScript files (including test files)
**Total Functions**: ~90+ exported functions
**Total Types**: ~30+ interfaces, enums, and type aliases
**Total Constants**: 6 major constant objects (FILE_NAMES, WATCHERS, SETTINGS, MANAGERS, DANGEROUS_SOURCES)
**Test Files**: 6+ test suites with 81 passing tests

## Recent Changes (v0.0.87)

### Package.json Builder Rewrite (Latest - 19.12.2024)

- **Simplified builder logic** - Rewritten `scripts/build-package.js` with minimal deep merge approach
  - Removed complex key ordering and sorting mechanisms
  - Uses numeric file prefixes (01_, 02_, 03_, etc.) for automatic section ordering via alphabetical sort
  - Preserves natural JSON property order within each section
  - Array concatenation for multiple files contributing to same section (like menus)

- **File-based section ordering** - Numeric prefix system for maintainable organization
  - `01_base.json` - Core package properties (name, version, engines, etc.)
  - `02_scripts.json` - NPM scripts
  - `03_devDependencies.json` - Development dependencies
  - `41_contributes-configuration.json` - VSCode configuration schema
  - `42_contributes-commands.json` - Command definitions
  - `44-48_contributes-menus-*.json` - Menu contributions by context
  - `49_contributes-views.json` - Tree view definitions

- **Deep merge with array concatenation** - Proper handling of multiple files per section
  - Arrays are concatenated (for menus, commands, etc.)
  - Objects are deep merged with property preservation
  - No complex sorting - relies on file system ordering
  - Maintains all existing functionality with simpler logic

### Jest Test Suite Implementation (19.12.2024)

- **Complete Jest testing framework** - Replaced Mocha with Jest for comprehensive testing
  - Installed Jest with TypeScript support (`jest`, `ts-jest`, `@types/jest`)
  - Created `jest.config.js` with proper VSCode API mocking via `moduleNameMapper`
  - Configured path aliases for clean test imports (`@shared`, `@dialogs`, `@extension`, etc.)
  - Added coverage collection with text, lcov, and html reporters

- **Comprehensive test infrastructure** - Organized test suite with multiple categories
  - `src/test/unit/` - Unit tests for individual modules (file-ops, gitignore-ops, managers, shared)
  - `src/test/integration/` - Integration tests for workflows (commands, watchers, workflows)
  - `src/test/helpers/` - Test utilities (mock-vscode.ts, test-workspace.ts, assertions.ts)
  - `src/test/fixtures/` - Test data (configs, workspaces, expected outputs)

- **Test suite conversion and alignment** - Converted all tests from Mocha to Jest syntax
  - Changed `suite`/`test` to `describe`/`it` throughout test files
  - Fixed VSCode mocking through moduleNameMapper configuration
  - Aligned test expectations with actual implementation behavior
  - Achieved 81 passing tests across 6 test suites with 100% pass rate

- **Test scripts and coverage** - Added comprehensive npm scripts for testing
  - `test:jest` - Run all Jest tests
  - `test:jest:watch` - Continuous testing during development
  - `test:jest:coverage` - Generate coverage reports
  - Coverage directory configured with multiple reporter formats

### Previous Changes (v0.0.88)

### File-ops Organization & Dialog Consolidation (19.12.2024)

- **File-ops subfolder organization** - Reorganized shared/file-ops into logical subfolders
  - `path/` - basename, full-path, normalize-path, path-basics, to-fs-path, find-common-path
  - `file/` - read-file, write-file, stat-file, path-exists, is-root-file
  - `directory/` - directory, read-dir, is-directory
  - `symlink/` - symlink, is-symlink, read-symlink
  - `system/` - os operations
  - Each subfolder has index.ts, main index exports from subfolders

- **Dialog consolidation** - Removed confirm.ts in favor of choice.ts
  - Eliminated duplicate confirm() function
  - Updated apply-config.ts to use choice() with 'Generate Scripts'/'Cancel' options
  - Moved error.ts to shared/vscode/dialogs/ with proper abstraction in src/dialogs/
  - Consistent dialog architecture: shared/vscode/dialogs (pure API) + src/dialogs (abstractions)

- **URI type abstraction** - Added Uri type alias for vscode.Uri
  - Created shared/file-ops/types.ts with `export type Uri = vscode.Uri`
  - Preparation for standardizing all file-ops to use Uri instead of string|Uri
  - Shorter import name and abstraction over VSCode API

### Previous Changes (v0.0.87)

### Dialog System & Continuous Mode (26.10.2025)

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