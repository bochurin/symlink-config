import * as path from 'path'
import { normalizePath } from './normalize-path'
import { toFsPath } from './to-fs-path'
import { Uri } from '../types'

export function fullPath(rootPath: Uri, endPath: Uri): string {
  const normalizedRootPath = normalizePath(toFsPath(rootPath))
  const fullPath = path.join(normalizedRootPath, toFsPath(endPath))
  return normalizePath(fullPath)
}
