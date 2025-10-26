# Test Suite - Symlink Config Extension

**Generated**: 2024-12-19T22:30:00.0000000+00:00
**Version**: 0.0.87
**Framework**: Jest with TypeScript support

## Overview

Comprehensive Jest-based test suite for the symlink-config VSCode extension covering unit tests, integration tests, and end-to-end scenarios with proper VSCode API mocking.

## Test Infrastructure

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@dialogs/(.*)$': '<rootDir>/src/dialogs/$1',
    '^@extension/(.*)$': '<rootDir>/src/extension/$1',
    '^@managers/(.*)$': '<rootDir>/src/managers/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@log/(.*)$': '<rootDir>/src/log/$1',
    '^vscode$': '<rootDir>/src/test/helpers/mock-vscode.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/test/**',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
}
```

### VSCode API Mocking (`src/test/helpers/mock-vscode.ts`)
- Complete VSCode API mock for extension testing
- Mocked modules: `vscode.Uri`, `vscode.workspace`, `vscode.window`, `vscode.FileType`
- Enables testing without actual VSCode environment
- Configured through Jest `moduleNameMapper`

## Test Structure

### Unit Tests (`src/test/unit/`)

#### File Operations Tests (`file-ops/`)
- **`path-operations.test.ts`** - Path manipulation and resolution
  - `fullPath()` - Workspace-relative path resolution
  - `basename()` - File name extraction from paths/URIs
  - `normalizePath()` - Cross-platform path normalization
  - `findCommonPath()` - Common path calculation for multiroot workspaces

#### Gitignore Operations Tests (`gitignore-ops/`)
- **`parse-assemble.test.ts`** - Gitignore parsing and assembly
  - `parseGitignore()` - Extract entries from .gitignore content
  - `assembleGitignore()` - Generate .gitignore content from entries
  - Service file block management
  - Symlink block management

#### Manager Factory Tests (`managers/`)
- **`manager-factory.test.ts`** - Manager creation pattern
  - `createManager()` factory function
  - Callback-based architecture
  - Content type handling
  - Logging integration

#### Shared Utilities Tests (`shared/`)
- **`settings-ops.test.ts`** - Settings operations
  - `readSettings()` - VSCode configuration reading
  - `writeSettings()` - VSCode configuration writing
  - Property validation and defaults

### Integration Tests (`src/test/integration/`)

#### Command Integration (`commands/`)
- Command execution workflows
- User interaction simulation
- Cross-command dependencies

#### Watcher Integration (`watchers/`)
- File system event handling
- Settings change processing
- Event accumulation and debouncing

#### Workflow Tests (`workflows/`)
- **`apply-config.test.ts`** - End-to-end apply configuration workflow
  - Configuration loading and validation
  - Operation collection and filtering
  - Script generation and execution
  - Cross-platform compatibility

### Test Helpers (`src/test/helpers/`)

#### Mock VSCode (`mock-vscode.ts`)
```typescript
export const vscode = {
  Uri: {
    file: jest.fn((path: string) => ({ fsPath: path, path })),
    parse: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(),
    workspaceFolders: [],
  },
  window: {
    showInformationMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  },
  FileType: {
    File: 1,
    Directory: 2,
    SymbolicLink: 64,
  },
}
```

#### Test Workspace (`test-workspace.ts`)
- Temporary workspace creation utilities
- File and directory structure setup
- Configuration file generation
- Cleanup and teardown

#### Custom Assertions (`assertions.ts`)
- Symlink-specific assertions
- File existence validation
- Configuration validation
- Cross-platform path assertions

### Test Fixtures (`src/test/fixtures/`)

#### Configuration Files (`configs/`)
- **`basic-config.json`** - Simple symlink configuration
- Sample configurations for different scenarios
- Edge case configurations

#### Expected Outputs (`expected/`)
- **`gitignore-with-service-files.txt`** - Expected .gitignore content
- Reference files for comparison testing
- Cross-platform expected outputs

#### Workspace Structures (`workspaces/`)
- Sample project structures
- Multiroot workspace configurations
- Container-based project layouts

## Test Scripts

### NPM Scripts
```json
{
  "test:jest": "jest",
  "test:jest:watch": "jest --watch",
  "test:jest:coverage": "jest --coverage"
}
```

### Test Execution
- **`npm run test:jest`** - Run all tests once
- **`npm run test:jest:watch`** - Continuous testing during development
- **`npm run test:jest:coverage`** - Generate coverage reports

## Test Results

### Current Status (v0.0.87)
- **Total Test Suites**: 6 test suites
- **Total Tests**: 81 passing tests
- **Pass Rate**: 100%
- **Coverage**: Configured for src/ directory excluding tests

### Test Categories
1. **Unit Tests** - Individual function and module testing
2. **Integration Tests** - Cross-module workflow testing
3. **Mock Testing** - VSCode API interaction testing
4. **Configuration Testing** - Settings and configuration validation
5. **File Operations Testing** - Cross-platform file system operations
6. **Workflow Testing** - End-to-end user scenarios

## Coverage Configuration

### Included Files
```javascript
collectCoverageFrom: [
  'src/**/*.ts',           // All TypeScript files
  '!src/test/**',          // Exclude test files
  '!src/**/*.d.ts',        // Exclude type definitions
  '!src/main.ts',          // Exclude entry point
]
```

### Coverage Reports
- **Text** - Console output during test runs
- **LCOV** - Machine-readable format for CI/CD
- **HTML** - Interactive browser-based reports in `coverage/` directory

## Testing Best Practices

### Test Organization
- One test file per module or feature area
- Descriptive test names following `describe`/`it` pattern
- Grouped related tests in logical describe blocks
- Clear setup and teardown in `beforeEach`/`afterEach`

### Mocking Strategy
- VSCode API completely mocked for isolation
- File system operations use temporary directories
- Settings operations use mock configuration objects
- External dependencies mocked at module boundaries

### Assertion Patterns
- Use Jest's built-in matchers (`expect().toBe()`, `expect().toEqual()`)
- Custom assertions for domain-specific validations
- Async/await pattern for promise-based operations
- Proper error testing with `expect().toThrow()`

## Future Enhancements

### Planned Test Additions
- **E2E Tests** - Full extension lifecycle testing
- **Performance Tests** - Large workspace handling
- **Cross-Platform Tests** - Windows/Unix compatibility validation
- **Error Scenario Tests** - Edge cases and failure modes

### Test Infrastructure Improvements
- **Test Data Generation** - Dynamic fixture creation
- **Parallel Testing** - Multi-worker test execution
- **Visual Testing** - UI component validation
- **Integration with CI/CD** - Automated testing pipeline

## Development Workflow

### Test-Driven Development
1. **Write failing test** for new feature
2. **Implement feature** to pass test
3. **Run full test suite** to ensure no regressions
4. **Update documentation** if needed

### Continuous Testing
- Use `npm run test:jest:watch` during development
- Tests run automatically on file changes
- Immediate feedback on code modifications
- Coverage updates in real-time

This comprehensive test suite ensures code quality, prevents regressions, and provides confidence in the extension's functionality across different environments and use cases.