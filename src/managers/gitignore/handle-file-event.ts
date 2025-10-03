import * as vscode from 'vscode'

import * as state from '../../state'

import { readFromFile } from './read-from-file'
import { makeFile } from './make-file'
import { memo } from './memo'

export function handleFileEvent(action: 'change' | 'delete') {
  let needsRegenerate = action === 'delete'

  const message = `.gitignore was ${
    action === 'change' ? 'changed' : 'deleted'
  }. Regenerating symlink section...`

  if (action === 'change') {
    try {
      needsRegenerate = readFromFile() !== state.getGitignoreSection()
    } catch {
      needsRegenerate = true
    }
  }

  if (needsRegenerate) {
    vscode.window.showWarningMessage(message, 'OK')
    makeFile()
    memo()
  }
}
