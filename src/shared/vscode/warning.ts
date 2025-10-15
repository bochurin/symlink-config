import * as vscode from 'vscode'
import { log } from '../state'

export function warning(message: string) {
  log(`WARNING: ${message}`)
  vscode.window.showWarningMessage(message, 'OK')
}
