# Symlink Config Extension Context

## Project Overview
VSCode extension for automated symlink management with distributed tracking system, based on proven CVHere project symlink management system.

## Core Concepts

### Distributed Symlink System
- **SymLinks blocks** in .gitignore files track symlinked package.json files
- **Cross-platform support** - Windows batch files and Unix native symlinks
- **Non-destructive operations** - Read from .gitignore without modifying
- **Workspace awareness** - Detect and manage symlinks across project containers

### Technical Foundation
Based on CVHere project symlink system, fully translated to TypeScript:
- `manager.ts` - Main recursive symlink processor (from process-path.sh)
- `creator.ts` - Cross-platform symlink creation (from create-symlink.sh)
- `gitignore.ts` - Cleanup with .gitignore integration (from remove-old-symlinks.sh)
- `utils.ts` - @-syntax path resolution (from resolve-path.sh)

### Key Features
- **Visual interface** - Command palette integration with VSCode
- **Command palette** - `Symlinks: Create All`, `Symlinks: Clean All`, `Symlinks: Dry Run`
- **Status indicators** - Symlink management icon in status bar
- **Output channel** - Detailed operation logging and debugging
- **Error handling** - Structured responses with user-friendly notifications

## Architecture Approach
1. **Pure TypeScript implementation** - No bash dependencies, native Node.js
2. **VSCode API integration** - Commands, status bar, output channels
3. **Cross-platform support** - Windows batch generation, Unix symlinks
4. **CVHere logic preservation** - All proven functionality maintained

## Current Status
- **Phase 1 Complete**: TypeScript implementation finished
- **All CVHere logic preserved**: Cross-platform support, .gitignore tracking, @-syntax paths
- **Ready for testing**: Core functionality implemented and ready for validation

## Development Workflow
- Same collaborative approach as CVHere project
- Documentation-driven development with .docs structure
- Progress tracking and decision documentation
- Amazon Q integration for AI assistance

## Configuration Format
```json
{
  "directories": [
    {"target": "sl-shared", "source": "@shared"}
  ],
  "files": [
    {"target": "sl-package.json", "source": "@containers/backend/package.json"}
  ],
  "exclude_paths": ["node_modules", ".git"]
}
```

## Path Resolution
- **@-syntax**: `@shared` resolves to project root relative paths
- **Regular paths**: Relative to config directory
- **Cross-platform**: Proper Windows/Unix path handling

## .gitignore Integration
```
# SymLinks
sl-shared
sl-package.json
# End SymLinks
```

## Processing Order
1. **Clean**: Remove old symlinks from .gitignore SymLinks blocks
2. **Process**: Create new symlinks from configuration
3. **Recurse**: Process subdirectories with exclude patterns
4. **Windows Batch**: Generate batch file if on Windows platform

## Target Users
- Monorepo developers
- Multi-container projects
- DevOps teams managing package.json synchronization
- Any project with distributed package management needs
- VSCode users seeking visual symlink management

## Migration from CVHere
Complete functionality preservation from CVHere Phase 4.17-4.20:
- Distributed symlink system architecture
- Cross-platform compatibility with Windows batch generation
- .gitignore SymLinks block management
- @-syntax path resolution
- All edge cases and bug fixes from symlink cleanup system

## Next Phase
**Phase 2**: Testing and refinement
- Validate all symlink operations across platforms
- Test error scenarios and edge cases
- Enhance user experience based on testing feedback
- Add configuration validation and additional features