import * as vscode from 'vscode'

import { readFromFile } from './read-from-file'
import { buildSection } from './build-section'
import { makeFile } from './make-file'

export async function handleEvent(action: 'inited' | 'modified' | 'deleted' | 'disabled') {
  if (action === 'disabled') {
    vscode.window.showInformationMessage('Gitignore management disabled.', 'OK')
    return
  }

  let needsRegenerate = true

  if (action !== 'deleted') {
    const builtSection = buildSection()
    const fromFileSection = readFromFile()
    needsRegenerate = fromFileSection !== builtSection
  }

  if (needsRegenerate) {
    vscode.window.showWarningMessage(
      '.gitignore is not correct or absent. Generating ...',
      'OK'
    )

    await makeFile()
  }
}
