import * as vscode from 'vscode'
import { ElementType } from './types'

export class SymlinkTreeItem extends vscode.TreeItem {
  public type?: 'root' | 'dir' | 'file'
  public configPath?: string
  public status?: string

  public children?: SymlinkTreeItem[]

  constructor(
    public readonly label: string,
    commandId?: string,
    collapsibleState?: vscode.TreeItemCollapsibleState,
    type?: ElementType,
    configPath?: string,
    status?: string,
    fileName?: string
  ) {
    super(label, collapsibleState)

    this.type = type
    this.configPath = configPath
    this.status = status

    // Set file/folder icon from theme
    if (type !== 'root') {
      this.resourceUri = vscode.Uri.file(
        `/${fileName}${type === 'dir' ? '/' : ''}`
      )
    }

    if (commandId) {
      this.command = {
        command: commandId,
        title: label
      }
    }

    // Apply status color styling (overrides resourceUri)
    // if (status === 'new') {
    //   this.iconPath = new vscode.ThemeIcon(
    //     'add',
    //     new vscode.ThemeColor('gitDecoration.addedResourceForeground')
    //   )
    // } else if (status === 'deleted') {
    //   this.iconPath = new vscode.ThemeIcon(
    //     'remove',
    //     new vscode.ThemeColor('gitDecoration.deletedResourceForeground')
    //   )
    // }
  }
}
