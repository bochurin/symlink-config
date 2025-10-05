import * as fs from 'fs'
import * as path from 'path'

import { sectionStart, sectionEnd } from './constants'

import * as state from '../../shared/state'

export function read(): string {
  try {
    const workspaceRoot = state.getWorkspaceRoot()
    const gitignorePath = path.join(workspaceRoot, '.gitignore')
    const content = fs.readFileSync(gitignorePath, 'utf8')

    const regex = new RegExp(
      `${sectionStart}\\n([\\s\\S]*?)\\n${sectionEnd}`,
      'g'
    )
    const match = regex.exec(content)

    return match ? match[1] : ''
  } catch {
    return ''
  }
}
