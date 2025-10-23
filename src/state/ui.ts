import * as vscode from 'vscode'

let sylentMode: boolean
export function setSilentMode(mode: boolean) {
  sylentMode = mode
}
export function getSilentMode(): boolean {
  return sylentMode
}

let treeProvider: any
export function setTreeProvider(provider: any) {
  treeProvider = provider
}
export function getTreeProvider(): any {
  return treeProvider
}

let outputChannel: vscode.OutputChannel
export function setOutputChannel(channel: vscode.OutputChannel) {
  outputChannel = channel
}
export function getOutputChannel(): vscode.OutputChannel | undefined {
  return outputChannel
}

let isInitialized: boolean = false
export function setInitialized(initialized: boolean) {
  isInitialized = initialized
  vscode.commands.executeCommand('setContext', 'symlink-config.initialized', initialized)
}
export function getInitialized(): boolean {
  return isInitialized
}
