import * as path from 'path'
import { getWorkspaceRoot } from '../../state'
import { readDir, readSymlink, statFile } from '../../shared/file-ops'


interface ExistingSymlink {
  target: string
  source: string
  type: 'dir' | 'file'
}

export function generate(): string {
  const symlinks = scanWorkspaceSymlinks()
  
  const directories = symlinks.filter(s => s.type === 'dir').map(s => ({
    target: s.target,
    source: s.source
  }))
  const files = symlinks.filter(s => s.type === 'file').map(s => ({
    target: s.target,
    source: s.source
  }))
  
  const config = {
    ...(directories.length > 0 && { directories }),
    ...(files.length > 0 && { files })
  }
  
  return JSON.stringify(config, null, 2)
}

function scanWorkspaceSymlinks(): ExistingSymlink[] {
  const workspaceRoot = getWorkspaceRoot()
  const symlinks: ExistingSymlink[] = []

  function scanDirectory(dirPath: string, relativePath: string = '') {
    try {
      const entries = readDir(relativePath || '.')
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const relativeEntryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        
        if (entry.isSymbolicLink()) {
          try {
            const linkTarget = readSymlink(relativeEntryPath)
            const stats = statFile(relativeEntryPath)
            
            // Convert to workspace root relative (@-path)
            const absoluteSource = path.resolve(path.dirname(fullPath), linkTarget)
            const relativeSource = path.relative(workspaceRoot, absoluteSource)
            const sourceTarget = relativeSource.startsWith('..') ? relativeSource : `@${relativeSource.replace(/\\/g, '/')}`
            
            symlinks.push({
              target: `@${relativeEntryPath}`,
              source: sourceTarget,
              type: stats.isDirectory() ? 'dir' : 'file'
            })
          } catch {
            // Skip broken symlinks
          }
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          scanDirectory(fullPath, relativeEntryPath)
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  scanDirectory(workspaceRoot)
  return symlinks
}