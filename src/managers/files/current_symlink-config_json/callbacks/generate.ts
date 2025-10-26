import { Config, ConfigEntry } from '@managers'
import { readDir, readSymlink, statFile, normalizePath } from '@shared/file-ops'
import { getWorkspaceRoot } from '@state'

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
            } else {
              // Resolve to absolute path first, then convert to @-relative
              let absoluteTarget: string
              if (linkTarget.startsWith('/') || linkTarget.match(/^[A-Za-z]:/)) {
                // Already absolute path
                absoluteTarget = linkTarget
              } else {
                // Relative path - resolve from symlink location
                const symlinkDir = relativePath ? `${workspaceRoot}/${relativePath}` : workspaceRoot
                absoluteTarget = normalizePath(`${symlinkDir}/${linkTarget}`)
              }
              
              // Convert absolute path to @-relative if within workspace
              const normalizedWorkspaceRoot = normalizePath(workspaceRoot).replace(/\\/g, '/')
              const normalizedTarget = normalizePath(absoluteTarget).replace(/\\/g, '/')
              
              if (normalizedTarget.startsWith(normalizedWorkspaceRoot)) {
                let relativeToRoot = normalizedTarget.substring(normalizedWorkspaceRoot.length)
                // Remove leading slash if present
                if (relativeToRoot.startsWith('/')) {
                  relativeToRoot = relativeToRoot.substring(1)
                }
                sourceTarget = `@${relativeToRoot}`
              } else {
                // Outside workspace - keep as absolute but add @
                sourceTarget = `@${normalizedTarget}`
              }
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
