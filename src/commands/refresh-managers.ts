import { managersInit } from '../extension/managers-init'
import { log } from '../shared/log'

export async function refreshManagers() {
  log('Manual refresh triggered')
  await managersInit(true)
}
