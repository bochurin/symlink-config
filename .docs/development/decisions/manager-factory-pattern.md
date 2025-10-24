# Manager Factory Pattern Decision

**Date**: 15.10.2025  
**Status**: Implemented  
**Context**: Code reuse and manager pattern standardization

## Problem

All managers follow nearly identical patterns with duplicate code:

- **init.ts**: Check `needsRegenerate()`, call `make()` if needed
- **handle-event.ts**: Check event type or `needsRegenerate(events)`, call `make(events)` if needed
- **Common flow**: read → generate → make → write → log

This duplication leads to:
- Maintenance overhead (changes must be replicated across all managers)
- Inconsistency risk (managers might diverge in implementation)
- Boilerplate code in every manager folder

## Decision

Create a manager factory that encapsulates common manager logic and accepts callbacks for customization.

## Implementation

### Factory Structure

```
src/managers/manager/
├── types.ts           // Interface definitions
├── create-manager.ts  // Factory implementation
└── index.ts           // Public exports
```

### Type Definitions

```typescript
export interface ManagerCallbacks<CT, ET> {
  readCallback: () => CT
  writeCallback?: (content: CT) => Promise<void>
  makeCallbak: (initialContent: CT, events?: ET, newContent?: CT) => CT
  generateCallback?: (initialContent: CT) => CT
  needsRegenerateCallback?: (content: CT, events?: ET) => boolean
  nameCallback?: () => string
}

export interface Manager<CT, ET> {
  init: () => Promise<void>
  read: () => CT
  make: () => Promise<void>
  handleEvent: (events: ET) => Promise<void>
}
```

### Factory Implementation

```typescript
export function createManager<CT, ET>(
  callbacks: ManagerCallbacks<CT, ET>,
): Manager<CT, ET> {
  const readCB = callbacks.readCallback
  const makeCB = callbacks.makeCallbak
  const writeCB = callbacks.writeCallback || (() => Promise.resolve())
  const generateCB =
    callbacks.generateCallback || ((initialContent: CT) => initialContent)
  const needsRegenerateCB =
    callbacks.needsRegenerateCallback || ((content: CT, events?: ET) => true)
  const nameCB = callbacks.nameCallback || (() => 'file')

  function read() {
    const content = readCB()
    return content
  }

  async function write(content: CT) {
    await writeCB(content)
  }

  function generate(initialContent: CT) {
    const newContent = generateCB(initialContent)
    return newContent
  }

  async function make(events?: ET) {
    const initialContent = read()
    const newContent = generate(initialContent)
    const finalContent = makeCB(initialContent, events, newContent)
    await write(finalContent)
    log(`${nameCB()} updated`)
  }

  async function init() {
    if (needsRegenerate()) {
      info(`${nameCB()} is inconsistent. Regenerating...`)
      await make()
    }
  }

  function needsRegenerate(events?: ET) {
    const content = readCB()
    const result = needsRegenerateCB(content, events)
    return result
  }

  async function handleEvent(events: ET) {
    const needsRegen = needsRegenerate(events)
    if (needsRegen) {
      info(`${nameCB()} was affected. Regenerating...`)
      await make(events)
    }
  }

  return { init, read, make, handleEvent }
}
```

## Usage Example

```typescript
// In manager's index.ts
import { createManager } from '../manager'
import { generate } from './generate'
import { read } from './read'
import { needsRegenerate } from './needs-regenerate'
import { writeFile } from '../../shared/file-ops'

const manager = createManager({
  readCallback: read,
  writeCallback: (content) => writeFile('next.symlink-config.json', content),
  makeCallbak: (initialContent, events, newContent) => newContent,
  generateCallback: generate,
  needsRegenerateCallback: needsRegenerate,
  nameCallback: () => 'next.symlink-config.json'
})

export const { init, read: readManager, make, handleEvent } = manager
export { generate, needsRegenerate }
```

## Benefits

