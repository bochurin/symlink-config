import { log } from '@log'
import { SETTINGS } from '@shared/constants'
import { writeSettings } from '@shared/settings-ops'

export async function writeCallback(params?: {
  content?: Record<string, boolean>
}) {
  const exclude = params!.content!

  await writeSettings(
    `${SETTINGS.FILES.SECTION}.${SETTINGS.FILES.EXCLUDE}`,
    exclude,
  )
  log(`${SETTINGS.FILES.SECTION}.${SETTINGS.FILES.EXCLUDE} settings updated`)
}
