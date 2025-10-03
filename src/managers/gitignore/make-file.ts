import * as fs from 'fs'
import * as path from 'path'
import * as state from '../../state'
import { sectionStart, sectionEnd } from './constants'
import { buildSection } from './build-section'

export function makeFile() {
  const builtSection = buildSection()
  const workspaceRoot = state.getWorkspaceRoot()
  const gitignorePath = path.join(workspaceRoot, '.gitignore')

  let currentFileContent = ''
  try {
    currentFileContent = fs.readFileSync(gitignorePath, 'utf8')
  } catch {
    // File doesn't exist, will create new
  }

  const regex = new RegExp(
    `(${sectionStart}\\n)[\\s\\S]*?(\\n${sectionEnd})`,
    'g'
  )
  let newFileContent = currentFileContent.replace(regex, `$1${builtSection}$2`)

  if (newFileContent === currentFileContent && builtSection) {
    // No replacement made, add to end
    const fullSection = `${sectionStart}\n${builtSection}\n${sectionEnd}`
    newFileContent = currentFileContent
      ? `${currentFileContent}\n\n${fullSection}`
      : fullSection
  }

  try {
    fs.writeFileSync(gitignorePath, newFileContent, 'utf8')
  } catch (error) {
    console.error('Failed to update gitignore:', error)
  }
}
