import * as vscode from 'vscode'

import * as state from '../../shared/state'

import { readFromFile } from './read-from-file'
import { makeFile } from './make-file'
import { memo } from './memo'

export async function handleFileEvent(action: 'change' | 'delete') {
  var needsRegenerate = action === 'delete'

  const message = `next.symlink.config.json was ${
    action === 'change' ? 'changed' : 'deleted'
  }. Regenerating...`

  if (action === 'change') {
    try {
      needsRegenerate = needsRegenerate = readFromFile() !== state.getNextConfig()
    } catch (error) {
      needsRegenerate = true
    }
  }

  if (needsRegenerate) {
    vscode.window.showWarningMessage(message, 'OK')
    await makeFile()
    memo()
  }
}
