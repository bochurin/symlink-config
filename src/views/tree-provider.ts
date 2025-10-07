import * as vscode from 'vscode'

export class SymlinkTreeProvider implements vscode.TreeDataProvider<SymlinkTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SymlinkTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: SymlinkTreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: SymlinkTreeItem): SymlinkTreeItem[] {
    if (!element) {
      return [
        new SymlinkTreeItem('Create All Symlinks', 'symlink-config.createAll'),
        new SymlinkTreeItem('Clean All Symlinks', 'symlink-config.cleanAll'),
        new SymlinkTreeItem('Dry Run', 'symlink-config.dryRun')
      ]
    }
    return []
  }
}

class SymlinkTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    commandId?: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None)
    if (commandId) {
      this.command = {
        command: commandId,
        title: label
      }
    }
  }
}