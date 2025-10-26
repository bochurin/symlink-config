import * as vscode from 'vscode'
import { Uri } from './types'

/**
 * Convert string path to Uri for file-ops functions
 */
export function toUri(path: string): Uri {
  return vscode.Uri.file(path)
}

/**
 * Convert workspace root and relative path to Uris
 */
export function toUris(workspaceRoot: string, relativePath: string): [Uri, Uri] {
  return [vscode.Uri.file(workspaceRoot), vscode.Uri.file(relativePath)]
}