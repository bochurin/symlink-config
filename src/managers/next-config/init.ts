import { buildNextConfig } from './build-next-config'
import { handleFileEvent } from './handle-file-event'
import * as state from '../../shared/state'

export async function init() {
  const config = buildNextConfig()
  state.setNextConfig(config)
  await handleFileEvent('change')
}
