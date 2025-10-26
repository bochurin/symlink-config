export function makeCallback(params?: {
  initialContent?: Record<string, boolean>
  generatedContent?: Record<string, boolean>
}): Record<string, boolean> | undefined {
  const initialExclusions = params!.initialContent!
  const generatedExclusions = params!.generatedContent!

  const mergedExclusions = { ...initialExclusions, ...generatedExclusions }

  if (JSON.stringify(initialExclusions) !== JSON.stringify(mergedExclusions)) {
    return mergedExclusions
  }

  return undefined
}
