import { generate } from './generate'
import { read } from './read'

export async function needsRegenerate(): Promise<boolean> {
  try {
    const generated = await generate()
    const fromFile = read()
    return generated !== fromFile
  } catch {
    return true
  }
}