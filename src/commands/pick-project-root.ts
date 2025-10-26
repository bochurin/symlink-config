import { writeSettings } from '@shared/settings-ops'
import { SETTINGS } from '@shared/constants'
import { log } from '@log'

import { showOpenDialog, info } from '@shared/vscode'

export async function pickProjectRoot(): Promise<void> {
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
    
    await writeSettings('projectRoot', selectedPath)
    
    info(`Project root set to: ${selectedPath}`)
  }
}
