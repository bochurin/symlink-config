# Test Suite - Symlink Config Extension

## Overview

Comprehensive test suite for the symlink-config VSCode extension covering unit tests, integration tests, and end-to-end scenarios.

## Test Structure

```
src/test/
├── unit/                    # Unit tests for individual modules
│   ├── file-ops/           # File operations tests
│   ├── gitignore-ops/      # Gitignore parsing/assembly tests
│   ├── managers/           # Manager factory tests
│   └── shared/             # Shared utilities tests
├── integration/            # Integration tests for workflows
│   ├── commands/           # Command integration tests
│   ├── workflows/          # End-to-end workflow tests
│   └── watchers/           # File watcher integration tests
├── e2e/                    # End-to-end tests
├── fixtures/               # Test data and configurations
│   ├── configs/            # Sample symlink-config.json files
│   ├── workspaces/         # Test workspace structures
│   └── expected/           # Expected output files
├── helpers/                # Test utilities and mocks
│   ├── mock-vscode.ts      # VSCode API mocks
│   ├── test-workspace.ts   # Test workspace utilities
│   └── assertions.ts       # Custom assertions
└── test-plan.md           # Comprehensive test plan
```

## Running Tests

### All Tests
```bash
npm test
```

### Compile Tests Only
```bash
npm run compile-tests
```

### Watch Mode
```bash
npm run watch-tests
```

## Test Categories

### Unit Tests
- **File Operations**: Path manipulation, file I/O, cross-platform compatibility
- **Gitignore Operations**: Parsing and assembly of .gitignore files
- **Manager Factory**: Manager creation patterns and lifecycle
- **Settings Operations**: Configuration management
- **Shared Utilities**: Common helper functions

### Integration Tests
- **Apply Configuration**: Full symlink creation workflow
- **Clean Configuration**: Symlink removal and cleanup
- **Script Generation**: Cross-platform script creation
- **Watcher Integration**: File system event handling
- **Manager Lifecycle**: Read/generate/make/write cycles

### End-to-End Tests
- **Complete Workflows**: Full user scenarios
- **Cross-Platform**: Windows and Unix compatibility
- **Error Handling**: Edge cases and error scenarios
- **Performance**: Large workspace handling

## Test Utilities

### TestWorkspace
Utility for creating temporary test environments:
```typescript
const workspace = new TestWorkspace()
workspace.createFile('package.json', '{"name": "test"}')
workspace.createConfig('symlink-config.json', { files: [...] })
workspace.cleanup()
```

### Custom Assertions
Specialized assertions for symlink testing:
```typescript
assertFileExists(path)
assertIsSymlink(path)
assertSymlinkTarget(symlink, target)
assertGitignoreContains(gitignore, pattern)
assertConfigValid(config)
```

### VSCode Mocks
Mock VSCode API for isolated testing:
```typescript
import { mockVscode } from './helpers/mock-vscode'
// Provides mocked vscode.Uri, workspace, window APIs
```

## Test Data

### Fixtures
- **basic-config.json**: Simple symlink configuration
- **complex-config.json**: Multi-container setup
- **gitignore-samples**: Various .gitignore patterns
- **workspace-structures**: Different project layouts

### Expected Outputs
- **Generated scripts**: Expected .bat and .sh files
- **Gitignore results**: Expected .gitignore content
- **Configuration files**: Expected service files

## Coverage Goals

- **Unit Tests**: 90%+ coverage of core functions
- **Integration Tests**: All major workflows covered
- **Cross-Platform**: Windows and Unix scenarios
- **Error Cases**: Exception handling and edge cases

## Development Workflow

1. **Write failing test** for new feature
2. **Implement feature** to pass test
3. **Run full test suite** to ensure no regressions
4. **Update documentation** if needed

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Release builds

All tests must pass before merging changes.