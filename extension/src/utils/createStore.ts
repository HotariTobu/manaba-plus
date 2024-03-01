import type { StorageItem } from "@/types/storageItem";
import { StorageArea, sync, useStorage } from "./useStorage";

export type StoreItem = StorageItem | Map<StorageItem, StorageItem>
export type Store = Record<string, StoreItem>

export interface DynamicStoreItem<V extends StoreItem> {
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
  const { get, set, remove } = await useStorage(area)

  const keys = Object.keys(defaultValues)
  const prefixedKeys = keys.map(key => prefix + key)

  const storeBase = {}

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const prefixedKey = prefixedKeys[index]
    const defaultValue = defaultValues[key]

    if (defaultValue instanceof Map) {
      Object.defineProperty(storeBase, key, {
        get() {
          const entries = get(prefixedKey, defaultValue as never)
          return new Map(entries)
        },
        set(value: typeof defaultValue) {
          const entries = Array.from(value.entries())
          set(prefixedKey, entries)
        },
      })
    }
    else {
      Object.defineProperty(storeBase, key, {
        get() {
          return get(prefixedKey, defaultValue)
        },
        set(value: typeof defaultValue) {
          set(prefixedKey, value)
        },
      })
    }
  }

  /** A store */
  const store = storeBase as T

  /** Remove all store values to the defaults */
  const clearStore = () => remove(...prefixedKeys)

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
  const { get, set, remove, getAllKeys } = await useStorage(area)

  const keys = Object.keys(defaultValues)
  const prefixedKeys = keys.map(key => prefix + key)

  const storeBase: Record<string, DynamicStoreItem<StoreItem>> = {}

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const prefixedKey = prefixedKeys[index]
    const defaultValue = defaultValues[key]

    if (defaultValue instanceof Map) {
      storeBase[key] = {
        get(subKey) {
          const entries = get(prefixedKey + subKey, defaultValue as never)
          return new Map(entries)
        },
        set(subKey, value: typeof defaultValue) {
          const entries = Array.from(value.entries())
          set(prefixedKey + subKey, entries)
        },
      }
    }
    else {
      storeBase[key] = {
        get(subKey) {
          return get(prefixedKey + subKey, defaultValue)
        },
        set(subKey, value: typeof defaultValue) {
          set(prefixedKey + subKey, value)
        },
      }
    }
  }

  const store = storeBase as DynamicStore<T>

  const clearStore = () => remove(...getAllKeys().filter(key => {
    for (const prefixedKey of prefixedKeys) {
      if (key.startsWith(prefixedKey)) {
        return true
      }
    }
    return false
  }))

  return [store, clearStore]
}
