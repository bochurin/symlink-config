import { FILE_NAMES } from '@shared/constants'
import { SymlinkOperation } from '../utils'
import { writeFile } from '@shared/file-ops'
import {
  header,
  footer,
  lineEnding as lineEnding,
  filePermissions as filePermissions,
  removeFile,
  createDirectory,
} from './shared'
import { createSymlink } from './shared/operations'

export async function applyScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
  targetOS: 'windows' | 'unix',
) {
  
  const scriptName =
    targetOS === 'windows'
      ? FILE_NAMES.APPLY_SYMLINKS_BAT
      : FILE_NAMES.APPLY_SYMLINKS_SH
  const lines = header(
    workspaceRoot,
    'Applying symlink configuration...',
    targetOS,
  )

  for (const op of operations) {
    // TODO: Implement targetPath and directoryPath using shared abstractions
    const target = op.target // targetPath(op.target, workspaceRoot, targetOS)
    const targetDir = op.target // directoryPath(op.target, targetOS)

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
