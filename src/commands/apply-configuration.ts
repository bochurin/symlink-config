import * as path from 'path'
import * as fs from 'fs/promises'
import { getWorkspaceRoot } from '../state'
import { info } from '../shared/vscode/info'

export async function applyConfiguration() {
  const workspaceRoot = getWorkspaceRoot()
  const sourcePath = path.join(workspaceRoot, 'next.symlink.config.json')
  const targetPath = path.join(workspaceRoot, 'current-symlink.config.json')

  try {
    const content = await fs.readFile(sourcePath, 'utf8')
    await fs.writeFile(targetPath, content)
    info(
      'Configuration applied: next.symlink.config.json → current-symlink.config.json',
    )
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      info('No next.symlink.config.json found to apply')
    } else {
      throw error
    }
  }
}
