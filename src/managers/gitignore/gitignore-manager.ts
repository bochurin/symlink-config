import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

const sectionStart = '# Begin Symlink.Config'
const sectionEnd = '# End Symlink.Config'
let workspaceRoot: string
let lastWrittenContent: string | undefined
let isUpdating = false

function init(root: string) {
  workspaceRoot = root
}

  function updateBasedOnConfiguration() {
    if (isUpdating) return
    isUpdating = true
    
    try {
      console.log('GitignoreManager: updateBasedOnConfiguration called')
      
      // Check if this is our own change
      const gitignorePath = path.join(workspaceRoot, '.gitignore')
      if (fs.existsSync(gitignorePath)) {
        const currentContent = fs.readFileSync(gitignorePath, 'utf8')
        if (currentContent === lastWrittenContent) {
          console.log('GitignoreManager: Ignoring our own change')
          return
        }
      }
    
    const gitExists = fs.existsSync(path.join(workspaceRoot, '.git'))
    const nextConfigExists = fs.existsSync(path.join(workspaceRoot, 'next.symlink.config.json'))
    
    console.log(`Git exists: ${gitExists}, Next config exists: ${nextConfigExists}`)
    
    if (gitExists) {
      // Git exists - section AND .gitignore must always exist
      const gitignoreCreated = ensureGitignoreExists()
      const sectionCreated = ensureSectionExists()
      
      if (nextConfigExists) {
        // Add next config to section
        addEntryToSection('next.symlink.config.json')
      } else {
        // Remove next config from section (keep other entries)
        removeEntryFromSection('next.symlink.config.json')
      }
    } else {
      // No git - remove section completely (but keep .gitignore file)
      removeSymlinkEntries()
    }
    } finally {
      isUpdating = false
    }
  }

  function ensureGitignoreExists(): boolean {
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, '', 'utf8')
      vscode.window.showInformationMessage(
        'Symlink Config: Created missing .gitignore file for git repository.',
        'OK'
      )
      console.log('Created .gitignore file')
      return true
    }
    return false
  }

  function ensureSectionExists(): boolean {
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    const content = fs.readFileSync(gitignorePath, 'utf8')
    const currentEntries = getCurrentSectionEntries(content)
    
    // Check if section exists using regex
    const sectionRegex = new RegExp(`^\s*${sectionStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*$[\s\S]*?^\s*${sectionEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*$`, 'm')
    const isValidSection = sectionRegex.test(content)
    
    console.log(`Section validation: isValid=${isValidSection}`)
    console.log(`Looking for section between '${sectionStart}' and '${sectionEnd}'`)
    
    if (!isValidSection) {
      if (content.includes(sectionStart) || content.includes(sectionEnd)) {
        // Section is damaged (partial markers found)
        vscode.window.showWarningMessage(
          'Symlink Config: Detected damaged section in .gitignore. Repairing...',
          'OK'
        )
      }
      
      const section = createSection(currentEntries)
      const cleanContent = removeSection(content)
      const newContent = cleanContent + (cleanContent && !cleanContent.endsWith('\n') ? '\n' : '') + 
                       (cleanContent ? '\n' : '') + section + '\n'
      fs.writeFileSync(gitignorePath, newContent, 'utf8')
      lastWrittenContent = newContent
      console.log('Created/repaired Symlink.Config section in .gitignore')
      return true
    }
    return false
  }

  function addSymlinkEntries(entries: string[]) {
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    
    try {
      let content = ''
      if (fs.existsSync(gitignorePath)) {
        content = fs.readFileSync(gitignorePath, 'utf8')
      }

      content = removeSection(content)

      if (entries.length > 0) {
        const section = createSection(entries)
        content = content + (content && !content.endsWith('\n') ? '\n' : '') + 
                 (content ? '\n' : '') + section + '\n'
      }

      fs.writeFileSync(gitignorePath, content, 'utf8')
      lastWrittenContent = content
      console.log(`Updated gitignore with ${entries.length} symlink entries`)
    } catch (error) {
      console.error('Failed to update gitignore:', error)
    }
  }

  function removeSymlinkEntries() {
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    
    try {
      if (fs.existsSync(gitignorePath)) {
        let content = fs.readFileSync(gitignorePath, 'utf8')
        content = removeSection(content)
        fs.writeFileSync(gitignorePath, content, 'utf8')
        lastWrittenContent = content
        console.log('Removed symlink entries from gitignore')
      }
    } catch (error) {
      console.error('Failed to remove symlink entries from gitignore:', error)
    }
  }

  function removeSection(content: string): string {
    const sectionRegex = new RegExp(`\n*\s*${sectionStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*\n[\s\S]*?\n\s*${sectionEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*\n*`, 'g')
    return content.replace(sectionRegex, '').replace(/\n{3,}/g, '\n\n')
  }

  function createSection(entries: string[]): string {
    const lines = [sectionStart]
    entries.forEach(entry => lines.push(entry))
    lines.push(sectionEnd)
    return lines.join('\n')
  }

  function addEntryToSection(entry: string) {
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    
    try {
      let content = fs.readFileSync(gitignorePath, 'utf8')
      const currentEntries = getCurrentSectionEntries(content)
      
      if (!currentEntries.includes(entry)) {
        currentEntries.push(entry)
        content = removeSection(content)
        
        if (currentEntries.length > 0) {
          const section = createSection(currentEntries)
          content = content + (content && !content.endsWith('\n') ? '\n' : '') + 
                   (content ? '\n' : '') + section + '\n'
        }
        
        fs.writeFileSync(gitignorePath, content, 'utf8')
        lastWrittenContent = content
        console.log(`Added ${entry} to gitignore section`)
      }
    } catch (error) {
      console.error('Failed to add entry to gitignore:', error)
    }
  }

  function removeEntryFromSection(entry: string) {
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    
    try {
      if (fs.existsSync(gitignorePath)) {
        let content = fs.readFileSync(gitignorePath, 'utf8')
        const currentEntries = getCurrentSectionEntries(content)
        const filteredEntries = currentEntries.filter(e => e !== entry)
        
        content = removeSection(content)
        
        if (filteredEntries.length > 0) {
          const section = createSection(filteredEntries)
          content = content + (content && !content.endsWith('\n') ? '\n' : '') + 
                   (content ? '\n' : '') + section + '\n'
        }
        
        fs.writeFileSync(gitignorePath, content, 'utf8')
        lastWrittenContent = content
        console.log(`Removed ${entry} from gitignore section`)
      }
    } catch (error) {
      console.error('Failed to remove entry from gitignore:', error)
    }
  }

  function getCurrentSectionEntries(content: string): string[] {
    const sectionRegex = new RegExp(`${sectionStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\s*\n([\s\S]*?)\n\s*${sectionEnd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm')
    const match = content.match(sectionRegex)
    
    if (match && match[1]) {
      return match[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
    }
    
    return []
  }

export const gitignoreManager = {
  init,
  updateBasedOnConfiguration
}