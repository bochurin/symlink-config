# Manager Modules

All managers follow factory-based architecture with callbacks pattern.

## File Managers (`managers/files/`)

### _gitignore
- Manages `.gitignore` file with service file entries
- **Callbacks**: read, generate, make, needsRegenerate, write
- **Pattern**: Record-based gitignore manipulation

### next_symlink-config_json
- Generates `next.symlink-config.json` from workspace scan
- **Callbacks**: generate, make, needsRegenerate, write
- **Scans**: All `symlink-config.json` files in workspace

### current_symlink-config_json
- Tracks currently applied symlinks in `current.symlink-config.json`
- **Callbacks**: generate, make, needsRegenerate, write
- **Source**: Reads actual symlinks from filesystem

### symlink-config.json (shared types)
- **Types**: `Config`, `ConfigEntry`
- Shared between next and current config managers

## Settings Managers (`managers/settings/`)

### files_exclude
- Manages `files.exclude` VSCode setting
- **Callbacks**: read, generate, make, needsRegenerate, write
- **Purpose**: Hide service files in Explorer

### symlink-config_props
- Manages all `symlink-config.*` settings
- **Callbacks**: read, make, write, afterparty
- **Properties**: All extension settings with validation
- **Reset Feature**: `RESET_TO_DEFAULTS` triggers reset of all settings to defaults
- **Afterparty**: Calls `makeWatchers()` after write completes

## Manager Pattern

### Standard Structure
```
manager/
├── callbacks/
│   ├── generate.ts
│   ├── make.ts
│   ├── needs-regenerate.ts
│   ├── read.ts
│   └── write.ts
├── types.ts
├── enums.ts
├── use-manager.ts
└── index.ts
```

### Factory Usage
```typescript
const manager = useManager({
  objectNameCallback: () => 'file.json',
  readCallback: read,
  makeCallback: make,
  generateCallback: generate,
  needsRegenerateCallback: needsRegenerate,
  writeCallback: write,
})
```

### Manager Interface
- `init(): Promise<void>` - Initialize manager
- `handleEvent(params): Promise<void>` - Handle file/settings changes
- `read(params): CT` - Read current state
