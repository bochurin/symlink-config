import { minimatch } from 'minimatch'
import { log } from '@log'
import { DANGEROUS_SOURCES } from '@shared/constants'
import { basename } from '@shared/file-ops'
import { choice } from '@shared/vscode'
import { SymlinkOperation } from './types'

export async function filterDangerousSources(
  operations: SymlinkOperation[],
): Promise<SymlinkOperation[]> {
  const createOps = operations.filter((op) => op.type === 'create')

  const samePathOps = createOps.filter((op) => {
    const source = op.source.replace(/^@/, '')
    return source === op.target
  })

  if (samePathOps.length > 0) {
    const msg = `Filtered ${samePathOps.length} symlinks with identical source and target`
    log(msg, true)
    samePathOps.forEach((op) => log(`  Same path: ${op.target}`))
  }

  const validOps = operations.filter((op) => !samePathOps.includes(op))
  const validCreateOps = validOps.filter((op) => op.type === 'create')

  const dangerousOps = validCreateOps.filter((op) => {
    const source = op.source.replace(/^@/, '')
    const isDangerousPattern = DANGEROUS_SOURCES.PATTERNS.some((pattern) =>
      minimatch(source, pattern, { nocase: true }),
    )
    const sourceName = basename(source)
    const targetName = basename(op.target)
    const isSameName = sourceName === targetName
    return isDangerousPattern && isSameName
  })

  if (dangerousOps.length === 0) {
    return validOps
  }

  const dangerousList = dangerousOps
    .map((op) => `${op.target} -> ${op.source}`)
    .join('\n')
  const dialogText = `WARNING: The following symlinks target files that may cause workspace corruption:\n\n${dangerousList}`
  
  log(`Showing dangerous symlinks dialog:\n${dialogText}`)
  
  const userChoice = await choice(
    dialogText,
    'Include Anyway',
    'Skip Dangerous Symlinks',
  )

  log(`User choice: ${userChoice || 'cancelled'}`)

  if (userChoice === 'Include Anyway') {
    log(`Including ${dangerousOps.length} dangerous symlinks`)
    dangerousOps.forEach((op) =>
      log(`  Dangerous: ${op.target} -> ${op.source}`),
    )
    return validOps
  }

  const filtered = validOps.filter((op) => !dangerousOps.includes(op))
  log(`Skipping ${dangerousOps.length} dangerous symlinks`)
  dangerousOps.forEach((op) => log(`  Dangerous: ${op.target} -> ${op.source}`))
  return filtered
}
