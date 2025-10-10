import { handleEvent } from './handle-event'
import { FileEvent } from '../shared/types'

export async function init() {
  await handleEvent(FileEvent.Modified)
}
