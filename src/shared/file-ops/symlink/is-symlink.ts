import * as vscode from 'vscode'
import * as fs from 'fs'
import * as os from 'os'

export async function isSymlink(pathOrUri: string | vscode.Uri): Promise<boolean> {
  try {
    const uri = typeof pathOrUri === 'string' ? vscode.Uri.file(pathOrUri) : pathOrUri
    const stats = await vscode.workspace.fs.stat(uri)
    
    if ((stats.type & vscode.FileType.SymbolicLink) === 0) {
      return false // Not a symlink at all
    }
    
    // On Windows, check if it's a junction (exclude junctions)
    if (os.platform() === 'win32') {
      return !isJunction(uri.fsPath)
    }
    
    return true // Unix symlinks are always real symlinks
  } catch {
    return true // Assume deleted files might have been symlinks
  }
}

function isJunction(path: string): boolean {
  try {
    const stats = fs.lstatSync(path)
    if (!stats.isSymbolicLink()) return false
    
    // Read the symlink target
    const target = fs.readlinkSync(path)
    
    // Junctions typically have absolute paths and specific format
    if (target.startsWith('\\\\?\\')) return true
    
    // Check if it's a Windows drive path and is a directory
    if (target.match(/^[A-Za-z]:/)) {
      const isDirectory = stats.isDirectory()
      return isDirectory === true
    }
    
    return false
  } catch {
    return false
  }
}
