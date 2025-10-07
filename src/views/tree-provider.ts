import * as vscode from 'vscode'
import * as nextConfigManager from '../managers/next-config'

export class SymlinkTreeProvider implements vscode.TreeDataProvider<SymlinkTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SymlinkTreeItem | undefined | null | void>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event
  private viewMode: 'targets' | 'sources' = 'targets'

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'targets' ? 'sources' : 'targets'
    this.refresh()
  }

  getTreeItem(element: SymlinkTreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: SymlinkTreeItem): SymlinkTreeItem[] {
    if (!element) {
      const description = this.viewMode === 'targets' 
        ? 'target ← source'
        : 'source → target'
      return [
        new SymlinkTreeItem(`Symlinks (${description})`, undefined, vscode.TreeItemCollapsibleState.Expanded)
      ]
    }

    if (element.label?.startsWith('Symlinks')) {
      return this.getSymlinkItems()
    }

    if ((element as any).children) {
      return (element as any).children
    }

    return []
  }

  private getSymlinkItems(): SymlinkTreeItem[] {
    try {
      const configContent = nextConfigManager.read()
      if (!configContent) return []
      
      const config = JSON.parse(configContent)
      const tree = this.buildTree(config)
      return this.treeToItems(tree)
    } catch {
      return [new SymlinkTreeItem('No symlinks configured')]
    }
  }

  private buildTree(config: any): any {
    const tree: any = {}
    
    const addToTree = (path: string, other: string, isDir: boolean) => {
      const parts = path.replace('@', '').split('/')
      let current = tree
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (!current[part]) {
          current[part] = {
            children: {},
            isLeaf: i === parts.length - 1,
            other: i === parts.length - 1 ? other.replace('@', '') : undefined,
            isDir: i === parts.length - 1 ? isDir : true
          }
        }
        current = current[part].children
      }
    }

    if (config.directories) {
      for (const entry of config.directories) {
        if (this.viewMode === 'targets') {
          addToTree(entry.target, entry.source, true)
        } else {
          addToTree(entry.source, entry.target, true)
        }
      }
    }

    if (config.files) {
      for (const entry of config.files) {
        if (this.viewMode === 'targets') {
          addToTree(entry.target, entry.source, false)
        } else {
          addToTree(entry.source, entry.target, false)
        }
      }
    }

    return tree
  }

  private treeToItems(tree: any, prefix = ''): SymlinkTreeItem[] {
    const items: SymlinkTreeItem[] = []
    
    for (const [name, node] of Object.entries(tree)) {
      const hasChildren = Object.keys((node as any).children).length > 0
      
      let icon: string
      let label: string
      
      if ((node as any).isLeaf && (node as any).other) {
        if (this.viewMode === 'targets') {
          // Target view: source → target (symlink)
          icon = (node as any).isDir ? '📁' : '📄'
          label = `${icon} ${(node as any).other} → 🔗${(node as any).isDir ? '📁' : '📄'} ${name}`
        } else {
          // Source view: source → target (symlink)
          icon = (node as any).isDir ? '📁' : '📄'
          label = `${icon} ${name} → 🔗${(node as any).isDir ? '📁' : '📄'} ${(node as any).other}`
        }
      } else {
        icon = '📂'
        label = `${icon} ${name}`
      }
      
      const item = new SymlinkTreeItem(
        label,
        undefined,
        hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
      )
      
      if (hasChildren) {
        item.children = this.treeToItems((node as any).children, prefix + name + '/')
      }
      
      items.push(item)
    }
    
    return items
  }
}

class SymlinkTreeItem extends vscode.TreeItem {
  public children?: SymlinkTreeItem[]
  
  constructor(
    public readonly label: string,
    commandId?: string,
    collapsibleState?: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState || vscode.TreeItemCollapsibleState.None)
    if (commandId) {
      this.command = {
        command: commandId,
        title: label
      }
    }
  }
}