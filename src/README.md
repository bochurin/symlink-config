# Source Code

Complete TypeScript implementation of symlink management extension.

Main entry point: `main.ts` (re-exports from extension module)

Module structure:
- `extension/` - Extension lifecycle
- `state/` - Application state
- `queue/` - Operation serialization
- `log/` - Logging utilities
- `managers/` - File and settings managers
- `watchers/` - File and settings watchers
- `views/` - UI components
- `commands/` - Command implementations
- `shared/` - Reusable utilities

## Rules

- Use path aliases: `@extension`, `@state`, `@queue`, `@managers`, `@watchers`, `@views`, `@commands`, `@shared`
- Import through `index.ts` only (ESLint enforced)
- Files: kebab-case, Functions: camelCase, Classes: PascalCase, Constants: SCREAMING_SNAKE_CASE
- Always `async/await`, never callbacks or raw promises
- Use `const` by default, `let` when needed, NEVER `var`
- One file = one exported function/class
- Helper functions may stay in same file if: only used by main export, not too large, readable in 1-2 pages
- If function/class needs decomposition: create folder with multiple files and `index.ts` to export
- Types in `types.ts`, enums in `enums.ts`
