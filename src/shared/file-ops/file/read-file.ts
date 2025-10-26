import * as fs from 'fs'
import * as vscode from 'vscode'
import { fullPath } from '../path/full-path'
import { normalizePath } from '../path/normalize-path'
import { toFsPath } from '../path/to-fs-path'

export function readFile(rootPath: string | vscode.Uri, file: string | vscode.Uri): string {
  const normalizedRootPath = normalizePath(toFsPath(rootPath))
  const filePath = fullPath(normalizedRootPath, toFsPath(file))

  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}
