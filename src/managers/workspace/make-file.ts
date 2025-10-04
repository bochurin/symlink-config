import * as vscode from 'vscode'
import { buildExclusions } from './build-exclusions'

export function makeFile() {
  const builtExclusions = buildExclusions()
  const config = vscode.workspace.getConfiguration()
  
  let currentExclusions = config.get<Record<string, boolean>>('files.exclude', {})
  
  // Merge built exclusions with existing ones
  const newExclusions = { ...currentExclusions, ...builtExclusions }
  
  config.update('files.exclude', newExclusions, vscode.ConfigurationTarget.Workspace)
}