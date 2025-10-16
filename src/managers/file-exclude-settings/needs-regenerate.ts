import { SettingsEvent } from '../../shared/hooks/use-settings-watcher'
import { log } from '../../shared/state'
import { generate } from './generate'
import { read } from './read'

export function needsRegenerate(event?: SettingsEvent): boolean {
  const result = true //TODO: really check if it is needed to regenerate it

  log(
    `files.exclude needsRegenerate: event=${event || 'none'}, result=${result}`,
  )
  return result
}
