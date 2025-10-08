import * as path from 'path'

import { ElementType, SymlinkStatus, TreeNode, ViewMode } from '../types'

import * as nextConfigManager from '../../../managers/next-config'
import * as currentConfigManager from '../../../managers/current-config'

import { configToEntries } from './config-to-entries'
import { sortTree } from './sort-tree'

export function generateTree(viewMode: ViewMode): Record<string, TreeNode> {
  const nextEntries = configToEntries(nextConfigManager.read())
  const currentEntries = configToEntries(currentConfigManager.read())

  const relationships = new Map()

  for (const entry of currentEntries) {
    const key = `${entry.target}:${entry.source}`
    relationships.set(key, { ...entry, status: 'deleted' })
  }

  for (const entry of nextEntries) {
    const key = `${entry.target}:${entry.source}`
    if (relationships.has(key)) {
      relationships.set(key, { ...entry, status: 'unchanged' })
    } else {
      relationships.set(key, { ...entry, status: 'new' })
    }
  }

  const tree: Record<string, TreeNode> = {}

  for (const relationship of relationships.values()) {
    const displayPath =
      viewMode === 'targets' ? relationship.target : relationship.source
    const otherPath =
      viewMode === 'targets' ? relationship.source : relationship.target

    addToTree(tree, displayPath, otherPath, relationship)
  }

  const sortedTree = sortTree(tree)

  return sortedTree
}

function addToTree(
  tree: Record<string, TreeNode>,
  displayPath: string,
  otherPath: string,
  relationship: any
): void {
  const pathParts = processPath(displayPath)
  let currentTree: Record<string, TreeNode> = tree

  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i]
    const isLeaf = i === pathParts.length - 1

    if (!currentTree[pathPart]) {
      currentTree[pathPart] = createNode(isLeaf, relationship, otherPath)
    }

    currentTree = currentTree[pathPart].children
  }
}

function createNode(
  isLeaf: boolean,
  relationship: any,
  otherPath: string
): TreeNode {
  return {
    children: {},
    isLeaf,
    other: isLeaf ? otherPath : undefined,
    type: (isLeaf ? relationship.type : 'dir') as ElementType,
    configPath: isLeaf ? relationship.configPath : undefined,
    status: (isLeaf ? relationship.status : 'unchanged') as SymlinkStatus
  }
}

function processPath(inputPath: string): string[] {
  return path.posix.normalize(inputPath).split('/')
}
