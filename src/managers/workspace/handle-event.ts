import * as vscode from 'vscode'
import { buildExclusions } from './build-exclusions'
import { readFromFile } from './read-from-file'
import { makeFile } from './make-file'

export function handleEvent(action: 'inited' | 'modified' | 'deleted' | 'disabled') {
  if (action === 'disabled') {
    vscode.window.showInformationMessage('Service files hiding disabled.', 'OK')
    return
  }

  let needsRegenerate = true

  if (action !== 'deleted') {
    const builtExclusions = buildExclusions()
    const currentExclusions = readFromFile()
    
    // Check if all built exclusions are present
    needsRegenerate = Object.keys(builtExclusions).some(
      key => currentExclusions[key] !== builtExclusions[key]
    )
  }

  if (needsRegenerate) {
    vscode.window.showWarningMessage(
      'Workspace file exclusions are not correct. Updating...',
      'OK'
    )
    makeFile()
  }
}