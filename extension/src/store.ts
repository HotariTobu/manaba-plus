import { createStore } from "@/utils/createStore";

export const [o] = await createStore(import.meta.dirname, {
  /** The url of top page */
  rootUrl: ''
})

export const [localStore] = await createStore(import.meta.dirname, {
  /** Notifications shown in the top page */
  notifications: [] as string[]
}, 'local')

export const pushNotification = (notification: string) => {
  localStore.notifications = localStore.notifications.concat(notification)
}

export const popNotifications = () => {
  const {notifications} = localStore
  localStore.notifications = []
  return notifications
}
