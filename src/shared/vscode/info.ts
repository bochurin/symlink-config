import * as vscode from 'vscode'
import { readConfig } from '../config-ops'
import { log } from '../state'

export function info(message: string) {
  log(message)
  const silent = readConfig<Boolean>('symlink-config.silent', false)
  if (!silent) vscode.window.showInformationMessage(message, 'OK')
}
