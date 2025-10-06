import { writeFile } from '../../shared/file-ops'
import { assembleGitignore } from '../../shared/gitignore-ops'
import { generate } from './generate'
import { read } from './read'

export async function make() {
  const records = await generate()
  const content = assembleGitignore(records)
  const currentEntries = await read()
  if (JSON.stringify(currentEntries) !== JSON.stringify(records))
    await writeFile('.gitignore', content)
}
