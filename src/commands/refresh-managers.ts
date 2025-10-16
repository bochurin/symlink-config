import { managersInit } from '../extension/managers-init'
import { log } from '../shared/state'

export async function refreshManagers() {
  log('Manual refresh triggered')
  await managersInit(true)
}
