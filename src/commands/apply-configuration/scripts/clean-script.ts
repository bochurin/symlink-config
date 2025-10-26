import { FILE_NAMES, SETTINGS } from '@shared/constants'
import { writeFile, fullPath } from '@shared/file-ops'

import { collectOperations } from '../utils'

import { header, footer, lineEnding, filePermissions, ifExists } from './utils'
import { removeSymlink } from './utils/operations'

import { useSymlinkConfigManager } from '@/src/managers'

export async function cleanScript(
  workspaceRoot: string,
  targetOS: 'windows' | 'unix',
) {
  const scriptName =
    targetOS === 'windows'
      ? FILE_NAMES.CLEAN_SYMLINKS_BAT
      : FILE_NAMES.CLEAN_SYMLINKS_SH

  const operations = collectOperations().filter((op) => op.type === 'delete')

  if (operations.length === 0) {
    return
  }

  const lines = header(workspaceRoot, 'Clearing symlinks...', targetOS)

  for (const op of operations) {
    lines.push(...removeSymlink(op.target, workspaceRoot, op.isDirectory, targetOS))
  }

  lines.push(...footer(targetOS))

  const content = lines.join(lineEnding(targetOS))
  await writeFile(workspaceRoot, scriptName, content, filePermissions(targetOS))
}
