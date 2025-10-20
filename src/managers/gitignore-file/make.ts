import { assembleGitignore } from '@shared/gitignore-ops'
import { generate } from './generate'
import { read } from './read'
import { log } from '@shared/log'
import { write } from './write'
import { GitignoringPart } from './enums'

export async function make(mode?: GitignoringPart) {
  const generatedEntries = await generate(mode ?? GitignoringPart.All)

  const currentEntries = await read()
  const originalSpacing = Object.fromEntries(
    Object.entries(currentEntries).map(([key, entry]) => [key, entry.spacing]),
  )
  Object.values(currentEntries).forEach((entry) => {
    entry.spacing = ''
  })

  const mergedEntries = { ...currentEntries, ...generatedEntries }
  if (JSON.stringify(currentEntries) !== JSON.stringify(mergedEntries)) {
    Object.entries(mergedEntries).forEach(([key, entry]) => {
      if (originalSpacing[key]) entry.spacing = originalSpacing[key]
    })

    const content = assembleGitignore(mergedEntries)
    await write(content)
    log('.gitignore updated')
  }
}
