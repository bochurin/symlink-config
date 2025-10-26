import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    files: ['**/*.ts'],
    ignores: [
      'src/shared/vscode/**/*.ts',
      'src/shared/file-ops/**/*.ts',
      'src/shared/hooks/**/*.ts',
      'src/extension/**/*.ts',
      'src/state/**/*.ts',
      'src/log/**/*.ts',
      'src/views/**/*.ts'
    ]
  },
  // Specific rules for shared modules
  {
    files: ['src/shared/**/*.ts'],
    ignores: [
      'src/shared/vscode/**/*.ts',
      'src/shared/file-ops/**/*.ts',
      'src/shared/hooks/**/*.ts',
      'src/shared/settings-ops/**/*.ts',
      'src/shared/script-runner.ts',
      'src/shared/admin-detection.ts',
      'src/shared/gitignore-ops/**/*.ts',
      'src/shared/factories/**/*.ts'
    ],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@log', '@state', '@queue', '@extension', '@managers', '@watchers', '@views', '@commands'],
              message: 'Shared modules can only import from other shared modules (@shared/*) - no external dependencies allowed'
            }
          ]
        }
      ]
    }
  },
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },

    rules: {
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase']
        }
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' }
        }
      ],
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['*/managers/*/*', '!*/managers/*/index'],
              message: 'Import from manager index.ts only, not internal files'
            },
            {
              group: ['*/commands/*', '!*/commands/index', '!*/commands/apply-configuration'],
              message: 'Import from commands/index.ts only, not individual command files'
            },
            {
              group: ['*/commands/*/*', '!*/commands/*/index'],
              message: 'Import from command subfolder index.ts only, not internal files'
            },

            {
              group: ['*/hooks/*/*', '!*/hooks/*/index'],
              message: 'Import from hook index.ts only, not internal files'
            },
            {
              group: ['*/shared/*/*', '!*/shared/*/index'],
              message: 'Import from shared module index.ts only, not internal files'
            },
            {
              group: ['*/views/*/*', '!*/views/*/index'],
              message: 'Import from view index.ts only, not internal files'
            },
            {
              group: ['*/watchers/*', '!*/watchers/index'],
              message: 'Import from watchers/index.ts only, not individual watcher files'
            },
            {
              group: ['*/extension/*', '!*/extension/index'],
              message: 'Import from extension/index.ts only, not internal files'
            },
            {
              group: ['*/state/*', '!*/state/index'],
              message: 'Import from state/index.ts only, not internal files'
            },
            {
              group: ['*/queue/*', '!*/queue/index'],
              message: 'Import from queue/index.ts only, not internal files'
            },
            {
              group: ['vscode', '!@shared/vscode'],
              message: 'Import vscode API through @shared/vscode abstractions only'
            },
            {
              group: ['path'],
              message: 'Import path operations through @shared/file-ops abstractions only'
            },
            {
              group: ['fs', 'fs/promises'],
              message: 'Import file operations through @shared/file-ops abstractions only'
            },
            {
              group: ['os'],
              message: 'Import OS operations through @shared/file-ops abstractions only'
            }
          ]
        }
      ],

      curly: 'warn',
      eqeqeq: 'warn',
      'no-throw-literal': 'warn'
    }
  }
]