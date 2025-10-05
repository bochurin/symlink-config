import * as fs from 'fs'
import * as path from 'path'

/**
 * Add entry to .gitignore with SymLinks block support
 * Based on CVHere append-to-gitignore.sh logic
 */
export function appendToGitignore(
  target: string,
  gitignoreDir: string,
  blockName?: string
): boolean {
  const gitignorePath = path.join(gitignoreDir, '.gitignore')

  // Ensure .gitignore exists
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '')
  }

  const content = fs.readFileSync(gitignorePath, 'utf8')
  const lines = content.split('\n')

  // If target already exists, return false (no change)
  if (lines.some((line) => line.trim() === target)) {
    return false
  }

  if (blockName) {
    const beginMarker = `# ${blockName}`
    const endMarker = `# End ${blockName}`

    const beginIndex = lines.findIndex((line) => line.trim() === beginMarker)
    const endIndex = lines.findIndex((line) => line.trim() === endMarker)

    if (beginIndex !== -1 && endIndex !== -1) {
      // Insert into existing block (before End marker)
      lines.splice(endIndex, 0, target)
      fs.writeFileSync(gitignorePath, lines.join('\n'))
    } else {
      // Create new block
      const newBlock = `\\n${beginMarker}\\n${target}\\n${endMarker}\\n`
      fs.appendFileSync(gitignorePath, newBlock)
    }
  } else {
    // Append without block
    fs.appendFileSync(gitignorePath, `\\n${target}\\n`)
  }

  return true
}

/**
 * Extract symlinks from .gitignore SymLinks block
 * Based on CVHere remove-old-symlinks.sh logic
 */
export function getSymlinksFromGitignore(gitignoreDir: string): string[] {
  const gitignorePath = path.join(gitignoreDir, '.gitignore')

  if (!fs.existsSync(gitignorePath)) {
    return []
  }

  const content = fs.readFileSync(gitignorePath, 'utf8')
  const lines = content.split('\\n')
  const symlinks: string[] = []

  let inSymlinksBlock = false

  for (const line of lines) {
    // Remove trailing whitespace and carriage returns (Windows compatibility)
    const trimmed = line.replace(/\\s*$/, '')

    if (trimmed === '# SymLinks') {
      inSymlinksBlock = true
      continue
    }

    if (trimmed === '# End SymLinks') {
      inSymlinksBlock = false
      continue
    }

    if (inSymlinksBlock && trimmed && !trimmed.startsWith('#')) {
      symlinks.push(trimmed)
    }
  }

  return symlinks
}

/**
 * Clear SymLinks block from .gitignore (if needed)
 */
export function clearGitignoreBlock(gitignoreDir: string, blockName: string): boolean {
  const gitignorePath = path.join(gitignoreDir, '.gitignore')

  if (!fs.existsSync(gitignorePath)) {
    return false
  }

  const content = fs.readFileSync(gitignorePath, 'utf8')
  const lines = content.split('\\n')

  const beginMarker = `# ${blockName}`
  const endMarker = `# End ${blockName}`

  const beginIndex = lines.findIndex((line) => line.trim() === beginMarker)
  const endIndex = lines.findIndex((line) => line.trim() === endMarker)

  if (beginIndex !== -1 && endIndex !== -1) {
    // Remove block (including markers)
    lines.splice(beginIndex, endIndex - beginIndex + 1)
    fs.writeFileSync(gitignorePath, lines.join('\\n'))
    return true
  }

  return false
}
