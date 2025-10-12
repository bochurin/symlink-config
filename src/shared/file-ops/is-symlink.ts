import * as vscode from 'vscode'

export async function isSymlink(uri: vscode.Uri): Promise<boolean> {
  try {
    const stats = await vscode.workspace.fs.stat(uri)
    return stats.type === vscode.FileType.SymbolicLink
  } catch {
    return true // Assume deleted files might have been symlinks
  }
}
