module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@dialogs/(.*)$': '<rootDir>/src/dialogs/$1',
    '^@extension/(.*)$': '<rootDir>/src/extension/$1',
    '^@managers/(.*)$': '<rootDir>/src/managers/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@log/(.*)$': '<rootDir>/src/log/$1',
    '^vscode$': '<rootDir>/src/test/helpers/mock-vscode.ts',
  },
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151002]
      }
    }
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