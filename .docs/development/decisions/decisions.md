# Symlink Config Extension - Technical Decisions

## Extension Architecture

- **[TypeScript Implementation](typescript-implementation.md)** - Decision to translate bash scripts to TypeScript for better VSCode integration
- **[VSCode Integration Strategy](vscode-integration-strategy.md)** - Command palette, status bar, and output channel approach
- **[Gitignore Manager Architecture](gitignore-manager-architecture.md)** - Rewrite for consistency and state-based change detection
- **[Shared Utilities Architecture](shared-utilities-architecture.md)** - Shared file operations and simplified state management
- **[Configuration Management](configuration-management.md)** - User-configurable gitignore management and extension flexibility
- **[Workspace Manager Architecture](workspace-manager-architecture.md)** - VSCode workspace settings management and configuration hooks
- **[Hook Interface Improvements](hook-interface-improvements.md)** - Simplified hooks with automatic detection and cleaner APIs
- **[Shared Configuration Operations](shared-configuration-operations.md)** - Centralized workspace configuration management with type safety
- **[Async File Operations](async-file-operations.md)** - Migration to async file operations for consistency and performance

## Development Process

- **[Context Migration](context-migration.md)** - Adopted CVHere project's collaborative documentation approach
- **[CVHere Logic Preservation](cvhere-logic-preservation.md)** - Strategy for maintaining all proven functionality

## Technical Approach

- **[Cross-Platform Support](cross-platform-support.md)** - Native TypeScript with Windows batch fallback
- **[Configuration System](configuration-system.md)** - JSON-based distributed configuration approach
- **[Path Resolution](path-resolution.md)** - @-syntax and relative path handling

_See individual decision documents for detailed rationale and implementation details._
