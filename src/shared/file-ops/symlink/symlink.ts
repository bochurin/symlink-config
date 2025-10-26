import * as fs from 'fs/promises'
import * as fsSync from 'fs'

export async function createSymlink(
  target: string,
  link: string,
  type?: 'file' | 'dir',
): Promise<void> {
  await fs.symlink(target, link, type)
}

export async function removeSymlink(path: string): Promise<void> {
  await fs.unlink(path)
}

export async function symlinkExists(path: string): Promise<boolean> {
  try {
    const stats = await fs.lstat(path)
    return stats.isSymbolicLink()
  } catch {
    return false
  }
}

export async function readSymlinkTarget(path: string): Promise<string> {
  return await fs.readlink(path)
}

// Sync version for compatibility with existing code
export function createSymlinkSync(
  target: string,
  link: string,
  type?: 'file' | 'dir',
): void {
  fsSync.symlinkSync(target, link, type)
}