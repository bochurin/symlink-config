import { readFile } from '../../shared/file-ops'
import { parseGitignore } from '../../shared/gitignore-ops'

export async function read(): Promise<Record<string, { spacing: string; active: boolean }>> {
  try {
    const content = await readFile('.gitignore')
    return parseGitignore(content)
  } catch {
    return {}
  }
}
