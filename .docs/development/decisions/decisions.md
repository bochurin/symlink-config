# Symlink Config Extension - Technical Decisions

## Extension Architecture

- **[TypeScript Implementation](typescript-implementation.md)** - Decision to translate bash scripts to TypeScript for better VSCode integration
- **[VSCode Integration Strategy](vscode-integration-strategy.md)** - Command palette, status bar, and output channel approach
- **[Gitignore Manager Architecture](gitignore-manager-architecture.md)** - Rewrite for consistency and state-based change detection
- **[Shared Utilities Architecture](shared-utilities-architecture.md)** - Shared file operations and simplified state management
- **[File System Abstraction](file-system-abstraction.md)** - Centralized file system operations in shared/file-ops module
- **[Configuration Management](configuration-management.md)** - User-configurable gitignore management and extension flexibility
- **[Workspace Manager Architecture](workspace-manager-architecture.md)** - VSCode workspace settings management and configuration hooks
- **[Hook Interface Improvements](hook-interface-improvements.md)** - Simplified hooks with automatic detection and cleaner APIs
- **[Shared Configuration Operations](shared-configuration-operations.md)** - Centralized workspace configuration management with type safety
- **[Async File Operations](async-file-operations.md)** - Migration to async file operations for consistency and performance
- **[Windows Batch Script Optimization](windows-batch-script-optimization.md)** - Array-based script generation with proper line endings and error handling
- **[Unix Script Generation](unix-script-generation.md)** - Cross-platform script consistency with standalone usage capability
- **[File Watcher Filter System](file-watcher-filter-system.md)** - Enhanced filtering with debouncing and shared utilities
- **[Watcher Self-Registration Pattern](watcher-self-registration-pattern.md)** - Modular watcher architecture with centralized state management
- **[Manager Factory Pattern](manager-factory-pattern.md)** - Callback-based factory for common manager logic
- **[State/Queue/Log Separation](state-queue-log-separation.md)** - Separation of application state, queue, and logging concerns
- **[Shared Module Isolation](shared-module-isolation.md)** - Parameter injection pattern for shared module independence
- **[State/Queue Reorganization](state-queue-reorganization.md)** - Moving state and queue to src/ level with modular structure
- **[Settings Scope Restriction](settings-scope-restriction.md)** - Restricting all settings to workspace/folder scope for proper isolation
- **[Constants Decomposition and Build-time Integration](constants-decomposition-build-time-integration.md)** - Modular constants with build-time package.json integration
- **[Path Aliases Implementation](path-aliases-implementation.md)** - Clean import paths with TypeScript and webpack aliases

## Development Process

- **[Context Migration](context-migration.md)** - Adopted CVHere project's collaborative documentation approach
- **[CVHere Logic Preservation](cvhere-logic-preservation.md)** - Strategy for maintaining all proven functionality

## Technical Approach

- **[Cross-Platform Support](cross-platform-support.md)** - Native TypeScript with Windows batch fallback
- **[Configuration System](configuration-system.md)** - JSON-based distributed configuration approach
- **[Path Resolution](path-resolution.md)** - @-syntax and relative path handling

_See individual decision documents for detailed rationale and implementation details._
