/**
 * Glob patterns for dangerous symlink sources that may cause workspace corruption
 */
export const DANGEROUS_SOURCES = {
  PATTERNS: [
    '**/.vscode/**',
    '**/*.code-workspace',
    '**/.gitignore',
  ],
} as const
