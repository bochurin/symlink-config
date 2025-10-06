import { sectionStart, sectionEnd } from './constants'

import { readFile } from '../../shared/file-ops'

export function read(): string {
  try {
    const content = readFile('.gitignore')

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
