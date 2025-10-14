import * as vscode from 'vscode'

import * as state from '../../shared/state'

import { treeBase, TreeNode } from './types'
import { TreeItem } from './tree-item'
import { generateTree } from './generate'
import { renderTree } from './tree-render'

export class TreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | null | void //Why not just TreeItem
  >()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event
  private viewMode: treeBase = 'targets'

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'targets' ? 'sources' : 'targets'
    this.refresh()
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element
  }

  getChildren(treeItem?: TreeItem): TreeItem[] {
    // If it's the first call then create the root item
    if (!treeItem) {
      const workspaceName = state.getWorkspaceName()
      const description =
        this.viewMode === 'targets'
          ? 'target ←🔗← source'
          : 'source →🔗→ target'

      return [
        // Root item is "rendered" right here
        new TreeItem(`Symlinks in "${workspaceName}" (${description})`, {
          type: 'root',
          collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
          iconPath: '.',
        }),
      ]
    }

    // If the item (including root) already has rendered children subtree, return them
    if (treeItem.children) {
      return treeItem.children
    }

    // If the item has no children and it's root item,
    // generate and render the whole tree from root
    if (treeItem.type === 'root') {
      try {
        const tree = generateTree(this.viewMode)
        return renderTree(tree, this.viewMode)
      } catch {}
    }

    return []
  }
}
