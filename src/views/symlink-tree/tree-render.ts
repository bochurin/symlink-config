import * as vscode from 'vscode'
import { treeBase, TreeNode } from './types'
import { TreeItem } from './tree-item'

export function renderTree(
  tree: Record<string, TreeNode>,
  treeBase: treeBase,
): TreeItem[] {
  const items: TreeItem[] = []

  for (const [key, treeNode] of Object.entries(tree)) {
    const hasChildren = Object.keys(treeNode.children).length > 0

    let label: string
    // let icon: string
    if (treeNode.isSymlinkLeaf) {
      // icon = node.type === 'dir' ? '📁' : '📄'
      if (treeBase === 'targets') {
        // Target view: source → target (symlink)
        label = ` ${key} ←🔗← ${treeNode.linkedPath}`
      } else {
        // Source view: source → target (symlink)
        label = `${key} →🔗→ ${treeNode.linkedPath}`
      }
    } else {
      // icon = '📂'
      label = `${key}`
    }

    const collapsibleState = hasChildren
      ? vscode.TreeItemCollapsibleState.Expanded
      : treeNode.type === 'dir'
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None

    let tooltip = ''
    switch (treeNode.symlinkStatus) {
      case 'new':
        tooltip = 'New symlink will be created by next configuration'
        break
      case 'deleted':
        tooltip = 'Will be removed when next configuration is applied'
        break
      case 'unchanged':
      default:
    }
    if (treeNode.configPath) {
      tooltip = `${tooltip}\nDefined in: ${treeNode.configPath}/symlink.config.json`
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
      },
    )

    if (hasChildren) {
      item.children = renderTree(treeNode.children, treeBase)
    }

    items.push(item)
  }

  return items
}
