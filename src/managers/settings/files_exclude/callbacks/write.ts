import { writeSettings } from '@shared/settings-ops'
import { SETTINGS } from '@shared/constants'
import { log } from '@/src/shared/log'

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
