import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(): boolean {
  const generated = generate()
  const current = read()

  return current !== generated
}
