import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import * as vscode from 'vscode'
import { fullPath } from '../path/full-path'
import { normalizePath } from '../path/normalize-path'
import { toFsPath } from '../path/to-fs-path'

export function directoryExists(
  rootPath: string | vscode.Uri,
  relativePath: string | vscode.Uri,
): boolean {
  try {
    const normalizedRootPath = normalizePath(toFsPath(rootPath))
    const dirPath = fullPath(normalizedRootPath, toFsPath(relativePath))
    const stats = fs.statSync(dirPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

export async function createDirectory(
  rootPath: string | vscode.Uri,
  relativePath: string | vscode.Uri,
  options?: { recursive?: boolean },
): Promise<void> {
  const normalizedRootPath = normalizePath(toFsPath(rootPath))
  const dirPath = fullPath(normalizedRootPath, toFsPath(relativePath))
  await fsPromises.mkdir(dirPath, options)
}

export async function removeDirectory(
  rootPath: string | vscode.Uri,
  relativePath: string | vscode.Uri,
): Promise<void> {
  const normalizedRootPath = normalizePath(toFsPath(rootPath))
  const dirPath = fullPath(normalizedRootPath, toFsPath(relativePath))
  await fsPromises.rmdir(dirPath)
}