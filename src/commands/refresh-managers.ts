import { managersInit } from '@extension'
import { log } from '@shared/log'

export async function refreshManagers() {
  log('Manual refresh triggered')
  await managersInit(true)
}
