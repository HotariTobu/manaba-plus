import browser from "webextension-polyfill";
import type { StorageItem } from "@/types/storageItem";

export const local = browser.storage.local
export const managed = browser.storage.managed
export const session = browser.storage.session
export const sync = browser.storage.sync

type Value = StorageItem | Map<StorageItem, StorageItem>

export const createStore = async <T extends Record<string, Value>>(prefix: string, defaultValues: T, area = sync) => {
  const keys = Object.keys(defaultValues)
  const prefixedKeys = keys.map(key => prefix + key)

  const prefixedValues = await area.get(prefixedKeys)

  const store = {}

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const prefixedKey = prefixedKeys[index]
    const defaultValue = defaultValues[key]

    if (typeof prefixedValues[prefixedKey] === 'undefined') {
      prefixedValues[prefixedKey] = defaultValue
    }

    let storeValue: (value: never) => void

    if (defaultValue instanceof Map) {
      const value = prefixedValues[prefixedKey]
      prefixedValues[prefixedKey] = new Map(value)

      storeValue = (value: typeof defaultValue) => {
        const entries = Array.from(value.entries())
        area.set({ [prefixedKey]: entries })
      }
    }
    else {
      storeValue = (value: typeof defaultValue) => {
        area.set({ [prefixedKey]: value })
      }
    }

    Object.defineProperty(store, key, {
      get() {
        return prefixedValues[prefixedKey]
      },
      set(value: never) {
        prefixedValues[prefixedKey] = value
        storeValue(value)
      },
    })
  }

  return store as T
}
