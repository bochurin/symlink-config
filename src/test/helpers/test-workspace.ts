import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/**
 * Test workspace utilities for creating temporary test environments
 */

export class TestWorkspace {
  private tempDir: string
  
  constructor() {
    this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'symlink-config-test-'))
  }
  
  get root(): string {
    return this.tempDir
  }
  
  /**
   * Create a file with content
   */
  createFile(relativePath: string, content: string): string {
    const fullPath = path.join(this.tempDir, relativePath)
    const dir = path.dirname(fullPath)
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(fullPath, content, 'utf8')
    return fullPath
  }
  
  /**
   * Create a directory
   */
  createDir(relativePath: string): string {
    const fullPath = path.join(this.tempDir, relativePath)
    fs.mkdirSync(fullPath, { recursive: true })
    return fullPath
  }
  
  /**
   * Create a symlink-config.json file
   */
  createConfig(relativePath: string, config: any): string {
    return this.createFile(relativePath, JSON.stringify(config, null, 2))
  }
  
  /**
   * Read file content
   */
  readFile(relativePath: string): string {
    return fs.readFileSync(path.join(this.tempDir, relativePath), 'utf8')
  }
  
  /**
   * Check if file exists
   */
  exists(relativePath: string): boolean {
    return fs.existsSync(path.join(this.tempDir, relativePath))
  }
  
  /**
   * Clean up test workspace
   */
  cleanup(): void {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true })
    }
  }
}