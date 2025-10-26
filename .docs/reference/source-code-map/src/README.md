# Source Code Map - src/

Documentation for all modules in the `src/` directory.

## Core Modules

- **[architecture.md](architecture.md)** - Overall architecture and module relationships
- **[extension.md](extension.md)** - Extension lifecycle and initialization
- **[state-queue.md](state-queue.md)** - State management and operation serialization

## Business Logic

- **[managers.md](managers.md)** - File and settings managers
- **[watchers.md](watchers.md)** - File and settings watchers
- **[commands.md](commands.md)** - VSCode command implementations

## UI Components

- **[views.md](views.md)** - Tree view and code lens providers
- **[dialogs.md](dialogs.md)** - User interaction dialogs

## Utilities

- **[shared-modules.md](shared-modules.md)** - Reusable utilities and abstractions
- **[scripts.md](scripts.md)** - Platform-specific script generation (src/commands/apply-configuration/scripts)
- **[test-suite.md](test-suite.md)** - Jest test infrastructure

## Module Structure

Each module follows consistent patterns:
- Factory-based architecture for managers
- Hook-based patterns for watchers
- Index.ts exports for clean imports
- Separation of concerns between modules