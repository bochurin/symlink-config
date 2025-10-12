import { needsRegenerate } from './needs-regenerate'
import { make } from './make'

export async function handleEvent(action: string) {
  if (await needsRegenerate()) {
    await make()
  }
}