import browser from "webextension-polyfill";
import type { StorageItem } from "@/types/storageItem";

/** Has a behavior like the web extension API storage areas */
export interface StorageAreaLike {
  get(keys?: null | string | string[] | Record<string, unknown>): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
}

export const local = browser.storage.local
export const managed = browser.storage.managed
export const session = browser.storage.session
export const sync = browser.storage.sync

/** Preset storage areas */
const areas = {
  local,
  managed,
  session,
  sync,
}

/** Reference a storage area */
export type StorageArea = StorageAreaLike | keyof typeof areas

/** A map of storages and their values for cache */
const valuesMap = new Map<StorageAreaLike, Record<string, unknown | undefined>>()

/**
 * Provide some methods to interact with a storage area synchronously.
 * @param area The storage area to use
 * @returns Methods bound to the storage area
 */
export const useStorage = async (area: StorageArea = sync) => {
  const storage = typeof area === 'string' ? areas[area] : area

  const values = valuesMap.get(storage) ?? await storage.get()
  if (!valuesMap.has(storage)) {
    valuesMap.set(storage, values)
  }

  /**
   * Determine a value specified by a key exists.
   * @param key The key
   * @returns True if the value exists, otherwise false
   */
  const has = (key: string) => key in values

  /**
   * Get a value from the storage with a specific key.
   * @param key The key to identifying the value
   * @param value The default value returned when the value is not stored
   * @returns The value if it is stored, otherwise `defaultValue`
   */
  const get = <T extends StorageItem>(key: string, defaultValue: T) => {
    if (key in values) {
      return values[key] as T
    }
    else {
      return defaultValue
    }
  }

  /**
   * Set a value to the storage with a specific key.
   * @param key The key to identifying the value
   * @param value The value to be stored
   */
  const set = <T extends StorageItem>(key: string, value: T) => {
    values[key] = value
    storage.set({ [key]: value })
  }

  /**
   * Remove value(s) from the storage with specific key(s).
   * @param keys The keys to remove values
   */
  const remove = (...keys: string[]) => {
    for (const key of keys) {
      delete values[key]
    }
    storage.remove(keys)
  }

  /**
   * Remove all values from the storage.
   */
  const clear = () => {
    const keys = Object.keys(values)
    remove(...keys)
  }

  /**
   * Get all keys in values.
   * @returns All keys in values
   */
  const getAllKeys = () => {
    return Object.keys(values)
  }

  return {
    has,
    get,
    set,
    remove,
    clear,
    getAllKeys,
  }
}
