import * as vscode from 'vscode'

export async function executeCommand(command: string, ...args: any[]): Promise<any> {
  return await vscode.commands.executeCommand(command, ...args)
}

export enum StatusBarAlignment {
  Left = 1,
  Right = 2,
}

export function setContext(key: string, value: any): void {
  vscode.commands.executeCommand('setContext', key, value)
}