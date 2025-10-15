# Symlink Config

VSCode extension for automated symlink management across project containers and workspaces.

> **📚 Complete Documentation**: See **[.docs/](.docs/)** folder for comprehensive project documentation including architecture, decisions, and development progress.

## Features

- **Distributed Symlink Management** - Automatically create and manage symlinks across project directories
- **Cross-Platform Support** - Works on Windows, macOS, and Linux
- **VSCode Integration** - Commands available in Command Palette and status bar
- **Intelligent Cleanup** - Remove orphaned symlinks tracked in current.symlink-config.json
- **File Watchers** - Automatic workspace monitoring and configuration updates

## Commands

- `Symlink Config: Apply configuration` - Create all symlinks defined in symlink-config.json files
- `Symlink Config: Clean handled symlinks` - Remove symlinks tracked in current.symlink-config.json

## Usage

1. Create `symlink-config.json` files in your project directories
2. Use Command Palette (`Ctrl+Shift+P`) to run symlink commands
3. Use the Symlink Config tree view in Explorer sidebar

### Configuration Format

```json
{
  "directories": [
    {
      "target": "container1/package.json",
      "source": "@shared/package.json"
    }
  ],
  "files": [
    {
      "target": "container2/config.json",
      "source": "../shared/config.json"
    }
  ],
  "exclude_paths": ["node_modules", ".git"]
}
```

## Path Resolution

- **@-prefix paths** - Relative to project root (e.g., `@shared/file.json`)
- **Regular paths** - Relative to config directory (e.g., `../shared/file.json`)

## Requirements

- **VSCode** - Version 1.104.0 or higher
- **Admin privileges** - Required for symlink creation on Windows

## Based on Proven Technology

Built on the symlink management system from the CVHere project:

- **Automatic .gitignore management** - Service files automatically added to .gitignore
- **Non-destructive operations** - Preserves existing .gitignore entries
- **Cross-platform compatibility** - Windows batch generation, Unix native symlinks
- **Battle-tested logic** - All CVHere Phase 4.17-4.20 functionality preserved
- **Complete TypeScript translation** - No bash dependencies, native VSCode integration

## Documentation

Complete project documentation in **[.docs/](.docs/)**:

- **[Migration from CVHere](.docs/project/migration-from-cvhere.md)** - Transfer process and context preservation
- **[Progress Log](.docs/development/progress-log.md)** - Development phases and current implementation status
- **[CVHere Symlink System](.docs/reference/cvhere-symlink-system.md)** - Original system documentation
- **[Technical Decisions](.docs/development/decisions/decisions.md)** - Architecture and implementation decisions

## Implementation Status

✅ **Phase 1 Complete** - TypeScript Implementation

- Complete translation of CVHere symlink system to TypeScript
- Cross-platform symlink creation and management
- VSCode integration with Command Palette and status bar
- All proven CVHere logic and edge cases preserved

## Release Notes

### 0.0.56

Hook decomposition into organized folder structures with separate files for types, implementation, and handler execution logic.

---

**Enjoy automated symlink management!**
