# Apply Configuration Workflow

Complete symlink application system with dual execution paths: direct creation and script generation.

## Overview

The apply configuration system processes symlink-config.json files and creates symlinks through two main paths:

- **Direct Creation**: Immediate symlink creation (requires admin privileges)
- **Script Generation**: Creates executable scripts for later execution

## Workflow Diagram

```
┌─────────────────┐
│ applyConfig()   │
│ Entry Point     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ collectOperations│
│ Gather all      │
│ symlink ops     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ filterDangerous │
│ Remove risky    │
│ operations      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ isRunningAsAdmin│
│ Check privileges│
└─────────┬───────┘
          │
          ▼
     ┌────────┐
     │ Admin? │
     └────┬───┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌───────┐   ┌───────┐
│ YES   │   │  NO   │
└───┬───┘   └───┬───┘
    │           │
    ▼           ▼
┌───────────┐ ┌─────────────┐
│ Choice:   │ │ Confirm:    │
│ Direct or │ │ Generate    │
│ Scripts   │ │ Scripts?    │
└─────┬─────┘ └──────┬──────┘
      │              │
      ▼              ▼
┌─────────────────────────┐
│    User Decision        │
└─────────┬───────────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────┐
│ Direct  │ │ Generate    │
│ Path    │ │ Scripts     │
└─────────┘ └─────────────┘
```

## Execution Paths

### Path 1: Direct Creation

```
┌─────────────────┐
│ createSymlinks  │
│ Directly()      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ For each op:    │
│ - Create dirs   │
│ - Create symlink│
│ - Handle errors │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Return results: │
│ - Success count │
│ - Failed count  │
│ - Error details │
└─────────────────┘
```

### Path 2: Script Generation

```
┌─────────────────┐
│ Read Settings:  │
│ - scriptGenOS   │
│ - platform()    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Determine which │
│ platforms to    │
│ generate for    │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────┐
│Windows? │ │   Unix?     │
│Generate │ │  Generate   │
│.bat +   │ │   .sh       │
│admin    │ │             │
└─────┬───┘ └──────┬──────┘
      │            │
      └─────┬──────┘
            │
            ▼
┌─────────────────┐
│ User Choice:    │
│ - Open in Code  │
│ - Run Now/Admin │
└─────────────────┘
```

**Implementation Note**: Script generation now properly respects the `scriptGenerationOS` setting, generating scripts for the specified platforms (auto, windows-only, unix-only, or both).

## Module Structure

```
apply-configuration/
├── README.md              # This file
├── apply-config.ts        # Main workflow orchestration
├── clean-config.ts        # Symlink removal workflow
├── utils/
│   ├── collect-operations.ts    # Operation collection logic
│   ├── filter-dangerous-sources.ts  # Safety filtering
│   └── types.ts           # Shared type definitions
├── direct/
│   ├── direct-symlink-creator.ts    # Direct symlink creation
│   └── direct-symlink-remover.ts    # Direct symlink removal
└── scripts/
    ├── apply-script.ts    # Apply script generation
    ├── clean-script.ts    # Clean script generation
    ├── admin-script.ts    # Windows admin launcher
    └── utils/             # Script generation utilities
```

## Operation Collection

```
┌──────────────────┐
│ collectOperations│
└─────────┬────────┘
          │
          ▼
┌─────────────────┐
│ Read Settings:  │
│ - scriptGenMode │
│ (complete/incr) │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────┐
│Complete │ │ Incremental │
│ Mode    │ │ Mode        │
└─────┬───┘ └──────┬──────┘
      │            │
      ▼            ▼
┌─────────────┐ ┌─────────────┐
│ Delete all  │ │ Compare     │
│ current +   │ │ current vs  │
│ Create all  │ │ next configs│
│ next        │ │ Only diffs  │
└─────────────┘ └─────────────┘
```

## Safety Filtering

