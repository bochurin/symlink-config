import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(): boolean {
  try {
    const generated = generate()
    const fromFile = read()
    return generated !== fromFile
  } catch {
    return true
  }
}