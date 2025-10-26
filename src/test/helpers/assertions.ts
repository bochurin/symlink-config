import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Custom assertions for symlink-config testing
 */

export function assertFileExists(filePath: string, message?: string): void {
  assert.ok(
    fs.existsSync(filePath),
    message || `File should exist: ${filePath}`
  )
}

export function assertFileNotExists(filePath: string, message?: string): void {
  assert.ok(
    !fs.existsSync(filePath),
    message || `File should not exist: ${filePath}`
  )
}

export function assertFileContent(filePath: string, expectedContent: string, message?: string): void {
  assertFileExists(filePath)
  const actualContent = fs.readFileSync(filePath, 'utf8')
  assert.strictEqual(
    actualContent,
    expectedContent,
    message || `File content mismatch: ${filePath}`
  )
}

export function assertIsSymlink(filePath: string, message?: string): void {
  assertFileExists(filePath)
  const stats = fs.lstatSync(filePath)
  assert.ok(
    stats.isSymbolicLink(),
    message || `Should be a symlink: ${filePath}`
  )
}

export function assertSymlinkTarget(symlinkPath: string, expectedTarget: string, message?: string): void {
  assertIsSymlink(symlinkPath)
  const actualTarget = fs.readlinkSync(symlinkPath)
  assert.strictEqual(
    path.resolve(path.dirname(symlinkPath), actualTarget),
    path.resolve(expectedTarget),
    message || `Symlink target mismatch: ${symlinkPath}`
  )
}

export function assertGitignoreContains(gitignorePath: string, pattern: string, message?: string): void {
  assertFileExists(gitignorePath)
  const content = fs.readFileSync(gitignorePath, 'utf8')
  assert.ok(
    content.includes(pattern),
    message || `Gitignore should contain pattern: ${pattern}`
  )
}

export function assertConfigValid(configPath: string, message?: string): void {
  assertFileExists(configPath)
  try {
    const content = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(content)
    
    // Basic structure validation
    assert.ok(
      config && typeof config === 'object',
      'Config should be an object'
    )
    
    if (config.files) {
      assert.ok(Array.isArray(config.files), 'files should be an array')
    }
    
    if (config.directories) {
      assert.ok(Array.isArray(config.directories), 'directories should be an array')
    }
    
  } catch (error) {
    assert.fail(message || `Invalid config file: ${configPath} - ${error}`)
  }
}