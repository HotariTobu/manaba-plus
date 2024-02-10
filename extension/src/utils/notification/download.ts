import { o } from '@/stores/options'
import * as time from '@/utils/time'
import { pushMessages } from '@/stores/messages'
import { t } from '@/composables/useT9n'

const storageKey = 'last-download-date'

/**
 * Set the current time number of `Date.now()` to the storage.
 */
export const updateDate = async function () {
  await chrome.storage.local.set({ [storageKey]: Date.now() })
}

/**
 * Get the last download time from the storage.
 * @returns The time number of `Date.now()`
 */
export const getLastDate = async function () {
  const pairs = await chrome.storage.local.get({ [storageKey]: null })
  return pairs[storageKey] as number
}

/**
 * Push a message to prompt downloading if the days count from the last download day is long.
 */
export const pushMessage = async function () {
  const lastDate = await getLastDate()
  if (lastDate === null) {
    return
  }

  const dayCount = time.dayCount(Date.now() - lastDate)
  if (dayCount > o.mainPanel.messages.downloadInterval.value) {
    await pushMessages(
      t.logMessages.download.replace('$dayCount$', Math.floor(dayCount).toString()),
    )
  }
}
