import { log } from '@shared/log'

export function makeCallback(params?: {
  initialContent?: Record<string, { spacing: string; active: boolean }>
  generatedContent?: Record<string, { spacing: string; active: boolean }>
}): Record<string, { spacing: string; active: boolean }> | undefined {
  const initialEntries = params!.initialContent!
  const generatedEntries = params!.generatedContent!

  const originalSpacing = Object.fromEntries(
    Object.entries(initialEntries).map(([key, entry]) => [key, entry.spacing]),
  )
  Object.values(initialEntries).forEach((entry) => {
    entry.spacing = ''
  })

  const mergedEntries = { ...initialEntries, ...generatedEntries }
  if (JSON.stringify(initialEntries) !== JSON.stringify(mergedEntries)) {
    Object.entries(mergedEntries).forEach(([key, entry]) => {
      if (originalSpacing[key]) entry.spacing = originalSpacing[key]
    })

    log('.gitignore updated')

    return mergedEntries
  }

  return undefined
}
