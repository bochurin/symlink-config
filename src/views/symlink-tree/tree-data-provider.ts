import * as vscode from 'vscode'

import * as state from '../../state'

import { ViewMode, TreeNode } from './types'
import { SymlinkTreeItem } from './tree-item'
import { generateTree } from './generate'

export class SymlinkTreeProvider
  implements vscode.TreeDataProvider<SymlinkTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    SymlinkTreeItem | undefined | null | void
  >()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event
  private viewMode: ViewMode = 'targets'

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
      const workspaceName = state.getWorkspaceName()
      const description =
        this.viewMode === 'targets' ? 'target ← source' : 'source → target'
      const rootElement = new SymlinkTreeItem(
        `Symlinks in "${workspaceName}" (${description})`,
        undefined,
        vscode.TreeItemCollapsibleState.Expanded,
        'root'
      )
      return [rootElement]
    }

    if (element.type === 'root') {
      return this.getSymlinkItems()
    }

    if (element.children) {
      return element.children
    }

    return []
  }

  private getSymlinkItems(): SymlinkTreeItem[] {
    let tree: Record<string, TreeNode> = {}
    try {
      tree = generateTree(this.viewMode)
    } catch {}

    return this.treeToItems(tree)
  }

  private treeToItems(
    tree: Record<string, TreeNode>,
    prefix = ''
  ): SymlinkTreeItem[] {
    const items: SymlinkTreeItem[] = []

    for (const [name, node] of Object.entries(tree)) {
      const hasChildren = Object.keys(node.children).length > 0

      let icon: string
      let label: string

      if (node.isLeaf && node.other) {
        icon = node.type === 'dir' ? '📁' : '📄'
        if (this.viewMode === 'targets') {
          // Target view: source → target (symlink)
          label = `🔗 ${name} ← ${icon} ${node.other}`
        } else {
          // Source view: source → target (symlink)
          label = `${icon} ${name} → 🔗 ${node.other}`
        }
      } else {
        icon = '📂'
        label = `${icon} ${name}`
      }

      const item = new SymlinkTreeItem(
        label,
        undefined,
        hasChildren
          ? vscode.TreeItemCollapsibleState.Expanded
          : vscode.TreeItemCollapsibleState.None,
        hasChildren ? 'dir' : node.type,
        node.configPath,
        node.status
      )

      // Apply styling based on status
      if (node.status === 'new') {
        item.tooltip = `New symlink in next configuration${node.configPath ? `\nDefined in: ${node.configPath}` : ''}`
      } else if (node.status === 'deleted') {
        item.tooltip = `Will be removed when configuration is applied${node.configPath ? `\nDefined in: ${node.configPath}` : ''}`
      } else if (node.configPath) {
        item.tooltip = `Defined in: ${node.configPath}`
      }

      if (hasChildren) {
        item.children = this.treeToItems(node.children, prefix + name + '/')
      }

      items.push(item)
    }

    return items
  }
}