```
┌─────────────────┐
│filterDangerous  │
│Sources()        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check patterns: │
│ - .vscode/**    │
│ - .gitignore    │
│ - *.workspace   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Found dangerous?│
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────────┐
│   NO    │ │    YES      │
│ Return  │ │ Show dialog │
│ as-is   │ │ User choice │
└─────────┘ └─────────────┘
```

## User Interaction Points

### 1. Admin Status Dialog

**Admin User:**

```
┌───────────────────────────────────────────────┐
│ Apply symlink configuration?                  │
│                                               │
│ [Create Directly] [Generate Scripts] [Cancel] │
└───────────────────────────────────────────────┘
```

**Non-Admin User:**

```
┌─────────────────────────────────┐
│ Apply symlink configuration?   │
│                                 │
│ [Generate Scripts] [Cancel]     │
└─────────────────────────────────┘
```

### 2. Dangerous Sources Dialog

```
┌─────────────────────────────────────┐
│ ⚠️  Dangerous symlink sources       │
│ detected:                           │
│ - .vscode/settings.json             │
│ - project.code-workspace            │
│                                     │
│ [Skip Dangerous] [Include Anyway]   │
└─────────────────────────────────────┘
```

### 3. Script Execution Dialog

**Windows:**

```
┌─────────────────────────────────┐
│ Script generated:               │
│ apply.symlink-config.bat        │
│                                 │
│ [Open in Code] [Run as Admin]   │
└─────────────────────────────────┘
```

**Unix:**

```
┌─────────────────────────────┐
│ Script generated:           │
│ apply.symlink-config.sh     │
│                             │
│ [Open in Code] [Run Now]    │
└─────────────────────────────┘
```

## Settings Integration

### Script Generation OS

- `auto` - Match current platform
- `windows-only` - Generate .bat only
- `unix-only` - Generate .sh only
- `both` - Generate both formats

### Script Generation Mode

- `complete` - Delete all current, create all next
- `incremental` - Only create missing, remove existing

### Example Settings

```json
{
  "symlink-config.scriptGenerationOS": "auto",
  "symlink-config.scriptGenerationMode": "complete"
}
```

## File Generation

### Windows Batch Script

```batch
@echo off
cd /d "C:\workspace"
echo Applying symlink configuration...

echo Creating symlink target1 -> source1
mklink "target1" "source1"

echo Creating directory symlink target2 -> source2
mklink /D "target2" "source2"
```

### Unix Shell Script

```bash
#!/bin/bash
echo "Applying symlink configuration..."

echo "Creating symlink target1 -> source1"
ln -sf "source1" "target1"

echo "Creating symlink target2 -> source2"
ln -sf "source2" "target2"
```

### Admin Launcher (Windows)

```batch
@echo off
echo Running %1 as Administrator...
powershell -Command "Start-Process '%1' -Verb RunAs"
```

## Error Handling

### Direct Creation Errors

- Permission denied → Suggest script generation
- Source not found → Log error, continue with others
- Target exists → Log warning, skip or overwrite based on mode

### Script Generation Errors

- Write permission denied → Show error dialog
- Invalid paths → Sanitize and log warnings
- Platform mismatch → Use fallback generation

## Silent Mode

When `silent = true`:

- No user dialogs shown
- Auto-choose based on admin status:
  - Admin → Direct creation
  - Non-admin → Script generation
- Auto-open generated scripts in editor
- Log all decisions and results

## Integration Points

### Managers Used

- `useSymlinkConfigManager()` - Read settings
- Current/next config managers - Via `collectOperations()`

### Shared Utilities

- `@shared/admin-detection` - Check privileges
- `@shared/script-runner` - Execute scripts
- `@shared/file-ops` - File operations
- `@shared/vscode` - UI dialogs and file operations

### State Dependencies

- `@state` - Workspace root
- `@log` - Operation logging
- `@queue` - Not used (synchronous operation)

This workflow ensures safe, flexible symlink management with appropriate user interaction and cross-platform compatibility.
