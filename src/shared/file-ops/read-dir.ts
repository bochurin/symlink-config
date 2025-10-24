import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { normalizePath } from './normalize-path'
import { toFsPath } from './to-fs-path'

export function readDir(rootPath: string | vscode.Uri, relativePath: string | vscode.Uri): fs.Dirent[] {
  try {
    const normalizedRootPath = normalizePath(toFsPath(rootPath))
    const fullPath = path.join(normalizedRootPath, toFsPath(relativePath))
    return fs.readdirSync(fullPath, { withFileTypes: true })
  } catch {
    return []
  }
}
