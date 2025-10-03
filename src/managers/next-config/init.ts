import { handleFileEvent } from './handle-file-event'
import { memo } from './memo'

export function init() {
  memo()
  handleFileEvent('change')
}
