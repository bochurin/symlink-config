# Test Plan - Symlink Config Extension

## Test Categories

### 1. Unit Tests
- **File Operations** - Test file-ops module functions
- **Gitignore Operations** - Test parsing and assembly
- **Path Operations** - Test path manipulation utilities
- **Settings Operations** - Test configuration management
- **Manager Factory** - Test manager creation patterns

### 2. Integration Tests
- **Manager Lifecycle** - Test read/generate/make/write cycles
- **Watcher Integration** - Test file system event handling
- **Command Integration** - Test command execution flows
- **Dialog Integration** - Test user interaction flows

### 3. End-to-End Tests
- **Apply Configuration** - Full symlink creation workflow
- **Clean Configuration** - Full symlink removal workflow
- **Script Generation** - Cross-platform script creation
- **Continuous Mode** - Automated operation flows

### 4. Cross-Platform Tests
- **Windows Specific** - Batch script generation, admin detection
- **Unix Specific** - Shell script generation, permissions
- **Path Handling** - Cross-platform path resolution

## Test Structure

```
src/test/
├── unit/
│   ├── file-ops/
│   ├── gitignore-ops/
│   ├── managers/
│   └── shared/
├── integration/
│   ├── commands/
│   ├── watchers/
│   └── workflows/
├── e2e/
│   ├── apply-config/
│   ├── clean-config/
│   └── script-generation/
├── fixtures/
│   ├── configs/
│   ├── workspaces/
│   └── expected/
└── helpers/
    ├── mock-vscode.ts
    ├── test-workspace.ts
    └── assertions.ts
```

## Priority Testing Areas

1. **File Operations** - Core functionality, cross-platform critical
2. **Gitignore Operations** - Data integrity, parsing accuracy
3. **Manager Patterns** - Architecture validation
4. **Script Generation** - Cross-platform compatibility
5. **Command Workflows** - User-facing functionality