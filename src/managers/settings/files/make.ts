import { ExclusionPart } from './enums'

export async function make(params?: {
  mode?: ExclusionPart
}): Promise<undefined> {
  const mode = params ? params.mode : undefined
  if (!mode) return
}
