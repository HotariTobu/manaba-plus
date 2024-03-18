import type { StorageItem } from "@/types/storageItem";
import { StorageArea, sync, useStorage } from "./useStorage";

export type StoreItem = StorageItem | Map<string | number, StorageItem> | Set<string | number>
export type Store = Record<string, StoreItem>

export interface DynamicStoreItem<V extends StoreItem> {
  has(key: string): boolean
  get(key: string): V
  set(key: string, value: V): void
}

export type DynamicStore<T extends Store> = {
  readonly [V in keyof T]: DynamicStoreItem<T[V]>
}

type ClearStore = () => void

/**
 * Create a store.
 * The store is an interface to save values and load from the specific storage.
 * @param prefix The prefix prepended to the keys of the storage
 * @param defaultValues The default values of the store
 * @param area Where the store I/O values
 */
export const createStore = async <T extends Store>(prefix: string, defaultValues: T, area: StorageArea = sync): Promise<[T, ClearStore]> => {
  const storage = await useStorage(area)

  const keys = Object.keys(defaultValues)
  const prefixedKeys = keys.map(key => prefix + key)

  const storeBase = {}

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const prefixedKey = prefixedKeys[index]
    const defaultValue = defaultValues[key]

    if (defaultValue instanceof Map) {
      Object.defineProperty(storeBase, key, {
        get: () => {
          const entries = storage.get(prefixedKey, defaultValue as never)
          return new Map(entries)
        },
        set: (value: typeof defaultValue) => {
          const entries = Array.from(value)
          storage.set(prefixedKey, entries)
        },
      })
    }
    else if (defaultValue instanceof Set) {
      Object.defineProperty(storeBase, key, {
        get: () => {
          const items = storage.get(prefixedKey, defaultValue as never)
          return new Set(items)
        },
        set: (value: typeof defaultValue) => {
          const items = Array.from(value)
          storage.set(prefixedKey, items)
        },
      })
    }
    else {
      Object.defineProperty(storeBase, key, {
        get: () => {
          return storage.get(prefixedKey, defaultValue)
        },
        set: (value: typeof defaultValue) => {
          storage.set(prefixedKey, value)
        },
      })
    }
  }

  /** A store */
  const store = storeBase as T

  /** Remove all store values to the defaults */
  const clearStore = () => storage.remove(...prefixedKeys)

  return [store, clearStore]
}

/**
 * Create a dynamic store.
 * The dynamic store is a store that has map-like objects as properties and the user can add values dynamically.
 * The default values are returned as values of the maps.
 * @param prefix The prefix prepended to the keys of the storage
 * @param defaultValues The default values of the store
 * @param area Where the store I/O values
 */
export const createDynamicStore = async <T extends Store>(prefix: string, defaultValues: T, area: StorageArea = sync): Promise<[DynamicStore<T>, ClearStore]> => {
  const storage = await useStorage(area)

  const keys = Object.keys(defaultValues)
  const prefixedKeys = keys.map(key => prefix + key)

  const storeBase: Record<string, DynamicStoreItem<StoreItem>> = {}

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const prefixedKey = prefixedKeys[index]
    const defaultValue = defaultValues[key]

    const has = (subKey: string) => {
      return storage.has(prefixedKey + subKey)
    }

    if (defaultValue instanceof Map) {
      storeBase[key] = {
        has,
        get: (subKey) => {
          const entries = storage.get(prefixedKey + subKey, defaultValue as never)
          return new Map(entries)
        },
        set: (subKey, value: typeof defaultValue) => {
          const entries = Array.from(value)
          storage.set(prefixedKey + subKey, entries)
        },
      }
    }
    else if (defaultValue instanceof Set) {
      storeBase[key] = {
        has,
        get: (subKey) => {
          const items = storage.get(prefixedKey + subKey, defaultValue as never)
          return new Set(items)
        },
        set: (subKey, value: typeof defaultValue) => {
          const items = Array.from(value)
          storage.set(prefixedKey + subKey, items)
        },
      }
    }
    else if (Array.isArray(defaultValue)) {
      storeBase[key] = {
        has,
        get: (subKey) => {
          const items = storage.get(prefixedKey + subKey, defaultValue)
          return [...items]
        },
        set: (subKey, value: typeof defaultValue) => {
          storage.set(prefixedKey + subKey, value)
        },
      }
    }
    else if (typeof defaultValue === 'object' && defaultValue !== null) {
      storeBase[key] = {
        has,
        get: (subKey) => {
          const entries = storage.get(prefixedKey + subKey, defaultValue)
          return { ...entries }
        },
        set: (subKey, value: typeof defaultValue) => {
          storage.set(prefixedKey + subKey, value)
        },
      }
    }
    else {
      storeBase[key] = {
        has,
        get: (subKey) => {
          return storage.get(prefixedKey + subKey, defaultValue)
        },
        set: (subKey, value: typeof defaultValue) => {
          storage.set(prefixedKey + subKey, value)
        },
      }
    }
  }

  const store = storeBase as DynamicStore<T>

  const clearStore = () => storage.remove(...storage.getAllKeys().filter(key => {
    for (const prefixedKey of prefixedKeys) {
      if (key.startsWith(prefixedKey)) {
        return true
      }
    }
    return false
  }))

  return [store, clearStore]
}
