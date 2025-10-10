import { handleEvent } from './handle-event'
import { FileEvent } from './types'

export async function init() {
  await handleEvent(FileEvent.Modified)
}
