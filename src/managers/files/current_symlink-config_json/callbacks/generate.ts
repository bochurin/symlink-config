import { getWorkspaceRoot } from '@state'
import { readDir, readSymlink, statFile, normalizePath } from '@shared/file-ops'
import { Config, ConfigEntry } from '@managers'

interface ExistingSymlink {
  target: string
  source: string
  type: 'dir' | 'file'
}

export function generateCallback(): string {
  const symlinks = scanWorkspaceSymlinks()

  const directories: ConfigEntry[] = symlinks
    .filter((s) => s.type === 'dir')
    .map((s) => ({
      target: s.target,
      source: s.source,
    }))
  const files: ConfigEntry[] = symlinks
    .filter((s) => s.type === 'file')
    .map((s) => ({
      target: s.target,
      source: s.source,
    }))

  const config: Config = {
    ...(directories.length > 0 && { directories }),
    ...(files.length > 0 && { files }),
  }

  return JSON.stringify(config, null, 2)
}

function scanWorkspaceSymlinks(): ExistingSymlink[] {
  const workspaceRoot = getWorkspaceRoot()
  const symlinks: ExistingSymlink[] = []

  function scanDirectory(dirPath: string, relativePath: string = '') {
    try {
      const entries = readDir(workspaceRoot, relativePath || '.')

      for (const entry of entries) {
        const relativeEntryPath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name

        if (entry.isSymbolicLink()) {
          try {
            const linkTarget = readSymlink(workspaceRoot, relativeEntryPath)
            const stats = statFile(workspaceRoot, relativeEntryPath)

            // Always convert to workspace root relative (@-path)
            let sourceTarget: string
            if (linkTarget.startsWith('@')) {
              // Already @ format
              sourceTarget = linkTarget
            } else if (linkTarget.startsWith('..')) {
              // Relative path - convert to @ format
              const absolutePath = normalizePath(
                relativePath
                  ? `${relativePath}/../${linkTarget.substring(3)}`
                  : linkTarget.substring(3),
              )
              sourceTarget = `@${absolutePath}`
            } else {
              // Direct path - add @ prefix
              sourceTarget = `@${normalizePath(linkTarget)}`
            }

            symlinks.push({
              target: `@${relativeEntryPath}`,
              source: sourceTarget,
              type: stats.isDirectory() ? 'dir' : 'file',
            })
          } catch {
            // Skip broken symlinks
          }
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          scanDirectory(
            workspaceRoot + '/' + relativeEntryPath,
            relativeEntryPath,
          )
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  scanDirectory(workspaceRoot)
  return symlinks
}
