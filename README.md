# Symlink Config

VSCode extension for automated symlink management across project containers and workspaces.

> **📚 Complete Documentation**: See **[.docs/](.docs/)** folder for comprehensive project documentation including architecture, decisions, and development progress.

## Features

- **Distributed Symlink Management** - Automatically create and manage symlinks across project directories
- **Cross-Platform Support** - Works on Windows, macOS, and Linux
- **VSCode Integration** - Commands available in Command Palette and status bar
- **Intelligent Cleanup** - Remove orphaned symlinks based on .gitignore tracking
- **Dry Run Mode** - Preview changes before applying them

## Commands

- `Symlinks: Create All` - Create all symlinks defined in symlink.config.json files
- `Symlinks: Clean All` - Remove old/orphaned symlinks
- `Symlinks: Dry Run` - Preview what changes would be made

## Usage

1. Create `symlink.config.json` files in your project directories
2. Use Command Palette (`Ctrl+Shift+P`) to run symlink commands
3. Click the symlink icon in the status bar for quick access

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
- **Distributed .gitignore tracking** - SymLinks blocks in local .gitignore files
- **Non-destructive operations** - Read existing entries without modification
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

### 0.0.1

Initial release with core symlink management functionality.

---

**Enjoy automated symlink management!**