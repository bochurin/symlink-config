import * as path from 'path'
import { SymlinkConfigEntry, TreeNode, treeBase } from '../types'
import * as nextConfigManager from '@managers/next-config-file'

import { parseConfig } from './parse-config'
import { sortTree } from './sort-tree'
import { useCurrentSymlinkConfigManager } from '@/src/managers'

export function generateTree(treeBase: treeBase): Record<string, TreeNode> {
  const currentConfigManager = useCurrentSymlinkConfigManager()

  // Read next and current configs and parse them to arrays of symlink configs
  const nextConfigs = parseConfig(nextConfigManager.read())
  const currentConfigs = parseConfig(currentConfigManager.read())

  const configRelationships = new Map<string, SymlinkConfigEntry>()

  for (const config of currentConfigs) {
    const key = `${config.target}:${config.source}`
    configRelationships.set(key, { ...config, symlinkStatus: 'deleted' })
  }

  for (const config of nextConfigs) {
    const key = `${config.target}:${config.source}`
    if (configRelationships.has(key)) {
      configRelationships.set(key, { ...config, symlinkStatus: 'unchanged' })
    } else {
      configRelationships.set(key, { ...config, symlinkStatus: 'new' })
    }
  }

  const tree: Record<string, TreeNode> = {}

  for (const configEntry of configRelationships.values()) {
    addToTree(tree, treeBase, configEntry)
  }

  const sortedTree = sortTree(tree)

  return sortedTree
}

function addToTree(
  tree: Record<string, TreeNode>,
  treeBase: treeBase,
  configEntry: SymlinkConfigEntry,
): void {
  const pathParts = (
    treeBase === 'targets' ? configEntry.target : configEntry.source
  ).split('/')

  let currentTree: Record<string, TreeNode> = tree
  let iconPath = '.'
  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i]
    const isSymlinkLeaf = i === pathParts.length - 1
    iconPath = path.posix.join(iconPath, pathPart)

    let key = pathPart
    // For source tree base, make unique keys for leaves to handle multiple targets per source
    if (isSymlinkLeaf && treeBase === 'sources') {
      let counter = 1
      const baseKey = pathPart
      while (currentTree[key]) {
        key = `${baseKey}#${counter}`
        counter++
      }
    }

    if (!currentTree[key]) {
      currentTree[key] = {
        children: {},
        type: isSymlinkLeaf ? configEntry.type : 'dir',
        isSymlinkLeaf: isSymlinkLeaf,
        linkedPath:
          treeBase === 'sources' ? configEntry.target : configEntry.source,
        iconPath: isSymlinkLeaf ? configEntry.source : iconPath,
        configPath: isSymlinkLeaf ? configEntry.configPath : undefined,
        symlinkStatus: isSymlinkLeaf ? configEntry.symlinkStatus : 'unchanged',
        displayName: pathPart, // Store original name without suffix
      }
    }

    currentTree = currentTree[key].children
  }
}
