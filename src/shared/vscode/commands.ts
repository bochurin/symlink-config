import * as vscode from 'vscode'

export async function executeCommand(command: string, ...args: any[]): Promise<any> {
  return await vscode.commands.executeCommand(command, ...args)
}

export function setContext(key: string, value: any): void {
  vscode.commands.executeCommand('setContext', key, value)
}