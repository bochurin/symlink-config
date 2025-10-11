import { readFile } from '../../shared/file-ops'
import { parseGitignore } from '../../shared/gitignore-ops'
import { FILE_NAMES } from '../../shared/constants'

export async function read(): Promise<Record<string, { spacing: string; active: boolean }>> {
  try {
    const content = await readFile(FILE_NAMES.GITIGNORE)
    return parseGitignore(content)
  } catch {
    return {}
  }
}
