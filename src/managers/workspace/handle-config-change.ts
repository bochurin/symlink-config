import * as vscode from 'vscode'

import * as gitignoreManager from '../gitignore'

import { makeExcludeInConfig } from './make-exclude-in-config'
import { readFromConfig } from '../../shared/config-ops'

export async function handleConfigChange(
  section: string,
  parameter: string,
  payload: { value: any; old_value: any }
) {
  switch (section) {
    case 'symlink-config':
      switch (parameter) {
        case 'gitignoreServiceFiles':
          handleGitignoreServiceFileParameter(payload)
          break
        case 'hideServiceFiles':
          await handleHideServiceFilesParameter(payload)
          break
        case 'hideSymlinkConfigs':
          await handelHideSymlinkConfigsParameter(payload)
          break
      }
      break
    case 'files':
      switch (parameter) {
        case 'exclude':
          await handleFilesExcludeConfigSection()
          break
      }
      break
  }
}

export async function handleFilesExcludeConfigSection() {
  const hideServiceFiles = readFromConfig('symlink-config.hideServiceFiles', false)
  const hideSymlinkConfigs = readFromConfig('symlink-config.manageHidingSymlinkConfigs', false)
  if (hideServiceFiles || hideSymlinkConfigs) {
    await makeExcludeInConfig()
  }
}

async function handelHideSymlinkConfigsParameter(payload: { value: any; old_value: any }) {
  vscode.window.showInformationMessage(
    `Hiding symlink.config.json files ${payload.value ? 'enabled' : 'disabled'}.`,
    'OK'
  )
  await makeExcludeInConfig('symlinkConfigs')
}

async function handleHideServiceFilesParameter(payload: { value: any; old_value: any }) {
  vscode.window.showInformationMessage(
    `Hiding service files ${payload.value ? 'enabled' : 'disabled'}.`,
    'OK'
  )
  await makeExcludeInConfig('serviceFiles')
}

function handleGitignoreServiceFileParameter(payload: { value: any; old_value: any }) {
  vscode.window.showInformationMessage(
    `Gitignoring service files ${payload.value ? 'enabled' : 'disabled'}.`,
    'OK'
  )
  if (payload.value) {
    gitignoreManager.handleEvent('modified')
  } else {
    //TODO: Ask if the section should be cleaned
  }
}
