import * as vscode from 'vscode'

import { readFromFile } from './read-from-file'
import { buildSection } from './build-section'
import { makeFile } from './make-file'
import { readFromConfig } from '../../shared/config-ops'

export async function handleEvent(action: 'modified' | 'deleted') {
  const gitignoreServiceFiles = readFromConfig('symlink-config.gitignoreServiceFiles', false)
  if (!gitignoreServiceFiles) {
    return
  }

  let needsRegen = action === 'deleted'

  if (action !== 'deleted') {
    const builtSection = buildSection()
    const fromFileSection = readFromFile()
    needsRegen = fromFileSection !== builtSection
  }

  if (needsRegen) {
    vscode.window.showWarningMessage('.gitignore is not correct or absent. Generating ...', 'OK')

    await makeFile()
  }
}
