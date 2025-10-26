import { Uri } from '../types'

export function toFsPath(uri: Uri): string {
  return uri.fsPath
}
