import { TreeNode } from '@views/symlink-tree/types'
import { SymlinkOperation } from './types'

export function collectSymlinkOperations(
  tree: Record<string, TreeNode>,
): SymlinkOperation[] {
  const operations: SymlinkOperation[] = []

  const traverse = (
    node: Record<string, TreeNode>,
    currentPath: string = '',
  ) => {
    for (const [key, treeNode] of Object.entries(node)) {
      const nodePath = currentPath ? `${currentPath}/${key}` : key

      if (treeNode.isSymlinkLeaf) {
        if (treeNode.symlinkStatus === 'new') {
          operations.push({
            type: 'create',
            target: nodePath,
            source: treeNode.linkedPath,
            isDirectory: treeNode.type === 'dir',
          })
        } else if (treeNode.symlinkStatus === 'deleted') {
          operations.push({
            type: 'delete',
            target: nodePath,
            isDirectory: treeNode.type === 'dir',
          })
        }
      }

      if (treeNode.children && Object.keys(treeNode.children).length > 0) {
        traverse(treeNode.children, nodePath)
      }
    }
  }

  traverse(tree)

  return operations.sort((a, b) => {
    if (a.type === 'delete' && b.type === 'create') return -1
    if (a.type === 'create' && b.type === 'delete') return 1
    return 0
  })
}
