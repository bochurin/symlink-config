# Queue Module

Operation serialization for async tasks.

Ensures operations execute sequentially to prevent race conditions.

## Rules

- Watcher event handlers must use `queue()`
- Serializes concurrent file system events
- Prevents race conditions when multiple events fire simultaneously
- Returns Promise for chaining
- Export through `index.ts` only
