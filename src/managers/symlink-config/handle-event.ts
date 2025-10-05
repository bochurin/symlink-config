import * as vscode from 'vscode'

import * as gitignoreManager from '../gitignore'

import * as fileExcludeManager from '../file-exclude'

export async function handleEvent(
  section: string,
  parameter: string,
  payload: { value: any; old_value: any }
) {
  switch (parameter) {
    case 'gitignoreServiceFiles':
      vscode.window.showInformationMessage(
        `Gitignoring service files ${payload.value ? 'enabled' : 'disabled'}.`,
        'OK'
      )
      await gitignoreManager.make()
      break

    case 'hideServiceFiles':
    case 'hideSymlinkConfigs':
      const object =
        parameter === 'hideServiceFiles' ? 'service files' : 'symlink configs'
      const action = payload.value ? 'enabled' : 'disabled'
      const mode =
        parameter === 'hideServiceFiles'
          ? fileExcludeManager.Mode.ServiceFiles
          : fileExcludeManager.Mode.SymlinkConfigs
      vscode.window.showInformationMessage(`Hiding ${object} ${action}.`, 'OK')
      await fileExcludeManager.make(mode)
      break
  }
}
