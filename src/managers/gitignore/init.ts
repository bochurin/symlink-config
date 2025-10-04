import { handleEvent } from './handle-event'

export async function init() {
  await handleEvent('inited')
}
