import { writeFile } from '../../shared/file-ops'
import { assembleGitignore } from '../../shared/gitignore-ops'
import { generate } from './generate'
import { read } from './read'

export async function make() {
  const { log } = await import('../../shared/state')
  const currentEntries = await read()
  const originalSpacing = Object.fromEntries(
    Object.entries(currentEntries).map(([key, entry]) => [key, entry.spacing])
  )
  Object.values(currentEntries).forEach((entry) => {
    entry.spacing = ''
  })

  const generatedEntries = await generate()
  const mergedEntries = { ...currentEntries, ...generatedEntries }
  if (JSON.stringify(currentEntries) !== JSON.stringify(mergedEntries)) {
    Object.entries(mergedEntries).forEach(([key, entry]) => {
      if (originalSpacing[key]) entry.spacing = originalSpacing[key]
    })

    const content = assembleGitignore(mergedEntries)
    await writeFile('.gitignore', content)
    log('.gitignore updated')
  }
}
