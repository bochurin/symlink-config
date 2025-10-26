import * as fs from 'fs/promises'
import * as vscode from 'vscode'
import { fullPath } from '../path/full-path'
import { normalizePath } from '../path/normalize-path'
import { toFsPath } from '../path/to-fs-path'

export async function writeFile(
  rootPath: string | vscode.Uri,
  file: string | vscode.Uri,
  content: string,
  mode?: number,
) {
  const normalizedRootPath = normalizePath(toFsPath(rootPath))
  const filePath = fullPath(normalizedRootPath, toFsPath(file))

  try {
    await fs.writeFile(filePath, content, { encoding: 'utf8', mode })
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
