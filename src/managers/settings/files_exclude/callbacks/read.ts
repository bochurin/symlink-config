import { SETTINGS } from '@shared/constants'
import { readSettings } from '@shared/settings-ops'

export function readCallback(): Record<string, boolean> {
  const filesExclude = readSettings(
    `${SETTINGS.FILES.SECTION}.${SETTINGS.FILES.EXCLUDE}`,
    {} as Record<string, boolean>,
  )

  return filesExclude
}
