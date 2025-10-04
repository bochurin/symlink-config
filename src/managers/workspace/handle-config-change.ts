import * as vscode from 'vscode'
import { makeExludeInConfig } from './make-exlude-in-config'
import * as gitignoreManager from '../gitignore'

export async function handleConfigChange(
  section: string,
  parameter: string,
  payload: { value: any; old_value: any }
) {
  switch (section) {
    case 'symlink-config':
      switch (parameter) {
        case 'hideServiceFiles':
          await handleHideServiceFiles(payload.value)
          break
        case 'manageGitignore':
          await handleManageGitignore(payload.value)
          break
      }
      break
    case 'files':
      switch (parameter) {
        case 'exclude':
          await makeExludeInConfig()
          break
      }
      break
  }
}

async function handleHideServiceFiles(enabled: boolean) {
  vscode.window.showInformationMessage(
    `Service files hiding ${enabled ? 'enabled' : 'disabled'}.`,
    'OK'
  )
  await makeExludeInConfig()
}

async function handleManageGitignore(enabled: boolean) {
  gitignoreManager.handleEvent(enabled ? 'inited' : 'disabled')
}
