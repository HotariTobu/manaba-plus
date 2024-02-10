import { o } from '@/stores/options'
import version from './version'
import * as download from './download'

/**
 * Push some notifications if they are allowed.
 */
export default async function () {
  if (o.mainPanel.messages.notifyVersion.value) {
    await version()
  }

  if (
    o.mainPanel.messages.downloadInterval.value.toString() !== ''
  ) {
    await download.pushMessage()
  }
}
