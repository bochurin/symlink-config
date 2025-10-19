# Manager Factory Consolidation and Named Parameters Pattern

**Date**: 19.10.2025  
**Status**: Implemented  
**Impact**: Architecture Simplification  

## Context

The manager factory was initially decomposed into separate files (read.ts, write.ts, generate.ts, etc.) for modularity, but this approach proved to be over-engineered and more complex than beneficial. Additionally, the callback system used positional parameters which limited flexibility for extensions.

## Decision

### Factory Consolidation

**Consolidated all decomposed factory functions back into a single `create-manager.ts` file as internal functions:**

```typescript
export function createManager<CT, ET>(callbacks: ManagerCallbacks<CT, ET>): Manager<CT, ET> {
  // Base functions (no dependencies)
  function read(params?: { [key: string]: any }): CT | undefined { ... }
  async function write(params?: { [key: string]: any }) { ... }
  
  // Functions that depend on read()
  function generate(params?: { [key: string]: any }): CT | undefined { ... }
  function needsRegenerate(params?: { [key: string]: any }): boolean { ... }
  
  // Functions that depend on read(), generate(), write()
  async function make(params?: { [key: string]: any }) { ... }
  
  // Functions that depend on needsRegenerate(), make()
  async function handleEvent(params?: { [key: string]: any }) { ... }
  async function init() { ... }
  
  return { objectName, init, handleEvent, read }
}
```

### Named Parameters Pattern

**Converted all callbacks to use named object parameters with flexible extensions:**

```typescript
export interface ManagerCallbacks<CT, ET> {
  objectName: string
  makeCallback: (params?: {
    initContent?: CT
    newContent?: CT
    events?: ET
    [key: string]: any  // Flexible extensions
  }) => Promise<CT | undefined>
  
  readCallback?: (params?: { [key: string]: any }) => CT
  // ... other callbacks with same pattern
}
```

## Benefits

### Consolidation Benefits
- **Reduced Complexity**: Single file easier to understand and maintain
- **Better Cohesion**: Related functions grouped together naturally
- **Simplified Dependencies**: Clear internal function call hierarchy
- **Easier Debugging**: All logic in one place for troubleshooting

### Named Parameters Benefits
- **Flexible Extensions**: `[key: string]: any` allows custom parameters like `payload`, `spec`
- **Self-Documenting**: Parameter names clearly indicate purpose
- **Future-Proof**: Easy to add new parameters without breaking existing code
- **Type Safety**: Known parameters are typed, additional ones are flexible

## Implementation Details

### Call Stack Organization
Functions organized by dependency levels with clear comments:

1. **Base functions** (no dependencies): `read()`, `write()`
2. **Level 2** (depend on base): `generate()`, `needsRegenerate()`
3. **Level 3** (orchestration): `make()`
4. **Level 4** (entry points): `handleEvent()`, `init()`

### Parameter Flexibility
```typescript
// Usage examples:
read({ spec: 'someValue', customParam: 'data' })
handleEvent({ events: someEvent, payload: 'data', extra: 'info' })
generateCallback({ content, events, payload: 'custom', myParam: 123 })
```

### Type Safety
- Known parameters are properly typed
- Additional parameters allowed through index signature
- Optional parameters with proper undefined handling

## Alternatives Considered

1. **Keep Decomposed Structure**: Rejected due to over-engineering
2. **Positional Parameters**: Rejected due to inflexibility
3. **Mixed Approach**: Rejected for consistency

## Migration Impact

- **Removed Files**: All decomposed factory files (read.ts, write.ts, etc.)
- **Updated Types**: All callback interfaces use named parameters
- **Maintained API**: Public manager interface unchanged

## Future Considerations

- Pattern can be extended for other factory functions
- Named parameters make it easy to add new callback features
- Consolidation approach can be applied to other over-decomposed modules

## Conclusion

The consolidation and named parameters pattern provides a much cleaner, more maintainable, and more flexible manager factory system while reducing overall complexity.