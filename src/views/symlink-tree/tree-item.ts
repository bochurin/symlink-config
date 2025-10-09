import * as vscode from 'vscode'
import { SymlinkType, TreeNodeType } from './types'

export class TreeItem extends vscode.TreeItem {
  public type?: TreeNodeType
  public children?: TreeItem[]
  public configPath?: string
  public status?: string

  constructor(
    public readonly label: string,
    props: {
      type?: TreeNodeType
      collapsibleState?: vscode.TreeItemCollapsibleState
      configPath?: string
      iconPath?: string
      symlinkStatus?: string
      commandId?: string
      tooltip?: string
    },
  ) {
    super(label, props.collapsibleState)

    this.type = props.type
    this.configPath = props.configPath
    this.status = props.symlinkStatus

    // Set file/folder icon from theme
    if (props.iconPath) {
      this.resourceUri = vscode.Uri.file(`${props.iconPath}`)
    }

    if (props.commandId) {
      this.command = {
        command: props.commandId,
        title: label,
      }
    }

    if (props.tooltip) {
      this.tooltip = props.tooltip
    } else {
      this.tooltip = props.iconPath
    }
  }
}
