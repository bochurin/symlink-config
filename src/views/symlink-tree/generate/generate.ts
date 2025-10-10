import * as path from 'path'
// TODO: Remove unused import - state is imported but never used
import * as state from '../../../state'

import { SymlinkConfigEntry, TreeNode, treeBase } from '../types'

import * as nextConfigManager from '../../../managers/next-config-file'
import * as currentConfigManager from '../../../managers/current-config'

import { parseConfig } from './parse-config'
import { sortTree } from './sort-tree'

export function generateTree(treeBase: treeBase): Record<string, TreeNode> {
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
    // the last part of splited path is symlink
    const isSymlinkLeaf = i === pathParts.length - 1
    iconPath = path.posix.join(iconPath, pathPart)

    // TODO: Fix critical bug - using iconPath as key instead of pathPart
    if (!currentTree[pathPart]) {
      currentTree[pathPart] = {
        children: {},
        type: isSymlinkLeaf ? configEntry.type : 'dir',
        isSymlinkLeaf: isSymlinkLeaf,
        linkedPath:
          treeBase === 'sources' ? configEntry.target : configEntry.source,
        iconPath: isSymlinkLeaf ? configEntry.source : iconPath,
        configPath: isSymlinkLeaf ? configEntry.configPath : undefined,
        symlinkStatus: isSymlinkLeaf ? configEntry.symlinkStatus : 'unchanged',
      }
    }

    // TODO: Fix critical bug - using iconPath instead of pathPart for tree navigation
    currentTree = currentTree[pathPart].children
  }
}
