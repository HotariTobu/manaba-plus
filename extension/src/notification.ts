import browser from "webextension-polyfill";

const storageKey = 'notifications'

export const pushNotification = async (notification: string) => {
  const notifications = await popNotifications()
  notifications.add(notification)
  await browser.storage.local.set({
    [storageKey]: Array.from(notifications),
  })
}

export const popNotifications = async () => {
  const pairs = await browser.storage.local.get({ [storageKey]: [] })
  await browser.storage.local.remove(storageKey)
  return new Set<string>(pairs[storageKey])
}
