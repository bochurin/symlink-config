# Logging Report

## Overview

Comprehensive logging has been added throughout the extension to help debug issues and track operations. All logs are written to the extension's output channel accessible via "Show logs" in the tree view dropdown or Output panel.

## Log Management

### Settings
- **maxLogEntries** (default: 1000): Maximum log entries before auto-clear
- Set to 0 for unlimited logs
- Minimum value: 100

### Commands
- **Clear Logs** (Ctrl+Shift+P): Manually clear all logs

### Auto-Rotation
- Logs automatically clear when reaching maxLogEntries limit
- Shows message: "Logs cleared (max N entries reached)"

## Logged Events

### Extension Lifecycle
| Event | Log Message | Location |
|-------|-------------|----------|
| Activation | "Extension activated" | activate.ts |
| Deactivation | "Extension deactivated" | activate.ts |
| Workspace change | "Workspace folders changed, reinitializing..." | activate.ts |
| Workspace root set | "Workspace root: {path}" | ini.ts |

### Initialization
| Event | Log Message | Location |
|-------|-------------|----------|
| Managers init start | "Initializing managers..." | init-managers.ts |
| Managers init complete | "Managers initialized" | init-managers.ts |
| Watchers creation start | "Creating watchers..." | make-watchers.ts |
| Watchers creation complete | "Watchers created" | make-watchers.ts |

### Commands
| Command | Log Messages | Location |
|---------|--------------|----------|
| Apply Configuration | "Generating apply configuration scripts..." | apply-config.ts |
| | "Found N symlink operations" | apply-config.ts |
| | "No symlink operations needed" | apply-config.ts |
| | "Generating Windows apply script..." | apply-config.ts |
| | "Windows apply script generated" | apply-config.ts |
| | "Generating Unix apply script..." | apply-config.ts |
| | "Unix apply script generated" | apply-config.ts |
| | "Apply configuration cancelled by user" | apply-config.ts |
| | "ERROR: Failed to apply configuration: {error}" | apply-config.ts |
| Clean Configuration | "Generating clean configuration scripts..." | clean-config.ts |
| | "Generating Windows clean script..." | clean-config.ts |
| | "Windows clean script generated" | clean-config.ts |
| | "Generating Unix clean script..." | clean-config.ts |
| | "Unix clean script generated" | clean-config.ts |
| | "Clean configuration cancelled by user" | clean-config.ts |
| | "ERROR: No workspace folder found" | clean-config.ts |
| | "ERROR: Failed to generate cleaning script: {error}" | clean-config.ts |
| Refresh Managers | "Manual refresh triggered" | refresh-managers.ts |
| Clear Logs | "Logs cleared manually" | state.ts |

### Manager Operations
| Manager | Log Message | Location |
|---------|-------------|----------|
| Gitignore File | ".gitignore updated" | gitignore-file/make.ts |
| Next Config | "next.symlink-config.json updated" | next-config-file/make.ts |
| Current Config | "current.symlink-config.json updated" | current-config/make.ts |
| File Exclude | "files.exclude settings updated" | file-exclude-settings/make.ts |

### Watcher Registration
| Watcher | Log Message | Location |
|---------|-------------|----------|
| Symlink Settings | "Symlink settings watcher registered" | symlink-settings-watcher.ts |
| Files Settings | "Files settings watcher registered" | files-settings-watcher.ts |
| Gitignore | "Gitignore watcher registered" | gitignore-watcher.ts |
| Next Config | "Next config watcher registered" | next-config-watcher.ts |
| Current Config | "Current config watcher registered" | current-config-watcher.ts |
| Symlink Configs | "Symlink configs watcher registered" | symlink-config-watcher.ts |
| Symlinks | "Symlinks watcher registered" | symlinks-watcher.ts |

### File Change Events
| Event | Log Message | Location |
|-------|-------------|----------|
| .gitignore changed | ".gitignore file changed" | gitignore-watcher.ts |
| Setting changed | "Setting changed: {parameter}" | symlink-settings-watcher.ts |
| files.exclude changed | "files.exclude setting changed" | files-settings-watcher.ts |
| next.symlink-config.json | "next.symlink-config.json changed" | next-config-watcher.ts |
| current.symlink-config.json | "current.symlink-config.json changed" | current-config-watcher.ts |
| symlink-config.json | "symlink-config.json changed (N events)" | symlink-config-watcher.ts |
| Symlink files | "Symlink changed (N events)" | symlinks-watcher.ts |

### User Messages
All info() and warning() calls are automatically logged:
- info() messages logged as-is
- warning() messages logged with "WARNING:" prefix

## Log Format

All logs include timestamp:
```
[HH:MM:SS] Message
```

Example:
```
[14:23:45] Extension activated
[14:23:45] Workspace root: c:/Users/user/project/
[14:23:45] Initializing managers...
[14:23:45] Managers initialized
[14:23:45] Creating watchers...
[14:23:45] Symlink settings watcher registered
[14:23:45] Watchers created
```

## Error Logging

Errors are prefixed with "ERROR:" for easy identification:
```
[14:25:10] ERROR: Failed to apply configuration: File not found
[14:25:15] ERROR: No workspace folder found
```

## Usage Tips

1. **Debugging Issues**: Check logs via "Show logs" dropdown menu
2. **Performance Monitoring**: Watch for excessive file change events
3. **Configuration Tracking**: See when settings and configs are updated
4. **Error Investigation**: Search for "ERROR:" prefix in logs
5. **Clear When Needed**: Use Ctrl+Shift+P → "Clear logs" to reset

## Implementation Details

- Centralized logging via `state.log()` function
- Output channel created during extension activation
- Automatic log rotation based on maxLogEntries setting
- All async operations logged at start and completion
- File watchers log registration and trigger events
- Commands log user actions and outcomes
