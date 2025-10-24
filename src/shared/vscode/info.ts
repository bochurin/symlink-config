import * as vscode from 'vscode'
import { readSettings } from '@/src/shared/settings-ops'

export function info(message: string) {
  const silent = readSettings<Boolean>('symlink-config.silent', false)
  if (!silent) vscode.window.showInformationMessage(message)
}
