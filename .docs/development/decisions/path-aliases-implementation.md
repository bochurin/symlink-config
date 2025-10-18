# Path Aliases Implementation - Decision Document

**Date**: 18.10.2025  
**Status**: Implemented  
**Context**: Clean import paths with TypeScript and webpack aliases

## Problem

The codebase had numerous relative import paths that were:
- **Hard to read**: `../../shared/log` vs `@shared/log`
- **Fragile**: Moving files breaks import paths
- **Inconsistent**: Different relative depths across modules
- **Maintenance burden**: Refactoring requires updating many import paths

## Decision

Implement comprehensive path aliases for both TypeScript and webpack to enable clean, absolute-style imports.

## Implementation

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@src/*": ["./src/*"],
      "@extension": ["./src/extension"],
      "@extension/*": ["./src/extension/*"],
      "@state": ["./src/state"],
      "@queue": ["./src/queue"],
      "@commands": ["./src/commands"],
      "@watchers": ["./src/watchers"],
      "@managers/*": ["./src/managers/*"],
      "@commands/*": ["./src/commands/*"],
      "@watchers/*": ["./src/watchers/*"],
      "@views/*": ["./src/views/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

### Webpack Configuration
```javascript
// webpack.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname),
    '@src': path.resolve(__dirname, 'src'),
    '@extension': path.resolve(__dirname, 'src/extension'),
    '@state': path.resolve(__dirname, 'src/state'),
    '@queue': path.resolve(__dirname, 'src/queue'),
    '@commands': path.resolve(__dirname, 'src/commands'),
    '@watchers': path.resolve(__dirname, 'src/watchers'),
    '@managers': path.resolve(__dirname, 'src/managers'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@shared': path.resolve(__dirname, 'src/shared')
  }
}
```

### Module Index Files
Created index.ts files for modules that need direct imports:

```typescript
// src/commands/index.ts
export * from './apply-configuration'
export * from './clear-logs'
export * from './create-symlink'
export * from './open-symlink-config'
export * from './refresh-managers'
export * from './tree-operations'

// src/watchers/index.ts
export * from './symlink-settings-watcher'
export * from './files-settings-watcher'
export * from './gitignore-watcher'
export * from './next-config-watcher'
export * from './current-config-watcher'
export * from './symlink-config-watcher'
export * from './symlinks-watcher'
```

## Alias Design Principles

### Root Access
- `@/*` - Project root (package.json, .docs, etc.)
- `@src/*` - Source directory

### Module-Specific Aliases
- `@extension` - Extension lifecycle and initialization
- `@state` - Application state management
- `@queue` - Operation serialization
- `@shared/*` - Reusable utilities and abstractions

### Wildcard vs Direct
- **Direct**: `@commands`, `@watchers` (for index.ts imports)
- **Wildcard**: `@shared/*`, `@managers/*` (for specific file imports)

## Benefits

### Developer Experience
- **Readable Imports**: Clear module relationships
- **IntelliSense**: Better autocomplete with absolute paths
- **Refactoring Safety**: Moving files doesn't break imports
- **Consistent Style**: Same import pattern across all files

### Maintainability
- **Easier Navigation**: Jump to definition works better
- **Reduced Errors**: No more `../../../` counting mistakes
- **Cleaner Diffs**: Import changes are more obvious
- **Better Organization**: Aliases reflect architecture

### Build System
- **TypeScript**: Compile-time path resolution
- **Webpack**: Runtime module bundling
- **Synchronized**: Both systems use same alias mapping
- **Performance**: No runtime path resolution overhead

## Migration Impact

### Import Changes
```typescript
// Before
import { log } from '../../shared/log'
import { handleEvent } from '../managers/next-config-file'
import { getWorkspaceRoot } from '../../state'

// After
import { log } from '@shared/log'
import { handleEvent } from '@managers/next-config-file'
import { getWorkspaceRoot } from '@state'
```

### Module Boundaries
- **Clearer Dependencies**: Aliases show module relationships
- **Enforced Architecture**: Harder to create circular dependencies
- **Better Abstractions**: Shared modules clearly identified

## Technical Details

### Base URL Configuration
- **TypeScript**: `"baseUrl": "."` (project root)
- **Webpack**: `path.resolve(__dirname)` (project root)

### Module Resolution
- **TypeScript**: Uses `paths` mapping for compilation
- **Webpack**: Uses `alias` mapping for bundling
- **Runtime**: No overhead, resolved at build time

### Index File Strategy
- **Commands**: Single index for all command exports
- **Watchers**: Single index for all watcher exports
- **Extension**: Enhanced with additional exports

## Future Enhancements

- **ESLint Rules**: Enforce alias usage over relative imports
- **Auto-Import**: Configure IDE to prefer alias imports
- **Documentation**: Generate import maps from aliases
- **Validation**: Ensure alias consistency across tools