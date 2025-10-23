import * as os from 'os'
import { execSync } from 'child_process'

export async function isRunningAsAdmin(): Promise<boolean> {
  if (os.platform() === 'win32') {
    return isWindowsAdmin()
  } else {
    return isUnixAdmin()
  }
}

function isWindowsAdmin(): boolean {
  try {
    // Use 'net session' command which requires admin privileges
    execSync('net session', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function isUnixAdmin(): boolean {
  return process.getuid ? process.getuid() === 0 : false
}