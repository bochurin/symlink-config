# Unix Script Generation Decision

**Date**: 12.10.2025  
**Status**: Implemented  
**Context**: Cross-Platform Script Consistency

## Problem

The extension only generated Windows batch scripts, creating inconsistency across platforms:

- **Windows**: Generated `.bat` files for admin execution
- **Unix/macOS**: Direct fs.symlink execution without script generation
- **Inconsistent workflow**: Different approaches per platform
- **Limited standalone usage**: Unix users couldn't run scripts independently

## Decision

Implement Unix shell script generation to match Windows batch script approach, providing consistent cross-platform workflow with standalone script capability.

## Implementation

### Unix Script Generation

```typescript
async function generateUnixScript(operations: SymlinkOperation[], workspaceRoot: string) {
  const lines = [
    '#!/bin/bash',
    'echo "Applying symlink configuration..."',
    ''
  ]
  
  // Generate script content with proper bash syntax
  const content = lines.join('\n')
  await fs.writeFile(scriptPath, content, { encoding: 'utf8', mode: 0o755 })
}
```

### Script Generation Setting

Added VSCode configuration option:
```json
{
  "symlink-config.scriptGeneration": {
    "enum": ["windows-only", "unix-only", "both", "auto"],
    "default": "auto"
  }
}
```

### Platform-Aware Execution

```typescript
const shouldGenerateWindows = scriptGeneration === 'windows-only' || 
  scriptGeneration === 'both' || 
  (scriptGeneration === 'auto' && isWindows)

const shouldGenerateUnix = scriptGeneration === 'unix-only' || 
  scriptGeneration === 'both' || 
  (scriptGeneration === 'auto' && !isWindows)
```

### Cross-Platform User Options

- **Current OS**: Shows both "Open in Code" and "Run Now/Run as Admin"
- **Other OS**: Only shows "Open in Code" option
- **Prevents errors**: Can't execute Windows batch on Unix or vice versa

## Benefits Achieved

### Consistency Benefits

- **Unified Workflow**: Same script generation approach across all platforms
- **Predictable Behavior**: Users get scripts regardless of platform
- **Cross-Platform Development**: Generate scripts for any target platform

### Standalone Usage Benefits

- **Independent Execution**: Scripts can run without VSCode extension
- **CI/CD Integration**: Scripts can be used in automated pipelines
- **Team Sharing**: Scripts can be shared between team members
- **Manual Debugging**: Users can inspect and modify scripts before execution

### Technical Benefits

- **Executable Permissions**: Unix scripts created with proper `0o755` permissions
- **Proper Shebang**: `#!/bin/bash` for correct shell interpretation
- **Error Handling**: Source validation and directory creation
- **Configuration Updates**: Automatic current config synchronization

## Technical Implementation

### Unix Script Structure

```bash
#!/bin/bash
echo "Applying symlink configuration..."

if [ -e "/path/to/source" ]; then
  echo "Creating target -> source"
  ln -sf "/path/to/source" "/path/to/target"
else
  echo "ERROR: Source not found: /path/to/source"
fi

echo "Updating configuration..."
cp "next.symlink.config.json" "current.symlink.config.json"
echo "Done!"
```

### Cross-Platform Path Handling

- **Windows**: Uses `path.join()` with backslashes in batch commands
- **Unix**: Uses `path.join()` with forward slashes in shell commands
- **@ Syntax**: Properly resolved on both platforms

### File Management Integration

- **Gitignore**: Both `.bat` and `.sh` files added to service file exclusions
- **VSCode Explorer**: Both script types hidden when `hideServiceFiles` enabled
- **Constants**: `APPLY_SYMLINKS_SH` added alongside `APPLY_SYMLINKS_BAT`

## Validation Strategy

### Functionality Testing

- **Script Generation**: Verify correct syntax for both Windows and Unix
- **Permission Setting**: Confirm Unix scripts have executable permissions
- **Cross-Platform**: Test script generation on different platforms
- **Setting Behavior**: Validate all script generation setting options

### Integration Testing

- **File Managers**: Ensure both script types properly managed
- **User Interface**: Verify platform-aware execution options
- **Error Handling**: Test behavior with missing sources and permissions

## Future Enhancements

### Advanced Features

- **Script Optimization**: Combine multiple operations for efficiency
- **Custom Templates**: Allow users to customize script templates
- **Validation Mode**: Pre-flight checks before script generation
- **Rollback Scripts**: Generate scripts to undo symlink operations

### Platform-Specific Improvements

- **Windows**: Enhanced PowerShell script generation option
- **macOS**: Native AppleScript integration for GUI applications
- **Linux**: Distribution-specific package manager integration

## Outcome

Successfully implemented unified cross-platform script generation providing consistent workflow, standalone usage capability, and enhanced user experience across Windows, macOS, and Linux platforms.

**Next Steps**: Comprehensive cross-platform testing and performance optimization for large project structures.