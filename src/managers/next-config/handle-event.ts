import * as vscode from 'vscode'

import { make } from './make'
import { needsRegenerate } from './needs-regenerate'

export async function handleEvent(action: 'modified' | 'deleted') {
  const needsRegen = action === 'deleted' || needsRegenerate()

  if (needsRegen) {
    vscode.window.showWarningMessage(
      `next.symlink.config.json was ${action}. Regenerating...`,
      'OK'
    )
    await make()
  }
}
