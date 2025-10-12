import * as fs from 'fs/promises'
import * as path from 'path'
import { getWorkspaceRoot } from '../../state'

interface ExistingSymlink {
  target: string
  source: string
  type: 'dir' | 'file'
}

export async function generate(): Promise<string> {
  const workspaceRoot = getWorkspaceRoot()
  const symlinks = await scanWorkspaceSymlinks()
  
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

async function scanWorkspaceSymlinks(): Promise<ExistingSymlink[]> {
  const workspaceRoot = getWorkspaceRoot()
  const symlinks: ExistingSymlink[] = []

  async function scanDirectory(dirPath: string, relativePath: string = '') {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const relativeEntryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        
        if (entry.isSymbolicLink()) {
          try {
            const linkTarget = await fs.readlink(fullPath)
            const stats = await fs.stat(fullPath)
            
            // Convert absolute target to relative from workspace root
            const absoluteTarget = path.resolve(path.dirname(fullPath), linkTarget)
            const relativeTarget = path.relative(workspaceRoot, absoluteTarget)
            
            symlinks.push({
              target: `@${relativeEntryPath}`,
              source: relativeTarget.startsWith('..') ? relativeTarget : `@${relativeTarget.replace(/\\/g, '/')}`,
              type: stats.isDirectory() ? 'dir' : 'file'
            })
          } catch {
            // Skip broken symlinks
          }
        } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await scanDirectory(fullPath, relativeEntryPath)
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  await scanDirectory(workspaceRoot)
  return symlinks
}