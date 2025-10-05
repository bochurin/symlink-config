import * as vscode from 'vscode'

import { read } from './read'
import { build } from './build'
import { make } from './make'
import * as symlinkConfigManager from '../symlink-config'

export async function handleEvent(action: 'modified' | 'deleted') {
  const gitignoreServiceFiles = symlinkConfigManager.read(
    'gitignoreServiceFiles'
  )
  if (!gitignoreServiceFiles) {
    return
  }

  let needsRegen = action === 'deleted'

  if (action !== 'deleted') {
    const builtSection = build()
    const fromFileSection = read()
    needsRegen = fromFileSection !== builtSection
  }

  if (needsRegen) {
    vscode.window.showWarningMessage(
      '.gitignore is not correct or absent. Generating ...',
      'OK'
    )

    await make()
  }
}
