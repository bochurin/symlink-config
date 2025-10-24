import { TreeNode } from '../types'

export function sortTree(
  tree: Record<string, TreeNode>,
): Record<string, TreeNode> {
  const sortedEntries = Object.entries(tree).sort(
    ([nameA, nodeA], [nameB, nodeB]) => {
      // First sort by name
      const nameCompare = nameA.localeCompare(nameB)
      if (nameCompare !== 0) return nameCompare

      // Then by status: deleted (0) before new (1), unchanged (2) is after all
      const statusOrder: Record<string, number> = {
        deleted: 0,
        new: 1,
        unchanged: 2,
      }
      const aOrder = statusOrder[nodeA.symlinkStatus ?? 'unchanged'] ?? 2
      const bOrder = statusOrder[nodeB.symlinkStatus ?? 'unchanged'] ?? 2
      return aOrder - bOrder
    },
  )

  const sortedTree: Record<string, TreeNode> = {}

  for (const [name, node] of sortedEntries) {
    sortedTree[name] = {
      ...node,
      children: sortTree(node.children), // Recursively sort children
    }
  }

  return sortedTree
}
