import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    files: ['**/*.ts']
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