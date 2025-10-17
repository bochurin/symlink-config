# Settings Scope Restriction - Decision Document

**Date**: 17.10.2025  
**Status**: Implemented  
**Context**: All symlink-config settings restricted to workspace/folder scope

## Problem

VSCode settings can be configured at multiple scopes:
- **User settings** - Global across all workspaces
- **Workspace settings** - Specific to current workspace
- **Folder settings** - Specific to workspace folders

Symlink configurations are inherently workspace-specific and should not pollute user global settings.

## Decision

Restrict all symlink-config settings to workspace/folder scope only by adding `"scope": "resource"` to all setting definitions in `package.json`.

## Implementation

```json
{
  "symlink-config.scriptGeneration": {
    "scope": "resource",
    "type": "string",
    "enum": ["windows-only", "unix-only", "both", "auto"],
    "default": "auto"
  }
}
```

Applied to all settings:
- `scriptGeneration`
- `symlinkPathMode` 
- `watchWorkspace`
- `gitignoreServiceFiles`
- `gitignoreSymlinks`
- `hideServiceFiles`
- `hideSymlinkConfigs`
- `silent`
- `projectRoot`
- `maxLogEntries`

## Benefits

- **Workspace Isolation**: Each workspace maintains independent configuration
- **No Global Pollution**: User settings remain clean of workspace-specific options
- **Proper Scoping**: Settings appear only in workspace/folder settings UI
- **Project Context**: All symlink settings tied to specific project structures

## VSCode Scope Values

- `"application"` - User settings only
- `"machine"` - Machine-specific settings only  
- `"resource"` - Workspace/folder settings only ✅
- `"window"` - Window-specific settings
- `"machine-overridable"` - Machine settings that can be overridden by workspace

## Impact

- Users cannot set global defaults for symlink-config settings
- Each workspace must configure settings independently
- Settings UI only shows options in workspace/folder context
- Prevents configuration conflicts between different projects

## Rationale

Symlink configurations are inherently tied to specific project structures, workspace layouts, and team conventions. Global settings would create conflicts and inappropriate defaults across different project types.