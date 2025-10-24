# Constants Decomposition and Build-time Package.json Integration - Decision Document

**Date**: 17.10.2025  
**Status**: Implemented  
**Context**: Modular constants organization with build-time package.json integration

## Problem

The monolithic `shared/constants.ts` file contained multiple types of constants mixed together:
- File names
- Settings configuration
- Watcher identifiers  
- Manager names

Additionally, default values were hardcoded and could become inconsistent with package.json configuration.

## Decision

1. **Decompose constants into modular structure** with separate files by category
2. **Implement build-time package.json import** for settings defaults
3. **Apply DRY principle** by defining names once and cross-referencing
4. **Add full TypeScript support** for package.json imports

## Implementation

### Modular Structure
```
src/shared/constants/
├── index.ts          # Re-exports all constants
├── files.ts          # FILE_NAMES constant
├── settings.ts       # SETTINGS with build-time defaults
├── watchers.ts       # WATCHERS using cross-references
└── managers.ts       # MANAGERS using cross-references
```

### Build-time Package.json Integration
```typescript
// settings.ts
import packageJson from '../../../package.json'

const props = packageJson.contributes.configuration.properties
const SECTION = 'symlink-config'
const PARAMETERS = {
  WATCH_WORKSPACE: 'watchWorkspace',
  // ...
} as const

export const SETTINGS = {
  SYMLINK_CONFIG: {
    SECTION,
    ...PARAMETERS,
    DEFAULT: {
      WATCH_WORKSPACE: props[`${SECTION}.${PARAMETERS.WATCH_WORKSPACE}`].default,
      // ...
    },
  },
} as const
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

```typescript
// src/types/package.json.d.ts
declare module '*/package.json' {
  interface PackageJson {
    contributes: {
      configuration: {
        properties: Record<string, {
          default?: any
          // ... other properties
        }>
      }
    }
    // ... complete structure
  }
  const value: PackageJson
  export default value
}
```

### Cross-Referenced Constants
```typescript
// watchers.ts
import { FILE_NAMES } from './files'
import { SETTINGS } from './settings'

export const WATCHERS = {
  GITIGNORE: FILE_NAMES.GITIGNORE,
  SYMLINK_CONFIG_SETTINGS: SETTINGS.SYMLINK_CONFIG.SECTION,
  // ...
} as const
```

## Benefits

### Organization
- **Logical Grouping**: Related constants grouped by purpose
- **Single Responsibility**: Each file has focused concern
- **Easier Maintenance**: Changes isolated to relevant files
- **Better Navigation**: Developers can find constants intuitively

### Type Safety
- **Compile-time Validation**: Package.json structure fully typed
- **Import Safety**: TypeScript validates package.json access
- **Ambient Module**: Proper module declaration for JSON imports
- **Build-time Errors**: Invalid property access caught at compile time

### Consistency
- **Single Source of Truth**: Defaults read from package.json
- **DRY Principle**: Names defined once and reused
- **Cross-References**: Constants reference each other for consistency
- **Automatic Sync**: Changes to package.json automatically reflected

### Developer Experience
- **IntelliSense**: Full autocomplete for package.json properties
- **Refactoring Safety**: TypeScript tracks all references
- **Clear Dependencies**: Import structure shows relationships
- **Reduced Errors**: Eliminates manual synchronization mistakes

## Technical Details

### Manager Factory Fix
Fixed return type from `Promise<Manager<CT, ET>>` to `Manager<CT, ET>` since factory creates synchronous manager objects.

### Terminology Alignment
Renamed "parameters" to "properties" in settings watcher to match VSCode configuration API terminology.

### Build Process
- `resolveJsonModule` enables JSON imports at compile time
- Webpack bundles package.json content into final extension
- No runtime file system access required
- Full tree-shaking support for unused constants

## Migration Impact

- **Import Changes**: All imports updated to use `shared/constants` (no breaking changes due to index.ts re-exports)
- **Type Safety**: Improved compile-time error detection
- **Performance**: No runtime overhead for constant access
- **Maintainability**: Easier to add new constants and modify existing ones

## Future Enhancements

- **Validation**: Could add runtime validation of package.json structure
- **Generation**: Could generate constants from package.json schema
- **Documentation**: Could auto-generate documentation from constants
- **Testing**: Easier to mock individual constant categories