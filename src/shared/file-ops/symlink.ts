import * as fs from 'fs'

export async function createSymlink(
  target: string,
  link: string,
  type?: 'file' | 'dir',
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.symlink(target, link, type, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function removeSymlink(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function symlinkExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.lstat(path, (err, stats) => {
      if (err) resolve(false)
      else resolve(stats.isSymbolicLink())
    })
  })
}

export async function readSymlinkTarget(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readlink(path, (err, target) => {
      if (err) reject(err)
      else resolve(target)
    })
  })
}