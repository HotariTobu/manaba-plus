import browser, { Storage } from "webextension-polyfill";
import { StorageItem } from "@/types/storageItem";

export const local = browser.storage.local
export const managed = browser.storage.managed
export const session = browser.storage.session
export const sync = browser.storage.sync

type Area = Storage.StorageArea

/**
 * Set data to local storage with a specific key.
 * @param key The key to identifying the data
 * @param value The data to be stored
 */
export const set = async function <T extends StorageItem>(area: Area, key: string, value: T) {
  await area.set({ [key]: value })
}

/**
 * Get data from local storage with a specific key.
 * @param key The key to identifying the data
 * @param value The default value returned when the data is not stored
 * @returns The data if it is stored, otherwise `defaultValue`
 */
export const get = async function <T extends StorageItem>(area: Area, key: string, defaultValue: T) {
  const pairs = await area.get({ [key]: defaultValue })
  return pairs[key] as T
}
