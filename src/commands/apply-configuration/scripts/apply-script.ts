import * as vscode from 'vscode'
import { minimatch } from 'minimatch'
import { FILE_NAMES, DANGEROUS_SOURCES } from '@shared/constants'
import { SymlinkOperation } from '../utils'
import { writeFile, isWindows, fullPath } from '@shared/file-ops'
import {
  header,
  footer,
  targetPath,
  directoryPath,
  lineEnding as lineEnding,
  filePermissions as filePermissions,
  removeFile,
  createDirectory,
} from './shared'
import { createSymlink } from './shared/operations'
import { log } from '@log'

export async function applyScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
  targetOS: 'windows' | 'unix',
  silent = false,
) {
  // Filter out dangerous symlinks
  const createOps = operations.filter(op => op.type === 'create' && op.source)
  const dangerousOps = createOps.filter(op => {
    const source = op.source!.replace(/^@/, '')
    return DANGEROUS_SOURCES.PATTERNS.some(pattern => 
      minimatch(source, pattern, { nocase: true })
    )
  })
  
  let safeOperations = operations
  if (dangerousOps.length > 0) {
    if (silent) {
      // In silent mode, always skip dangerous symlinks
      safeOperations = operations.filter(op => !dangerousOps.includes(op))
      log(`Skipped ${dangerousOps.length} dangerous symlinks (silent mode)`)
    } else {
      const dangerousList = dangerousOps.map(op => `${op.target} -> ${op.source}`).join('\n')
      const confirmed = await vscode.window.showWarningMessage(
        `WARNING: The following symlinks target files that may cause workspace corruption:\n\n${dangerousList}\n\nInclude these dangerous symlinks?`,
        { modal: true },
        'Skip Dangerous Symlinks',
        'Include Anyway'
      )
      
      if (confirmed === 'Skip Dangerous Symlinks') {
        safeOperations = operations.filter(op => !dangerousOps.includes(op))
        log(`Skipped ${dangerousOps.length} dangerous symlinks`)
      } else if (confirmed === 'Include Anyway') {
        log(`User chose to include ${dangerousOps.length} dangerous symlinks`)
      } else {
        // User cancelled
        return
      }
    }
    dangerousOps.forEach(op => log(`  Dangerous: ${op.target} -> ${op.source}`))
  }
  
  const scriptName =
    targetOS === 'windows'
      ? FILE_NAMES.APPLY_SYMLINKS_BAT
      : FILE_NAMES.APPLY_SYMLINKS_SH
  const lines = header(
    workspaceRoot,
    'Applying symlink configuration...',
    targetOS,
  )

  for (const op of safeOperations) {
    const target = targetPath(op.target, workspaceRoot, targetOS)
    const targetDir = directoryPath(op.target, targetOS)

    if (op.type === 'delete') {
      lines.push(...removeFile(target, op.target, targetOS))
    } else if (op.type === 'create') {
      lines.push(...createDirectory(targetDir, targetOS))
      lines.push(
        ...createSymlink(
          {
            type: 'create',
            target: op.target,
            source: op.source,
            isDirectory: op.isDirectory,
          },
          targetOS,
        ),
      )
    }
  }

  lines.push(...footer(targetOS))

  const content = lines.flat().join(lineEnding(targetOS))
  await writeFile(workspaceRoot, scriptName, content, filePermissions(targetOS))
}
