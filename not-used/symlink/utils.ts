import * as path from 'path'
import * as os from 'os'

/**
 * Resolve path with @-syntax support (CVHere convention)
 * @-prefix paths are relative to project root
 * Regular paths are relative to config directory
 */
export function resolvePath(configDir: string, rawPath: string): string {
  if (rawPath.startsWith('@')) {
    // @-prefix: relative to project root
    return rawPath.slice(1)
  }
  // Regular: relative to config directory
  return path.join(configDir, rawPath)
}

/**
 * Calculate relative path between directories
 */
export function relativePath(from: string, to: string): string {
  return path.relative(from, to)
}

/**
 * Check if directory name should be excluded
 */
export function shouldExclude(name: string, patterns: string[]): boolean {
  return patterns.some((pattern) => name === pattern)
}

/**
 * Normalize path for Windows batch files
 */
export function normalizeWindowsPath(inputPath: string): string {
  return inputPath.replace(/\//g, '\\')
}

/**
 * Detect if running on Windows
 */
export function isWindows(): boolean {
  return os.platform() === 'win32'
}

/**
 * Detect if running in Windows environment that needs batch files
 */
export function needsBatchFile(): boolean {
  const platform = os.platform()
  return (
    platform === 'win32' ||
    process.env.MSYSTEM !== undefined ||
    process.env.MINGW_PREFIX !== undefined
  )
}
