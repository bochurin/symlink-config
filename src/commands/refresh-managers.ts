import { managersInit } from '@extension'
import { log } from '@log'

export async function refreshManagers() {
  log('Manual refresh triggered')
  await managersInit(true)
}
