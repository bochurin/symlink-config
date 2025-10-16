import * as path from 'path'

export function fullPath(rootPath: string, endPath: string): string {
  const fullPath = path.join(rootPath, endPath)
  return fullPath
}
