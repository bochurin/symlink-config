import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { getWorkspaceRoot } from '../state'
import { info } from '../shared/vscode/info'
import { warning } from '../shared/vscode/warning'
import { generateTree } from '../views/symlink-tree/generate'
import { TreeNode } from '../views/symlink-tree/types'
import { FILE_NAMES } from '../shared/constants'
import * as nextConfigManager from '../managers/next-config-file'

export async function applyConfiguration() {
  const workspaceRoot = getWorkspaceRoot()

  try {
    // Generate tree to get symlink operations
    const tree = generateTree('targets')
    const operations = collectSymlinkOperations(tree)

    if (operations.length === 0) {
      info('No symlink operations needed')
      return
    }

    const isWindows = os.platform() === 'win32'

    if (isWindows) {
      await generateWindowsScript(operations, workspaceRoot)
    } else {
      await executeUnixOperations(operations, workspaceRoot)

      // Update current config to match next config (Unix only)
      const nextContent = nextConfigManager.read()
      await fs.writeFile(
        path.join(workspaceRoot, FILE_NAMES.CURRENT_SYMLINK_CONFIG),
        nextContent,
      )

      info('Configuration applied successfully')
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to apply configuration: ${error}`)
  }
}

interface SymlinkOperation {
  type: 'create' | 'delete'
  target: string
  source?: string
  isDirectory: boolean
}

function collectSymlinkOperations(
  tree: Record<string, TreeNode>,
): SymlinkOperation[] {
  const operations: SymlinkOperation[] = []

  function traverse(node: Record<string, TreeNode>, currentPath: string = '') {
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

  // Sort operations: deletions first, then creations
  return operations.sort((a, b) => {
    if (a.type === 'delete' && b.type === 'create') return -1
    if (a.type === 'create' && b.type === 'delete') return 1
    return 0
  })
}

async function generateWindowsScript(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  const scriptPath = path.join(workspaceRoot, FILE_NAMES.APPLY_SYMLINKS_BAT)

  const lines = [
    '@echo off',
    'echo Applying symlink configuration...',
    ''
  ]

  for (const op of operations) {
    const targetPath = path.join(workspaceRoot, op.target)
    const targetDir = path.dirname(targetPath)

    if (op.type === 'delete') {
      lines.push(`if exist "${targetPath}" (`)
      lines.push(`  echo Removing ${op.target}`)
      lines.push(`  rmdir "${targetPath}" 2>nul || del "${targetPath}" 2>nul`)
      lines.push(')')
    } else if (op.type === 'create' && op.source) {
      const sourcePath = op.source.startsWith('@')
        ? path.join(workspaceRoot, op.source.slice(1))
        : path.join(workspaceRoot, op.source)

      // Create target directory if it doesn't exist
      lines.push(`if not exist "${targetDir}" (`)
      lines.push(`  echo Creating directory ${targetDir}`)
      lines.push(`  mkdir "${targetDir}"`)
      lines.push(')')
      
      // Check if source exists before creating symlink
      lines.push(`if exist "${sourcePath}" (`)
      const linkType = op.isDirectory ? '/D' : ''
      lines.push(`  echo Creating ${op.target} -> ${op.source}`)
      lines.push(`  mklink ${linkType} "${targetPath}" "${sourcePath}"`)
      lines.push(') else (')
      lines.push(`  echo ERROR: Source not found: ${sourcePath}`)
      lines.push(')')
    }
  }

  // Copy next config to current config
  const nextConfigPath = path.join(workspaceRoot, FILE_NAMES.NEXT_SYMLINK_CONFIG)
  const currentConfigPath = path.join(workspaceRoot, FILE_NAMES.CURRENT_SYMLINK_CONFIG)
  lines.push('')
  lines.push('echo Updating configuration...')
  lines.push(`copy "${nextConfigPath}" "${currentConfigPath}" >nul`)

  lines.push('')
  lines.push('echo Done!')

  const content = lines.join('\r\n')
  await fs.writeFile(scriptPath, content, { encoding: 'utf8' })

  // Copy script name to clipboard
  await vscode.env.clipboard.writeText(path.basename(scriptPath))

  // Show Windows instructions
  warning(`Run as Administrator: ${path.basename(scriptPath)} (copied to clipboard)`)

  // Show options to user
  const choice = await vscode.window.showInformationMessage(
    `Windows script generated: ${path.basename(scriptPath)}`,
    { modal: true },
    'Open in Code',
    'Run as Admin'
  )

  if (choice === 'Open in Code') {
    const document = await vscode.workspace.openTextDocument(scriptPath)
    await vscode.window.showTextDocument(document)
  } else if (choice === 'Run as Admin') {
    // Create PowerShell command to run as admin
    const psCommand = `powershell -Command "Start-Process cmd -ArgumentList '/k \"${scriptPath}\"' -Verb RunAs"`
    
    // Write to temp batch file and execute
    const tempBat = path.join(workspaceRoot, FILE_NAMES.RUN_ADMIN_BAT)
    await fs.writeFile(tempBat, psCommand)
    
    vscode.env.openExternal(vscode.Uri.file(tempBat))
  }
}

async function executeUnixOperations(
  operations: SymlinkOperation[],
  workspaceRoot: string,
) {
  for (const op of operations) {
    const targetPath = path.join(workspaceRoot, op.target)

    try {
      if (op.type === 'delete') {
        await fs.unlink(targetPath)
        info(`Removed: ${op.target}`)
      } else if (op.type === 'create' && op.source) {
        // Create target directory if it doesn't exist
        const targetDir = path.dirname(targetPath)
        await fs.mkdir(targetDir, { recursive: true })

        const sourcePath = op.source.startsWith('@')
          ? path.join(workspaceRoot, op.source.slice(1))
          : path.join(workspaceRoot, op.source)

        await fs.symlink(
          sourcePath,
          targetPath,
          op.isDirectory ? 'dir' : 'file',
        )
        info(`Created: ${op.target} -> ${op.source}`)
      }
    } catch (error) {
      vscode.window.showWarningMessage(
        `Failed to ${op.type} ${op.target}: ${error}`,
      )
    }
  }
}
