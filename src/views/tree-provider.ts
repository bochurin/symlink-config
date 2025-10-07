import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as nextConfigManager from '../managers/next-config'
import { getWorkspaceRoot } from '../state'

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
      const nextConfig = this.getNextConfig()
      const currentConfig = this.getCurrentConfig()
      
      if (!nextConfig && !currentConfig) {
        return [new SymlinkTreeItem('No symlinks configured')]
      }
      
      const tree = this.buildDiffTree(nextConfig, currentConfig)
      return this.treeToItems(tree)
    } catch {
      return [new SymlinkTreeItem('No symlinks configured')]
    }
  }

  private getNextConfig(): any {
    try {
      const content = nextConfigManager.read()
      return content ? JSON.parse(content) : null
    } catch {
      return null
    }
  }

  private getCurrentConfig(): any {
    try {
      const workspaceRoot = getWorkspaceRoot()
      const currentPath = path.join(workspaceRoot, 'current-symlink.config.json')
      const content = require('fs').readFileSync(currentPath, 'utf8')
      return JSON.parse(content)
    } catch {
      return null
    }
  }

  private buildDiffTree(nextConfig: any, currentConfig: any): any {
    const tree: any = {}
    
    const addToTree = (path: string, other: string, isDir: boolean, targetPath: string, status: 'new' | 'deleted' | 'unchanged') => {
      const parts = path.replace('@', '').split('/')
      let current = tree
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (!current[part]) {
          current[part] = {
            children: {},
            isLeaf: i === parts.length - 1,
            other: i === parts.length - 1 ? other.replace('@', '') : undefined,
            isDir: i === parts.length - 1 ? isDir : true,
            targetPath: i === parts.length - 1 ? targetPath : undefined,
            status: i === parts.length - 1 ? status : 'unchanged'
          }
        }
        current = current[part].children
      }
    }

    // Get all entries from both configs
    const nextEntries = this.getAllEntries(nextConfig)
    const currentEntries = this.getAllEntries(currentConfig)
    
    // Create lookup for exact matches
    const currentLookup = new Set(currentEntries.map(e => `${e.target}:${e.source}`))
    
    // Add next config entries (new or unchanged)
    for (const entry of nextEntries) {
      const key = `${entry.target}:${entry.source}`
      const status = currentLookup.has(key) ? 'unchanged' : 'new'
      
      if (this.viewMode === 'targets') {
        addToTree(entry.target, entry.source, entry.isDir, entry.targetPath || '', status)
      } else {
        addToTree(entry.source, entry.target, entry.isDir, entry.targetPath || '', status)
      }
    }
    
    // Add deleted entries (in current but not in next)
    const nextLookup = new Set(nextEntries.map(e => `${e.target}:${e.source}`))
    for (const entry of currentEntries) {
      const key = `${entry.target}:${entry.source}`
      if (!nextLookup.has(key)) {
        if (this.viewMode === 'targets') {
          addToTree(entry.target, entry.source, entry.isDir, entry.targetPath || '', 'deleted')
        } else {
          addToTree(entry.source, entry.target, entry.isDir, entry.targetPath || '', 'deleted')
        }
      }
    }

    return tree
  }
  
  private getAllEntries(config: any): any[] {
    if (!config) return []
    
    const entries: any[] = []
    
    if (config.directories) {
      entries.push(...config.directories.map((e: any) => ({ ...e, isDir: true })))
    }
    
    if (config.files) {
      entries.push(...config.files.map((e: any) => ({ ...e, isDir: false })))
    }
    
    return entries
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
        hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        (node as any).targetPath,
        (node as any).status
      )
      
      // Apply styling based on status
      if ((node as any).status === 'new') {
        item.description = '(new)'
        item.tooltip = 'New symlink in next configuration'
      } else if ((node as any).status === 'deleted') {
        item.description = '(deleted)'
        item.tooltip = 'Will be removed when configuration is applied'
      }
      
      if (hasChildren) {
        item.children = this.treeToItems((node as any).children, prefix + name + '/')
      }
      
      items.push(item)
    }
    
    // Sort items: 1) by name, 2) by operation (deleted before new)
    return items.sort((a, b) => {
      // Extract name from label (remove emoji and arrows)
      const getName = (label: string) => {
        const match = label.match(/[📁📄🔗]+\s*(.+?)\s*→/) || label.match(/[📂]+\s*(.+)$/)
        return match ? match[1].trim() : label
      }
      
      const nameA = getName(a.label || '')
      const nameB = getName(b.label || '')
      
      // First sort by name
      const nameCompare = nameA.localeCompare(nameB)
      if (nameCompare !== 0) return nameCompare
      
      // Then by operation: deleted (0) before new (2), unchanged (1) in between
      const statusOrder = { 'deleted': 0, 'unchanged': 1, 'new': 2 }
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 1
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 1
      return aOrder - bOrder
    })
  }
}

class SymlinkTreeItem extends vscode.TreeItem {
  public children?: SymlinkTreeItem[]
  public targetPath?: string
  public status?: string
  
  constructor(
    public readonly label: string,
    commandId?: string,
    collapsibleState?: vscode.TreeItemCollapsibleState,
    targetPath?: string,
    status?: string
  ) {
    super(label, collapsibleState || vscode.TreeItemCollapsibleState.None)
    this.targetPath = targetPath
    this.status = status
    
    // Apply color styling
    if (status === 'new') {
      this.iconPath = new vscode.ThemeIcon('add', new vscode.ThemeColor('gitDecoration.addedResourceForeground'))
    } else if (status === 'deleted') {
      this.iconPath = new vscode.ThemeIcon('remove', new vscode.ThemeColor('gitDecoration.deletedResourceForeground'))
    }
    
    if (commandId) {
      this.command = {
        command: commandId,
        title: label
      }
    }
  }
}