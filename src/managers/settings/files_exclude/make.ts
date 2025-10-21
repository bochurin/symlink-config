export async function make(params?: {
  initialContent?: Record<string, boolean>
  generatedContent?: Record<string, boolean>
}): Promise<Record<string, boolean> | undefined> {
  const initialExclusions = params!.initialContent!
  const generatedExclusions = params!.generatedContent!
  const mergedExclusions = { ...initialExclusions, ...generatedExclusions }
  if (JSON.stringify(initialExclusions) != JSON.stringify(mergedExclusions)) {
    return mergedExclusions
  }
  return undefined
}
