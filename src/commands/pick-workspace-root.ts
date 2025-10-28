import { info } from '@dialogs'
import { log } from '@log'
import { SETTINGS } from '@shared/constants'
import { writeSettings } from '@shared/settings-ops'
import { showOpenDialog } from '@shared/vscode'

export async function pickWorkspaceRoot(): Promise<void> {
  const options = {
    canSelectMany: false,
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: 'Select Project Root',
    title: 'Select Project Root Directory'
  }

  const folderUri = await showOpenDialog(options)
  
  if (folderUri && folderUri[0]) {
    const selectedPath = folderUri[0].fsPath
    log(`Setting project root to: ${selectedPath}`)
    
    await writeSettings('workspaceRoot', selectedPath)
    
    info(`Project root set to: ${selectedPath}`)
  }
}
