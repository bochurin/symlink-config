import * as vscode from 'vscode'
import { readConfig } from '../config-ops'

export function info(message: string) {
  const silent = readConfig<Boolean>('symlink-config.silent', false)
  if (!silent) vscode.window.showInformationMessage(message)
}
