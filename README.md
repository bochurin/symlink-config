# Symlink Config

Automated symlink management for package.json files across project containers and workspaces.

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

## Implementation Status

✅ **Phase 1.2 Complete** - Core symlink functionality implemented
- TypeScript-based JSON configuration parsing
- Cross-platform symlink creation and management
- VSCode integration with Command Palette and status bar
- Dry run mode for safe preview of operations

See [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md) for detailed progress.

## Release Notes

### 0.0.1

Initial release with core symlink management functionality.

---

**Enjoy automated symlink management!**