### Code Reuse
- **Eliminates duplication**: No more duplicate init.ts and handle-event.ts files
- **Centralized logic**: Common manager flow in one place
- **Consistent behavior**: All managers follow exact same pattern

### Maintainability
- **Single source of truth**: Changes to manager logic happen in one place
- **Easier testing**: Factory can be tested independently
- **Clear separation**: Business logic (callbacks) vs framework logic (factory)

### Flexibility
- **Callback-based**: Each manager provides only what's unique
- **Optional callbacks**: Sensible defaults for optional operations
- **Type-safe**: Generic types CT (content type) and ET (event type)

### Performance
- **Synchronous callbacks**: No async/await overhead for generate/make operations
- **Efficient**: Only calls what's needed based on needsRegenerate

## Design Decisions

### Synchronous Callbacks

All callbacks are synchronous because:
- **generate()** functions build objects/strings in memory (no I/O)
- **makeCallbak()** merges/transforms data (pure logic)
- **needsRegenerate()** compares data (no I/O)
- Only **write()** is async (actual file I/O)

### Callback Flow

The factory implements this flow:
1. **read()** → Get initial content
2. **generate(initialContent)** → Transform/generate new content
3. **makeCallbak(initialContent, events, newContent)** → Merge/decide final content
4. **write(finalContent)** → Save to file
5. **log()** → Record update

This allows maximum flexibility:
- Simple managers: just return `newContent`
- Complex managers (gitignore): merge `initialContent` with `newContent`
- Event-aware: use `events` parameter for context

### Default Implementations

Optional callbacks have sensible defaults:
- **writeCallback**: No-op (for read-only managers)
- **generateCallback**: Identity function (pass-through)
- **needsRegenerateCallback**: Always true (always regenerate)
- **nameCallback**: Generic 'file' name

## Migration Strategy

### Phase 1: Factory Creation ✅
- Create manager factory structure
- Implement and test factory logic
- Document usage patterns

### Phase 2: Gradual Adoption (Future)
- Migrate one manager at a time
- Test each migration thoroughly
- Keep old implementation until verified

### Phase 3: Cleanup (Future)
- Remove duplicate init.ts and handle-event.ts files
- Update documentation
- Verify all managers use factory

## Alternatives Considered

### 1. Base Class with Inheritance

```typescript
abstract class BaseManager<CT, ET> {
  abstract read(): CT
  abstract generate(): CT
  // ...
}
```

**Rejected**: 
- Inheritance is less flexible than composition
- Harder to test individual pieces
- TypeScript favors composition over inheritance

### 2. Mixin Pattern

```typescript
function withInit<T>(Base: T) { /* ... */ }
function withHandleEvent<T>(Base: T) { /* ... */ }
```

**Rejected**:
- More complex to understand
- Harder to type correctly in TypeScript
- Overkill for this use case

### 3. Keep Duplicate Code

**Rejected**:
- Maintenance burden
- Inconsistency risk
- Violates DRY principle

## Future Enhancements

### Advanced Features
- **Validation**: Add validation callback for content
- **Hooks**: Pre/post hooks for make operations
- **Caching**: Optional caching layer for read operations
- **Transactions**: Rollback support for failed writes

### Developer Experience
- **CLI Generator**: Tool to scaffold new managers using factory
- **Testing Utilities**: Helper functions for testing managers
- **Documentation**: Auto-generate manager documentation from callbacks

## Outcome

Successfully created manager factory that encapsulates common manager pattern logic. The factory provides:

- **Type-safe**: Generic CT and ET types for content and events
- **Flexible**: Callback-based customization
- **Efficient**: Synchronous callbacks where appropriate
- **Maintainable**: Single source of truth for manager logic

**Current Status**: Factory implemented and ready for use. Existing managers can be migrated gradually as needed.

**Next Steps**: Consider migrating existing managers to use factory pattern, starting with simpler managers like next-config-file.
