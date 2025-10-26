import { FILE_NAMES } from '@shared/constants'
import * as vscode from 'vscode'

import { TreeItem } from './tree-item'
import { treeBase, TreeNode } from './types'

export function renderTree(
  tree: Record<string, TreeNode>,
  treeBase: treeBase,
): TreeItem[] {
  const items: TreeItem[] = []

  for (const [key, treeNode] of Object.entries(tree)) {
    const hasChildren = Object.keys(treeNode.children).length > 0
    const displayName = treeNode.displayName || key

    let label: string
    if (treeNode.isSymlinkLeaf) {
      // Add status icons for symlink leaves
      const statusIcon =
        treeNode.symlinkStatus === 'new'
          ? '➕'
          : treeNode.symlinkStatus === 'deleted'
            ? '❌'
            : ''

      if (treeBase === 'targets') {
        // Target view: source → target (symlink)
        label = `${displayName} ←🔗${statusIcon}← ${treeNode.linkedPath}`
      } else {
        // Source view: source → target (symlink)
        label = `${displayName} →${statusIcon}🔗→ ${treeNode.linkedPath}`
      }
    } else {
      label = `${displayName}`
    }

    const collapsibleState = hasChildren
      ? vscode.TreeItemCollapsibleState.Expanded
      : treeNode.type === 'dir'
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None

    let tooltip: string | undefined
    if (treeNode.isSymlinkLeaf) {
      switch (treeNode.symlinkStatus) {
        case 'new':
          tooltip = 'New symlink will be created by next configuration'
          break
        case 'deleted':
          tooltip = 'Will be removed when next configuration is applied'
          break
        case 'unchanged':
          tooltip = 'Symlink is up to date'
          break
        default:
          tooltip = ''
      }
    }
    if (treeNode.configPath) {
      tooltip = `${tooltip}\nDefined in: ${treeNode.configPath}/${FILE_NAMES.SYMLINK_CONFIG}`
    }

    const item = new TreeItem(
      label, //
      {
        type: hasChildren ? 'dir' : treeNode.type,
        collapsibleState,
        configPath: treeNode.configPath,
        symlinkStatus: treeNode.symlinkStatus,
        iconPath: treeNode.iconPath,
        tooltip,
        commandId: treeNode.isSymlinkLeaf ? 'symlink-config.openSymlinkConfig' : undefined,
      },
    )

    // Set context value for menu visibility
    item.contextValue = treeNode.isSymlinkLeaf ? 'symlinkLeaf' : 'directory'

    if (hasChildren) {
      item.children = renderTree(treeNode.children, treeBase)
    }

    items.push(item)
  }

  return items
}
