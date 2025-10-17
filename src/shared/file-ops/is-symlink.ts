import * as vscode from 'vscode'

export async function isSymlink(pathOrUri: string | vscode.Uri): Promise<boolean> {
  try {
    const uri = typeof pathOrUri === 'string' ? vscode.Uri.file(pathOrUri) : pathOrUri
    const stats = await vscode.workspace.fs.stat(uri)
    return (stats.type & vscode.FileType.SymbolicLink) !== 0
  } catch {
    return true // Assume deleted files might have been symlinks
  }
}
