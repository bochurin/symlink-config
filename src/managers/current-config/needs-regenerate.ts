import { log } from '../../shared/state'
import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(): boolean {
  try {
    const generated = generate()
    const fromFile = read()
    const result = generated !== fromFile
    log(`current-config needsRegenerate: result=${result}`)
    return result
  } catch (error) {
    log(`current-config needsRegenerate: error=${error}, result=true`)
    return true
  }
}