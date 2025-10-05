import * as fs from 'fs'
import * as path from 'path'
import { SymlinkType, SymlinkMode } from './types'
import { isWindows, normalizeWindowsPath } from './utils'

/**
 * Cross-platform symlink creation
 * Based on CVHere create-symlink.sh logic with Windows batch file support
 */
export class SymlinkCreator {
  private batchCommands: string[] = []

  /**
   * Create symlink with cross-platform support
   */
  async createSymlink(
    target: string,
    source: string,
    type: SymlinkType,
    mode: SymlinkMode
  ): Promise<{ success: boolean; message: string }> {
    // Validate type
    if (type !== 'file' && type !== 'dir') {
      return { success: false, message: `Unknown symlink type: ${type}` }
    }

    // Clean mode - skip creation
    if (mode === 'clean') {
      return { success: true, message: `Clean mode: skipping creation for ${target}` }
    }

    // Check if target exists and is not a symlink
    if (fs.existsSync(target)) {
      const stats = fs.lstatSync(target)
      if (!stats.isSymbolicLink()) {
        return { success: false, message: `Target exists and is not a symlink: ${target}` }
      }
    }

    if (isWindows()) {
      return this.createWindowsSymlink(target, source, type, mode)
    } else {
      return this.createUnixSymlink(target, source, type, mode)
    }
  }

  /**
   * Create symlink on Unix-like systems (Linux, macOS)
   */
  private async createUnixSymlink(
    target: string,
    source: string,
    type: SymlinkType,
    mode: SymlinkMode
  ): Promise<{ success: boolean; message: string }> {
    if (mode === 'dry') {
      return {
        success: true,
        message: `DRY: Would create ${type} symlink: ${target} → ${source}`
      }
    }

    try {
      // Ensure parent directory exists
      const targetDir = path.dirname(target)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // Remove existing symlink if present
      if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) {
        fs.unlinkSync(target)
      }

      // Create symlink
      fs.symlinkSync(source, target, type === 'dir' ? 'dir' : 'file')

      return {
        success: true,
        message: `Created ${type} symlink: ${target} → ${source}`
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to create symlink: ${error}`
      }
    }
  }

  /**
   * Create symlink on Windows (generates batch commands)
   */
  private async createWindowsSymlink(
    target: string,
    source: string,
    type: SymlinkType,
    mode: SymlinkMode
  ): Promise<{ success: boolean; message: string }> {
    const targetWin = normalizeWindowsPath(target)
    const sourceWin = normalizeWindowsPath(source)
    const targetDir = path.dirname(target)

    // Generate batch commands
    const commands: string[] = []

    // Create parent directory if needed
    if (targetDir !== '.') {
      const targetDirWin = normalizeWindowsPath(targetDir)
      commands.push(`mkdir "${targetDirWin}" 2>nul`)
    }

    // Remove existing symlink
    if (type === 'dir') {
      commands.push(`rmdir "${targetWin}" 2>nul`)
      commands.push(`mklink /D "${targetWin}" "${sourceWin}"`)
    } else {
      commands.push(`del "${targetWin}" 2>nul`)
      commands.push(`mklink "${targetWin}" "${sourceWin}"`)
    }

    if (mode === 'dry') {
      return {
        success: true,
        message: `DRY: Would generate Windows commands:\\n${commands.join('\\n')}`
      }
    }

    // Store commands for batch file generation
    this.batchCommands.push(...commands, '')

    return {
      success: true,
      message: `Prepared Windows ${type} symlink commands for: ${target}`
    }
  }

  /**
   * Get accumulated batch commands for Windows
   */
  getBatchCommands(): string[] {
    return [...this.batchCommands]
  }

  /**
   * Clear batch commands
   */
  clearBatchCommands(): void {
    this.batchCommands = []
  }

  /**
   * Generate batch file with timestamp
   */
  generateBatchFile(mode: SymlinkMode, rootDir: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)
    const batchFileName = `process_symlinks_${mode}_${timestamp}.bat`
    const batchPath = path.join(rootDir, batchFileName)

    const header = [
      'REM =============================================',
      `REM Symlink Config Extension - ${mode} mode`,
      `REM Generated: ${new Date().toISOString()}`,
      'REM =============================================',
      ''
    ]

    const content = [...header, ...this.batchCommands].join('\\n')
    fs.writeFileSync(batchPath, content)

    return batchFileName
  }
}
