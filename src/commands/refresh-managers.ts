import { initManagers } from '../extension/init-managers'
import { log } from '../shared/state'

export async function refreshManagers() {
  log('Manual refresh triggered')
  await initManagers()
}
