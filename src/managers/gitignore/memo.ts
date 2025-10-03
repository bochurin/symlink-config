import * as state from '../../state'
import { readFromFile } from './read-from-file'

export function memo() {
  const symlinkSection = readFromFile()
  state.setGitignoreSection(symlinkSection)
  console.log(`Memoized gitignore section`)
}
