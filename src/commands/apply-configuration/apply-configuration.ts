import * as vscode from 'vscode'
import * as os from 'os'
import { getWorkspaceRoot } from '../../state'
import { info } from '../../shared/vscode/info'
import { generateTree } from '../../views/symlink-tree/generate'
import { collectSymlinkOperations } from './collect-operations'
import { generateWindowsScript } from './generate-windows-script'
import { generateUnixScript } from './generate-unix-script'
import { read as readSymlinkSettings } from '../../managers/symlink-settings'
import { CONFIG_PARAMETERS } from '../../shared/constants'

export async function applyConfiguration() {
  const workspaceRoot = getWorkspaceRoot()

  try {
    // Generate tree to get symlink operations
    const tree = generateTree('targets')
    const operations = collectSymlinkOperations(tree)

    if (operations.length === 0) {
      info('No symlink operations needed')
      return
    }

    const scriptGeneration = readSymlinkSettings(CONFIG_PARAMETERS.SCRIPT_GENERATION)
    const isWindows = os.platform() === 'win32'

    const shouldGenerateWindows = scriptGeneration === 'windows-only' || scriptGeneration === 'both' || (scriptGeneration === 'auto' && isWindows)
    const shouldGenerateUnix = scriptGeneration === 'unix-only' || scriptGeneration === 'both' || (scriptGeneration === 'auto' && !isWindows)

    if (shouldGenerateWindows) {
      await generateWindowsScript(operations, workspaceRoot)
    }
    
    if (shouldGenerateUnix) {
      await generateUnixScript(operations, workspaceRoot)
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to apply configuration: ${error}`)
  }
}